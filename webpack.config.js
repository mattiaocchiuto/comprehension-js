var webpack = require('webpack');

module.exports = {
    entry: "./src/index.js",
    output: {
        libraryTarget: "umd",
        path: __dirname,
        filename: "dist/index.min.js"
    },
    module: {},
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false }
        })
    ]
};