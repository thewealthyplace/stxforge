const stx001 = require('./stx-001-missing-asserts');
const stx002 = require('./stx-002-unchecked-contract-call');
const stx003 = require('./stx-003-tx-sender-misuse');
const stx004 = require('./stx-004-unbounded-iteration');
const stx005 = require('./stx-005-missing-docs');
const stx006 = require('./stx-006-no-principal-check');

const ALL_RULES = [stx001, stx002, stx003, stx004, stx005, stx006];

module.exports = { ALL_RULES };
