// STX-001: Missing asserts! before state-changing operations
// Severity: Critical
//
// Detects define-public functions that contain map-set, var-set, ft-transfer?,
// ft-mint?, ft-burn?, nft-mint?, nft-transfer?, or nft-burn? without a
// preceding asserts! or try! guard in the same function body.

const RULE_ID = 'STX-001';
const SEVERITY = 'critical';
const DESCRIPTION = 'State-changing operation without a preceding asserts! guard';

const STATE_CHANGERS = [
  'map-set', 'map-delete', 'var-set',
  'ft-transfer?', 'ft-mint?', 'ft-burn?',
  'nft-mint?', 'nft-transfer?', 'nft-burn?',
  'stx-transfer?',
];

function check(lines) {
  const findings = [];
  let insidePublic = false;
  let functionStart = 0;
  let hasGuard = false;
  let depth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (/\(define-public/.test(trimmed)) {
      insidePublic = true;
      functionStart = i + 1;
      hasGuard = false;
      depth = 0;
    }

    if (insidePublic) {
      depth += (line.match(/\(/g) || []).length;
      depth -= (line.match(/\)/g) || []).length;

      if (/asserts!|try!/.test(trimmed)) {
        hasGuard = true;
      }

      for (const changer of STATE_CHANGERS) {
        if (trimmed.includes(changer) && !hasGuard) {
          findings.push({
            ruleId: RULE_ID,
            severity: SEVERITY,
            line: i + 1,
            message: `${DESCRIPTION}: \`${changer}\` found without preceding \`asserts!\``,
          });
        }
      }

      if (depth <= 0 && i > functionStart) {
        insidePublic = false;
      }
    }
  }

  return findings;
}

module.exports = { RULE_ID, SEVERITY, DESCRIPTION, check };
