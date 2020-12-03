/*
 *  Majiang.Dev.AnaLog
 */
"use strict";

const fs   = require('fs');
const path = require('path');
const zlib = require('zlib');

const Majiang = require('../../majiang');

module.exports = class AnaLog extends require('./analogbase') {

constructor() {

    super();

    this._result = {
        n_game:     0,
        n_ju:       0,
        n_hule:     0,
        n_beirong:  0,
        n_lizhi:    0,
        n_fulou:    0,
        n_pingju:   0,
        sum_defen:  0,
        hupai:      {},
        pingju:     {},
    };
}

analyze(id, paipu, player_id) {
    super.analyze(id, paipu, player_id);
    this._result.n_game++;
}

log(log) {

    super.log(log);

    let hule = log[log.length - 1].hule;
    if (hule) {
        if (this._player_id != null
            && this._game.player_id[hule.baojia] == this._player_id)
                                                    this._result.n_beirong++;
        if (this._player_id == null && hule.baojia != null)
                                                    this._result.n_beirong++;
    }

    this._result.n_ju++;
}

qipai(qipai) {

    this._game = {
        zhuangfeng: qipai.zhuangfeng,
        jushu:      qipai.jushu,
        changbang:  qipai.changbang,
        shoupai:    [],
        he:         [],
        baopai:     [qipai.baopai],
        paishu:     136 - 13 * 4 -14,
        lunban:     0,
        lizhi:      [0,0,0,0],
        player_id:  [0,1,2,3].map(l=>(this._qijia + qipai.jushu + l) % 4),
    };
    for (let l = 0; l < 4; l++) {
        this._game.shoupai[l] = Majiang.Shoupai.fromString(qipai.shoupai[l]);
        this._game.he[l]      = new Majiang.He();
    }
}

zimo(zimo) {
    this._game.paishu--;
    this._game.shoupai[zimo.l].zimo(zimo.p);
    if (this._game.lizhi[this._game.lunban] == -1)
                                    this._game.lizhi[this._game.lunban] = 1;
    this._game.lunban = zimo.l;
}

dapai(dapai) {
    this._game.shoupai[dapai.l].dapai(dapai.p);
    this._game.he[dapai.l].dapai(dapai.p);
    if (dapai.p.substr(-1) == '*') this._game.lizhi[dapai.l] = -1;
    if (this._player_id != null
        && this._game.player_id[dapai.l] != this._player_id) return;
    if (dapai.p.substr(-1) == '*') this._result.n_lizhi++;
}

fulou(fulou) {
    let d = fulou.m.match(/[\+\=\-]/)[0];
    this._game.shoupai[fulou.l].fulou(fulou.m);
    this._game.he[this._game.lunban].fulou(d);
    if (this._game.lizhi[this._game.lunban] == -1)
                                    this._game.lizhi[this._game.lunban] = 1;
    this._game.lunban = fulou.l;
    if (this._player_id != null
        && this._game.player_id[fulou.l] != this._player_id) return;
    if (this._game.shoupai[fulou.l]._fulou
            .filter(m=>m.match(/[\+\=\-]/)).length == 1) this._result.n_fulou++;
}

gang(gang) {
    if (gang.m.match(/^[mpsz]\d{4}$/)) {
        let s = gang.m[0], n = +gang.m[1] || 5;
        this._game.shoupai[gang.l].gang(s+n);
    }
    else {
        let s = gang.m[0], n = gang.m.substr(-1);
        this._game.shoupai[gang.l].gang(s+n);
    }
}

gangzimo(gangzimo) {
    this._game.paishu--;
    this._game.shoupai[gangzimo.l].zimo(gangzimo.p);
}

kaigang(kaigang) {
    this._game.baopai.push(kaigang.baopai);
}

hule(hule) {

    if (this._player_id != null
        && this._game.player_id[hule.l] != this._player_id) return;
    this._result.n_hule++;
    this._result.sum_defen += hule.defen;

    for (let hupai of hule.hupai) {
        if (hupai.fanshu == 0) continue;
        if (hupai.name.match(/^(?:場風|自風|役牌|翻牌)/)) hupai.name = '翻牌';
        if (! this._result.hupai[hupai.name])
            this._result.hupai[hupai.name] = { n: 0, fanshu: 0 };
        this._result.hupai[hupai.name].n++;
        this._result.hupai[hupai.name].fanshu
            += hule.damanguan ? hupai.fanshu.length * 13 : hupai.fanshu;
    }
}

pingju(pingju) {

    this._result.n_pingju++;

    if (! this._result.pingju[pingju.name])
        this._result.pingju[pingju.name] = 0;
    this._result.pingju[pingju.name]++;
}

static analyze_player(filename, player_name) {

    function round(n, r) {
        n = '' + n;
        if (! n.match(/\./)) return n;
        if (r == 0) return n.replace(/\..*$/,'');
        for (let i = 0; i < r; i++) { n += '0' }
        const regex = new RegExp(`(\\\.\\d{${r}}).*$`);
        return n.replace(/^0\./,'.').replace(regex, '$1');
    }

    const analog = new this();
    analog._result.n_rank = [0,0,0,0];
    for (let paipu of JSON.parse(fs.readFileSync(filename))) {
        let id = paipu.title.replace(/^.*\n/,'');
        const r = new RegExp(`^${player_name}\n`);
        let player_id = [0,1,2,3].find(i=>paipu.player[i].match(r));
        if (player_id == null) continue;
        analog.analyze(id, paipu, player_id);
        analog._result.n_rank[paipu.rank[player_id]-1]++;
    }

    let r = analog._result;

    console.log(player_name);
    console.log('対局数: ' + r.n_game + ' (' + r.n_rank.join(' + ') + ')');
    console.log(
        '平均順位: '   + round([1,2,3,4].map(x=>r.n_rank[x-1]*x)
                                      .reduce((x,y)=>x + y)
                                / r.n_game, 2) + '、'
        + 'トップ率: ' + round(r.n_rank[0] / r.n_game, 3) + '、'
        + '連対率: '   + round((r.n_rank[0] + r.n_rank[1]) / r.n_game, 3) + '、'
        + 'ラス率: '   + round(r.n_rank[3] / r.n_game, 3)
    );
    console.log(
          '和了率: '   + round(r.n_hule / r.n_ju, 3) + '、'
        + '放銃率: '   + round(r.n_beirong / r.n_ju, 3) + '、'
        + '立直率: '   + round(r.n_lizhi / r.n_ju, 3) + '、'
        + '副露率: '   + round(r.n_fulou / r.n_ju, 3) + '、'
        + '平均打点: ' + round(r.sum_defen / r.n_hule, 0)
    );

    return analog._result;
}

}
