// Background service worker for Social Content Assistant
chrome.runtime.onInstalled.addListener(() => {
  console.log('Social Content Assistant installed');
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSettings') {
    chrome.storage.sync.get([
      'provider', 
      'openai_api_key', 
      'gemini_api_key', 
      'claude_api_key',
      'deepseek_api_key',
      'openai_model', 
      'gemini_model',
      'claude_model',
      'deepseek_model'
    ], (result) => {
      sendResponse(result);
    });
    return true; // Keep the message channel open for async response
  }
  
  if (request.action === 'updateSettings') {
    chrome.storage.sync.set({
      provider: request.provider,
      openai_api_key: request.openaiApiKey,
      gemini_api_key: request.geminiApiKey,
      claude_api_key: request.claudeApiKey,
      deepseek_api_key: request.deepseekApiKey,
      openai_model: request.openaiModel,
      gemini_model: request.geminiModel,
      claude_model: request.claudeModel,
      deepseek_model: request.deepseekModel
    }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  // If we're on LinkedIn, inject the content script
  if (tab.url && tab.url.includes('linkedin.com')) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });
  }
});

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    // Notify content scripts about settings changes
    chrome.tabs.query({ url: 'https://www.linkedin.com/*' }, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          action: 'settingsChanged',
          changes: changes
        }).catch(() => {
          // Ignore errors if content script is not loaded
        });
      });
    });
  }
}); 