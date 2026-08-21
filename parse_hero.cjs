const fs = require('fs');
const path = require('path');

const homeJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'extracted_kit', 'templates', 'home.json'), 'utf8'));

console.log("=== HOME JSON HERO SECTION STRUCTURE ===");

function dumpElements(elements, depth = 0) {
  elements.forEach((el, idx) => {
    const indent = "  ".repeat(depth);
    let titleStr = el.settings?.title || el.settings?.heading_title || '';
    if (!titleStr && el.settings?.editor) titleStr = el.settings.editor.replace(/<[^>]+>/g, ' ').slice(0, 40);
    console.log(`${indent}[${el.elType}] ${el.widgetType || el.id} ${titleStr}`);
    if (el.settings) {
      if (el.settings.background_color) console.log(`${indent}   bg_color: ${el.settings.background_color}`);
      if (el.settings.__globals__) console.log(`${indent}   globals: ${JSON.stringify(el.settings.__globals__)}`);
      if (el.settings.border_border) console.log(`${indent}   border: ${el.settings.border_border}`);
      if (el.settings.flex_direction) console.log(`${indent}   flex_dir: ${el.settings.flex_direction}`);
      if (el.settings.width) console.log(`${indent}   width: ${JSON.stringify(el.settings.width)}`);
    }
    if (el.elements && el.elements.length > 0) {
      dumpElements(el.elements, depth + 1);
    }
  });
}

dumpElements(homeJson.content);
