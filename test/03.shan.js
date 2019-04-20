const assert = require('assert');

const Majiang = require('../src/js/majiang');

suite('Majiang.Shan', function(){

  test('クラスが存在すること', function(){assert.ok(Majiang.Shan)});

  suite('constructor(hongpai)', function(){
    test('インスタンスが生成できること', function(){
      assert.ok(new Majiang.Shan());
    });
    test('赤牌の指定なしでインスタンスが生成できること', function(){
      const pai = 'm1,m1,m1,m1,m2,m2,m2,m2,m3,m3,m3,m3,m4,m4,m4,m4,m5,m5,m5,m5,'
                + 'm6,m6,m6,m6,m7,m7,m7,m7,m8,m8,m8,m8,m9,m9,m9,m9,'
                + 'p1,p1,p1,p1,p2,p2,p2,p2,p3,p3,p3,p3,p4,p4,p4,p4,p5,p5,p5,p5,'
                + 'p6,p6,p6,p6,p7,p7,p7,p7,p8,p8,p8,p8,p9,p9,p9,p9,'
                + 's1,s1,s1,s1,s2,s2,s2,s2,s3,s3,s3,s3,s4,s4,s4,s4,s5,s5,s5,s5,'
                + 's6,s6,s6,s6,s7,s7,s7,s7,s8,s8,s8,s8,s9,s9,s9,s9,'
                + 'z1,z1,z1,z1,z2,z2,z2,z2,z3,z3,z3,z3,z4,z4,z4,z4,'
                + 'z5,z5,z5,z5,z6,z6,z6,z6,z7,z7,z7,z7';
      assert.equal(new Majiang.Shan()._pai.concat().sort().join(), pai);
    });
    test('赤牌を指定してインスタンスが生成できること', function(){
      const pai = 'm0,m1,m1,m1,m1,m2,m2,m2,m2,m3,m3,m3,m3,m4,m4,m4,m4,m5,m5,m5,'
                + 'm6,m6,m6,m6,m7,m7,m7,m7,m8,m8,m8,m8,m9,m9,m9,m9,'
                + 'p0,p0,p1,p1,p1,p1,p2,p2,p2,p2,p3,p3,p3,p3,p4,p4,p4,p4,p5,p5,'
                + 'p6,p6,p6,p6,p7,p7,p7,p7,p8,p8,p8,p8,p9,p9,p9,p9,'
                + 's0,s0,s0,s1,s1,s1,s1,s2,s2,s2,s2,s3,s3,s3,s3,s4,s4,s4,s4,s5,'
                + 's6,s6,s6,s6,s7,s7,s7,s7,s8,s8,s8,s8,s9,s9,s9,s9,'
                + 'z1,z1,z1,z1,z2,z2,z2,z2,z3,z3,z3,z3,z4,z4,z4,z4,'
                + 'z5,z5,z5,z5,z6,z6,z6,z6,z7,z7,z7,z7';
      assert.equal(new Majiang.Shan({m:1,p:2,s:3})
                                            ._pai.concat().sort().join(), pai);
    });
  });

  suite('zhenbaopai(p)', function(){
    test('一萬 → 二萬', function(){
      assert.equal(Majiang.Shan.zhenbaopai('m1'), 'm2');
    });
    test('九萬 → 一萬', function(){
      assert.equal(Majiang.Shan.zhenbaopai('m9'), 'm1');
    });
    test('赤五萬 → 六萬', function(){
      assert.equal(Majiang.Shan.zhenbaopai('m0'), 'm6');
    });
    test('一筒 → 二筒', function(){
      assert.equal(Majiang.Shan.zhenbaopai('p1'), 'p2');
    });
    test('九筒 → 一筒', function(){
      assert.equal(Majiang.Shan.zhenbaopai('p9'), 'p1');
    });
    test('赤五筒 → 六筒', function(){
      assert.equal(Majiang.Shan.zhenbaopai('p0'), 'p6');
    });
    test('一索 → 二索', function(){
      assert.equal(Majiang.Shan.zhenbaopai('s1'), 's2');
    });
    test('九索 → 一索', function(){
      assert.equal(Majiang.Shan.zhenbaopai('s9'), 's1');
    });
    test('赤五索 → 六索', function(){
      assert.equal(Majiang.Shan.zhenbaopai('s0'), 's6');
    });
    test('東 → 南', function(){
      assert.equal(Majiang.Shan.zhenbaopai('z1'), 'z2');
    });
    test('北 → 東', function(){
      assert.equal(Majiang.Shan.zhenbaopai('z4'), 'z1');
    });
    test('白 → 發', function(){
      assert.equal(Majiang.Shan.zhenbaopai('z5'), 'z6');
    });
    test('中 → 白', function(){
      assert.equal(Majiang.Shan.zhenbaopai('z7'), 'z5');
    });
    test('不正な牌 → エラー', function(){
      assert.throws(()=>Majiang.Shan.zhenbaopai('z8'));
    });
  });

  suite('.paishu()', function(){
    test('牌山生成直後の残牌数は122', function(){
      assert.equal(new Majiang.Shan().paishu(), 122);
    });
  });

  suite('.zimo()', function(){
    test('牌山生成直後にツモれること', function(){
      assert.ok(new Majiang.Shan().zimo());
    });
    test('ツモ後に残牌数が減ること', function(){
      let shan = new Majiang.Shan();
      assert.equal(shan.paishu() - 1, shan.zimo() && shan.paishu());
    });
    test('王牌はツモれないこと', function(){
      let shan = new Majiang.Shan();
      while (shan.paishu()) { shan.zimo() }
      assert.throws(()=>shan.zimo());
    });
  });

  suite('.baopai()', function(){
    test('牌山生成直後のドラは1枚', function(){
      assert.equal(new Majiang.Shan().baopai().length, 1);
    });
  });

  suite('.fubaopai()', function(){
    test('牌山生成直後の裏ドラは1枚', function(){
      assert.equal(new Majiang.Shan().fubaopai().length, 1);
    });
  });

  suite('.gangzimo()', function(){
    test('牌山生成直後に槓ツモできること', function(){
      assert.ok(new Majiang.Shan().gangzimo());
    });
    test('槓ツモ後に残牌数が減ること', function(){
      let shan = new Majiang.Shan();
      assert.equal(shan.paishu() - 1, shan.gangzimo() && shan.paishu());
    });
    test('槓ツモ直後はツモれないこと', function(){
      let shan = new Majiang.Shan();
      assert.throws(()=>shan.gangzimo() && shan.zimo());
    });
    test('槓ツモ直後に続けて槓ツモできないこと', function(){
      let shan = new Majiang.Shan();
      assert.throws(()=>shan.gangzimo() && shan.gangzimo());
    });
    test('ハイテイで槓ツモできないこと', function(){
      let shan = new Majiang.Shan();
      while (shan.paishu()) { shan.zimo() }
      assert.throws(()=>shan.gangzimo());
    });
    test('5つ目の槓ツモができないこと', function(){
      let shan = new Majiang.Shan();
      for (let i = 0; i < 4; i++) {
          shan.gangzimo();
          shan.kaigang();
      }
      assert.throws(()=>shan.gangzimo());
    });
  });

  suite('.kaigang()', function(){
    test('牌山生成直後に開槓できないこと', function(){
      assert.throws(()=>new Majiang.Shan().kaigang());
    });
    test('槓ツモ後に開槓できること', function(){
      let shan = new Majiang.Shan();
      assert.ok(shan.gangzimo() && shan.kaigang());
    });
    test('開槓によりドラが増えること', function(){
      let shan = new Majiang.Shan();
      shan.gangzimo();
      assert.equal(shan.baopai().length +1, shan.kaigang().baopai().length);
    });
    test('開槓により裏ドラが増えること', function(){
      let shan = new Majiang.Shan();
      shan.gangzimo();
      assert.equal(shan.fubaopai().length +1, shan.kaigang().fubaopai().length);
    });
    test('開槓後はツモできること', function(){
      let shan = new Majiang.Shan();
      shan.gangzimo();
      assert.ok(shan.kaigang().zimo());
    });
    test('開槓後は槓ツモできること', function(){
      let shan = new Majiang.Shan();
      shan.gangzimo();
      assert.ok(shan.kaigang().gangzimo());
    });
  });
});
