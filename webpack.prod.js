const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const commonConfig = require('./webpack.common.js');

const pathsToClean = ['dist/*.*']; // all files in 'dist' folder
const config = merge(commonConfig, {

  // Webpack 4+ already does some minifying and concatonating for us by setting
  // the mode to 'production'. https://webpack.js.org/concepts/mode/#mode-production
  mode: 'production',

  output: {
    // TODO: want to handle caching with file name contenthash, but need to
    // figure out how to do this with requesting specific assets in rails.
    // filename: '[contenthash].[name].bundle.js'
    filename: '[name].bundle.js'
  },
  plugins: [
    new CleanWebpackPlugin(pathsToClean),
  ],
  devtool: 'source-map'
});

module.exports = config;
