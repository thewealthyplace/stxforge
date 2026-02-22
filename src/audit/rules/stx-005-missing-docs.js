// STX-005: Missing doc annotations on public functions
// Severity: Info
//
// Public functions that do not have a ;; @doc or ;; description comment
// immediately preceding them are flagged. Good documentation is essential
// for auditability and developer experience.

const RULE_ID = 'STX-005';
const SEVERITY = 'info';
const DESCRIPTION = 'Public function is missing a documentation comment';

function check(lines) {
  const findings = [];

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    if (!/^\(define-public/.test(trimmed)) continue;

    // Extract function name
    const nameMatch = trimmed.match(/\(define-public\s+\((\S+)/);
    const fnName = nameMatch ? nameMatch[1] : 'unknown';

    // Check the previous non-empty line for a comment
    let prevIdx = i - 1;
    while (prevIdx >= 0 && lines[prevIdx].trim() === '') {
      prevIdx--;
    }

    const prevLine = prevIdx >= 0 ? lines[prevIdx].trim() : '';
    const hasDoc = prevLine.startsWith(';;');

    if (!hasDoc) {
      findings.push({
        ruleId: RULE_ID,
        severity: SEVERITY,
        line: i + 1,
        message: `${DESCRIPTION}: \`${fnName}\` — add a ;; comment above it`,
      });
    }
  }

  return findings;
}

module.exports = { RULE_ID, SEVERITY, DESCRIPTION, check };
