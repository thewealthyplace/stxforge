const { scanContracts, summarize } = require('./scanner');
const { printReport, printJsonReport } = require('./reporter');
const { ALL_RULES } = require('./rules');

module.exports = { scanContracts, summarize, printReport, printJsonReport, ALL_RULES };
