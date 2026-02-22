const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const { scanContracts, summarize } = require('../audit/scanner');
const { printReport, printJsonReport } = require('../audit/reporter');

async function audit(opts = {}) {
  const contractsDir = path.join(process.cwd(), 'contracts');
  const useJson = opts.json === true;

  if (!useJson) {
    console.log(chalk.cyan('\n✦ stxforge audit — Clarity Security Checklist\n'));
  }

  const spinner = useJson ? null : ora('Scanning contracts...').start();

  try {
    const results = await scanContracts(contractsDir);

    if (spinner) spinner.stop();

    const summary = summarize(results);

    if (useJson) {
      printJsonReport(results, summary);
    } else {
      const totalFiles = results.length;
      console.log(chalk.dim(`Auditing ${totalFiles} contract${totalFiles !== 1 ? 's' : ''}...\n`));
      printReport(results, summary);
    }

    // Exit code 1 when critical issues are found (CI-friendly)
    if (summary.critical > 0) {
      process.exitCode = 1;
    }
  } catch (err) {
    if (spinner) spinner.fail(chalk.red('Audit failed'));
    throw err;
  }
}

module.exports = { audit };
