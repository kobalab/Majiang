/*
 *  Majiang.Dev.Analog
 */
"use strict";

const fs   = require('fs');
const path = require('path');
const zlib = require('zlib');

const Majiang = require('../../majiang');

module.exports = class AnaLog {

constructor() {

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

analyze(id, paipu) {
    this._id = id;
    for (let log of paipu.log) {
        this.log(log);
    }
    this._result.n_game++;
}

log(log) {

    let qipai = log[0].qipai;
    this._jushu = ['東','南','西','北'][qipai.zhuangfeng]
                + ['一','二','三','四'][qipai.jushu] + '局 '
                + qipai.changbang + '本場';

    for (let data of log) {
        if      (data.qipai)    this.qipai   (data.qipai);
        else if (data.zimo)     this.zimo    (data.zimo);
        else if (data.dapai)    this.dapai   (data.dapai);
        else if (data.fulou)    this.fulou   (data.fulou);
        else if (data.gang)     this.gang    (data.gang);
        else if (data.gangzimo) this.gangzimo(data.gangzimo);
        else if (data.kaigang)  this.kaigang (data.kaigang);
        else if (data.hule)     this.hule    (data.hule);
        else if (data.pingju)   this.pingju  (data.pingju);
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
        lunban:     0,
    };
    for (let l = 0; l < 4; l++) {
        this._game.shoupai[l] = Majiang.Shoupai.fromString(qipai.shoupai[l]);
        this._game.he[l]      = new Majiang.He();
    }
}

zimo(zimo) {
    this._game.shoupai[zimo.l].zimo(zimo.p);
    this._game.lunban = zimo.l;
}

dapai(dapai) {
    this._game.shoupai[dapai.l].dapai(dapai.p);
    this._game.he[dapai.l].dapai(dapai.p);
    if (dapai.p.substr(-1) == '*') this._result.n_lizhi++;
}

fulou(fulou) {
    let d = fulou.m.match(/[\+\=\-]/)[0];
    this._game.shoupai[fulou.l].fulou(fulou.m);
    this._game.he[this._game.lunban].fulou(d);
    this._game.lunban = fulou.l;
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
    this._game.shoupai[gangzimo.l].zimo(gangzimo.p);
}

kaigang(kaigang) {
    this._game.baopai.push(kaigang.baopai);
}

hule(hule) {

    this._result.n_hule++;
    if (hule.baojia != null) this._result.n_beirong++;
    this._result.sum_defen += hule.defen;

    for (let hupai of hule.hupai) {
        if (hupai.fanshu == 0) continue;
        if (! this._result.hupai[hupai.name])
            this._result.hupai[hupai.name] = { n: 0, fanshu: 0 };
        this._result.hupai[hupai.name].n++;
        this._result.hupai[hupai.name].fanshu += hupai.fanshu;
    }
}

pingju(pingju) {

    this._result.n_pingju++;

    if (! this._result.pingju[pingju.name])
        this._result.pingju[pingju.name] = 0;
    this._result.pingju[pingju.name]++;
}

analyze_file(filename) {

    let id, paipu;
    if (filename.match(/\.json\.gz$/)) {
        id = filename.replace(/^.*\//,'').replace(/\.json\.gz$/,'');
        paipu = JSON.parse(
                        zlib.gunzipSync(
                            fs.readFileSync(path.join(filename))
                        ).toString());
    }
    else if (filename.match(/\.json$/)) {
        id = filename.replace(/^.*\//,'').replace(/\.json$/,'');
        paipu = JSON.parse(fs.readFileSync(path.join(filename)));
    }
    else return;

    this.analyze(id, paipu);

    return this._result;
}

analyze_dir(dirname, n_try) {

    let logs = fs.readdirSync(dirname)
                    .filter(n=>n.match(/\.json(?:\.gz)?$/)).sort();
    if (n_try == null) n_try = logs.length;

    console.log(`[${Math.min(n_try, logs.length)}]`, new Date().toTimeString());

    while (n_try && logs.length) {

        let filename = logs.shift();
        try {
            let rv = this.analyze_file(path.join(dirname, filename));
            if (! rv) continue;
        }
        catch(e) {
            console.error(`${filename}: ${e}`);
        }

        n_try--;
        if (n_try % 10000 == 0 || logs.length == 0) {
            console.log(`[${Math.min(n_try, logs.length)}]`,
                        new Date().toTimeString());
        }
    }
    return this._result;
}

static analyze(filename, n_try) {

    filename = filename || './';
    const analog = new AnaLog();
    if (fs.statSync(filename).isDirectory())
            analog.analyze_dir(filename, n_try);
    else    analog.analyze_file(filename);

    return analog._result;
}

}
