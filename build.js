const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, 'public');
const PARTIALS_DIR = path.join(PUBLIC_DIR, 'partials');

// Load partials into memory
const partials = {
  'import-map': fs.readFileSync(path.join(PARTIALS_DIR, 'import-map.html'), 'utf8'),
  'body-top': fs.readFileSync(path.join(PARTIALS_DIR, 'body-top.html'), 'utf8'),
  'footer-scripts': fs.readFileSync(path.join(PARTIALS_DIR, 'footer-scripts.html'), 'utf8')
};

// Find all HTML files recursively
function getHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (file !== 'partials' && file !== 'lib') {
        getHtmlFiles(filePath, fileList);
      }
    } else if (filePath.endsWith('.html')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const htmlFiles = getHtmlFiles(PUBLIC_DIR);

let updatedFilesCount = 0;

for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Replace each partial block
  for (const [key, partialContent] of Object.entries(partials)) {
    const regex = new RegExp(`<!--\\s*INJECT:${key}\\s*-->[\\s\\S]*?<!--\\s*/INJECT:${key}\\s*-->`, 'g');
    const replacement = `<!-- INJECT:${key} -->\n${partialContent}\n  <!-- /INJECT:${key} -->`;

    // If the file already has the INJECT markers, update it
    if (regex.test(content)) {
      content = content.replace(regex, replacement);
    }
  }

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated: ${path.relative(__dirname, file)}`);
    updatedFilesCount++;
  }
}

console.log(`\nBuild complete. Updated ${updatedFilesCount} files.`);
console.log(`To use this system, wrap your duplicate code in HTML comments like this:\n  <!-- INJECT:import-map -->\n  ... code ...\n  <!-- /INJECT:import-map -->\n`);
