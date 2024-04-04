const { merge } = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')
const commonConfig = require('./webpack.common')
const packageJson = require('../package.json')
const Dotenv = require('dotenv-webpack');

const devConfig = {
  mode: 'development',
  output: {
    publicPath: 'http://localhost:8084/'
  },
  devServer: {
    port: 8084,
    historyApiFallback: {
      index: '/index.html'
    },
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'mood',
      filename: 'remoteEntry.js',
      exposes: {
        './MoodApp': './src/bootstrap'
      },
      shared: {
        ...packageJson.dependencies.map,
        "vue-router": { singleton: true, eager: true },
        "vue": { singleton: true, eager: true },
        "boosted": { singleton: true, eager: true },
        "@popperjs/core": { singleton: true, eager: true },
        "vue-i18n": { singleton: true, eager: true },
        "pinia": { singleton: true, eager: true }
      },
    }),
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new Dotenv()
  ]
}

module.exports = merge(commonConfig, devConfig)