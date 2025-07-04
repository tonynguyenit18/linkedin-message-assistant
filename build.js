#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building LinkedIn Message Assistant Extension for Chrome Web Store...\n');

// Configuration
const config = {
  extensionName: 'social-content-assistant',
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
  
  const releaseNotes = `# LinkedIn Message Assistant v${config.version}

## What's New

- **Multi-AI Provider Support**: Now supports OpenAI GPT, Google Gemini, Anthropic Claude, and DeepSeek
- **Latest Models**: Updated to support the newest AI models (June 2025)
- **Quick Reply Integration**: Seamlessly integrated Accept/Reject buttons in LinkedIn's quick replies section
- **Enhanced UI**: Modern, LinkedIn-styled interface with smooth animations
- **Better Context Analysis**: Improved conversation history analysis for more relevant responses
- **Mobile Support**: Fully responsive design for mobile devices

## Supported AI Providers

### OpenAI (GPT)
- GPT-4o (Latest & Best Quality)
- GPT-4o Mini (Fast & Cost-effective)
- GPT-4 Turbo (Previous Best)
- GPT-4 (High Quality)
- GPT-3.5 Turbo (Legacy)

### Google Gemini
- Gemini 2.0 Flash (Latest & Fast)
- Gemini 2.0 Pro (Latest & Best Quality)
- Gemini 1.5 Flash (Previous Fast)
- Gemini 1.5 Pro (Previous Best)
- Gemini Pro (Legacy)

### Anthropic (Claude)
- Claude 3.5 Sonnet (Latest & Best)
- Claude 3.5 Haiku (Fast & Efficient)
- Claude 3 Opus (Previous Best)
- Claude 3 Sonnet (Previous Standard)

### DeepSeek
- DeepSeek Chat (Latest & Best)
- DeepSeek Coder (Code-Focused)
- DeepSeek Chat 33B (Fast)
- DeepSeek Coder 33B (Fast Code)

## How to Use

1. Install the extension
2. Configure your preferred AI provider and API key
3. Go to LinkedIn and open any conversation
4. Look for the Accept/Reject buttons in the quick replies section
5. Click to generate professional responses

## Security & Privacy

- All API keys are stored locally in your browser
- No conversation data is sent to third-party servers
- Direct API calls to your chosen provider only

---

**Note**: This extension requires API keys from the respective AI providers. Get your API keys from:
- OpenAI: https://platform.openai.com/
- Gemini: https://makersuite.google.com/app/apikey
- Claude: https://console.anthropic.com/
- DeepSeek: https://platform.deepseek.com/
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