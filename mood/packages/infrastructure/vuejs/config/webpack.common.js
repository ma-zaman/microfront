const { VueLoaderPlugin } = require('vue-loader')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  entry: './src/main.ts',
  output: {
    filename: '[name].[contenthash].js'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.vue', '.jsx', '.js', '.json'],
    plugins: [new TsconfigPathsPlugin()]
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|woff|woff2|svg|eot|ttf)$/i,
        use: [
          { loader: 'file-loader' }
        ]
      },
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.tsx?$/,
        use: [
          "babel-loader",
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              appendTsSuffixTo: ["\\.vue$"],
              happyPackMode: true,
            },
          },
        ],
      },
      {
        test: /\.scss|\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime'],
          }
        }
      }
    ]
  },
  plugins: [new VueLoaderPlugin()]
}