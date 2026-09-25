import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, 'src');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const stat = fs.statSync(dirPath);
    if (stat.isDirectory()) walk(dirPath, callback);
    else callback(dirPath);
  });
}

walk(srcDir, (filePath) => {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let changed = false;
    
    const regex = /(import\s+.*?from\s+['"])([^'"]+)(['"])|(import\s*\(\s*['"])([^'"]+)(['"]\s*\))|(require\s*\(\s*['"])([^'"]+)(['"]\s*\))/g;
    
    content = content.replace(regex, (match, imp1, path1, q1, imp2, path2, q2, imp3, path3, q3) => {
      const impPath = path1 || path2 || path3;
      if (impPath.startsWith('../')) {
        const absolutePath = path.resolve(path.dirname(filePath), impPath);
        if (absolutePath.startsWith(srcDir)) {
          const relativeToSrc = path.relative(srcDir, absolutePath).replace(/\\/g, '/');
          const newPath = '@/' + relativeToSrc;
          changed = true;
          if (path1) return `${imp1}${newPath}${q1}`;
          if (path2) return `${imp2}${newPath}${q2}`;
          if (path3) return `${imp3}${newPath}${q3}`;
        }
      }
      return match;
    });

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`Updated ${filePath}`);
    }
  }
});
