// Main plugin controller - runs in Figma's plugin sandbox.

type ThemePreference = "light" | "dark";

type WindowSize = {
  w: number;
  h: number;
};

type VariableDescriptionData = {
  id: string;
  name: string;
  description: string;
};

type CollectionDescriptionData = {
  collectionId: string;
  collectionName: string;
  variables: VariableDescriptionData[];
};

type LoadVariablesMessage = {
  type: "load-variables";
};

type ResizeMessage = {
  type: "resize";
  size: WindowSize;
};

type PersistSizeMessage = {
  type: "persist-size";
};

type ThemeChangeMessage = {
  type: "theme-change";
  theme: ThemePreference;
};

type ApplyChangesMessage = {
  type: "apply-changes";
  variableIds: string[];
  action: "clear" | "set";
  newDescription?: string;
};

type CloseMessage = {
  type: "close";
};

type PluginMessage =
  | LoadVariablesMessage
  | ResizeMessage
  | PersistSizeMessage
  | ThemeChangeMessage
  | ApplyChangesMessage
  | CloseMessage;

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function isWindowSize(value: unknown): value is WindowSize {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<WindowSize>;
  return typeof candidate.w === "number" && typeof candidate.h === "number";
}

function isThemePreference(value: unknown): value is ThemePreference {
  return value === "light" || value === "dark";
}

function clampSize(size: WindowSize): WindowSize {
  const minWidth = 900;
  const minHeight = 600;

  return {
    w: Math.max(minWidth, size.w),
    h: Math.max(minHeight, size.h),
  };
}

let currentWindowSize: WindowSize = { w: 1280, h: 720 };
let windowSizePersistTimer: any = null;

function persistWindowSize() {
  figma.clientStorage.setAsync("windowSize", currentWindowSize).catch(() => {});
}

function scheduleWindowSizePersist() {
  if (windowSizePersistTimer !== null) {
    clearTimeout(windowSizePersistTimer);
  }

  windowSizePersistTimer = setTimeout(() => {
    windowSizePersistTimer = null;
    persistWindowSize();
  }, 250);
}

function persistWindowSizeNow() {
  if (windowSizePersistTimer !== null) {
    clearTimeout(windowSizePersistTimer);
    windowSizePersistTimer = null;
  }

  persistWindowSize();
}

figma.showUI(__html__, { width: 1280, height: 720, themeColors: true });

figma.clientStorage.getAsync("windowSize").then((size: unknown) => {
  if (isWindowSize(size)) {
    const nextSize = clampSize(size);
    currentWindowSize = nextSize;
    figma.ui.resize(nextSize.w, nextSize.h);
  }
}).catch(() => {});

figma.clientStorage.getAsync("theme").then((theme: unknown) => {
  if (isThemePreference(theme)) {
    figma.ui.postMessage({
      type: "theme-loaded",
      theme,
    });
  }
}).catch(() => {});

async function loadVariables(): Promise<void> {
  try {
    const collections = await figma.variables.getLocalVariableCollectionsAsync();
    const allVariables = await figma.variables.getLocalVariablesAsync();

    const data: CollectionDescriptionData[] = collections.map((collection) => {
      const variablesInCollection = allVariables.filter(
        (variable) => variable.variableCollectionId === collection.id
      );

      return {
        collectionId: collection.id,
        collectionName: collection.name,
        variables: variablesInCollection.map((variable) => ({
          id: variable.id,
          name: variable.name,
          description: variable.description || "",
        })),
      };
    });

    figma.ui.postMessage({
      type: "variables-loaded",
      data,
    });
  } catch (error) {
    figma.ui.postMessage({
      type: "error",
      message: "Failed to load variables: " + getErrorMessage(error),
    });
  }
}

async function applyChanges(msg: ApplyChangesMessage): Promise<void> {
  try {
    const { variableIds, action, newDescription } = msg;

    if (!variableIds || variableIds.length === 0) {
      figma.ui.postMessage({
        type: "status",
        message: "No variables selected.",
        isError: true,
      });
      return;
    }

    let updatedCount = 0;

    for (const variableId of variableIds) {
      const variable = await figma.variables.getVariableByIdAsync(variableId);
      if (!variable) continue;

      if (action === "clear") {
        variable.description = "";
      } else if (action === "set") {
        variable.description = newDescription || "";
      }
      updatedCount++;
    }

    figma.ui.postMessage({
      type: "status",
      message: `${updatedCount} variable${updatedCount !== 1 ? "s" : ""} updated successfully.`,
      isError: false,
    });

    await loadVariables();
  } catch (error) {
    figma.ui.postMessage({
      type: "error",
      message: "Failed to update variables: " + getErrorMessage(error),
    });
  }
}

figma.ui.onmessage = async (msg: PluginMessage) => {
  switch (msg.type) {
    case "load-variables":
      await loadVariables();
      break;

    case "resize": {
      const nextSize = clampSize(msg.size);
      currentWindowSize = nextSize;
      figma.ui.resize(nextSize.w, nextSize.h);
      scheduleWindowSizePersist();
      break;
    }

    case "persist-size":
      persistWindowSizeNow();
      break;

    case "theme-change":
      figma.clientStorage.setAsync("theme", msg.theme);
      break;

    case "apply-changes":
      await applyChanges(msg);
      break;

    case "close":
      figma.closePlugin();
      break;
  }
};

loadVariables();
