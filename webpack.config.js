module.exports = {
    entry:  {
        majiang: [ 'babel-polyfill', './src/js/entry.js' ],
        paili:     './src/js/paili.js',
    },
    output: {
        path:     __dirname + '/www/js/',
        filename: '[name].js'
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
        ]
    },
};
