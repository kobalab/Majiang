module.exports = {
    entry:  './src/js/majiang.js',
    output: {
        path:     __dirname + '/www/js/',
        filename: 'majiang.js'
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
        ]
    },
    devtool: 'inline-source-map',
};
