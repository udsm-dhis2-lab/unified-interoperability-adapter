const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = (config, context) => {
  // Extend the existing Webpack configuration

  config.plugins.push(
    new MonacoWebpackPlugin({
      languages: ['typescript', 'javascript'],  // Add any other languages you need
      filename: 'static/[name].worker.js'       // Specify worker filename pattern
    })
  );

  return config;
};
