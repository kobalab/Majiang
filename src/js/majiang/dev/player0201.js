/*
 *  Majiang.Player
 */
"use strict";

const Majiang = {
    Shoupai: require('../shoupai'),
    Game:    require('../game'),
    Util:    require('../util'),
    SuanPai: require('./suanpai0101'),
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

    this._suanpai = new Majiang.SuanPai(this._hongpai);
    this._suanpai.qipai(qipai, model.menfeng);
}

zimo(zimo, option) {

    let model = this._model;

    this._suanpai.zimo(zimo);

    this._paishu--;

    if (zimo.l != model.menfeng) { this._callback(); return }

    this._shoupai.zimo(zimo.p);

    this.action_zimo(zimo, option);

    this._diyizimo = false;
}

dapai(dapai) {

    let model = this._model;

    this._suanpai.dapai(dapai);

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

    this._suanpai.fulou(fulou);

    this._diyizimo = false;

    if (fulou.l != model.menfeng) { this._callback(); return }

    this._shoupai.fulou(fulou.m);

    if (fulou.m.match(/^[mpsz]\d{4}/)) { this._callback(); return }

    this.action_fulou(fulou);
}

gang(gang) {

    let model = this._model;

    this._suanpai.gang(gang);

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
    this._suanpai.kaigang(kaigang);
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

select_fulou(dapai) {

    let n_xiangting = this.xiangting(this._shoupai);

    if (this._suanpai._lizhi.find(l=>l) && n_xiangting > 1) return;

    for (let m of this.get_gang_mianzi(dapai)) {
        let shoupai = this._shoupai.clone().fulou(m);
        if (this.xiangting(shoupai) == n_xiangting) return m;
    }

    if (n_xiangting == 0) return;
    for (let m of this.get_peng_mianzi(dapai)
                        .concat(this.get_chi_mianzi(dapai)))
    {
        let shoupai = this._shoupai.clone().fulou(m);
        if (this.xiangting(shoupai) < n_xiangting) return m;
    }
}

select_gang() {

    let n_xiangting = this.xiangting(this._shoupai);

    if (this._suanpai._lizhi.find(l=>l) && n_xiangting > 0) return;

    for (let m of this.get_gang_mianzi()) {
        let p = m.match(/^[mpsz]\d{4}$/)
                    ? m.replace(/0/,'5').substr(0,2)
                    : m[0] + m.substr(-1);
        let shoupai = this._shoupai.clone().gang(p);
        if (this.xiangting(shoupai) == n_xiangting) return m;
    }
}

select_dapai() {

    const suan_weixian = (p) => {
        let weixian = 0;
        for (let l = 0; l < 4; l++) {
            if (! this._suanpai._lizhi[l]) continue;
            let w = this._suanpai.suan_weixian(p, l);
            if (w > weixian) weixian = w;
        }
        return weixian;
    }

    let anquan, min = Infinity;
    if (this._suanpai._lizhi.find(l=>l)) {
        for (let p of this.get_dapai()) {
            let weixian = suan_weixian(p);
            if (weixian < min) {
                min = weixian;
                anquan = p;
            }
        }
    }

    let dapai, max = 0;
    let n_xiangting = this.xiangting(this._shoupai);
    for (let p of this.get_dapai()) {
        if (! dapai) dapai = p;
        let shoupai = this._shoupai.clone().dapai(p);
        if (this.xiangting(shoupai) > n_xiangting) continue;
        let x = 1 - this._suanpai.paijia(p)/100;
        for (let tp of this.tingpai(shoupai)) {
            x += this._suanpai._paishu[tp[0]][tp[1]];
        }
        if (x >= max) {
            max = x;
            dapai = p;
        }
    }

    if (anquan) {
        if      (n_xiangting > 1)                             dapai = anquan;
        else if (n_xiangting == 1 && suan_weixian(dapai) > 5) dapai = anquan;
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

xiangting(shoupai) {

    function xiangting_menqian(shoupai) {
        return shoupai.menqian() ? Majiang.Util.xiangting(shoupai) : Infinity;
    };
    function xiangting_fanpai(shoupai, zhuangfeng, menfeng, suanpai) {
        let n_fanpai = 0, back;
        for (let n of [zhuangfeng+1, menfeng+1, 5, 6, 7]) {
            if (shoupai._bingpai.z[n] >= 3) n_fanpai++;
            else if (shoupai._bingpai.z[n] == 2
                     && suanpai.paishu('z'+n)) back = 'z'+n+n+n+'+';
            for (let m of shoupai._fulou) {
                if (m[0] == 'z' && m[1] == n) n_fanpai++;
            }
        }
        if (n_fanpai) return Majiang.Util.xiangting(shoupai);
        if (back) {
            let new_shoupai = shoupai.clone();
            new_shoupai._zimo = null;
            new_shoupai.fulou(back);
            new_shoupai._zimo = null;
            return Majiang.Util.xiangting(new_shoupai) + 1;
        }
        return Infinity;
    }
    function xiangting_duanyao(shoupai) {
        if (shoupai._fulou.find(m=>m.match(/^z|[19]/))) return Infinity;
        let new_shoupai = shoupai.clone();
        for (let s of ['m','p','s']) {
            for (let n of [1,9]) {
                new_shoupai._bingpai[s][n] = 0;
            }
        }
        new_shoupai._bingpai.z = [0,0,0,0,0,0,0,0];
        return Majiang.Util.xiangting(new_shoupai);
    }
    function xiangting_duidui(shoupai) {
        if (shoupai._fulou.map(m=>m.replace(/0/,'5'))
                        .find(m=>! m.match(/^[mpsz](\d)\1\1/))) return Infinity;
        let n_kezi = shoupai._fulou.length, n_duizi = 0;
        for (let s of ['m','p','s','z']) {
            let bingpai = shoupai._bingpai[s];
            for (let n = 1; n < bingpai.length; n++) {
                if      (bingpai[n] >= 3) n_kezi++;
                else if (bingpai[n] == 2) n_duizi++;
            }
        }
        if (n_kezi + n_duizi > 5) n_duizi = 5 - n_kezi;
        return 8 - n_kezi * 2 - n_duizi;
    }
    function xiangting_yise(shoupai, suit) {
        const regexp = new RegExp(`^[^z${suit}]`);
        if (shoupai._fulou.find(m=>m.match(regexp))) return Infinity;
        let new_shoupai = shoupai.clone();
        for (let s of ['m','p','s']) {
            if (s != suit) new_shoupai._bingpai[s] = [0,0,0,0,0,0,0,0,0,0];
        }
        return Majiang.Util.xiangting(new_shoupai);
    }

    return Math.min(
        xiangting_menqian(shoupai),
        xiangting_fanpai(shoupai, this._model.zhuangfeng, this._model.menfeng,
                         this._suanpai),
        xiangting_duanyao(shoupai),
        xiangting_duidui(shoupai),
        xiangting_yise(shoupai, 'm'),
        xiangting_yise(shoupai, 'p'),
        xiangting_yise(shoupai, 's')
    );
}

tingpai(shoupai) {
    return Majiang.Util.tingpai(shoupai, s=>this.xiangting(s))
}

}
