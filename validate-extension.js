#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating LinkedIn Message Assistant Extension (with Floating Button & Gemini support)...\n');

// Required files for the extension
const requiredFiles = [
    'manifest.json',
    'content.js',
    'popup.html',
    'popup.js',
    'background.js',
    'styles.css'
];

// Required icon files
const requiredIcons = [
    'icons/icon16.png',
    'icons/icon48.png',
    'icons/icon128.png'
];

let allValid = true;

// Check required files
console.log('📁 Checking required files:');
requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`  ✅ ${file}`);
    } else {
        console.log(`  ❌ ${file} - MISSING`);
        allValid = false;
    }
});

// Check icon files
console.log('\n🎨 Checking icon files:');
requiredIcons.forEach(icon => {
    if (fs.existsSync(icon)) {
        const stats = fs.statSync(icon);
        if (stats.size > 10) { // Basic check if file has content
            console.log(`  ✅ ${icon}`);
        } else {
            console.log(`  ⚠️  ${icon} - Placeholder file (consider creating proper icon)`);
        }
    } else {
        console.log(`  ❌ ${icon} - MISSING`);
        allValid = false;
    }
});

// Validate manifest.json
console.log('\n📋 Validating manifest.json:');
try {
    const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
    
    // Check required manifest fields
    const requiredFields = ['manifest_version', 'name', 'version', 'permissions'];
    requiredFields.forEach(field => {
        if (manifest[field]) {
            console.log(`  ✅ ${field}: ${manifest[field]}`);
        } else {
            console.log(`  ❌ ${field} - MISSING`);
            allValid = false;
        }
    });
    
    // Check content scripts
    if (manifest.content_scripts && manifest.content_scripts.length > 0) {
        console.log(`  ✅ content_scripts: ${manifest.content_scripts.length} script(s)`);
    } else {
        console.log(`  ❌ content_scripts - MISSING`);
        allValid = false;
    }
    
    // Check permissions
    const requiredPermissions = ['activeTab', 'storage'];
    requiredPermissions.forEach(permission => {
        if (manifest.permissions && manifest.permissions.includes(permission)) {
            console.log(`  ✅ permission: ${permission}`);
        } else {
            console.log(`  ❌ permission: ${permission} - MISSING`);
            allValid = false;
        }
    });
    
} catch (error) {
    console.log(`  ❌ manifest.json - INVALID JSON: ${error.message}`);
    allValid = false;
}

// Check for AI Provider Support
console.log('\n🤖 Checking AI Provider Support:');
try {
    const contentScript = fs.readFileSync('content.js', 'utf8');
    
    // Check for OpenAI support
    if (contentScript.includes('callOpenAI') && contentScript.includes('openai.com')) {
        console.log('  ✅ OpenAI support detected');
    } else {
        console.log('  ❌ OpenAI support missing');
        allValid = false;
    }
    
    // Check for Gemini support
    if (contentScript.includes('callGemini') && contentScript.includes('generativelanguage.googleapis.com')) {
        console.log('  ✅ Gemini support detected');
    } else {
        console.log('  ❌ Gemini support missing');
        allValid = false;
    }
    
    // Check for provider selection
    if (contentScript.includes('provider') && contentScript.includes('geminiApiKey')) {
        console.log('  ✅ Multi-provider support detected');
    } else {
        console.log('  ❌ Multi-provider support missing');
        allValid = false;
    }
    
} catch (error) {
    console.log(`  ❌ Error reading content script: ${error.message}`);
    allValid = false;
}

// Check content script for floating button features
console.log('\n🎯 Checking Floating Button Features:');
let contentScript = '';
try {
    contentScript = fs.readFileSync('content.js', 'utf8');
    
    // Check for floating button creation
    if (contentScript.includes('createFloatingButton') && contentScript.includes('linkedin-ai-floating-btn')) {
        console.log('  ✅ Floating button creation detected');
    } else {
        console.log('  ❌ Floating button creation missing');
        allValid = false;
    }
    
    // Check for draggable functionality
    if (contentScript.includes('makeDraggable') && contentScript.includes('dragStart')) {
        console.log('  ✅ Draggable functionality detected');
    } else {
        console.log('  ❌ Draggable functionality missing');
        allValid = false;
    }
    
    // Check for visibility management
    if (contentScript.includes('updateButtonVisibility') && contentScript.includes('isMessagingPage')) {
        console.log('  ✅ Button visibility management detected');
    } else {
        console.log('  ❌ Button visibility management missing');
        allValid = false;
    }
    
    // Check for loading states
    if (contentScript.includes('setButtonLoading') && contentScript.includes('Generating...')) {
        console.log('  ✅ Loading state management detected');
    } else {
        console.log('  ❌ Loading state management missing');
        allValid = false;
    }

    // Check for quick reply buttons functionality
    console.log('\n🎯 Checking Quick Reply Buttons Features:');
    
    const quickReplyChecks = [
        { name: 'Quick reply buttons injection', pattern: /injectQuickReplyButtons\(\)/ },
        { name: 'Accept button creation', pattern: /linkedin-ai-accept-btn/ },
        { name: 'Reject button creation', pattern: /linkedin-ai-reject-btn/ },
        { name: 'Accept message handler', pattern: /handleAcceptMessage\(\)/ },
        { name: 'Reject message handler', pattern: /handleRejectMessage\(\)/ },
        { name: 'Accept response generation', pattern: /generateAcceptResponse\(/ },
        { name: 'Reject response generation', pattern: /generateRejectResponse\(/ },
        { name: 'Accept prompt builder', pattern: /buildAcceptPrompt\(/ },
        { name: 'Reject prompt builder', pattern: /buildRejectPrompt\(/ },
        { name: 'Quick reply container', pattern: /linkedin-ai-quick-reply-container/ }
    ];

    quickReplyChecks.forEach(check => {
        const found = check.pattern.test(contentScript);
        console.log(`  ${found ? '✅' : '❌'} ${check.name}`);
        if (!found) missingFeatures.push(check.name);
    });
    
} catch (error) {
    console.log(`  ❌ Error reading content script: ${error.message}`);
    allValid = false;
}

// Check popup for provider UI
console.log('\n🎛️  Checking Provider UI:');
try {
    const popupHtml = fs.readFileSync('popup.html', 'utf8');
    
    // Check for provider selection UI
    if (popupHtml.includes('provider') && popupHtml.includes('openai') && popupHtml.includes('gemini')) {
        console.log('  ✅ Provider selection UI detected');
    } else {
        console.log('  ❌ Provider selection UI missing');
        allValid = false;
    }
    
    // Check for API key fields
    if (popupHtml.includes('openaiKey') && popupHtml.includes('geminiKey')) {
        console.log('  ✅ Multi-provider API key fields detected');
    } else {
        console.log('  ❌ Multi-provider API key fields missing');
        allValid = false;
    }
    
    // Check for model selection
    if (popupHtml.includes('openaiModel') && popupHtml.includes('geminiModel')) {
        console.log('  ✅ Multi-provider model selection detected');
    } else {
        console.log('  ❌ Multi-provider model selection missing');
        allValid = false;
    }
    
} catch (error) {
    console.log(`  ❌ Error reading popup HTML: ${error.message}`);
    allValid = false;
}

// Check CSS for floating button styles
console.log('\n🎨 Checking Floating Button Styles:');
let styles = '';
try {
    styles = fs.readFileSync('styles.css', 'utf8');
    
    // Check for floating button CSS
    if (styles.includes('.linkedin-ai-floating-button') && styles.includes('position: fixed')) {
        console.log('  ✅ Floating button styles detected');
    } else {
        console.log('  ❌ Floating button styles missing');
        allValid = false;
    }
    
    // Check for responsive design
    if (styles.includes('@media (max-width: 768px)') && styles.includes('@media (max-width: 480px)')) {
        console.log('  ✅ Responsive design detected');
    } else {
        console.log('  ❌ Responsive design missing');
        allValid = false;
    }
    
    // Check for animations
    if (styles.includes('@keyframes pulse') && styles.includes('@keyframes spin')) {
        console.log('  ✅ Animation styles detected');
    } else {
        console.log('  ❌ Animation styles missing');
        allValid = false;
    }
    
    // Check for tooltip styles
    if (styles.includes('.floating-button-tooltip') && styles.includes('opacity: 0')) {
        console.log('  ✅ Tooltip styles detected');
    } else {
        console.log('  ❌ Tooltip styles missing');
        allValid = false;
    }

    // Check for quick reply button styles
    console.log('\n🎨 Checking Quick Reply Button Styles:');
    
    const quickReplyStyleChecks = [
        { name: 'Quick reply container styles', pattern: /\.linkedin-ai-quick-reply-container/ },
        { name: 'Quick reply button styles', pattern: /\.linkedin-ai-quick-reply-btn/ },
        { name: 'Accept button styles', pattern: /\.linkedin-ai-accept-btn/ },
        { name: 'Reject button styles', pattern: /\.linkedin-ai-reject-btn/ },
        { name: 'Quick reply hover effects', pattern: /\.linkedin-ai-quick-reply-btn:hover/ },
        { name: 'Quick reply loading states', pattern: /\.linkedin-ai-quick-reply-btn\.loading/ },
        { name: 'Quick reply mobile responsive', pattern: /@media.*max-width.*768px.*linkedin-ai-quick-reply/ },
        { name: 'Quick reply dark mode support', pattern: /@media.*prefers-color-scheme.*dark.*linkedin-ai-quick-reply/ }
    ];

    quickReplyStyleChecks.forEach(check => {
        const found = check.pattern.test(styles);
        console.log(`  ${found ? '✅' : '❌'} ${check.name}`);
        if (!found) missingFeatures.push(check.name);
    });
    
} catch (error) {
    console.log(`  ❌ Error reading styles: ${error.message}`);
    allValid = false;
}

// Check file sizes
console.log('\n📊 File sizes:');
const filesToCheck = [...requiredFiles, ...requiredIcons];
filesToCheck.forEach(file => {
    if (fs.existsSync(file)) {
        const stats = fs.statSync(file);
        const sizeKB = (stats.size / 1024).toFixed(2);
        console.log(`  📄 ${file}: ${sizeKB} KB`);
    }
});

// Summary
console.log('\n' + '='.repeat(70));
if (allValid) {
    console.log('🎉 Extension validation PASSED!');
    console.log('\n✅ Ready to load in Chrome:');
    console.log('1. Open chrome://extensions/');
    console.log('2. Enable "Developer mode"');
    console.log('3. Click "Load unpacked"');
    console.log('4. Select this folder');
} else {
    console.log('❌ Extension validation FAILED!');
    console.log('Please fix the issues above before loading the extension.');
}

console.log('\n📚 Next steps:');
console.log('1. Get API keys:');
console.log('   - OpenAI: https://platform.openai.com/');
console.log('   - Gemini: https://makersuite.google.com/app/apikey');
console.log('2. Load extension in Chrome');
console.log('3. Configure API keys in extension popup');
console.log('4. Choose your preferred AI provider');
console.log('5. Test on LinkedIn messaging pages');
console.log('6. Look for the floating AI Response button');
console.log('7. See TESTING.md for detailed testing guide');

console.log('\n🤖 Supported AI Providers:');
console.log('  • OpenAI (GPT-3.5 Turbo, GPT-4, GPT-4 Turbo)');
console.log('  • Google Gemini (1.5 Flash, 1.5 Pro, Pro)');

console.log('\n🎯 New Floating Button Features:');
console.log('  • Draggable floating button on LinkedIn pages');
console.log('  • Smart visibility (only shows on messaging pages)');
console.log('  • Loading states and animations');
console.log('  • Responsive design for mobile');
console.log('  • Tooltip with helpful information'); 