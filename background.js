// Background service worker
console.log('Kindle Highlighter Shortcuts: Background service worker initialized');

// Listen for command shortcuts
chrome.commands.onCommand.addListener((command) => {
  console.log('Command received:', command);
  
  // Send message to the active tab's content script
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0] && tabs[0].url && (tabs[0].url.includes('read.amazon.in') || tabs[0].url.includes('read.amazon.com'))) {
      chrome.tabs.sendMessage(tabs[0].id, { action: command }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error sending message:', chrome.runtime.lastError);
        } else {
          console.log('Highlight command sent successfully');
        }
      });
    } else {
      console.log('Not on Kindle Cloud Reader page');
    }
  });
});

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Extension installed');
    // Set default shortcuts
    const defaultShortcuts = {
      yellow: 'Ctrl+Shift+Y',
      blue: 'Ctrl+Shift+B',
      pink: 'Ctrl+Shift+P',
      orange: 'Ctrl+Shift+O'
    };
    
    chrome.storage.sync.set({ shortcuts: defaultShortcuts }, () => {
      console.log('Default shortcuts saved');
    });
    
    // Open options page on first install
    chrome.runtime.openOptionsPage();
  } else if (details.reason === 'update') {
    console.log('Extension updated');
  }
});

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getShortcuts') {
    chrome.storage.sync.get(['shortcuts'], (result) => {
      sendResponse({ shortcuts: result.shortcuts });
    });
    return true; // Keep the message channel open for async response
  }
});
