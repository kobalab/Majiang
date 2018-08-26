const assert  = require('assert');

const Majiang = require('../src/js/majiang');

function init_player(param = {}) {

    let player = new Majiang.Player(1);
    player._callback = (r = {})=>{ player._reply = r };

    let kaiju = { player: ['私','下家','対面','上家'],
                  qijia: 2, hongpai: { m: 0, p: 1, s: 2 } }

    let qipai = { zhuangfeng: 1, jushu: 3, changbang: 1, lizhibang: 2,
                  defen: [10000, 20000, 30000, 38000], baopai: 'm3',
                  shoupai: ['m123p456s789z1123','','',''] }

    if (param.qijia)      kaiju.qijia      = param.qijia;
    if (param.hongpai)    kaiju.hongpai    = param.hongpai;
    if (param.zhuangfeng) qipai.zhuangfeng = param.zhuangfeng;
    if (param.jushu)      qipai.jushu      = param.jushu;
    if (param.changbang)  qipai.changbang  = param.changbang;
    if (param.lizhibang)  qipai.lizhibang  = param.lizhibang;
    if (param.defen)      qipai.defen      = param.defen;
    if (param.baopai)     qipai.baopai     = param.baopai;

    let menfeng = (8 + player._id - kaiju.qijia - qipai.jushu) % 4
    if (param.shoupai) qipai.shoupai[menfeng] = param.shoupai;

    player.kaiju(kaiju);
    player.qipai(qipai);
    return player;
}

suite('Majiang.Player', function(){

  test('クラスが存在すること', function(){assert.ok(Majiang.Player)});

  suite('constructor(id)', function(){
    test('インスタンスが生成できること', function(){
      assert.ok(new Majiang.Player());
    });
    test('idが設定されること', function(){
      assert.equal(new Majiang.Player(0)._id, 0);
      assert.equal(new Majiang.Player(1)._id, 1);
      assert.equal(new Majiang.Player(2)._id, 2);
      assert.equal(new Majiang.Player(3)._id, 3);
    });
  });

  suite('.kaiju(kaiju)', function(){
    test('初期値が設定されること', function(){
      let player = new Majiang.Player(1);
      let kaiju  = { player: ['私','下家','対面','上家'],
                     qijia: 2, hongpai: { m: 0, p: 1, s: 2 } };
      player.kaiju(kaiju);
      assert.deepEqual(player._model,
                       { player: ['私','下家','対面','上家'], qijia: 2});
      assert.deepEqual(player._hongpai, kaiju.hongpai);
    });
  });

  suite('.qipai(qipai)', function(){
    test('初期値が設定されること', function(){
      let player = new Majiang.Player(1);
      let kaiju  = { player: ['私','下家','対面','上家'],
                     qijia: 2, hongpai: { m: 0, p: 1, s: 2 } };
      player.kaiju(kaiju);
      let qipai = { zhuangfeng: 1, jushu: 3, changbang: 1, lizhibang: 2,
                    defen: [10000, 20000, 30000, 38000], baopai: 'm3',
                    shoupai: ['m123p456s789z1123','','',''] };
      player.qipai(qipai);
      assert.equal(player._model.zhuangfeng, 1);
      assert.equal(player._model.menfeng, 0);
      assert.equal(player._model.changbang, 1);
      assert.equal(player._model.lizhibang, 2);
      assert.deepEqual(player._model.defen, [10000, 20000, 30000, 38000]);
      assert.equal(player._shoupai.toString(), 'm123p456s789z1123');
      assert.deepEqual(player._he, {});
      assert.equal(player._paishu, 70);
      assert.deepEqual(player._baopai, ['m3']);
      assert.ok(player._neng_rong);
      assert.ok(player._diyizimo);
    });
  });

  suite('.zimo(zimo, option)', function(){

    let player = init_player();
    player.zimo({l:0,p:'z2'})

    test('牌数が減ること', function(){
      assert.equal(player._paishu, 69);
    });
    test('手牌に加えられること', function(){
      assert.equal(player._shoupai._zimo, 'z2');
    });
    test('第一ツモでなくなること', function(){
      assert.ok(! player._diyizimo);
    });
    test('手番以外の場合、牌数を減らす処理のみ行うこと', function(){
      player = init_player();
      player.zimo({l:1,p:''});
      assert.equal(player._paishu, 69);
      assert.equal(player._shoupai._zimo, null);
      assert.ok(player._diyizimo);
    })
  });

  suite('.dapai(dapai)', function(){

    let player = init_player({shoupai:'m123p456s0789z112'});
    player._neng_rong = false;
    player.zimo({l:0,p:'z2'})
    player.dapai({l:0,p:'s0*'});

    test('手牌から打牌が切り出されること', function(){
      assert.equal(player._shoupai._zimo, null);
    });
    test('河に打牌されること', function(){
      assert.ok(player._he['s5'])
    });
    test('リーチの場合、供託リーチ棒が増えること', function(){
      assert.equal(player._model.lizhibang, 3);
    });
    test('打牌によってフリテンが解除されること', function(){
      assert.ok(player._neng_rong);
    });
    test('リーチ後はフリテンが解除されないこと', function(){
      player._neng_rong = false;
      player.zimo({l:0,p:'z3'});
      player.dapai({l:0,p:'z3_'});
      assert.ok(! player._neng_rong);
    });
    test('自らの河に和了牌がある場合、フリテンになること', function(){
      player._neng_rong = true;
      player.zimo({l:0,p:'z1'});
      player.dapai({l:0,p:'z1_'});
      assert.ok(! player._neng_rong);
    });
    test('和了牌を見逃した場合、フリテンになること', function(){
      player._neng_rong = true;
      player._he = {};
      player.dapai({l:1,p:'z2'});
      assert.ok(! player._neng_rong);
    });
  });

  suite('.fulou(fulou)', function(){

    let player = init_player({shoupai:'m23p456s789z11234'});
    player.fulou({l:0,m:'m1-23'});

    test('第一ツモでなくなること', function(){
      assert.ok(! player._diyizimo);
    });
    test('手牌が副露されること', function(){
      assert.equal(player._shoupai._fulou[0], 'm1-23');
    });
    test('大明槓の場合、打牌を選択しないこと', function(){
      player = init_player({shoupai:'m123p055s789z1122'});
      player.fulou({l:0,m:'p5505+'});
      assert.deepEqual(player._reply, {});
    });
    test('手番以外の場合、何も処理しないこと', function(){
      player = init_player({shoupai:'m23p456s789z11234'});
      player.fulou({l:1,m:'m1-23'});
      assert.ok(! player._diyizimo);
      assert.equal(player._shoupai.toString(), 'm23p456s789z11234');
    });
  });

  suite('.gang(gang)', function(){

    let player = init_player({shoupai:'m1111p456s789z1123'});
    player.gang({l:0,m:'m1111'})

    test('第一ツモでなくなること', function(){
      assert.ok(! player._diyizimo);
    });
    test('暗槓が副露されること', function(){
      assert.equal(player._shoupai._fulou[0], 'm1111');
    });
    test('加槓が副露されること', function(){
      player = init_player({shoupai:'m123p456s0z1123,s505='});
      player.gang({l:0,m:'s505=0'});
      assert.ok(! player._diyizimo);
      assert.equal(player._shoupai._fulou[0], 's505=0');
    });
    test('和了牌の加槓を見逃した場合、フリテンになること', function(){
      player = init_player({shoupai:'m23p456s789z11122'});
      player.gang({l:2,m:'m111=1'});
      assert.ok(! player._diyizimo);
      assert.ok(! player._neng_rong);
    });
    test('暗槓の場合、フリテンにはならないこと', function(){
      player = init_player({shoupai:'m23p456s789z11122'});
      player.gang({l:2,m:'m1111'});
      assert.ok(! player._diyizimo);
      assert.ok(player._neng_rong);
    });
  });

  suite('.kaigang(kaigang)', function(){

    let player = init_player({baopai:'m1'});
    player.kaigang({baopai:'z7'});

    test('ドラが追加されること', function(){
      assert.deepEqual(player._baopai, ['m1','z7']);
    });
  });

  suite('.hule(hule)', function(){
    let player = init_player();
    player.hule();
    test('応答を返すこと', function(){
      assert.deepEqual(player._reply, {});
    });
  });

  suite('.pingju(pingju)', function(){
    let player = init_player();
    player.pingju();
    test('応答を返すこと', function(){
      assert.deepEqual(player._reply, {});
    });
  });

  suite('.jieju(jieju)', function(){
    let player = init_player();
    player.jieju();
    test('応答を返すこと', function(){
      assert.deepEqual(player._reply, {});
    });
  });

  suite('.action(msg, callback)', function(){
    let player = new Majiang.Player(0);
    const callback = ()=>{ player._reply = 1 };
    test('kaiju', function(){
      player.action({ kaiju: { player: ['私','下家','対面','上家'],
                               qijia: 0, hongpai: {m:0,p:0,s:0} } });
      assert.ok(player._model);
    });
    test('qipai', function(){
      let qipai = { zhuangfeng: 0, jushu: 0, changbang: 0, lizhibang: 0,
                    defen: [25000,25000,25000,25000], baopai: 'm3',
                    shoupai: ['m123p456s778z1123','','',''] };
      player.action({qipai:qipai});
      assert.equal(player._shoupai.toString(), 'm123p456s778z1123');
    });
    test('zimo', function(){
      player.action({zimo:{l:0,p:'z2'}}, callback);
      assert.equal(player._shoupai.toString(), 'm123p456s778z1123z2');
    });
    test('dapai', function(){
      player.action({dapai:{l:0,p:'z3'}}, callback);
      assert.equal(player._shoupai.toString(), 'm123p456s778z1122');
    });
    test('fulou', function(){
      player.action({fulou:{l:0,m:'z111='}}, callback);
      assert.equal(player._shoupai.toString(), 'm123p456s778z22,z111=,');
    });
    test('gang', function(){
      player._shoupai.dapai('s7').zimo('z1');
      player.action({gang:{l:0,m:'z111=1'}}, callback);
      assert.equal(player._shoupai.toString(), 'm123p456s78z22,z111=1');
    });
    test('gangzimo', function(){
      player.action({gangzimo:{l:0,p:'s9'}}, callback);
      assert.equal(player._shoupai.toString(), 'm123p456s78z22s9,z111=1');
    });
    test('kaigang', function(){
      player.action({kaigang:{baopai:'m4'}});
      assert.equal(player._baopai[1], 'm4');
    });
    test('hule', function(){
      player._reply = 0;
      player.action({hule:{}}, callback);
      assert.ok(player._reply);
    });
    test('pingju', function(){
      player._reply = 0;
      player.action({pingju:{}}, callback);
      assert.ok(player._reply);
    });
    test('jieju', function(){
      player._reply = 0;
      player.action({jieju:{}}, callback);
      assert.ok(player._reply);
    });
    test('-', function(){
      player._reply = 0;
      player.action({test:{}}, callback);
      assert.ok(! player._reply);
    });
  });

  suite('.action_zimo(zimo, option)', function(){
    test('ツモ和了を選択', function(){
      let player = init_player({shoupai:'m123p456s789z11222'});
      player.action_zimo({l:0,p:'z2'});
      assert.deepEqual(player._reply, {hule:'-'});
    });
    test('流局を選択', function(){
      let player = init_player({shoupai:'m123456z1234567p1'});
      player.action_zimo({l:0,p:'p1'});
      assert.deepEqual(player._reply, {pingju:'-'});
    });
    test('暗槓を選択', function(){
      let player = init_player({shoupai:'m123p456s789z1112z1'});
      player.action_zimo({l:0,p:'z1'});
      assert.deepEqual(player._reply, {gang:'z1111'});
    });
    test('打牌を選択', function(){
      let player = init_player({shoupai:'m123p456s778z11222'});
      player.action_zimo({l:0,p:'z2'});
      assert.deepEqual(player._reply, {dapai:'s7*'});
    });
  });

  suite('.action_dapai(dapai)', function(){
    test('ロン和了を選択', function(){
      let player = init_player({shoupai:'m123p456s789z1122'});
      player.action_dapai({l:2,p:'z2'});
      assert.deepEqual(player._reply, {hule:'-'});
    });
    test('副露を選択', function(){
      let player = init_player({shoupai:'m123p456s789z1123'});
      player.action_dapai({l:2,p:'z1'});
      assert.deepEqual(player._reply, {fulou:'z111='});
    });
    test('見逃しを選択', function(){
      let player = init_player({shoupai:'m123p456s789z1122'});
      player.action_dapai({l:2,p:'z3'});
      assert.deepEqual(player._reply, {});
    });
  });

  suite('.action_fulou(fulou)', function(){
    test('打牌する', function(){
      let player = init_player({shoupai:'m123p456s778z22,z111=,'});
      player.action_fulou({l:0,m:'z111='});
      assert.deepEqual(player._reply, {dapai:'s7'});
    });
  });

  suite('.action_gang(gang)', function(){
    test('槍槓を選択', function(){
      let player = init_player({shoupai:'m23p456s789z11122'});
      player.action_gang({l:1,m:'m111=1'});
      assert.deepEqual(player._reply, {hule:'-'});
    });
    test('槍槓しない', function(){
      let player = init_player({shoupai:'m24p456s789z11122'});
      player.action_gang({l:1,m:'m111=1'});
      assert.deepEqual(player._reply, {});
    });
  });

  suite('.get_dapai()', function(){
    test('可能な打牌を返すこと', function(){
      let player = init_player({shoupai:'m1233m1,z111+,z222=,z333-'});
      assert.deepEqual(player.get_dapai(), ['m1','m2','m3','m1_']);
    });
  });

  suite('.get_chi_mianzi(dapai)', function(){
    test('チー可能な面子を返すこと', function(){
      let player = init_player({shoupai:'m1234p456s789z111'});
      assert.deepEqual(player.get_chi_mianzi({l:3,p:'m2_'}), ['m12-3','m2-34']);
    });
    test('下家からはチーできないこと', function(){
      let player = init_player({shoupai:'m1234p456s789z111'});
      assert.deepEqual(player.get_chi_mianzi({l:1,p:'m2_'}), []);
    });
    test('ハイテイ牌はチーできないこと', function(){
      let player = init_player({shoupai:'m1234p456s789z111'});
      player._paishu = 0;
      assert.deepEqual(player.get_chi_mianzi({l:3,p:'m2_'}), []);
    });
  });

  suite('.get_peng_mianzi(dapai)', function(){
    test('ポン可能な面子を返すこと', function(){
      let player = init_player({shoupai:'m1123p456s789z111'});
      assert.deepEqual(player.get_peng_mianzi({l:2,p:'m1_'}), ['m111=']);
    });
    test('ハイテイ牌はポンできないこと', function(){
      let player = init_player({shoupai:'m1123p456s789z111'});
      player._paishu = 0;
      assert.deepEqual(player.get_peng_mianzi({l:2,p:'m1_'}), []);
    });
  });

  suite('.get_gang_mianzi(dapai)', function(){
    test('大明槓可能な面子を返すこと', function(){
      let player = init_player({shoupai:'m123p055s789z1122'});
      assert.deepEqual(player.get_gang_mianzi({l:1,p:'p5_'}), ['p5505+']);
    });
    test('ハイテイ牌は大明槓できないこと', function(){
      let player = init_player({shoupai:'m123p055s789z1122'});
      player._paishu = 0;
      assert.deepEqual(player.get_gang_mianzi({l:1,p:'p5_'}), []);
    });
    test('暗槓・加槓可能な面子を返すこと', function(){
      let player = init_player({shoupai:'m123p0555s789z1,z111='});
      assert.deepEqual(player.get_gang_mianzi(), ['p5550','z111=1']);
    });
    test('ハイテイ牌は暗槓・加槓できないこと', function(){
      let player = init_player({shoupai:'m123p0555s789z1,z111='});
      player._paishu = 0;
      assert.deepEqual(player.get_gang_mianzi(), []);
    });
  });

  suite('.allow_lizhi(p)', function(){
    test('指定した牌でリーチ可能な場合、真を返すこと', function(){
      let player = init_player({shoupai:'m123p456s788z1122z1'});
      assert.ok(player.allow_lizhi('s8'));
    });
    test('牌を指定しない場合、リーチ可能な牌の一覧を返すこと', function(){
      let player = init_player({shoupai:'m123p456s788z1122z1'});
      assert.ok(player.allow_lizhi(), ['s7','s8']);
    });
    test('ツモ番がない場合、リーチできないこと', function(){
      let player = init_player({shoupai:'m123p456s788z1122z1'});
      player._paishu = 3;
      assert.ok(! player.allow_lizhi());
    });
    test('持ち点が1000点に満たない場合、リーチできないこと', function(){
      let player = init_player({shoupai:'m123p456s788z1122z1',
                                defen:[0,38000,35000,25000]});
      assert.ok(! player.allow_lizhi());
    });
  });

  suite('.allow_hule(data)', function(){
    test('ロン和了', function(){
      let player = init_player({shoupai:'m123p456s789z1,z222='});
      assert.ok(player.allow_hule({l:3,p:'z1_'}));
    });
    test('リーチのみロン和了', function(){
      let player = init_player({shoupai:'m123p456s789z3344*'});
      assert.ok(player.allow_hule({l:3,p:'z3_'}));
    });
    test('槍槓のみロン和了', function(){
      let player = init_player({shoupai:'m23p456s789z33344'});
      assert.ok(player.allow_hule({l:2,m:'m111=1'}, 'qianggang'));
    });
    test('ハイテイのみロン和了', function(){
      let player = init_player({shoupai:'m123p456s789z3344'});
      player._paishu = 0;
      assert.ok(player.allow_hule({l:3,p:'z3'}));
    });
    test('フリテンはロン和了できない', function(){
      let player = init_player({shoupai:'m123p456s789z1,z222='});
      player._neng_rong = false;
      assert.ok(! player.allow_hule({l:3,p:'z1'}));
    });
    test('ツモのみ和了', function(){
      let player = init_player({shoupai:'m123p456s789z1333z1'});
      assert.ok(player.allow_hule());
    });
    test('嶺上開花のみツモ和了', function(){
      let player = init_player({shoupai:'m123p456s789z11,z333=3'});
      assert.ok(player.allow_hule(null, 'lingshang'));
    });
    test('ハイテイのみツモ和了', function(){
      let player = init_player({shoupai:'m123p456s789z11,z333='});
      player._paishu = 0;
      assert.ok(player.allow_hule());
    });
  });

  suite('.allow_pingju()', function(){
    test('九種九牌', function(){
      let player = init_player({shoupai:'m123456z1234567p1'});
      assert.ok(player.allow_pingju());
    });
    test('第一ツモ以降は九種九牌にならない', function(){
      let player = init_player({shoupai:'m123456z1234567p1'});
      player._diyizimo = false;
      assert.ok(! player.allow_pingju());
    });
  });

  suite('.select_fulou(dapai)', function(){
    test('役ありでシャンテン数が進む場合、副露する', function(){
      let player = init_player({shoupai:'m123p456s78z11233'});
      assert.equal(player.select_fulou({l:2,p:'z1'}), 'z111=');
    });
    test('役のない副露はしない', function(){
      let player = init_player({shoupai:'m123p456s78z11223'});
      assert.ok(! player.select_fulou({l:2,p:'z3'}));
    });
    test('役ありでシャンテン数が変わらない場合、大明槓する', function(){
      let player = init_player({shoupai:'m123p456s78z11133'});
      assert.equal(player.select_fulou({l:2,p:'z1'}), 'z1111=');
    });
    test('役のない大明槓はしない', function(){
      let player = init_player({shoupai:'m123p456s78z11333'});
      assert.ok(! player.select_fulou({l:2,p:'z3'}));
    });
    test('リーチ者がいる場合、テンパイとならない副露はしない', function(){
      let player = init_player({shoupai:'m23456p468s34,s06-7'});
      player.dapai({l:2,p:'m1*'})
      assert.ok(! player.select_fulou({l:3,p:'s5'}));
    });
    test('リーチ者がいても、ポンテン・チーテンはとる', function(){
      let player = init_player({shoupai:'m22345p468s34,s06-7'});
      player.dapai({l:2,p:'m1*'})
      assert.equal(player.select_fulou({l:3,p:'s5'}), 's345-');
    });
  });

  suite('.select_gang()', function(){
    test('シャンテン数が変わらない場合、暗槓する', function(){
      let player = init_player({shoupai:'m123p456s789z1112z1'});
      assert.equal(player.select_gang(), 'z1111');
    });
    test('シャンテン数が増える場合、暗槓しない', function(){
      let player = init_player({shoupai:'m111123p456s789z12'});
      assert.ok(! player.select_gang());
    });
    test('リーチ者がいる場合、テンパイする前は槓しない', function(){
      let player = init_player({shoupai:'m123p456s579z2,z111='});
      player.dapai({l:3,p:'m1*'});
      player.zimo({l:0,p:'z1'})
      assert.ok(! player.select_gang());
    });
    test('リーチ者がいても、テンパイ後は槓する', function(){
      let player = init_player({shoupai:'m123p456s789z2,z111='});
      player.dapai({l:3,p:'m1*'});
      player.zimo({l:0,p:'z1'})
      assert.equal(player.select_gang(), 'z111=1');
    });
  });

  suite('.select_dapai()', function(){
    test('待ち牌の枚数がもっとも多くなる一番右の牌を選択する', function(){
      let player = init_player({shoupai:'m123p456s579z22,z111=',baopai:'s6'});
      assert.equal(player.select_dapai(), 's5');
    });
    test('待ち牌の枚数が同じ場合は牌価値の低い牌を選択する', function(){
      let player = init_player({shoupai:'m188p3346789s113m0',baopai:'s6'});
      assert.equal(player.select_dapai(), 'm1');
    });
    test('副露を考慮した待ち牌の枚数で打牌を選択する', function(){
      let player = init_player({shoupai:'m1266p30678s0568p9',baopai:'z1'});
      assert.equal(player.select_dapai(), 'p9_');
    });
    test('リーチ者がいて自身が2シャンテン以上の場合はオリる', function(){
      let player = init_player({shoupai:'m23p456s578z11223'});
      player.dapai({l:3,p:'p5*'});
      player.zimo({l:0,p:'z4'});
      assert.equal(player.select_dapai(), 'p5');
    });
    test('リーチ者がいて自身が1シャンテンの場合は無スジ以外は押す', function(){
      let player = init_player({shoupai:'m123p456s578z1122'});
      player.dapai({l:3,p:'p5*'});
      player.zimo({l:0,p:'z4'});
      assert.equal(player.select_dapai(), 'z4_');
    });
    test('リーチ者がいて自身が1シャンテンの場合でも無スジは押さない', function(){
      let player = init_player({shoupai:'m123p456s578z1122'});
      player.dapai({l:3,p:'p5*'});
      player.zimo({l:0,p:'m1'});
      assert.equal(player.select_dapai(), 'p5');
    });
    test('リーチ者がいても自身もテンパイした場合はリーチする', function(){
      let player = init_player({shoupai:'m123p456s578z1122'});
      player.dapai({l:3,p:'p5*'});
      player.zimo({l:0,p:'s9'});
      assert.equal(player.select_dapai(), 's5*');
    });
  });

  suite('.select_lizhi(p)', function(){
    test('リーチ可能ならリーチする', function(){
      let player = init_player({shoupai:'m123p456s778z11222'});
      assert.ok(player.select_lizhi('s8'));
    });
  });

  suite('.select_hule(data, option)', function(){
    test('和了可能なら和了する', function(){
      let player = init_player({shoupai:'m123p456s789z1122'});
      assert.ok(player.select_hule({l:2,p:'z1'}));
    });
  });

  suite('.select_pingju()', function(){
    test('4シャンテン以上なら九種九牌で流す', function(){
      let player = init_player({shoupai:'m123456z1234567p1'});
      assert.ok(player.select_pingju());
    });
    test('3シャンテン以下は国士無双を狙う', function(){
      let player = init_player({shoupai:'m12345s1z1234567p1'});
      assert.ok(! player.select_pingju());
    });
  });

  suite('.xiangting(shoupai)', function(){
    test('役なし副露のシャンテン数は無限大', function(){
      let player = init_player({shoupai:'s789z44333,m123-,p456-'});
      assert.equal(player.xiangting(player._shoupai), Infinity);
    });
    test('役牌副露のシャンテン数', function(){
      let player = init_player({shoupai:'m123p456s789z23,z111='});
      assert.equal(player.xiangting(player._shoupai), 0);
    });
    test('役牌暗刻のシャンテン数', function(){
      let player = init_player({shoupai:'p456s789z11123,m123-'});
      assert.equal(player.xiangting(player._shoupai), 0);
    });
    test('役牌バックのシャンテン数', function(){
      let player = init_player({shoupai:'p456s789z11333,m123-'});
      assert.equal(player.xiangting(player._shoupai), 0);
    });
    test('喰いタンのシャンテン数', function(){
      let player = init_player({shoupai:'m123p456m66777,s6-78'});
      assert.equal(player.xiangting(player._shoupai), 0);
    });
    test('トイトイのシャンテン数', function(){
      let player = init_player({shoupai:'p222789s99z333,m111+'});
      assert.equal(player.xiangting(player._shoupai), 1);
    });
    test('6対子形のシャンテン数', function(){
      let player = init_player({shoupai:'p2277s5599z333,m111+,'});
      assert.equal(player.xiangting(player._shoupai), 1);
    });
    test('染め手のシャンテン数', function(){
      let player = init_player({shoupai:'m2p9s2355z7,z333=,s7-89,'});
      assert.equal(player.xiangting(player._shoupai), 2);
    });
  });

  suite('.tingpai(shoupai)', function(){
    test('役なし副露に有効牌なし', function(){
      let player = init_player({shoupai:'s789z4433,m123-,p456-'});
      assert.deepEqual(player.tingpai(player._shoupai), []);
    });
    test('役牌バックの有効牌', function(){
      let player = init_player({shoupai:'p456s789z1133,m123-'});
      assert.deepEqual(player.tingpai(player._shoupai), ['z1']);
    });
    test('喰いタンの有効牌', function(){
      let player = init_player({shoupai:'m23p456m66777,s6-78'});
      assert.deepEqual(player.tingpai(player._shoupai), ['m4']);
    });
    test('トイトイの有効牌', function(){
      let player = init_player({shoupai:'p22278s99z333,m111+'});
      assert.deepEqual(player.tingpai(player._shoupai), ['p7','p8','s9+']);
    });
    test('染め手の有効牌', function(){
      let player = init_player({shoupai:'p9s2355z7,z333=,s7-89'});
      assert.deepEqual(player.tingpai(player._shoupai),
                                                ['s1-','s4-','s5+','z7']);
    });
  });
});
