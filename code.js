// Main plugin controller - runs in Figma's plugin sandbox

// Show the UI
figma.showUI(__html__, { width: 500, height: 600, themeColors: true });

// Restore previous size and theme
figma.clientStorage.getAsync('windowSize').then(size => {
  if (size) {
    figma.ui.resize(size.w, size.h);
  }
}).catch(() => {});

figma.clientStorage.getAsync('theme').then(theme => {
  if (theme) {
    figma.ui.postMessage({
      type: 'theme-loaded',
      theme: theme
    });
  }
}).catch(() => {});

// Load all variables and send to UI
async function loadVariables() {
  try {
    const collections = await figma.variables.getLocalVariableCollectionsAsync();
    const allVariables = await figma.variables.getLocalVariablesAsync();
    
    // Organize variables by collection
    const data = collections.map(collection => {
      const variablesInCollection = allVariables.filter(
        variable => variable.variableCollectionId === collection.id
      );
      
      return {
        collectionId: collection.id,
        collectionName: collection.name,
        variables: variablesInCollection.map(v => ({
          id: v.id,
          name: v.name,
          description: v.description || ''
        }))
      };
    });
    
    figma.ui.postMessage({
      type: 'variables-loaded',
      data: data
    });
  } catch (error) {
    figma.ui.postMessage({
      type: 'error',
      message: 'Failed to load variables: ' + error.message
    });
  }
}

// Handle messages from UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'load-variables') {
    await loadVariables();
  }
  
  if (msg.type === 'resize') {
    const minWidth = 400;
    const minHeight = 400;
    const maxWidth = 1200;
    const maxHeight = 1200;
    
    const width = Math.max(minWidth, Math.min(maxWidth, msg.size.w));
    const height = Math.max(minHeight, Math.min(maxHeight, msg.size.h));
    
    figma.ui.resize(width, height);
    
    // Save size for next time
    figma.clientStorage.setAsync('windowSize', { w: width, h: height });
  }
  
  if (msg.type === 'theme-change') {
    figma.clientStorage.setAsync('theme', msg.theme);
  }
  
  if (msg.type === 'apply-changes') {
    try {
      const { variableIds, action, newDescription } = msg;
      
      if (!variableIds || variableIds.length === 0) {
        figma.ui.postMessage({
          type: 'status',
          message: 'No variables selected.',
          isError: true
        });
        return;
      }
      
      let updatedCount = 0;
      
      for (const varId of variableIds) {
        const variable = await figma.variables.getVariableByIdAsync(varId);
        if (variable) {
          if (action === 'clear') {
            variable.description = '';
          } else if (action === 'set') {
            variable.description = newDescription || '';
          }
          updatedCount++;
        }
      }
      
      figma.ui.postMessage({
        type: 'status',
        message: `${updatedCount} variable${updatedCount !== 1 ? 's' : ''} updated successfully.`,
        isError: false
      });
      
      // Reload variables to refresh the UI
      await loadVariables();
      
    } catch (error) {
      figma.ui.postMessage({
        type: 'error',
        message: 'Failed to update variables: ' + error.message
      });
    }
  }
  
  if (msg.type === 'close') {
    figma.closePlugin();
  }
};

// Initial load
loadVariables();