const path = require('path');
const webpack = require('webpack');


const ROOT_PATH = __dirname;
const DIST_PATH = path.join(__dirname, 'dist');

const config = {
  context: ROOT_PATH,

  entry: {
    tendon: './src/index.js'
  },

  output: {
    path: DIST_PATH,
    filename: '[name].bundle.js',
    libraryTarget: 'var',
    library: 'tendon'
  },

  resolve: {
    extensions: ['.mjs', '.js' ]
  },
};

module.exports = config;