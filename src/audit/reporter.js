const chalk = require('chalk');

const SEVERITY_LABEL = {
  critical: chalk.red.bold('CRIT'),
  warning: chalk.yellow('WARN'),
  info: chalk.cyan('INFO'),
};

function printReport(results, summary) {
  console.log('');

  if (results.length === 0) {
    console.log(chalk.yellow('No .clar contracts found in contracts/ directory.'));
    return;
  }

  for (const { file, findings } of results) {
    console.log(chalk.bold.underline(file));

    if (findings.length === 0) {
      console.log(`  ${chalk.green('✓')} No issues found`);
    } else {
      for (const f of findings) {
        const label = SEVERITY_LABEL[f.severity] || f.severity.toUpperCase();
        console.log(`  ${label}  [line ${f.line}] ${chalk.dim(f.ruleId)}  ${f.message}`);
      }
    }

    console.log('');
  }

  const { critical, warning, info } = summary;
  const critStr = critical > 0 ? chalk.red.bold(`${critical} critical`) : `${critical} critical`;
  const warnStr = warning > 0 ? chalk.yellow(`${warning} warning`) : `${warning} warning`;
  const infoStr = chalk.cyan(`${info} info`);

  console.log(chalk.bold(`Audit complete: ${critStr}, ${warnStr}, ${infoStr}`));
  console.log('');
}

function printJsonReport(results, summary) {
  const output = {
    summary,
    contracts: results.map(({ file, findings }) => ({
      file,
      findings,
    })),
  };
  console.log(JSON.stringify(output, null, 2));
}

module.exports = { printReport, printJsonReport };
