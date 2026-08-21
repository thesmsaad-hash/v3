const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, 'extracted_kit', 'templates');
const files = fs.readdirSync(templatesDir);

console.log('=== TEMPLATES SUMMARY ===');

const allImageUrls = new Set();

function extractImagesAndTexts(obj, headings = [], images = [], textBlocks = []) {
  if (!obj || typeof obj !== 'object') return;

  if (obj.widgetType) {
    if (obj.settings) {
      if (obj.settings.title) headings.push(`[${obj.widgetType}] ${obj.settings.title}`);
      if (obj.settings.editor) textBlocks.push(obj.settings.editor.replace(/<[^>]+>/g, ' ').slice(0, 100));
      
      // Image extraction
      Object.keys(obj.settings).forEach(key => {
        const val = obj.settings[key];
        if (val && typeof val === 'object' && val.url) {
          allImageUrls.add(val.url);
          images.push(val.url.split('/').pop());
        }
      });
    }
  }

  if (obj.settings) {
    Object.keys(obj.settings).forEach(key => {
      const val = obj.settings[key];
      if (val && typeof val === 'object' && val.url) {
        allImageUrls.add(val.url);
      }
    });
  }

  if (Array.isArray(obj)) {
    obj.forEach(item => extractImagesAndTexts(item, headings, images, textBlocks));
  } else {
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'object') {
        extractImagesAndTexts(obj[key], headings, images, textBlocks);
      }
    });
  }
}

files.forEach(file => {
  if (!file.endsWith('.json')) return;
  const content = JSON.parse(fs.readFileSync(path.join(templatesDir, file), 'utf8'));
  const headings = [];
  const images = [];
  const textBlocks = [];

  extractImagesAndTexts(content, headings, images, textBlocks);

  console.log(`\n--- File: ${file} (Title: ${content.title || file}) ---`);
  console.log(`Headings / Components found (${headings.length}):`);
  console.log(headings.slice(0, 15).join('\n'));
  if (headings.length > 15) console.log(`...and ${headings.length - 15} more`);
});

console.log('\n=== ALL UNIQUE IMAGE URLS (' + allImageUrls.size + ') ===');
allImageUrls.forEach(url => {
  if (url) console.log(url);
});
