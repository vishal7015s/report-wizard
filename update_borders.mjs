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

    // Update borders
    if (content.includes("border: '2px solid #1e3a5f'")) {
        content = content.replace(/border: '2px solid #1e3a5f'/g, "border: '1px solid #000'");
        updated = true;
    }

    if (content.includes("border: '2px solid #000'")) {
        content = content.replace(/border: '2px solid #000'/g, "border: '1px solid #000'");
        updated = true;
    }

    // Cover Page Specific color fixes
    if (content.includes("color: '#1e3a5f'")) {
        content = content.replace(/color: '#1e3a5f'/g, "color: '#000000'");
        updated = true;
    }

    if (updated) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated borders/colors in ${file}`);
    }
});
