const assert = require('assert');

const Majiang = require('../src/js/majiang');
Majiang.Dev = { Game: require('../src/js/majiang/dev/game') };

const script = require('./data/script.json');

let MSG = [];

function init_game(param = {}) {
    const game = new Majiang.Game();
    game._model.qijia      = 3;
    game._model.zhuangfeng = 1;
    game._model.jushu      = 2;
    game._model.changbang  = 1;
    game._model.lizhibang  = 2;
    game._model.defen      = [10000, 20000, 30000, 38000],
    game._player = [0,1,2,3].map(id => new Player(id));
    game._view   = new View();
    game._speed = 0;
    game.stop();
    game.kaiju();
    game.qipai();
    MSG = [];
    if (param.shoupai) {
        game._model.shoupai
            = param.shoupai.map(s=>Majiang.Shoupai.fromString(s));
    }
    if (param.baopai) {
        game._model.shan._baopai = [ param.baopai ];
    }
    if (param.fubaopai) {
        game._model.shan._fubaopai = [ param.fubaopai ];
    }
    if (param.zimo) {
        let pai = game._model.shan._pai;
        for (let i = 0; i < param.zimo.length; i++) {
            if (param.zimo[i]) pai[pai.length - 1 - i] = param.zimo[i];
        }
    }
    if (param.gangzimo) {
        let pai = game._model.shan._pai;
        for (let i = 0; i < param.gangzimo.length; i++) {
            if (param.gangzimo[i]) pai[i] = param.gangzimo[i];
        }
    }
    return game;
}

function last_paipu(game, i = 0) {
    let log = game._paipu.log[game._paipu.log.length - 1];
    return log[log.length - 1 + i];
}

function set_msg(paipu) {
    let msg = [];
    for (let i = 0; i < 4; i++) {
        msg[i] = JSON.parse(JSON.stringify(paipu));
    }
    return msg;
}

class View {
    constructor()  {}
    kaiju  (param) { this._param = {kaiju:   param} }
    redraw (param) { this._param = {redraw:  param} }
    update (param) { this._param = {update:  param} }
    say(name, l)   { let param = {}; param[name] = l;
                     this._param = {say:     param} }
    summary(param) { this._param = {summary: param} }
}

class Player {
    constructor(id) {
        this._id    = id;
        this._reply = [];
        this._delay = 0;
    }
    action(msg, callback) {
        MSG[this._id] = msg;
        if (callback)
            setTimeout(()=>callback(this._reply.shift()), this._delay);
    }
}

suite ('Majiang.Game', function(){

  let paipu;

  test('クラスが存在すること', function(){assert.ok(Majiang.Game)});

  suite('constructor()', function(){
    const game = new Majiang.Game()
    test('インスタンスが生成できること', function(){
      assert.ok(game);
    });
    test('タイトルが設定されていること', function(){
      assert.ok(game._model.title);
    });
    test('対局者名が設定されていること', function(){
      assert.deepEqual(game._model.player, ['私','下家','対面','上家']);
    });
    test('起家が設定されていること', function(){
      assert.ok(game._model.qijia == 0 ||
                game._model.qijia == 1 ||
                game._model.qijia == 2 ||
                game._model.qijia == 3);
    });
    test('局数が初期化されていること', function(){
      assert.equal(game._model.zhuangfeng, 0);
      assert.equal(game._model.jushu, 0);
    });
    test('供託が初期化されていること', function(){
      assert.equal(game._model.changbang, 0);
      assert.equal(game._model.lizhibang, 0);
    });
    test('持ち点が初期化されていること', function(){
      assert.deepEqual(game._model.defen, [25000,25000,25000,25000]);
    });
    test('赤牌の条件が設定されていること', function(){
      assert.deepEqual(game._hongpai, {m:1,p:1,s:1});
    });
    test('速度調整の初期値が設定されていること', function(){
      assert.ok(game._speed);
    });
  });

  suite('.stop()', function(){
    const game = new Majiang.Game();
    test('停止状態になること', function(){
      game.stop();
      assert.ok(game._stop);
      assert.ok(! game._timeout_id);
    });
  });

  suite('.start()', function(){
    const game = new Majiang.Game();
    game.stop();
    test('開始状態になること', function(done){
      game.start();
      assert.ok(! game._stop);
      assert.ok(game._timeout_id);
      setTimeout(()=>{
        assert.ok(! game._timeout_id);
        done();
      }, 0);
    });
    test('二重起動しないこと', function(done){
      game._timeout_id = 1;
      game.start();
      setTimeout(()=>{
        assert.equal(game._timeout_id, 1);
        done();
      }, 0);
    });
  });

  suite('.delay(callback, timeout)', function(){
    const game = new Majiang.Game();
    test('speed: 0', function(done){
      let called;
      game._speed = 0;
      game.delay(()=>{called = 1});
      assert.ok(! called);
      setTimeout(()=>{
        assert.ok(called);
        done();
      }, 0);
    });
    test('speed: 1', function(done){
      let called;
      game._speed = 1;
      game.delay(()=>{called = 1});
      assert.ok(! called);
      setTimeout(()=>{assert.ok(! called)}, 200);
      setTimeout(()=>{
        assert.ok(called);
        done();
      }, 500);
    });
    test('speed: 3', function(done){
      let called;
      game._speed = 3;
      game.delay(()=>{called = 1});
      assert.ok(! called);
      setTimeout(()=>{assert.ok(! called)}, 500);
      setTimeout(()=>{
        assert.ok(called);
        done();
      }, 600);
    });
    test('speed: 0, timeout: 10', function(done){
      let called;
      game._speed = 0;
      game.delay(()=>{called = 1}, 10);
      assert.ok(! called);
      setTimeout(()=>{
        assert.ok(called);
        done();
      }, 0);
    });
    test('speed: 5, timeout: 10', function(done){
      let called;
      game._speed = 5;
      game.delay(()=>{called = 1}, 10);
      assert.ok(! called);
      setTimeout(()=>{
        assert.ok(called);
        done();
      }, 10);
    });
  });

  suite('.notify_players(type, msg)', function(){

    const game = new Majiang.Game();
    game._player = [0,1,2,3].map(id => new Player(id));
    game._model.player_id = [3, 0, 1, 2];

    let type = 'test';
    let msg  = ['a','b','c','d'];

    test('通知が伝わること', function(done){
      MSG = [];
      game.notify_players(type, msg);
      assert.ok(! game._status);
      setTimeout(()=>{
        assert.deepEqual(MSG, ['b','c','d','a']);
        done();
      }, 0);
    });
    test('通知が即座には伝わらないこと', function(){
      MSG = [];
      game.notify_players(type, msg);
      assert.equal(MSG.length, 0);
    });
  });

  suite('.call_players(type, msg)', function(){

    const game = new Majiang.Game();
    game._player = [0,1,2,3].map(id => new Player(id));
    game._model.player_id = [3, 0, 1, 2];
    game.stop();

    let type = 'test';
    let msg   = ['a','b','c','d'];

    test('通知が伝わること', function(done){
      MSG = [];
      game.call_players(type, msg);
      assert.equal(game._status, type);
      setTimeout(()=>{
        assert.deepEqual(MSG, ['b','c','d','a']);
        done();
      }, 0);
    });
    test('通知が即座には伝わらないこと', function(done){
      MSG = [];
      game.call_players(type, msg);
      assert.equal(MSG.length, 0);
      setTimeout(done, 0);
    });
    test('応答が返ること', function(done){
      const game = new Majiang.Game();
      game._player = [0,1,2,3].map(id => new Player(id));
      game._model.player_id = [3, 0, 1, 2];
      game.stop();
      game._player.map(player => player._reply = [player._id])

      game.call_players(type, msg);
      setTimeout(()=>{
        assert.deepEqual(game._reply, [0,1,2,3]);
        done();
     }, 10);
    });
    test('応答速度＜速度調整値(自動)', function(done){
      game._speed = 1;
      game.call_players(type, msg);
      assert.ok(game._timeout_id);
      setTimeout(()=>{
        assert.ok(! game._timeout_id);
        done();
      }, 200);
    });
    test('応答速度＜速度調整値(時間指定)', function(done){
      game.call_players(type, msg, 10);
      assert.ok(game._timeout_id);
      setTimeout(()=>{
        assert.ok(! game._timeout_id);
        done();
      }, 10);
    });
    test('応答速度＞速度調整値', function(done){
      game._player[0]._delay = 10;
      game.call_players(type, msg, 0);
      assert.ok(game._timeout_id);
      setTimeout(()=>{
        assert.ok(! game._timeout_id);
        done();
      }, 10);
    });
  });

  suite('.next(force)', function(){
    test('未定義の status に対して例外を発生しないこと', function(done){
      const game = new Majiang.Game();
      game._player = [0,1,2,3].map(id => new Player(id));
      game._speed = 0;
      game.call_players('type', ['a','b','c','d']);
      setTimeout(()=>{
        assert.ok(! game.next(1));
        done();
      }, 10);
    });
  });


  suite('.kaiju()', function(){

    const game = new Majiang.Game();
    game._player = [0,1,2,3].map(id => new Player(id));
    game._view   = new View();
    game._speed = 0;
    game.stop();

    test('牌譜が初期化されること', function(){
      game.kaiju();
      assert.equal(game._paipu.title, game._model.title);
      assert.deepEqual(game._paipu.player, game._model.player);
      assert.equal(game._paipu.qijia, game._model.qijia);
      assert.equal(game._paipu.log.length, 0);
    });
    test('表示処理が呼び出されること', function(){
      assert.deepEqual(game._view._param, {kaiju: null});
    })
    test('通知が伝わること', function(done){
      paipu = { kaiju: {
        player:  game._model.player,
        qijia:   game._model.qijia,
        hongpai: game._hongpai
      }};
      game.kaiju();
      setTimeout(()=>{
        assert.deepEqual(MSG, set_msg(paipu));
        done();
      }, 0);
    });
  });

  suite('.qipai()', function(){
    const game = init_game();
    test('牌山が生成されること', function(){
      game.kaiju();
      game.qipai();
      const shan = game._model.shan;
      assert.equal(shan.paishu(), 70);
      assert.equal(shan.baopai().length, 1);
      assert.equal(shan.fubaopai().length, 1);
    });
    test('配牌されること', function(){
      for (let l = 0; l < 4; l++) {
        let shoupai = game._model.shoupai[l];
        assert.equal(shoupai.toString().replace(/[mpsz]/g,'').length, 13);
      }
    });
    test('河が初期化されること', function(){
      for (let l = 0; l < 4; l++) {
        let he = game._model.he[l];
        assert.equal(he._pai.length, 0);
      }
    });
    test('手番が初期化されること', function(){
      assert.equal(game._model.lunban, -1);
    });
    test('初期値が設定されること', function(){
      assert.ok(game._diyizimo);
      assert.ok(game._fengpai);
      assert.ok(! game._dapai);
      assert.ok(! game._gang);
      assert.equal(game._lizhi.filter(x=>x).length, 0);
      assert.equal(game._yifa.filter(x=>x).length, 0);
      assert.equal(game._n_gang.filter(x=>x==0).length, 4);
      assert.equal(game._hule.length, 0);
    });
    test('牌譜が記録されること', function(){
      paipu = { qipai: {
        zhuangfeng: 1,
        jushu:      2,
        changbang:  1,
        lizhibang:  2,
        defen:      [20000, 30000, 38000, 10000],
        baopai:     game._model.shan.baopai()[0],
        shoupai:    game._model.shoupai.map(s => s.toString())
      }};
      assert.equal(game._paipu.log.length, 1);
      assert.equal(game._paipu.log[0].length, 1);
      assert.deepEqual(game._paipu.log[0][0], paipu);
    });
    test('表示処理が呼び出されること', function(){
      assert.deepEqual(game._view._param, {redraw: null});
    });
    test('通知が伝わること', function(done){
      let msg = [];
      for (let l = 0; l < 4; l++) {
        let id = [1,2,3,0][l];
        msg[id] = JSON.parse(JSON.stringify(paipu));
        for (let i = 0; i < 4; i++) {
          if (i != l) msg[id].qipai.shoupai[i] = '';
        }
      }
      setTimeout(()=>{
        assert.deepEqual(MSG, msg);
        done();
      }, 0);
    });
    test('使用する牌山を指定できること', function(){
      const shan = new Majiang.Shan();
      const shoupai = new Majiang.Shoupai(shan._pai.slice(-13)).toString();
      game.qipai(shan);
      assert.equal(game._model.shoupai[0].toString(), shoupai);
    });
  });

  suite('.zimo()', function(){
    let game = init_game();
    test('手番が更新されること', function(){
      game.zimo();
      assert.equal(game._model.lunban, 0);
    });
    test('牌山からツモられること', function(){
      assert.equal(game._model.shan.paishu(), 69);
    });
    test('手牌にツモ牌が加えられること', function(){
      assert.ok(game._model.shoupai[0]._zimo);
    });
    test('牌譜が記録されること', function(){
      paipu = { zimo: { l: 0, p: game._model.shoupai[0]._zimo } };
      assert.deepEqual(last_paipu(game), paipu);
    });
    test('表示処理が呼び出されること', function(){
      assert.deepEqual(game._view._param, {update: paipu});
    });
    test('通知が伝わること', function(done){
      let msg = [];
      for (let l = 0; l < 4; l++) {
        let id = [1,2,3,0][l];
        msg[id] = JSON.parse(JSON.stringify(paipu));
        if (l != 0) msg[id].zimo.p = '';
      }
      setTimeout(()=>{
        assert.deepEqual(MSG, msg);
        done();
      }, 0);
    });
    test('ツモ牌がない場合、流局すること', function(done){
      game = init_game({zimo:['m2','m3','m4','m5']});
      while (game._model.shan.paishu()) { game._model.shan.zimo() }
      game.zimo();
      setTimeout(()=>{
        assert.ok(last_paipu(game).pingju);
        done();
      }, 0);
    });
  });

  suite('.dapai(dapai)', function(){
    let game = init_game();
    let dapai;
    test('手牌から打牌が切り出されること', function(){
      game.zimo();
      dapai = game._model.shoupai[0]._zimo;
      game.dapai(dapai);
      assert.ok(! game._model.shoupai[0]._zimo);
    });
    test('河に打牌されること', function(){
      assert.equal(game._model.he[0]._pai[0], dapai);
    });
    test('引継情報を設定すること', function(){
      assert.equal(game._dapai, dapai);
    });
    test('牌譜が記録されること', function(){
      paipu = { dapai: { l: 0, p: dapai } };
      assert.deepEqual(last_paipu(game), paipu);
    });
    test('表示処理が呼び出されること', function(){
      assert.deepEqual(game._view._param, {update: paipu});
    });
    test('通知が伝わること', function(done){
      setTimeout(()=>{
        assert.deepEqual(MSG, set_msg(paipu));
        done();
      }, 0);
    });
    test('風牌以外の打牌で四風連打が解除されること', function(){
      game = init_game({shoupai:['m1']});
      game.zimo();
      game.dapai('m1');
      assert.ok(! game._fengpai);
    });
    test('異なる風牌の打牌で四風連打が解除されること', function(){
      game = init_game({shoupai:['z1','z2']});
      game.zimo();
      game.dapai('z1');
      game.zimo();
      game.dapai('z2');
      assert.ok(! game._fengpai);
    });
    test('ダブルリーチ', function(){
      game = init_game({shoupai:['m123p456s111789z2'],zimo:['m1']});
      game.zimo();
      game.dapai('m1_*');
      assert.equal(game._lizhi[0], 2);
      assert.ok(game._yifa[0]);
    });
    test('リーチ', function(){
      game = init_game({shoupai:['m123p456s111789z2'],zimo:['m1']});
      game._diyizimo = false;
      game.zimo();
      game.dapai('m1_*');
      assert.equal(game._lizhi[0], 1);
      assert.ok(game._yifa[0]);
    });
    test('リーチ後の打牌で一発の権利を失うこと', function(){
      game = init_game();
      game._yifa[0] = 1;
      game.zimo();
      game.dapai(game._model.shoupai[0]._zimo);
      assert.ok(! game._yifa[0]);
    });
    test('打牌によりフリテンが解除されること', function(){
      game = init_game({shoupai:['m123p456s789z1122'],zimo:['z3']});
      game.zimo();
      game._neng_rong[0] = false;
      game.dapai('z3_*');
      assert.ok(game._neng_rong[0]);
    });
    test('リーチ後はフリテンが解除されないこと', function(){
      game = init_game({shoupai:['m123p456s789z1122*'],zimo:['z3']});
      game.zimo();
      game._neng_rong[0] = false;
      game.dapai('z3_');
      assert.ok(! game._neng_rong[0]);
    });
    test('テンパイ時に和了牌が河にある場合、フリテンとなること', function(){
      game = init_game({shoupai:['m123p456s789z1133'],zimo:['z3']});
      game.zimo();
      game.dapai('z3_');
      assert.ok(! game._neng_rong[0]);
    });
    test('加槓後の打牌で開槓されること', function(){
      game = init_game({shoupai:['m1,m111-']});
      game.zimo();
      game.gang('m111-1');
      game.gangzimo();
      assert.equal(game._model.shan.baopai().length, 1);
      game.dapai(game._model.shoupai[0]._zimo);
      assert.equal(game._model.shan.baopai().length, 2);
    });
  });

  suite('.fulou(fulou)', function(){
    const game = init_game({shoupai:['m2s123','m13z12','p5506','p56z11']});
    test('河から副露牌が拾われること', function(){
      game.zimo();
      game.dapai('m2*');
      game.fulou('m12-3');
      assert.equal(game._model.he[0]._pai[0], 'm2*-');
    });
    test('手牌が副露されること', function(){
      assert.equal(game._model.shoupai[1]._fulou[0], 'm12-3');
    });
    test('手番が更新されること(上家からのチー)', function(){
      assert.equal(game._model.lunban, 1);
    });
    test('第一ツモではなくなること', function(){
      assert.ok(! game._diyizimo);
    });
    test('一発がなくなること', function(){
      assert.equal(game._yifa.filter(x=>x).length, 0);
    });
    test('牌譜が記録されること', function(){
      paipu = { fulou: { l: 1, m: 'm12-3' } };
      assert.deepEqual(last_paipu(game), paipu);
    });
    test('表示処理が呼び出されること', function(){
      assert.deepEqual(game._view._param, {update: paipu});
    });
    test('通知が伝わること', function(done){
      setTimeout(()=>{
        assert.deepEqual(MSG, set_msg(paipu));
        done();
      }, 0);
    });
    test('手番が更新されること(対面からのポン)', function(){
      game.dapai('z1');
      game.fulou('z111=');
      assert.equal(game._model.lunban, 3);
    });
    test('手番が更新されること(下家からのカン)', function(){
      game.dapai('p5');
      game.fulou('p5505+');
      assert.equal(game._model.lunban, 2);
    });
    test('槓数が加算されること', function(){
      assert.equal(game._n_gang[2], 1);
      assert.equal(game._gang, 'p5505+');
    });
  });

  suite('.gang(gang)', function(){
    const game = init_game({shoupai:['m0555s0p55,s555+'],
                            zimo:['m1'],gangzimo:['m2']});
    test('加槓が副露されること', function(){
      game.zimo();
      game.gang('s555+0');
      assert.equal(game._model.shoupai[0]._fulou[0], 's555+0');
    });
    test('槓数が加算されること', function(){
      assert.equal(game._n_gang[0], 1);
      assert.equal(game._gang, 's555+0');
    });
    test('牌譜が記録されること', function(){
      paipu = { gang: { l: 0, m: 's555+0' } };
      assert.deepEqual(last_paipu(game), paipu);
    });
    test('表示処理が呼び出されること', function(){
      assert.deepEqual(game._view._param, {update: paipu});
    });
    test('通知が伝わること', function(done){
      setTimeout(()=>{
        assert.deepEqual(MSG, set_msg(paipu));
        done();
      }, 0);
    });
    test('暗槓が副露されること', function(){
      game.gangzimo();
      game.gang('m5550');
      assert.equal(game._model.shoupai[0]._fulou[1], 'm5550');
    });
    test('先の明槓が開槓されること', function(){
      assert.equal(game._model.shan.baopai().length, 2);
    });
  });

  suite('.gangzimo()', function(){
    const game = init_game({shoupai:['m0555s0p055z12,s555+','p5'],
                            zimo:['p1','p2'],gangzimo:['m1','m2','m3']});
    test('牌山からツモられること', function(){
      game.zimo();
      game.gang('m5550');
      game.gangzimo();
      assert.equal(game._model.shan.paishu(), 68);
    });
    test('手牌にツモ牌が加えられること', function(){
      assert.ok(game._model.shoupai[0]._zimo);
    });
    test('暗槓の場合、即座に開槓されること', function(){
      assert.equal(game._model.shan.baopai().length, 2);
    });
    test('第一ツモではなくなること', function(){
      assert.ok(! game._diyizimo);
    });
    test('牌譜が記録されること', function(){
      paipu = { gangzimo: { l: 0, p: game._model.shoupai[0]._zimo } };
      assert.deepEqual(last_paipu(game, -1), paipu);
    });
    test('表示処理が呼び出されること', function(){
      assert.deepEqual(game._view._param, {update: paipu});
    });
    test('通知が伝わること', function(done){
      let msg = [];
      for (let l = 0; l < 4; l++) {
        let id = [1,2,3,0][l];
        msg[id] = JSON.parse(JSON.stringify(paipu));
        if (l != 0) msg[id].gangzimo.p = '';
      }
      setTimeout(()=>{
        assert.deepEqual(MSG, msg);
        done();
      }, 0);
    });
    test('加槓の場合、即座には開槓されないこと', function(){
      game.gang('s555+0');
      game.gangzimo();
      assert.equal(game._model.shan.baopai().length, 2);
    });
    test('大明槓の場合、即座には開槓されないこと', function(){
      game.dapai('p1');
      assert.equal(game._model.shan.baopai().length, 3);
      game.zimo();
      game.dapai('p5');
      game.fulou('p5505+');
      game.gangzimo();
      assert.equal(game._model.shan.baopai().length, 3);
    });
  });

  suite('.kaigang()', function(){
    const game = init_game({shoupai:['m0,m555=']});
    test('槓ドラが増えること', function(){
      game.zimo();
      game.gang('m555=0');
      game.gangzimo();
      game.kaigang();
      assert.equal(game._model.shan.baopai().length, 2);
      assert.ok(! game._gang);
    });
    test('牌譜が記録されること', function(){
      paipu = { kaigang: { baopai: game._model.shan.baopai().pop() } };
      assert.deepEqual(last_paipu(game), paipu);
    });
    test('表示処理が呼び出されること', function(){
      assert.deepEqual(game._view._param, {update: paipu});
    });
    test('通知が伝わること', function(done){
      setTimeout(()=>{
        assert.deepEqual(MSG, set_msg(paipu));
        done();
      }, 0);
    });
  });

  suite('.hule()', function(){
    let game = init_game({shoupai:['m123p456s111789z2'],zimo:['z2']});
    test('牌譜が記録されること(天和)', function(){
      game.zimo();
      game.hule();
      paipu = { hule: {
        l: 0, shoupai: 'm123p456s111789z2z2', baojia: null, fubaopai: null,
        damanguan: 1, defen: 48000, hupai: [{ name: '天和', fanshu: '*' }],
        fenpei: [50300, -16100, -16100, -16100]
      }};
      assert.deepEqual(last_paipu(game), paipu);
    });
    test('表示処理が呼び出されること', function(){
      assert.deepEqual(game._view._param, {update: paipu});
    });
    test('通知が伝わること', function(done){
      setTimeout(()=>{
        assert.deepEqual(MSG, set_msg(paipu));
        done();
      }, 0);
    });
    test('地和', function(){
      game = init_game({shoupai:['','m123p456s111789z2'],zimo:['','z2']});
      game.zimo();
      game.dapai(game._model.shoupai[0]._zimo);
      game.zimo();
      game.hule();
      paipu = { hule: {
        l: 1, shoupai: 'm123p456s111789z2z2', baojia: null, fubaopai: null,
        damanguan: 1, defen: 32000, hupai: [{ name: '地和', fanshu: '*' }],
        fenpei: [-16100, 34300, -8100, -8100]
      }};
      assert.deepEqual(last_paipu(game), paipu);
    });
    test('ロン和了', function(){
      game = init_game({shoupai:['z2','m123p456s789z2777'],baopai:'m3'});
      game.zimo();
      game.dapai('z2');
      game._hule = [1];
      game.hule();
      paipu = { hule: {
        l: 1, shoupai: 'm123p456s789z2777z2', baojia: 0, fubaopai: null,
        fu: 50, fanshu: 1, defen: 1600, hupai: [{ name: '翻牌 中', fanshu: 1 }],
        fenpei: [-1900, 3900, 0, 0]
      }};
      assert.deepEqual(last_paipu(game), paipu);
    });
    test('立直', function(){
      game = init_game({shoupai:['z2','m123p456s111789z2*'],
                        baopai:'m1', fubaopai:'m4'});
      game._lizhi[1] = 1;
      game.zimo();
      game.dapai('z2');
      game._hule = [1];
      game.hule();
      paipu = { hule: {
        l: 1, shoupai: 'm123p456s111789z2z2*', baojia: 0, fubaopai: ['m4'],
        fu: 50, fanshu: 2, defen: 3200, hupai: [{ name: '立直', fanshu: 1 },
                                                { name: 'ドラ', fanshu: 1 }],
        fenpei: [-3500, 5500, 0, 0]
      }};
      assert.deepEqual(last_paipu(game), paipu);
    });
    test('ダブル立直', function(){
      game = init_game({shoupai:['z2','m123p456s111789z2*'],
                        baopai:'m3', fubaopai:'m1'});
      game._lizhi[1] = 2;
      game.zimo();
      game.dapai('z2');
      game._hule = [1];
      game.hule();
      paipu = { hule: {
        l: 1, shoupai: 'm123p456s111789z2z2*', baojia: 0, fubaopai: ['m1'],
        fu: 50, fanshu: 3, defen: 6400, hupai: [{ name:'ダブル立直', fanshu: 2 },
                                                { name: '裏ドラ',   fanshu: 1 }],
        fenpei: [-6700, 8700, 0, 0]
      }};
      assert.deepEqual(last_paipu(game), paipu);
    });
    test('一発', function(){
      game = init_game({shoupai:['z2','m123p456s111789z2*'],
                        baopai:'m3', fubaopai:'m4'});
      game._lizhi[1] = 1;
      game._yifa[1]  = true;
      game.zimo();
      game.dapai('z2');
      game._hule = [1];
      game.hule();
      paipu = { hule: {
        l: 1, shoupai: 'm123p456s111789z2z2*', baojia: 0, fubaopai: ['m4'],
        fu: 50, fanshu: 2, defen: 3200, hupai: [{ name: '立直', fanshu: 1 },
                                                { name: '一発', fanshu: 1 }],
        fenpei: [-3500, 5500, 0, 0]
      }};
      assert.deepEqual(last_paipu(game), paipu);
    });
    test('槍槓', function(){
      game = init_game({shoupai:['m2,m111=','m23p456s111789z22'],
                        baopai:'m3',zimo:['m1']});
      game.zimo();
      game.gang('m111=1');
      game._hule = [1];
      game.hule();
      paipu = { hule: {
        l: 1, shoupai: 'm23p456s111789z22m1', baojia: 0, fubaopai: null,
        fu: 50, fanshu: 1, defen: 1600, hupai: [{ name: '槍槓', fanshu: 1 }],
        fenpei: [-1900, 3900, 0, 0]
      }};
      assert.deepEqual(last_paipu(game), paipu);
    });
    test('槍槓(ダブロン)', function(){
      game = init_game({shoupai:['m1,m111=','m23p456s111789z22',
                                            'm23p456s222789z33'],baopai:'m3'});
      game.zimo();
      game.gang('m111=1');
      game._hule = [1,2];
      game.hule();
      game.hule();
      paipu = { hule: {
        l: 2, shoupai: 'm23p456s222789z33m1', baojia: 0, fubaopai: null,
        fu: 40, fanshu: 1, defen: 1300, hupai: [{ name: '槍槓', fanshu: 1 }],
        fenpei: [-1600, 0, 3600, 0]
      }};
      assert.deepEqual(last_paipu(game), paipu);
    });
    test('嶺上開花', function(){
      game = init_game({shoupai:['s1','m123p456s111789z2'],
                        baopai:'m3',gangzimo:['z2']});
      game.zimo();
      game.dapai('s1');
      game.fulou('s1111-');
      game.gangzimo();
      game.hule();
      paipu = { hule: {
        l: 1, shoupai: 'm123p456s789z2z2,s1111-', baojia: null, fubaopai: null,
        fu: 50, fanshu: 1, defen: 1600, hupai: [{ name: '嶺上開花', fanshu: 1 }],
        fenpei: [-900, 3900, -500, -500]
      }};
      assert.deepEqual(last_paipu(game), paipu);
    });
    test('海底摸月', function(){
      game = init_game({shoupai:['m123p456s11z22,s78-9'],zimo:['s1'],
                        baopai:'m3'});
      game.zimo();
      game._diyizimo = false;
      while (game._model.shan.paishu()) { game._model.shan.zimo() }
      game.hule();
      paipu = { hule: {
        l: 0, shoupai: 'm123p456s11z22s1,s78-9', baojia: null, fubaopai: null,
        fu: 40, fanshu: 1, defen: 2100, hupai: [{ name: '海底摸月', fanshu: 1 }],
        fenpei: [4400, -800, -800, -800]
      }};
      assert.deepEqual(last_paipu(game), paipu);
    });
    test('河底撈魚', function(){
      game = init_game({shoupai:['s1','m123p456s11z22,s78-9'],baopai:'m3'});
      game.zimo();
      while (game._model.shan.paishu()) { game._model.shan.zimo() }
      game.dapai('s1')
      game._hule = [1];
      game.hule();
      paipu = { hule: {
        l: 1, shoupai: 'm123p456s11z22s1,s78-9', baojia: 0, fubaopai: null,
        fu: 30, fanshu: 1, defen: 1000, hupai: [{ name: '河底撈魚', fanshu: 1 }],
        fenpei: [-1300, 3300, 0, 0]
      }};
      assert.deepEqual(last_paipu(game), paipu);
    });
    test('ハイテイ直前の牌を槓して嶺上開花', function(){
      game = init_game({shoupai:['s1','m123p456s111789z2'],
                        baopai:'m3',gangzimo:['z2']});
      game.zimo();
      game.dapai('s1');
      game.fulou('s1111-');
      while (game._model.shan.paishu() > 1) { game._model.shan.zimo() }
      game.gangzimo();
      game.hule();
      paipu = { hule: {
        l: 1, shoupai: 'm123p456s789z2z2,s1111-', baojia: null, fubaopai: null,
        fu: 50, fanshu: 1, defen: 1600, hupai: [{ name: '嶺上開花', fanshu: 1 }],
        fenpei: [-900, 3900, -500, -500]
      }};
      assert.deepEqual(last_paipu(game), paipu);
    });
    test('和了連荘', function(){
      game = init_game({shoupai:['m123p456s789z2777'],zimo:['z2']});
      game.zimo();
      game.hule();
      assert.ok(! game._no_game);
      assert.ok(game._lianzhuang);
    });
    test('子の和了で親流れ', function(){
      game = init_game({shoupai:['z2','m123p456s789z2777']});
      game.zimo();
      game.dapai('z2');
      game._hule = [1];
      game.hule();
      assert.ok(! game._no_game);
      assert.ok(! game._lianzhuang);
    });
    test('ダブロンで連荘', function(){
      game = init_game({shoupai:['m23p456s789z22777','m1',
                                'm23p456s789z11666']});
      game.zimo();
      game.dapai(game._model.shoupai[0]._zimo);
      game.zimo();
      game.dapai('m1');
      game._hule = [2,0];
      game.hule();
      game.hule();
      assert.ok(! game._no_game);
      assert.ok(game._lianzhuang);
    });
  });

  suite('.pingju()', function(){
    let game = init_game({shoupai:['m22p12366s406789','m55p40s123,z111-,p678-',
                            'm67p678s22,s56-7,p444-','m12345p33s333,m406-'],
                          zimo:['m5','m6','m7','m8']});
    test('牌譜が記録されること(全員テンパイ)', function(){
      for (let l = 0; l < 4; l++) {
        game.zimo();
        game.dapai(game._model.shoupai[l]._zimo)
      }
      game.pingju('荒牌平局');
      paipu = { pingju: {
        name: '荒牌平局', shoupai: ['m22p12366s406789','m55p40s123,z111-,p678-',
        'm67p678s22,s56-7,p444-','m12345p33s333,m406-'], fenpei: [0,0,0,0]
      }};
      assert.deepEqual(last_paipu(game), paipu);
    });
    test('表示処理が呼び出されること', function(){
      assert.deepEqual(game._view._param, {update: paipu});
    });
    test('通知が伝わること', function(done){
      setTimeout(()=>{
        assert.deepEqual(MSG, set_msg(paipu));
        done();
      }, 0);
    });
    test('全員ノーテン', function(){
      game = init_game({shoupai:['m40789p4667s8z577','m99p12306z277,m345-',
                            'm3p1234689z55,s7-89','m2233467p234555'],
                        zimo:['m5','m6','m7','m8']});
      for (let l = 0; l < 4; l++) {
        game.zimo();
        game.dapai(game._model.shoupai[l]._zimo)
      }
      game.pingju('荒牌平局');
      paipu = { pingju: {
        name: '荒牌平局', shoupai: ['','','',''], fenpei: [0,0,0,0]
      }};
      assert.deepEqual(last_paipu(game), paipu);
    });
    test('2人テンパイ', function(){
      game = init_game({shoupai:['m5699p123333678','m1106789s123067',
                            'm24p2077s2233568','m444777p22s2366z6'],
                        zimo:['m0','m6','m7','m8']});
      for (let l = 0; l < 4; l++) {
        game.zimo();
        game.dapai(game._model.shoupai[l]._zimo)
      }
      game.pingju('荒牌平局');
      paipu = { pingju: {
        name: '荒牌平局', shoupai: ['m5699p123333678','m1106789s123067','',''],
        fenpei: [1500,1500,-1500,-1500]
      }};
      assert.deepEqual(last_paipu(game), paipu);
    });
    test('テンパイと見なされない牌姿', function(){
      game = init_game({shoupai:['m123p456s789z1111','','',''],
                        baopai:'m3',zimo:['m5','m6','m7','m8']});
      for (let l = 0; l < 4; l++) {
        game.zimo();
        game.dapai(game._model.shoupai[l]._zimo)
      }
      game.pingju('荒牌平局');
      paipu = { pingju: {
        name: '荒牌平局', shoupai: ['','','',''], fenpei: [0,0,0,0]
      }};
      assert.deepEqual(last_paipu(game), paipu);
    });
    test('テンパイ連荘', function(){
      game = init_game({shoupai:['m123p456s789z1122','','','']});
      for (let l = 0; l < 4; l++) {
        game.zimo();
        game.dapai(game._model.shoupai[l]._zimo)
      }
      game.pingju('荒牌平局');
      assert.ok(! game._no_game);
      assert.ok(game._lianzhuang);
    });
    test('ノーテン親流れ', function(){
      game = init_game({shoupai:['m123p456s789z1123','','','']});
      for (let l = 0; l < 4; l++) {
        game.zimo();
        game.dapai(game._model.shoupai[l]._zimo)
      }
      game.pingju('荒牌平局');
      assert.ok(! game._no_game);
      assert.ok(! game._lianzhuang);
    });
    test('流し満貫', function(){
      game = init_game({shoupai:['m123p456s789z1122','','',''],
                        zimo:['m6','m7','m8','z1']});
      for (let l = 0; l < 4; l++) {
        game.zimo();
        game.dapai(game._model.shoupai[l]._zimo)
      }
      game.pingju('荒牌平局');
      paipu = { pingju: {
        name: '流し満貫', shoupai: ['m123p456s789z1122','','',''],
        fenpei: [-4000,-2000,-2000,8000]
      }};
      assert.deepEqual(last_paipu(game), paipu);
      assert.ok(! game._no_game);
      assert.ok(game._lianzhuang);
    });
    test('鳴かれた場合、流し満貫が成立しないこと', function(){
      game = init_game({shoupai:['m123p456s789z1123','','',''],
                        zimo:['m6','m7','m8','z1']});
      for (let l = 0; l < 4; l++) {
        game.zimo();
        game.dapai(game._model.shoupai[l]._zimo)
      }
      game.fulou('z111-');
      game.dapai('z2');
      game.pingju('荒牌平局');
      paipu = { pingju: {
        name: '荒牌平局', shoupai: ['m123p456s789z3,z111-','','',''],
        fenpei: [3000,-1000,-1000,-1000]
      }};
      assert.deepEqual(last_paipu(game), paipu);
    });
    test('2名が流し満貫', function(){
      game = init_game({shoupai:['','','',''],zimo:['m1','m2','m3','p9']});
      for (let l = 0; l < 4; l++) {
        game.zimo();
        game.dapai(game._model.shoupai[l]._zimo)
      }
      game.pingju('荒牌平局');
      paipu = { pingju: {
        name: '流し満貫', shoupai: ['','','',''],
        fenpei: [8000,-6000,-6000,4000]
      }};
      assert.deepEqual(last_paipu(game), paipu);
      assert.ok(! game._no_game);
      assert.ok(! game._lianzhuang);
    });
    test('九種九牌', function(){
      game = init_game({shoupai:['m133589p1s18z1235','','',''],zimo:['s9']});
      game.zimo();
      game.pingju('九種九牌');
      paipu = { pingju: {
        name: '九種九牌', shoupai: ['m133589p1s18z1235s9','','',''],
        fenpei: [0,0,0,0]
      }};
      assert.deepEqual(last_paipu(game), paipu);
      assert.ok(game._no_game);
      assert.ok(game._lianzhuang);
    });
    test('四風連打', function(){
      game = init_game();
      game.pingju('四風連打');
      paipu = { pingju: {
        name: '四風連打', shoupai: ['','','',''], fenpei: [0,0,0,0]
      }};
      assert.deepEqual(last_paipu(game), paipu);
      assert.ok(game._no_game);
      assert.ok(game._lianzhuang);
    });
    test('四家立直', function(){
      game = init_game({shoupai:['m55789p67789s123','m9p345s66778z555',
                                'm23468p22678s567','m67p123567s40688']});
      game.pingju('四家立直');
      paipu = { pingju: {
        name: '四家立直', shoupai: ['m55789p67789s123','m9p345s66778z555',
        'm23468p22678s567','m67p123567s40688'], fenpei: [0,0,0,0]
      }};
      assert.deepEqual(last_paipu(game), paipu);
      assert.ok(game._no_game);
      assert.ok(game._lianzhuang);
    });
    test('三家和', function(){
      game = init_game({shoupai:['m4','m40577p66s44z4466',
                            'm1156p345s340567','m2366s789,z111=,m1-23']});
      game.zimo();
      game.dapai('m4');
      game.pingju('三家和');
      paipu = { pingju: {
        name: '三家和', shoupai: ['','m40577p66s44z4466',
        'm1156p345s340567','m2366s789,z111=,m1-23'], fenpei: [0,0,0,0]
      }};
      assert.deepEqual(last_paipu(game), paipu);
      assert.ok(game._no_game);
      assert.ok(game._lianzhuang);
    });
    test('四開槓', function(){
      game = init_game();
      game.pingju('四開槓');
      paipu = { pingju: {
        name: '四開槓', shoupai: ['','','',''], fenpei: [0,0,0,0]
      }};
      assert.deepEqual(last_paipu(game), paipu);
      assert.ok(game._no_game);
      assert.ok(game._lianzhuang);
    });
  });

  suite('.last()', function(){
    let game = init_game();
    test('局が進むこと', function(done){
      game._model.zhuangfeng = 0;
      game._model.jushu = 3;
      game.qipai();
      game.pingju('荒牌平局');
      game.last();
      assert.equal(game._model.zhuangfeng, 1);
      assert.equal(game._model.jushu, 0);
      setTimeout(()=>{
        assert.ok(last_paipu(game).qipai);
        done();
      }, 0);
    });
    test('連荘時に局が進まないこと', function(done){
      game._model.zhuangfeng = 1;
      game._model.jushu = 3;
      game.qipai();
      game.pingju('荒牌平局');
      game._lianzhuang = true;
      game.last();
      assert.equal(game._model.zhuangfeng, 1);
      assert.equal(game._model.jushu, 3);
      setTimeout(()=>{
        assert.ok(last_paipu(game).qipai);
        done();
      }, 0);
    });
    test('南四局でゲームが終了すること', function(done){
      game._model.zhuangfeng = 1;
      game._model.jushu = 3;
      game.qipai();
      game.pingju('荒牌平局');
      game.last();
      assert.equal(game._model.zhuangfeng, 2);
      setTimeout(()=>{
        assert.ok(last_paipu(game).pingju);
        done();
      }, 0);
    });
    test('トビ終了すること', function(done){
      game = init_game();
      game._model.defen = [40000,30000,31000,-1000];
      game.pingju('荒牌平局');
      game.last();
      setTimeout(()=>{
        assert.ok(last_paipu(game).pingju);
        done();
      }, 0);
    });
    test('親の和了・テンパイ止め', function(done){
      game = init_game();
      game._model.zhuangfeng = 1;
      game._model.jushu = 3;
      game._model.defen = [20000,25000,30000,25000];
      game.qipai();
      game.pingju('荒牌平局');
      game._lianzhuang = true;
      game.last();
      setTimeout(()=>{
        assert.ok(last_paipu(game).pingju);
        done();
      }, 0);
    });
    test('途中流局では和了・テンパイ止めしないこと', function(done){
      game = init_game();
      game._model.zhuangfeng = 1;
      game._model.jushu = 3;
      game._model.defen = [20000,25000,30000,25000];
      game.qipai();
      game.zimo();
      game.pingju('九種九牌');
      game.last();
      setTimeout(()=>{
        assert.ok(last_paipu(game).qipai);
        done();
      }, 0);
    });
    test('西入', function(done){
      game = init_game();
      game._model.zhuangfeng = 1;
      game._model.jushu = 3;
      game._model.defen = [25000,25000,25000,25000];
      game.qipai();
      game.pingju('荒牌平局');
      game.last();
      setTimeout(()=>{
        assert.equal(last_paipu(game).qipai.zhuangfeng, 2);
        done();
      }, 0);
    });
    test('西入サドンデス', function(done){
      game = init_game();
      game._model.zhuangfeng = 2;
      game._model.jushu = 0;
      game._model.defen = [25000,25000,30000,20000];
      game.qipai();
      game.pingju('荒牌平局');
      game._lianzhuang = true;
      game.last();
      setTimeout(()=>{
        assert.ok(last_paipu(game).pingju);
        done();
      }, 0);
    });
    test('北入しないこと', function(done){
      game = init_game();
      game._model.zhuangfeng = 2;
      game._model.jushu = 3;
      game._model.defen = [25000,25000,25000,25000];
      game.qipai();
      game.pingju('荒牌平局');
      game.last();
      setTimeout(()=>{
        assert.ok(last_paipu(game).pingju);
        done();
      }, 0);
    });
  });

  suite('.jieju()', function(){
    let game = init_game();
    test('ゲーム終了時に残された供託リーチ棒はトップの得点に加算されること', function(){
      game.jieju();
      assert.equal(game._paipu.defen[3], 40000);
    });
    test('牌譜が記録されること', function(){
      assert.deepEqual(game._paipu.defen, [10000,20000,30000,40000]);
      assert.deepEqual(game._paipu.rank, [4,3,2,1]);
      assert.deepEqual(game._paipu.point, [-40,-20,10,50]);
    });
    test('表示処理が呼び出されること', function(){
      assert.deepEqual(game._view._param, {summary: game._paipu});
    });
    test('通知が伝わること', function(done){
      paipu = { jieju: {
          defen:[10000,20000,30000,40000],
          rank:[4,3,2,1],
          point:[-40,-20,10,50]
      }};
      setTimeout(()=>{
        assert.deepEqual(MSG, set_msg(paipu));
        done();
      }, 0);
    });
    test('同点の場合は起家に近い方を上位とすること', function(){
      game = init_game();
      game._model.qijia = 3;
      game._model.defen = [20000, 30000, 20000, 30000];
      game._model.lizhibang = 0;
      game.jieju();
      assert.deepEqual(game._paipu.rank, [3,2,4,1]);
    });
    test('1000点未満のポイントは四捨五入すること', function(){
      game = init_game();
      game._model.defen = [20400, 28500, 20500, 30600];
      game._model.lizhibang = 0;
      game.jieju();
      assert.deepEqual(game._paipu.point, [-30,9,-19,40]);
      game = init_game();
      game._model.defen = [20100, 29300, 20200, 30400];
      game._model.lizhibang = 0;
      game.jieju();
      assert.deepEqual(game._paipu.point, [-30,9,-20,41]);
      game = init_game();
      game._model.defen = [-1500, 83800, 6000, 11700];
      game._model.lizhibang = 0;
      game.jieju();
      assert.deepEqual(game._paipu.point, [-51,93,-34,-8]);
    });
    test('handlerが呼ばれること', function(done){
      game = init_game();
      game._jieju_handler = ()=>{
        assert.ok(1);
        done();
      }
      game.jieju();
    });
  });

  suite('.reply_zimo()', function(){
    let game = init_game({zimo:['m1']});
    test('打牌', function(done){
      game._player[game._model.player_id[0]]._reply[0] = {dapai:'m1_'};
      game.zimo();
      setTimeout(()=>{
        game.next(1);
        setTimeout(()=>{
          assert.ok(last_paipu(game).dapai);
          done();
        }, 0);
      }, 10);
    });
    test('打牌(不正応答)', function(done){
      game = init_game({zimo:['m1']});
      game._player[game._model.player_id[0]]._reply[0] = {dapai:'m2_'};
      game.zimo();
      setTimeout(()=>{
        game.next(1);
        setTimeout(()=>{
          assert.equal(last_paipu(game).dapai.p, 'm1_');
          done();
        }, 0);
      }, 10);
    });
    test('リーチ打牌', function(done){
      game = init_game({shoupai:['m123p456s789z1122'],zimo:['m1']});
      game._player[game._model.player_id[0]]._reply[0] = {dapai:'m1_*'};
      game.zimo();
      setTimeout(()=>{
        game.next(1);
        assert.deepEqual(game._view._param, {say: {lizhi: 0}});
        setTimeout(()=>{
          assert.ok(last_paipu(game).dapai);
          done();
        }, 0);
      }, 10);
    });
    test('リーチ打牌(不正応答)', function(done){
      game = init_game({shoupai:['m123p456s789z1122*'],zimo:['m1']});
      game._player[game._model.player_id[0]]._reply[0] = {dapai:'m1_*'};
      game.zimo();
      setTimeout(()=>{
        game.next(1);
        setTimeout(()=>{
          assert.equal(last_paipu(game).dapai.p, 'm1_');
          done();
        }, 0);
      }, 10);
    });
    test('九種九牌', function(done){
      game = init_game({shoupai:['m133589p1s18z1235'],zimo:['s9']});
      game._player[game._model.player_id[0]]._reply[0] = {pingju:'-'};
      game.zimo();
      setTimeout(()=>{
        game.next(1);
        setTimeout(()=>{
          assert.equal(last_paipu(game).pingju.name, '九種九牌');
          done();
        }, 0);
      }, 10);
    });
    test('九種九牌(不正応答)', function(done){
      game = init_game({shoupai:['m133589p1s28z1235'],zimo:['s9']});
      game._player[game._model.player_id[0]]._reply[0] = {pingju:'-'};
      game.zimo();
      setTimeout(()=>{
        game.next(1);
        setTimeout(()=>{
          assert.equal(last_paipu(game).dapai.p, 's9_');
          done();
        }, 0);
      }, 10);
    });
    test('ツモ和了', function(done){
      game = init_game({shoupai:['m123p456s789z1122'],zimo:['z1']});
      game._player[game._model.player_id[0]]._reply[0] = {hule:'-'};
      game.zimo();
      setTimeout(()=>{
        game.next(1);
        assert.deepEqual(game._view._param, {say: {zimo: 0}});
        setTimeout(()=>{
          assert.ok(last_paipu(game).hule);
          done();
        }, 0);
      }, 10);
    });
    test('ツモ和了(不正応答)', function(done){
      game = init_game({shoupai:['m123p456s789z1122'],zimo:['z3']});
      game._player[game._model.player_id[0]]._reply[0] = {hule:'-'};
      game.zimo();
      setTimeout(()=>{
        game.next(1);
        setTimeout(()=>{
          assert.equal(last_paipu(game).dapai.p, 'z3_');
          done();
        }, 0);
      }, 10);
    });
    test('槓', function(done){
      game = init_game({shoupai:['m1111'],zimo:['p1']});
      game._player[game._model.player_id[0]]._reply[0] = {gang:'m1111'};
      game.zimo();
      setTimeout(()=>{
        game.next(1);
        assert.deepEqual(game._view._param, {say: {gang: 0}});
        setTimeout(()=>{
          assert.ok(last_paipu(game).gang);
          done();
        }, 0);
      }, 10);
    });
    test('槓(不正応答)', function(done){
      game = init_game({shoupai:['m1112'],zimo:['p1']});
      game._player[game._model.player_id[0]]._reply[0] = {gang:'m1111'};
      game.zimo();
      setTimeout(()=>{
        game.next(1);
        setTimeout(()=>{
          assert.equal(last_paipu(game).dapai.p, 'p1_');
          done();
        }, 0);
      }, 10);
    });
    test('応答なし', function(done){
      game = init_game({zimo:['p1']});
      game.zimo();
      setTimeout(()=>{
        game.next(1);
        setTimeout(()=>{
          assert.equal(last_paipu(game).dapai.p, 'p1_');
          done();
        }, 0);
      }, 10);
    });
    test('槓ツモ', function(done){
      game = init_game({shoupai:['m1111'],gangzimo:['m2']});
      game._player[game._model.player_id[0]]._reply[2] = {dapai:'m2_'};
      game.zimo();
      game.gang('m1111');
      game.gangzimo();
      setTimeout(()=>{
        game.next(1);
        setTimeout(()=>{
          assert.ok(last_paipu(game).dapai);
          done();
        }, 0);
      }, 10);
    });
  });

  suite('.reply_dapai()', function(){
    let game = init_game();
    test('応答なし', function(done){
      game.zimo();
      game.dapai(game._model.shoupai[0]._zimo);
      setTimeout(()=>{
        game.next(1);
        setTimeout(()=>{
          assert.ok(last_paipu(game).zimo);
          done();
        }, 0);
      }, 10);
    });
    test('ロン和了', function(done){
      game = init_game({shoupai:['z2','m123p456s789z1122','','']});
      game._player[game._model.player_id[1]]._reply[1] = {hule:'-'};
      game.zimo();
      game.dapai('z2');
      setTimeout(()=>{
        game.next(1);
        assert.deepEqual(game._view._param, {say: {rong: 1}});
        setTimeout(()=>{
          assert.ok(last_paipu(game).hule);
          done();
        }, 0);
      }, 10);
    });
    test('ロン和了(不正応答)', function(done){
      game = init_game({shoupai:['z2','m123p456s789z1122','','']});
      game._player[game._model.player_id[1]]._reply[1] = {hule:'-'};
      game.zimo();
      game._neng_rong[1] = false;
      game.dapai('z2');
      setTimeout(()=>{
        game.next(1);
        setTimeout(()=>{
          assert.ok(last_paipu(game).zimo);
          done();
        }, 0);
      }, 10);
    });
    test('和了牌見逃しでフリテンになること', function(done){
      game = init_game({shoupai:['z2','m123p456s789z1122','','']});
      game.zimo();
      game.dapai('z2');
      setTimeout(()=>{
        game.next(1);
        setTimeout(()=>{
          assert.ok(! game._neng_rong[1]);
          done();
        }, 0);
      }, 10);
    });
    test('ダブロン', function(done){
      game = init_game({shoupai:['m23p456s789z22777','m1',
                                'm23p456s789z11666','']});
      game._player[game._model.player_id[0]]._reply[3] = {hule:'-'};
      game._player[game._model.player_id[2]]._reply[3] = {hule:'-'};
      game.zimo();
      game.dapai(game._model.shoupai[0]._zimo);
      game.zimo();
      game.dapai('m1');
      setTimeout(()=>{
        game.next(1);
        assert.deepEqual(game._view._param, {say: {rong: 0}});
        assert.deepEqual(game._hule, [2,0]);
        done();
      }, 10);
    });
    test('三家和', function(done){
      game = init_game({shoupai:['m4','m40577p66s44z4466',
                            'm1156p345s340567','m2366s789,z222=,m1-23']});
      game._player[game._model.player_id[1]]._reply[1] = {hule:'-'};
      game._player[game._model.player_id[2]]._reply[1] = {hule:'-'};
      game._player[game._model.player_id[3]]._reply[1] = {hule:'-'};
      game.zimo();
      game.dapai('m4');
      setTimeout(()=>{
        game.next(1);
        assert.deepEqual(game._view._param, {say: {rong: 3}});
        setTimeout(()=>{
          assert.equal(last_paipu(game).pingju.name, '三家和');
          done();
        }, 0);
      }, 10);
    });
    test('カン', function(done){
      game = init_game({shoupai:['m1','m1112','','']});
      game._player[game._model.player_id[1]]._reply[1] = {fulou:'m1111-'};
      game.zimo();
      game.dapai('m1');
      setTimeout(()=>{
        game.next(1);
        assert.deepEqual(game._view._param, {say: {gang: 1}});
        setTimeout(()=>{
          assert.deepEqual(last_paipu(game), {fulou:{l:1,m:'m1111-'}});
          done();
        }, 0);
      }, 10);
    });
    test('カン(不正応答)', function(done){
      game = init_game({shoupai:['m1','m1122','','']});
      game._player[game._model.player_id[1]]._reply[1] = {fulou:'m1111-'};
      game.zimo();
      game.dapai('m1');
      setTimeout(()=>{
        game.next(1);
        setTimeout(()=>{
          assert.ok(last_paipu(game).zimo);
          done();
        }, 0);
      }, 10);
    });
    test('ポン', function(done){
      game = init_game({shoupai:['m1','m1112','','']});
      game._player[game._model.player_id[1]]._reply[1] = {fulou:'m111-'};
      game.zimo();
      game.dapai('m1');
      setTimeout(()=>{
        game.next(1);
        assert.deepEqual(game._view._param, {say: {peng: 1}});
        setTimeout(()=>{
          assert.deepEqual(last_paipu(game), {fulou:{l:1,m:'m111-'}});
          done();
        }, 0);
      }, 10);
    });
    test('ポン(不成応答)', function(done){
      game = init_game({shoupai:['m1','m1222','','']});
      game._player[game._model.player_id[1]]._reply[1] = {fulou:'m111-'};
      game.zimo();
      game.dapai('m1');
      setTimeout(()=>{
        game.next(1);
        setTimeout(()=>{
          assert.ok(last_paipu(game).zimo);
          done();
        }, 0);
      }, 10);
    });
    test('チー', function(done){
      game = init_game({shoupai:['m3','m1112','','']});
      game._player[game._model.player_id[1]]._reply[1] = {fulou:'m123-'};
      game.zimo();
      game.dapai('m3');
      setTimeout(()=>{
        game.next(1);
        assert.deepEqual(game._view._param, {say: {chi: 1}});
        setTimeout(()=>{
          assert.deepEqual(last_paipu(game), {fulou:{l:1,m:'m123-'}});
          done();
        }, 0);
      }, 10);
    });
    test('チー(不正応答)', function(done){
      game = init_game({shoupai:['m3','m1113','','']});
      game._player[game._model.player_id[1]]._reply[1] = {fulou:'m123-'};
      game.zimo();
      game.dapai('m3');
      setTimeout(()=>{
        game.next(1);
        setTimeout(()=>{
          assert.ok(last_paipu(game).zimo);
          done();
        }, 0);
      }, 10);
    });
    test('ポンとチーの競合はポンを優先', function(done){
      game = init_game({shoupai:['m1','m2345','m1145','']});
      game._player[game._model.player_id[1]]._reply[1] = {fulou:'m1-23'};
      game._player[game._model.player_id[2]]._reply[1] = {fulou:'m111='};
      game.zimo();
      game.dapai('m1');
      setTimeout(()=>{
        game.next(1);
        assert.deepEqual(game._view._param, {say: {peng: 2}});
        setTimeout(()=>{
          assert.deepEqual(last_paipu(game), {fulou:{l:2,m:'m111='}});
          done();
        }, 0);
      }, 10);
    });
    test('リーチ成立', function(done){
      game = init_game({shoupai:['m123p456s789z1123','','',''],zimo:['z2']});
      game.zimo();
      game.dapai('z3*');
      setTimeout(()=>{
        game.next(1);
        assert.equal(game._model.defen[1], 19000);
        assert.equal(game._model.lizhibang, 3);
        assert.deepEqual(game._view._param, {update: null});
        done();
      }, 10);
    });
    test('リーチ成立(一発消し)', function(done){
      game = init_game({shoupai:['m123p456s789z1123','p11z33','',''],
                        zimo:['z2']});
      game._player[game._model.player_id[1]]._reply[1] = {fulou:'z333-'};
      game.zimo();
      game.dapai('z3*');
      setTimeout(()=>{
        game.next(1);
        assert.equal(game._model.defen[1], 19000);
        assert.equal(game._model.lizhibang, 3);
        assert.deepEqual(game._view._param, {say: {peng: 1}});
        setTimeout(()=>{
          assert.deepEqual(last_paipu(game), {fulou:{l:1,m:'z333-'}});
          done();
        }, 0);
      }, 10);
    });
    test('リーチ不成立', function(done){
      game = init_game({shoupai:['m123p456s789z1123','m789p123s456z666z3',
                                 '',''],zimo:['z2']});
      game._player[game._model.player_id[1]]._reply[1] = {hule:'-'};
      game.zimo();
      game.dapai('z3*');
      setTimeout(()=>{
        game.next(1);
        assert.equal(game._model.defen[1], 20000);
        assert.equal(game._model.lizhibang, 2);
        assert.deepEqual(game._view._param, {say: {rong: 1}});
        done();
      }, 10);
    });
    test('第一ツモ終了', function(done){
      game = init_game();
      for (let l = 0; l < 4; l++) {
        game.zimo();
        game.dapai(game._model.shoupai[game._model.lunban]._zimo);
      }
      setTimeout(()=>{
        game.next(1);
        assert.ok(! game._diyizimo);
        done();
      }, 10);
    });
    test('四風連打', function(done){
      game = init_game({shoupai:['z1','z1','z1','z1']});
      for (let l = 0; l < 4; l++) {
        game.zimo();
        game.dapai('z1');
      }
      setTimeout(()=>{
        game.next(1);
        setTimeout(()=>{
          assert.equal(last_paipu(game).pingju.name, '四風連打');
          done();
        }, 0);
      }, 10);
    });
    test('四家立直', function(done){
      game = init_game({shoupai:['m123p456s789z1122','m456p789s123z3344',
                        'm789p123s456z5566','m123456789p1122'],
                        zimo:['z7','z7','z7','z7']});
      for (let l = 0; l < 4; l++) {
        game.zimo();
        game.dapai('z7_*');
      }
      setTimeout(()=>{
        game.next(1);
        setTimeout(()=>{
          assert.equal(last_paipu(game).pingju.name, '四家立直');
          done();
        }, 0);
      }, 10);
    });
    test('四開槓', function(done){
      game = init_game({shoupai:['m1112,p111+,s111=,z111-','m2223','',''],
                        zimo:['m1'],gangzimo:['p1','s1','z2','z3']});
      game.zimo();
      game.gang('m1111');
      game.gangzimo();
      game.gang('p111+1');
      game.gangzimo();
      game.gang('s111=1');
      game.gangzimo();
      game.dapai('m2');
      game.fulou('m2222-');
      game.gangzimo();
      game.dapai('m3');
      setTimeout(()=>{
        game.next(1);
        setTimeout(()=>{
          assert.equal(last_paipu(game).pingju.name, '四開槓');
          done();
        }, 0);
      }, 10);
    });
    test('1人で四開槓', function(done){
      game = init_game({shoupai:['m1112,p111+,s111=,z111-','','',''],
                        zimo:['m1'],gangzimo:['p1','s1','z1','z2']});
      game.zimo();
      game.gang('m1111');
      game.gangzimo();
      game.gang('p111+1');
      game.gangzimo();
      game.gang('s111=1');
      game.gangzimo();
      game.gang('z111-1');
      game.gangzimo();
      game.dapai('m2');
      setTimeout(()=>{
        game.next(1);
        setTimeout(()=>{
          assert.ok(last_paipu(game).zimo);
          done();
        }, 0);
      }, 10);
    });
  });

  suite('.reply_fulou()', function(){
    let game = init_game({shoupai:['m1','m1112']});
    test('大明槓', function(done){
      game.zimo();
      game.dapai('m1');
      game.fulou('m1111-');
      setTimeout(()=>{
        game.next(1);
        setTimeout(()=>{
          assert.ok(last_paipu(game).gangzimo);
          done();
        }, 0);
      }, 10);
    });
    test('チー・ポン', function(done){
      game = init_game({shoupai:['m1','m1112','']});
      game._player[game._model.player_id[1]]._reply[2] = {dapai:'m2'};
      game.zimo();
      game.dapai('m1');
      game.fulou('m111-');
      setTimeout(()=>{
        game.next(1);
        setTimeout(()=>{
          assert.ok(last_paipu(game).dapai);
          done();
        }, 0);
      }, 10);
    });
    test('チー・ポン(不正応答)', function(done){
      game = init_game({shoupai:['m1','m1112','']});
      game._player[game._model.player_id[1]]._reply[2] = {dapai:'m3'};
      game.zimo();
      game.dapai('m1');
      game.fulou('m111-');
      setTimeout(()=>{
        game.next(1);
        setTimeout(()=>{
          assert.equal(last_paipu(game).dapai.p, 'm2');
          done();
        }, 0);
      }, 10);
    });
    test('チー・ポン(応答なし)', function(done){
      game = init_game({shoupai:['m1','m1112','']});
      game.zimo();
      game.dapai('m1');
      game.fulou('m111-');
      setTimeout(()=>{
        game.next(1);
        setTimeout(()=>{
          assert.equal(last_paipu(game).dapai.p, 'm2');
          done();
        }, 0);
      }, 10);
    });
  });

  suite('.reply_gang()', function(){
    let game = init_game({shoupai:['m1,m111=','','','']});
    test('応答なし', function(done){
      game.zimo();
      game.gang('m111=1');
      setTimeout(()=>{
        game.next(1);
        setTimeout(()=>{
          assert.ok(last_paipu(game).gangzimo);
          done();
        }, 0);
      }, 10);
    });
    test('暗槓に槍槓子はできない', function(done){
      game = init_game({shoupai:['m1111','m24p456s789z11122','','']});
      game._player[game._model.player_id[1]]._reply[1] = {hule:'-'};
      game.zimo();
      game.gang('m1111');
      setTimeout(()=>{
        game.next(1);
        setTimeout(()=>{
          assert.ok(last_paipu(game).kaigang);
          done();
        }, 0);
      }, 10);
    });
    test('ロン和了(槍槓)', function(done){
      game = init_game({shoupai:['m1,m111=','m23p456s789z11122','','']});
      game._player[game._model.player_id[1]]._reply[1] = {hule:'-'};
      game.zimo();
      game.gang('m111=1');
      setTimeout(()=>{
        game.next(1);
        assert.deepEqual(game._view._param, {say: {rong: 1}});
        setTimeout(()=>{
          assert.ok(last_paipu(game).hule);
          done();
        }, 0);
      }, 10);
    });
    test('ロン和了(不正応答)', function(done){
      game = init_game({shoupai:['m1,m111=','m24p456s789z11122','','']});
      game._player[game._model.player_id[1]]._reply[1] = {hule:'-'};
      game.zimo();
      game.gang('m111=1');
      setTimeout(()=>{
        game.next(1);
        setTimeout(()=>{
          assert.ok(last_paipu(game).gangzimo);
          done();
        }, 0);
      }, 10);
    });
    test('ダブロン', function(done){
      game = init_game({shoupai:['m1,m111=','m23p456s789z11122',
                        'm23p789s456z33344','']});
      game._player[game._model.player_id[1]]._reply[1] = {hule:'-'};
      game._player[game._model.player_id[2]]._reply[1] = {hule:'-'};
      game.zimo();
      game.gang('m111=1');
      setTimeout(()=>{
        game.next(1);
        assert.deepEqual(game._hule, [1,2]);
        assert.deepEqual(game._view._param, {say: {rong: 2}});
        done();
      }, 10);
    });
    test('三家和', function(done){
      game = init_game({shoupai:['m1,m111=','m23p456s789z11122',
                        'm23p789s456z33344','m23p456s789z55566']});
      game._player[game._model.player_id[1]]._reply[1] = {hule:'-'};
      game._player[game._model.player_id[2]]._reply[1] = {hule:'-'};
      game._player[game._model.player_id[3]]._reply[1] = {hule:'-'};
      game.zimo();
      game.gang('m111=1');
      setTimeout(()=>{
        game.next(1);
        assert.deepEqual(game._hule, [1,2,3]);
        assert.deepEqual(game._view._param, {say: {rong: 3}});
        setTimeout(()=>{
          assert.equal(last_paipu(game).pingju.name, '三家和');
          done();
        }, 0);
      }, 10);
    });
    test('和了牌見逃しでフリテンになること', function(done){
      game = init_game({shoupai:['z2、z222=','m123p456s789z1122','','']});
      game.zimo();
      game.gang('z222=2');
      setTimeout(()=>{
        game.next(1);
        setTimeout(()=>{
          assert.ok(! game._neng_rong[1]);
          done();
        }, 0);
      }, 10);
    });
  });

  suite('.reply_hule()', function(){
    let game = init_game({shoupai:['m123p456s11789z11'],
                          zimo:['s1'],baopai:'m3'});
    test('和了収支が反映されること', function(done){
      game._diyizimo = false;
      game.zimo();
      game.hule();
      setTimeout(()=>{
        game.next(1);
        assert.deepEqual(game._model.defen,[9200,24400,29200,37200]);
        done();
      }, 10);
    });
    test('供託リーチ棒が回収されること', function(){
      assert.equal(game._model.lizhibang, 0);
    });
    test('親の和了の場合、積み場が加算されること', function(){
      assert.equal(game._model.changbang, 2);
    });
    test('子の和了の場合、積み場がなくなること', function(done){
      game = init_game({shoupai:['z2','m123p456s11789z22'],baopai:'m3'});
      game.zimo();
      game.dapai('z2');
      game._hule = [1];
      game.hule();
      setTimeout(()=>{
        game.next(1);
        assert.equal(game._model.lizhibang, 0);
        assert.equal(game._model.changbang, 0);
        done();
      }, 10);
    });
    test('親子でダブロンし、子が頭ハネした場合', function(done){
      game = init_game({shoupai:['m23p456s789z11555','m1',
                        'm23p789s456z22666'],baopai:'m3'});
      game.zimo();
      game.dapai(game._model.shoupai[0]._zimo);
      game.zimo();
      game.dapai('m1');
      game._hule = [2,0];
      game.hule();
      setTimeout(()=>{
        game.next(1);
        assert.deepEqual(game._model.defen, [10000,20000,28400,41600]);
        assert.equal(game._model.lizhibang, 0);
        assert.equal(game._model.changbang, 0);
        setTimeout(()=>{
          game.next(1);
          assert.deepEqual(game._model.defen, [10000,22000,26400,41600]);
          assert.equal(game._model.lizhibang, 0);
          assert.equal(game._model.changbang, 2);
          done();
        }, 10);
      }, 10);
    });
  });

  suite('.reply_pingju()', function(){
    let game = init_game({shoupai:['m123p456s789z1122','','',''],
                          zimo:['m2','m2','m4','m5']});
    test('流局収支が反映されること', function(done){
      for (let l = 0; l < 4; l++) {
        game.zimo();
        game.dapai(game._model.shoupai[l]._zimo)
      }
      game.pingju('荒牌平局');
      setTimeout(()=>{
        game.next(1);
        assert.deepEqual(game._model.defen, [9000,23000,29000,37000]);
        done();
      }, 10);
    });
    test('供託リーチ棒が残されること', function(){
      assert.equal(game._model.lizhibang, 2);
    });
    test('積み場が加算されること', function(){
      assert.equal(game._model.changbang, 2);
    });
  });

  suite('.reply_jieju()', function(){
    let game = init_game();
    test('callbackが呼ばれること', function(done){
      game._callback = ()=>{
        assert.ok(1);
        done();
      }
      game.jieju();
      setTimeout(()=>{
        game.next(1);
      }, 10);
    });
    test('callbackがない場合は停止すること', function(done){
      game = init_game();
      game.jieju();
      setTimeout(()=>{
        game.next(1);
        setTimeout(()=>{
          assert.ok(1);
          done();
        }, 0);
      }, 10);
    });
  });

  suite('.get_dapai()', function(){
    test('現在の手番の可能な打牌を返すこと', function(){
      let game = init_game({shoupai:['m123,z111+,z222=,z333-'], zimo:['m1']});
      game.zimo();
      assert.deepEqual(game.get_dapai(), ['m1','m2','m3','m1_']);
    });
  });

  suite('.get_chi_mianzi(l)', function(){
    test('チー可能な面子を返すこと', function(){
      let game = init_game({shoupai:['','m1234p456s789z111'], zimo:['m2']});
      game.zimo();
      game.dapai('m2_')
      assert.deepEqual(game.get_chi_mianzi(1), ['m12-3','m2-34']);
    });
    test('対面はチーできないこと', function(){
      let game = init_game({shoupai:['','','m1234p456s789z111'], zimo:['m2']});
      game.zimo();
      game.dapai('m2_')
      assert.deepEqual(game.get_chi_mianzi(2), []);
    });
    test('ハイテイ牌はチーできないこと', function(){
      let game = init_game({shoupai:['','m1234p456s789z111'], zimo:['m2']});
      game.zimo();
      while (game._model.shan.paishu()) { game._model.shan.zimo() }
      game.dapai('m2_')
      assert.deepEqual(game.get_chi_mianzi(1), []);
    });
  });

  suite('.get_peng_mianzi(l)', function(){
    test('ポン可能な面子を返すこと', function(){
      let game = init_game({shoupai:['','','m1123p456s789z111'], zimo:['m1']});
      game.zimo();
      game.dapai('m1_')
      assert.deepEqual(game.get_peng_mianzi(2), ['m111=']);
    });
    test('ハイテイ牌はポンできないこと', function(){
      let game = init_game({shoupai:['','','m1123p456s789z111'], zimo:['m1']});
      game.zimo();
      while (game._model.shan.paishu()) { game._model.shan.zimo() }
      game.dapai('m1_')
      assert.deepEqual(game.get_peng_mianzi(2), []);
    });
  });

  suite('.get_gang_mianzi(l)', function(){
    test('大明槓可能な面子を返すこと', function(){
      let game = init_game({shoupai:['','','','m123p055s789z1122'],
                            zimo:['p5']});
      game.zimo();
      game.dapai('p5_')
      assert.deepEqual(game.get_gang_mianzi(3), ['p5505+']);
    });
    test('ハイテイ牌は大明槓できないこと', function(){
      let game = init_game({shoupai:['','','','m123p055s789z1122'],
                            zimo:['p5']});
      game.zimo();
      while (game._model.shan.paishu()) { game._model.shan.zimo() }
      game.dapai('p5_')
      assert.deepEqual(game.get_gang_mianzi(3), []);
    });
    test('暗槓・加槓可能な面子を返すこと', function(){
      let game = init_game({shoupai:['m123p0555s789,z111='], zimo:['z1']});
      game.zimo();
      assert.deepEqual(game.get_gang_mianzi(), ['p5550','z111=1']);
    });
    test('ハイテイ牌は暗槓・加槓できないこと', function(){
      let game = init_game({shoupai:['m123p0555s789,z111='], zimo:['z1']});
      game.zimo();
      while (game._model.shan.paishu()) { game._model.shan.zimo() }
      assert.deepEqual(game.get_gang_mianzi(), []);
    });
  });

  suite('.allow_lizhi(p)', function(){
    test('指定した牌でリーチ可能な場合、真を返すこと', function(){
      let game = init_game({shoupai:['m123p456s788z1122'], zimo:['z1']});
      game.zimo();
      assert.ok(game.allow_lizhi('s8'));
    });
    test('牌を指定しない場合、リーチ可能な牌の一覧を返すこと', function(){
      let game = init_game({shoupai:['m123p456s788z1122'], zimo:['z1']});
      game.zimo();
      assert.deepEqual(game.allow_lizhi(), ['s7','s8']);
    });
    test('ツモ番がない場合、リーチできないこと', function(){
      let game = init_game({shoupai:['m123p456s788z1122'], zimo:['z1']});
      game.zimo();
      while (game._model.shan.paishu() >= 4) { game._model.shan.zimo() }
      assert.ok(! game.allow_lizhi());
    });
    test('持ち点が1000点に満たない場合、リーチできないこと', function(){
      let game = init_game({shoupai:['m123p456s788z1122'], zimo:['z1']});
      game.zimo();
      game._model.defen[1] = 900;
      assert.ok(! game.allow_lizhi());
    });
  });

  suite('.allow_hule(l)', function(){
    test('ロン和了', function(){
      let game = init_game({shoupai:['','m123p456s789z1,z222='],zimo:['z1']});
      game.zimo();
      game.dapai('z1_');
      assert.ok(game.allow_hule(1));
    });
    test('リーチのみロン和了', function(){
      let game = init_game({shoupai:['','m123p456s789z1122*'],zimo:['z1']});
      game.zimo();
      game.dapai('z1_');
      assert.ok(game.allow_hule(1));
    });
    test('槍槓のみロン和了', function(){
      let game = init_game({shoupai:['p1,m111=','m23p456s789z11122'],
                            zimo:['m1']});
      game.zimo();
      game.gang('m111=1');
      assert.ok(game.allow_hule(1));
    });
    test('ハイテイのみロン和了', function(){
      let game = init_game({shoupai:['','m123p456s789z1122'],zimo:['z1']});
      game.zimo();
      while (game._model.shan.paishu()) { game._model.shan.zimo() }
      game.dapai('z1_');
      assert.ok(game.allow_hule(1));
    });
    test('フリテンはロン和了できない', function(){
      let game = init_game({shoupai:['','m123p456s789z1,z222='],zimo:['z1']});
      game.zimo();
      game._neng_rong[1] = false;
      game.dapai('z1_');
      assert.ok(! game.allow_hule(1));
    });
    test('ツモ和了', function(){
      let game = init_game({shoupai:['m123p456s789z1333'],zimo:['z1']});
      game.zimo();
      assert.ok(game.allow_hule());
    });
    test('嶺上開花のみツモ和了', function(){
      let game = init_game({shoupai:['m123p456s789z1,z333='],
                            zimo:['z3'],gangzimo:['z1']});
      game.zimo();
      game.gang('z333=3');
      game.gangzimo();
      assert.ok(game.allow_hule());
    });
    test('ハイテイのみツモ和了', function(){
      let game = init_game({shoupai:['m123p456s789z1,z333='],zimo:['z1']});
      game.zimo();
      while (game._model.shan.paishu()) { game._model.shan.zimo() }
      assert.ok(game.allow_hule());
    });
  });

  suite('.allow_pingju()', function(){
    test('九種九牌', function(){
      let game = init_game({shoupai:['m123456z1234567'],zimo:['p1']});
      game.zimo();
      assert.ok(game.allow_pingju());
    });
    test('第一ツモ以降は九種九牌にならない', function(){
      let game = init_game({shoupai:['m123456z1234567'],zimo:['p1']});
      game.zimo();
      game._diyizimo = false;
      assert.ok(! game.allow_pingju());
    });
  });

  suite('get_dapai(shoupai)', function(){
    test('打牌可能でない場合、空配列を返す', function(){
      let shoupai = Majiang.Shoupai.fromString('m123p456s789z1122');
      assert.deepEqual(Majiang.Game.get_dapai(shoupai), []);
    });
    test('リーチ後はツモ切り', function(){
      let shoupai = Majiang.Shoupai.fromString('m123p456s789z1122z3*');
      assert.deepEqual(Majiang.Game.get_dapai(shoupai), ['z3_']);
    });
    test('手出し・ツモ切りは区別する', function(){
      let shoupai = Majiang.Shoupai.fromString('m123p456s99,z111+,z222-');
      assert.deepEqual(Majiang.Game.get_dapai(shoupai),
                        ['m1','m2','m3','p4','p5','p6','s9','s9_']);
      shoupai = Majiang.Shoupai.fromString('m123p456s89,z111+,z222-');
      assert.deepEqual(Majiang.Game.get_dapai(shoupai),
                        ['m1','m2','m3','p4','p5','p6','s8','s9_']);
    });
    test('副露直後はツモ切りはない', function(){
      let shoupai = Majiang.Shoupai.fromString('m123p456s99,z111+,z222-,');
      assert.deepEqual(Majiang.Game.get_dapai(shoupai),
                        ['m1','m2','m3','p4','p5','p6','s9']);
    });
  });

  suite('get_chi_mianzi(shoupai, p, paishu)', function(){
    test('打牌可能な場合、空配列を返す', function(){
      let shoupai = Majiang.Shoupai.fromString('m123p456s789z11223');
      assert.deepEqual(Majiang.Game.get_chi_mianzi(shoupai, 'm1-', 1), []);
    });
    test('リーチ後はチーできない', function(){
      let shoupai = Majiang.Shoupai.fromString('m123p456s789z1122*');
      assert.deepEqual(Majiang.Game.get_chi_mianzi(shoupai, 'm1-', 1), []);
    });
    test('ハイテイ牌はチーできない', function(){
      let shoupai = Majiang.Shoupai.fromString('m123p456s789z1122');
      assert.deepEqual(Majiang.Game.get_chi_mianzi(shoupai, 'm1-', 0), []);
    });
    test('チー可能な組合せを全て返す', function(){
      let shoupai = Majiang.Shoupai.fromString('m1234567,z111+,z222-');
      assert.deepEqual(Majiang.Game.get_chi_mianzi(shoupai, 'm3-', 1),
                                                ['m123-','m23-4','m3-45']);
    });
  });

  suite('get_peng_mianzi(shoupai, p, paishu)', function(){
    test('打牌可能な場合、空配列を返す', function(){
      let shoupai = Majiang.Shoupai.fromString('m123p456s789z11223');
      assert.deepEqual(Majiang.Game.get_peng_mianzi(shoupai, 'z1+', 1), []);
    });
    test('リーチ後はポンできない', function(){
      let shoupai = Majiang.Shoupai.fromString('m123p456s789z1122*');
      assert.deepEqual(Majiang.Game.get_peng_mianzi(shoupai, 'z1+', 1), []);
    });
    test('ハイテイ牌はポンできない', function(){
      let shoupai = Majiang.Shoupai.fromString('m123p456s789z1122');
      assert.deepEqual(Majiang.Game.get_peng_mianzi(shoupai, 'z1+', 0), []);
    });
    test('ポン可能な組合せを全て返す', function(){
      let shoupai = Majiang.Shoupai.fromString('m123z1112,p45-6,s789-');
      assert.deepEqual(Majiang.Game.get_peng_mianzi(shoupai, 'z1+', 1),
                                                                ['z111+']);
    });
  });

  suite('get_gang_mianzi(shoupai, p, paishu)', function(){
    test('ハイテイ牌はカンできない', function(){
      let shoupai = Majiang.Shoupai.fromString('m111p456s789z1122');
      assert.deepEqual(Majiang.Game.get_gang_mianzi(shoupai, 'm1=', 0), []);
    });
    test('打牌可能な場合、大明槓できない', function(){
      let shoupai = Majiang.Shoupai.fromString('m111p456s789z11223');
      assert.deepEqual(Majiang.Game.get_gang_mianzi(shoupai, 'm1=', 1), []);
    });
    test('リーチ後は大明槓できない', function(){
      let shoupai = Majiang.Shoupai.fromString('m111p456s789z1122*');
      assert.deepEqual(Majiang.Game.get_gang_mianzi(shoupai, 'm1=', 1), []);
    });
    test('大明槓可能な組合せを全て返す', function(){
      let shoupai = Majiang.Shoupai.fromString('m111p456s789z1122');
      assert.deepEqual(Majiang.Game.get_gang_mianzi(shoupai, 'm1=', 1),
                                                                ['m1111=']);
    });
    test('打牌可能でない場合、暗槓・加槓はできない', function(){
      let shoupai = Majiang.Shoupai.fromString('m1111p456s789z112');
      assert.deepEqual(Majiang.Game.get_gang_mianzi(shoupai, '', 1), []);
    });
    test('副露直後は暗槓・加槓はできない', function(){
      let shoupai = Majiang.Shoupai.fromString('m1111p456z112,s789-,');
      assert.deepEqual(Majiang.Game.get_gang_mianzi(shoupai, '', 1), []);
    });
    test('リーチ後も暗槓は許可する', function(){
      let shoupai = Majiang.Shoupai.fromString('m2223555p345s345m0*');
      assert.deepEqual(Majiang.Game.get_gang_mianzi(shoupai, '', 1), ['m5550']);
    });
    test('リーチ後の送りカンは禁止', function(){
      let shoupai = Majiang.Shoupai.fromString('m111123s789z1122m4*');
      assert.deepEqual(Majiang.Game.get_gang_mianzi(shoupai, '', 1), []);
    });
    test('リーチ後の待ちの変わるカンは禁止', function(){
      let shoupai = Majiang.Shoupai.fromString('m1112s789z111222m1*');
      assert.deepEqual(Majiang.Game.get_gang_mianzi(shoupai, '', 1), []);
    });
    test('暗槓・加槓可能な組合せを全て返す', function(){
      let shoupai = Majiang.Shoupai.fromString('m1111p2222s33z1,z111=');
      assert.deepEqual(Majiang.Game.get_gang_mianzi(shoupai, '', 1),
                                                    ['m1111','p2222','z111=1']);
    });
  });

  suite('allow_lizhi(shoupai, p, paishu, defen)', function(){
    test('打牌できない場合、リーチはできない', function(){
      let shoupai = Majiang.Shoupai.fromString('m123p456s789z1122');
      assert.ok(! Majiang.Game.allow_lizhi(shoupai));
    });
    test('すでにリーチしている場合、リーチはできない', function(){
      let shoupai = Majiang.Shoupai.fromString('m123p456s789z11223*');
      assert.ok(! Majiang.Game.allow_lizhi(shoupai));
    });
    test('メンゼンでない場合、リーチはできない', function(){
      let shoupai = Majiang.Shoupai.fromString('m123p456s789z23,z111=');
      assert.ok(! Majiang.Game.allow_lizhi(shoupai));
    });
    test('ツモ番がない場合、リーチはできない', function(){
      let shoupai = Majiang.Shoupai.fromString('m123p456s789z11223');
      assert.ok(! Majiang.Game.allow_lizhi(shoupai, 'z3', 3));
    });
    test('持ち点が1000点に満たない場合、リーチはできない', function(){
      let shoupai = Majiang.Shoupai.fromString('m123p456s789z11223');
      assert.ok(! Majiang.Game.allow_lizhi(shoupai, 'z3', 4, 900));
    });
    test('テンパイしていない場合、リーチはできない', function(){
      let shoupai = Majiang.Shoupai.fromString('m123p456s789z11234');
      assert.ok(! Majiang.Game.allow_lizhi(shoupai));
    });
    test('形式テンパイと認められない牌姿でリーチはできない', function(){
      let shoupai = Majiang.Shoupai.fromString('m123p456s789z11112');
      assert.ok(! Majiang.Game.allow_lizhi(shoupai, 'z2'));
    });
    test('指定された打牌でリーチ可能な場合、真を返すこと', function(){
      let shoupai = Majiang.Shoupai.fromString('m123p456s789z11112');
      assert.ok(Majiang.Game.allow_lizhi(shoupai, 'z1'));
    });
    test('打牌が指定されていない場合、リーチ可能な打牌一覧を返すこと', function(){
      let shoupai = Majiang.Shoupai.fromString('m123p456s788z11122');
      assert.deepEqual(Majiang.Game.allow_lizhi(shoupai), ['s7','s8']);
      shoupai = Majiang.Shoupai.fromString('m123p456s789z11223');
      assert.deepEqual(Majiang.Game.allow_lizhi(shoupai), ['z3_']);
    });
    test('リーチ可能な打牌がない場合、偽を返すこと', function(){
      let shoupai = Majiang.Shoupai.fromString('m11112344449999');
      assert.ok(! Majiang.Game.allow_lizhi(shoupai));
    });
  });

  suite('allow_hule(shoupai, p, zhuangfeng, menfeng, hupai, neng_rong)',
        function(){
    test('フリテンの場合、ロン和了できない', function(){
      let shoupai = Majiang.Shoupai.fromString('m123p456z1122,s789-');
      assert.ok(! Majiang.Game.allow_hule(shoupai, 'z1=', 0, 1, false, false));
    });
    test('和了形になっていない場合、和了できない', function(){
      let shoupai = Majiang.Shoupai.fromString('m123p456z11223,s789-');
      assert.ok(! Majiang.Game.allow_hule(shoupai, null, 0, 1, false, true));
    });
    test('役あり和了形の場合、和了できる', function(){
      let shoupai = Majiang.Shoupai.fromString('m123p456s789z3377');
      assert.ok(Majiang.Game.allow_hule(shoupai, 'z3+', 0, 1, true, true));
    });
    test('役なし和了形の場合、和了できない', function(){
      let shoupai = Majiang.Shoupai.fromString('m123p456s789z3377');
      assert.ok(! Majiang.Game.allow_hule(shoupai, 'z3+', 0, 1, false, true));
    });
    test('ツモ和了', function(){
      let shoupai = Majiang.Shoupai.fromString('m123p456s789z33377');
      assert.ok(Majiang.Game.allow_hule(shoupai, null, 0, 1, false, false));
    });
    test('ロン和了', function(){
      let shoupai = Majiang.Shoupai.fromString('m123p456z1122,s789-');
      assert.ok(Majiang.Game.allow_hule(shoupai, 'z1=', 0, 1, false, true));
    });
  });

  suite('allow_pingju(shoupai, diyizimo)', function(){
    test('第一ツモでない場合、九種九牌とならない', function(){
      let shoupai = Majiang.Shoupai.fromString('m1234569z1234567');
      assert.ok(! Majiang.Game.allow_pingju(shoupai, false));
    });
    test('八種九牌は流局にできない', function(){
      let shoupai = Majiang.Shoupai.fromString('m1234567z1234567');
      assert.ok(! Majiang.Game.allow_pingju(shoupai, true));
    });
    test('九種九牌', function(){
      let shoupai = Majiang.Shoupai.fromString('m1234569z1234567');
      assert.ok(Majiang.Game.allow_pingju(shoupai, true));
    });
  });

  suite('シナリオ通りに局が進むこと', function(){
    for (let paipu of script) {
      test(paipu.title, function(){
        let game = new Majiang.Dev.Game(
                        JSON.parse(JSON.stringify(paipu))).do_test();
        assert.deepEqual(paipu, game._paipu);
      });
    }
  });
});
