const assert  = require('assert');

const Majiang = require('../src/js/majiang');

function init_suanpai(param = {}) {

    let hongpai = param.hongpai || {m:1,p:1,s:1};
    let suanpai = new Majiang.SuanPai(hongpai);

    let qipai = { zhuangfeng: 0, jushu: 0, changbang: 0, lizhibang: 0,
                  defen: [25000,25000,25000,25000], baopai: 'z1',
                  shoupai: ['m123p456s789z1122','','',''] };
    let menfeng = param.menfeng || 0;
    if (param.zhuangfeng) qipai.zhuangfeng       = param.zhuangfeng;
    if (param.baopai)     qipai.baopai           = param.baopai;
    if (param.shoupai)    qipai.shoupai[menfeng] = param.shoupai;

    suanpai.qipai(qipai, menfeng);

    return suanpai;
}

suite('Majiang.SuanPai', function(){

  test('クラスが存在すること', function(){assert.ok(Majiang.SuanPai)});

  suite('constructor(hongpai)', function(){
    let suanpai = new Majiang.SuanPai();
    test('インスタンスが生成できること', function(){assert.ok(suanpai)});
    test('初期値が正しく設定されること', function(){
      assert.deepEqual(suanpai._paishu.m, [0,4,4,4,4,4,4,4,4,4]);
      assert.deepEqual(suanpai._paishu.p, [0,4,4,4,4,4,4,4,4,4]);
      assert.deepEqual(suanpai._paishu.s, [0,4,4,4,4,4,4,4,4,4]);
      assert.deepEqual(suanpai._paishu.z, [0,4,4,4,4,4,4,4]);
      assert.equal(suanpai._zhuangfeng, 0);
      assert.equal(suanpai._menfeng, 0);
      assert.deepEqual(suanpai._baopai, []);
      assert.deepEqual(suanpai._dapai, [{},{},{},{}]);
      assert.deepEqual(suanpai._lizhi, []);
    });
    test('赤牌の数を指定してインスタンスが生成できること', function(){
      suanpai = new Majiang.SuanPai({m:1,p:2,s:3});
      assert.deepEqual(suanpai._paishu.m, [1,4,4,4,4,4,4,4,4,4]);
      assert.deepEqual(suanpai._paishu.p, [2,4,4,4,4,4,4,4,4,4]);
      assert.deepEqual(suanpai._paishu.s, [3,4,4,4,4,4,4,4,4,4]);
      assert.deepEqual(suanpai._paishu.z, [0,4,4,4,4,4,4,4]);
      assert.equal(suanpai._zhuangfeng, 0);
      assert.equal(suanpai._menfeng, 0);
      assert.deepEqual(suanpai._baopai, []);
      assert.deepEqual(suanpai._dapai, [{},{},{},{}]);
      assert.deepEqual(suanpai._lizhi, []);
    });
  });

  suite('.diaopai(p)', function(){
    let suanpai = new Majiang.SuanPai({m:1,p:1,s:1});
    test('牌数が減算されること', function(){
      suanpai.diaopai('m1');
      assert.deepEqual(suanpai._paishu.m, [1,3,4,4,4,4,4,4,4,4]);
    });
    test('赤牌が正しく減算されること', function(){
      suanpai.diaopai('p0');
      assert.deepEqual(suanpai._paishu.p, [0,4,4,4,4,3,4,4,4,4]);
    });
  });

  suite('.paishu(p)', function(){
    let suanpai = new Majiang.SuanPai({m:1,p:1,s:1});
    test('牌数が取得できること', function(){
      assert.equal(suanpai.paishu('m1'), 4);
    });
    test('赤牌数が取得できること', function(){
      assert.equal(suanpai.paishu('p0'), 1);
    });
    test('黒牌数が取得できること', function(){
      assert.equal(suanpai.paishu('s5'), 3);
    });
  });

  suite('.paishu_all()', function(){
    let suanpai = init_suanpai({shoupai:'m456p406s999z1122',baopai:'z1'});
    test('牌数を全て返すこと', function(){
      assert.deepEqual(suanpai.paishu_all(),
                       {m0:1,m1:4,m2:4,m3:4,m4:3,m5:2,m6:3,m7:4,m8:4,m9:4,
                        p0:0,p1:4,p2:4,p3:4,p4:3,p5:3,p6:3,p7:4,p8:4,p9:4,
                        s0:1,s1:4,s2:4,s3:4,s4:4,s5:3,s6:4,s7:4,s8:4,s9:1,
                             z1:1,z2:2,z3:4,z4:4,z5:4,z6:4,z7:4});
    });
  });

  suite('.qipai(qipai, menfeng)', function(){
    let suanpai = new Majiang.SuanPai({m:1,p:1,s:1});
    test('牌数が減算されること', function(){
      let qipai = { zhuangfeng: 1, jushu: 2, changbang: 0, lizhibang: 0,
                    defen: [25000,25000,25000,25000], baopai: 'z1',
                    shoupai: ['','','','m123p405s789z1122'] };
      suanpai.qipai(qipai, 3);
      assert.deepEqual(suanpai._paishu.m, [1,3,3,3,4,4,4,4,4,4]);
      assert.deepEqual(suanpai._paishu.p, [0,4,4,4,3,2,4,4,4,4]);
      assert.deepEqual(suanpai._paishu.s, [1,4,4,4,4,4,4,3,3,3]);
      assert.deepEqual(suanpai._paishu.z, [0,1,2,4,4,4,4,4]);
    });
    test('場風、自風、ドラが設定されること', function(){
      assert.equal(suanpai._zhuangfeng, 1);
      assert.equal(suanpai._menfeng, 3);
      assert.deepEqual(suanpai._baopai, ['z1'])
    });
    test('副露のある牌姿にも対応できること', function(){
      let suanpai = new Majiang.SuanPai({m:1,p:1,s:1});
      let qipai = { zhuangfeng: 1, jushu: 2, changbang: 0, lizhibang: 0,
                    defen: [25000,25000,25000,25000], baopai: 'm0',
                    shoupai: ['','','','p05s579,z1111,z222=,m12-3,'] };
      suanpai.qipai(qipai, 3);
      assert.deepEqual(suanpai._paishu.m, [0,3,3,3,4,3,4,4,4,4]);
      assert.deepEqual(suanpai._paishu.p, [0,4,4,4,4,2,4,4,4,4]);
      assert.deepEqual(suanpai._paishu.s, [1,4,4,4,4,3,4,3,4,3]);
      assert.deepEqual(suanpai._paishu.z, [0,0,1,4,4,4,4,4]);
    });
  });

  suite('.zimo(zimo)', function(){
    let suanpai = init_suanpai();
    test('手番の場合', function(){
      suanpai.zimo({l:0,p:'m4'});
      assert.deepEqual(suanpai._paishu.m, [1,3,3,3,3,4,4,4,4,4]);
    });
    test('手番以外の場合', function(){
      suanpai.zimo({l:1,p:'m4'});
      assert.deepEqual(suanpai._paishu.m, [1,3,3,3,3,4,4,4,4,4]);
    });
  });

  suite('.dapai(dapai)', function(){
    let suanpai = init_suanpai();
    test('手番の場合', function(){
      suanpai.dapai({l:0,p:'m1'});
      assert.deepEqual(suanpai._paishu.m, [1,3,3,3,4,4,4,4,4,4]);
    });
    test('手番以外の場合', function(){
      suanpai.dapai({l:1,p:'m1*'});
      assert.deepEqual(suanpai._paishu.m, [1,2,3,3,4,4,4,4,4,4]);
      assert.ok(suanpai._lizhi[1]);
    });
    test('打牌が「現物」となること', function(){
      assert.ok(suanpai._dapai[1]['m1']);
    });
    test('リーチ後は他者の打牌も「現物」となること', function(){
      suanpai.dapai({l:2,p:'s0_'});
      assert.ok(suanpai._dapai[1]['s5']);
    });
  })

  suite('.fulou(fulou)', function(){
    let suanpai = init_suanpai();
    test('手番の場合', function(){
      suanpai.fulou({l:0,m:'m123-'});
      assert.deepEqual(suanpai._paishu.m, [1,3,3,3,4,4,4,4,4,4]);
    });
    test('手番以外の場合', function(){
      suanpai.fulou({l:1,m:'m123-'});
      assert.deepEqual(suanpai._paishu.m, [1,2,2,3,4,4,4,4,4,4]);
    });
  });

  suite('.gang(gang)', function(){
    let suanpai = init_suanpai();
    test('手番の場合', function(){
      suanpai.gang({l:0,m:'s3333'});
      assert.deepEqual(suanpai._paishu.s, [1,4,4,4,4,4,4,3,3,3]);
    });
    test('手番以外の場合(暗槓)', function(){
      suanpai.gang({l:1,m:'s4444'});
      assert.deepEqual(suanpai._paishu.s, [1,4,4,4,0,4,4,3,3,3]);
    });
    test('手番以外の場合(加槓)', function(){
      suanpai.gang({l:1,m:'s555=0'});
      assert.deepEqual(suanpai._paishu.s, [0,4,4,4,0,3,4,3,3,3]);
    });
  });

  suite('.kaigang(kaigang)', function(){
    let suanpai = init_suanpai();
    suanpai.kaigang({baopai:'z4'});
    test('ドラが増えること', function(){
      assert.equal(suanpai._baopai[1], 'z4');
    });
    test('牌数が減算されること', function(){
      assert.deepEqual(suanpai._paishu.z, [0,1,2,4,3,4,4,4]);
    })
  });

  suite('.paijia(p)', function(){
    test('牌価値の初期値が正しいこと', function(){
      let suanpai = new Majiang.SuanPai({m:0,p:1,s:2});
      assert.deepEqual(suanpai.paijia_all(), {
        m: [40,12,16,20,20,20,20,20,16,12],
        p: [42,12,16,21,21,21,21,21,16,12],
        s: [44,12,16,22,22,22,22,22,16,12],
        z: [  ,16, 4, 4, 4, 8, 8, 8]
      });
    });
    test('配牌後の牌価値が正しいこと', function(){
      let suanpai = init_suanpai({shoupai:'m233p055s778z1123',baopai:'z1'});
      suanpai.kaigang({baopai:'z1'});
      assert.deepEqual(suanpai.paijia_all(), {
        m: [38, 8, 9,17,17,19,21,21,16,12],
        p: [34,12,16,17,14,17,14,17,16,12],
        s: [38,12,16,21,21,19,17,17, 9, 8],
        z: [  , 0,48, 3, 4, 8, 8, 8],
      });
    });
  });

  suite('.suan_weixian(p, l, c)', function(){
    let suanpai = new Majiang.SuanPai({m:1,p:1,s:1});
    test('現物: 0', function(){
      suanpai.dapai({l:1,p:'z1'});
      assert.equal(suanpai.suan_weixian('z1', 1), 0);
    })
    test('字牌 生牌: 8', function(){
      assert.equal(suanpai.suan_weixian('z2', 1), 8);
      suanpai.zimo({l:0,p:'z3'});
      assert.equal(suanpai.suan_weixian('z3', 1, 1), 8);
    });
    test('字牌 1枚見え: 3', function(){
      suanpai.dapai({l:2,p:'z2'});
      assert.equal(suanpai.suan_weixian('z2', 1), 3);
      suanpai.dapai({l:3,p:'z3'});
      assert.equal(suanpai.suan_weixian('z3', 1, 1), 3);
    });
    test('字牌 2枚見え: 1', function(){
      suanpai.dapai({l:2,p:'z2'});
      assert.equal(suanpai.suan_weixian('z2', 1), 1);
      suanpai.dapai({l:3,p:'z3'});
      assert.equal(suanpai.suan_weixian('z3', 1, 1), 1);
    });
    test('字牌 ラス牌: 0', function(){
      suanpai.dapai({l:2,p:'z2'});
      assert.equal(suanpai.suan_weixian('z2', 1), 0);
      suanpai.dapai({l:3,p:'z3'});
      assert.equal(suanpai.suan_weixian('z3', 1, 1), 0);
    });
    test('字牌 なし: 0', function(){
      suanpai.dapai({l:2,p:'z2'});
      assert.equal(suanpai.suan_weixian('z2', 1), 0);
      suanpai.dapai({l:0,p:'z3'});
      assert.equal(suanpai.suan_weixian('z3', 1), 0);
    });
    test('数牌 無スジ(一九牌): 13', function(){
      assert.equal(suanpai.suan_weixian('m1', 1), 13);
      assert.equal(suanpai.suan_weixian('m9', 1), 13);
    });
    test('数牌 無スジ(二八牌): 16', function(){
      assert.equal(suanpai.suan_weixian('m2', 1), 16);
      assert.equal(suanpai.suan_weixian('m8', 1), 16);
    });
    test('数牌 無スジ(三七牌): 19', function(){
      assert.equal(suanpai.suan_weixian('m3', 1), 19);
      assert.equal(suanpai.suan_weixian('m7', 1), 19);
    });
    test('数牌 無スジ(四五六牌): 26', function(){
      assert.equal(suanpai.suan_weixian('m4', 1), 26);
      assert.equal(suanpai.suan_weixian('m5', 1), 26);
      assert.equal(suanpai.suan_weixian('m6', 1), 26);
    });
    test('数牌 スジ(一九牌): 3', function(){
      suanpai.dapai({l:1,p:'m4'});
      assert.equal(suanpai.suan_weixian('m1', 1), 3);
      suanpai.dapai({l:1,p:'m6'});
      assert.equal(suanpai.suan_weixian('m9', 1), 3);
    });
    test('数牌 スジ(二八牌): 6', function(){
      suanpai.dapai({l:1,p:'m5'});
      assert.equal(suanpai.suan_weixian('m2', 1), 6);
      assert.equal(suanpai.suan_weixian('m8', 1), 6);
    });
    test('数牌 スジ(三七牌): 9', function(){
      assert.equal(suanpai.suan_weixian('m3', 1), 9);
      assert.equal(suanpai.suan_weixian('m7', 1), 9);
    });
    test('数牌 片スジ(四五六牌): 16', function(){
      suanpai.dapai({l:1,p:'p1'});
      assert.equal(suanpai.suan_weixian('p4', 1), 16);
      suanpai.dapai({l:1,p:'p2'});
      assert.equal(suanpai.suan_weixian('p5', 1), 16);
      suanpai.dapai({l:1,p:'p3'});
      assert.equal(suanpai.suan_weixian('p6', 1), 16);
    });
    test('数牌 両スジ(四五六牌): 6', function(){
      suanpai.dapai({l:1,p:'p7'});
      assert.equal(suanpai.suan_weixian('p4', 1), 6);
      suanpai.dapai({l:1,p:'p8'});
      assert.equal(suanpai.suan_weixian('p0', 1), 6);
      suanpai.dapai({l:1,p:'p9'});
      assert.equal(suanpai.suan_weixian('p6', 1), 6);
    });
    test('数牌 五のカベ、三七牌: 9', function(){
      suanpai.gang({l:2,m:'s5550'});
      assert.equal(suanpai.suan_weixian('s3', 1), 9);
      assert.equal(suanpai.suan_weixian('s7', 1), 9);
    });
    test('数牌 五のカベ、四六牌: 13', function(){
      assert.equal(suanpai.suan_weixian('s4', 1), 13);
      assert.equal(suanpai.suan_weixian('s6', 1), 13);
    });
    test('数牌 二のカベ、生牌: 3', function(){
      suanpai.gang({l:2,m:'s2222'});
      assert.equal(suanpai.suan_weixian('s1', 1), 3);
    });
    test('数牌 二のカベ、1枚見え: 3', function(){
      suanpai.dapai({l:2,p:'s1'});
      assert.equal(suanpai.suan_weixian('s1', 1), 3);
    });
    test('数牌 二のカベ、2枚見え: 1', function(){
      suanpai.dapai({l:2,p:'s1'});
      assert.equal(suanpai.suan_weixian('s1', 1), 1);
    });
    test('数牌 二のカベ、ラス牌: 0', function(){
      suanpai.dapai({l:2,p:'s1'});
      assert.equal(suanpai.suan_weixian('s1', 1), 0);
    });
    test('数牌 二のカベ、なし: 0', function(){
      suanpai.dapai({l:2,p:'s1'});
      assert.equal(suanpai.suan_weixian('s1', 1), 0);
    });
  });
  suite('.suan_weixian_all(bingpai)', ()=>{
    const qipai = {
      zhuangfeng: 0, jushu: 0, changbang: 0, lizhibang: 0,
      defen: [ 25000, 25000, 25000, 25000 ], baopai: 'p7',
      shoupai: ['','','','m4579p478s6z14457']
    };
    let suanpai = new Majiang.SuanPai({m:1,p:1,s:1})
    suanpai.qipai(qipai, 3);
    let shoupai = Majiang.Shoupai.fromString(qipai.shoupai[3]);
    test('リーチなし', ()=>{
      assert.ifError(suanpai.suan_weixian_all(shoupai._bingpai));
    });
    test('リーチあり', ()=>{
      suanpai.dapai({ l: 1, p: 'm3*' });
      const weixian = suanpai.suan_weixian_all(shoupai._bingpai);
      assert.equal(weixian('m0'), 26 / 544 * 100);
    });
    test('2人リーチ', ()=>{
      suanpai.dapai({ l: 0, p: 'p3*' });
      const weixian = suanpai.suan_weixian_all(shoupai._bingpai);
      assert.equal(weixian('m0'), Math.max(26 / 515 *100, 26 / 544 *100 *1.45));
    });
    test('全ての牌が安全', ()=>{
      let i = 0;
      for (let s of ['m','p','s','z']) {
        for (let n = 1; n <= (s == 'z' ? 7 : 9); n++) {
          suanpai.dapai({ l: i++ % 4, p: s+n });
        }
      }
      const weixian = suanpai.suan_weixian_all(shoupai._bingpai);
      assert.equal(weixian('m0'), 0);
    });
  });
});
