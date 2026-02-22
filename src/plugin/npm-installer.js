const { execSync } = require('child_process');
const chalk = require('chalk');

function installNpmPackage(packageName, version = 'latest') {
  const spec = version === 'latest' ? packageName : `${packageName}@${version}`;
  console.log(chalk.dim(`  Running: npm install ${spec} --save-dev`));
  execSync(`npm install ${spec} --save-dev`, {
    stdio: 'inherit',
    cwd: process.cwd(),
  });
}

function uninstallNpmPackage(packageName) {
  console.log(chalk.dim(`  Running: npm uninstall ${packageName}`));
  execSync(`npm uninstall ${packageName}`, {
    stdio: 'inherit',
    cwd: process.cwd(),
  });
}

function getInstalledVersion(packageName) {
  try {
    const result = execSync(`npm list ${packageName} --depth=0 --json`, {
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });
    const parsed = JSON.parse(result);
    const deps = parsed.dependencies || {};
    return deps[packageName]?.version || null;
  } catch {
    return null;
  }
}

module.exports = { installNpmPackage, uninstallNpmPackage, getInstalledVersion };
