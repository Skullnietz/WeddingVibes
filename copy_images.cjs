const fs = require('fs');
const path = require('path');

const sourceDir = 'C:\\Users\\black\\.gemini\\antigravity\\brain\\c18db4de-67e2-4d32-a39c-de7dfbb52aef';
const destDir = 'C:\\Users\\black\\Downloads\\boda-ultra-premium\\boda-ultra-premium\\client\\public\\gifts';

const files = fs.readdirSync(sourceDir);

let fallbackImage = null;

for (const file of files) {
    if (file.endsWith('.png')) {
        const baseName = file.replace(/_\d+\.png$/, '.png');
        const destPath = path.join(destDir, baseName);
        fs.copyFileSync(path.join(sourceDir, file), destPath);
        console.log(`Copied ${file} to ${baseName}`);
        if (!fallbackImage) fallbackImage = destPath;
    }
}

// Map the missing ones to the fallback image
const missing = [
    'juego_maletas.png',
    'loncheras.png',
    'licuadora_portatil.png',
    'colchon_inflable.png',
    'juego_cuchillos.png',
    'karcher.png'
];

if (fallbackImage) {
    for (const m of missing) {
        fs.copyFileSync(fallbackImage, path.join(destDir, m));
        console.log(`Copied fallback to ${m}`);
    }
}
