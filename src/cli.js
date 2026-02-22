#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const { audit } = require('./commands/audit');

program
  .name('stxforge')
  .description('Smart contract scaffolding CLI for the Stacks ecosystem')
  .version('1.0.0');

// stxforge audit [--json]
program
  .command('audit')
  .description('Run Clarity security checklist against contracts/ directory')
  .option('--json', 'Output results as JSON (machine-readable)')
  .action(async (opts) => {
    try {
      await audit(opts);
    } catch (err) {
      console.error(chalk.red('Error:'), err.message);
      process.exit(1);
    }
  });

program.parse(process.argv);
