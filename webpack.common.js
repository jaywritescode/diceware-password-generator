/* eslint-env node */
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    'react-devtools': 'react-devtools',
    popup: './app/popup.jsx',
    background: './app/background.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  resolve: {
    alias: {
      '_variables.sass': path.resolve(__dirname, 'app/styles/_variables.sass'),
    },
  },
  module: {
    rules: [{
      test: /\.s(a|c)ss$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        {
          loader: 'sass-loader',
          options: {
            implementation: require('sass'),
            sourceMap: true,
          }
        }
      ]
    }, {
      test: /\.jsx$/,
      exclude: /node_modules/,
      use: ['babel-loader', {
        loader: 'eslint-loader',
        options: {
          fix: true
        },
      }],
    }, {
      test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
      loader: 'url-loader',
      options: {
        limit: 8192,
      },
    }],
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