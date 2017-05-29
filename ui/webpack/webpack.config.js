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
        './ui/common/theme/elements.css',
        './ui/client/index.js'],
    output: {
        publicPath: `http://${config.webPackHost}:${config.webPackDevServPort}/static/`,
        path: path.join(__dirname, 'static'),
        filename: 'bundle.js'
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loaders: [
                'babel-loader'
            ]
        }, {
            test: /\.css$/,
            loaders: [
                'style-loader',
                'css-loader'
            ]
        }, {
            test: /\.scss$/,
            exclude: /node_modules/,
            loaders: [
                'style-loader', {
                    loader: 'css-loader',
                    query: {
                        sourceMap: true,
                        module: true,
                        localIdentName: '[local]___[hash:base64:5]'
                    }
                }, {
                    loader: 'sass-loader',
                    query: {
                        outputStyle: 'expanded',
                        sourceMap: true
                    }
                },
                'postcss-loader'
            ]
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