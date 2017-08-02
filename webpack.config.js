// Webpack setup based on Stephen Grider's Udemy Webpack 2 course

var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var packageJson = require('./package');

const VENDOR_LIBS = ['react', 'react-dom'];

const config = {
  entry: {
    bundle: './src/index.js',
    vendor: VENDOR_LIBS
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].[chunkhash].js',
    publicPath: './'
  },
  module: {
    rules: [
      {
        use: 'babel-loader',
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules/foundation-sites/js')
        ]
      },
      {
        loader: ExtractTextPlugin.extract({
          use: ['css-loader', 'sass-loader']
        }),
        test: /\.s?css$/
      },
      {
        use: [
          {
            loader: 'url-loader',
            options: { limit: 40000 }
          },
          'image-webpack-loader'
        ],
        test: /\.(jpe?g|png|gif|svg)$/
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({ filename: '[name].[chunkhash].css', allChunks: true }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest']
    }),
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ]
};

module.exports = config;
