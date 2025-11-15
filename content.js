// Content script for Kindle Cloud Reader
console.log('Kindle Highlighter Shortcuts: Content script loaded');

// Listen for keyboard commands from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action && request.action.startsWith('highlight-')) {
    const color = request.action.replace('highlight-', '');
    highlightWithColor(color);
    sendResponse({ success: true });
  }
});

/**
 * Highlights the selected text with the specified color
 * @param {string} color - The color to highlight with (yellow, blue, pink, orange)
 */
function highlightWithColor(color) {
  console.log(`Attempting to highlight with color: ${color}`);
  
  // Check if the selection popover is present
  const popover = document.querySelector('#selection-popover_wrapper');
  if (!popover) {
    console.log('Selection popover not found - no text selected');
    showNotification('Please select text to highlight');
    return;
  }

  // Find the highlight button for the specified color
  const highlightButton = findHighlightButton(color);
  
  if (highlightButton) {
    console.log(`Found highlight button for ${color}, clicking it`);
    highlightButton.click();
    showNotification(`Highlighted in ${color}`);
  } else {
    console.log(`Highlight button for ${color} not found. Make sure text is selected.`);
    showNotification('Please select text first');
  }
}

/**
 * Finds the highlight button for the specified color
 * @param {string} color - The color to find (yellow, blue, pink, orange)
 * @returns {HTMLElement|null} - The button element or null if not found
 */
function findHighlightButton(color) {
  // Try multiple selectors to find the button
  const selectors = [
    `.selection-button--${color}`,
    `.selection-button.highlight.selection-button--${color}`,
    `button[aria-label="${color} highlight"]`,
    `button.selection-button--${color}`
  ];
  
  for (const selector of selectors) {
    const button = document.querySelector(selector);
    if (button) {
      return button;
    }
  }
  
  // If not found by selector, try finding within the popover wrapper
  const popoverWrapper = document.querySelector('#selection-popover_wrapper');
  if (popoverWrapper) {
    const buttons = popoverWrapper.querySelectorAll('button.highlight');
    for (const button of buttons) {
      if (button.classList.contains(`selection-button--${color}`) || 
          button.getAttribute('aria-label')?.includes(color)) {
        return button;
      }
    }
  }
  
  return null;
}

/**
 * Shows a temporary notification to the user
 * @param {string} message - The message to display
 */
function showNotification(message) {
  // Remove any existing notification
  const existingNotification = document.querySelector('#kindle-highlighter-notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.id = 'kindle-highlighter-notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #333;
    color: white;
    padding: 12px 20px;
    border-radius: 6px;
    z-index: 999999;
    font-family: Arial, sans-serif;
    font-size: 14px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    animation: slideIn 0.3s ease-out;
  `;
  
  // Add animation styles
  if (!document.querySelector('#kindle-highlighter-styles')) {
    const style = document.createElement('style');
    style.id = 'kindle-highlighter-styles';
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(notification);
  
  // Remove notification after 2 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 2000);
}

// Also listen for direct keyboard events as a fallback
document.addEventListener('keydown', async (event) => {
  // Get custom shortcuts from storage
  const result = await chrome.storage.sync.get(['shortcuts']);
  const shortcuts = result.shortcuts || getDefaultShortcuts();
  
  const pressedKey = getKeyCombo(event);
  
  // Check if the pressed key matches any of our shortcuts
  for (const [color, shortcut] of Object.entries(shortcuts)) {
    if (shortcut && shortcut.toLowerCase() === pressedKey.toLowerCase()) {
      event.preventDefault();
      event.stopPropagation();
      highlightWithColor(color);
      break;
    }
  }
});

/**
 * Gets the key combination from a keyboard event
 * @param {KeyboardEvent} event - The keyboard event
 * @returns {string} - The key combination (e.g., "Ctrl+Shift+Y")
 */
function getKeyCombo(event) {
  const keys = [];
  
  if (event.ctrlKey) keys.push('Ctrl');
  if (event.altKey) keys.push('Alt');
  if (event.shiftKey) keys.push('Shift');
  if (event.metaKey) keys.push('Command');
  
  if (event.key && event.key.length === 1) {
    keys.push(event.key.toUpperCase());
  }
  
  return keys.join('+');
}

/**
 * Gets default shortcuts
 * @returns {Object} - Default shortcuts object
 */
function getDefaultShortcuts() {
  return {
    yellow: 'Ctrl+Shift+Y',
    blue: 'Ctrl+Shift+B',
    pink: 'Ctrl+Shift+P',
    orange: 'Ctrl+Shift+O'
  };
}
