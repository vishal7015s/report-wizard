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

    // Header move 4mm down (closer to border at 15mm)
    if (content.includes("top: '6mm'")) {
        content = content.replace(/top: '6mm'/g, "top: '10mm'");
        updated = true;
    }

    // Footer move 4mm up (closer to border at 15mm)
    if (content.includes("bottom: '6mm'")) {
        content = content.replace(/bottom: '6mm'/g, "bottom: '10mm'");
        updated = true;
    }

    if (updated) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Adjusted header/footer positions in ${file}`);
    }
});
