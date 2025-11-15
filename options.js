// Options page script
const defaultShortcuts = {
  yellow: 'Ctrl+Shift+Y',
  blue: 'Ctrl+Shift+B',
  pink: 'Ctrl+Shift+P',
  orange: 'Ctrl+Shift+O'
};

// Detect if user is on Mac
const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
if (isMac) {
  defaultShortcuts.yellow = 'Command+Shift+Y';
  defaultShortcuts.blue = 'Command+Shift+B';
  defaultShortcuts.pink = 'Command+Shift+P';
  defaultShortcuts.orange = 'Command+Shift+O';
}

let currentShortcuts = { ...defaultShortcuts };

// DOM elements
const yellowInput = document.getElementById('yellow-shortcut');
const blueInput = document.getElementById('blue-shortcut');
const pinkInput = document.getElementById('pink-shortcut');
const orangeInput = document.getElementById('orange-shortcut');
const saveBtn = document.getElementById('save-btn');
const resetBtn = document.getElementById('reset-btn');
const statusMessage = document.getElementById('status-message');

// Load saved shortcuts
loadShortcuts();

// Add event listeners
yellowInput.addEventListener('click', () => recordShortcut('yellow', yellowInput));
blueInput.addEventListener('click', () => recordShortcut('blue', blueInput));
pinkInput.addEventListener('click', () => recordShortcut('pink', pinkInput));
orangeInput.addEventListener('click', () => recordShortcut('orange', orangeInput));

saveBtn.addEventListener('click', saveShortcuts);
resetBtn.addEventListener('click', resetToDefaults);

/**
 * Load shortcuts from storage
 */
async function loadShortcuts() {
  try {
    const result = await chrome.storage.sync.get(['shortcuts']);
    if (result.shortcuts) {
      currentShortcuts = result.shortcuts;
    }
    updateUI();
  } catch (error) {
    console.error('Error loading shortcuts:', error);
    showStatus('Error loading shortcuts', 'error');
  }
}

/**
 * Update UI with current shortcuts
 */
function updateUI() {
  yellowInput.value = currentShortcuts.yellow || '';
  blueInput.value = currentShortcuts.blue || '';
  pinkInput.value = currentShortcuts.pink || '';
  orangeInput.value = currentShortcuts.orange || '';
}

/**
 * Record a keyboard shortcut
 */
function recordShortcut(color, inputElement) {
  inputElement.value = 'Press keys...';
  inputElement.classList.add('recording');
  
  // Create a one-time keyboard listener
  const keyListener = (event) => {
    event.preventDefault();
    
    // Ignore single modifier keys
    if (['Control', 'Shift', 'Alt', 'Meta', 'Command'].includes(event.key)) {
      return;
    }
    
    const keys = [];
    
    if (event.ctrlKey) keys.push('Ctrl');
    if (event.altKey) keys.push('Alt');
    if (event.shiftKey) keys.push('Shift');
    if (event.metaKey) keys.push('Command');
    
    // Add the actual key
    if (event.key && event.key.length === 1) {
      keys.push(event.key.toUpperCase());
    } else if (event.key) {
      keys.push(event.key);
    }
    
    const shortcut = keys.join('+');
    
    // Validate shortcut (must have at least one modifier + one key)
    if (keys.length >= 2) {
      currentShortcuts[color] = shortcut;
      inputElement.value = shortcut;
      inputElement.classList.remove('recording');
      document.removeEventListener('keydown', keyListener);
    } else {
      inputElement.value = 'Invalid shortcut (need modifier + key)';
      setTimeout(() => {
        inputElement.value = currentShortcuts[color] || '';
        inputElement.classList.remove('recording');
      }, 1500);
      document.removeEventListener('keydown', keyListener);
    }
  };
  
  document.addEventListener('keydown', keyListener);
  
  // Remove listener if input loses focus
  inputElement.addEventListener('blur', () => {
    document.removeEventListener('keydown', keyListener);
    inputElement.classList.remove('recording');
    inputElement.value = currentShortcuts[color] || '';
  }, { once: true });
}

/**
 * Save shortcuts to storage
 */
async function saveShortcuts() {
  try {
    await chrome.storage.sync.set({ shortcuts: currentShortcuts });
    showStatus('Shortcuts saved successfully!', 'success');
    
    // Update Chrome commands if possible
    updateChromeCommands();
  } catch (error) {
    console.error('Error saving shortcuts:', error);
    showStatus('Error saving shortcuts', 'error');
  }
}

/**
 * Update Chrome extension commands (if supported)
 */
async function updateChromeCommands() {
  // Note: Chrome doesn't allow programmatic updating of command shortcuts
  // Users need to manually update them in chrome://extensions/shortcuts
  // But we'll store them for the content script to use
  console.log('Shortcuts saved. Note: Chrome extension keyboard shortcuts can also be customized at chrome://extensions/shortcuts');
}

/**
 * Reset shortcuts to defaults
 */
function resetToDefaults() {
  if (confirm('Reset all shortcuts to default values?')) {
    currentShortcuts = { ...defaultShortcuts };
    updateUI();
    showStatus('Reset to default shortcuts', 'success');
  }
}

/**
 * Show status message
 */
function showStatus(message, type) {
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${type}`;
  statusMessage.classList.add('show');
  
  setTimeout(() => {
    statusMessage.classList.remove('show');
  }, 3000);
}
