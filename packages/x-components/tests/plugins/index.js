const { startDevServer } = require('@cypress/webpack-dev-server');
const webpackConfig = require('@vue/cli-service/webpack.config.js');
const esbuild = require('@bahmutov/cypress-esbuild-preprocessor');
const createFeaturePlugin = require('cypress-cucumber-preprocessor/lib/esbuildPlugin');
const { filelocPlugin } = require('esbuild-plugin-fileloc');
const path = require('path');

module.exports = (on, config) => {
  on('dev-server:start', options =>
    startDevServer({
      options,
      webpackConfig
    })
  );
  on(
    'file:preprocessor',
    esbuild({
      platform: 'browser',
      inject: [path.resolve(__dirname, 'process.polyfill.js')],
      define: {
        global: 'window'
      },
      plugins: [
        createFeaturePlugin(),
        filelocPlugin(),
        {
          name: 'CucumberTransforms',
          setup(build) {
            // https://github.com/evanw/esbuild/issues/85#issuecomment-809680329
            build.onResolve({ filter: /^path$/ }, args => {
              return { path: require.resolve('path-browserify') };
            });
          }
        }
      ]
    })
  );

  return config;
};
