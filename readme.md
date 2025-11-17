# Variable Descriptions Manager - Complete Plugin Code

This is the complete, working code for the Variable Descriptions Manager Figma plugin. Copy each file into your plugin folder.

---

## File Structure

```
variable-descriptions-manager/
├── manifest.json
├── code.js
└── ui.html
```

---

## 1. manifest.json

```json
{
  "name": "Variable Descriptions Manager",
  "id": "variable-descriptions-manager",
  "api": "1.0.0",
  "main": "code.js",
  "ui": "ui.html",
  "editorType": ["figma"],
  "networkAccess": {
    "allowedDomains": ["none"]
  }
}
```

---

## 2. code.js

```javascript
// Main plugin controller - runs in Figma's plugin sandbox

// Show the UI
figma.showUI(__html__, { width: 500, height: 600 });

// Restore previous size
figma.clientStorage.getAsync('windowSize').then(size => {
  if (size) {
    figma.ui.resize(size.w, size.h);
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
```

---

## 3. ui.html

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Variable Descriptions Manager</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 12px;
      color: #333;
      background: #fff;
      overflow: hidden;
    }

    #app {
      display: flex;
      flex-direction: column;
      height: 100vh;
      padding: 16px;
    }

    /* Header */
    .header {
      margin-bottom: 16px;
    }

    .header h2 {
      font-size: 14px;
      font-weight: 600;
      color: #000;
    }

    /* Filter Section */
    .filter-section {
      margin-bottom: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid #e5e5e5;
    }

    /* Select All Section */
    .select-all-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid #e5e5e5;
    }

    .selection-count {
      font-size: 11px;
      color: #666;
    }

    /* Action Section */
    .action-section {
      margin-bottom: 12px;
      padding: 12px;
      background: #f5f5f5;
      border-radius: 4px;
    }

    .action-label {
      font-weight: 600;
      margin-bottom: 8px;
    }

    .radio-label {
      display: flex;
      align-items: center;
      margin-bottom: 6px;
      cursor: pointer;
    }

    .radio-label input[type="radio"] {
      margin-right: 6px;
    }

    #new-description {
      width: calc(100% - 20px);
      padding: 6px 8px;
      margin-top: 6px;
      margin-left: 20px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 12px;
      font-family: inherit;
      box-sizing: border-box;
    }

    #new-description:disabled {
      background: #e5e5e5;
      cursor: not-allowed;
    }

    /* Collections Container */
    .collections-container {
      flex: 1;
      overflow-y: auto;
      border: 1px solid #e5e5e5;
      border-radius: 4px;
      padding: 8px;
      margin-bottom: 12px;
    }

    .empty-state {
      text-align: center;
      color: #999;
      padding: 40px 20px;
    }

    /* Collection */
    .collection {
      margin-bottom: 12px;
    }

    .collection-header {
      display: flex;
      align-items: center;
      padding: 8px;
      background: #f9f9f9;
      border-radius: 4px;
      cursor: pointer;
      user-select: none;
    }

    .collection-header:hover {
      background: #f0f0f0;
    }

    .toggle {
      width: 16px;
      font-size: 10px;
      color: #666;
    }

    .collection-checkbox {
      margin: 0 8px;
      cursor: pointer;
    }

    .collection-label {
      font-weight: 600;
      font-size: 12px;
    }

    /* Variables List */
    .variables-list {
      padding-left: 24px;
      margin-top: 4px;
    }

    .variables-list.collapsed {
      display: none;
    }

    .variable-item {
      display: flex;
      align-items: center;
      padding: 6px 8px;
      border-bottom: 1px solid #f0f0f0;
    }

    .variable-item:hover {
      background: #fafafa;
    }

    .variable-checkbox {
      margin-right: 8px;
      flex-shrink: 0;
      cursor: pointer;
    }

    .variable-name {
      flex: 1;
      font-size: 12px;
      color: #333;
      margin-right: 12px;
      font-family: 'Courier New', monospace;
    }

    .variable-description {
      flex: 1;
      font-size: 11px;
      color: #666;
      font-style: italic;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* Checkbox styling */
    .checkbox-label {
      display: flex;
      align-items: center;
      cursor: pointer;
      user-select: none;
    }

    .checkbox-label input[type="checkbox"] {
      margin-right: 6px;
      cursor: pointer;
    }

    /* Status Message */
    .status-message {
      padding: 8px 12px;
      border-radius: 4px;
      margin-bottom: 12px;
      font-size: 12px;
    }

    .status-message.hidden {
      display: none;
    }

    .status-message.success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .status-message.error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    /* Footer */
    .footer {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }

    .primary-button {
      padding: 8px 16px;
      background: #18a0fb;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }

    .primary-button:hover {
      background: #0d8ce8;
    }

    .primary-button:active {
      background: #0b7cd6;
    }

    .secondary-button {
      padding: 8px 16px;
      background: #fff;
      color: #333;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }

    .secondary-button:hover {
      background: #f5f5f5;
    }

    .secondary-button:active {
      background: #e5e5e5;
    }

    /* Confirmation Dialog */
    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .dialog-overlay.hidden {
      display: none;
    }

    .dialog-box {
      background: white;
      border-radius: 8px;
      padding: 24px;
      max-width: 400px;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }

    .dialog-box h3 {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 12px;
    }

    .dialog-box p {
      font-size: 12px;
      color: #666;
      margin-bottom: 20px;
      line-height: 1.5;
    }

    .dialog-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }
  </style>
</head>
<body>
  <div id="app">
    <!-- Header -->
    <div class="header">
      <h2>Variable Descriptions Manager</h2>
    </div>
    
    <!-- Filter -->
    <div class="filter-section">
      <label class="checkbox-label">
        <input type="checkbox" id="filter-with-descriptions">
        <span>Show only variables with descriptions</span>
      </label>
    </div>
    
    <!-- Select All -->
    <div class="select-all-section">
      <label class="checkbox-label">
        <input type="checkbox" id="select-all">
        <span id="select-all-label">Select All (0 variables)</span>
      </label>
      <span id="selection-count" class="selection-count">0 selected</span>
    </div>
    
    <!-- Action Selection -->
    <div class="action-section">
      <div class="action-label">Action:</div>
      <label class="radio-label">
        <input type="radio" name="action" value="clear" checked>
        <span>Clear all descriptions</span>
      </label>
      <label class="radio-label">
        <input type="radio" name="action" value="set">
        <span>Set description to:</span>
      </label>
      <input type="text" id="new-description" placeholder="Enter description..." disabled>
    </div>
    
    <!-- Collections List -->
    <div id="collections-container" class="collections-container">
      <div class="empty-state">Loading variables...</div>
    </div>
    
    <!-- Status Message -->
    <div id="status-message" class="status-message hidden"></div>
    
    <!-- Footer Actions -->
    <div class="footer">
      <button id="apply-btn" class="primary-button">Apply Changes</button>
      <button id="close-btn" class="secondary-button">Close</button>
    </div>
  </div>
  
  <!-- Confirmation Dialog -->
  <div id="confirmation-dialog" class="dialog-overlay hidden">
    <div class="dialog-box">
      <h3>Overwrite Existing Descriptions?</h3>
      <p>Some selected variables already have descriptions. Do you want to overwrite them?</p>
      <div class="dialog-actions">
        <button id="dialog-cancel" class="secondary-button">Cancel</button>
        <button id="dialog-proceed" class="primary-button">Proceed</button>
      </div>
    </div>
  </div>
  
  <!-- Resize Handle -->
  <svg
    id="resize-corner"
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="#666666"
    viewBox="0 0 256 256"
    style="position: absolute; right: 4px; bottom: 4px; cursor: nwse-resize; z-index: 10000; opacity: 0.6;">
    <path d="M213.66,133.66l-80,80a8,8,0,0,1-11.32-11.32l80-80a8,8,0,0,1,11.32,11.32Zm-16-99.32a8,8,0,0,0-11.32,0l-152,152a8,8,0,0,0,11.32,11.32l152-152A8,8,0,0,0,197.66,34.34Z"></path>
  </svg>
  
  <script>
    // UI logic and communication with code.js

    let collectionsData = [];
    let selectedVariableIds = new Set();
    let filterWithDescriptions = false;

    // DOM elements
    const selectAllCheckbox = document.getElementById('select-all');
    const selectAllLabel = document.getElementById('select-all-label');
    const selectionCount = document.getElementById('selection-count');
    const filterCheckbox = document.getElementById('filter-with-descriptions');
    const collectionsContainer = document.getElementById('collections-container');
    const newDescriptionInput = document.getElementById('new-description');
    const applyBtn = document.getElementById('apply-btn');
    const closeBtn = document.getElementById('close-btn');
    const statusMessage = document.getElementById('status-message');
    const confirmationDialog = document.getElementById('confirmation-dialog');
    const dialogCancel = document.getElementById('dialog-cancel');
    const dialogProceed = document.getElementById('dialog-proceed');

    // Action radio buttons
    const actionRadios = document.querySelectorAll('input[name="action"]');

    // Add resize functionality
    function setupResizeHandle() {
      const corner = document.getElementById('resize-corner');
      if (!corner) return;
      
      const resizeWindow = (e) => {
        const size = {
          w: Math.max(400, Math.floor(e.clientX + 5)),
          h: Math.max(400, Math.floor(e.clientY + 5))
        };
        parent.postMessage({ 
          pluginMessage: { 
            type: 'resize', 
            size: size 
          }
        }, '*');
      };
      
      const handlePointerDown = (e) => {
        corner.onpointermove = resizeWindow;
        corner.setPointerCapture(e.pointerId);
      };
      
      const handlePointerUp = (e) => {
        corner.onpointermove = null;
        corner.releasePointerCapture(e.pointerId);
      };
      
      corner.addEventListener('pointerdown', handlePointerDown);
      corner.addEventListener('pointerup', handlePointerUp);
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
      // Request variables from plugin
      parent.postMessage({ pluginMessage: { type: 'load-variables' } }, '*');
      
      // Setup event listeners
      setupEventListeners();
      setupResizeHandle();
    });

    function setupEventListeners() {
      // Action radio change
      actionRadios.forEach(radio => {
        radio.addEventListener('change', () => {
          newDescriptionInput.disabled = radio.value !== 'set';
        });
      });
      
      // Select All checkbox
      selectAllCheckbox.addEventListener('change', (e) => {
        const checked = e.target.checked;
        if (checked) {
          selectAllVariables();
        } else {
          clearAllSelections();
        }
        updateUI();
      });
      
      // Filter checkbox
      filterCheckbox.addEventListener('change', (e) => {
        filterWithDescriptions = e.target.checked;
        renderCollections();
      });
      
      // Apply button
      applyBtn.addEventListener('click', handleApply);
      
      // Close button
      closeBtn.addEventListener('click', () => {
        parent.postMessage({ pluginMessage: { type: 'close' } }, '*');
      });
      
      // Dialog buttons
      dialogCancel.addEventListener('click', hideConfirmationDialog);
      dialogProceed.addEventListener('click', proceedWithApply);
    }

    // Receive messages from plugin
    window.onmessage = (event) => {
      const msg = event.data.pluginMessage;
      
      if (msg.type === 'variables-loaded') {
        collectionsData = msg.data;
        renderCollections();
        updateUI();
      }
      
      if (msg.type === 'status') {
        showStatus(msg.message, msg.isError);
      }
      
      if (msg.type === 'error') {
        showStatus(msg.message, true);
      }
    };

    function renderCollections() {
      collectionsContainer.innerHTML = '';
      
      if (collectionsData.length === 0) {
        collectionsContainer.innerHTML = '<div class="empty-state">No variables found in this file.</div>';
        return;
      }
      
      collectionsData.forEach(collection => {
        const filteredVariables = filterWithDescriptions
          ? collection.variables.filter(v => v.description && v.description.trim() !== '')
          : collection.variables;
        
        if (filteredVariables.length === 0 && filterWithDescriptions) {
          return; // Skip this collection if no variables match filter
        }
        
        const collectionDiv = document.createElement('div');
        collectionDiv.className = 'collection';
        
        // Collection header
        const header = document.createElement('div');
        header.className = 'collection-header';
        
        const toggle = document.createElement('span');
        toggle.className = 'toggle';
        toggle.textContent = '▼';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'collection-checkbox';
        checkbox.checked = areAllVariablesSelected(filteredVariables);
        checkbox.addEventListener('change', (e) => {
          toggleCollectionSelection(filteredVariables, e.target.checked);
          updateUI();
        });
        
        const label = document.createElement('span');
        label.className = 'collection-label';
        label.textContent = `Collection: ${collection.collectionName} (${filteredVariables.length} variable${filteredVariables.length !== 1 ? 's' : ''})`;
        
        header.appendChild(toggle);
        header.appendChild(checkbox);
        header.appendChild(label);
        
        // Variables list
        const variablesList = document.createElement('div');
        variablesList.className = 'variables-list';
        
        filteredVariables.forEach(variable => {
          const varDiv = document.createElement('div');
          varDiv.className = 'variable-item';
          
          const varCheckbox = document.createElement('input');
          varCheckbox.type = 'checkbox';
          varCheckbox.className = 'variable-checkbox';
          varCheckbox.checked = selectedVariableIds.has(variable.id);
          varCheckbox.dataset.variableId = variable.id;
          varCheckbox.addEventListener('change', (e) => {
            toggleVariableSelection(variable.id, e.target.checked);
            updateUI();
          });
          
          const varName = document.createElement('span');
          varName.className = 'variable-name';
          varName.textContent = variable.name;
          
          const varDescription = document.createElement('span');
          varDescription.className = 'variable-description';
          varDescription.textContent = variable.description ? truncate(variable.description, 50) : '(no description)';
          varDescription.title = variable.description; // Full description on hover
          
          varDiv.appendChild(varCheckbox);
          varDiv.appendChild(varName);
          varDiv.appendChild(varDescription);
          variablesList.appendChild(varDiv);
        });
        
        // Toggle accordion
        header.addEventListener('click', (e) => {
          if (e.target.type === 'checkbox') return; // Don't toggle if clicking checkbox
          variablesList.classList.toggle('collapsed');
          toggle.textContent = variablesList.classList.contains('collapsed') ? '▶' : '▼';
        });
        
        collectionDiv.appendChild(header);
        collectionDiv.appendChild(variablesList);
        collectionsContainer.appendChild(collectionDiv);
      });
    }

    function toggleVariableSelection(variableId, selected) {
      if (selected) {
        selectedVariableIds.add(variableId);
      } else {
        selectedVariableIds.delete(variableId);
      }
    }

    function toggleCollectionSelection(variables, selected) {
      variables.forEach(v => {
        if (selected) {
          selectedVariableIds.add(v.id);
        } else {
          selectedVariableIds.delete(v.id);
        }
      });
    }

    function selectAllVariables() {
      collectionsData.forEach(collection => {
        const filteredVariables = filterWithDescriptions
          ? collection.variables.filter(v => v.description && v.description.trim() !== '')
          : collection.variables;
        filteredVariables.forEach(v => selectedVariableIds.add(v.id));
      });
    }

    function clearAllSelections() {
      selectedVariableIds.clear();
    }

    function areAllVariablesSelected(variables) {
      return variables.every(v => selectedVariableIds.has(v.id));
    }

    function getTotalVariableCount() {
      let count = 0;
      collectionsData.forEach(collection => {
        const filteredVariables = filterWithDescriptions
          ? collection.variables.filter(v => v.description && v.description.trim() !== '')
          : collection.variables;
        count += filteredVariables.length;
      });
      return count;
    }

    function updateUI() {
      const totalCount = getTotalVariableCount();
      const selectedCount = selectedVariableIds.size;
      
      selectAllLabel.textContent = `Select All (${totalCount} variable${totalCount !== 1 ? 's' : ''})`;
      selectionCount.textContent = `${selectedCount} selected`;
      
      selectAllCheckbox.checked = selectedCount > 0 && selectedCount === totalCount;
      selectAllCheckbox.indeterminate = selectedCount > 0 && selectedCount < totalCount;
      
      // Update all checkboxes
      document.querySelectorAll('.variable-checkbox').forEach(cb => {
        cb.checked = selectedVariableIds.has(cb.dataset.variableId);
      });
      
      document.querySelectorAll('.collection-checkbox').forEach(cb => {
        const header = cb.closest('.collection-header');
        const variablesList = header.nextElementSibling;
        const checkboxes = variablesList.querySelectorAll('.variable-checkbox');
        const allChecked = Array.from(checkboxes).every(vcb => vcb.checked);
        const someChecked = Array.from(checkboxes).some(vcb => vcb.checked);
        cb.checked = allChecked;
        cb.indeterminate = someChecked && !allChecked;
      });
    }

    function handleApply() {
      if (selectedVariableIds.size === 0) {
        showStatus('No variables selected.', true);
        return;
      }
      
      const action = document.querySelector('input[name="action"]:checked').value;
      const newDescription = newDescriptionInput.value.trim();
      
      // Check if we're setting a description and if any selected variables already have descriptions
      if (action === 'set') {
        const hasExistingDescriptions = Array.from(selectedVariableIds).some(varId => {
          for (const collection of collectionsData) {
            const variable = collection.variables.find(v => v.id === varId);
            if (variable && variable.description && variable.description.trim() !== '') {
              return true;
            }
          }
          return false;
        });
        
        if (hasExistingDescriptions) {
          showConfirmationDialog();
          return;
        }
      }
      
      applyChanges();
    }

    function applyChanges() {
      const action = document.querySelector('input[name="action"]:checked').value;
      const newDescription = newDescriptionInput.value.trim();
      
      parent.postMessage({
        pluginMessage: {
          type: 'apply-changes',
          variableIds: Array.from(selectedVariableIds),
          action: action,
          newDescription: newDescription
        }
      }, '*');
      
      // Clear selections after apply
      selectedVariableIds.clear();
    }

    function showConfirmationDialog() {
      confirmationDialog.classList.remove('hidden');
    }

    function hideConfirmationDialog() {
      confirmationDialog.classList.add('hidden');
    }

    function proceedWithApply() {
      hideConfirmationDialog();
      applyChanges();
    }

    function showStatus(message, isError) {
      statusMessage.textContent = message;
      statusMessage.className = isError ? 'status-message error' : 'status-message success';
      statusMessage.classList.remove('hidden');
      
      setTimeout(() => {
        statusMessage.classList.add('hidden');
      }, 4000);
    }

    function truncate(str, maxLength) {
      if (str.length <= maxLength) return str;
      return str.substring(0, maxLength) + '...';
    }
  </script>
</body>
</html>
```

---

## Installation Instructions

1. **Create a folder** named `variable-descriptions-manager`
2. **Copy the three files** above into that folder:
   - `manifest.json`
   - `code.js`
   - `ui.html`
3. **Open Figma** (desktop or browser)
4. Go to **Menu → Plugins → Development → Import plugin from manifest**
5. Navigate to your folder and select `manifest.json`
6. The plugin will now appear in **Plugins → Development → Variable Descriptions Manager**

---

## Features Included

✅ Bulk clear descriptions  
✅ Bulk set descriptions  
✅ Filter by description status  
✅ Select individual variables  
✅ Select entire collections  
✅ Select all  
✅ Expandable collection groups  
✅ Overwrite confirmation dialog  
✅ Resizable window (drag bottom-right corner)  
✅ Persistent window size  
✅ Status messages  
✅ 100% local operation (no network access)

---

## Testing the Plugin

1. **Create test variables** in Figma (**Menu → Variables → Create variable**)
2. Add some to different collections
3. Give some variables descriptions, leave others empty
4. **Launch the plugin**
5. Test all the features:
   - Selection (individual, collection, select all)
   - Filtering
   - Clearing descriptions
   - Setting descriptions
   - Overwrite confirmation
   - Window resizing

---

That's it! You now have the complete, working Variable Descriptions Manager plugin. 🎉