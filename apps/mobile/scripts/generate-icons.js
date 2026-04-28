const sharp = require('sharp');
const path = require('path');

const assetsDir = path.join(__dirname, '../assets');

// SVG иконка
const iconSvg = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a0533"/>
      <stop offset="100%" style="stop-color:#0a0a1a"/>
    </linearGradient>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7c3aed"/>
      <stop offset="100%" style="stop-color:#a78bfa"/>
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="1024" height="1024" rx="200" fill="url(#bg)"/>
  
  <!-- Glow circle -->
  <circle cx="512" cy="512" r="280" fill="rgba(124,58,237,0.15)"/>
  
  <!-- Main star/sparkle -->
  <text x="512" y="580" 
    font-size="380" 
    text-anchor="middle" 
    fill="url(#grad)"
    font-family="Arial">✨</text>
    
  <!-- Small decorative stars -->
  <circle cx="280" cy="280" r="12" fill="#a78bfa" opacity="0.6"/>
  <circle cx="744" cy="300" r="8" fill="#7c3aed" opacity="0.5"/>
  <circle cx="260" cy="720" r="6" fill="#a78bfa" opacity="0.4"/>
  <circle cx="760" cy="740" r="10" fill="#7c3aed" opacity="0.6"/>
</svg>`;

async function generateIcons() {
  const svgBuffer = Buffer.from(iconSvg);

  // icon.png 1024x1024
  await sharp(svgBuffer).resize(1024, 1024).png().toFile(path.join(assetsDir, 'icon.png'));
  console.log('✅ icon.png');

  // adaptive-icon.png 1024x1024
  await sharp(svgBuffer).resize(1024, 1024).png().toFile(path.join(assetsDir, 'adaptive-icon.png'));
  console.log('✅ adaptive-icon.png');

  // splash-icon.png 200x200
  await sharp(svgBuffer).resize(200, 200).png().toFile(path.join(assetsDir, 'splash-icon.png'));
  console.log('✅ splash-icon.png');

  console.log('🎉 Иконки готовы!');
}

generateIcons().catch(console.error);
