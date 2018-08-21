/*
 *  Majiang.Player
 */
"use strict";

const Majiang = {
    Shoupai: require('../shoupai'),
    Game:    require('../game'),
    Util:    require('../util')
};

module.exports = class Player {

constructor(id) { this._id = id }

action(msg, callback) {

    this._callback = callback;

    if      (msg.kaiju)    this.kaiju  (msg.kaiju);
    else if (msg.qipai)    this.qipai  (msg.qipai);
    else if (msg.zimo)     this.zimo   (msg.zimo);
    else if (msg.dapai)    this.dapai  (msg.dapai);
    else if (msg.fulou)    this.fulou  (msg.fulou);
    else if (msg.gang)     this.gang   (msg.gang);
    else if (msg.gangzimo) this.zimo   (msg.gangzimo, 'lingshang')
    else if (msg.kaigang)  this.kaigang(msg.kaigang);
    else if (msg.hule)     this.hule   (msg.hule);
    else if (msg.pingju)   this.pingju (msg.pingju);
    else if (msg.jieju)    this.hule   (msg.jieju);
}

kaiju(kaiju) {
    this._model = {
        player:  kaiju.player,
        qijia:   kaiju.qijia
    };
    this._hongpai = kaiju.hongpai;
}

qipai(qipai) {

    let model = this._model;

    model.zhuangfeng = qipai.zhuangfeng;
    model.menfeng    = (8 + this._id - model.qijia - qipai.jushu) % 4;
    model.changbang  = qipai.changbang;
    model.lizhibang  = qipai.lizhibang;
    model.defen      = qipai.defen;

    this._shoupai   = Majiang.Shoupai.fromString(qipai.shoupai[model.menfeng]);
    this._he        = {};
    this._paishu    = 136 - 13 * 4 - 14;
    this._baopai    = [ qipai.baopai ];

    this._neng_rong = true;
    this._diyizimo  = true;
}

zimo(zimo, option) {

    let model = this._model;

    this._paishu--;

    if (zimo.l != model.menfeng) { this._callback(); return }

    this._shoupai.zimo(zimo.p);

    this.action_zimo(zimo, option);

    this._diyizimo = false;
}

dapai(dapai) {

    let model = this._model;

    if (dapai.l == model.menfeng) {

        if (! this._shoupai.lizhi()) this._neng_rong = true;

        this._shoupai.dapai(dapai.p);

        this._he[dapai.p.substr(0,2).replace(/0/,'5')] = true;

        if (Majiang.Util.xiangting(this._shoupai) == 0
            && Majiang.Util.tingpai(this._shoupai).find(p=>this._he[p]))
        {
            this._neng_rong = false;
        }

        this._callback();
    }
    else {
        this.action_dapai(dapai);

        let shoupai = this._shoupai.clone().zimo(dapai.p);
        if (Majiang.Util.xiangting(shoupai) == -1) this._neng_rong = false;
    }

    if (dapai.p.substr(-1) == '*') {
        model.lizhibang++;
    }
}

fulou(fulou) {

    let model = this._model;

    this._diyizimo = false;

    if (fulou.l != model.menfeng) { this._callback(); return }

    this._shoupai.fulou(fulou.m);

    if (fulou.m.match(/^[mpsz]\d{4}/)) { this._callback(); return }

    this.action_fulou(fulou);
}

gang(gang) {

    let model = this._model;

    this._diyizimo = false;

    if (gang.l == model.menfeng) {

        let p = (gang.m.match(/^[mpsz]\d{4}$/))
                    ? gang.m.replace(/0/,'5').substr(0,2)
                    : gang.m[0] + gang.m.substr(-1)
        this._shoupai.gang(p);

        this._callback();
        return;
    }

    if (! gang.m.match(/^[mpsz]\d{4}/)) {

        this.action_gang(gang);

        let shoupai = this._shoupai.clone().zimo(gang.m.substr(0,2));
        if(Majiang.Util.xiangting(shoupai) == -1) this._neng_rong = false;
    }
    else this._callback();
}

kaigang(kaigang) {
    this._baopai.push(kaigang.baopai);
}

hule(hule)     { this.wait(); }

pingju(pingju) { this.wait(); }

jieju(jieju)   { this.wait(); }

wait() { this._callback() }

action_zimo(zimo, option) {
    let mianzi;
    if      (this.select_hule(null, option)) this._callback({hule: '-'});
    else if (this.select_pingju())           this._callback({pingju: '-'});
    else if (mianzi = this.select_gang())    this._callback({gang: mianzi});
    else this._callback({dapai: this.select_dapai()});
}

action_dapai(dapai) {
    let mianzi;
    if      (this.select_hule(dapai))           this._callback({hule: '-'});
    else if (mianzi = this.select_fulou(dapai)) this._callback({fulou: mianzi});
    else                                        this._callback();
}

action_fulou(fulou) {
    this._callback({dapai: this.select_dapai()});
}

action_gang(gang) {
    if (this.select_hule(gang, 'qianggang')) this._callback({hule: '-'});
    else                                     this._callback();
}

get_dapai() {
    return  Majiang.Game.get_dapai(this._shoupai);
}

get_chi_mianzi(dapai) {
    let model = this._model;
    let p = dapai.p
          + ['','+','=','-'][(4 + dapai.l - model.menfeng) % 4];
    return Majiang.Game.get_chi_mianzi(this._shoupai, p, this._paishu);
}

get_peng_mianzi(dapai) {
    let model = this._model;
    let p = dapai.p
          + ['','+','=','-'][(4 + dapai.l - model.menfeng) % 4];
    return Majiang.Game.get_peng_mianzi(this._shoupai, p, this._paishu);
}

get_gang_mianzi(dapai) {
    let model = this._model;
    if (dapai) {
        let p = dapai.p
              + ['','+','=','-'][(4 + dapai.l - model.menfeng) % 4];
        return Majiang.Game.get_gang_mianzi(this._shoupai, p, this._paishu);
    }
    else {
        return Majiang.Game.get_gang_mianzi(this._shoupai, null, this._paishu);
    }
}

allow_lizhi(p) {
    let model = this._model;
    return Majiang.Game.allow_lizhi(this._shoupai, p, this._paishu,
                                    model.defen[model.menfeng]);
}

allow_hule(data, option) {

    let model = this._model;

    let hupai = this._shoupai.lizhi()
                || option != null
                || this._paishu == 0;
    if (data) {
        let p = (data.p ? data.p.substr(0,2) : data.m[0] + data.m.substr(-1))
              + ['','+','=','-'][(4 + data.l - model.menfeng) % 4];
        return Majiang.Game.allow_hule(this._shoupai, p,
                                        model.zhuangfeng, model.menfeng,
                                        hupai, this._neng_rong);
    }
    else {
        return Majiang.Game.allow_hule(this._shoupai, null,
                                        model.zhuangfeng, model.menfeng,
                                        hupai);
    }
}

allow_pingju() {
    return Majiang.Game.allow_pingju(this._shoupai, this._diyizimo);
}

select_fulou(dapai) {}

select_gang() {
    let n_xiangting = Majiang.Util.xiangting(this._shoupai);
    for (let m of this.get_gang_mianzi()) {
        let shoupai
            = this._shoupai.clone().gang(m.replace(/0/,'5').substr(0,2));
        if (Majiang.Util.xiangting(shoupai) == n_xiangting) return m;
    }
}

select_dapai() {

    let dapai, max = 0;
    let n_xiangting = Majiang.Util.xiangting(this._shoupai);
    for (let p of this.get_dapai()) {
        let shoupai = this._shoupai.clone().dapai(p);
        if (Majiang.Util.xiangting(shoupai) > n_xiangting) continue;
        let n_tingpai = Majiang.Util.tingpai(shoupai).length;
        if (n_tingpai >= max) {
            max = n_tingpai;
            dapai = p;
        }
    }
    if (this.select_lizhi(dapai)) dapai += '*';
    return dapai;
}

select_lizhi(p) {
    return this.allow_lizhi(p);
}

select_hule(data, option) {
    return this.allow_hule(data, option);
}

select_pingju() {
    if (Majiang.Util.xiangting(this._shoupai) < 4) return false;
    return this.allow_pingju();
}

}
