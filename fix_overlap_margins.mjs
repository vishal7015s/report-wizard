import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dir = path.join(__dirname, 'src/components/pdf');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    // Header move 8mm up (safely outside the 15mm border)
    if (content.includes("top: '10mm'")) {
        content = content.replace(/top: '10mm'/g, "top: '8mm'");
        updated = true;
    }

    // Footer move 8mm down (safely outside the 15mm border)
    if (content.includes("bottom: '10mm'")) {
        content = content.replace(/bottom: '10mm'/g, "bottom: '8mm'");
        updated = true;
    }

    // Ensure all borders are exactly at 15mm
    // Currently TOC and ListOfFigures might have 12mm
    if (content.match(/top: '12mm',\s*left: '12mm',\s*right: '12mm',\s*bottom: '12mm'/)) {
        content = content.replace(/top: '12mm',\s*left: '12mm',\s*right: '12mm',\s*bottom: '12mm'/g, "top: '15mm',\n          left: '15mm',\n          right: '15mm',\n          bottom: '15mm'");
        updated = true;
    }

    if (updated) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Adjusted overlap positions gracefully in ${file}`);
    }
});
