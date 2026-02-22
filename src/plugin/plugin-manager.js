const path = require('path');
const fs = require('fs-extra');

const PLUGINS_FILE = '.stxforge/plugins.json';

async function getPluginsFilePath(cwd = process.cwd()) {
  return path.join(cwd, PLUGINS_FILE);
}

async function loadPluginsManifest(cwd = process.cwd()) {
  const filePath = await getPluginsFilePath(cwd);
  if (!(await fs.pathExists(filePath))) {
    return { plugins: {} };
  }
  return fs.readJson(filePath);
}

async function savePluginsManifest(manifest, cwd = process.cwd()) {
  const filePath = await getPluginsFilePath(cwd);
  await fs.ensureDir(path.dirname(filePath));
  await fs.writeJson(filePath, manifest, { spaces: 2 });
}

async function addPluginToManifest(name, version, metadata, cwd = process.cwd()) {
  const manifest = await loadPluginsManifest(cwd);
  manifest.plugins[name] = {
    version,
    installedAt: new Date().toISOString(),
    verified: metadata.verified || false,
    templates: metadata.templates || [],
  };
  await savePluginsManifest(manifest, cwd);
}

async function removePluginFromManifest(name, cwd = process.cwd()) {
  const manifest = await loadPluginsManifest(cwd);
  delete manifest.plugins[name];
  await savePluginsManifest(manifest, cwd);
}

async function listInstalledPlugins(cwd = process.cwd()) {
  const manifest = await loadPluginsManifest(cwd);
  return Object.entries(manifest.plugins).map(([name, info]) => ({ name, ...info }));
}

async function isPluginInstalled(name, cwd = process.cwd()) {
  const manifest = await loadPluginsManifest(cwd);
  return Boolean(manifest.plugins[name]);
}

module.exports = {
  loadPluginsManifest,
  savePluginsManifest,
  addPluginToManifest,
  removePluginFromManifest,
  listInstalledPlugins,
  isPluginInstalled,
};
