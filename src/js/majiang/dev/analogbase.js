/*
 *  Majiang.Dev.AnaLogBase
 */

"use strict";

const fs   = require('fs');
const path = require('path');
const zlib = require('zlib');

const getlogs = require('./getlogs');

module.exports = class AnaLogBase {

    constructor() {
        this._result = {};
    }

    analyze(id, paipu, player_id) {

        this._id = id;
        this._player_id = player_id;
        this._ju = 0;
        this._qijia = paipu.qijia;

        for (let log of paipu.log) {
            this.log(log);
        }
    }

    log(log) {

        let qipai = log[0].qipai;
        this._jushu = qipai.zhuangfeng * 4 + qipai.jushu;
        this._jushu_name = ['東','南','西','北'][qipai.zhuangfeng]
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

        this._ju++;
    }

    qipai(qipai) {}
    zimo(zimo)   {}
    dapai(dapai) {}
    fulou(fulou) {}
    gang(gang)   {}
    gangzimo(gangzimo) {}
    kaigang(kaigang)   {}
    hule(hule)         {}
    pingju(pingju)     {}

    url(l) {
        let id = l != null ? (this._qijia + this._jushu + l) % 4 : '';
        return `${this._id}/${id}/${this._ju}`;
    }

    static analyze(filename, n_try) {

        filename = filename || './';
        const analog = new this();

        let t = 0;
        console.log(`[${t}]`, new Date().toTimeString());

        for (let log of getlogs(filename)) {
            analog.analyze(log.basename, log.paipu);
            t++;
            if (n_try && t >= n_try) break;
            if (t % 10000 == 0)
                console.log(`[${t}]`, new Date().toTimeString());
        }

        console.log(`[${t}]`, new Date().toTimeString());
        return analog._result;
    }
}
