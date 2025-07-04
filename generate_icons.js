const fs = require('fs');
const { createCanvas } = require('canvas');

// LinkedIn Message Assistant icon design function
function createIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, size, size);
    
    // Calculate scaling factors
    const scale = size / 128;
    const padding = 10 * scale;
    const iconSize = size - (padding * 2);
    
    // Create red background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, size, size);
    bgGradient.addColorStop(0, '#F8333C'); // Red background
    bgGradient.addColorStop(1, '#E0242A'); // Slightly darker red
    
    // Draw rounded square background
    ctx.fillStyle = bgGradient;
    ctx.beginPath();
    ctx.roundRect(padding, padding, iconSize, iconSize, 10 * scale);
    ctx.fill();
    
    // Create message bubble design
    const bubbleWidth = 16 * scale;
    const bubbleHeight = 12 * scale;
    const bubbleX = size / 2 - bubbleWidth / 2;
    const bubbleY = size / 2 - bubbleHeight / 2;
    
    // Draw main message bubble
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, 4 * scale);
    ctx.fill();
    
    // Draw message bubble tail
    ctx.beginPath();
    ctx.moveTo(bubbleX + bubbleWidth / 2 - 2 * scale, bubbleY + bubbleHeight);
    ctx.lineTo(bubbleX + bubbleWidth / 2, bubbleY + bubbleHeight + 3 * scale);
    ctx.lineTo(bubbleX + bubbleWidth / 2 + 2 * scale, bubbleY + bubbleHeight);
    ctx.fill();
    
    // Draw AI neural network pattern inside the bubble
    ctx.strokeStyle = '#F8333C';
    ctx.lineWidth = 1.5 * scale;
    ctx.lineCap = 'round';
    
    // Draw horizontal lines representing AI processing
    const lineSpacing = 2 * scale;
    const lineLength = 6 * scale;
    const centerX = size / 2;
    const centerY = size / 2;
    
    // Three horizontal lines
    for (let i = 0; i < 3; i++) {
        const y = centerY - lineSpacing + (i * lineSpacing);
        ctx.beginPath();
        ctx.moveTo(centerX - lineLength, y);
        ctx.lineTo(centerX + lineLength, y);
        ctx.stroke();
    }
    
    // Vertical connection line
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - lineSpacing);
    ctx.lineTo(centerX, centerY + lineSpacing);
    ctx.stroke();
    
    // Add connection dots
    ctx.fillStyle = '#F8333C';
    const dotRadius = 1 * scale;
    
    // Top dots
    ctx.beginPath();
    ctx.arc(centerX - lineLength, centerY - lineSpacing, dotRadius, 0, 2 * Math.PI);
    ctx.arc(centerX + lineLength, centerY - lineSpacing, dotRadius, 0, 2 * Math.PI);
    ctx.fill();
    
    // Middle dots
    ctx.beginPath();
    ctx.arc(centerX - lineLength, centerY, dotRadius, 0, 2 * Math.PI);
    ctx.arc(centerX + lineLength, centerY, dotRadius, 0, 2 * Math.PI);
    ctx.fill();
    
    // Bottom dots
    ctx.beginPath();
    ctx.arc(centerX - lineLength, centerY + lineSpacing, dotRadius, 0, 2 * Math.PI);
    ctx.arc(centerX + lineLength, centerY + lineSpacing, dotRadius, 0, 2 * Math.PI);
    ctx.fill();
    
    // Center dot
    ctx.beginPath();
    ctx.arc(centerX, centerY, dotRadius, 0, 2 * Math.PI);
    ctx.fill();
    
    // Add small LinkedIn "in" symbol in top right corner
    if (size >= 48) {
        const inSize = 4 * scale;
        const inX = size - padding - inSize - 2 * scale;
        const inY = padding + 2 * scale;
        
        // Draw LinkedIn "in" background
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(inX + inSize/2, inY + inSize/2, inSize/2, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw "in" text
        ctx.fillStyle = '#F8333C';
        ctx.font = `${3 * scale}px Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('in', inX + inSize/2, inY + inSize/2);
    }
    
    // Add subtle shadow for depth
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 2 * scale;
    ctx.shadowOffsetX = 1 * scale;
    ctx.shadowOffsetY = 1 * scale;
    
    return canvas.toBuffer('image/png');
}

// Generate icons for all required sizes
const sizes = [16, 48, 128];

console.log('Generating LinkedIn Message Assistant icons with red background...');

sizes.forEach(size => {
    try {
        const iconBuffer = createIcon(size);
        const filename = `icons/icon${size}.png`;
        
        fs.writeFileSync(filename, iconBuffer);
        console.log(`✅ Generated ${filename} (${size}x${size})`);
    } catch (error) {
        console.error(`❌ Error generating icon${size}.png:`, error.message);
    }
});

console.log('\n🎉 LinkedIn Message Assistant icon generation complete!');
console.log('Icons saved to the icons/ directory.'); 