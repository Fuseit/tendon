const webpack = require('webpack');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

const config = merge(commonConfig, {
  mode: 'development',

  // This outputs an entry named 'foobar' into
  // app/assets/javascripts/entries/foobar.js.
  output: {
    // webpack dev server serves file from this path
    publicPath: 'http://localhost:9999/public'
  },

  // Use babel-loader for our *.js files.
  module: {
    rules: [
      {
        test: /.js?$/,
        exclude: /node_modules|bower_components/,
        loader: 'babel-loader'
      }
    ]
  },

  // Configuration for webpack-dev-server
  devServer: {
    hot: true,
    open: false,
    publicPath: 'http://localhost:9999/public',
    proxy: {
      '/api': 'http://localhost:3000/'
    },
    port: 9999,
    // Set so rails server can access assets on webpack dev server
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },

  plugins: [new webpack.HotModuleReplacementPlugin()],

  devtool: 'eval-source-map'
});

module.exports = config;
