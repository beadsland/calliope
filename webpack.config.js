var path = require('path');

module.exports = {
  mode: 'development',
  entry: './calliope.js',
  output: {
    path: path.resolve(__dirname, 'app/scripts'),
    filename: 'calliope-bundle.js'
  }
};
