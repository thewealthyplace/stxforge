# stxforge audit

Run a static security analysis against all Clarity contracts in your project.

## Usage

```bash
stxforge audit            # human-readable output
stxforge audit --json     # machine-readable JSON output
```

## Rules

| Rule ID | Severity | Description |
|---------|----------|-------------|
| STX-001 | Critical | Missing `asserts!` before state-changing operations (`map-set`, `ft-transfer?`, etc.) |
| STX-002 | Critical | Unchecked `contract-call?` return value — wrap with `try!`, `unwrap!`, or `match` |
| STX-003 | Warning  | `tx-sender` used for authorization — consider `contract-caller` in composable contexts |
| STX-004 | Warning  | `fold`/`map` over a list parameter without a bounded size constraint |
| STX-005 | Info     | Public function missing a `;;` doc comment |
| STX-006 | Warning  | Public function with no principal validation (callable by anyone) |

## Exit Codes

| Code | Meaning |
|------|---------|
| `0` | No critical findings |
| `1` | One or more critical findings (STX-001 or STX-002) |

This makes `stxforge audit` safe to use in CI pipelines:

```yaml
- run: stxforge audit --json > audit.json
- run: node -e "if(require('./audit.json').summary.critical>0) process.exit(1)"
```

## JSON Output Format

```json
{
  "summary": {
    "critical": 2,
    "warning": 1,
    "info": 0
  },
  "contracts": [
    {
      "file": "contracts/dao.clar",
      "findings": [
        {
          "ruleId": "STX-001",
          "severity": "critical",
          "line": 87,
          "message": "State-changing operation without a preceding asserts! guard: `map-set` found without preceding `asserts!`"
        }
      ]
    }
  ]
}
```

## Example Terminal Output

```
✦ stxforge audit — Clarity Security Checklist

Auditing 2 contracts...

contracts/token.clar
  ✓ No issues found

contracts/dao.clar
  CRIT  [line 87]  STX-001  State-changing operation without asserts!: map-set
  CRIT  [line 103] STX-002  contract-call? return value is not checked
  WARN  [line 42]  STX-003  tx-sender used for authorization

Audit complete: 2 critical, 1 warning, 0 info
```
