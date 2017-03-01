const ExtractTextPlugin = require('extract-text-webpack-plugin');
const join = require('path').join;

module.exports = {
  context: join(__dirname, '/public'),

  entry: {
    app: './js/main.js',
    landing: './js/landing.js',
  },

  output: {
    path: './public/build/',
    filename: '[name].bundle.js'
  },

  devtool: 'inline-source-map',

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

  externals: {
    '_': '_', // lodash
    'jquery': '$' // jquery
  },

  plugins: [
    new ExtractTextPlugin('./[name].bundle.css', {
      allChunks: true,
    }),
  ],

};