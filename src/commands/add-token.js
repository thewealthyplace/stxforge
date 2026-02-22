const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const { generateTokenContract } = require('../generators/token-contract');
const { generateTokenTests } = require('../generators/token-tests');
const { writeProjectFiles } = require('../utils/file-writer');
const { injectReadmeSnippet } = require('../utils/readme-injector');

async function addToken(opts = {}) {
  console.log(chalk.cyan('\n✦ stxforge — SIP-010 Token Generator\n'));

  const answers = await promptTokenConfig(opts);
  const spinner = ora('Generating token contract...').start();

  try {
    const contractSource = generateTokenContract(answers);
    const testSource = generateTokenTests(answers);

    await writeProjectFiles(answers, contractSource, testSource);
    await injectReadmeSnippet(answers);

    spinner.succeed(chalk.green(`Token contract "${answers.name}" generated successfully!`));
    printNextSteps(answers);
  } catch (err) {
    spinner.fail(chalk.red('Generation failed'));
    throw err;
  }
}

async function promptTokenConfig(opts) {
  const questions = [];

  if (!opts.name) {
    questions.push({
      type: 'input',
      name: 'name',
      message: 'Token name:',
      validate: (v) => v.length >= 2 || 'Name must be at least 2 characters',
    });
  }

  if (!opts.symbol) {
    questions.push({
      type: 'input',
      name: 'symbol',
      message: 'Token symbol (e.g. MTK):',
      validate: (v) => /^[A-Z]{2,10}$/.test(v) || 'Symbol must be 2-10 uppercase letters',
    });
  }

  if (!opts.decimals) {
    questions.push({
      type: 'number',
      name: 'decimals',
      message: 'Decimals:',
      default: 6,
      validate: (v) => (v >= 0 && v <= 18) || 'Decimals must be 0–18',
    });
  }

  if (!opts.supply) {
    questions.push({
      type: 'input',
      name: 'supply',
      message: 'Initial supply (base units):',
      default: '1000000000000',
    });
  }

  questions.push(
    {
      type: 'confirm',
      name: 'mintable',
      message: 'Enable minting (role-based)?',
      default: opts.mintable || false,
      when: () => opts.mintable === undefined,
    },
    {
      type: 'confirm',
      name: 'burnable',
      message: 'Enable burning?',
      default: opts.burnable || false,
      when: () => opts.burnable === undefined,
    },
    {
      type: 'confirm',
      name: 'capped',
      message: 'Enable max supply cap?',
      default: opts.capped || false,
      when: () => opts.capped === undefined,
    },
    {
      type: 'input',
      name: 'maxSupply',
      message: 'Max supply cap (base units):',
      default: '1000000000000',
      when: (ans) => ans.capped === true || opts.capped,
    }
  );

  const answers = await inquirer.prompt(questions);

  return {
    name: opts.name || answers.name,
    symbol: opts.symbol || answers.symbol,
    decimals: opts.decimals !== undefined ? Number(opts.decimals) : answers.decimals,
    supply: opts.supply || answers.supply,
    mintable: opts.mintable !== undefined ? opts.mintable : answers.mintable,
    burnable: opts.burnable !== undefined ? opts.burnable : answers.burnable,
    capped: opts.capped !== undefined ? opts.capped : answers.capped,
    maxSupply: answers.maxSupply || opts.supply || '1000000000000',
    contractName: (opts.name || answers.name).toLowerCase().replace(/\s+/g, '-'),
  };
}

function printNextSteps(answers) {
  console.log(chalk.yellow('\nNext steps:'));
  console.log(`  1. Review ${chalk.cyan(`contracts/${answers.contractName}.clar`)}`);
  console.log(`  2. Run ${chalk.cyan('clarinet check')} to validate`);
  console.log(`  3. Run ${chalk.cyan('clarinet test')} to run the test suite`);
  console.log(`  4. Deploy with ${chalk.cyan('clarinet deployments apply --testnet')}\n`);
}

module.exports = { addToken };
