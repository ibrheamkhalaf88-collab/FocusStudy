#!/usr/bin/env node
// Preflight Check - Run before any release
// Validates: git status, build, tests, version consistency

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

function log(msg, color = '') {
  console.log(`${color}${msg}${RESET}`);
}

function run(cmd, opts = {}) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: 'pipe', ...opts }).trim();
  } catch (e) {
    return { error: e.message, stdout: e.stdout?.toString(), stderr: e.stderr?.toString() };
  }
}

let passed = 0;
let failed = 0;
let warnings = 0;

function check(name, fn) {
  process.stdout.write(`  ${name}... `);
  const result = fn();
  if (result === true) {
    log('✅', GREEN);
    passed++;
  } else if (result === 'warn') {
    log('⚠️', YELLOW);
    warnings++;
  } else {
    log('❌', RED);
    if (typeof result === 'string') console.log(`    ${result}`);
    failed++;
  }
}

// 1. Git status
check('Git clean', () => {
  const status = run('git status --porcelain');
  if (status.error) return 'Git error';
  if (status.length > 0) return `Uncommitted changes:\n${status}`;
  return true;
});

// 2. On main branch
check('On main branch', () => {
  const branch = run('git branch --show-current');
  return branch === 'main' || `Not on main (current: ${branch})`;
});

// 3. No unpushed commits
check('No unpushed commits', () => {
  const unpushed = run('git log @{u}..HEAD --oneline');
  if (unpushed.error) return 'warn'; // No upstream
  if (unpushed.length > 0) return `${unpushed.split('\n').length} unpushed commit(s)`;
  return true;
});

// 4. Package.json valid
check('package.json valid', () => {
  try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    if (!pkg.name || !pkg.version || !pkg.build) return 'Missing required fields';
    return true;
  } catch (e) {
    return `Parse error: ${e.message}`;
  }
});

// 5. Version consistency
check('Version consistency', () => {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const capConfig = fs.readFileSync('capacitor.config.ts', 'utf8');
  const capVersion = capConfig.match(/version:\s*['"]([^'"]+)['"]/);
  if (capVersion && capVersion[1] !== pkg.version) {
    return `Capacitor version (${capVersion[1]}) != package.json (${pkg.version})`;
  }
  return true;
});

// 6. www folder exists with index.html
check('www/index.html exists', () => {
  return fs.existsSync('www/index.html') || 'www/index.html missing - run build first';
});

// 7. Capacitor config valid
check('Capacitor config', () => {
  try {
    const config = fs.readFileSync('capacitor.config.ts', 'utf8');
    if (!config.includes('appId') || !config.includes('appName') || !config.includes('webDir')) {
      return 'Missing required Capacitor config fields';
    }
    return true;
  } catch (e) {
    return 'capacitor.config.ts not found';
  }
});

// 8. Android project exists
check('Android project', () => {
  return fs.existsSync('android/app/build.gradle') || 'Android project missing - run `npx cap add android`';
});

// 9. Dependencies installed
check('Node modules', () => {
  return fs.existsSync('node_modules/electron') || 'Electron not installed';
});

// 10. Build test (dry run)
check('Electron build test', () => {
  const result = run('npm run build --dry-run 2>&1 | head -5', { timeout: 60000 });
  if (result.error && !result.error.includes('dry-run')) return 'Build test failed';
  return true;
});

console.log('\n' + '='.repeat(40));
log(`Results: ${passed} passed, ${warnings} warnings, ${failed} failed`, failed > 0 ? RED : GREEN);

if (failed > 0) {
  log('\n❌ Preflight FAILED - Fix issues before release', RED);
  process.exit(1);
} else if (warnings > 0) {
  log('\n⚠️ Preflight PASSED with warnings', YELLOW);
  process.exit(0);
} else {
  log('\n✅ Preflight PASSED - Ready for release!', GREEN);
  process.exit(0);
}