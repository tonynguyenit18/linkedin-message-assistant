// Popup script for LinkedIn Message Assistant
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('settingsForm');
  const openaiKeyInput = document.getElementById('openaiKey');
  const geminiKeyInput = document.getElementById('geminiKey');
  const openaiModelSelect = document.getElementById('openaiModel');
  const geminiModelSelect = document.getElementById('geminiModel');
  const saveBtn = document.getElementById('saveBtn');
  const statusDiv = document.getElementById('status');
  const showOpenAIKeyCheckbox = document.getElementById('showOpenAIKey');
  const showGeminiKeyCheckbox = document.getElementById('showGeminiKey');
  
  // Provider radio buttons
  const openaiRadio = document.getElementById('openai');
  const geminiRadio = document.getElementById('gemini');
  
  // Provider content sections
  const openaiSettings = document.getElementById('openaiSettings');
  const geminiSettings = document.getElementById('geminiSettings');

  // Load saved settings
  loadSettings();

  // Handle form submission
  form.addEventListener('submit', handleSave);

  // Handle provider switching
  openaiRadio.addEventListener('change', switchProvider);
  geminiRadio.addEventListener('change', switchProvider);

  // Handle API key visibility toggles
  showOpenAIKeyCheckbox.addEventListener('change', () => toggleApiKeyVisibility('openai'));
  showGeminiKeyCheckbox.addEventListener('change', () => toggleApiKeyVisibility('gemini'));

  // Load settings from storage
  async function loadSettings() {
    try {
      const result = await chrome.storage.sync.get([
        'provider', 
        'openai_api_key', 
        'gemini_api_key', 
        'openai_model', 
        'gemini_model'
      ]);
      
      // Set provider
      if (result.provider) {
        if (result.provider === 'gemini') {
          geminiRadio.checked = true;
          switchProvider();
        } else {
          openaiRadio.checked = true;
          switchProvider();
        }
      }
      
      // Load OpenAI settings
      if (result.openai_api_key) {
        openaiKeyInput.value = result.openai_api_key;
        maskApiKey('openai');
      }
      
      if (result.openai_model) {
        openaiModelSelect.value = result.openai_model;
      }
      
      // Load Gemini settings
      if (result.gemini_api_key) {
        geminiKeyInput.value = result.gemini_api_key;
        maskApiKey('gemini');
      }
      
      if (result.gemini_model) {
        geminiModelSelect.value = result.gemini_model;
      }
      
    } catch (error) {
      console.error('Error loading settings:', error);
      showStatus('Error loading settings', 'error');
    }
  }

  // Switch between providers
  function switchProvider() {
    if (openaiRadio.checked) {
      openaiSettings.classList.add('active');
      geminiSettings.classList.remove('active');
    } else {
      geminiSettings.classList.add('active');
      openaiSettings.classList.remove('active');
    }
  }

  // Handle save button click
  async function handleSave(e) {
    e.preventDefault();
    
    const provider = openaiRadio.checked ? 'openai' : 'gemini';
    const openaiKey = openaiKeyInput.value.trim();
    const geminiKey = geminiKeyInput.value.trim();
    const openaiModel = openaiModelSelect.value;
    const geminiModel = geminiModelSelect.value;

    // Validate based on selected provider
    if (provider === 'openai') {
      if (!openaiKey) {
        showStatus('Please enter your OpenAI API key', 'error');
        return;
      }
      if (!openaiKey.startsWith('sk-')) {
        showStatus('Please enter a valid OpenAI API key (starts with sk-)', 'error');
        return;
      }
    } else {
      if (!geminiKey) {
        showStatus('Please enter your Gemini API key', 'error');
        return;
      }
      if (!geminiKey.startsWith('AIza')) {
        showStatus('Please enter a valid Gemini API key (starts with AIza)', 'error');
        return;
      }
    }

    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';

    try {
      // Save to Chrome storage
      await chrome.storage.sync.set({
        provider: provider,
        openai_api_key: openaiKey,
        gemini_api_key: geminiKey,
        openai_model: openaiModel,
        gemini_model: geminiModel
      });

      showStatus('Settings saved successfully!', 'success');
      
      // Test the API key for the selected provider
      if (provider === 'openai') {
        await testOpenAIKey(openaiKey, openaiModel);
      } else {
        await testGeminiKey(geminiKey, geminiModel);
      }
      
    } catch (error) {
      console.error('Error saving settings:', error);
      showStatus('Error saving settings: ' + error.message, 'error');
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save Settings';
    }
  }

  // Test OpenAI API key
  async function testOpenAIKey(apiKey, model) {
    try {
      showStatus('Testing OpenAI API key...', 'info');
      
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });

      if (response.ok) {
        showStatus('OpenAI API key is valid! Extension is ready to use.', 'success');
      } else {
        const errorData = await response.json();
        showStatus(`OpenAI API key test failed: ${errorData.error?.message || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Error testing OpenAI API key:', error);
      showStatus('Error testing OpenAI API key: ' + error.message, 'error');
    }
  }

  // Test Gemini API key
  async function testGeminiKey(apiKey, model) {
    try {
      showStatus('Testing Gemini API key...', 'info');
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`, {
        method: 'GET'
      });

      if (response.ok) {
        showStatus('Gemini API key is valid! Extension is ready to use.', 'success');
      } else {
        const errorData = await response.json();
        showStatus(`Gemini API key test failed: ${errorData.error?.message || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Error testing Gemini API key:', error);
      showStatus('Error testing Gemini API key: ' + error.message, 'error');
    }
  }

  // Toggle API key visibility
  function toggleApiKeyVisibility(provider) {
    if (provider === 'openai') {
      if (showOpenAIKeyCheckbox.checked) {
        unmaskApiKey('openai');
      } else {
        maskApiKey('openai');
      }
    } else {
      if (showGeminiKeyCheckbox.checked) {
        unmaskApiKey('gemini');
      } else {
        maskApiKey('gemini');
      }
    }
  }

  // Mask the API key for security
  function maskApiKey(provider) {
    if (provider === 'openai') {
      const apiKey = openaiKeyInput.value;
      if (apiKey && apiKey.startsWith('sk-')) {
        const maskedKey = apiKey.substring(0, 7) + '*'.repeat(apiKey.length - 7);
        openaiKeyInput.value = maskedKey;
      }
    } else {
      const apiKey = geminiKeyInput.value;
      if (apiKey && apiKey.startsWith('AIza')) {
        const maskedKey = apiKey.substring(0, 8) + '*'.repeat(apiKey.length - 8);
        geminiKeyInput.value = maskedKey;
      }
    }
  }

  // Unmask the API key
  function unmaskApiKey(provider) {
    if (provider === 'openai') {
      chrome.storage.sync.get(['openai_api_key'], function(result) {
        if (result.openai_api_key) {
          openaiKeyInput.value = result.openai_api_key;
        }
      });
    } else {
      chrome.storage.sync.get(['gemini_api_key'], function(result) {
        if (result.gemini_api_key) {
          geminiKeyInput.value = result.gemini_api_key;
        }
      });
    }
  }

  // Show status message
  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.classList.remove('hidden');
    
    // Auto-hide success messages after 3 seconds
    if (type === 'success') {
      setTimeout(() => {
        statusDiv.classList.add('hidden');
      }, 3000);
    }
  }

  // Handle input changes to clear status
  openaiKeyInput.addEventListener('input', () => {
    if (!statusDiv.classList.contains('hidden')) {
      statusDiv.classList.add('hidden');
    }
  });

  geminiKeyInput.addEventListener('input', () => {
    if (!statusDiv.classList.contains('hidden')) {
      statusDiv.classList.add('hidden');
    }
  });

  openaiModelSelect.addEventListener('change', () => {
    if (!statusDiv.classList.contains('hidden')) {
      statusDiv.classList.add('hidden');
    }
  });

  geminiModelSelect.addEventListener('change', () => {
    if (!statusDiv.classList.contains('hidden')) {
      statusDiv.classList.add('hidden');
    }
  });
}); 