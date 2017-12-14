const webpack = require('webpack')
const path = require('path')
const autoprefixer = require('autoprefixer');
const config = require('../config')

module.exports = {
    devtool: 'eval',
    entry: [
        'react-hot-loader/patch',
        'webpack-dev-server/client?http://localhost:8081',
        'webpack/hot/only-dev-server',
        './ui/common/theme/_general.scss',
        './ui/common/theme/reset.css',
        './ui/common_backends/theme/antd.min.css',
        './ui/common/theme/smooth-scrollbar.css',
        './ui/common/theme/react-big-calendar.css',
        './ui/common_backends/theme/bigcalendar-dnd-styles.css',
        './ui/common/theme/quill.core.css',
        './ui/common/theme/quill.bubble.css',
        './ui/common/theme/quill.snow.css',
        './ui/common/theme/elements.css',
        './vendors/jquery/jquery-3.2.1.min.js',
        './ui/common_backends/index.js'],
    output: {
        publicPath: `http://${config.webPackHost}:${config.ssrWebpackPort}/static/`,
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
                    babelrc: false,
                    presets: ["es2015", "stage-0", "react"],
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
                    localIdentName: '[name]__[local]___[hash:base64:5]'
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
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('dev')
            }
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [
                    autoprefixer()
                ]
            }
        })
    ],
    devServer: {
        port: config.ssrWebpackPort,
        hot: true,
        inline: false,
        historyApiFallback: true,
        headers: { "Access-Control-Allow-Origin": "*" },
        proxy: {
            '/api/*': {
                target: `http://127.0.0.1:${config.ssrApiDevPort}`
            }
        }
    }
}