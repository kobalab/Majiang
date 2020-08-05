module.exports = {
    entry:  {
        majiang:   './src/js/entry.js',
        game:      './src/js/game.js',
        autoplay:  './src/js/autoplay.js',
        paipu:     './src/js/paipu.js',
        stat:      './src/js/stat.js',
        paili:     './src/js/paili.js',
        hule:      './src/js/hule.js',
        dapai:     './src/js/dapai.js',
        paiga:     './src/js/paiga.js',
    },
    output: {
        path:     __dirname + '/www/js/',
        filename: '[name].js'
    },
};
