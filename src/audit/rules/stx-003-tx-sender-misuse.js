// STX-003: Use of tx-sender instead of contract-caller in sensitive contexts
// Severity: Warning
//
// When a public function is called via another contract, tx-sender is the
// originating user but contract-caller is the calling contract.
// Using tx-sender for authorization in contract-callable functions
// can allow spoofing in composable contexts.

const RULE_ID = 'STX-003';
const SEVERITY = 'warning';
const DESCRIPTION = 'tx-sender used for authorization — consider contract-caller in composable contexts';

// Patterns that indicate authorization checks using tx-sender
const AUTH_PATTERNS = [
  /is-eq\s+tx-sender/,
  /asserts!.*tx-sender/,
];

function check(lines) {
  const findings = [];

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed.startsWith(';;')) continue;

    for (const pattern of AUTH_PATTERNS) {
      if (pattern.test(trimmed)) {
        findings.push({
          ruleId: RULE_ID,
          severity: SEVERITY,
          line: i + 1,
          message: `${DESCRIPTION}`,
        });
        break; // one finding per line
      }
    }
  }

  return findings;
}

module.exports = { RULE_ID, SEVERITY, DESCRIPTION, check };
