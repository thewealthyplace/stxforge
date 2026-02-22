const { describe, it, expect } = require('vitest');
const { generateTokenContract } = require('../../src/generators/token-contract');

describe('generateTokenContract', () => {
  const base = {
    name: 'TestToken',
    symbol: 'TTK',
    decimals: 6,
    supply: '1000000000000',
    mintable: false,
    burnable: false,
    capped: false,
    maxSupply: '1000000000000',
    contractName: 'testtoken',
  };

  it('includes SIP-010 trait implementation', () => {
    const src = generateTokenContract(base);
    expect(src).toContain('impl-trait');
    expect(src).toContain('sip-010-trait');
  });

  it('defines an uncapped fungible token when capped is false', () => {
    const src = generateTokenContract(base);
    expect(src).toContain('(define-fungible-token testtoken)');
  });

  it('defines a capped fungible token when capped is true', () => {
    const src = generateTokenContract({ ...base, capped: true });
    expect(src).toContain('(define-fungible-token testtoken u1000000000000)');
  });

  it('includes all SIP-010 read-only functions', () => {
    const src = generateTokenContract(base);
    expect(src).toContain('(define-read-only (get-name)');
    expect(src).toContain('(define-read-only (get-symbol)');
    expect(src).toContain('(define-read-only (get-decimals)');
    expect(src).toContain('(define-read-only (get-balance');
    expect(src).toContain('(define-read-only (get-total-supply)');
    expect(src).toContain('(define-read-only (get-token-uri)');
  });

  it('includes transfer function with correct guards', () => {
    const src = generateTokenContract(base);
    expect(src).toContain('(define-public (transfer');
    expect(src).toContain('ERR-NOT-TOKEN-OWNER');
    expect(src).toContain('ERR-INVALID-AMOUNT');
    expect(src).toContain('ERR-INVALID-RECIPIENT');
  });

  it('includes mint function when mintable is true', () => {
    const src = generateTokenContract({ ...base, mintable: true });
    expect(src).toContain('(define-public (mint');
    expect(src).toContain('set-minter');
  });

  it('does not include mint function when mintable is false', () => {
    const src = generateTokenContract(base);
    expect(src).not.toContain('(define-public (mint');
  });

  it('includes burn function when burnable is true', () => {
    const src = generateTokenContract({ ...base, burnable: true });
    expect(src).toContain('(define-public (burn');
  });

  it('does not include burn function when burnable is false', () => {
    const src = generateTokenContract(base);
    expect(src).not.toContain('(define-public (burn');
  });

  it('includes max supply cap guard in mint when capped', () => {
    const src = generateTokenContract({ ...base, mintable: true, capped: true });
    expect(src).toContain('ERR-MAX-SUPPLY-REACHED');
    expect(src).toContain('MAX-SUPPLY');
  });

  it('includes initialization block minting initial supply to CONTRACT-OWNER', () => {
    const src = generateTokenContract(base);
    expect(src).toContain('ft-mint?');
    expect(src).toContain('CONTRACT-OWNER');
  });

  it('uses the correct token name in data var', () => {
    const src = generateTokenContract(base);
    expect(src).toContain('"TestToken"');
  });

  it('uses the correct symbol in data var', () => {
    const src = generateTokenContract(base);
    expect(src).toContain('"TTK"');
  });

  it('uses the correct decimals', () => {
    const src = generateTokenContract(base);
    expect(src).toContain('u6');
  });
});
