// STX-006: Public functions with no principal validation
// Severity: Warning
//
// Detects define-public functions that do not contain any principal
// validation: no is-eq tx-sender, no is-eq contract-caller, no asserts!
// involving a principal. Such functions are callable by anyone, which
// may be intentional but should be reviewed.

const RULE_ID = 'STX-006';
const SEVERITY = 'warning';
const DESCRIPTION = 'Public function has no principal validation — verify this is intentional';

const PRINCIPAL_CHECKS = [
  /is-eq\s+tx-sender/,
  /is-eq\s+contract-caller/,
  /asserts!.*principal/,
  /is-eq.*CONTRACT-OWNER/,
  /is-eq.*contract-caller/,
];

function check(lines) {
  const findings = [];
  let insidePublic = false;
  let functionStart = 0;
  let fnName = '';
  let hasPrincipalCheck = false;
  let depth = 0;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    if (/^\(define-public/.test(trimmed)) {
      insidePublic = true;
      functionStart = i + 1;
      hasPrincipalCheck = false;
      depth = 0;
      const m = trimmed.match(/\(define-public\s+\((\S+)/);
      fnName = m ? m[1] : 'unknown';
    }

    if (insidePublic) {
      depth += (lines[i].match(/\(/g) || []).length;
      depth -= (lines[i].match(/\)/g) || []).length;

      for (const pattern of PRINCIPAL_CHECKS) {
        if (pattern.test(trimmed)) {
          hasPrincipalCheck = true;
          break;
        }
      }

      if (depth <= 0 && i > functionStart) {
        if (!hasPrincipalCheck) {
          findings.push({
            ruleId: RULE_ID,
            severity: SEVERITY,
            line: functionStart,
            message: `${DESCRIPTION}: \`${fnName}\``,
          });
        }
        insidePublic = false;
      }
    }
  }

  return findings;
}

module.exports = { RULE_ID, SEVERITY, DESCRIPTION, check };
