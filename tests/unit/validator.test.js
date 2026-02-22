const { describe, it, expect } = require('vitest');
const { validateTokenConfig } = require('../../src/utils/validator');

describe('validateTokenConfig', () => {
  const valid = {
    name: 'MyToken',
    symbol: 'MTK',
    decimals: 6,
    supply: '1000000000000',
    capped: false,
    maxSupply: '1000000000000',
  };

  it('returns no errors for a valid config', () => {
    expect(validateTokenConfig(valid)).toHaveLength(0);
  });

  it('errors when name is too short', () => {
    const errors = validateTokenConfig({ ...valid, name: 'A' });
    expect(errors.some(e => e.includes('name'))).toBe(true);
  });

  it('errors when symbol is lowercase', () => {
    const errors = validateTokenConfig({ ...valid, symbol: 'mtk' });
    expect(errors.some(e => e.includes('symbol'))).toBe(true);
  });

  it('errors when symbol is too long', () => {
    const errors = validateTokenConfig({ ...valid, symbol: 'TOOLONGSYM' });
    expect(errors.length).toBeGreaterThan(0);
  });

  it('errors when decimals > 18', () => {
    const errors = validateTokenConfig({ ...valid, decimals: 19 });
    expect(errors.some(e => e.includes('Decimals'))).toBe(true);
  });

  it('errors when supply is zero', () => {
    const errors = validateTokenConfig({ ...valid, supply: '0' });
    expect(errors.some(e => e.includes('supply'))).toBe(true);
  });

  it('errors when initial supply exceeds max supply in capped mode', () => {
    const errors = validateTokenConfig({
      ...valid,
      capped: true,
      supply: '2000000000000',
      maxSupply: '1000000000000',
    });
    expect(errors.some(e => e.includes('exceed'))).toBe(true);
  });

  it('errors when reserved symbol is used', () => {
    const errors = validateTokenConfig({ ...valid, symbol: 'STX' });
    expect(errors.some(e => e.includes('reserved'))).toBe(true);
  });
});
