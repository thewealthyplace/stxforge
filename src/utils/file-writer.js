const fs = require('fs-extra');
const path = require('path');

async function writeProjectFiles(config, contractSource, testSource) {
  const cwd = process.cwd();

  const contractsDir = path.join(cwd, 'contracts');
  const testsDir = path.join(cwd, 'tests');

  await fs.ensureDir(contractsDir);
  await fs.ensureDir(testsDir);

  const contractPath = path.join(contractsDir, `${config.contractName}.clar`);
  const testPath = path.join(testsDir, `${config.contractName}.test.ts`);

  await fs.writeFile(contractPath, contractSource, 'utf8');
  await fs.writeFile(testPath, testSource, 'utf8');

  await updateClarinetToml(config, cwd);

  console.log(`  ✔ Written: contracts/${config.contractName}.clar`);
  console.log(`  ✔ Written: tests/${config.contractName}.test.ts`);
}

async function updateClarinetToml(config, cwd) {
  const tomlPath = path.join(cwd, 'Clarinet.toml');

  if (!(await fs.pathExists(tomlPath))) {
    const initial = `[project]
name = "stacks-project"
requirements = []

[contracts.${config.contractName}]
path = "contracts/${config.contractName}.clar"
`;
    await fs.writeFile(tomlPath, initial, 'utf8');
    console.log(`  ✔ Created: Clarinet.toml`);
    return;
  }

  let toml = await fs.readFile(tomlPath, 'utf8');
  const entry = `\n[contracts.${config.contractName}]\npath = "contracts/${config.contractName}.clar"\n`;

  if (!toml.includes(`[contracts.${config.contractName}]`)) {
    toml += entry;
    await fs.writeFile(tomlPath, toml, 'utf8');
    console.log(`  ✔ Updated: Clarinet.toml`);
  }
}

module.exports = { writeProjectFiles };
