/******************************************************************************************
 * Repository: https://github.com/kolserdav/werift-sfu-react.git
 * File name: webpack.config.js
 * Author: Sergey Kolmiller
 * Email: <uyem.ru@gmail.com>
 * License: MIT
 * License text: See in LICENSE file
 * Copyright: kolserdav, All rights reserved (c)
 * Create Date: Wed Aug 24 2022 14:14:09 GMT+0700 (Krasnoyarsk Standard Time)
 ******************************************************************************************/
/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check

const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env) => {
  const { NODE_ENV, PORT } = env;
  return {
    mode: NODE_ENV,
    context: __dirname,
    entry: './package/Main.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'Main.js',
      libraryTarget: 'commonjs',
    },
    devtool: 'source-map',
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      alias: {
        react: path.resolve(__dirname, '../../node_modules/react'),
      },
    },
    plugins: [
      new CleanWebpackPlugin(),
      new webpack.BannerPlugin(fs.readFileSync(path.resolve(__dirname, '../../LICENSE'), 'utf8')),
      new MiniCssExtractPlugin({
        filename: 'styles.css',
      }),
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.compile.json',
          },
        },
        { test: /\.js$/, loader: 'source-map-loader' },
        {
          test: /\.(scss|css)$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
        },
      ],
    },
    externals: [
      {
        react: 'react',
      },
    ],
  };
};
