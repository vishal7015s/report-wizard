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

    // Global Color Replacements (Scrubbing Blues)
    if (content.includes("#1e90ff")) {
        content = content.replace(/#1e90ff/g, "#000000");
        updated = true;
    }

    if (content.includes("#1e3a5f")) {
        content = content.replace(/#1e3a5f/g, "#000000");
        updated = true;
    }

    // Typography Standardizations
    if (file === 'PDFChapter.tsx') {
        // Heading sizing
        if (content.includes("text-base min-b-3")) {
            // it had className="font-bold text-base mb-3"
            content = content.replace(/text-base mb-3/g, "text-lg mb-4");
            content = content.replace(/lineHeight: '1.8'/g, "lineHeight: '1.5'");
            updated = true;
        }
        if (content.includes("lineHeight: '1.8'")) {
            content = content.replace(/lineHeight: '1.8'/g, "lineHeight: '1.5'");
            updated = true;
        }
    }

    if (updated) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Aggressively scrubbed blue colors and fixed typography in ${file}`);
    }
});
