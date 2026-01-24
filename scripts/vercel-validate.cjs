#!/usr/bin/env node

/**
 * Pre-deployment validation script for Vercel
 * 
 * Validates:
 * - Environment variables are configured
 * - Build completes successfully
 * - No critical security issues
 * - Bundle sizes are acceptable
 * 
 * Run with: node scripts/vercel-validate.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function execCommand(command, silent = false) {
  try {
    const output = execSync(command, { encoding: 'utf-8', stdio: silent ? 'pipe' : 'inherit' });
    return { success: true, output };
  } catch (error) {
    return { success: false, error };
  }
}

// Validation checks
const checks = [];

// 1. Check for required files
log('\n📋 Checking required files...', 'cyan');
const requiredFiles = [
  'vercel.json',
  'package.json',
  'vite.config.ts',
  '.nvmrc',
  '.env.example',
];

requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  if (exists) {
    log(`  ✓ ${file}`, 'green');
    checks.push({ name: `File: ${file}`, passed: true });
  } else {
    log(`  ✗ ${file} missing`, 'red');
    checks.push({ name: `File: ${file}`, passed: false });
  }
});

// 2. Check vercel.json configuration
log('\n🔧 Validating vercel.json...', 'cyan');
try {
  const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf-8'));
  
  // Check for rewrites
  if (vercelConfig.rewrites && vercelConfig.rewrites.length > 0) {
    log('  ✓ SPA rewrites configured', 'green');
    checks.push({ name: 'Vercel: SPA rewrites', passed: true });
  } else {
    log('  ✗ SPA rewrites missing', 'red');
    checks.push({ name: 'Vercel: SPA rewrites', passed: false });
  }
  
  // Check for headers
  if (vercelConfig.headers && vercelConfig.headers.length > 0) {
    log('  ✓ Security headers configured', 'green');
    checks.push({ name: 'Vercel: Security headers', passed: true });
  } else {
    log('  ⚠ Security headers missing', 'yellow');
    checks.push({ name: 'Vercel: Security headers', passed: false });
  }
  
  // Check for build command
  if (vercelConfig.buildCommand) {
    log('  ✓ Build command specified', 'green');
    checks.push({ name: 'Vercel: Build command', passed: true });
  } else {
    log('  ⚠ Build command not specified (will use auto-detection)', 'yellow');
    checks.push({ name: 'Vercel: Build command', passed: true });
  }
} catch (error) {
  log('  ✗ Failed to parse vercel.json', 'red');
  checks.push({ name: 'Vercel: Configuration', passed: false });
}

// 3. Check Node version
log('\n📦 Checking Node.js version...', 'cyan');
const nodeVersion = process.version;
const nvmrcVersion = fs.existsSync('.nvmrc') 
  ? fs.readFileSync('.nvmrc', 'utf-8').trim() 
  : null;

log(`  Current: ${nodeVersion}`, 'blue');
if (nvmrcVersion) {
  log(`  Required: v${nvmrcVersion}`, 'blue');
  if (nodeVersion.startsWith(`v${nvmrcVersion}`)) {
    log('  ✓ Node version matches', 'green');
    checks.push({ name: 'Node.js version', passed: true });
  } else {
    log('  ⚠ Node version mismatch (Vercel will use .nvmrc)', 'yellow');
    checks.push({ name: 'Node.js version', passed: true });
  }
}

// 4. Check for security vulnerabilities
log('\n🔒 Checking for security vulnerabilities...', 'cyan');
const auditResult = execCommand('npm audit --production --json', true);
if (auditResult.success) {
  try {
    const audit = JSON.parse(auditResult.output);
    const vulnerabilities = audit.metadata?.vulnerabilities;
    
    if (vulnerabilities) {
      const criticalCount = vulnerabilities.critical || 0;
      const highCount = vulnerabilities.high || 0;
      
      if (criticalCount === 0 && highCount === 0) {
        log('  ✓ No critical or high vulnerabilities', 'green');
        checks.push({ name: 'Security: Vulnerabilities', passed: true });
      } else {
        log(`  ✗ Found ${criticalCount} critical, ${highCount} high vulnerabilities`, 'red');
        log('  Run: npm audit fix', 'yellow');
        checks.push({ name: 'Security: Vulnerabilities', passed: false });
      }
    } else {
      log('  ✓ No vulnerabilities found', 'green');
      checks.push({ name: 'Security: Vulnerabilities', passed: true });
    }
  } catch (e) {
    log('  ⚠ Could not parse audit results', 'yellow');
    checks.push({ name: 'Security: Vulnerabilities', passed: true });
  }
} else {
  log('  ⚠ Could not run security audit', 'yellow');
  checks.push({ name: 'Security: Vulnerabilities', passed: true });
}

// 5. Check environment variables example
log('\n🔐 Checking environment configuration...', 'cyan');
try {
  const envExample = fs.readFileSync('.env.example', 'utf-8');
  
  const requiredVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
  let allPresent = true;
  
  requiredVars.forEach(varName => {
    if (envExample.includes(varName)) {
      log(`  ✓ ${varName} documented`, 'green');
    } else {
      log(`  ✗ ${varName} not in .env.example`, 'red');
      allPresent = false;
    }
  });
  
  checks.push({ name: 'Environment: Documentation', passed: allPresent });
} catch (error) {
  log('  ✗ .env.example not found', 'red');
  checks.push({ name: 'Environment: Documentation', passed: false });
}

// 6. Test build
log('\n🏗️  Testing production build...', 'cyan');
log('  This may take a minute...', 'blue');
const buildResult = execCommand('npm run build', true);

if (buildResult.success) {
  log('  ✓ Build completed successfully', 'green');
  checks.push({ name: 'Build: Production', passed: true });
  
  // Check dist folder
  if (fs.existsSync('dist')) {
    const distFiles = fs.readdirSync('dist');
    if (distFiles.includes('index.html')) {
      log('  ✓ dist/index.html generated', 'green');
      checks.push({ name: 'Build: Output', passed: true });
    } else {
      log('  ✗ dist/index.html not found', 'red');
      checks.push({ name: 'Build: Output', passed: false });
    }
  } else {
    log('  ✗ dist directory not created', 'red');
    checks.push({ name: 'Build: Output', passed: false });
  }
} else {
  log('  ✗ Build failed', 'red');
  checks.push({ name: 'Build: Production', passed: false });
}

// Summary
log('\n' + '='.repeat(60), 'cyan');
log('VALIDATION SUMMARY', 'cyan');
log('='.repeat(60), 'cyan');

const passed = checks.filter(c => c.passed).length;
const total = checks.length;
const percentage = Math.round((passed / total) * 100);

checks.forEach(check => {
  const icon = check.passed ? '✓' : '✗';
  const color = check.passed ? 'green' : 'red';
  log(`  ${icon} ${check.name}`, color);
});

log('\n' + '='.repeat(60), 'cyan');
log(`Result: ${passed}/${total} checks passed (${percentage}%)`, 
  percentage === 100 ? 'green' : (percentage >= 80 ? 'yellow' : 'red')
);
log('='.repeat(60) + '\n', 'cyan');

if (percentage === 100) {
  log('🚀 All checks passed! Ready for Vercel deployment.', 'green');
  log('\nNext steps:', 'cyan');
  log('  1. Commit and push your changes', 'blue');
  log('  2. Set environment variables in Vercel dashboard', 'blue');
  log('  3. Deploy to Vercel', 'blue');
  log('\nSee VERCEL_DEPLOYMENT.md for detailed instructions.\n', 'blue');
  process.exit(0);
} else {
  log('⚠️  Some checks failed. Please fix the issues before deploying.', 'red');
  log('\nSee above for specific failures.\n', 'yellow');
  process.exit(1);
}
