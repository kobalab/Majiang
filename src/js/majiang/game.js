/*
 *  Majiang.Game
 */
"use strict";

const Majiang = {
    Shan:    require('./shan'),
    Shoupai: require('./shoupai'),
    He:      require('./he'),
    Util:    require('./util')
};

module.exports = class Game {

constructor() {

    this._model = {
        title:      new Date().toLocaleString(),
        player:     ['私','下家','対面','上家'],
        qijia:      Math.floor(Math.random() * 4),
        zhuangfeng: 0,
        jushu:      0,
        changbang:  0,
        lizhibang:  0,
        defen:      [25000, 25000, 25000, 25000],
        shan:       null,
        shoupai:    [],
        he:         [],
        player_id:  [0, 1, 2, 3]
    };

    this._player = [];

    this._hongpai = { m: 1, p: 1, s: 1 };
    this._ranking_point = [20, 10, -10, -20];

    this._reply = [];

    this._speed = 3;
    this._stop  = false;
    this._delay = 0;
}

stop() {
    this._stop = true;
    this._timeout_id = clearTimeout(this._timeout_id);
}

start() {
    this._stop = false;
    if (! this._timeout_id) this._timeout_id = setTimeout(()=>this.next(), 0);
}

delay(callback, timeout) {

    timeout = this._speed == 0 ? 0
            : timeout == null  ? Math.max(500, this._speed * 200)
            :                    timeout
    setTimeout(callback, timeout);
}

notify_players(type, msg) {

    for (let l = 0; l < 4; l++) {
        setTimeout(()=>{
            this ._player[this._model.player_id[l]].action(msg[l]);
        }, 0);
    }
}

call_players(type, msg, timeout) {

    timeout = (! this._speed || timeout == null) ? this._speed * 200 : timeout;

    this._status = type;
    this._reply  = [];
    for (let l = 0; l < 4; l++) {
        let id = this._model.player_id[l];
        setTimeout(()=>{
            this._player[id].action(
                msg[l],
                reply => this.reply(id, reply)
            );
        }, 0);
    }
    this._timeout_id = setTimeout(()=>this.next(), timeout);
}

reply(id, reply = {}) {
    this._reply[id] = reply;
    if (this._reply.filter(x=>x).length < 4) return;
    if (! this._timeout_id) this._timeout_id = setTimeout(()=>this.next(), 0);
}

add_paipu(paipu) {
    this._paipu.log[this._paipu.log.length - 1].push(paipu);
}

kaiju() {

    if(this._view) this._view.kaiju();

    this._paipu = {
        title:  this._model.title,
        player: this._model.player.concat(),
        qijia:  this._model.qijia,
        log:    []
    };

    this._status = null;

    let msg = [];
    for (let id = 0; id < 4; id++) {
        msg[id] = JSON.parse(JSON.stringify({
            kaiju: {
                player:  this._paipu.player,
                qijia:   this._paipu.qijia,
                hongpai: this._hongpai
            }
        }));
    }
    this.notify_players('kaiju', msg);

    if (! this._stop) this.qipai();
}

qipai(shan) {

    let model = this._model;

    model.shan = shan || new Majiang.Shan(this._hongpai);
    let qipai = [ [], [], [], []];
    for (let l = 0; l < 4; l++) {
        for (let i = 0; i < 13; i++) {
            qipai[l].push(model.shan.zimo());
        }
        model.shoupai[l]   = new Majiang.Shoupai(qipai[l]);
        model.he[l]        = new Majiang.He();
        model.player_id[l] = (model.qijia + model.jushu + l) % 4;
    }
    model.lunban = -1;

    this._diyizimo = true;
    this._fengpai  = true;

    this._dapai    = null;
    this._gang     = null;

    this._lizhi    = [0,0,0,0];
    this._yifa     = [0,0,0,0];
    this._n_gang   = [0,0,0,0];
    this._hule     = [];

    this._no_game    = true;
    this._lianzhuang = false;
    this._changbang  = model.changbang;

    this._paipu.log.push([]);
    let paipu = {
        qipai: {
            zhuangfeng: model.zhuangfeng,
            jushu:      model.jushu,
            changbang:  model.changbang,
            lizhibang:  model.lizhibang,
            defen:      model.player_id.map(id => model.defen[id]),
            baopai:     model.shan.baopai()[0],
            shoupai:    model.shoupai.map(s => s.toString())
        }
    };
    this.add_paipu(paipu);

    let msg = [];
    for (let l = 0; l < 4; l++) {
        msg[l] = JSON.parse(JSON.stringify(paipu));
        for (let i = 0; i < 4; i++) {
            if (i != l) msg[l].qipai.shoupai[i] = '';
        }
    }
    this.notify_players('qipai', msg);

    if (this._view) this._view.redraw();

    if (! this._stop) this.zimo();
}

zimo() {

    let model = this._model;

    if (model.shan.paishu() == 0) {
        this.delay(()=>this.pingju('荒牌平局'), 0);
        return;
    }

    model.lunban = (model.lunban + 1) % 4;

    let zimo = model.shan.zimo();
    model.shoupai[model.lunban].zimo(zimo);

    let paipu = { zimo: { l: model.lunban, p: zimo } };
    this.add_paipu(paipu);

    let msg = [];
    for (let l = 0; l < 4; l++) {
        msg[l] = JSON.parse(JSON.stringify(paipu));
        if (l != model.lunban) msg[l].zimo.p = '';
    }
    this.call_players('zimo', msg);

    if (this._view) this._view.update(paipu);
}

dapai(dapai) {

    let model = this._model;

    this._yifa[model.lunban] = 0;

    model.shoupai[model.lunban].dapai(dapai);
    model.he[model.lunban].dapai(dapai);

    if (this._diyizimo) {
        if (! dapai.match(/^z[1234]/))  this._fengpai = false;
        if (this._dapai && this._dapai.substr(0,2) != dapai.substr(0,2))
                                        this._fengpai = false;
    }
    else                                this._fengpai = false;

    if (dapai.substr(-1) == '*') {
        this._lizhi[model.lunban] = this._diyizimo ? 2 : 1;
        this._yifa[model.lunban]  = 1;
    }

    this._dapai = dapai;

    let paipu = { dapai: { l: model.lunban, p: dapai } };
    this.add_paipu(paipu);

    if (this._gang) this.kaigang();

    let msg = [];
    for (let l = 0; l < 4; l++) {
        msg[l] = JSON.parse(JSON.stringify(paipu));
    }
    this.call_players('dapai', msg);

    if (this._view) this._view.update(paipu);
}

fulou(fulou) {

    let model = this._model;

    this._diyizimo = false;
    this._yifa     = [0,0,0,0];

    let d = fulou.match(/[\-\=\+]/)[0];
    model.he[model.lunban].fulou(d);

    model.lunban = (model.lunban + { '-': 1, '=': 2, '+': 3 }[d]) % 4;
    model.shoupai[model.lunban].fulou(fulou);

    if (fulou.match(/^[mpsz]\d{4}/)) {
        this._gang = fulou;
        this._n_gang[model.lunban]++;
    }

    let paipu = { fulou: { l: model.lunban, m: fulou } };
    this.add_paipu(paipu);

    let msg = [];
    for (let l = 0; l < 4; l++) {
        msg[l] = JSON.parse(JSON.stringify(paipu));
    }
    this.call_players('fulou', msg);

    if (this._view) this._view.update(paipu);
}

gang(gang) {

    let model = this._model;

    let p = (gang.match(/^[mpsz]\d{4}$/))
                ? gang.replace(/0/,'5').substr(0,2)
                : gang[0] + gang.substr(-1)
    model.shoupai[model.lunban].gang(p);

    this._n_gang[model.lunban]++;

    let paipu = { gang: { l: model.lunban, m: gang } };
    this.add_paipu(paipu);

    if (this._gang) this.kaigang();

    this._gang = gang;

    let msg = [];
    for (let l = 0; l < 4; l++) {
        msg[l] = JSON.parse(JSON.stringify(paipu));
    }
    this.call_players('gang', msg);

    if (this._view) this._view.update(paipu);
}

gangzimo() {

    let model = this._model;

    this._diyizimo = false;
    this._yifa     = [0,0,0,0];

    let zimo = model.shan.gangzimo();
    model.shoupai[model.lunban].zimo(zimo);

    let paipu = { gangzimo: { l: model.lunban, p: zimo } };
    this.add_paipu(paipu);

    if (this._gang.match(/^[mpsz]\d{4}$/)) this.kaigang();

    let msg = [];
    for (let l = 0; l < 4; l++) {
        msg[l] = JSON.parse(JSON.stringify(paipu));
        if (l != model.lunban) msg[l].gangzimo.p = '';
    }
    this.call_players('gangzimo', msg);

    if (this._view) this._view.update(paipu);
}

kaigang() {

    let model = this._model;

    this._gang = null;

    model.shan.kaigang();
    let baopai = model.shan.baopai().pop();

    let paipu = { kaigang: { baopai: baopai } };
    this.add_paipu(paipu);

    let msg = [];
    for (let l = 0; l < 4; l++) {
        msg[l] = JSON.parse(JSON.stringify(paipu));
    }
    this.notify_players('kaigang', msg);

    if (this._view) this._view.update(paipu);
}

hule() {

    let model = this._model;

    this._no_game = false;

    if (this._status != 'hule') {
        this._hule_option = this._status == 'gang'     ? 'qianggang'
                          : this._status == 'gangzimo' ? 'lingshang'
                          :                              null;
    }

    let menfeng = (this._hule.length) ? this._hule.shift() : model.lunban;
    let rongpai;
    if (menfeng != model.lunban) {
        rongpai = (this._hule_option == 'qianggang'
                        ? this._gang[0] + this._gang.substr(-1)
                        : this._dapai.substr(0,2)               )
                + ['','+','=','-'][(4 + model.lunban - menfeng) % 4];
    }
    let fubaopai = this._lizhi[menfeng] ? model.shan.fubaopai() : null;
    let shoupai  = model.shoupai[menfeng].clone();
    if (rongpai) shoupai.zimo(rongpai);

    let param = {
        zhuangfeng:     model.zhuangfeng,
        menfeng:        menfeng,
        hupai: {
            lizhi:      this._lizhi[menfeng],
            yifa:       this._yifa[menfeng],
            qianggang:  this._hule_option == 'qianggang',
            lingshang:  this._hule_option == 'lingshang',
            haidi:      (model.shan.paishu() > 0
                        || this._hule_option == 'lingshang') ? 0
                                : ! rongpai                  ? 1
                                :                              2,
            tianhu:     ! (this._diyizimo && ! rongpai)      ? 0
                                : menfeng == 0               ? 1
                                :                              2
        },
        baopai:         model.shan.baopai(),
        fubaopai:       fubaopai,
        jicun:          { changbang: model.changbang,
                          lizhibang: model.lizhibang }
    };
    let hule = Majiang.Util.hule(shoupai, rongpai, param);

    if (menfeng == 0) this._lianzhuang = true;
    this._fenpei = hule.fenpei;

    let paipu = {
        hule: {
            l:          menfeng,
            shoupai:    shoupai.toString(),
            baojia:     rongpai ? model.lunban : null,
            fubaopai:   fubaopai,
            defen:      hule.defen,
            hupai:      hule.hupai,
            fenpei:     hule.fenpei
        }
    };
    if (hule.damanguan) {
        paipu.hule.damanguan = hule.damanguan;
    }
    else {
        paipu.hule.fu     = hule.fu;
        paipu.hule.fanshu = hule.fanshu;
    }
    this.add_paipu(paipu);

    let msg = [];
    for (let l = 0; l < 4; l++) {
        msg[l] = JSON.parse(JSON.stringify(paipu));
    }
    this.call_players('hule', msg, this._delay);

    if (this._view) this._view.update(paipu);
}

pingju(name) {

    let model = this._model;

    let shoupai = ['','','',''];
    let fenpei  = [0,0,0,0];

    if (name == '荒牌平局') {

        this._no_game = false;

        let n_tingpai = 0;
        for (let l = 0; l < 4; l++) {
            if (Majiang.Util.xiangting(model.shoupai[l]) == 0
                && Majiang.Util.tingpai(model.shoupai[l]).length > 0)
            {
                n_tingpai++;
                shoupai[l] = model.shoupai[l].toString();
                if (l == 0) this._lianzhuang = true;
            }
        }

        for (let l = 0; l < 4; l++) {
            let all_yaojiu = true;
            for (let p of model.he[l]._pai) {
                if (p.match(/[\+\=\-]$/)) { all_yaojiu = false; break }
                if (p.match(/^z/))          continue;
                if (p.match(/^[mps][19]/))  continue;
                all_yaojiu = false; break;
            }
            if (all_yaojiu) {
                name = '流し満貫';
                for (let i = 0; i < 4; i++) {
                    fenpei[i] += l == 0 && i == l ? 12000
                               : l == 0           ? -4000
                               : l != 0 && i == l ?  8000
                               : l != 0 && i == 0 ? -4000
                               :                    -2000;
                }
            }
        }

        if (name == '荒牌平局' && 0 < n_tingpai && n_tingpai < 4) {
            for (let l = 0; l < 4; l++) {
                fenpei[l] = shoupai[l] ?  3000 / n_tingpai
                                       : -3000 / (4 - n_tingpai);
            }
        }
    }
    else if (name == '九種九牌') {
        shoupai[model.lunban] = model.shoupai[model.lunban].toString();
    }
    else if (name == '四家立直') {
        shoupai = model.shoupai.map(s=>s.toString());
    }
    else if (name == '三家和') {
        for (let l = 0; l < 4; l++) {
            if (l != model.lunban) shoupai[l] = model.shoupai[l].toString();
        }
    }

    if (this._no_game) this._lianzhuang = true;
    this._fenpei = fenpei;

    let paipu = { pingju: { name: name, shoupai: shoupai, fenpei: fenpei } };

    this.add_paipu(paipu);

    let msg = [];
    for (let l = 0; l < 4; l++) {
        msg[l] = JSON.parse(JSON.stringify(paipu));
    }
    this.call_players('pingju', msg, this._delay);

    if (this._view) this._view.update(paipu);
}

last() {

    let model = this._model;

    model.lunban = -1;
    if (this._view) this._view.update({});

    if (! this._lianzhuang) {
        model.jushu++;
        model.zhuangfeng += Math.floor(model.jushu / 4);
        model.jushu = model.jushu % 4;
    }

    let jieju = false;
    let guanjun;
    const defen = model.defen;
    for (let i = 0; i < 4; i++) {
        let id = (model.qijia + i) % 4;
        if (defen[id] < 0) jieju = true;
        if (defen[id] >= 30000
            && (guanjun == null || defen[id] > defen[guanjun])) guanjun = id;
    }

    if      (model.zhuangfeng == 3) jieju = true;
    else if (model.zhuangfeng == 2) {
        if (guanjun != null) jieju = true;
    }
    else if (model.zhuangfeng == 1 && model.jushu == 3) {
        if (guanjun == model.player_id[0]
            && this._lianzhuang && ! this._no_game) jieju = true;
    }

    if (jieju)  this.delay(()=>this.jieju(), 0);
    else        this.delay(()=>this.qipai(), 0);
}

jieju() {

    let model = this._model;

    let paiming = [];
    const defen = model.defen;
    for (let i = 0; i < 4; i++) {
        let id = (model.qijia + i) % 4;
        for (let j = 0; j < 4; j++) {
            if (j == paiming.length || defen[id] > defen[paiming[j]]) {
                paiming.splice(j, 0, id);
                break;
            }
        }
    }
    defen[paiming[0]] += model.lizhibang * 1000;

    let rank = [0,0,0,0];
    for (let i = 0; i < 4; i++) {
        rank[paiming[i]] = i + 1;
    }

    let point = [0,0,0,0];
    for (let i = 1; i < 4; i++) {
        let id = paiming[i];
        point[id] = Math.round((defen[id] - 30000) / 1000)
                  + this._ranking_point[i];
        point[paiming[0]] -= point[id];
    }

    this._paipu.defen = defen.concat();
    this._paipu.rank  = rank.concat();
    this._paipu.point = point.concat();

    let paipu = { jieju: { defen: defen, rank: rank, point: point } };
    let msg = [];
    for (let l = 0; l < 4; l++) {
        msg[l] = JSON.parse(JSON.stringify(paipu));
    }
    this.call_players('jieju', msg, this._delay);

    if (this._view) this._view.summary(this._paipu);
}

next(force) {
    this._timeout_id = clearTimeout(this._timeout_id);
    if (this._reply.filter(x=>x).length < 4) return;
    if (! force && this._stop) return;

    if      (this._status == 'zimo')     this.reply_zimo();
    else if (this._status == 'dapai')    this.reply_dapai();
    else if (this._status == 'fulou')    this.reply_fulou();
    else if (this._status == 'gang')     this.reply_gang();
    else if (this._status == 'gangzimo') this.reply_zimo();
    else if (this._status == 'hule')     this.reply_hule();
    else if (this._status == 'pingju')   this.reply_pingju();
    else if (this._status == 'jieju')    this.reply_jieju();
}

reply_zimo() {

    let model = this._model;

    let reply = this._reply[model.player_id[model.lunban]];
    if (reply.pingju) {
        this.delay(()=>this.pingju('九種九牌'), 0);
    }
    else if (reply.hule) {
        if (this._view) this._view.say('zimo', model.lunban);
        this.delay(()=>this.hule());
    }
    else if (reply.gang) {
        if (this._view) this._view.say('gang', model.lunban);
        this.delay(()=>this.gang(reply.gang));
    }
    else if (reply.dapai) {
        if (reply.dapai.substr(-1) == '*') {
            if (this._view) this._view.say('lizhi', model.lunban);
            this.delay(()=>this.dapai(reply.dapai));
        }
        else this.delay(()=>this.dapai(reply.dapai), 0);
    }
}

reply_dapai() {

    let model = this._model;

    for (let i = 1; i < 4; i++) {
        let l = (model.lunban + i) % 4;
        let reply = this._reply[model.player_id[l]];
        if (reply.hule) {
            if (this._view) this._view.say('rong', l);
            this._hule.push(l);
        }
    }
    if (this._hule.length == 3) {
        this.delay(()=>this.pingju('三家和'));
        return;
    }
    else if (this._hule.length) {
        this.delay(()=>this.hule());
        return;
    }

    if (this._dapai.substr(-1) =='*') {
        model.defen[model.player_id[model.lunban]] -= 1000;
        model.lizhibang++;
        if (this._view) this._view.update({});

        if (this._lizhi.filter(x=>x).length == 4) {
            this.delay(()=>this.pingju('四家立直'), 0);
            return;
        }
    }

    if (this._diyizimo && model.lunban == 3) {
        this._diyizimo = false;
        if (this._fengpai) {
            this.delay(()=>this.pingju('四風連打'), 0);
            return;
        }
    }

    if (this._n_gang.reduce((x,y)=>x+y) == 4) {
        if (Math.max(...this._n_gang) < 4) {
            this.delay(()=>this.pingju('四開槓'), 0);
            return;
        }
    }

    for (let i = 1; i < 4; i++) {
        let l = (model.lunban + i) % 4;
        let reply = this._reply[model.player_id[l]];
        if (reply.fulou) {
            let m = reply.fulou.replace(/0/g,'5');
            if (m.match(/^[mpsz](\d)\1\1\1/)) {
                if (this._view) this._view.say('gang', l);
                this.delay(()=>this.fulou(reply.fulou));
                return;
            }
            if (m.match(/^[mpsz](\d)\1\1/)) {
                if (this._view) this._view.say('peng', l);
                this.delay(()=>this.fulou(reply.fulou));
                return;
            }
        }
    }
    let l = (model.lunban + 1) % 4;
    let reply = this._reply[model.player_id[l]];
    if (reply.fulou) {
        if (this._view) this._view.say('chi', l);
        this.delay(()=>this.fulou(reply.fulou));
        return;
    }

    this.delay(()=>this.zimo(), 0);
}

reply_fulou() {

    let model = this._model;

    if (this._gang) {
        this.delay(()=>this.gangzimo(), 0);
        return;
    }

    let reply = this._reply[model.player_id[model.lunban]];
    if (reply.dapai) {
        this.delay(()=>this.dapai(reply.dapai), 0);
    }
}

reply_gang() {

    let model = this._model;

    for (let i = 1; i < 4; i++) {
        let l = (model.lunban + i) % 4;
        let reply = this._reply[model.player_id[l]];
        if (reply.hule) {
            if (this._view) this._view.say('rong', l);
            this._hule.push(l);
        }
    }
    if (this._hule.length == 3) {
        this.delay(()=>this.pingju('三家和'));
        return;
    }
    else if (this._hule.length) {
        this.delay(()=>this.hule());
        return;
    }

    this.delay(()=>this.gangzimo(), 0);
}

reply_hule() {

    let model = this._model;

    for (let l = 0; l < 4; l++) {
        model.defen[model.player_id[l]] += this._fenpei[l];
    }
    model.changbang = 0;
    model.lizhibang = 0;

    if (this._hule.length) {
        this.delay(()=>this.hule());
    }
    else {
        if (this._lianzhuang) model.changbang = this._changbang + 1;
        this.delay(()=>this.last(), 0);
    }
}

reply_pingju() {

    let model = this._model;

    for (let l = 0; l < 4; l++) {
        model.defen[model.player_id[l]] += this._fenpei[l];
    }
    model.changbang++;

    this.delay(()=>this.last(), 0);
}

reply_jieju() {
    if (this._callback) this._callback();
}

}
