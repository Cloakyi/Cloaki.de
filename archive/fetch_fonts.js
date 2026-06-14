const https = require('https');
const fs = require('fs');
const path = require('path');

const FONTS_DIR = path.join(__dirname, '..', 'public', 'fonts');
const CSS_FILE = path.join(__dirname, '..', 'public', 'fonts.css');

if (!fs.existsSync(FONTS_DIR)) {
  fs.mkdirSync(FONTS_DIR, { recursive: true });
}

const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const urls = [
  'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600&display=swap',
  'https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0&display=swap'
];

async function fetchCss(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': userAgent } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function main() {
  let combinedCss = '';
  let fontCounter = 0;

  for (const url of urls) {
    let css = await fetchCss(url);
    
    const urlRegex = /url\((https:\/\/[^)]+\.woff2)\)/g;
    let match;
    let newCss = css;
    
    const matches = [...css.matchAll(urlRegex)];
    for (const m of matches) {
      const fontUrl = m[1];
      fontCounter++;
      const parts = fontUrl.split('/');
      const originalName = parts[parts.length - 1];
      const fileName = `font-${fontCounter}-${originalName}`;
      const dest = path.join(FONTS_DIR, fileName);
      
      console.log(`Downloading ${fontUrl} to ${fileName}...`);
      await downloadFile(fontUrl, dest);
      
      newCss = newCss.replace(fontUrl, `/fonts/${fileName}`);
    }
    
    combinedCss += newCss + '\n\n';
  }
  
  fs.writeFileSync(CSS_FILE, combinedCss);
  console.log('All done. Created fonts.css and downloaded woff2 files.');
}

main().catch(console.error);
