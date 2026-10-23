import fs from 'fs';
import path from 'path';

const projectDir = 'C:\\Users\\Lenovo\\Desktop\\مشاريع الدراسه\\مشروعstudy اخر نسخه فيرجن 2.0';

const files = [
  'index.html', 'main.js', 'preload.js', 'capacitor-bridge.js', 'preflight.mjs',
  'package.json', 'capacitor.config.ts', 'README.md',
  '.github/workflows/ci.yml', '.github/workflows/release-electron.yml', '.github/workflows/release-android.yml',
  'scripts/release.mjs', 'www/index.html', 'www/main.js', 'www/preload.js', 'www/capacitor-bridge.js',
  'android/app/build.gradle'
];

console.log('=== FILE EXISTENCE ===');
files.forEach(f => {
  const full = path.join(projectDir, f);
  const exists = fs.existsSync(full);
  const size = exists ? fs.statSync(full).size : 0;
  console.log((exists ? '✅' : '❌') + ' ' + f + ' (' + size + ' bytes)');
});

const indexHtml = fs.readFileSync(path.join(projectDir, 'index.html'), 'utf8');
const checks = [
  { name: 'cleanupAllTimers function', pattern: /cleanupAllTimers/ },
  { name: 'showSection calls cleanup', pattern: /showSection.*cleanupAllTimers/ },
  { name: 'checkStreak setInterval', pattern: /setInterval.*checkStreak.*60000/ },
  { name: 'weeklyHours zeros', pattern: /weeklyHours.*0\.0.*0\.0.*0\.0.*0\.0.*0\.0.*0\.0.*0\.0/ },
  { name: 'saveData try/catch', pattern: /saveData.*try.*catch/ },
  { name: 'One Motif tasks design', pattern: /motif-container|motif-check/ },
  { name: 'Pilcrow Rounded font', pattern: /Pilcrow Rounded/ },
  { name: 'Apple Fluid Springs', pattern: /cubic-bezier\(0\.4, 0, 0\.2, 1\)/ },
  { name: 'capacitor-bridge.js load', pattern: /capacitor-bridge\.js/ },
  { name: 'prefers-reduced-motion', pattern: /prefers-reduced-motion/ },
  { name: 'RTL Arabic', pattern: /dir="rtl"/ },
];

console.log('\n=== KEY CONTENT CHECKS ===');
checks.forEach(c => {
  const found = c.pattern.test(indexHtml);
  console.log((found ? '✅' : '❌') + ' ' + c.name);
});

const mainJs = fs.readFileSync(path.join(projectDir, 'main.js'), 'utf8');
console.log('\n--- main.js ---');
console.log((/before-quit/.test(mainJs) ? '✅' : '❌') + ' before-quit handler');
console.log((/window\.close.*cleanupAllTimers/.test(mainJs) ? '✅' : '❌') + ' close event cleanup');

const pkg = JSON.parse(fs.readFileSync(path.join(projectDir, 'package.json'), 'utf8'));
console.log('\n--- package.json ---');
console.log('version: ' + pkg.version);
console.log('scripts: ' + Object.keys(pkg.scripts).join(', '));
console.log('files includes capacitor-bridge: ' + (pkg.build?.files?.includes('capacitor-bridge.js') ? '✅' : '❌'));

const capConfig = fs.readFileSync(path.join(projectDir, 'capacitor.config.ts'), 'utf8');
console.log('\n--- capacitor.config.ts ---');
console.log((/webDir: 'www'/.test(capConfig) ? '✅' : '❌') + ' webDir: www');
console.log((/LocalNotifications/.test(capConfig) ? '✅' : '❌') + ' LocalNotifications');
console.log((/StatusBar/.test(capConfig) ? '✅' : '❌') + ' StatusBar');
console.log((/SplashScreen/.test(capConfig) ? '✅' : '❌') + ' SplashScreen');

const preflight = fs.readFileSync(path.join(projectDir, 'preflight.mjs'), 'utf8');
console.log('\n--- preflight.mjs ---');
console.log((/import.*execSync/.test(preflight) ? '✅' : '❌') + ' ES modules syntax');

console.log('\n=== DONE ===');