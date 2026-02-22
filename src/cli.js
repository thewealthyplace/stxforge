#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const { addToken } = require('./commands/add-token');

program
  .name('stxforge')
  .description('Smart contract scaffolding CLI for the Stacks ecosystem')
  .version('1.0.0');

const add = program.command('add').description('Add a new contract to your project');

add
  .command('token')
  .description('Scaffold a SIP-010 fungible token contract')
  .option('--name <name>', 'Token name')
  .option('--symbol <symbol>', 'Token symbol')
  .option('--decimals <decimals>', 'Number of decimals')
  .option('--supply <supply>', 'Initial supply')
  .option('--mintable', 'Enable minting capability')
  .option('--burnable', 'Enable burning capability')
  .option('--capped', 'Enable max supply cap')
  .action(async (opts) => {
    try {
      await addToken(opts);
    } catch (err) {
      console.error(chalk.red('Error:'), err.message);
      process.exit(1);
    }
  });

program.parse(process.argv);
