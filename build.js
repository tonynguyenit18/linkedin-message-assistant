#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building Social Content Assistant Extension for Chrome Web Store...\n');

// Configuration
const config = {
  extensionName: 'linkedin-message-assistant',
  version: '1.0.0',
  buildDir: 'dist',
  sourceDir: '.',
  excludePatterns: [
    'node_modules/**',
    '.git/**',
    '.gitignore',
    '*.log',
    '*.md',
    'validate-extension.js',
    'build.js',
    'RESPONSE_INSERTION.md',
    'TESTING.md',
    'BUILD_AND_TEST.md',
    '.DS_Store',
    'Thumbs.db',
    '*.zip',
    'dist/**'
  ]
};

// Create build directory
function createBuildDir() {
  console.log('📁 Creating build directory...');
  if (fs.existsSync(config.buildDir)) {
    fs.rmSync(config.buildDir, { recursive: true, force: true });
  }
  fs.mkdirSync(config.buildDir);
}

// Copy files to build directory
function copyFiles() {
  console.log('📋 Copying extension files...');
  
  const filesToCopy = [
    'manifest.json',
    'content.js',
    'popup.html',
    'popup.js',
    'background.js',
    'styles.css'
  ];
  
  filesToCopy.forEach(file => {
    if (fs.existsSync(file)) {
      fs.copyFileSync(file, path.join(config.buildDir, file));
      console.log(`  ✅ ${file}`);
    } else {
      console.log(`  ❌ ${file} - File not found`);
    }
  });
  
  // Copy icons directory
  if (fs.existsSync('icons')) {
    fs.cpSync('icons', path.join(config.buildDir, 'icons'), { recursive: true });
    console.log('  ✅ icons/');
  } else {
    console.log('  ⚠️  icons/ - Directory not found');
  }
}

// Validate manifest
function validateManifest() {
  console.log('\n🔍 Validating manifest.json...');
  try {
    const manifestPath = path.join(config.buildDir, 'manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    const requiredFields = ['manifest_version', 'name', 'version', 'permissions'];
    const missingFields = requiredFields.filter(field => !manifest[field]);
    
    if (missingFields.length > 0) {
      console.log(`  ❌ Missing required fields: ${missingFields.join(', ')}`);
      return false;
    }
    
    console.log(`  ✅ Manifest version: ${manifest.manifest_version}`);
    console.log(`  ✅ Extension name: ${manifest.name}`);
    console.log(`  ✅ Version: ${manifest.version}`);
    console.log(`  ✅ Permissions: ${manifest.permissions.join(', ')}`);
    
    return true;
  } catch (error) {
    console.log(`  ❌ Error validating manifest: ${error.message}`);
    return false;
  }
}

// Create ZIP file
function createZip() {
  console.log('\n📦 Creating ZIP file...');
  
  const zipName = `${config.extensionName}-v${config.version}.zip`;
  const zipPath = path.join(config.buildDir, zipName);
  
  try {
    // Change to build directory
    const originalCwd = process.cwd();
    process.chdir(config.buildDir);
    
    // Create ZIP using system command
    const files = fs.readdirSync('.').filter(file => !file.endsWith('.zip'));
    const zipCommand = `zip -r "${zipName}" ${files.join(' ')}`;
    
    execSync(zipCommand, { stdio: 'inherit' });
    
    // Change back to original directory
    process.chdir(originalCwd);
    
    const zipStats = fs.statSync(zipPath);
    const zipSizeKB = (zipStats.size / 1024).toFixed(2);
    
    console.log(`  ✅ ZIP created: ${zipName}`);
    console.log(`  📊 Size: ${zipSizeKB} KB`);
    
    return zipPath;
  } catch (error) {
    console.log(`  ❌ Error creating ZIP: ${error.message}`);
    return null;
  }
}

// Generate release notes
function generateReleaseNotes() {
  console.log('\n📝 Generating release notes...');
  
  const releaseNotes = `# Social Content Assistant v${config.version}

## 🚀 Features

### 🤖 AI-Powered Response Generation
- Multi-Provider Support: Choose between OpenAI GPT and Google Gemini
- Context-Aware: Analyzes conversation history for relevant responses
- Professional Tone: Generates LinkedIn-appropriate messages
- Smart Typing: Simulates natural typing to activate send button

### 🎯 Quick Reply Buttons
- Send Positive Reply: Generate professional acceptance responses
- Send Polite Decline: Create polite rejection messages
- Context Integration: Uses conversation history for appropriate responses
- One-Click Generation: Instant response creation with AI

### 🎨 Floating Button Interface
- Draggable: Move the button anywhere on the page
- Smart Visibility: Only appears on LinkedIn messaging pages
- Loading States: Visual feedback during AI processing
- Responsive Design: Works on desktop and mobile devices
- Tooltip: Helpful information on hover

### ⚙️ Configuration Options
- Provider Selection: Switch between OpenAI and Gemini
- Model Selection: Choose from multiple AI models
- API Key Management: Secure storage of your API keys
- Real-time Updates: Settings apply immediately

## 🔧 Technical Details
- Manifest Version: 3
- Permissions: activeTab, storage, scripting
- Supported AI Providers: OpenAI, Google Gemini
- Browser Compatibility: Chrome 88+

## 📋 Installation Instructions
1. Download and extract the ZIP file
2. Open Chrome and go to chrome://extensions/
3. Enable "Developer mode"
4. Click "Load unpacked" and select the extracted folder
5. Configure your API keys in the extension popup
6. Start using on LinkedIn messaging pages

## 🔑 API Keys Required
- OpenAI: https://platform.openai.com/
- Google Gemini: https://makersuite.google.com/app/apikey

## 🐛 Bug Fixes
- Fixed response insertion to properly activate send button
- Improved button styling to match Ant Design
- Enhanced observer logic for better reliability
- Added proper error handling and user feedback

## 📈 Performance Improvements
- Optimized typing simulation for faster response insertion
- Reduced API calls with better caching
- Improved memory usage and cleanup
- Enhanced mobile responsiveness

---
Built with ❤️ for LinkedIn professionals
`;

  const releaseNotesPath = path.join(config.buildDir, 'RELEASE_NOTES.md');
  fs.writeFileSync(releaseNotesPath, releaseNotes);
  console.log('  ✅ RELEASE_NOTES.md generated');
}

// Main build process
function build() {
  try {
    createBuildDir();
    copyFiles();
    
    if (!validateManifest()) {
      console.log('\n❌ Build failed: Invalid manifest');
      process.exit(1);
    }
    
    const zipPath = createZip();
    if (!zipPath) {
      console.log('\n❌ Build failed: Could not create ZIP');
      process.exit(1);
    }
    
    generateReleaseNotes();
    
    console.log('\n🎉 Build completed successfully!');
    console.log('\n📋 Next steps for Chrome Web Store:');
    console.log('1. Go to https://chrome.google.com/webstore/devconsole/');
    console.log('2. Click "Add new item"');
    console.log('3. Upload the ZIP file from the dist/ folder');
    console.log('4. Fill in the store listing details');
    console.log('5. Submit for review');
    
    console.log(`\n📦 Build artifacts:`);
    console.log(`  📁 ${config.buildDir}/ - Build directory`);
    console.log(`  📦 ${path.basename(zipPath)} - Extension ZIP`);
    console.log(`  📝 RELEASE_NOTES.md - Release documentation`);
    
  } catch (error) {
    console.log(`\n❌ Build failed: ${error.message}`);
    process.exit(1);
  }
}

// Run build
build(); 