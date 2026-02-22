const { loadPlugin } = require('./plugin-loader');
const { renderPluginTemplate, writePluginOutput } = require('./template-renderer');
const { validatePluginPackageJson, validateTemplateSchema } = require('./schema-validator');
const {
  loadPluginsManifest,
  addPluginToManifest,
  removePluginFromManifest,
  listInstalledPlugins,
  isPluginInstalled,
} = require('./plugin-manager');
const { installNpmPackage, uninstallNpmPackage, getInstalledVersion } = require('./npm-installer');

module.exports = {
  loadPlugin,
  renderPluginTemplate,
  writePluginOutput,
  validatePluginPackageJson,
  validateTemplateSchema,
  loadPluginsManifest,
  addPluginToManifest,
  removePluginFromManifest,
  listInstalledPlugins,
  isPluginInstalled,
  installNpmPackage,
  uninstallNpmPackage,
  getInstalledVersion,
};
