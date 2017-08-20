const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: [
        './src/index.ts'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'index.js'
    },

    devtool: 'inline-source-map',

    resolve: {
        extensions: [
            '.ts', '.js'
        ],

        modules: ['node_modules', path.resolve(__dirname, './src')]
    },

    module: {
        loaders: [
            {
                test: /\.ts$/,
                //exclude: /node_modules/,
                loader: 'ts-loader',
            },
        ],
    },

    plugins: [
        new CleanWebpackPlugin(['dist']),
    ]
}