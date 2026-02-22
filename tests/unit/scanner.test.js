const { describe, it, expect } = require('vitest');
const path = require('path');
const { scanContracts, summarize } = require('../../src/audit/scanner');

const FIXTURES_DIR = path.join(__dirname, '../fixtures');

describe('scanContracts', () => {
  it('returns an empty array for a non-existent directory', async () => {
    const results = await scanContracts('/nonexistent/path');
    expect(results).toEqual([]);
  });

  it('scans fixture contracts and returns results per file', async () => {
    const results = await scanContracts(FIXTURES_DIR);
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0]).toHaveProperty('file');
    expect(results[0]).toHaveProperty('findings');
  });

  it('finds issues in the vulnerable fixture contract', async () => {
    const results = await scanContracts(FIXTURES_DIR);
    const vulnerable = results.find((r) => r.file.includes('vulnerable'));
    expect(vulnerable).toBeDefined();
    expect(vulnerable.findings.length).toBeGreaterThan(0);
  });
});

describe('summarize', () => {
  it('counts critical, warning, and info correctly', () => {
    const results = [
      {
        file: 'a.clar',
        findings: [
          { severity: 'critical', ruleId: 'STX-001', line: 1, message: '' },
          { severity: 'warning',  ruleId: 'STX-003', line: 2, message: '' },
          { severity: 'info',     ruleId: 'STX-005', line: 3, message: '' },
        ],
      },
    ];
    const summary = summarize(results);
    expect(summary.critical).toBe(1);
    expect(summary.warning).toBe(1);
    expect(summary.info).toBe(1);
  });

  it('returns zeros for empty results', () => {
    const summary = summarize([]);
    expect(summary).toEqual({ critical: 0, warning: 0, info: 0 });
  });
});
