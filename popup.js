// Popup script
document.addEventListener('DOMContentLoaded', async () => {
  // Load and display shortcuts
  loadShortcuts();
  
  // Check if on Kindle page
  checkKindlePage();
  
  // Add button listeners
  document.getElementById('options-btn').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
  
  document.getElementById('help-btn').addEventListener('click', () => {
    showHelp();
  });
});

/**
 * Load shortcuts from storage and display them
 */
async function loadShortcuts() {
  try {
    const result = await chrome.storage.sync.get(['shortcuts']);
    const shortcuts = result.shortcuts || getDefaultShortcuts();
    
    document.getElementById('yellow-key').textContent = shortcuts.yellow || '-';
    document.getElementById('blue-key').textContent = shortcuts.blue || '-';
    document.getElementById('pink-key').textContent = shortcuts.pink || '-';
    document.getElementById('orange-key').textContent = shortcuts.orange || '-';
  } catch (error) {
    console.error('Error loading shortcuts:', error);
  }
}

/**
 * Check if current tab is on Kindle Cloud Reader
 */
async function checkKindlePage() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const statusDiv = document.getElementById('status');
    const statusText = document.getElementById('status-text');
    
    if (tab && tab.url && (tab.url.includes('read.amazon.in') || tab.url.includes('read.amazon.com'))) {
      statusDiv.className = 'status active';
      statusText.textContent = '✓ Active on Kindle Cloud Reader';
    } else {
      statusDiv.className = 'status inactive';
      statusText.textContent = '⚠ Not on Kindle Cloud Reader';
    }
  } catch (error) {
    console.error('Error checking page:', error);
  }
}

/**
 * Get default shortcuts
 */
function getDefaultShortcuts() {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modifier = isMac ? 'Command' : 'Ctrl';
  
  return {
    yellow: `${modifier}+Shift+Y`,
    blue: `${modifier}+Shift+B`,
    pink: `${modifier}+Shift+P`,
    orange: `${modifier}+Shift+O`
  };
}

/**
 * Show help information
 */
function showHelp() {
  const helpText = `How to use Kindle Highlighter Shortcuts:

1. Open a book on Kindle Cloud Reader (read.amazon.in or read.amazon.com)

2. Select any text you want to highlight

3. Press your keyboard shortcut for the desired color:
   - Yellow, Blue, Pink, or Orange

4. The text will be highlighted instantly!

Tips:
• Customize shortcuts in the Options page
• Make sure to select text before using shortcuts
• Works only on Kindle Cloud Reader pages

Need help? Visit the extension options to customize your shortcuts.`;

  alert(helpText);
}
