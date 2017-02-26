var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

var Paths = {
    Build: path.resolve(process.cwd(), '../server/meter/static/build/'),
    App: path.resolve(__dirname, 'app'),
};

var config = {
    entry: {
        app: Paths.App + "/js/main.js"
    },

    output: {
        path: Paths.Build,
        filename: '[name][chunkhash].js'
    },

    devServer: {
        outputPath: Paths.Build
    },

    resolve: {
        extensions: ['*', '.js']
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
        }, { 
	    test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, 
            loader: 'url-loader?limit=10000&mimetype=application/font-woff'
        }, { 
            test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, 
            loader: 'url-loader?limit=10000&mimetype=application/font-woff' 
        }, { 
            test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, 
            loader: 'url-loader?limit=10000&mimetype=application/octet-stream' 
        }, { 
            test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, 
            loader: 'file-loader' 
        }, { 
            test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, 
            loader: 'url-loader?limit=10000&mimetype=image/svg+xml' 
        }]
    }, 
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Meter'
        })
        /*
        new CleanWebpackPlugin(['../server/meter/static/build'], {
            dry: false,
            verbose: true,
            root: path.resolve(__dirname, '..')
        }),
        */
        /*
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false,
            }
        }),
        */
    ]
};

module.exports = function(env) {
    return config;
}
