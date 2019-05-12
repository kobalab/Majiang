module.exports = {
    entry:  {
        majiang: [ 'babel-polyfill', './src/js/entry.js' ],
        game:      './src/js/game.js',
        autoplay:  './src/js/autoplay.js',
        paipu:     './src/js/paipu.js',
        paili:     './src/js/paili.js',
        hule:      './src/js/hule.js',
        dapai:     './src/js/dapai.js',
        paiga:   [ 'babel-polyfill', './src/js/paiga.js' ],
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
