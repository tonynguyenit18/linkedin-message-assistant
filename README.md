# Social Content Assistant

A Chrome extension that uses AI to generate professional responses for LinkedIn messages. The extension integrates seamlessly with LinkedIn's messaging interface and provides intelligent, context-aware responses using multiple AI providers with quick reply buttons.

## Features

- 🤖 **Multi-AI Support**: Choose between OpenAI GPT and Google Gemini models
- 🎯 **Quick Reply Buttons**: Professional Accept/Reject buttons integrated into LinkedIn's quick replies section
- 🔒 **Secure**: Your API keys are stored locally and never shared
- 🎯 **Context-Aware**: Analyzes conversation history for relevant responses
- 💼 **Professional**: Maintains LinkedIn's professional tone
- ⚡ **Fast**: Quick response generation with multiple model options
- 🎨 **Beautiful UI**: Modern, LinkedIn-styled interface with animations
- 📱 **Responsive**: Works perfectly on desktop and mobile devices

## 🚀 Features

### 🤖 AI-Powered Response Generation
- **Multi-Provider Support**: Choose between OpenAI GPT and Google Gemini
- **Context-Aware**: Analyzes conversation history for relevant responses
- **Professional Tone**: Generates LinkedIn-appropriate messages
- **Smart Typing**: Simulates natural typing to activate send button

### 🎯 Quick Reply Buttons
- **Accept Button**: Generate professional acceptance responses
- **Reject Button**: Create polite rejection messages
- **Context Integration**: Uses conversation history for appropriate responses
- **One-Click Generation**: Instant response creation with AI
- **Integrated UI**: Seamlessly integrated into LinkedIn's existing quick replies section

### ⚙️ Configuration Options
- **Provider Selection**: Switch between OpenAI and Gemini
- **Model Selection**: Choose from multiple AI models
- **API Key Management**: Secure storage of your API keys
- **Real-time Updates**: Settings apply immediately

## Supported AI Providers

### OpenAI (GPT)
- **GPT-3.5 Turbo**: Fast and cost-effective (recommended for most users)
- **GPT-4**: Better quality responses with more nuanced understanding
- **GPT-4 Turbo**: Latest model with the best performance (requires GPT-4 access)

### Google Gemini
- **Gemini 1.5 Flash**: Fast and efficient responses
- **Gemini 1.5 Pro**: Best quality and most capable model
- **Gemini Pro**: Standard model with good performance

## Installation

### Prerequisites

1. **API Key**: You'll need an API key from one of the supported providers:
   - **OpenAI**: Sign up at [OpenAI Platform](https://platform.openai.com/)
   - **Gemini**: Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Install the Extension

1. **Download the Extension**:
   ```bash
   git clone <repository-url>
   cd linkedin-message-assistant
   ```

2. **Load in Chrome**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the extension folder

3. **Configure the Extension**:
   - Click the extension icon in your toolbar
   - Choose your preferred AI provider (OpenAI or Gemini)
   - Enter your API key for the selected provider
   - Select your preferred AI model
   - Click "Save Settings"

## Usage

1. **Navigate to LinkedIn**: Go to [LinkedIn](https://www.linkedin.com/) and log in
2. **Open a Conversation**: Click on any conversation in your messages
3. **Find Quick Reply Section**: 
   - Look for the `conversations-quick-replies` section in the messaging interface
   - The extension automatically injects Accept/Reject buttons into this section
4. **Generate Response**: 
   - Click "Accept" to generate a professional acceptance response
   - Click "Reject" to create a polite rejection message
   - The AI will analyze the conversation context and generate an appropriate response
   - The buttons show a loading state while generating
5. **Review and Send**: Review the generated response and send it

### Quick Reply Button Features

- **🎯 Smart Integration**: Automatically appears in LinkedIn's quick replies section
- **📱 Responsive**: Automatically adjusts size on mobile devices
- **💫 Animations**: Smooth hover effects and loading animations
- **⚡ Loading States**: Visual feedback during response generation
- **🎨 LinkedIn Styled**: Matches LinkedIn's design language perfectly

## 📖 Usage

### 🎯 Quick Reply Buttons
1. **Navigate to LinkedIn Messages**: Go to any LinkedIn conversation
2. **Find Quick Reply Section**: Look for the `conversations-quick-replies` section
3. **Use Accept Button**: Click "Accept" to generate a professional acceptance response
4. **Use Reject Button**: Click "Reject" to create a polite rejection message
5. **Review and Send**: The AI-generated response will be inserted into the message box

### ⚙️ Configuration
1. **Open Extension Popup**: Click the extension icon in your browser
2. **Choose Provider**: Select OpenAI or Google Gemini
3. **Enter API Key**: Add your API key for the selected provider
4. **Select Model**: Choose your preferred AI model
5. **Save Settings**: Your preferences are automatically saved

## How It Works

The extension:

1. **Detects Messaging Pages**: Automatically injects quick reply buttons on LinkedIn messaging pages
2. **Analyzes Context**: Reads the recent conversation history (last 5 messages)
3. **Generates Response**: Uses your selected AI provider to create professional responses
4. **Inserts Response**: Automatically fills the message input with the generated response
5. **Maintains Professionalism**: Ensures responses are LinkedIn-appropriate and engaging

## Provider Comparison

| Feature | OpenAI GPT | Google Gemini |
|---------|------------|---------------|
| **Speed** | Fast (GPT-3.5) to Moderate (GPT-4) | Very Fast (Flash) to Fast (Pro) |
| **Quality** | Excellent | Very Good |
| **Cost** | Pay-per-use | Free tier available |
| **Availability** | Global | Global |
| **Model Variety** | 3 models | 3 models |

## Security & Privacy

- 🔐 **Local Storage**: Your API keys are stored locally in Chrome's sync storage
- 🚫 **No Data Collection**: The extension doesn't collect or store your messages
- 🔒 **Secure API Calls**: All API calls are made directly to the selected provider
- 🛡️ **Privacy First**: No conversation data is sent to any third-party servers

## Troubleshooting

### Common Issues

1. **"No API key found"**
   - Make sure you've entered your API key in the extension popup
   - Verify the API key format (OpenAI: starts with "sk-", Gemini: starts with "AIza")

2. **"API key test failed"**
   - Check that your API key is valid and has sufficient credits
   - Ensure you have access to the selected model
   - For Gemini, make sure you're using the correct API key from Google AI Studio

3. **"No message context found"**
   - Make sure you're in an active LinkedIn conversation
   - Try refreshing the page and clicking the quick reply buttons again

4. **Quick reply buttons not appearing**
   - Make sure you're on a LinkedIn messaging page
   - Check that the extension is enabled
   - Try refreshing the page
   - Look for the `conversations-quick-replies` section

5. **Provider switching issues**
   - Make sure you have a valid API key for the selected provider
   - Try refreshing the page after switching providers
   - Check the console for any error messages

### Getting Help

If you encounter issues:

1. Check the browser console for error messages
2. Verify your API key is valid for the selected provider
3. Ensure you have sufficient API credits/quotas
4. Try refreshing the page
5. Check that you're using the correct API key format

## Development

### Project Structure

```
linkedin-message-assistant/
├── manifest.json          # Extension configuration
├── content.js            # Main content script with quick reply buttons & multi-provider support
├── popup.html            # Settings popup with provider selection
├── popup.js              # Popup functionality
├── background.js         # Background service worker
├── styles.css            # Extension styles with quick reply button animations
├── icons/                # Extension icons
└── README.md             # This file
```

### Local Development

1. Make changes to the code
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension
4. Test your changes on LinkedIn

### Adding New Providers

The extension is designed to be easily extensible. To add a new AI provider:

1. Add provider selection UI in `popup.html`
2. Update `popup.js` to handle the new provider
3. Add API call method in `content.js`
4. Update storage handling in `background.js`

### Quick Reply Button Customization

The quick reply buttons can be customized by modifying:

- **Styling**: Modify colors, size, and animations in `styles.css`
- **Behavior**: Adjust button logic in `content.js`
- **Responsiveness**: Update media queries for different screen sizes
- **Integration**: Modify how buttons are injected into LinkedIn's interface

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This extension is not affiliated with LinkedIn, OpenAI, or Google. Use responsibly and ensure your responses comply with LinkedIn's terms of service and professional standards. 