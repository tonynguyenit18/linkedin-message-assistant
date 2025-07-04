// Popup script for LinkedIn Message Assistant
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('settingsForm');
  const openaiKeyInput = document.getElementById('openaiKey');
  const geminiKeyInput = document.getElementById('geminiKey');
  const claudeKeyInput = document.getElementById('claudeKey');
  const deepseekKeyInput = document.getElementById('deepseekKey');
  const openaiModelSelect = document.getElementById('openaiModel');
  const geminiModelSelect = document.getElementById('geminiModel');
  const claudeModelSelect = document.getElementById('claudeModel');
  const deepseekModelSelect = document.getElementById('deepseekModel');
  const saveBtn = document.getElementById('saveBtn');
  const statusDiv = document.getElementById('status');
  const showOpenAIKeyCheckbox = document.getElementById('showOpenAIKey');
  const showGeminiKeyCheckbox = document.getElementById('showGeminiKey');
  const showClaudeKeyCheckbox = document.getElementById('showClaudeKey');
  const showDeepSeekKeyCheckbox = document.getElementById('showDeepSeekKey');
  
  // Provider radio buttons
  const openaiRadio = document.getElementById('openai');
  const geminiRadio = document.getElementById('gemini');
  const claudeRadio = document.getElementById('claude');
  const deepseekRadio = document.getElementById('deepseek');
  
  // Provider content sections
  const openaiSettings = document.getElementById('openaiSettings');
  const geminiSettings = document.getElementById('geminiSettings');
  const claudeSettings = document.getElementById('claudeSettings');
  const deepseekSettings = document.getElementById('deepseekSettings');

  // Load saved settings
  loadSettings();

  // Handle form submission
  form.addEventListener('submit', handleSave);

  // Handle provider switching
  openaiRadio.addEventListener('change', switchProvider);
  geminiRadio.addEventListener('change', switchProvider);
  claudeRadio.addEventListener('change', switchProvider);
  deepseekRadio.addEventListener('change', switchProvider);

  // Handle API key visibility toggles
  showOpenAIKeyCheckbox.addEventListener('change', () => toggleApiKeyVisibility('openai'));
  showGeminiKeyCheckbox.addEventListener('change', () => toggleApiKeyVisibility('gemini'));
  showClaudeKeyCheckbox.addEventListener('change', () => toggleApiKeyVisibility('claude'));
  showDeepSeekKeyCheckbox.addEventListener('change', () => toggleApiKeyVisibility('deepseek'));

  // Load settings from storage
  async function loadSettings() {
    try {
      const result = await chrome.storage.sync.get([
        'provider', 
        'openai_api_key', 
        'gemini_api_key', 
        'claude_api_key',
        'deepseek_api_key',
        'openai_model', 
        'gemini_model',
        'claude_model',
        'deepseek_model'
      ]);
      
      // Set provider
      if (result.provider) {
        if (result.provider === 'gemini') {
          geminiRadio.checked = true;
          switchProvider();
        } else if (result.provider === 'claude') {
          claudeRadio.checked = true;
          switchProvider();
        } else if (result.provider === 'deepseek') {
          deepseekRadio.checked = true;
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
      
      // Load Claude settings
      if (result.claude_api_key) {
        claudeKeyInput.value = result.claude_api_key;
        maskApiKey('claude');
      }
      
      if (result.claude_model) {
        claudeModelSelect.value = result.claude_model;
      }
      
      // Load DeepSeek settings
      if (result.deepseek_api_key) {
        deepseekKeyInput.value = result.deepseek_api_key;
        maskApiKey('deepseek');
      }
      
      if (result.deepseek_model) {
        deepseekModelSelect.value = result.deepseek_model;
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
      claudeSettings.classList.remove('active');
      deepseekSettings.classList.remove('active');
    } else if (geminiRadio.checked) {
      geminiSettings.classList.add('active');
      openaiSettings.classList.remove('active');
      claudeSettings.classList.remove('active');
      deepseekSettings.classList.remove('active');
    } else if (claudeRadio.checked) {
      claudeSettings.classList.add('active');
      openaiSettings.classList.remove('active');
      geminiSettings.classList.remove('active');
      deepseekSettings.classList.remove('active');
    } else {
      deepseekSettings.classList.add('active');
      openaiSettings.classList.remove('active');
      geminiSettings.classList.remove('active');
      claudeSettings.classList.remove('active');
    }
  }

  // Handle save button click
  async function handleSave(e) {
    e.preventDefault();
    
    const provider = openaiRadio.checked ? 'openai' : geminiRadio.checked ? 'gemini' : claudeRadio.checked ? 'claude' : 'deepseek';
    const openaiKey = openaiKeyInput.value.trim();
    const geminiKey = geminiKeyInput.value.trim();
    const claudeKey = claudeKeyInput.value.trim();
    const deepseekKey = deepseekKeyInput.value.trim();
    const openaiModel = openaiModelSelect.value;
    const geminiModel = geminiModelSelect.value;
    const claudeModel = claudeModelSelect.value;
    const deepseekModel = deepseekModelSelect.value;

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
    } else if (provider === 'gemini') {
      if (!geminiKey) {
        showStatus('Please enter your Gemini API key', 'error');
        return;
      }
      if (!geminiKey.startsWith('AIza')) {
        showStatus('Please enter a valid Gemini API key (starts with AIza)', 'error');
        return;
      }
    } else if (provider === 'claude') {
      if (!claudeKey) {
        showStatus('Please enter your Claude API key', 'error');
        return;
      }
      if (!claudeKey.startsWith('sk-')) {
        showStatus('Please enter a valid Claude API key (starts with sk-)', 'error');
        return;
      }
    } else {
      if (!deepseekKey) {
        showStatus('Please enter your DeepSeek API key', 'error');
        return;
      }
      if (!deepseekKey.startsWith('sk-')) {
        showStatus('Please enter a valid DeepSeek API key (starts with sk-)', 'error');
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
        claude_api_key: claudeKey,
        deepseek_api_key: deepseekKey,
        openai_model: openaiModel,
        gemini_model: geminiModel,
        claude_model: claudeModel,
        deepseek_model: deepseekModel
      });

      showStatus('Settings saved successfully!', 'success');
      
      // Test the API key for the selected provider
      if (provider === 'openai') {
        await testOpenAIKey(openaiKey, openaiModel);
      } else if (provider === 'gemini') {
        await testGeminiKey(geminiKey, geminiModel);
      } else if (provider === 'claude') {
        await testClaudeKey(claudeKey, claudeModel);
      } else {
        await testDeepSeekKey(deepseekKey, deepseekModel);
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

  // Test Claude API key
  async function testClaudeKey(apiKey, model) {
    try {
      showStatus('Testing Claude API key...', 'info');
      
      const response = await fetch(`https://api.anthropic.com/v1/models`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });

      if (response.ok) {
        showStatus('Claude API key is valid! Extension is ready to use.', 'success');
      } else {
        const errorData = await response.json();
        showStatus(`Claude API key test failed: ${errorData.error?.message || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Error testing Claude API key:', error);
      showStatus('Error testing Claude API key: ' + error.message, 'error');
    }
  }

  // Test DeepSeek API key
  async function testDeepSeekKey(apiKey, model) {
    try {
      showStatus('Testing DeepSeek API key...', 'info');
      
      const response = await fetch(`https://api.deepseek.com/v1/models`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });

      if (response.ok) {
        showStatus('DeepSeek API key is valid! Extension is ready to use.', 'success');
      } else {
        const errorData = await response.json();
        showStatus(`DeepSeek API key test failed: ${errorData.error?.message || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Error testing DeepSeek API key:', error);
      showStatus('Error testing DeepSeek API key: ' + error.message, 'error');
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
    } else if (provider === 'gemini') {
      if (showGeminiKeyCheckbox.checked) {
        unmaskApiKey('gemini');
      } else {
        maskApiKey('gemini');
      }
    } else if (provider === 'claude') {
      if (showClaudeKeyCheckbox.checked) {
        unmaskApiKey('claude');
      } else {
        maskApiKey('claude');
      }
    } else {
      if (showDeepSeekKeyCheckbox.checked) {
        unmaskApiKey('deepseek');
      } else {
        maskApiKey('deepseek');
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
    } else if (provider === 'gemini') {
      const apiKey = geminiKeyInput.value;
      if (apiKey && apiKey.startsWith('AIza')) {
        const maskedKey = apiKey.substring(0, 8) + '*'.repeat(apiKey.length - 8);
        geminiKeyInput.value = maskedKey;
      }
    } else if (provider === 'claude') {
      const apiKey = claudeKeyInput.value;
      if (apiKey && apiKey.startsWith('sk-')) {
        const maskedKey = apiKey.substring(0, 7) + '*'.repeat(apiKey.length - 7);
        claudeKeyInput.value = maskedKey;
      }
    } else {
      const apiKey = deepseekKeyInput.value;
      if (apiKey && apiKey.startsWith('sk-')) {
        const maskedKey = apiKey.substring(0, 7) + '*'.repeat(apiKey.length - 7);
        deepseekKeyInput.value = maskedKey;
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
    } else if (provider === 'gemini') {
      chrome.storage.sync.get(['gemini_api_key'], function(result) {
        if (result.gemini_api_key) {
          geminiKeyInput.value = result.gemini_api_key;
        }
      });
    } else if (provider === 'claude') {
      chrome.storage.sync.get(['claude_api_key'], function(result) {
        if (result.claude_api_key) {
          claudeKeyInput.value = result.claude_api_key;
        }
      });
    } else {
      chrome.storage.sync.get(['deepseek_api_key'], function(result) {
        if (result.deepseek_api_key) {
          deepseekKeyInput.value = result.deepseek_api_key;
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

  claudeKeyInput.addEventListener('input', () => {
    if (!statusDiv.classList.contains('hidden')) {
      statusDiv.classList.add('hidden');
    }
  });

  deepseekKeyInput.addEventListener('input', () => {
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

  claudeModelSelect.addEventListener('change', () => {
    if (!statusDiv.classList.contains('hidden')) {
      statusDiv.classList.add('hidden');
    }
  });

  deepseekModelSelect.addEventListener('change', () => {
    if (!statusDiv.classList.contains('hidden')) {
      statusDiv.classList.add('hidden');
    }
  });
}); 