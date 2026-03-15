#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const jsDir = path.join(__dirname, '..', 'js');

const files = fs.readdirSync(jsDir)
  .filter(f => f.endsWith('.js') && !f.endsWith('.min.js'));

console.log(`Minifying ${files.length} JS files...`);

for (const file of files) {
  const src = path.join(jsDir, file);
  const out = path.join(jsDir, file.replace(/\.js$/, '.min.js'));
  try {
    execSync(`npx terser "${src}" -o "${out}" -c -m`, { stdio: 'pipe' });
    console.log(`  ${file} -> ${file.replace(/\.js$/, '.min.js')}`);
  } catch (err) {
    console.error(`  ERROR: ${file}: ${err.message}`);
    process.exit(1);
  }
}

// Minify CSS if style.min.css exists (it's actually unminified)
const cssDir = path.join(__dirname, '..', 'css');
const cssFile = path.join(cssDir, 'style.min.css');
if (fs.existsSync(cssFile)) {
  console.log('Minifying style.min.css in-place...');
  try {
    execSync(`npx clean-css-cli -o "${cssFile}" "${cssFile}"`, { stdio: 'pipe' });
    console.log('  style.min.css minified');
  } catch (err) {
    console.warn('  CSS minification skipped (clean-css-cli not available)');
  }
}

console.log('Done.');
