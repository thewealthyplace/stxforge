// STX-002: Unchecked contract-call? return values
// Severity: Critical
//
// Detects contract-call? invocations whose response is not wrapped in
// try!, unwrap!, unwrap-panic!, match, or is-ok / is-err.

const RULE_ID = 'STX-002';
const SEVERITY = 'critical';
const DESCRIPTION = 'contract-call? return value is not checked';

function check(lines) {
  const findings = [];

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    if (!trimmed.includes('contract-call?')) continue;
    if (trimmed.startsWith(';;')) continue; // skip comments

    const hasCheck =
      /try!\s*\(contract-call\?/.test(trimmed) ||
      /unwrap!\s*\(contract-call\?/.test(trimmed) ||
      /unwrap-panic!\s*\(contract-call\?/.test(trimmed) ||
      /match\s*\(contract-call\?/.test(trimmed) ||
      /is-ok\s*\(contract-call\?/.test(trimmed) ||
      /is-err\s*\(contract-call\?/.test(trimmed);

    if (!hasCheck) {
      findings.push({
        ruleId: RULE_ID,
        severity: SEVERITY,
        line: i + 1,
        message: `${DESCRIPTION} — wrap with try!, unwrap!, or match`,
      });
    }
  }

  return findings;
}

module.exports = { RULE_ID, SEVERITY, DESCRIPTION, check };
