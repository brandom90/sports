const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add path aliases
config.resolver.alias = {
  '@': path.resolve(__dirname, '.'),
  '@components': path.resolve(__dirname, 'components'),
  '@app': path.resolve(__dirname, 'app'),
  '@utils': path.resolve(__dirname, 'utils'),
  '@hooks': path.resolve(__dirname, 'hooks'),
  '@types': path.resolve(__dirname, 'types'),
  '@assets': path.resolve(__dirname, 'assets'),
};

module.exports = withNativeWind(config, { input: './global.css' });