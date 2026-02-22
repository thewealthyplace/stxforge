const path = require('path');
const fs = require('fs-extra');
const { validatePluginPackageJson, validateTemplateSchema } = require('./schema-validator');

const SANDBOX_ALLOWLIST = ['templates', 'index.js', 'package.json', 'README.md'];

async function loadPlugin(pluginName, nodeModulesDir = path.join(process.cwd(), 'node_modules')) {
  const pluginDir = path.join(nodeModulesDir, pluginName);

  if (!(await fs.pathExists(pluginDir))) {
    throw new Error(`Plugin "${pluginName}" not found in node_modules. Run: stxforge plugin install ${pluginName}`);
  }

  const pkgPath = path.join(pluginDir, 'package.json');
  const pkg = await fs.readJson(pkgPath);

  // Validate plugin package.json
  const pkgErrors = validatePluginPackageJson(pkg);
  if (pkgErrors.length > 0) {
    throw new Error(`Invalid plugin package.json:\n  ${pkgErrors.join('\n  ')}`);
  }

  // Validate sandbox — only allowed files/dirs can be accessed
  const dirContents = await fs.readdir(pluginDir);
  for (const entry of dirContents) {
    if (!SANDBOX_ALLOWLIST.includes(entry) && !entry.startsWith('node_modules')) {
      // Warn but don't block — log it
      console.warn(`[stxforge] Plugin "${pluginName}" has unexpected entry: ${entry}`);
    }
  }

  // Load templates
  const templates = [];
  const templatesDir = path.join(pluginDir, 'templates');

  if (await fs.pathExists(templatesDir)) {
    const templateDirs = await fs.readdir(templatesDir);

    for (const templateName of templateDirs) {
      const templatePath = path.join(templatesDir, templateName);
      const schemaPath = path.join(templatePath, 'schema.json');

      if (!(await fs.pathExists(schemaPath))) continue;

      const schema = await fs.readJson(schemaPath);
      const schemaErrors = validateTemplateSchema(schema);

      if (schemaErrors.length > 0) {
        throw new Error(`Invalid template schema in "${templateName}":\n  ${schemaErrors.join('\n  ')}`);
      }

      templates.push({
        name: templateName,
        schema,
        path: templatePath,
        contractTemplate: path.join(templatePath, 'contract.clar.hbs'),
        testTemplate: path.join(templatePath, 'test.ts.hbs'),
      });
    }
  }

  return {
    name: pluginName,
    version: pkg.version,
    verified: pkg.stxforge.verified || false,
    templates,
  };
}

module.exports = { loadPlugin };
