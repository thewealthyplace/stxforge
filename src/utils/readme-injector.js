const fs = require('fs-extra');
const path = require('path');

async function injectReadmeSnippet(config) {
  const readmePath = path.join(process.cwd(), 'README.md');

  const snippet = buildSnippet(config);

  if (!(await fs.pathExists(readmePath))) {
    await fs.writeFile(readmePath, `# Stacks Project\n\n${snippet}`, 'utf8');
    console.log('  ✔ Created: README.md with token snippet');
    return;
  }

  let readme = await fs.readFile(readmePath, 'utf8');
  const marker = `<!-- stxforge:token:${config.contractName} -->`;

  if (readme.includes(marker)) {
    return; // already injected
  }

  readme += `\n\n${marker}\n${snippet}`;
  await fs.writeFile(readmePath, readme, 'utf8');
  console.log('  ✔ Updated: README.md with token snippet');
}

function buildSnippet(config) {
  const lines = [];
  lines.push(`## Token: ${config.name} (${config.symbol})`);
  lines.push('');
  lines.push('| Property | Value |');
  lines.push('|----------|-------|');
  lines.push(`| Name | ${config.name} |`);
  lines.push(`| Symbol | ${config.symbol} |`);
  lines.push(`| Decimals | ${config.decimals} |`);
  lines.push(`| Initial Supply | ${config.supply} |`);
  lines.push(`| Mintable | ${config.mintable ? 'Yes' : 'No'} |`);
  lines.push(`| Burnable | ${config.burnable ? 'Yes' : 'No'} |`);
  lines.push(`| Supply Cap | ${config.capped ? config.maxSupply : 'Unlimited'} |`);
  lines.push('');
  lines.push('### Transfer tokens');
  lines.push('');
  lines.push('```clarity');
  lines.push(`(contract-call? .${config.contractName} transfer u1000000`);
  lines.push("  'SP_SENDER_ADDRESS 'SP_RECIPIENT_ADDRESS none)");
  lines.push('```');
  lines.push('');

  if (config.mintable) {
    lines.push('### Mint tokens');
    lines.push('');
    lines.push('```clarity');
    lines.push(`(contract-call? .${config.contractName} mint u1000000 'SP_RECIPIENT)`);
    lines.push('```');
    lines.push('');
  }

  if (config.burnable) {
    lines.push('### Burn tokens');
    lines.push('');
    lines.push('```clarity');
    lines.push(`(contract-call? .${config.contractName} burn u1000000 'SP_OWNER)`);
    lines.push('```');
    lines.push('');
  }

  return lines.join('\n');
}

module.exports = { injectReadmeSnippet };
