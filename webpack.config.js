var webpack = require("webpack");

var libraryName = 'Comprehensions';
var fileName = 'index';

module.exports = {
    entry: "./src/" + fileName + ".js",
    devtool: "source-map",
    output: {
        path: __dirname,
        filename: "dist/" + fileName + ".min.js",
        libraryTarget: "umd",
        library: libraryName,
        umdNamedDefine: true
    },
    module: {},
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false }
        })
    ]
};