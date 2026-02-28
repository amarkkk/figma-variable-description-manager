# Variable Descriptions Manager

> Bulk clear or update descriptions across multiple variables at once.

![Status: Stable](https://img.shields.io/badge/status-stable-green)

**Privacy:** This plugin runs entirely locally. No data is sent to external servers (`networkAccess: { allowedDomains: ["none"] }`).

## Features

- **Bulk Operations** - Clear or set descriptions for multiple variables at once
- **Collection-Based Organization** - Variables grouped by collection for easy navigation
- **Smart Filtering** - Show only variables with existing descriptions
- **Flexible Selection** - Select individual variables, entire collections, or all variables
- **Overwrite Protection** - Get confirmation before overwriting existing descriptions
- **Resizable Window** - Drag the corner to resize; size is remembered between sessions
- **Dark/Light Theme** - Toggle theme; preference is saved between sessions

## Installation

1. Clone or download this repository
2. In Figma Desktop: **Plugins → Development → Import plugin from manifest**
3. Select the `manifest.json` file from this folder

> **Note:** This plugin currently uses plain JavaScript — no build step required. TypeScript migration is planned.

## Usage

1. Open the plugin from **Plugins → Development → Variable Descriptions Manager**
2. Browse your variables organized by collection
3. Select variables to modify:
   - Click individual checkboxes for specific variables
   - Click collection checkboxes to select all variables in that collection
   - Use "Select All" to select every variable
4. Choose an action:
   - **Clear all descriptions** - Remove descriptions from selected variables
   - **Set description to** - Apply a custom description to all selected variables
5. Click **Apply Changes**

**Tip:** Use the "Show only variables with descriptions" filter to focus on variables that already have descriptions.

## Screenshots

<!-- Screenshots will be added in Chapter 11 -->

## Known Limitations

- No search functionality within the plugin
- No pattern-based operations (e.g., auto-generate descriptions from variable names)
- Remote/library variables are not supported (local variables only)

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and release notes.

## License

[MIT](./LICENSE)

## Author

Created by [Mark Andrassy](https://github.com/amarkkk)

---

**Part of the [Figma Variable Tools](https://github.com/amarkkk) suite:**

| Plugin | Description |
|--------|-------------|
| [Variable to CSS](https://github.com/amarkkk/figma-variable-to-css) | Export variables to fluid CSS with clamp() scaling |
| [Variable Mover](https://github.com/amarkkk/figma-variable-mover) | Move variables between collections preserving aliases |
| [Variable Remapper](https://github.com/amarkkk/figma-variable-remapper) | Bulk find-and-replace variable bindings |
| [Variable Import/Export](https://github.com/amarkkk/figma-variable-import-export) | CSV/JSON export for spreadsheet editing + re-import |
| **Variable Description Manager** | Bulk clear/update variable descriptions |
| [Variable Network](https://github.com/amarkkk/figma-variable-network) | Visualize token alias chains and component usage |
