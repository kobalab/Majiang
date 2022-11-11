const version = require('./package.json').version;

const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    entry:  {
        majiang:   './src/js/majiang.js',
        index:     './src/js/index.js',
        autoplay:  './src/js/autoplay.js',
        rule:      './src/js/rule.js',
        paipu:     './src/js/paipu.js',
        paili:     './src/js/paili.js',
        hule:      './src/js/hule.js',
        dapai:     './src/js/dapai.js',
        paiga:     './src/js/paiga.js',
    },
    output: {
        path:     __dirname + '/dist/js/',
        filename: `[name]-${version}.js`
    },
    optimization: {
        minimizer: [ new TerserPlugin({extractComments: false}) ],
    },
};
