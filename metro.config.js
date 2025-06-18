// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// OPTIONAL: Add custom extensions like .cjs if needed
defaultConfig.resolver.sourceExts.push('cjs');

// OPTIONAL: Disable unstable package exports (helps with some older packages)
defaultConfig.resolver.unstable_enablePackageExports = false;

module.exports = defaultConfig;
