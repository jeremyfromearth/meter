var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var Paths = {
    Build: path.resolve(__dirname, 'build'),
    App: path.resolve(__dirname, 'app'),
}

var config = {
    entry: {
        app: Paths.App + "/main.js"
    },

    output: {
        path: Paths.Build,
        filename: '[name].js'
    },

    resolve: {
        extensions: ['', '.js', '.jsx']
    },

    module: {
        loaders: [{
            test: /\.js/,
            loader: 'babel-loader',
            include: Paths.App,
            exclude: /(node_modules)/,
        }, { 
            test: /\.css$/, 
            loader: 'style-loader!css-loader' 
        }]
    }, 
    
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Meter'
        })
    ]
}

module.exports = config;
