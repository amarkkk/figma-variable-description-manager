# Variable Descriptions Manager

A lightweight Figma plugin for managing descriptions across multiple variables at once. Quickly clear, set, or update descriptions for your entire design system's variables in bulk.

> **⚠️ Development Status**: This plugin is currently in development and not yet published to the Figma Community. Follow the installation instructions below to use it locally.

## Why This Plugin?

When building design systems with variables, you often create variable families by duplicating scoped variables. For example, when setting up a spacing scale or type ramp, you might start with one variable that has a description, then duplicate it multiple times to create variants.

**The problem:** Descriptions get inherited when duplicating variables. This becomes an issue because:
- Figma's search functionality searches through variable descriptions
- Inherited descriptions can clutter search results with irrelevant matches
- Cleaning them up one by one is tedious and time-consuming

**The solution:** This plugin lets you bulk-clear or bulk-update descriptions across multiple variables at once, keeping your variable search clean and your workflow efficient.

## Features

- **Bulk Operations**: Clear or set descriptions for multiple variables at once
- **Collection-Based Organization**: Variables are grouped by their collections for easy navigation
- **Smart Filtering**: Show only variables with existing descriptions
- **Flexible Selection**: Select individual variables, entire collections, or all variables at once
- **Overwrite Protection**: Get confirmation before overwriting existing descriptions
- **Resizable Window**: Drag the bottom-right corner to resize the plugin to your preference
- **Persistent Settings**: Window size and theme preferences are saved between sessions
- **Completely Local**: No network access required - all operations happen locally in Figma

## Screenshots

<p align="center">
  <img width="977" alt="Screenshot 2025-12-02 at 11 55 22" src="https://github.com/user-attachments/assets/f0f0838f-2203-4d30-b1a4-79c6cb2e2649" />
</p>

<p align="center">
  <img width="977" alt="Screenshot 2025-12-02 at 11 54 55" src="https://github.com/user-attachments/assets/554c9f0c-2967-4367-acf1-8266f0be6e03" />
</p>

<p align="center">
  <img width="977" alt="Screenshot 2025-12-02 at 11 54 31" src="https://github.com/user-attachments/assets/121d8a8a-ad0b-48b4-92b8-b6ce2b7640e1" />
</p>

<p align="center">
  <img width="977" alt="Screenshot 2025-12-02 at 11 54 14" src="https://github.com/user-attachments/assets/337636ea-1b6f-4085-871a-2cd9a053ea55" />
</p>

<p align="center">
  <img width="977" alt="Screenshot 2025-12-02 at 11 54 01" src="https://github.com/user-attachments/assets/09e84d59-dd2f-42c7-89d9-a63b74c6d0ce" />
</p>

## Installation

Since this plugin is not yet published, you'll need to install it manually:

1. **Download or clone this repository** to your local machine

2. **Open Figma Desktop** (the plugin requires the desktop app for development mode)

3. **Import the plugin**:
   - Go to `Menu → Plugins → Development → Import plugin from manifest...`
   - Navigate to the folder where you downloaded this repository
   - Select the `manifest.json` file

4. **Run the plugin**:
   - Go to `Menu → Plugins → Development → Variable Descriptions Manager`

The plugin will now appear in your development plugins list and can be run in any Figma file.

## Usage

### Basic Workflow

1. **Open the plugin** from the Plugins menu
2. **Browse your variables** organized by collection
3. **Select variables** you want to modify:
   - Click individual checkboxes for specific variables
   - Click collection checkboxes to select all variables in that collection
   - Use "Select All" to select every variable
4. **Choose an action**:
   - **Clear all descriptions**: Remove descriptions from selected variables
   - **Set description to**: Apply a custom description to all selected variables
5. **Click "Apply Changes"**

### Filtering

Use the "Show only variables with descriptions" checkbox to filter the list and focus only on variables that already have descriptions. This is useful for reviewing or bulk-clearing existing documentation.

### Tips

- The plugin remembers your window size, so resize it once to your preference
- Expand/collapse collections by clicking on their headers
- Hover over truncated descriptions to see the full text
- The plugin will warn you before overwriting existing descriptions when setting new ones

## Development

This plugin is built with:
- Vanilla JavaScript (no framework dependencies)
- Figma Plugin API
- HTML/CSS for the UI

### File Structure

```
variable_description_manager/
├── manifest.json          # Plugin configuration
├── code.js               # Main plugin logic (runs in Figma sandbox)
├── ui.html               # User interface
└── README.md             # This file
```

### Building

No build step required! The plugin uses vanilla JavaScript and can be imported directly into Figma.

## Roadmap

- [ ] Publish to Figma Community
- [ ] Add search functionality
- [ ] Support for variable name patterns (e.g., set descriptions based on variable naming conventions)
- [ ] Export/import descriptions as CSV
- [ ] Template system for common description formats

## Contributing

This is a personal project currently in development. Once published, contributions will be welcome!

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have suggestions, please [open an issue](../../issues) on GitHub.
