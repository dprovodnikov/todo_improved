const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

module.exports = {

  entry: path.join(__dirname, '/js/main.js'),

  output: {
    path: path.join(__dirname, 'build'),
    filename: 'build.js'
  },

  watch: true,

  devtool: 'source-map',

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel?presets[]=es2015',
        exclude: /\/node_modules\//,
      },
      {
        test: /\.vue$/,
        loader: 'vue',
        exclude: /\/node_modules\//,
      },
      {
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract('css!stylus?resolve url'),
        exclude: /\/node_modules\//,
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
        loader: 'url-loader?limit=30000&name=[path][name].[ext]'
      }
    ],
  },

  plugins: [
    new ExtractTextPlugin('build.css', {
      allChunks: true,
    }),
  ],

};