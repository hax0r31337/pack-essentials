const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    resolve: {
        modules: ['src', 'node_modules']
    },
    devtool: false,
    entry: {
        vendor: ['@babel/polyfill', 'react', 'react-dom'],
        client: './src/index.js',
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].[contenthash].js',
        chunkFilename: '[name].[contenthash].js',
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/i,
                exclude: /node_modules/,
                use: ['style-loader', 'css-loader', 'postcss-loader']
            },
        ]
    },
    devServer: {
        historyApiFallback: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'EncryptMyPack-OSS',
            template: './src/index.html',
            filename: './index.html',
            inject: true,
            minify: {
                collapseWhitespace: true,
                collapseInlineTagWhitespace: true,
                minifyCSS: true,
                minifyURLs: true,
                minifyJS: true,
                removeComments: true,
                removeRedundantAttributes: true
            }
        }),
        new AddAssetHtmlPlugin({ filepath: require.resolve('./wasm/build/wasm_exec.js') }),
        new CopyWebpackPlugin({
            patterns: [
                { from: './wasm/build/libresourcepack.wasm', to: './' }
            ]
        })
    ]
};