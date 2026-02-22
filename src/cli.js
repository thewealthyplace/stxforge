#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const { pluginInstall, pluginUninstall, pluginList, pluginSearch } = require('./commands/plugin');

program
  .name('stxforge')
  .description('Smart contract scaffolding CLI for the Stacks ecosystem')
  .version('1.0.0');

// stxforge plugin <subcommand>
const plugin = program.command('plugin').description('Manage stxforge plugins');

plugin
  .command('install <name>')
  .description('Install a stxforge plugin from npm')
  .action(async (name) => {
    try {
      await pluginInstall(name);
    } catch (err) {
      console.error(chalk.red('Error:'), err.message);
      process.exit(1);
    }
  });

plugin
  .command('uninstall <name>')
  .description('Uninstall a stxforge plugin')
  .action(async (name) => {
    try {
      await pluginUninstall(name);
    } catch (err) {
      console.error(chalk.red('Error:'), err.message);
      process.exit(1);
    }
  });

plugin
  .command('list')
  .description('List all installed plugins')
  .action(async () => {
    try {
      await pluginList();
    } catch (err) {
      console.error(chalk.red('Error:'), err.message);
      process.exit(1);
    }
  });

plugin
  .command('search <keyword>')
  .description('Search npm for stxforge plugins')
  .action(async (keyword) => {
    try {
      await pluginSearch(keyword);
    } catch (err) {
      console.error(chalk.red('Error:'), err.message);
      process.exit(1);
    }
  });

program.parse(process.argv);
