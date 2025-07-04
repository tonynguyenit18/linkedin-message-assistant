# LinkedIn Message Assistant

A Chrome extension that uses AI to generate professional responses for LinkedIn messages. The extension integrates seamlessly with LinkedIn's messaging interface and provides intelligent, context-aware responses using multiple AI providers with quick reply buttons.

## Features

- 🤖 **Multi-AI Support**: Choose between OpenAI GPT, Google Gemini, Anthropic Claude, and DeepSeek models
- 🎯 **Quick Reply Buttons**: Professional Accept/Reject buttons integrated into LinkedIn's quick replies section
- 🔒 **Secure**: Your API keys are stored locally and never shared
- 🎯 **Context-Aware**: Analyzes conversation history for relevant responses
- 💼 **Professional**: Maintains LinkedIn's professional tone
- ⚡ **Fast**: Quick response generation with multiple model options
- 🎨 **Beautiful UI**: Modern, LinkedIn-styled interface with animations
- 📱 **Responsive**: Works perfectly on desktop and mobile devices

## 🚀 Features

### 🤖 AI-Powered Response Generation
- **Multi-Provider Support**: Choose between OpenAI GPT, Google Gemini, Anthropic Claude, and DeepSeek
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
- **Provider Selection**: Switch between OpenAI, Gemini, Claude, and DeepSeek
- **Model Selection**: Choose from multiple AI models
- **API Key Management**: Secure storage of your API keys
- **Real-time Updates**: Settings apply immediately

## Supported AI Providers

### OpenAI (GPT)
- **GPT-4o**: Latest and best quality model (June 2025)
- **GPT-4o Mini**: Fast and cost-effective (June 2025)
- **GPT-4 Turbo**: Previous best model
- **GPT-4**: High quality responses
- **GPT-3.5 Turbo**: Legacy model

### Google Gemini
- **Gemini 2.0 Flash**: Latest and fastest model (June 2025)
- **Gemini 2.0 Pro**: Latest and best quality model (June 2025)
- **Gemini 1.5 Flash**: Previous fast model
- **Gemini 1.5 Pro**: Previous best quality model
- **Gemini Pro**: Legacy model

### Anthropic (Claude)
- **Claude 3.5 Sonnet**: Latest and best quality model (June 2025)
- **Claude 3.5 Haiku**: Fast and efficient model (June 2025)
- **Claude 3 Opus**: Previous best model
- **Claude 3 Sonnet**: Previous standard model

### DeepSeek
- **DeepSeek Chat**: Latest and best quality model (June 2025)
- **DeepSeek Coder**: Code-focused model (June 2025)
- **DeepSeek Chat 33B**: Fast model
- **DeepSeek Coder 33B**: Fast code-focused model

## Installation

### Prerequisites

1. **API Key**: You'll need an API key from one of the supported providers:
   - **OpenAI**: Sign up at [OpenAI Platform](https://platform.openai.com/)
   - **Gemini**: Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - **Claude**: Get API key from [Anthropic Console](https://console.anthropic.com/)
   - **DeepSeek**: Get API key from [DeepSeek Platform](https://platform.deepseek.com/)

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
   - Choose your preferred AI provider (OpenAI, Gemini, Claude, or DeepSeek)
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
2. **Choose Provider**: Select OpenAI, Google Gemini, Claude, or DeepSeek
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

| Feature | OpenAI GPT | Google Gemini | Anthropic Claude | DeepSeek |
|---------|------------|---------------|------------------|----------|
| **Speed** | Fast (GPT-4o Mini) to Moderate (GPT-4o) | Very Fast (Flash) to Fast (Pro) | Fast (Haiku) to Moderate (Sonnet) | Fast (33B) to Moderate (Chat) |
| **Quality** | Excellent | Very Good | Excellent | Excellent |
| **Cost** | Pay-per-use | Free tier available | Pay-per-use | Pay-per-use |
| **Availability** | Global | Global | Global | Global |
| **Model Variety** | 5 models | 5 models | 4 models | 4 models |

## Security & Privacy

- 🔐 **Local Storage**: Your API keys are stored locally in Chrome's sync storage
- 🚫 **No Data Collection**: The extension doesn't collect or store your messages
- 🔒 **Secure API Calls**: All API calls are made directly to the selected provider
- 🛡️ **Privacy First**: No conversation data is sent to any third-party servers

## Troubleshooting

### Common Issues

1. **"No API key found"**
   - Make sure you've entered your API key in the extension popup
   - Verify the API key format (OpenAI: starts with "sk-", Gemini: starts with "AIza", Claude: starts with "sk-ant", DeepSeek: starts with "sk-")

2. **"API key test failed"**
   - Check that your API key is valid and has sufficient credits
   - Ensure you have access to the selected model
   - For Gemini, make sure you're using the correct API key from Google AI Studio
   - For Claude, make sure you're using the correct API key from Anthropic Console
   - For DeepSeek, make sure you're using the correct API key from DeepSeek Platform

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

### Building the Extension

```bash
npm install
npm run build
```

### Project Structure

```
linkedin-message-assistant/
├── manifest.json          # Extension manifest
├── content.js             # Content script for LinkedIn integration
├── popup.html             # Extension popup interface
├── popup.js               # Popup functionality
├── background.js          # Background service worker
├── styles.css             # Styling for injected elements
├── icons/                 # Extension icons
├── build.js               # Build script
└── package.json           # Project dependencies
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, please open an issue on GitHub or contact the maintainer.

---

Built with ❤️ for LinkedIn professionals 