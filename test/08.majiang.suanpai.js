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
    });
  });

  suite('diaopai(p)', function(){
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

  suite('paishu(p)', function(){
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

  suite('qipai(qipai, menfeng)', function(){
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

  suite('zimo(zimo)', function(){
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

  suite('dapai(dapai)', function(){
    let suanpai = init_suanpai();
    test('手番の場合', function(){
      suanpai.dapai({l:0,p:'m1'});
      assert.deepEqual(suanpai._paishu.m, [1,3,3,3,4,4,4,4,4,4]);
    });
    test('手番以外の場合', function(){
      suanpai.dapai({l:1,p:'m1'});
      assert.deepEqual(suanpai._paishu.m, [1,2,3,3,4,4,4,4,4,4]);
    });
  })

  suite('fulou(fulou)', function(){
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

  suite('gang(gang)', function(){
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

  suite('kaigang(kaigang)', function(){
    let suanpai = init_suanpai();
    suanpai.kaigang({baopai:'z4'});
    test('ドラが増えること', function(){
      assert.equal(suanpai._baopai[1], 'z4');
    });
    test('牌数が減算されること', function(){
      assert.deepEqual(suanpai._paishu.z, [0,1,2,4,3,4,4,4]);
    })
  });

  suite('paijia(p)', function(){
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
});
