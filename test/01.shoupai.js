const assert  = require('assert');

const Majiang = require('../src/js/majiang');

function Shoupai(paistr) { return Majiang.Shoupai.fromString(paistr) }

suite('Majiang.Shoupai', function(){

  test('クラスが存在すること', function(){assert.ok(Majiang.Shoupai)});

  suite('constructor(qipai)', function(){
    test('インスタンスが生成できること', function(){
      assert.ok(new Majiang.Shoupai());
    });
    test('配牌の指定なしでもインスタンスが生成できること', function(){
      assert.ok(new Majiang.Shoupai([]));
    });
    test('配牌を指定してインスタンスが生成できること', function(){
      const qipai = ['m1','m2','m3','p4','p5','p6','s7','s8','s9',
                     'z1','z2','z3','z4'];
      assert.equal('' + new Majiang.Shoupai(qipai), 'm123p456s789z1234');
    });
  });

  suite('valid_pai(p)', function(){
    test('m1    : 正常', function(){
      assert.equal('m1', Majiang.Shoupai.valid_pai('m1'))
    });
    test('m1_   : 正常(ツモ切)', function(){
      assert.equal('m1_', Majiang.Shoupai.valid_pai('m1_'))
    });
    test('m1*   : 正常(リーチ)', function(){
      assert.equal('m1*', Majiang.Shoupai.valid_pai('m1*'))
    });
    test('m1_*  : 正常(ツモ切、リーチ)', function(){
      assert.equal('m1_*', Majiang.Shoupai.valid_pai('m1_*'))
    });
    test('m1-   : 正常(被副露)', function(){
      assert.equal('m1-', Majiang.Shoupai.valid_pai('m1-'))
    });
    test('m1_+  : 正常(ツモ切、被副露)', function(){
      assert.equal('m1_+', Majiang.Shoupai.valid_pai('m1_+'))
    });
    test('m1*=  : 正常(リーチ、被副露)', function(){
      assert.equal('m1*=', Majiang.Shoupai.valid_pai('m1*='))
    });
    test('m1_*- : 正常(ツモ切、リーチ、被副露)', function(){
      assert.equal('m1_*-', Majiang.Shoupai.valid_pai('m1_*-'))
    });
    test('x     : 不正', function(){
      assert.ifError(Majiang.Shoupai.valid_pai('x'))
    });
    test('mm    : 不正', function(){
      assert.ifError(Majiang.Shoupai.valid_pai('mm'))
    });
    test('z0    : 不正', function(){
      assert.ifError(Majiang.Shoupai.valid_pai('z0'))
    });
    test('z8    : 不正', function(){
      assert.ifError(Majiang.Shoupai.valid_pai('z8'))
    });
    test('m1x   : 不正', function(){
      assert.ifError(Majiang.Shoupai.valid_pai('m1x'))
    });
    test('m1=*  : 不正', function(){
      assert.ifError(Majiang.Shoupai.valid_pai('m1=*'))
    });
    test('m1*_  : 不正', function(){
      assert.ifError(Majiang.Shoupai.valid_pai('m1*_'))
    });
    test('m1=_  : 不正', function(){
      assert.ifError(Majiang.Shoupai.valid_pai('m1=_'))
    });
  });

  suite('valid_mianzi(m)', function(){
    test('m111+  : 正常', function(){
      assert.equal(Majiang.Shoupai.valid_mianzi('m111+'), 'm111+');
    });
    test('p555=  : 正常', function(){
      assert.equal(Majiang.Shoupai.valid_mianzi('p555='), 'p555=');
    });
    test('s999-  : 正常', function(){
      assert.equal(Majiang.Shoupai.valid_mianzi('s999-'), 's999-');
    });
    test('z777+7 : 正常', function(){
      assert.equal(Majiang.Shoupai.valid_mianzi('z777+7'), 'z777+7');
    });
    test('m2222  : 正常', function(){
      assert.equal(Majiang.Shoupai.valid_mianzi('m2222'), 'm2222');
    });
    test('p550=  : 正常', function(){
      assert.equal(Majiang.Shoupai.valid_mianzi('p550='), 'p550=');
    });
    test('p5550= : 正常', function(){
      assert.equal(Majiang.Shoupai.valid_mianzi('p5550='), 'p5550=');
    });
    test('p055=  : 正常 => p505=', function(){
      assert.equal(Majiang.Shoupai.valid_mianzi('p055='), 'p505=');
    });
    test('p055=0 : 正常 => p505=0', function(){
      assert.equal(Majiang.Shoupai.valid_mianzi('p055=0'), 'p505=0');
    });
    test('p000=0 : 正常', function(){
      assert.equal(Majiang.Shoupai.valid_mianzi('p000=0'), 'p000=0');
    });
    test('s0555- : 正常 => s5505-', function(){
      assert.equal(Majiang.Shoupai.valid_mianzi('s0555-'), 's5505-');
    });
    test('s0055- : 正常 => s5005-', function(){
      assert.equal(Majiang.Shoupai.valid_mianzi('s0055-'), 's5005-');
    });
    test('s0005  : 正常 => s5000', function(){
      assert.equal(Majiang.Shoupai.valid_mianzi('s0005'), 's5000');
    });
    test('s0000  : 正常 => s0000', function(){
      assert.equal(Majiang.Shoupai.valid_mianzi('s0000'), 's0000');
    });
    test('m1-23  : 正常', function(){
      assert.equal(Majiang.Shoupai.valid_mianzi('m1-23'), 'm1-23');
    });
    test('m12-3  : 正常', function(){
      assert.equal(Majiang.Shoupai.valid_mianzi('m12-3'), 'm12-3');
    });
    test('m123-  : 正常', function(){
      assert.equal(Majiang.Shoupai.valid_mianzi('m123-'), 'm123-');
    });
    test('m231-  : 正常 => m1-23', function(){
      assert.equal(Majiang.Shoupai.valid_mianzi('m231-'), 'm1-23');
    });
    test('m312-  : 正常 => m12-3', function(){
      assert.equal(Majiang.Shoupai.valid_mianzi('m312-'), 'm12-3');
    });
    test('m3-12  : 正常 => m123-', function(){
      assert.equal(Majiang.Shoupai.valid_mianzi('m3-12'), 'm123-');
    });
    test('m460-  : 正常 => m40-6', function(){
      assert.equal(Majiang.Shoupai.valid_mianzi('m460-'), 'm40-6');
    });
    test('m1234− : 不正', function(){
      assert.ifError(Majiang.Shoupai.valid_mianzi('m1234-'));
    });
    test('m135−  : 不正', function(){
      assert.ifError(Majiang.Shoupai.valid_mianzi('m135-'));
    });
    test('m1234  : 不正', function(){
      assert.ifError(Majiang.Shoupai.valid_mianzi('m1234'));
    });
  });

  suite('fromString(paistr)', function(){
    test('パラメータなしでもインスタンスが生成できること', function(){
      assert.equal(''+Majiang.Shoupai.fromString(), '');
    });
    test('空文字列からでもインスタンスが生成できること', function(){
      assert.equal(''+Majiang.Shoupai.fromString(''), '');
    });
    test('副露なしの場合にインスタンスが生成できること', function(){
      assert.equal(''+Majiang.Shoupai.fromString('z7654s987p654m321'),
                                                 'm123p456s789z4567');
    });
    test('副露ありの場合でもインスタンスが生成できること', function(){
      assert.equal(''+Majiang.Shoupai.fromString('m1,p123-,s555=,z777+7,m9999'),
                                                 'm1,p123-,s555=,z777+7,m9999');
    });
    test('少牌の場合でもインスタンスが生成できること', function(){
      assert.equal(''+Majiang.Shoupai.fromString('m111p222s333'),
                                                 'm111p222s333');
    });
    test('多牌の場合、14枚としてからインスタンスを生成すること', function(){
      assert.equal(''+Majiang.Shoupai.fromString('m123456789p123456'),
                                                 'm123456789p1234p5');
    });
    test('多牌の場合、14枚としてからインスタンスを生成すること(副露あり)', function(){
      assert.equal(''+Majiang.Shoupai.fromString('m123456789p123,z111='),
                                                 'm123456789p1p2,z111=');
      assert.equal(''+Majiang.Shoupai.fromString('m123,z111=,p123-,s555=,z777+'),
                                                 'm1m2,z111=,p123-,s555=,z777+');
    });
    test('ツモ牌を再現してインスタンスを生成すること', function(){
      assert.equal(''+Majiang.Shoupai.fromString('m11123456789991'),
                                                 'm1112345678999m1');
    });
    test('ツモ牌を再現してインスタンスを生成すること(副露あり)', function(){
      assert.equal(''+Majiang.Shoupai.fromString('m12p345s678z23m3,z111='),
                                                 'm12p345s678z23m3,z111=');
    });
    test('手牌中の赤牌を再現してインスタンスを生成すること', function(){
      assert.equal(''+Majiang.Shoupai.fromString('m5550p5500s0000z00'),
                                                 'm0555p0055s0000');
    });
    test('リーチを再現してインスタンスを生成すること', function(){
      assert.equal(''+Majiang.Shoupai.fromString('m123p456s789z1112*'),
                                                 'm123p456s789z1112*');
    });
    test('リーチを再現してインスタンスを生成すること(暗槓あり)', function(){
      assert.equal(''+Majiang.Shoupai.fromString('m123p456s789z2*,z1111'),
                                                 'm123p456s789z2*,z1111');
    });
    test('リーチを再現してインスタンスを生成すること(副露あり)', function(){
      assert.equal(''+Majiang.Shoupai.fromString('m123p456s789z2*,z111+'),
                                                 'm123p456s789z2*,z111+');
    });
    test('副露面子を正規化してインスタンスを生成すること(チー)', function(){
      assert.equal(''+Majiang.Shoupai.fromString('m123p456s789z2,m403-'),
                                                 'm123p456s789z2,m3-40');
      assert.equal(''+Majiang.Shoupai.fromString('m123p456s789z2,m304-'),
                                                 'm123p456s789z2,m34-0');
      assert.equal(''+Majiang.Shoupai.fromString('m123p456s789z2,m345-'),
                                                 'm123p456s789z2,m345-');
    });
    test('副露面子を正規化してインスタンスを生成すること(ポン)', function(){
      assert.equal(''+Majiang.Shoupai.fromString('m123p456s789z2,p050+'),
                                                 'm123p456s789z2,p500+');
      assert.equal(''+Majiang.Shoupai.fromString('m123p456s789z2,p055+'),
                                                 'm123p456s789z2,p505+');
      assert.equal(''+Majiang.Shoupai.fromString('m123p456s789z2,p550+'),
                                                 'm123p456s789z2,p550+');
    });
    test('副露面子を正規化してインスタンスを生成すること(カン)', function(){
      assert.equal(''+Majiang.Shoupai.fromString('m123p456s789z2,s0555='),
                                                 'm123p456s789z2,s5505=');
      assert.equal(''+Majiang.Shoupai.fromString('m123p456s789z2,s0050='),
                                                 'm123p456s789z2,s5000=');
      assert.equal(''+Majiang.Shoupai.fromString('m123p456s789z2,s0505'),
                                                 'm123p456s789z2,s5500');
    });
    test('不正な副露面子を無視してインスタンスを生成すること(不正な牌)', function(){
      assert.equal(''+Majiang.Shoupai.fromString('m123p456s789z2,z000+'),
                                                 'm123p456s789z2');
      assert.equal(''+Majiang.Shoupai.fromString('m123p456s789z2,z888+'),
                                                 'm123p456s789z2');
    });
    test('不正な副露面子を無視してインスタンスを生成すること(字牌でのチー)', function(){
      assert.equal(''+Majiang.Shoupai.fromString('m123p456s789z2,z1-23'),
                                                 'm123p456s789z2');
    });
    test('不正な副露面子を無視してインスタンスを生成すること(下家からのチー)', function(){
      assert.equal(''+Majiang.Shoupai.fromString('m123p456s789z2,s1+23'),
                                                 'm123p456s789z2');
    });
    test('不正な副露面子を無視してインスタンスを生成すること(対子)', function(){
      assert.equal(''+Majiang.Shoupai.fromString('m123p456s789z2,z11-'),
                                                 'm123p456s789z2');
    });
    test('不正な副露面子を無視してインスタンスを生成すること(両嵌)', function(){
      assert.equal(''+Majiang.Shoupai.fromString('m123p456s789z2,s13-5'),
                                                 'm123p456s789z2');
    });
    test('不正な副露面子を無視してインスタンスを生成すること(連子)', function(){
      assert.equal(''+Majiang.Shoupai.fromString('m123p456s789z2,m1p2s3-'),
                                                 'm123p456s789z2');
    });
    test('副露直後の手牌を再現してインスタンスを生成すること', function(){
      assert.equal(''+Majiang.Shoupai.fromString('p456s789z1,m12-3,p999=,'),
                                                 'p456s789z1,m12-3,p999=,');
    });
  });

  suite('.clone()', function(){
    test('インスタンスを複製すること', function(){
      const shoupai = new Majiang.Shoupai();
      assert.notEqual(shoupai, shoupai.clone());
    });
    test('手牌を再現してインスタンスを複製すること', function(){
      const shoupai = Majiang.Shoupai.fromString('m123p456s789z4567');
      assert.equal('' + shoupai, '' + shoupai.clone());
    });
    test('副露を再現してインスタンスを複製すること', function(){
      const shoupai = Majiang.Shoupai.fromString('m1,p123-,s555=,z777+7,m9999');
      assert.equal('' + shoupai, '' + shoupai.clone());
    });
    test('ツモ牌を再現してインスタンスを複製すること', function(){
      const shoupai = Majiang.Shoupai.fromString('m11123456789991');
      assert.equal('' + shoupai, '' + shoupai.clone());
    });
    test('リーチを再現してインスタンスを複製すること', function(){
      const shoupai = Majiang.Shoupai.fromString('m123p456s789z1112*');
      assert.equal('' + shoupai, '' + shoupai.clone());
    });
    test('複製後のツモが複製前の手牌に影響しないこと', function(){
      const shoupai = Majiang.Shoupai.fromString('m123p456s789z4567');
      assert.notEqual('' + shoupai, '' + shoupai.clone().zimo('m1'));
    });
    test('複製後の打牌が複製前の手牌に影響しないこと', function(){
      const shoupai = Majiang.Shoupai.fromString('m123p456s789z34567');
      assert.notEqual('' + shoupai, '' + shoupai.clone().dapai('m1'));
    });
    test('複製後の副露が複製前の手牌に影響しないこと', function(){
      const shoupai = Majiang.Shoupai.fromString('m123p456s789z1167');
      assert.notEqual('' + shoupai, '' + shoupai.clone().fulou('z111='));
    });
    test('複製後のカンが複製前の手牌に影響しないこと', function(){
      const shoupai = Majiang.Shoupai.fromString('m123p456s789z11112');
      assert.notEqual('' + shoupai, '' + shoupai.clone().gang('z1'));
    });
    test('複製後のリーチが複製前の手牌に影響しないこと', function(){
      const shoupai = Majiang.Shoupai.fromString('m123p456s789z11223');
      assert.notEqual('' + shoupai, '' + shoupai.clone().dapai('z3*'));
    });
  });

  suite('.zumo(p)', function(){
    test('萬子をツモれること', function(){
      assert.equal('' + Shoupai('m123p456s789z4567').zimo('m1'),
                                'm123p456s789z4567m1');
    });
    test('筒子をツモれること', function(){
      assert.equal('' + Shoupai('m123p456s789z4567').zimo('p1'),
                                'm123p456s789z4567p1');
    });
    test('索子をツモれること', function(){
      assert.equal('' + Shoupai('m123p456s789z4567').zimo('s1'),
                                'm123p456s789z4567s1');
    });
    test('字牌をツモれること', function(){
      assert.equal('' + Shoupai('m123p456s789z4567').zimo('z1'),
                                'm123p456s789z4567z1');
    });
    test('赤牌をツモれること', function(){
      assert.equal('' + Shoupai('m123p456s789z4567').zimo('m0'),
                                'm123p456s789z4567m0');
    });
    test('不正な牌はツモれないこと', function(){
      assert.throws(()=>Shoupai('m123p456s789z4567').zimo());
      assert.throws(()=>Shoupai('m123p456s789z4567').zimo('z0'));
      assert.throws(()=>Shoupai('m123p456s789z4567').zimo('z8'));
      assert.throws(()=>Shoupai('m123p456s789z4567').zimo('mm'));
      assert.throws(()=>Shoupai('m123p456s789z4567').zimo('xx'));
    });
    test('ツモの直後にはツモれないこと', function(){
      assert.throws(()=>{Shoupai('m123p456s789z34567').zimo('m1')});
    });
    test('副露の直後にはツモれないこと', function(){
      assert.throws(()=>{Shoupai('m123p456z34567,s789-,').zimo('m1')});
    });
    test('5枚目の牌はツモれないこと', function(){
      assert.throws(()=>{Shoupai('m123p456s789z1111').zimo('z1')});
    });
  });

  suite('.dapai(p)', function(){
    test('萬子を打牌できること', function(){
      assert.equal('' + Shoupai('m123p456s789z34567').dapai('m1'),
                                'm23p456s789z34567');
    });
    test('筒子を打牌できること', function(){
      assert.equal('' + Shoupai('m123p456s789z34567').dapai('p4'),
                                'm123p56s789z34567');
    });
    test('索子を打牌できること', function(){
      assert.equal('' + Shoupai('m123p456s789z34567').dapai('s7'),
                                'm123p456s89z34567');
    });
    test('字牌を打牌できること', function(){
      assert.equal('' + Shoupai('m123p456s789z34567').dapai('z3'),
                                'm123p456s789z4567');
    });
    test('赤牌を打牌できること', function(){
      assert.equal('' + Shoupai('m123p406s789z34567').dapai('p0'),
                                'm123p46s789z34567');
    });
    test('リーチできること', function(){
      assert.equal('' + Shoupai('m123p456s789z34567').dapai('z7*'),
                                'm123p456s789z3456*');
    });
    test('リーチ後にもツモ切り以外の打牌ができること(チェックしない)', function(){
      assert.equal('' + Shoupai('m123p456s789z11223*').dapai('z1'),
                                'm123p456s789z1223*');
    });
    test('不正な牌は打牌できないこと', function(){
      assert.throws(()=>Shoupai('m123p456s789z34567').dapai());
      assert.throws(()=>Shoupai('m123p456s789z34567').dapai('z0'));
      assert.throws(()=>Shoupai('m123p456s789z34567').dapai('z8'));
      assert.throws(()=>Shoupai('m123p456s789z34567').dapai('mm'));
      assert.throws(()=>Shoupai('m123p456s789z34567').dapai('xx'));
    });
    test('打牌の直後には打牌できないこと', function(){
      assert.throws(()=>Shoupai('m123p456s789z4567').dapai('m1'));
    });
    test('手牌にない牌は打牌できないこと', function(){
      assert.throws(()=>Shoupai('m123p456s789z34567').dapai('z1'));
      assert.throws(()=>Shoupai('m123p456s789z34567').dapai('p0'));
      assert.throws(()=>Shoupai('m123p406s789z34567').dapai('p5'));
    });
  });

  suite('.fulou()', function(){
    test('萬子を副露できること', function(){
      assert.equal('' + Shoupai('m23p456s789z34567').fulou('m1-23'),
                                'p456s789z34567,m1-23,');
    });
    test('筒子を副露できること', function(){
      assert.equal('' + Shoupai('m123p46s789z34567').fulou('p45-6'),
                                'm123s789z34567,p45-6,');
    });
    test('索子を副露できること', function(){
      assert.equal('' + Shoupai('m123p456s99z34567').fulou('s999+'),
                                'm123p456z34567,s999+,');
    });
    test('字牌を副露できること', function(){
      assert.equal('' + Shoupai('m123p456s789z1167').fulou('z111='),
                                'm123p456s789z67,z111=,');
    });
    test('赤牌を副露できること', function(){
      assert.equal('' + Shoupai('m123p500s789z4567').fulou('p5005-'),
                                'm123s789z4567,p5005-');
    });
    test('リーチ後にも副露できること(チェックしない)', function(){
      assert.equal('' + Shoupai('m123p456s789z4567*').fulou('m1-23'),
                                'm1p456s789z4567*,m1-23,');
    });
    test('不正な面子で副露できないこと', function(){
      assert.throws(()=>Shoupai('m123p456s789z4567').fulou('z3-45'));
      assert.throws(()=>Shoupai('m123p456s789z4567').fulou('m231-'));
    });
    test('ツモの直後に副露できないこと', function(){
      assert.throws(()=>Shoupai('m123p456s789z11567').fulou('z111='));
    });
    test('副露の直後に副露できないこと', function(){
      assert.throws(()=>Shoupai('m123p456s789z22,z111=,').fulou('z222='));
    });
    test('手牌にない牌を使って副露できないこと', function(){
      assert.throws(()=>Shoupai('m123p456s789z2,z111=').fulou('z333='));
      assert.throws(()=>Shoupai('m123p40s789z22,z111=').fulou('p456-'));
      assert.throws(()=>Shoupai('m123p45s789z22,z111=').fulou('p406-'));
    });
  });

  suite('.gang(p)', function(){
    test('萬子で暗カンできること', function(){
      assert.equal('' + Shoupai('m1111p456s789z4567').gang('m1'),
                                'p456s789z4567,m1111');
    });
    test('萬子で加カンできること', function(){
      assert.equal('' + Shoupai('m1p456s789z4567,m111+').gang('m1'),
                                'p456s789z4567,m111+1');
    });
    test('筒子で暗カンできること', function(){
      assert.equal('' + Shoupai('m123p5555s789z4567').gang('p5'),
                                'm123s789z4567,p5555');
    });
    test('筒子で加カンできること', function(){
      assert.equal('' + Shoupai('m123p5s789z4567,p555=').gang('p5'),
                                'm123s789z4567,p555=5');
    });
    test('索子で暗カンできること', function(){
      assert.equal('' + Shoupai('m123p456s9999z4567').gang('s9'),
                                'm123p456z4567,s9999');
    });
    test('索子で加カンできること', function(){
      assert.equal('' + Shoupai('m123p456s9z4567,s999-').gang('s9'),
                                'm123p456z4567,s999-9');
    });
    test('字牌で暗カンできること', function(){
      assert.equal('' + Shoupai('m123p456s789z67777').gang('z7'),
                                'm123p456s789z6,z7777');
    });
    test('字牌で加カンできること', function(){
      assert.equal('' + Shoupai('m123p456s789z67,z777+').gang('z7'),
                                'm123p456s789z6,z777+7');
    });
    test('赤牌を含む暗カンができること', function(){
      assert.equal('' + Shoupai('m0055p456s789z4567').gang('m5'),
                                'p456s789z4567,m5500');
    });
    test('赤牌で暗カンできないこと', function(){
      assert.throws(()=>Shoupai('m0055p456s789z4567').gang('m0'));
    });
    test('赤牌を含む加カンができること', function(){
      assert.equal('' + Shoupai('m123p5s789z4567,p505=').gang('p5'),
                                'm123s789z4567,p505=5');
    });
    test('赤牌で加カンできること', function(){
      assert.equal('' + Shoupai('m123p0s789z4567,p555=').gang('p0'),
                                'm123s789z4567,p555=0');
    });
    test('リーチ後にも暗カンできること(チェックしない)', function(){
      assert.equal('' + Shoupai('m1111p456s789z4567*').gang('m1'),
                                'p456s789z4567*,m1111');
    });
    test('リーチ後にも加カンできること(チェックしない)', function(){
      assert.equal('' + Shoupai('m1p456s789z4567*,m111+').gang('m1'),
                                'p456s789z4567*,m111+1');
    });
    test('不正な牌でカンできないこと', function(){
      assert.throws(()=>Shoupai('m1111p456s789z4567').gang('mm'));
    });
    test('打牌の直後にカンできないこと', function(){
      assert.throws(()=>Shoupai('m1111p456s789z456').gang('m1'));
    });
    test('副露の直後にカンできないこと', function(){
      assert.throws(()=>Shoupai('m1111s789z4567,p456-,').gang('m1'));
    });
    test('カンの直後にカンできないこと', function(){
      assert.throws(()=>Shoupai('m1111p4444s789z567').gang('m1').gang('p4'));
    });
    test('手牌に4枚ない牌で暗カンできないこと', function(){
      assert.throws(()=>Shoupai('m1112p456s789z4567').gang('m1'));
    });
    test('手牌にない牌で加カンできないこと', function(){
      assert.throws(()=>Shoupai('m13p456s789z567,m222=').gang('m2'));
      assert.throws(()=>Shoupai('m10p456s789z567,m555=').gang('m5'));
      assert.throws(()=>Shoupai('m15p456s789z567,m555=').gang('m0'));
    });
    test('明刻がない牌で加カンできないこと', function(){
      assert.throws(()=>Shoupai('m1p456s789z567,m222=').gang('m1'));
    });
  });

  suite('.menqian()', function(){
    test('副露がない場合、メンゼンと判定すること', function(){
      assert.ok(Majiang.Shoupai.fromString('m123p0s789z4567').menqian());
    });
    test('副露がある場合、メンゼンと判定しないこと', function(){
      assert.ok(! Majiang.Shoupai.fromString('p0s789z4567,m123-').menqian());
    });
    test('暗カンを副露と判定しないこと', function(){
      assert.ok(Majiang.Shoupai.fromString('m123p0s789,z1111').menqian());
    });
  });

  suite('.lizhi()', function(){
    const qipai = ['m1','m2','m3','p4','p5','p6','s7','s8','s9',
                   'z1','z1','z2','z2'];
    test('配牌時はリーチ状態でないこと', function(){
      assert.ok(! new Majiang.Shoupai(qipai).lizhi());
    });
    test('リーチ宣言によりリーチ状態になること', function(){
      assert.ok(new Majiang.Shoupai(qipai).zimo('z7').dapai('z7_*').lizhi());
    });
  });

  suite('.get_dapai()', function(){
    test('ツモ直後または副露直後以外は打牌できないこと', function(){
      assert.throws(()=>Shoupai('m123p406s789z4567').get_dapai());
      assert.throws(()=>Shoupai('m123p406s789z2,z111+').get_dapai());
    });
    test('ツモ直後は任意の手牌を打牌できること(メンゼン手)', function(){
      assert.deepEqual(Shoupai('m123p406s789z11123').get_dapai(),
                       ['m1','m2','m3','p4','p0','p6','s7','s8','s9',
                        'z1','z2','z3']);
    });
    test('ツモ直後は任意の手牌を打牌できること(副露手)', function(){
      assert.deepEqual(Shoupai('m123p406s789z12,z111+').get_dapai(),
                       ['m1','m2','m3','p4','p0','p6','s7','s8','s9',
                        'z1','z2']);
    });
    test('リーチ後も任意の手牌を打牌できること(チェックしない)', function(){
      assert.deepEqual(Shoupai('m123p456s789z12345*').get_dapai(),
                       ['m1','m2','m3','p4','p5','p6','s7','s8','s9',
                        'z1','z2','z3','z4','z5']);
    });
    test('赤牌を単独の牌として区別すること', function(){
      assert.deepEqual(Shoupai('m123p405s789z11123').get_dapai(),
                       ['m1','m2','m3','p4','p0','p5','s7','s8','s9',
                        'z1','z2','z3']);
    });
    test('喰替えとなる打牌が許されないこと(両面鳴き)', function(){
      assert.deepEqual(Shoupai('m145p406s789z23,m1-23,').get_dapai(),
                       ['m5','p4','p0','p6','s7','s8','s9','z2','z3']);
      assert.deepEqual(Shoupai('m145p406s789z23,m234-,').get_dapai(),
                       ['m5','p4','p0','p6','s7','s8','s9','z2','z3']);
    });
    test('喰替えとなる打牌が許されないこと(嵌張鳴き)', function(){
      assert.deepEqual(Shoupai('m123p258s789z23,p45-6,').get_dapai(),
                       ['m1','m2','m3','p2','p8','s7','s8','s9','z2','z3']);
    });
    test('喰替えとなる打牌が許されないこと(辺張鳴き)', function(){
      assert.deepEqual(Shoupai('m123p456s467z23,s7-89,').get_dapai(),
                       ['m1','m2','m3','p4','p5','p6','s4','s6','z2','z3']);
    });
    test('喰替えとなる打牌が許されないこと(ポン)', function(){
      assert.deepEqual(Shoupai('m123p456s789z12,z111+,').get_dapai(),
                       ['m1','m2','m3','p4','p5','p6','s7','s8','s9','z2']);
    });
    test('喰替えとなる打牌が許されないこと(赤牌入りの鳴き)', function(){
      assert.deepEqual(Shoupai('m256p456s789z12,m340-,').get_dapai(),
                       ['m6','p4','p5','p6','s7','s8','s9','z1','z2']);
    });
    test('喰替えとなる打牌が許されないこと(赤牌打牌)', function(){
      assert.deepEqual(Shoupai('m206p456s789z12,m345-,').get_dapai(),
                       ['m6','p4','p5','p6','s7','s8','s9','z1','z2']);
    });
    test('喰替えのため打牌できない場合があること', function(){
      assert.deepEqual(Shoupai('m14,p456-,s789-,z111+,m234-,').get_dapai(),[]);
      assert.deepEqual(Shoupai('m14,p456-,s789-,z111+,m1-23,').get_dapai(),[]);
      assert.deepEqual(Shoupai('m22,p456-,s789-,z111+,m12-3,').get_dapai(),[]);
    });
  });

  suite('.get_chi_mianzi(p)', function(){
    test('ツモ直後と副露の直後にチーできないこと', function(){
      assert.throws(()=>Shoupai('m123p456s789z12345').get_chi_mianzi('m1-'));
      assert.throws(()=>Shoupai('m123p456s789z12,z333=,').get_chi_mianzi('m1-'));
    });
    test('チーできるメンツがない場合', function(){
      assert.deepEqual(Shoupai('m123p456s789z1234').get_chi_mianzi('m5-'), []);
    });
    test('チーできるメンツが1つの場合', function(){
      assert.deepEqual(Shoupai('m123p456s789z1234').get_chi_mianzi('m3-'),
                       ['m123-']);
    });
    test('チーできるメンツが2つの場合', function(){
      assert.deepEqual(Shoupai('m1234p456s789z123').get_chi_mianzi('m3-'),
                       ['m123-','m23-4']);
    });
    test('チーできるメンツが3つの場合', function(){
      assert.deepEqual(Shoupai('m12345p456s789z12').get_chi_mianzi('m3-'),
                       ['m123-','m23-4','m3-45']);
    });
    test('赤牌でチーできること', function(){
      assert.deepEqual(Shoupai('m123p456s789z1234').get_chi_mianzi('p0-'),
                       ['p40-6']);
    });
    test('赤牌優先でメンツを選択すること', function(){
      assert.deepEqual(Shoupai('m123p340567s789z1').get_chi_mianzi('p3-'),
                       ['p3-40']);
      assert.deepEqual(Shoupai('m123p340567s789z1').get_chi_mianzi('p4-'),
                       ['p34-0','p4-06']);
      assert.deepEqual(Shoupai('m123p340567s789z1').get_chi_mianzi('p6-'),
                       ['p406-','p06-7']);
      assert.deepEqual(Shoupai('m123p340567s789z1').get_chi_mianzi('p7-'),
                       ['p067-']);
    });
    test('ツモ切りの牌をチーできること', function(){
      assert.deepEqual(Shoupai('m123p456s789z1234').get_chi_mianzi('m3_-'),
                       ['m123-']);
    });
    test('リーチ宣言牌をチーできること', function(){
      assert.deepEqual(Shoupai('m123p456s789z1234').get_chi_mianzi('m3*-'),
                       ['m123-']);
    });
    test('ツモ切りリーチの宣言牌をチーできること', function(){
      assert.deepEqual(Shoupai('m123p456s789z1234').get_chi_mianzi('m3_*-'),
                       ['m123-']);
    });
    test('リーチ後にもチーできること(チェックしない)', function(){
      assert.deepEqual(Shoupai('m123p456s789z1234*').get_chi_mianzi('m3-'),
                       ['m123-']);
    });
    test('打牌選択できなくなる鳴き方を含めないこと', function(){
      assert.deepEqual(Shoupai('s6789,m123-,p456-,z111+').get_chi_mianzi('s6-'),
                       []);
      assert.deepEqual(Shoupai('s6789,m123-,p456-,z111+').get_chi_mianzi('s9-'),
                       []);
      assert.deepEqual(Shoupai('s7889,m123-,p456-,z111+').get_chi_mianzi('s8-'),
                       []);
      assert.deepEqual(Shoupai('s7899,m123-,p456-,z111+').get_chi_mianzi('s9-'),
                       []);
      assert.deepEqual(Shoupai('s7789,m123-,p456-,z111+').get_chi_mianzi('s7-'),
                       []);
      assert.deepEqual(Shoupai('s6678999,m123-,p456-').get_chi_mianzi('s6-'),
                       []);
    });
    test('不正な牌でチーできないこと', function(){
      assert.throws(()=>Shoupai('m123p456s789z1234').get_chi_mianzi('mm-'));
      assert.throws(()=>Shoupai('m123p456s789z1234').get_chi_mianzi('m1'));
    });
    test('字牌でチーできないこと', function(){
      assert.deepEqual(Shoupai('m123p456s789z1234').get_chi_mianzi('z1-'), []);
    });
    test('上家以外からチーできないこと', function(){
      assert.deepEqual(Shoupai('m123p456s789z1234').get_chi_mianzi('m1+'), []);
      assert.deepEqual(Shoupai('m123p456s789z1234').get_chi_mianzi('m1='), []);
    });
  });

  suite('.get_peng_mianzi(p)', function(){
    test('ツモ直後と副露の直後にポンできないこと', function(){
      assert.throws(()=>Shoupai('m112p456s789z12345').get_peng_mianzi('m1+'));
      assert.throws(()=>Shoupai('m112p456s789z12,z333=,')
                                                     .get_peng_mianzi('m1='));
    });
    test('ポンできるメンツがない場合', function(){
      assert.deepEqual(Shoupai('m123p456s789z1234').get_peng_mianzi('m1+'), []);
    });
    test('下家からポンできること', function(){
      assert.deepEqual(Shoupai('m112p456s789z1234').get_peng_mianzi('m1+'),
                       ['m111+']);
    });
    test('対面からポンできること', function(){
      assert.deepEqual(Shoupai('m123p445s789z1234').get_peng_mianzi('p4='),
                       ['p444=']);
    });
    test('上家からポンできること', function(){
      assert.deepEqual(Shoupai('m123p345s778z1234').get_peng_mianzi('s7-'),
                       ['s777-']);
    });
    test('赤牌でポンできること', function(){
      assert.deepEqual(Shoupai('m123p455s789z1234').get_peng_mianzi('p0+'),
                       ['p550+']);
      assert.deepEqual(Shoupai('m123p405s789z1234').get_peng_mianzi('p0+'),
                       ['p500+']);
      assert.deepEqual(Shoupai('m123p400s789z1234').get_peng_mianzi('p0+'),
                       ['p000+']);
    });
    test('赤牌優先でメンツを選択すること', function(){
      assert.deepEqual(Shoupai('m123p055s789z1234').get_peng_mianzi('p5='),
                       ['p505=']);
      assert.deepEqual(Shoupai('m123p005s789z1234').get_peng_mianzi('p5='),
                       ['p005=']);
      assert.deepEqual(Shoupai('m123p000s789z1234').get_peng_mianzi('p5='),
                       ['p005=']);
    });
    test('ツモ切りの牌をポンできること', function(){
      assert.deepEqual(Shoupai('m112p456s789z1234').get_peng_mianzi('m1_+'),
                       ['m111+']);
    });
    test('リーチ宣言牌をポンできること', function(){
      assert.deepEqual(Shoupai('m112p456s789z1234').get_peng_mianzi('m1*+'),
                       ['m111+']);
    });
    test('ツモ切りリーチの宣言牌をポンできること', function(){
      assert.deepEqual(Shoupai('m112p456s789z1234').get_peng_mianzi('m1_*+'),
                       ['m111+']);
    });
    test('リーチ後にもポンできること(チェックしない)', function(){
      assert.deepEqual(Shoupai('m112p456s789z1234*').get_peng_mianzi('m1+'),
                       ['m111+']);
    });
    test('不正な牌でポンできないこと', function(){
      assert.throws(()=>Shoupai('m123p456s789z1234').get_peng_mianzi('mm+'));
      assert.throws(()=>Shoupai('m112p456s789z1234').get_peng_mianzi('m1'));
    });
  });

  suite('.get_gang_mianzi(p)', function(){
    test('ツモ直後と副露の直後に大明槓できないこと', function(){
      assert.throws(()=>Shoupai('m111p456s789z12345').get_gang_mianzi('m1+'));
      assert.throws(()=>Shoupai('m111p456s789z12,z333=,')
                                                     .get_gang_mianzi('m1+'));
    });
    test('大明槓できるメンツがない場合', function(){
      assert.deepEqual(Shoupai('m123p456s789z1122').get_gang_mianzi('z1+'), []);
    });
    test('下家から大明槓できること', function(){
      assert.deepEqual(Shoupai('m111p456s789z1234').get_gang_mianzi('m1+'),
                       ['m1111+']);
    });
    test('対面から大明槓できること', function(){
      assert.deepEqual(Shoupai('m123p444s789z1234').get_gang_mianzi('p4='),
                       ['p4444=']);
    });
    test('上家から大明槓できること', function(){
      assert.deepEqual(Shoupai('m123p456s777z1234').get_gang_mianzi('s7-'),
                       ['s7777-']);
    });
    test('赤牌で大明槓できること', function(){
      assert.deepEqual(Shoupai('m123p555s789z1234').get_gang_mianzi('p0+'),
                       ['p5550+']);
    });
    test('赤牌入りの大明槓ができること', function(){
      assert.deepEqual(Shoupai('m123p055s789z1234').get_gang_mianzi('p5+'),
                       ['p5505+']);
      assert.deepEqual(Shoupai('m123p005s789z1234').get_gang_mianzi('p5+'),
                       ['p5005+']);
      assert.deepEqual(Shoupai('m123p000s789z1234').get_gang_mianzi('p5+'),
                       ['p0005+']);
    });
    test('ツモ切りの牌を大明槓できること', function(){
      assert.deepEqual(Shoupai('m111p456s789z1234').get_gang_mianzi('m1_+'),
                       ['m1111+']);
    });
    test('リーチ宣言牌を大明槓できること', function(){
      assert.deepEqual(Shoupai('m111p456s789z1234').get_gang_mianzi('m1*+'),
                       ['m1111+']);
    });
    test('ツモ切りリーチの宣言牌を大明槓できること', function(){
      assert.deepEqual(Shoupai('m111p456s789z1234').get_gang_mianzi('m1_*+'),
                       ['m1111+']);
    });
    test('リーチ後にも大明槓できること(チェックしない)', function(){
      assert.deepEqual(Shoupai('m111p456s789z1234*').get_gang_mianzi('m1+'),
                       ['m1111+']);
    });
    test('不正な牌で大明槓できないこと', function(){
      assert.throws(()=>Shoupai('m111p555s999z1234').get_gang_mianzi('mm+'));
      assert.throws(()=>Shoupai('m111p555s999z1234').get_gang_mianzi('m1'));
    });

    test('打牌と副露の直後には暗槓できないこと', function(){
      assert.throws(()=>Shoupai('m1111p555s999z123').get_gang_mianzi());
      assert.throws(()=>Shoupai('m1111p555s999,z333=').get_gang_mianzi());
      assert.throws(()=>Shoupai('m11112p555s999,z333=,').get_gang_mianzi());
    });
    test('暗槓できるメンツがない場合', function(){
      assert.deepEqual(Shoupai('m123p456s789z12345').get_gang_mianzi(), []);
    });
    test('萬子で暗槓できること', function(){
      assert.deepEqual(Shoupai('m1111p456s789z1234').get_gang_mianzi(),
                       ['m1111']);
    });
    test('筒子で暗槓できること', function(){
      assert.deepEqual(Shoupai('m123p4444s789z1234').get_gang_mianzi(),
                       ['p4444']);
    });
    test('索子で暗槓できること', function(){
      assert.deepEqual(Shoupai('m123p456s7777z1234').get_gang_mianzi(),
                       ['s7777']);
    });
    test('字牌で暗槓できること', function(){
      assert.deepEqual(Shoupai('m123p456s789z11112').get_gang_mianzi(),
                       ['z1111']);
    });
    test('赤牌入りで暗槓できること', function(){
      assert.deepEqual(Shoupai('m123p0555s789z1234').get_gang_mianzi(),
                       ['p5550']);
      assert.deepEqual(Shoupai('m123p0055s789z1234').get_gang_mianzi(),
                       ['p5500']);
      assert.deepEqual(Shoupai('m123p0005s789z1234').get_gang_mianzi(),
                       ['p5000']);
      assert.deepEqual(Shoupai('m123p0000s789z1234').get_gang_mianzi(),
                       ['p0000']);
    });
    test('リーチ後にも暗槓できること(チェックしない)', function(){
      assert.deepEqual(Shoupai('m1111p456s789z1234*').get_gang_mianzi(),
                       ['m1111']);
    });
    test('暗槓できるメンツが複数の場合', function(){
      assert.deepEqual(Shoupai('m1111p456s789z1111').get_gang_mianzi(),
                       ['m1111','z1111']);
    });

    test('打牌と副露の直後には加槓できないこと', function(){
      assert.throws(()=>Shoupai('m1p555s999z123,m111-').get_gang_mianzi());
      assert.throws(()=>Shoupai('m1p555s999,z333=,m111-').get_gang_mianzi());
      assert.throws(()=>Shoupai('m12p555s999,z333=,m111-,').get_gang_mianzi());
    });
    test('加槓できるメンツがない場合', function(){
      assert.deepEqual(Shoupai('m123p456s789z12,z777+').get_gang_mianzi(), []);
    });
    test('萬子で加槓できること', function(){
      assert.deepEqual(Shoupai('m1p456s789z1234,m111+').get_gang_mianzi(),
                       ['m111+1']);
    });
    test('筒子で加槓できること', function(){
      assert.deepEqual(Shoupai('m123p4s789z1234,p444=').get_gang_mianzi(),
                       ['p444=4']);
    });
    test('索子で加槓できること', function(){
      assert.deepEqual(Shoupai('m123p456s7z1234,s777-').get_gang_mianzi(),
                       ['s777-7']);
    });
    test('字牌で加槓できること', function(){
      assert.deepEqual(Shoupai('m123p456s789z12,z111+').get_gang_mianzi(),
                       ['z111+1']);
    });
    test('赤牌で加槓できること', function(){
      assert.deepEqual(Shoupai('m123p0s789z1234,p555=').get_gang_mianzi(),
                       ['p555=0']);
    });
    test('赤牌入りで加槓できること', function(){
      assert.deepEqual(Shoupai('m123p5s789z1234,p550-').get_gang_mianzi(),
                       ['p550-5']);
    });
    test('リーチ後にも加槓できること(チェックしない)', function(){
      assert.deepEqual(Shoupai('m1p456s789z1234*,m111+').get_gang_mianzi(),
                       ['m111+1']);
    });
    test('加槓できるメンツが複数の場合', function(){
      assert.deepEqual(Shoupai('m1p4s789z123,m111+,p444=').get_gang_mianzi(),
                       ['m111+1','p444=4']);
    });
    test('暗槓と加槓が同時にできる場合', function(){
      assert.deepEqual(Shoupai('m1p456s789z1111,m111+').get_gang_mianzi(),
                       ['m111+1','z1111']);
    });
  });
});
