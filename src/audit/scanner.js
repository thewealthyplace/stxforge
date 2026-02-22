const fs = require('fs-extra');
const path = require('path');
const { ALL_RULES } = require('./rules');

async function scanContracts(contractsDir) {
  const results = [];

  if (!(await fs.pathExists(contractsDir))) {
    return results;
  }

  const files = (await fs.readdir(contractsDir))
    .filter((f) => f.endsWith('.clar'))
    .map((f) => path.join(contractsDir, f));

  for (const filePath of files) {
    const source = await fs.readFile(filePath, 'utf8');
    const lines = source.split('\n');
    const findings = [];

    for (const rule of ALL_RULES) {
      const found = rule.check(lines);
      findings.push(...found);
    }

    results.push({
      file: path.relative(process.cwd(), filePath),
      findings: findings.sort((a, b) => a.line - b.line),
    });
  }

  return results;
}

function summarize(results) {
  let critical = 0;
  let warning = 0;
  let info = 0;

  for (const { findings } of results) {
    for (const f of findings) {
      if (f.severity === 'critical') critical++;
      else if (f.severity === 'warning') warning++;
      else if (f.severity === 'info') info++;
    }
  }

  return { critical, warning, info };
}

module.exports = { scanContracts, summarize };
