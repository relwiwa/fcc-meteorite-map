var config = require('./webpack.config.js');
config.output.publicPath = '/';
config.output.sourceMapFilename = '[name].[chunkhash].map';
config.devtool = '#eval-cheap-module-source-map';
config.devServer = {
  historyApiFallback: true
};

module.exports = config;
