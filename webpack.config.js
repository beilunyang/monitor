const path = require('path');

module.exports = {
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'lib'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: path.join(__dirname, 'src/'),
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
  devtool: 'source-map',
  devServer: {
    contentBase: [
      path.join(__dirname, "example"),
      path.join(__dirname, "lib"),
    ],
  },
};
