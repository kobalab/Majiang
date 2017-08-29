const assert = require('assert');
const Majiang = require('../src/js/majiang');

suite('Majiang', function(){
    test('モジュールがが存在すること', function(){assert.ok(Majiang);});
    suite('#VERSION', function(){
        test('バージョン番号が存在すること', function(){
            assert.ok(Majiang.VERSION);
        });
    });
});