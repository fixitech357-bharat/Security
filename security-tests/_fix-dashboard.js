/* ============================================================
   Fix Dashboard Link — sets CORRECT relative path per folder
   ============================================================ */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SKIP = ['node_modules', '.git', '.vscode', 'assets', 'dist', 'build', 'bin', 'obj'];

let scanned = 0, fixed = 0, skipped = 0, failed = 0;

function walk(dir){
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
  catch(e) { return; }

  const indexPath = path.join(dir, 'index.html');
  if(fs.existsSync(indexPath)){
    scanned++;

    // Figure out how deep this folder is from ROOT
    const rel = path.relative(ROOT, dir);
    const depth = rel ? rel.split(path.sep).length : 0;
    const prefix = depth === 0 ? './' : '../'.repeat(depth);
    const correctHref = prefix + 'dashboard.html';

    try {
      let content = fs.readFileSync(indexPath, 'utf8');
      const original = content;

      // Replace ANY existing dashboard href with the correct one
      content = content.replace(
        /href="(?:\.\.\/)*\.?\/?dashboard\.html"/g,
        'href="' + correctHref + '"'
      );

      if(content !== original){
        fs.writeFileSync(indexPath, content, 'utf8');
        fixed++;
        if(fixed % 200 === 0) console.log('✓ Fixed ' + fixed + ' ...');
      } else {
        skipped++;
      }
    } catch(e){
      console.log('✗ ' + indexPath + ': ' + e.message);
      failed++;
    }
  }

  entries.filter(function(e){
    return e.isDirectory() && SKIP.indexOf(e.name) === -1 && e.name.charAt(0) !== '.';
  }).forEach(function(e){
    walk(path.join(dir, e.name));
  });
}

console.log('\n🔧 Fixing dashboard links to correct relative path...\n');
walk(ROOT);

console.log('\n✨ Done!');
console.log('   Scanned: ' + scanned);
console.log('   Fixed:   ' + fixed);
console.log('   Skipped: ' + skipped);
console.log('   Failed:  ' + failed + '\n');