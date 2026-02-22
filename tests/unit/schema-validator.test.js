const { describe, it, expect } = require('vitest');
const { validatePluginPackageJson, validateTemplateSchema } = require('../../src/plugin/schema-validator');

describe('validatePluginPackageJson', () => {
  const validPkg = {
    name: 'stxforge-plugin-test',
    version: '1.0.0',
    stxforge: { plugin: true, templates: ['my-template'] },
  };

  it('returns no errors for a valid plugin package.json', () => {
    expect(validatePluginPackageJson(validPkg)).toHaveLength(0);
  });

  it('errors when name does not start with stxforge-plugin-', () => {
    const errors = validatePluginPackageJson({ ...validPkg, name: 'my-plugin' });
    expect(errors.some(e => e.includes('stxforge-plugin-'))).toBe(true);
  });

  it('errors when stxforge.plugin is not true', () => {
    const errors = validatePluginPackageJson({
      ...validPkg,
      stxforge: { plugin: false, templates: [] },
    });
    expect(errors.some(e => e.includes('plugin = true'))).toBe(true);
  });

  it('errors when stxforge.templates is missing', () => {
    const errors = validatePluginPackageJson({
      ...validPkg,
      stxforge: { plugin: true },
    });
    expect(errors.some(e => e.includes('templates'))).toBe(true);
  });

  it('errors when version is missing', () => {
    const { version: _, ...noVersion } = validPkg;
    const errors = validatePluginPackageJson(noVersion);
    expect(errors.some(e => e.includes('"version"'))).toBe(true);
  });
});

describe('validateTemplateSchema', () => {
  const validSchema = {
    name: 'my-template',
    description: 'A test template',
    prompts: [
      { name: 'tokenName', type: 'input', message: 'Token name:' },
    ],
  };

  it('returns no errors for a valid schema', () => {
    expect(validateTemplateSchema(validSchema)).toHaveLength(0);
  });

  it('errors when name is missing', () => {
    const { name: _, ...noName } = validSchema;
    expect(validateTemplateSchema(noName).some(e => e.includes('"name"'))).toBe(true);
  });

  it('errors when description is missing', () => {
    const { description: _, ...noDesc } = validSchema;
    expect(validateTemplateSchema(noDesc).some(e => e.includes('"description"'))).toBe(true);
  });

  it('errors when prompts is not an array', () => {
    const errors = validateTemplateSchema({ ...validSchema, prompts: 'bad' });
    expect(errors.some(e => e.includes('"prompts"'))).toBe(true);
  });

  it('errors when a prompt is missing name', () => {
    const errors = validateTemplateSchema({
      ...validSchema,
      prompts: [{ type: 'input', message: 'hi' }],
    });
    expect(errors.some(e => e.includes('"name"'))).toBe(true);
  });
});
