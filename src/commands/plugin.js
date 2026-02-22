const chalk = require('chalk');
const ora = require('ora');
const { installNpmPackage, uninstallNpmPackage, getInstalledVersion } = require('../plugin/npm-installer');
const { loadPlugin } = require('../plugin/plugin-loader');
const {
  addPluginToManifest,
  removePluginFromManifest,
  listInstalledPlugins,
  isPluginInstalled,
} = require('../plugin/plugin-manager');

async function pluginInstall(name) {
  const fullName = name.startsWith('stxforge-plugin-') ? name : `stxforge-plugin-${name}`;
  console.log(chalk.cyan(`\n✦ Installing plugin: ${fullName}\n`));

  if (await isPluginInstalled(fullName)) {
    console.log(chalk.yellow(`Plugin "${fullName}" is already installed.`));
    return;
  }

  const spinner = ora('Installing from npm...').start();
  try {
    installNpmPackage(fullName);
    spinner.stop();

    // Validate and load plugin metadata
    const plugin = await loadPlugin(fullName);
    const version = getInstalledVersion(fullName) || 'unknown';

    await addPluginToManifest(fullName, version, {
      verified: plugin.verified,
      templates: plugin.templates.map((t) => t.name),
    });

    console.log(chalk.green(`✓ Plugin "${fullName}@${version}" installed successfully`));
    if (plugin.templates.length > 0) {
      console.log(chalk.dim(`  Templates: ${plugin.templates.map((t) => t.name).join(', ')}`));
    }
  } catch (err) {
    spinner.fail(chalk.red('Installation failed'));
    throw err;
  }
}

async function pluginUninstall(name) {
  const fullName = name.startsWith('stxforge-plugin-') ? name : `stxforge-plugin-${name}`;
  console.log(chalk.cyan(`\n✦ Uninstalling plugin: ${fullName}\n`));

  if (!(await isPluginInstalled(fullName))) {
    console.log(chalk.yellow(`Plugin "${fullName}" is not installed.`));
    return;
  }

  const spinner = ora('Removing...').start();
  try {
    uninstallNpmPackage(fullName);
    await removePluginFromManifest(fullName);
    spinner.succeed(chalk.green(`Plugin "${fullName}" uninstalled.`));
  } catch (err) {
    spinner.fail(chalk.red('Uninstall failed'));
    throw err;
  }
}

async function pluginList() {
  const plugins = await listInstalledPlugins();

  console.log(chalk.cyan('\n✦ Installed stxforge plugins\n'));

  if (plugins.length === 0) {
    console.log(chalk.dim('  No plugins installed.'));
    console.log(chalk.dim('  Install one with: stxforge plugin install <name>\n'));
    return;
  }

  for (const plugin of plugins) {
    const badge = plugin.verified ? chalk.green('[verified]') : chalk.dim('[community]');
    const templates = plugin.templates.length > 0
      ? chalk.dim(`  templates: ${plugin.templates.join(', ')}`)
      : '';
    console.log(`  ${chalk.bold(plugin.name)}@${plugin.version} ${badge}${templates}`);
  }
  console.log('');
}

async function pluginSearch(keyword) {
  console.log(chalk.cyan(`\n✦ Searching npm for stxforge-plugin-${keyword}\n`));
  console.log(chalk.dim('  Visit https://www.npmjs.com/search?q=stxforge-plugin to browse all plugins'));
  console.log(chalk.dim(`  Or run: npm search stxforge-plugin-${keyword}\n`));
}

module.exports = { pluginInstall, pluginUninstall, pluginList, pluginSearch };
