const assert  = require('assert');
const semver  = require('semver');

const package = require('../package.json');

const Majiang = require('../src/js/majiang');

suite('Majiang', function(){
  test('モジュールがが存在すること', function(){assert.ok(Majiang);});
  suite('VERSION', function(){
    test('バージョン番号が存在すること', function(){
      assert.ok(Majiang.VERSION);
    });
    test('バージョン番号の形式が正しいこと', function(){
      assert.ok(semver.valid(Majiang.VERSION));
    });
    test('メジャー・バージョン番号が 1 であること', function(){
      assert.ok(semver.satisfies(Majiang.VERSION, '<2 >=1'));
    });
    test('package.json のバージョン番号と一致すること', function(){
      assert.equal(Majiang.VERSION, package.version);
    });
  });
});
