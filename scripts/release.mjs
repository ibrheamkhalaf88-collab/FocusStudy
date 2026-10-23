#!/usr/bin/env node
// Release Script - Automates version bump, build, and release preparation
// Usage: npm run release -- [patch|minor|major|<version>] [--android]

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const versionType = args[0] || 'patch';
const buildAndroid = args.includes('--android');
const dryRun = args.includes('--dry-run');

function run(cmd, opts = {}) {
  console.log(`$ ${cmd}`);
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: 'inherit', ...opts });
  } catch (e) {
    console.error(`Command failed: ${cmd}`);
    process.exit(1);
  }
}

function runQuiet(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: 'pipe' }).trim();
  } catch (e) {
    return null;
  }
}

// Get current version
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const currentVersion = pkg.version;
console.log(`Current version: ${currentVersion}`);

// Calculate new version
const [major, minor, patch] = currentVersion.split('.').map(Number);
let newVersion;
switch (versionType) {
  case 'major': newVersion = `${major + 1}.0.0`; break;
  case 'minor': newVersion = `${major}.${minor + 1}.0`; break;
  case 'patch': newVersion = `${major}.${minor}.${patch + 1}`; break;
  default: newVersion = versionType; // Custom version
}

console.log(`New version: ${newVersion}`);

if (dryRun) {
  console.log('\n🔍 DRY RUN - No changes will be made');
  console.log(`Would update version to: ${newVersion}`);
  if (buildAndroid) console.log('Would build Android APK');
  console.log('Would run preflight checks');
  console.log('Would build Electron app');
  console.log('Would create git commit and tag');
  process.exit(0);
}

// 1. Run preflight
console.log('\n📋 Running preflight checks...');
try {
  run('node preflight.mjs');
} catch (e) {
  console.error('❌ Preflight failed - aborting release');
  process.exit(1);
}

// 2. Update package.json version
console.log(`\n📝 Updating version to ${newVersion}...`);
pkg.version = newVersion;
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');

// 3. Update capacitor.config.ts
const capConfig = fs.readFileSync('capacitor.config.ts', 'utf8');
const newCapConfig = capConfig.replace(/version:\s*['"][^'"]+['"]/, `version: '${newVersion}'`);
fs.writeFileSync('capacitor.config.ts', newCapConfig);

// 4. Update android/build.gradle versionCode
const gradlePath = 'android/app/build.gradle';
if (fs.existsSync(gradlePath)) {
  let gradle = fs.readFileSync(gradlePath, 'utf8');
  const versionCodeMatch = gradle.match(/versionCode\s+(\d+)/);
  if (versionCodeMatch) {
    const newVersionCode = parseInt(versionCodeMatch[1]) + 1;
    gradle = gradle.replace(/versionCode\s+\d+/, `versionCode ${newVersionCode}`);
    gradle = gradle.replace(/versionName\s+["'][^"']+["']/, `versionName "${newVersion}"`);
    fs.writeFileSync(gradlePath, gradle);
    console.log(`Updated Android versionCode to ${newVersionCode}`);
  }
}

// 5. Sync www folder
console.log('\n📁 Syncing www folder...');
run('cp index.html www/');
run('cp main.js www/');
run('cp preload.js www/');
run('cp capacitor-bridge.js www/');
if (fs.existsSync('assets')) {
  run('cp -r assets www/ 2>/dev/null || cp -r assets www/');
}

// 6. Capacitor sync (if Android)
if (buildAndroid) {
  console.log('\n🔄 Capacitor sync...');
  run('npx cap sync android');
}

// 7. Build Electron
console.log('\n🏗️ Building Electron app...');
run('npm run build');

// 8. Build Android (if requested)
if (buildAndroid) {
  console.log('\n🤖 Building Android APK...');
  run('cd android && ./gradlew assembleRelease --no-daemon');
}

// 9. Git commit and tag
console.log('\n📦 Creating git commit and tag...');
run('git add package.json capacitor.config.ts android/app/build.gradle www/');
run(`git commit -m "chore: release v${newVersion}"`);
run(`git tag -a v${newVersion} -m "Release v${newVersion}"`);

console.log(`\n✅ Release v${newVersion} prepared successfully!`);
console.log('\nNext steps:');
console.log('  1. git push origin main --follow-tags');
console.log('  2. GitHub Actions will build and create releases');
if (buildAndroid) {
  console.log('  3. Android APK available in android/app/build/outputs/apk/release/');
}
console.log(`  4. Windows EXE available in dist/FocusStudy.exe`);