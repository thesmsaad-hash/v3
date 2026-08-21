const fs = require('fs');
const path = require('path');
const https = require('https');

const outDir = path.join(__dirname, 'public', 'assets', 'images');
fs.mkdirSync(outDir, { recursive: true });

const imageUrls = [
  "https://templatekit.kitprostudio.com/north/wp-content/uploads/sites/107/2026/05/about.jpg",
  "https://templatekit.kitprostudio.com/north/wp-content/uploads/sites/107/2026/05/testtt.png",
  "https://templatekit.kitprostudio.com/north/wp-content/uploads/sites/107/2026/05/webflowlogo.png",
  "https://templatekit.kitprostudio.com/north/wp-content/uploads/sites/107/2026/05/vslogo.png",
  "https://templatekit.kitprostudio.com/north/wp-content/uploads/sites/107/2026/05/framerlogo.png",
  "https://templatekit.kitprostudio.com/north/wp-content/uploads/sites/107/2026/05/elementorlogo.png",
  "https://templatekit.kitprostudio.com/north/wp-content/uploads/sites/107/2026/05/cssawardslogo.png",
  "https://templatekit.kitprostudio.com/north/wp-content/uploads/sites/107/2026/05/awwwardslogo.png",
  "https://templatekit.kitprostudio.com/north/wp-content/uploads/sites/107/2026/05/dribbblelogo.png",
  "https://templatekit.kitprostudio.com/north/wp-content/uploads/sites/107/2026/05/behancelogo.png",
  "https://templatekit.kitprostudio.com/north/wp-content/uploads/sites/107/2026/05/N.png",
  "https://templatekit.kitprostudio.com/north/wp-content/uploads/sites/107/2026/05/hero.jpg",
  "https://templatekit.kitprostudio.com/north/wp-content/uploads/sites/107/2026/05/logo1.png",
  "https://templatekit.kitprostudio.com/north/wp-content/uploads/sites/107/2026/05/logo2.png",
  "https://templatekit.kitprostudio.com/north/wp-content/uploads/sites/107/2026/05/logo3.png",
  "https://templatekit.kitprostudio.com/north/wp-content/uploads/sites/107/2026/05/logo4.png",
  "https://templatekit.kitprostudio.com/north/wp-content/uploads/sites/107/2026/05/logo9.png",
  "https://templatekit.kitprostudio.com/north/wp-content/uploads/sites/107/2026/05/logo10.png",
  "https://templatekit.kitprostudio.com/north/wp-content/uploads/sites/107/2026/05/icon3.jpg",
  "https://templatekit.kitprostudio.com/north/wp-content/uploads/sites/107/2026/05/icon2.jpg",
  "https://templatekit.kitprostudio.com/north/wp-content/uploads/sites/107/2026/05/icon1.jpg",
  "https://templatekit.kitprostudio.com/north/wp-content/uploads/sites/107/2026/05/works1.jpg",
  "https://templatekit.kitprostudio.com/north/wp-content/uploads/sites/107/2026/05/works2.jpg",
  "https://templatekit.kitprostudio.com/north/wp-content/uploads/sites/107/2026/05/works3.jpg",
  "https://templatekit.kitprostudio.com/north/wp-content/uploads/sites/107/2026/05/works4.jpg",
  "https://templatekit.kitprostudio.com/north/wp-content/uploads/sites/107/2026/05/why.jpg",
  "https://templatekit.kitprostudio.com/north/wp-content/uploads/sites/107/2026/05/icon7.jpg",
  "https://templatekit.kitprostudio.com/north/wp-content/uploads/sites/107/2026/05/icon5.jpg",
  "https://templatekit.kitprostudio.com/north/wp-content/uploads/sites/107/2026/05/icon4.jpg",
  "https://templatekit.kitprostudio.com/north/wp-content/uploads/sites/107/2026/05/review2-1.jpg",
  "https://templatekit.kitprostudio.com/north/wp-content/uploads/sites/107/2026/05/review1.jpg",
  "https://templatekit.kitprostudio.com/north/wp-content/uploads/sites/107/2026/05/icon6.jpg",
  "https://templatekit.kitprostudio.com/north/wp-content/uploads/sites/107/2026/05/icon8.jpg"
];

function download(url) {
  return new Promise((resolve, reject) => {
    const filename = path.basename(url);
    const dest = path.join(outDir, filename);
    const file = fs.createWriteStream(dest);

    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        fs.unlink(dest, () => {});
        return resolve(`Failed ${url}: status ${res.statusCode}`);
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(`Downloaded ${filename}`);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      resolve(`Error downloading ${url}: ${err.message}`);
    });
  });
}

async function main() {
  console.log(`Downloading ${imageUrls.length} image assets...`);
  for (const url of imageUrls) {
    const res = await download(url);
    console.log(res);
  }
  console.log('All downloads completed!');
}

main();
