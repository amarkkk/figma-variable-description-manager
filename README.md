# Variable Descriptions Manager

> Bulk clear or update descriptions across multiple variables at once.

> **⚠️ Development Status**: This plugin is currently in development and not yet published to the Figma Community. Follow the installation instructions below to use it locally.

> **🔒 Privacy**: This plugin operates entirely locally. No data is sent to external servers (`networkAccess: { allowedDomains: ["none"] }`).

## Use Case

When building design systems, you often create variable families by duplicating scoped variables. Descriptions get inherited when duplicating, which clutters Figma's search functionality with irrelevant matches. Cleaning them up one by one is tedious.

**The solution:** This plugin lets you bulk-clear or bulk-update descriptions across multiple variables at once.

**Example scenarios:**
- Clear inherited descriptions from duplicated variables
- Set consistent descriptions across an entire collection
- Review which variables have descriptions and clean up clutter

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
2. In Figma Desktop: **Plugins -> Development -> Import plugin from manifest**
3. Select the `manifest.json` file from this folder

## Usage

1. Open the plugin from **Plugins -> Development -> Variable Descriptions Manager**
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

<!-- Add screenshots here -->

## Known Limitations

- No search functionality within the plugin
- No pattern-based operations (e.g., auto-generate descriptions from variable names)
- Remote/library variables are not supported (local variables only)

## License

MIT

## Author

Created by [Márk Andrássy](https://github.com/amarkkk)

Part of a collection of Figma plugins for design token management.
