const { describe, it, expect, beforeEach, afterEach } = require('vitest');
const path = require('path');
const fs = require('fs-extra');
const os = require('os');
const {
  loadPluginsManifest,
  addPluginToManifest,
  removePluginFromManifest,
  listInstalledPlugins,
  isPluginInstalled,
} = require('../../src/plugin/plugin-manager');

let tmpDir;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'stxforge-test-'));
});

afterEach(async () => {
  await fs.remove(tmpDir);
});

describe('plugin-manager', () => {
  it('returns empty manifest when no plugins.json exists', async () => {
    const manifest = await loadPluginsManifest(tmpDir);
    expect(manifest.plugins).toEqual({});
  });

  it('adds a plugin to the manifest', async () => {
    await addPluginToManifest('stxforge-plugin-test', '1.0.0', { templates: ['test-template'] }, tmpDir);
    const manifest = await loadPluginsManifest(tmpDir);
    expect(manifest.plugins['stxforge-plugin-test']).toBeDefined();
    expect(manifest.plugins['stxforge-plugin-test'].version).toBe('1.0.0');
  });

  it('removes a plugin from the manifest', async () => {
    await addPluginToManifest('stxforge-plugin-test', '1.0.0', {}, tmpDir);
    await removePluginFromManifest('stxforge-plugin-test', tmpDir);
    const manifest = await loadPluginsManifest(tmpDir);
    expect(manifest.plugins['stxforge-plugin-test']).toBeUndefined();
  });

  it('lists installed plugins', async () => {
    await addPluginToManifest('stxforge-plugin-a', '1.0.0', {}, tmpDir);
    await addPluginToManifest('stxforge-plugin-b', '2.0.0', {}, tmpDir);
    const plugins = await listInstalledPlugins(tmpDir);
    expect(plugins).toHaveLength(2);
    expect(plugins.map((p) => p.name)).toContain('stxforge-plugin-a');
  });

  it('correctly reports whether a plugin is installed', async () => {
    await addPluginToManifest('stxforge-plugin-x', '1.0.0', {}, tmpDir);
    expect(await isPluginInstalled('stxforge-plugin-x', tmpDir)).toBe(true);
    expect(await isPluginInstalled('stxforge-plugin-y', tmpDir)).toBe(false);
  });
});
