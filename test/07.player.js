const assert  = require('assert');

const Majiang = require('../src/js/majiang');

function init_player(param = {}) {

    let player = new Majiang.Player(1);
    player._callback = (r = {})=>{ player._reply = r };

    let kaiju = { player: ['私','下家','対面','上家'],
                  qijia: 2, hongpai: { m: 0, p: 1, s: 2 } }

    let qipai = { zhuangfeng: 1, jushu: 3, changbang: 1, lizhibang: 2,
                  defen: [10000, 20000, 30000, 38000], baopai: 'm3',
                  shoupai: ['','','',''] }

    if (param.qijia != null)      kaiju.qijia      = param.qijia;
    if (param.hongpai)            kaiju.hongpai    = param.hongpai;
    if (param.zhuangfeng != null) qipai.zhuangfeng = param.zhuangfeng;
    if (param.jushu != null)      qipai.jushu      = param.jushu;
    if (param.changbang != null)  qipai.changbang  = param.changbang;
    if (param.lizhibang != null)  qipai.lizhibang  = param.lizhibang;
    if (param.defen)              qipai.defen      = param.defen;
    if (param.baopai)             qipai.baopai     = param.baopai;

    let menfeng = (8 + player._id - kaiju.qijia - qipai.jushu) % 4
    qipai.shoupai[menfeng] = param.shoupai || 'm123p456s789z1123';

    player.kaiju(kaiju);
    player.qipai(qipai);
    return player;
}

function set_suanpai(player, l, dapai) {
    for (let p of dapai) {
        player._suanpai.dapai({l:l,p:p});
    }
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
    test('応答を返すこと', function(){
      assert.ok(player._reply);
    });

    test('手番以外の場合、牌数を減らす処理のみ行うこと', function(){
      player = init_player();
      player.zimo({l:1,p:''});
      assert.equal(player._paishu, 69);
      assert.equal(player._shoupai._zimo, null);
      assert.ok(player._diyizimo);
      assert.deepEqual(player._reply, {});
    })

    test('callbackがなくても動作すること', function(){
      player = init_player();
      player._callback = null;
      player.zimo({l:0,p:'z2'});
      assert.ifError(player._reply);
      player = init_player();
      player._callback = null;
      player.zimo({l:1,p:''});
      assert.ifError(player._reply);
    });
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
    test('応答を返すこと', function(){
      assert.deepEqual(player._reply, {});
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
      assert.ok(player._reply);
    });

    test('callbackがなくても動作すること', function(){
      player = init_player();
      player._callback = null;
      player.zimo({l:0,p:'z2'});
      player.dapai({l:0,p:'z2_'});
      assert.ifError(player._reply);
      player.dapai({l:1,p:'z3'});
      assert.ifError(player._reply);
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
    test('応答を返すこと', function(){
      assert.ok(player._reply);
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
      assert.deepEqual(player._reply, {});
    });

    test('callbackがなくても動作すること', function(){
      player = init_player({shoupai:'m23p456s789z11234'});
      player._callback = null;
      player.fulou({l:0,m:'m1-23'});
      assert.ifError(player._reply);
      player = init_player({shoupai:'m123p055s789z1122'});
      player._callback = null;
      player.fulou({l:0,m:'p5505+'});
      assert.ifError(player._reply);
      player = init_player({shoupai:'m23p456s789z11234'});
      player._callback = null;
      player.fulou({l:1,m:'m1-23'});
      assert.ifError(player._reply);
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
    test('応答を返すこと', function(){
      assert.deepEqual(player._reply, {});
    });

    test('加槓が副露されること', function(){
      player = init_player({shoupai:'m123p456s0z1123,s505='});
      player.gang({l:0,m:'s505=0'});
      assert.ok(! player._diyizimo);
      assert.equal(player._shoupai._fulou[0], 's505=0');
      assert.deepEqual(player._reply, {});
    });
    test('和了牌の加槓を見逃した場合、フリテンになること', function(){
      player = init_player({shoupai:'m23p456s789z11122'});
      player.gang({l:2,m:'m111=1'});
      assert.ok(! player._diyizimo);
      assert.ok(! player._neng_rong);
    });
    test('和了牌でない場合、フリテンにはならないこと', function(){
      player = init_player({shoupai:'m34p456s789z11122'});
      player.gang({l:2,m:'m111=1'});
      assert.ok(! player._diyizimo);
      assert.ok(player._neng_rong);
    });
    test('暗槓の場合、フリテンにはならないこと', function(){
      player = init_player({shoupai:'m23p456s789z11122'});
      player.gang({l:2,m:'m1111'});
      assert.ok(! player._diyizimo);
      assert.ok(player._neng_rong);
      assert.deepEqual(player._reply, {});
    });

    test('callbackがなくても動作すること', function(){
      player = init_player({shoupai:'m1111p456s789z1123'});
      player._callback = null;
      player.gang({l:0,m:'m1111'})
      assert.ifError(player._reply);
      player = init_player({shoupai:'m23p456s789z11122'});
      player._callback = null;
      player.gang({l:2,m:'m111=1'});
      assert.ifError(player._reply);
      player = init_player({shoupai:'m23p456s789z11122'});
      player._callback = null;
      player.gang({l:2,m:'m1111'});
      assert.ifError(player._reply);
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

    test('callbackがなくても動作すること', function(){
      player = init_player();
      player._callback = null;
      player.hule();
      assert.ifError(player._reply);
    });
  });

  suite('.pingju(pingju)', function(){
    let player = init_player();
    player.pingju();
    test('応答を返すこと', function(){
      assert.deepEqual(player._reply, {});
    });

    test('callbackがなくても動作すること', function(){
      player = init_player();
      player._callback = null;
      player.pingju();
      assert.ifError(player._reply);
    });
  });

  suite('.jieju(jieju)', function(){
    let player = init_player();
    player.jieju();
    test('応答を返すこと', function(){
      assert.deepEqual(player._reply, {});
    });

    test('callbackがなくても動作すること', function(){
      player = init_player();
      player._callback = null;
      player.jieju();
      assert.ifError(player._reply);
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
      assert.ok(player._reply.dapai);
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
      let player = init_player({shoupai:'m123p456s58z11234'});
      assert.equal(player.select_fulou({l:2,p:'z1'}), 'z111=');
    });
    test('役のない副露はしない', function(){
      let player = init_player({shoupai:'m123p456s78z11223'});
      assert.ok(! player.select_fulou({l:2,p:'z3'}));
    });
    test('3シャンテンに戻る副露はしない', function(){
      let player = init_player({shoupai:'m335p244899s2599'});
      assert.ok(! player.select_fulou({l:2,p:'p9'}));
    });
    test('シャンテン数が変わらなくても期待値が上がる場合は副露を選択する', function(){
      let player = init_player({shoupai:'m56778p4s2478z255',baopai:'z1'});
      assert.equal(player.select_fulou({l:2,p:'z5'}), 'z555=');
    });
    test('シャンテン数が進んでも期待値が上がらない場合は副露しない', function(){
      let player = init_player({shoupai:'m456p22378s34455',baopai:'s3'});
      assert.ok(! player.select_fulou({l:3,p:'s6'}));
    });
    test('役ありでも2シャンテンまでは大明槓しない', function(){
      let player = init_player({shoupai:'m123p147s78z11123'});
      assert.ok(! player.select_fulou({l:2,p:'z1'}));
    });
    test('役のない大明槓はしない', function(){
      let player = init_player({shoupai:'m123p456s78z11333'});
      assert.ok(! player.select_fulou({l:2,p:'z3'}));
    });
    test('リーチ者がいる場合、シャンテン数を進めるだけの副露はしない', function(){
      let player = init_player({shoupai:'m123p456s58z11234'});
      player.dapai({l:2,p:'z1*'})
      assert.ok(! player.select_fulou({l:2,p:'z1*'}));
    });
    test('リーチ者がいる2シャンテンでも超好形確定のポン・チーはする', function(){
      let player = init_player({shoupai:'m11p235s788z22277',jushu:2});
      player.dapai({l:0,p:'z7*'})
      assert.equal(player.select_fulou({l:0,p:'z7*'}), 'z777-');
    });
    test('リーチ者がいる場合、超好形とならないポンテン・チーテンはとらない', function(){
      let player = init_player({shoupai:'m1135p678s788,z777=',jushu:2,
                                                              baopai:'z2'});
      player.dapai({l:0,p:'m4*'})
      assert.ok(! player.select_fulou({l:0,p:'m4*'}));
    });
    test('副露可能なメンツなし', function(){
      let player = init_player({shoupai:'m123p456s58z12345'});
      assert.ok(! player.select_fulou({l:2,p:'z1'}));
    });
    test('引継情報域が設定された場合は、副露選択に関する情報を設定する', function(){
      let player = init_player({shoupai:'m123p456s58z11234'});
      let info = [];
      player.select_fulou({l:2,p:'z1'}, info);
      assert.equal(info.length, 2);

      player = init_player({shoupai:'m123p456s58z11234'});
      player.dapai({l:2,p:'m1*'})
      info = [];
      player.select_fulou({l:2,p:'z1'}, info);
      assert.equal(info.length, 2);

      player = init_player({shoupai:'m123p456s56z11234'});
      info = [];
      player.select_fulou({l:2,p:'z1'}, info);
      assert.equal(info.length, 2);

      player = init_player({shoupai:'m123p456s56z11234'});
      player.dapai({l:2,p:'m1*'})
      info = [];
      player.select_fulou({l:2,p:'z1'}, info);
      assert.equal(info.length, 2);
    });
  });

  suite('.select_gang()', function(){
    test('シャンテン数が変わらない場合、暗槓・加槓する', function(){
      let player = init_player({shoupai:'m234p147s1477z111z1'});
      assert.equal(player.select_gang(), 'z1111');
      player = init_player({shoupai:'m234p147s1477z1,z111+'});
      assert.equal(player.select_gang(), 'z111+1');
    });
    test('3シャンテン以上に戻る暗槓はしない', function(){
      let player = init_player({shoupai:'m133p405557999z36'});
      assert.ok(! player.select_gang());
      player = init_player({shoupai:'m569p269s12222z136'});
      assert.ok(! player.select_gang());
    });
    test('シャンテン数が戻っても期待値が上がる場合は暗槓する', function(){
      let player = init_player({shoupai:'m88p0778888s2m5,s067-',baopai:'p4'});
      assert.equal(player.select_gang(), 'p8888');
    });
    test('期待値が上がらない場合シャンテン数が戻る暗槓はしない', function(){
      let player = init_player({shoupai:'m111123p456s789z12'});
      assert.ok(! player.select_gang());
    });
    test('リーチ後も可能であれば暗槓する', function(){
        let player = init_player({shoupai:'m44468s23488899m4*',baopai:'z2',
                                  hongpai:{m:1,p:1,s:1}});
        assert.equal(player.select_gang(), 'm4444');
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
    test('期待値が変わらなくても暗槓する', function(){
      let player = init_player({shoupai:'m111333p11789s22*'});
      player.zimo({l:0,p:'m3'})
      assert.ok(player.select_gang());
    });
    test('引継情報域が設定された場合は、槓選択に関する情報を設定する', function(){
      let player = init_player({shoupai:'m234p147s1477z111z1'});
      let info = [];
      player.select_gang(info);
      assert.ok(info.length);
      player = init_player({shoupai:'m123p456s789z2z1,z111='});
      info = [];
      player.select_gang(info);
      assert.ok(info.length);
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
      let player = init_player({shoupai:'m223057p2479s357p5',baopai:'z1'});
      assert.equal(player.select_dapai(), 'p9');
    });
    test('打点を考慮して打牌を選択する', function(){
      let player = init_player({shoupai:'m12378p123s13488m6',baopai:'s9'});
      assert.equal(player.select_dapai(), 's4*');
    });
    test('期待値が高くなる場合はシャンテン戻しを選択する', function(){
      let player = init_player({shoupai:'m123p1234789s3388',baopai:'p0'});
      assert.equal(player.select_dapai(), 's3');
    });
    test('フリテンとなる場合はシャンテン戻しを選択しない', function(){
      let player = init_player({shoupai:'m12p19s19z1234567m1',baopai:'s3'});
      assert.equal(player.select_dapai(), 'm2*');
    });
    test('評価値0のシャンテン戻しは選択しない', function(){
      let player = init_player({shoupai:'m456p56s066z44s7,p777+',baopai:'m7'});
      assert.equal(player.select_dapai(), 's6');
    });
    test('副露を考慮した期待値で打牌を選択する', function(){
      let player = init_player({shoupai:'m66678p34s3077z77m9',baopai:'m1'});
      assert.equal(player.select_dapai(), 's3');
    });
    test('同色が10枚以上の場合、染め手を狙う', function(){
      let player = init_player({shoupai:'m235689p9s57z6z7,z111='});
      assert.notEqual(player.select_dapai(), 'z7_');
    });
    test('風牌が9枚以上の場合、四喜和を狙う', function(){
      let player = init_player({shoupai:'m147p1s0z22333z4,z111='});
      assert.notEqual(player.select_dapai(), 'z4_');
    });
    test('三元牌が6枚以上の場合、大三元を狙う', function(){
      let player = init_player({shoupai:'m125p2469s1z66z7,z555='});
      assert.notEqual(player.select_dapai(), 'z7_');
    });
    test('リーチ者がいる場合はシャンテン戻しを選択しない', function(){
      let player = init_player({shoupai:'m123p1234789s388',baopai:'p0'});
      player.dapai({l:3,p:'p1'});
      player.dapai({l:3,p:'s6*'});
      player.zimo({l:0,p:'s3'});
      assert.equal(player.select_dapai(), 'p1*');
    });
    test('リーチ者がいても自身もテンパイした場合はリーチする', function(){
      let player = init_player({shoupai:'m123p456s578z1122'});
      player.dapai({l:3,p:'p5*'});
      player.zimo({l:0,p:'s9'});
      assert.equal(player.select_dapai(), 's5*');
    });
    test('3シャンテン、安全牌あり → ベタオリ', function(){
      let player = init_player({shoupai:'m2367p3566s33588s7'});
      set_suanpai(player, 2, ['s8*']);
      assert.equal(player.select_dapai(), 's8');
    });
    test('愚形1シャンテン、安全牌なし → 押し', function(){
      let player = init_player({shoupai:'s2357s8,z777=,m123-,p456-'});
      set_suanpai(player, 2, ['m4','m5','m6','p4','p5','p6*']);
      assert.equal(player.select_dapai(), 's8_');
    });
    test('好形2シャンテン、安全牌あり → 回し打ち', function(){
      let player = init_player({shoupai:'m23344p2346s2355p8'});
      set_suanpai(player, 2, ['s8*']);
      assert.equal(player.select_dapai(), 'p8_');
    });
    test('好形1シャンテン、安全牌なし → 押し', function(){
      let player = init_player({shoupai:'s2357s8,z777=,m123-,p406-'});
      set_suanpai(player, 2, ['m4','m5','m6','p4','p5','p6*']);
      assert.equal(player.select_dapai(), 's8_');
    });
    test('超好形1シャンテン → 全押し', function(){
      let player = init_player({shoupai:'s2357s8,z777=,m123-,p456-',
                                baopai:'z6'});
      set_suanpai(player, 2, ['m4','m5','m6','p4','p5','p6','s4','s6*']);
      assert.equal(player.select_dapai(), 's8_');
    });
    test('テンパイ → 全押し', function(){
      let player = init_player({shoupai:'s1234s6,z777=,m123-,p456-'});
      set_suanpai(player, 2, ['m4','m5','m6','p4','p5','p6','s7','s8',
                              'z1','z2','z3','z4*']);
      assert.equal(player.select_dapai(), 's1');
    });
    test('形式テンパイ → 全押し', function(){
      let player = init_player({shoupai:'s2345s6,z444=,m123-,p456-'});
      set_suanpai(player, 2, ['m4','m5','m6','p4','p5','p6','s7','s8',
                              'z1','z2','z3','z4*']);
      assert.equal(player.select_dapai(), 's2');
    });
    test('引継情報域が設定された場合は、打牌選択に関する情報を設定する', function(){
      let player = init_player({shoupai:'m123p1234789s3388',baopai:'p0'});
      let info = [];
      player.select_dapai(info);
      assert.ok(info.length);

      player = init_player({shoupai:'m123p456s789z1122m1',baopai:'z3'});
      info = [];
      player.select_dapai(info);
      assert.ok(info.length);

      player = init_player({shoupai:'m24589p1146s67z13'});
      player.dapai({l:3,p:'p1*'});
      info = [];
      player.zimo({l:0,p:'m1'});
      player.select_dapai(info);
      assert.ok(info.length);
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
    test('引継情報域が設定された場合は、和了に関する情報を設定する', function(){
      let player = init_player({shoupai:'m123p456s789z1122'});
      info = [];
      player.select_hule({l:2,p:'z1'}, null, info);
      assert.ok(info.length);

      player = init_player({shoupai:'m12p456s789z11122'});
      info = [];
      player.select_hule({l:2,m:'m333-3'}, 'qianggang', info);
      assert.ok(info.length);

      player = init_player({shoupai:'m12p456s789z11122m3'});
      info = [];
      player.select_hule(null, null, info);
      assert.ok(info.length);
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
      let player = init_player({shoupai:'m123p456s789z77,z333-'});
      assert.equal(player.xiangting(player._shoupai), 1);
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
      let player = init_player({shoupai:'m12p456s789z77,z333-'});
      assert.deepEqual(player.tingpai(player._shoupai), ['m1','m2','z7+']);
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

  suite('.get_defen(shoupai)', function(){
    let player = init_player();
    test('現在の場風、自風、ドラを元にツモ和了の打点を計算する', function(){
      assert.equal(player.get_defen(
                Majiang.Shoupai.fromString('m234p456z1122z1,s6-78')), 3900);
    });
    test('門前の場合リーチすることを前提に打点を計算する', function(){
      assert.equal(player.get_defen(
                Majiang.Shoupai.fromString('m234p456s678z3322z3')), 7800);
    });
  });

  suite('.eval_shoupai(shoupai, paishu)', function(){
    test('和了形の場合は和了打点を評価値とする', function(){
      let player = init_player({shoupai:'m123678p123s1388s2',baopai:'s9',
                                zhuangfeng:0,jushu:0,hongpai:{m:1,p:1,s:1}});
      assert.equal(player.eval_shoupai(player._shoupai,
                                       player._suanpai.paishu_all()), 8000)
    });
    test('テンパイ形の場合は、和了打点×枚数 の総和を評価値とする', function(){
      let player = init_player({shoupai:'m123678p123s1388',baopai:'s9',
                                zhuangfeng:0,jushu:0,hongpai:{m:1,p:1,s:1}});
      assert.equal(player.eval_shoupai(player._shoupai,
                                       player._suanpai.paishu_all()), 32000/12)
    })
    test('打牌可能な牌姿の場合は、打牌後の牌姿の評価値の最大値を評価値とする', function(){
      let player = init_player({shoupai:'m123678p123s13488',baopai:'s9',
                                zhuangfeng:0,jushu:0,hongpai:{m:1,p:1,s:1}});
      assert.equal(player.eval_shoupai(player._shoupai,
                                       player._suanpai.paishu_all()), 32000/12)
    });
    test('3シャンテン以上の場合は鳴きを考慮した待ち牌数を評価値とする', function(){
      let player = init_player({shoupai:'m569p4s5778z11335',baopai:'s9',
                                zhuangfeng:0,jushu:0,hongpai:{m:1,p:1,s:1}});
      assert.equal(player.eval_shoupai(player._shoupai,
                                       player._suanpai.paishu_all()), 61)
    });
  });
});
