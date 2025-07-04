const classNames = {
    AI_QUICK_REPLY_BUTTONS_CLASS_NAME: 'linkedin-ai-quick-reply-container',
    MESSAGE_CONTAINER_INPUT_CLASS_NAME: 'msg-form__msg-content-container',
}
// LinkedIn Message Assistant Content Script
class LinkedInMessageAssistant {
  constructor() {
    this.isInitialized = false;
    this.provider = 'openai';
    this.openaiApiKey = null;
    this.geminiApiKey = null;
    this.claudeApiKey = null;
    this.deepseekApiKey = null;
    this.openaiModel = 'gpt-4o';
    this.geminiModel = 'gemini-2.0-flash-exp';
    this.claudeModel = 'claude-3-5-sonnet-20241022';
    this.deepseekModel = 'deepseek-chat';
    this.floatingButton = null;
    this.init();
  }

  async init() {
    // Wait for LinkedIn to load
    await this.waitForLinkedIn();
    
    // Get settings from storage
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
    
    this.provider = result.provider || 'openai';
    this.openaiApiKey = result.openai_api_key;
    this.geminiApiKey = result.gemini_api_key;
    this.claudeApiKey = result.claude_api_key;
    this.deepseekApiKey = result.deepseek_api_key;
    this.openaiModel = result.openai_model || 'gpt-4o';
    this.geminiModel = result.gemini_model || 'gemini-2.0-flash-exp';
    this.claudeModel = result.claude_model || 'claude-3-5-sonnet-20241022';
    this.deepseekModel = result.deepseek_model || 'deepseek-chat';
    
    // Check if we have a valid API key for the selected provider
    const hasValidKey = this.provider === 'openai' ? 
      (this.openaiApiKey && this.openaiApiKey.startsWith('sk-')) :
      this.provider === 'gemini' ?
      (this.geminiApiKey && this.geminiApiKey.startsWith('AIza')) :
      this.provider === 'claude' ?
      (this.claudeApiKey && this.claudeApiKey.startsWith('sk-ant')) :
      (this.deepseekApiKey && this.deepseekApiKey.startsWith('sk-'));
    
    if (!hasValidKey) {
      console.log(`LinkedIn Message Assistant: No valid ${this.provider} API key found. Please set it in the extension popup.`);
      return;
    }

    // TODO: might wannaadd floating button back in the future for more general use
    // this.createFloatingButton();
    this.observeForQuickRepliesSection();
    this.setupMessageObserver();
    this.injectStyles();
    this.isInitialized = true;
    console.log(`LinkedIn Message Assistant initialized with ${this.provider}`);
  }

  async waitForLinkedIn() {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (document.querySelector('[data-testid="messaging-compose-box"]') || 
            document.querySelector('.msg-compose-box') ||
            document.querySelector('[aria-label="Write a message"]') ||
            document.querySelector('.msg-form__contenteditable')) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 1000);
    });
  }

  createFloatingButton() {
    // Remove existing floating button if it exists
    const existingButton = document.getElementById('linkedin-ai-floating-btn');
    if (existingButton) {
      existingButton.remove();
    }

    // Create floating button
    this.floatingButton = document.createElement('div');
    this.floatingButton.id = 'linkedin-ai-floating-btn';
    this.floatingButton.className = 'linkedin-ai-floating-button';
    this.floatingButton.innerHTML = `
      <div class="floating-button-content">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
        <span class="floating-button-text">AI Response</span>
        <span class="floating-button-provider">${this.provider.toUpperCase()}</span>
      </div>
      <div class="floating-button-tooltip">
        Generate AI-powered response for LinkedIn messages
      </div>
    `;
    
    // Add click event
    this.floatingButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.generateResponse();
    });

    // Add to page
    document.body.appendChild(this.floatingButton);

    // Make button draggable
    this.makeDraggable(this.floatingButton);
  }

  makeDraggable(element) {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    const dragStart = (e) => {
      if (e.type === "touchstart") {
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
      } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
      }

      if (e.target === element) {
        isDragging = true;
      }
    };

    const dragEnd = () => {
      initialX = currentX;
      initialY = currentY;
      isDragging = false;
    };

    const drag = (e) => {
      if (isDragging) {
        e.preventDefault();
        
        if (e.type === "touchmove") {
          currentX = e.touches[0].clientX - initialX;
          currentY = e.touches[0].clientY - initialY;
        } else {
          currentX = e.clientX - initialX;
          currentY = e.clientY - initialY;
        }

        xOffset = currentX;
        yOffset = currentY;

        // Constrain to viewport
        const rect = element.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width;
        const maxY = window.innerHeight - rect.height;

        currentX = Math.max(0, Math.min(currentX, maxX));
        currentY = Math.max(0, Math.min(currentY, maxY));

        setTranslate(currentX, currentY, element);
      }
    };

    const setTranslate = (xPos, yPos, el) => {
      el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    };

    // Mouse events
    element.addEventListener("mousedown", dragStart);
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", dragEnd);

    // Touch events
    element.addEventListener("touchstart", dragStart);
    element.addEventListener("touchmove", drag);
    element.addEventListener("touchend", dragEnd);
  }

  setupMessageObserver() {
    // Observe for new message compose boxes to update button visibility
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            this.updateButtonVisibility();
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Initial visibility check
    this.updateButtonVisibility();
  }

  updateButtonVisibility() {
    if (!this.floatingButton) return;

    // Check if we're on a messaging page
    const isMessagingPage = document.querySelector('[data-testid="messaging-compose-box"]') || 
                           document.querySelector('.msg-compose-box') ||
                           document.querySelector('[aria-label="Write a message"]') ||
                           document.querySelector('.msg-form__contenteditable') ||
                           window.location.pathname.includes('/messaging/');

    if (isMessagingPage) {
      this.floatingButton.style.display = 'flex';
    } else {
      this.floatingButton.style.display = 'none';
    }
  }

  async generateResponse() {
    try {
      // Find the current message context
      const messageContext = this.getMessageContext();
      const receiverName = this.getReceiverName();
      
      if (!messageContext) {
        console.log('No message context found');
        return;
      }

      // Show loading state on floating button
      this.setButtonLoading(true);
      
      // Call appropriate API based on provider
      let response;
      if (this.provider === 'openai') {
        response = await this.callOpenAI(messageContext, receiverName);
      } else if (this.provider === 'gemini') {
        response = await this.callGemini(messageContext, receiverName);
      } else if (this.provider === 'claude') {
        response = await this.callClaude(messageContext, receiverName);
      } else if (this.provider === 'deepseek') {
        response = await this.callDeepSeek(messageContext, receiverName);
      }
      
      if (response) {
        this.insertResponse(response);
      }
      
    } catch (error) {
      console.error('Error generating response:', error);
    } finally {
      this.setButtonLoading(false);
    }
  }

  setButtonLoading(loading) {
    if (!this.floatingButton) return;

    if (loading) {
      this.floatingButton.classList.add('loading');
      this.floatingButton.querySelector('.floating-button-text').textContent = 'Generating...';
    } else {
      this.floatingButton.classList.remove('loading');
      this.floatingButton.querySelector('.floating-button-text').textContent = 'AI Response';
    }
  }

  getMessageContext(chatWindow) {
    // Get conversation history
    const messages = [];
    
    // Find message containers
    const messageContainers = chatWindow.querySelectorAll('.msg-s-event-listitem__body');
    
    messageContainers.forEach(container => {
      const rawText = container.innerText;
      if (rawText) {
        const text = rawText.trim();
        if (text) {
          messages.push(text);
        }
      }
    });

    // Get the last few messages for context
    const recentMessages = messages.slice(-5);
    
    return {
      conversation: recentMessages,
      lastMessage: recentMessages[recentMessages.length - 1] || '',
      timestamp: new Date().toISOString()
    };
  }

  getReceiverName(chatWindow) {
    const receiverName = chatWindow.querySelector('.msg-s-message-group__profile-link')?.innerText;
    return receiverName;
  }

  async callOpenAI(context, receiverName) {
    const prompt = this.buildPrompt(context, receiverName);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.openaiApiKey}`
      },
      body: JSON.stringify({
        model: this.openaiModel,
        messages: [
          {
            role: 'system',
            content: 'You are a professional LinkedIn messaging assistant. Generate concise, professional, and engaging responses that maintain a professional tone while being personable. Keep responses under 200 words unless the context requires more detail. Messages should be styled as a LinkedIn message.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  }

    async callGemini(context, receiverName) {
    const prompt = this.buildPrompt(context, receiverName);
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.geminiModel}:generateContent?key=${this.geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a professional LinkedIn messaging assistant. Generate concise, professional, and engaging responses that maintain a professional tone while being personable. Keep responses under 200 words unless the context requires more detail.

${prompt}`
              }
            ]
          }
        ],
        generationConfig: {
          maxOutputTokens: 300,
          temperature: 0.7
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract text from Gemini response
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text.trim();
    } else {
      throw new Error('Invalid response format from Gemini API');
    }
  }

  async callClaude(context, receiverName) {
    const prompt = this.buildPrompt(context, receiverName);
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.claudeApiKey}`,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: this.claudeModel,
        max_tokens: 300,
        messages: [
          {
            role: 'user',
            content: `You are a professional LinkedIn messaging assistant. Generate concise, professional, and engaging responses that maintain a professional tone while being personable. Keep responses under 200 words unless the context requires more detail.

${prompt}`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract text from Claude response
    if (data.content && data.content[0] && data.content[0].text) {
      return data.content[0].text.trim();
    } else {
      throw new Error('Invalid response format from Claude API');
    }
  }

  async callDeepSeek(context, receiverName) {
    const prompt = this.buildPrompt(context, receiverName);
    
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.deepseekApiKey}`
      },
      body: JSON.stringify({
        model: this.deepseekModel,
        messages: [
          {
            role: 'system',
            content: 'You are a professional LinkedIn messaging assistant. Generate concise, professional, and engaging responses that maintain a professional tone while being personable. Keep responses under 200 words unless the context requires more detail.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract text from DeepSeek response
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content.trim();
    } else {
      throw new Error('Invalid response format from DeepSeek API');
    }
  }

  buildPrompt(context, receiverName) {
    const { conversation, lastMessage } = context;
    
    return `
Context: You are helping with a LinkedIn conversation with ${receiverName}. Here's the recent conversation history:

${conversation.map((msg, index) => `${index + 1}. ${msg}`).join('\n')}

Please generate a professional and appropriate response to continue this conversation. The response should be:
- Professional yet personable
- Relevant to the conversation context
- Engaging and likely to receive a response
- Under 200 words
- Natural and conversational
- Check name without emojis

Generate the response:`;
  }

  insertResponse(chatWindow,response) {
    // Find the active message input
    const messageInput = chatWindow.querySelector('[data-testid="messaging-compose-box"]') ||
                        chatWindow.querySelector('.msg-form__contenteditable') ||
                        chatWindow.querySelector('[aria-label="Write a message"]') ||
                        chatWindow.querySelector('[role="textbox"]');
    
    if (messageInput) {
      
      // Clear existing content
      messageInput.textContent = '';
      
      // Focus on the input first
      messageInput.focus();
      
    this.simulateTyping(chatWindow,messageInput, response);
      
      // Show success notification
    } else {
      console.log('No message input found');
    }
  }

  simulateTyping(chatWindow,element, text) {
    let index = 0;
    const typingSpeed = 10; // milliseconds between characters
    
    const typeNextChar = () => {
      if (index < text.length) {
        // Insert the next character
        const char = text[index];
        
        // Method 1: Try using execCommand for contenteditable
        if (element.contentEditable === 'true') {
          document.execCommand('insertText', false, char);
        } else {
          // Method 2: Create and append text node
          const textNode = document.createTextNode(char);
          element.appendChild(textNode);
          
          // Move cursor to end
          const range = document.createRange();
          const selection = window.getSelection();
          range.selectNodeContents(element);
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);
        }
        
        // Trigger multiple events to ensure LinkedIn detects the input
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('keyup', { bubbles: true }));
        element.dispatchEvent(new Event('keydown', { bubbles: true }));
        
        // Also trigger on the parent if it exists
        const parent = element.closest('.msg-form__contenteditable-wrapper') || 
                      element.closest('.msg-compose-box');
        if (parent) {
          parent.dispatchEvent(new Event('input', { bubbles: true }));
        }
        
        index++;
        
        // Continue typing after delay
        setTimeout(typeNextChar, typingSpeed);
      } else {
        // Typing complete - ensure send button is activated
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('keyup', { bubbles: true }));
        
        // Trigger on parent as well
        const parent = element.closest('.msg-form__contenteditable-wrapper') || 
                      element.closest('.msg-compose-box');
        if (parent) {
          parent.dispatchEvent(new Event('input', { bubbles: true }));
          parent.dispatchEvent(new Event('change', { bubbles: true }));
        }
        
        // Keep focus on the input
        element.focus();
        
        // Additional check for send button activation
        setTimeout(() => {
          this.ensureSendButtonActivated(chatWindow,element);
        }, 100);
      }
    };
    
    // Start typing
    typeNextChar();
  }

  // Alternative method using clipboard API (fallback)
  async insertResponseViaClipboard(chatWindow, element, text) {
    try {
      // Save current clipboard content
      const originalClipboard = await navigator.clipboard.readText().catch(() => '');
      
      // Set new text to clipboard
      await navigator.clipboard.writeText(text);
      
      // Focus on element
      element.focus();
      
      // Paste the content
      document.execCommand('paste');
      
      // Restore original clipboard content
      setTimeout(async () => {
        try {
          await navigator.clipboard.writeText(originalClipboard);
        } catch (e) {
          console.log('Could not restore clipboard content');
        }
      }, 1000);
      
      // Trigger events
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
      
    } catch (error) {
      console.log('Clipboard method failed, falling back to typing simulation');
      this.simulateTyping(chatWindow,element, text);
    }
  }

  ensureSendButtonActivated(chatWindow,element) {
    // Look for the send button and check if it's enabled
    const sendButton = chatWindow.querySelector('[data-testid="msg-form__send-button"]') ||
                      chatWindow.querySelector('.msg-form__send-button') ||
                      chatWindow.querySelector('button[aria-label*="Send"]') ||
                      chatWindow.querySelector('button[title*="Send"]');
    
    if (sendButton) {
      // If button is disabled, try to trigger more events
      if (sendButton.disabled || sendButton.classList.contains('disabled')) {
        
        // Trigger additional events
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('keyup', { bubbles: true }));
        
        // Try clicking the input to ensure focus
        element.click();
        element.focus();
        
        // Trigger on parent containers
        const containers = [
          element.closest('.msg-form__contenteditable-wrapper'),
          element.closest('.msg-compose-box'),
          element.closest('[data-testid="messaging-compose-box"]')
        ];
        
        containers.forEach(container => {
          if (container) {
            container.dispatchEvent(new Event('input', { bubbles: true }));
            container.dispatchEvent(new Event('change', { bubbles: true }));
          }
        });
        
        // Check again after a short delay
        setTimeout(() => {
          this.checkSendButtonStatus(sendButton);
        }, 200);
      } else {
        console.log('Send button is already activated!');
      }
    } else {
      console.log('⚠️ Send button not found, but text should be inserted');
    }
  }

  checkSendButtonStatus(sendButton) {
    if (sendButton.disabled || sendButton.classList.contains('disabled')) {
      console.log('⚠️ Send button may need manual activation');
    } else {
      console.log('✅ Send button is now active!');
    }
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `ai-notification ai-notification-${type}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }

  injectStyles() {
    // Styles are handled by styles.css
  }

  observeForQuickRepliesSection() {
    const observer = new MutationObserver((mutations) => {
        const messageContainers = document.querySelectorAll('.msg-convo-wrapper');
       
        if(messageContainers?.length > 0) {
            for (let i = 0; i < messageContainers.length; i++) {
                const messageContainer = messageContainers[i];
                const aiQuickRepliesSection = messageContainer.querySelector(`.${classNames.AI_QUICK_REPLY_BUTTONS_CLASS_NAME}`);
                if(!aiQuickRepliesSection) {
                    console.log('LinkedIn Message Assistant: new chat windows detected. inject quick reply buttons');
                    // Wait a bit for the conversation to fully load, then inject buttons
                    setTimeout(() => {
                        this.injectQuickReplyButtons(messageContainer);
                    }, 500);
                    return;
                }
            }
        }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  injectQuickReplyButtons(chatWindow) {
    // Find the conversations-quick-replies section
    const quickRepliesSection = chatWindow.querySelector(`.${classNames.MESSAGE_CONTAINER_INPUT_CLASS_NAME}`);
    
    if (!quickRepliesSection) {
      console.log('LinkedIn Message Assistant: failed to create buttons .conversations-quick-replies section not found, retrying in 1 second...');
      return;
    }

    this.createQuickReplyButtons(chatWindow,quickRepliesSection);
  }

  createQuickReplyButtons(chatWindow,quickRepliesSection) {
    // Remove existing buttons if they exist
    const existingContainer = chatWindow.querySelector(`.${classNames.AI_QUICK_REPLY_BUTTONS_CLASS_NAME}`);
        
    if (existingContainer) {
        console.log('LinkedIn Message Assistant: AI quick reply buttons already exist, skipping...');
        return;
    }

    // Create Accept button with Ant Design styling
    const acceptButton = document.createElement('button');
    acceptButton.id = 'linkedin-ai-accept-btn';
    acceptButton.className = 'linkedin-ai-quick-reply-btn linkedin-ai-accept-btn ant-btn ant-btn-primary';
    acceptButton.innerHTML = `
      <span class="ant-btn-icon">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
      </span>
      <span class="ant-btn-text">Send Positive Reply</span>
    `;
    acceptButton.title = 'Generate professional acceptance response';
    acceptButton.setAttribute('type', 'button');
    
    // Create Reject button with Ant Design styling
    const rejectButton = document.createElement('button');
    rejectButton.id = 'linkedin-ai-reject-btn';
    rejectButton.className = 'linkedin-ai-quick-reply-btn linkedin-ai-reject-btn ant-btn ant-btn-default';
    rejectButton.innerHTML = `
      <span class="ant-btn-icon">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </span>
      <span class="ant-btn-text">Send Polite Decline</span>
    `;
    rejectButton.title = 'Generate polite rejection response';
    rejectButton.setAttribute('type', 'button');

    // Add click events
    acceptButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.handleAcceptMessage(chatWindow);
    });

    rejectButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.handleRejectMessage(chatWindow);
    });

    // Create button container with Ant Design spacing
    const buttonContainer = document.createElement('div');
    buttonContainer.className = `${classNames.AI_QUICK_REPLY_BUTTONS_CLASS_NAME} ant-space ant-space-horizontal ant-space-align-center`;
    buttonContainer.setAttribute('data-testid', classNames.AI_QUICK_REPLY_BUTTONS_CLASS_NAME);
    
    // Create individual space items for proper Ant Design spacing
    const acceptSpaceItem = document.createElement('div');
    acceptSpaceItem.className = 'ant-space-item';
    acceptSpaceItem.appendChild(acceptButton);
    
    const rejectSpaceItem = document.createElement('div');
    rejectSpaceItem.className = 'ant-space-item';
    rejectSpaceItem.appendChild(rejectButton);
    
    buttonContainer.appendChild(acceptSpaceItem);
    buttonContainer.appendChild(rejectSpaceItem);

    // Insert at the beginning of the quick replies section, but after any existing LinkedIn content
    const lastChild = quickRepliesSection.lastChild;
    if (lastChild) {
      quickRepliesSection.insertBefore(buttonContainer,lastChild);
    } else {
      quickRepliesSection.appendChild(buttonContainer);
    }
  }

  handleAcceptMessage(chatWindow) {
    // Get current conversation context
    const messageContext = this.getMessageContext(chatWindow);
    const receiverName = this.getReceiverName(chatWindow);
    
    if (!messageContext) {
      console.log('No conversation context found');
      return;
    }

    // Generate an accepting response
    this.generateAcceptResponse(chatWindow,messageContext, receiverName);
  }

  handleRejectMessage(chatWindow) {
    // Get current conversation context
    const messageContext = this.getMessageContext(chatWindow);
    const receiverName = this.getReceiverName(chatWindow);
    
    if (!messageContext) {
      console.log('No conversation context found');
      return;
    }

    // Generate a polite rejection response
    this.generateRejectResponse(chatWindow,messageContext, receiverName);
  }

  async generateAcceptResponse(chatWindow,context, receiverName) {
    this.setQuickReplyButtonLoading(chatWindow,true);
    
    try {
      const prompt = this.buildAcceptPrompt(chatWindow,context, receiverName);
      let response;
      
      if (this.provider === 'openai') {
        response = await this.callOpenAIWithPrompt(prompt);
      } else if (this.provider === 'gemini') {
        response = await this.callGeminiWithPrompt(prompt);
      } else if (this.provider === 'claude') {
        response = await this.callClaudeWithPrompt(prompt);
      } else if (this.provider === 'deepseek') {
        response = await this.callDeepSeekWithPrompt(prompt);
      }
      
      this.insertResponse(chatWindow,response);
    } catch (error) {
      console.error('Error generating acceptance response:', error);
    } finally {
      this.setQuickReplyButtonLoading(chatWindow,false);
    }
  }

  async generateRejectResponse(chatWindow,context, receiverName) {
    this.setQuickReplyButtonLoading(chatWindow,true);
    
    try {
      const prompt = this.buildRejectPrompt(chatWindow,context, receiverName);
      let response;
      
      if (this.provider === 'openai') {
        response = await this.callOpenAIWithPrompt(prompt);
      } else if (this.provider === 'gemini') {
        response = await this.callGeminiWithPrompt(prompt);
      } else if (this.provider === 'claude') {
        response = await this.callClaudeWithPrompt(prompt);
      } else if (this.provider === 'deepseek') {
        response = await this.callDeepSeekWithPrompt(prompt);
      }
      
      this.insertResponse(chatWindow,response);
    } catch (error) {
      console.error('Error generating rejection response:', error);
    } finally {
      this.setQuickReplyButtonLoading(chatWindow,false);
    }
  }

  setQuickReplyButtonLoading(chatWindow,loading) {
    const acceptBtn = chatWindow.querySelector('#linkedin-ai-accept-btn');
    const rejectBtn = chatWindow.querySelector('#linkedin-ai-reject-btn');
    
    if (acceptBtn) {
      if (loading) {
        acceptBtn.classList.add('loading');
        acceptBtn.disabled = true;
        acceptBtn.querySelector('.ant-btn-text').textContent = 'Generating...';
      } else {
        acceptBtn.classList.remove('loading');
        acceptBtn.disabled = false;
        acceptBtn.querySelector('.ant-btn-text').textContent = 'Send Positive Reply';
      }
    }
    
    if (rejectBtn) {
      if (loading) {
        rejectBtn.classList.add('loading');
        rejectBtn.disabled = true;
        rejectBtn.querySelector('.ant-btn-text').textContent = 'Generating...';
      } else {
        rejectBtn.classList.remove('loading');
        rejectBtn.disabled = false;
        rejectBtn.querySelector('.ant-btn-text').textContent = 'Send Polite Decline';
      }
    }
  }

  buildAcceptPrompt(chatWindow,context, receiverName) {
    const { conversation, lastMessage } = context;
    
    return `
Context: You are helping with a LinkedIn conversation with ${receiverName}. The user wants to accept/agree to something in this conversation. Here's the recent conversation history:

${conversation.map((msg, index) => `${index + 1}. ${msg}`).join('\n')}

Last message: "${lastMessage}"

Instructions: Generate a professional, accepting response that:
- Shows agreement or acceptance
- Maintains a positive, professional tone
- Is concise and clear
- Under 150 words
- Natural and conversational
- Professional LinkedIn style

Generate the acceptance response:`;
  }

  buildRejectPrompt(chatWindow,context, receiverName) {
    const { conversation, lastMessage } = context;
    
    return `
Context: You are helping with a LinkedIn conversation with ${receiverName}. The user wants to politely decline/reject something in this conversation. Here's the recent conversation history:

${conversation.map((msg, index) => `${index + 1}. ${msg}`).join('\n')}

Last message: "${lastMessage}"

Instructions: Generate a professional, polite rejection response that:
- Politely declines or rejects the request/offer
- Maintains a respectful, professional tone
- Provides a brief reason if appropriate
- Is concise and clear
- Under 150 words
- Natural and conversational
- Professional LinkedIn style

Generate the polite rejection response:`;
  }

  async callOpenAIWithPrompt(prompt) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.openaiApiKey}`
      },
      body: JSON.stringify({
        model: this.openaiModel,
        messages: [
          {
            role: 'system',
            content: 'You are a professional LinkedIn messaging assistant. Generate concise, professional, and engaging responses that maintain a professional tone while being personable. Keep responses under 150 words unless the context requires more detail. Messages should be styled as a LinkedIn message.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  }

  async callGeminiWithPrompt(prompt) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.geminiModel}:generateContent?key=${this.geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          maxOutputTokens: 300,
          temperature: 0.7
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text.trim();
  }

  async callClaudeWithPrompt(prompt) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.claudeApiKey}`,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: this.claudeModel,
        max_tokens: 300,
        messages: [
          {
            role: 'user',
            content: `You are a professional LinkedIn messaging assistant. Generate concise, professional, and engaging responses that maintain a professional tone while being personable. Keep responses under 150 words unless the context requires more detail.

${prompt}`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text.trim();
  }

  async callDeepSeekWithPrompt(prompt) {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.deepseekApiKey}`
      },
      body: JSON.stringify({
        model: this.deepseekModel,
        messages: [
          {
            role: 'system',
            content: 'You are a professional LinkedIn messaging assistant. Generate concise, professional, and engaging responses that maintain a professional tone while being personable. Keep responses under 150 words unless the context requires more detail.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  }
}

// Initialize the assistant when the page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new LinkedInMessageAssistant();
  });
} else {
  new LinkedInMessageAssistant();
} 