const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [{
      test: /\.scss$/,
      include: [
        path.resolve(__dirname, 'app/styles')
      ],
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        {
          loader: 'sass-loader',
          options: {
            implementation: require('sass'),
          }
        }
      ]
    }]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'main.css'
    }),
  ],
};