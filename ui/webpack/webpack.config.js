const webpack = require('webpack')
const path = require('path')
const autoprefixer = require('autoprefixer');
const config = require('../config')

module.exports = {
    devtool: 'eval',
    entry: [
        'react-hot-loader/patch',
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/only-dev-server',
        './ui/common/theme/reset.css',
        './ui/common/theme/antd.min.css',
        './ui/common/theme/smooth-scrollbar.css',
        './ui/common/theme/elements.css',
        'whatwg-fetch',
        './ui/client/index.js'],
    output: {
        publicPath: `http://${config.webPackHost}:${config.webPackDevServPort}/static/`,
        path: path.join(__dirname, 'static'),
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    plugins: ['transform-runtime']
                }
            }
        }, {
            test: /\.css$/,
            exclude: /node_modules/,
            use: [
                'style-loader',
                'css-loader'
            ]
        }, {
            test: /\.scss$/,
            exclude: /node_modules/,
            use: [{
                loader: 'style-loader',
            }, {
                loader: 'css-loader',
                options: {
                    module: true,
                    localIdentName: '[local]___[hash:base64:5]'
                }
            }, {
                loader: 'sass-loader',
                options: {
                    outputStyle: 'expanded',
                    sourceMap: true
                }
            }, {
                loader: 'postcss-loader'
            }]
        }]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [
                    autoprefixer()
                ]
            }
        })
    ],
    devServer: {
        port: config.webPackDevServPort,
        hot: true,
        inline: false,
        historyApiFallback: true,
        headers: { "Access-Control-Allow-Origin": "*" }
    }
}