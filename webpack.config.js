const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    popup: './app/popup.js',
    background: './app/background.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
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
  devtool: 'cheap-module-source-map',
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'main.css'
    }),
    new HtmlWebpackPlugin({
      inject: false,
      hash: true,
      template: './app/popup.html',
      filename: 'popup.html',
    }),
    new CopyPlugin([
      {
        from: './app/manifest.json',
        to: '.',
      },
      {
        from: './app/data',
        to: 'data',
      },
    ]),
  ],
};