// STX-004: Unbounded fold or map over user-supplied lists
// Severity: Warning
//
// Clarity's fold and map are bounded by the list definition, but when
// the list comes from a function argument, cost can be unpredictable.
// Flag public functions that accept a list parameter AND use fold/map.

const RULE_ID = 'STX-004';
const SEVERITY = 'warning';
const DESCRIPTION = 'Unbounded fold/map over a list parameter — ensure input size is constrained';

function check(lines) {
  const findings = [];
  let insidePublic = false;
  let hasListParam = false;
  let depth = 0;
  let functionStart = 0;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    if (/\(define-public/.test(trimmed)) {
      insidePublic = true;
      functionStart = i + 1;
      hasListParam = /(list\s+\d+|list\s+\()/.test(trimmed) || /\(list /.test(trimmed);
      depth = 0;
    }

    if (insidePublic) {
      depth += (lines[i].match(/\(/g) || []).length;
      depth -= (lines[i].match(/\)/g) || []).length;

      if (i > functionStart && hasListParam && /\b(fold|map)\b/.test(trimmed)) {
        findings.push({
          ruleId: RULE_ID,
          severity: SEVERITY,
          line: i + 1,
          message: `${DESCRIPTION}`,
        });
      }

      if (depth <= 0 && i > functionStart) {
        insidePublic = false;
        hasListParam = false;
      }
    }
  }

  return findings;
}

module.exports = { RULE_ID, SEVERITY, DESCRIPTION, check };
