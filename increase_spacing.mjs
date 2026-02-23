import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dir = path.join(__dirname, 'src/components/pdf');
const filePath = path.join(dir, 'PDFChapterContent.tsx');

let content = fs.readFileSync(filePath, 'utf8');

// Increase section heading font size significantly
content = content.replace(/fontSize: '18px'/g, "fontSize: '20px'");

// Increase letter spacing universally
content = content.replace(/letter-spacing: 0.5px/g, "letter-spacing: 0.8px");
content = content.replace(/letterSpacing: '0.5px'/g, "letterSpacing: '0.8px'");

// Increase line-height in paragraphs back to 1.8 or higher, as 1.5 was too small for them
content = content.replace(/line-height: 1.5/g, "line-height: 1.8");
content = content.replace(/line-height: 1.6/g, "line-height: 1.8");

fs.writeFileSync(filePath, content, 'utf8');
console.log(`Increased spacing in PDFChapterContent.tsx`);
