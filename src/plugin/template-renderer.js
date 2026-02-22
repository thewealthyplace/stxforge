const fs = require('fs-extra');
const path = require('path');
const Handlebars = require('handlebars');

async function renderTemplate(templatePath, context) {
  if (!(await fs.pathExists(templatePath))) {
    return null;
  }

  const source = await fs.readFile(templatePath, 'utf8');
  const compiled = Handlebars.compile(source);
  return compiled(context);
}

async function renderPluginTemplate(template, answers) {
  const context = {
    ...answers,
    contractName: (answers.name || 'mycontract').toLowerCase().replace(/\s+/g, '-'),
  };

  const contractSource = await renderTemplate(template.contractTemplate, context);
  const testSource = template.testTemplate
    ? await renderTemplate(template.testTemplate, context)
    : null;

  return { contractSource, testSource, contractName: context.contractName };
}

async function writePluginOutput(rendered, projectDir = process.cwd()) {
  const { contractSource, testSource, contractName } = rendered;

  const contractsDir = path.join(projectDir, 'contracts');
  const testsDir = path.join(projectDir, 'tests');

  await fs.ensureDir(contractsDir);
  await fs.ensureDir(testsDir);

  if (contractSource) {
    const contractPath = path.join(contractsDir, `${contractName}.clar`);
    await fs.writeFile(contractPath, contractSource, 'utf8');
    console.log(`  ✔ Written: contracts/${contractName}.clar`);
  }

  if (testSource) {
    const testPath = path.join(testsDir, `${contractName}.test.ts`);
    await fs.writeFile(testPath, testSource, 'utf8');
    console.log(`  ✔ Written: tests/${contractName}.test.ts`);
  }
}

module.exports = { renderPluginTemplate, writePluginOutput };
