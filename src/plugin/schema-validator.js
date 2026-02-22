// Validates a plugin package.json and schema.json before loading
// Ensures plugins conform to the stxforge plugin contract.

const REQUIRED_PLUGIN_FIELDS = ['name', 'version', 'stxforge'];
const REQUIRED_STXFORGE_FIELDS = ['plugin', 'templates'];

function validatePluginPackageJson(pkg) {
  const errors = [];

  for (const field of REQUIRED_PLUGIN_FIELDS) {
    if (!pkg[field]) {
      errors.push(`Missing required field: "${field}" in package.json`);
    }
  }

  if (pkg.stxforge) {
    if (pkg.stxforge.plugin !== true) {
      errors.push('package.json must declare stxforge.plugin = true');
    }

    for (const field of REQUIRED_STXFORGE_FIELDS) {
      if (!pkg.stxforge[field]) {
        errors.push(`Missing required stxforge field: "${field}"`);
      }
    }
  }

  if (!pkg.name || !pkg.name.startsWith('stxforge-plugin-')) {
    errors.push('Plugin package name must start with "stxforge-plugin-"');
  }

  return errors;
}

function validateTemplateSchema(schema) {
  const errors = [];

  if (!schema.name || typeof schema.name !== 'string') {
    errors.push('schema.json: "name" must be a string');
  }

  if (!schema.description || typeof schema.description !== 'string') {
    errors.push('schema.json: "description" must be a string');
  }

  if (!Array.isArray(schema.prompts)) {
    errors.push('schema.json: "prompts" must be an array');
  } else {
    for (let i = 0; i < schema.prompts.length; i++) {
      const prompt = schema.prompts[i];
      if (!prompt.name) errors.push(`schema.json prompts[${i}]: missing "name"`);
      if (!prompt.type) errors.push(`schema.json prompts[${i}]: missing "type"`);
      if (!prompt.message) errors.push(`schema.json prompts[${i}]: missing "message"`);
    }
  }

  return errors;
}

module.exports = { validatePluginPackageJson, validateTemplateSchema };
