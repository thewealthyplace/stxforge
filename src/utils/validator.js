function validateTokenConfig(config) {
  const errors = [];

  if (!config.name || config.name.trim().length < 2) {
    errors.push('Token name must be at least 2 characters.');
  }

  if (!config.symbol || !/^[A-Z]{2,10}$/.test(config.symbol)) {
    errors.push('Token symbol must be 2-10 uppercase letters (A-Z).');
  }

  const decimals = Number(config.decimals);
  if (isNaN(decimals) || decimals < 0 || decimals > 18) {
    errors.push('Decimals must be a number between 0 and 18.');
  }

  const supply = BigInt(config.supply || '0');
  if (supply <= 0n) {
    errors.push('Initial supply must be greater than 0.');
  }

  if (config.capped) {
    const maxSupply = BigInt(config.maxSupply || '0');
    if (maxSupply <= 0n) {
      errors.push('Max supply must be greater than 0.');
    }
    if (supply > maxSupply) {
      errors.push('Initial supply cannot exceed max supply.');
    }
  }

  const reserved = ['stx', 'stacks', 'bitcoin', 'btc'];
  if (reserved.includes(config.symbol.toLowerCase())) {
    errors.push(`Symbol "${config.symbol}" is reserved and cannot be used.`);
  }

  return errors;
}

module.exports = { validateTokenConfig };
