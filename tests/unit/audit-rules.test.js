const { describe, it, expect } = require('vitest');
const stx001 = require('../../src/audit/rules/stx-001-missing-asserts');
const stx002 = require('../../src/audit/rules/stx-002-unchecked-contract-call');
const stx003 = require('../../src/audit/rules/stx-003-tx-sender-misuse');
const stx004 = require('../../src/audit/rules/stx-004-unbounded-iteration');
const stx005 = require('../../src/audit/rules/stx-005-missing-docs');
const stx006 = require('../../src/audit/rules/stx-006-no-principal-check');

// Helper
const lines = (src) => src.split('\n');

// ── STX-001 ────────────────────────────────────────────────────────────
describe('STX-001: missing asserts!', () => {
  it('flags map-set without asserts!', () => {
    const src = `(define-public (bad)
  (begin
    (map-set my-map key val)
    (ok true)))`;
    expect(stx001.check(lines(src)).length).toBeGreaterThan(0);
  });

  it('does not flag map-set preceded by asserts!', () => {
    const src = `(define-public (good)
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-ONLY)
    (map-set my-map key val)
    (ok true)))`;
    expect(stx001.check(lines(src)).length).toBe(0);
  });

  it('flags ft-transfer? without asserts!', () => {
    const src = `(define-public (unsafe-transfer)
  (begin
    (ft-transfer? mytoken u100 sender recipient)
    (ok true)))`;
    expect(stx001.check(lines(src)).length).toBeGreaterThan(0);
  });
});

// ── STX-002 ────────────────────────────────────────────────────────────
describe('STX-002: unchecked contract-call?', () => {
  it('flags bare contract-call?', () => {
    const src = `(contract-call? .other do-thing)`;
    expect(stx002.check(lines(src)).length).toBeGreaterThan(0);
  });

  it('does not flag try!-wrapped contract-call?', () => {
    const src = `(try! (contract-call? .other do-thing))`;
    expect(stx002.check(lines(src)).length).toBe(0);
  });

  it('does not flag unwrap!-wrapped contract-call?', () => {
    const src = `(unwrap! (contract-call? .other do-thing) ERR-FAIL)`;
    expect(stx002.check(lines(src)).length).toBe(0);
  });

  it('ignores commented lines', () => {
    const src = `;; (contract-call? .other do-thing)`;
    expect(stx002.check(lines(src)).length).toBe(0);
  });
});

// ── STX-003 ────────────────────────────────────────────────────────────
describe('STX-003: tx-sender misuse', () => {
  it('flags is-eq tx-sender authorization check', () => {
    const src = `(asserts! (is-eq tx-sender CONTRACT-OWNER) ERR)`;
    expect(stx003.check(lines(src)).length).toBeGreaterThan(0);
  });

  it('ignores read-only functions using tx-sender', () => {
    // STX-003 is about all tx-sender auth checks — it is a warning to review
    const src = `(define-read-only (get-owner) tx-sender)`;
    expect(stx003.check(lines(src)).length).toBe(0);
  });
});

// ── STX-004 ────────────────────────────────────────────────────────────
describe('STX-004: unbounded iteration', () => {
  it('flags fold inside a public function with list parameter', () => {
    const src = `(define-public (process (items (list 100 uint)))
  (begin
    (asserts! true (err u1))
    (ok (fold + items u0))))`;
    expect(stx004.check(lines(src)).length).toBeGreaterThan(0);
  });
});

// ── STX-005 ────────────────────────────────────────────────────────────
describe('STX-005: missing doc comments', () => {
  it('flags public function without preceding comment', () => {
    const src = `
(define-public (undocumented)
  (ok true))`;
    expect(stx005.check(lines(src)).length).toBeGreaterThan(0);
  });

  it('does not flag public function with preceding comment', () => {
    const src = `
;; Transfers tokens to recipient
(define-public (transfer (amount uint))
  (ok true))`;
    expect(stx005.check(lines(src)).length).toBe(0);
  });
});

// ── STX-006 ────────────────────────────────────────────────────────────
describe('STX-006: no principal check', () => {
  it('flags public function with no principal validation', () => {
    const src = `(define-public (open-fn)
  (begin
    (var-set my-var u1)
    (ok true)))`;
    expect(stx006.check(lines(src)).length).toBeGreaterThan(0);
  });

  it('does not flag function with CONTRACT-OWNER check', () => {
    const src = `(define-public (protected-fn)
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR)
    (var-set my-var u1)
    (ok true)))`;
    expect(stx006.check(lines(src)).length).toBe(0);
  });
});
