const webpack = require('webpack')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const config = require('../config')

const extractSass = new ExtractTextPlugin('./css/[name].min.css')

module.exports = {
    devtool: 'cheap-module-source-map',
    entry: {
        index: './ui/nano/index.js',
        login: './ui/nano/index.js',
        vendors: [
            'react',
            'react-dom',
            'react-redux',
            'react-cookie',
            'react-router-redux',
            'react-smooth-scrollbar',

            'redux',
            'redux-api-middleware',
            'redux-thunk',
            'redux-logger',

            'isomorphic-fetch',
            'react-google-maps',
            'react-fontawesome',
            'lodash',
            'moment',
            'react-chartjs-2'
        ],
        antd: ['antd']
    },
    output: {
        path: path.join(__dirname, 'nano_asset'),
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
            test: /\.css$/,
            exclude: /node_modules/,
            use: [
                'style-loader',
                'css-loader'
            ]
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
        }, {
            test: /\.(png|jpg|)$/,
            exclude: /node_modules/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 200000
                }
            }]
        }]
    },
    plugins: [
        extractSass,
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendors', 'antd'],
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