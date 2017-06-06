const webpack = require('webpack')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const config = require('../config')

const extractSass = new ExtractTextPlugin('./css/[name].min.css')

module.exports = {
    devtool: 'cheap-module-source-map',
    entry: {
        index: './ui/client/index_pro.js',
        vendors: [
            'react',
            'react-dom',
            'react-router',
            'react-redux',
            'redux',
            'redux-thunk',
            'redux-api-middleware',
            'react-router-redux',
            'redux-logger',
            'bluebird',
            'moment'
        ],
        antd: ['antd'],
        semantic: 'semantic-ui-react'
    },
    output: {
        path: path.join(__dirname, 'asset'),
        filename: '[name].js'
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
            test: /\.scss$/,
            exclude: /node_modules/,
            use: extractSass.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'css-loader',
                    options: {
                        module: true,
                        localIdentName: '[local]___[hash:base64:5]'
                    }
                },
                    'sass-loader',
                    'postcss-loader']
            })
        }]
    },
    plugins: [
        extractSass,
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendors', 'antd', 'semantic'],
            filename: '[name].min.js',
            minChunks: Infinity
        }),
        new webpack.ProvidePlugin({
            "React": "react",
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            minimize: true,
            comments: false,
            mangle: {
                screw_ie8: true,
                keep_fnames: true
            },
            compress: {
                warnings: false,
                screw_ie8: true
            }
        })
    ]
}