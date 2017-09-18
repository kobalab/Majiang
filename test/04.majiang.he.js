const assert = require('assert');

const Majiang = require('../src/js/majiang');

suite('Majiang.He', function(){

  test('クラスが存在すること', function(){assert.ok(Majiang.He)});

  suite('constructor()', function(){
    test('インスタンスが生成できること', function(){
      assert.ok(new Majiang.He());
    });
    test('インスタンス生成時は捨て牌の長さが0であること', function(){
      assert.equal(new Majiang.He()._pai.length, 0);
    });
  });

  suite('.dapai(p)', function(){
    test('不正な打牌ができないこと', function(){
      assert.throws(()=>new Majiang.He().dapai('z8'));
      assert.throws(()=>new Majiang.He().dapai('m1-'));
    });
    test('打牌後捨て牌の長さが1増えること', function(){
      let he = new Majiang.He();
      assert.equal(he._pai.length + 1, he.dapai('m1')._pai.length);
    });
    test('ツモ切りを表現できること', function(){
      assert.equal(new Majiang.He().dapai('m1_')._pai.pop(), 'm1_');
    });
    test('リーチを表現できること', function(){
      assert.equal(new Majiang.He().dapai('m1*')._pai.pop(), 'm1*');
    });
    test('ツモ切りリーチを表現できること', function(){
      assert.equal(new Majiang.He().dapai('m1_*')._pai.pop(), 'm1_*');
    });
  });

  suite('.fulou(d)', function(){
    test('不正な向きから鳴けないこと', function(){
      assert.throws(()=>new Majiang.He().dapai('m1').fulou('*'));
    });
    test('鳴かれても捨て牌の長さが変わらないこと', function(){
      let he = new Majiang.He().dapai('m1');
      assert.equal(he._pai.length, he.fulou('+')._pai.length);
    });
    test('誰から鳴かれたか表現できること', function(){
      let he = new Majiang.He().dapai('m1');
      assert.equal(he.fulou('-')._pai.pop().substr(-1), '-');
    });
  });
});
