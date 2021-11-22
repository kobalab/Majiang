/*
 *  Majiang.Dev.Game
 */
"use strict";

const Majiang = require('../../majiang');

const Shan = require('./shan');

function make_shan(log) {

    function set_qipai(paistr) {
        for (let suitstr of paistr.match(/[mpsz]\d+/g)) {
            let s = suitstr[0];
            for (let n of suitstr.match(/\d/g)) { shan._pai[--zimo_idx] = s+n }
        }
    }

    const shan = new Majiang.Shan();
    for (let i = 0; i < shan._pai.length; i++) { shan._pai[i] = '_' }

    let zimo_idx = shan._pai.length;
    let gang_idx = 0;
    let baopai   = [];
    let fubaopai = [];

    for (let data of log) {
        if (data.qipai) {
            for (let l = 0; l < 4; l++) { set_qipai(data.qipai.shoupai[l]) }
            baopai.push(data.qipai.baopai);
        }
        else if (data.zimo)     shan._pai[--zimo_idx] = data.zimo.p;
        else if (data.gangzimo) shan._pai[gang_idx++] = data.gangzimo.p;
        else if (data.kaigang)  baopai.push(data.kaigang.baopai);
        else if (data.hule && data.hule.fubaopai)
                                fubaopai = data.hule.fubaopai;
    }

    for (let i = 0; i < baopai.length; i++)   { shan._pai[4 + i] = baopai[i] }
    for (let i = 0; i < fubaopai.length; i++) { shan._pai[9 + i] = fubaopai[i] }

    shan._baopai   = [ shan._pai[4] ];
    shan._fubaopai = [ shan._pai[9] ];

    return shan;
}

function make_reply(l, log) {

    const reply = [];

    for (let data of log) {
        if (data.zimo || data.gangzimo) reply.push({});
        else if (data.dapai)
            reply.push(l == data.dapai.l ? { dapai: data.dapai.p } : {});
        else if (data.fulou)
            reply.push(l == data.fulou.l ? { fulou: data.fulou.m } : {});
        else if (data.gang)
            reply.push(l == data.gang.l  ? { gang:  data.gang.m  } : {});
        else if (data.pingju) {
            if      (data.pingju.name == '九種九牌') reply.push({ pingju: '-' });
            else if (data.pingju.name.match(/^三家和/)
                    && data.pingju.shoupai[l])     reply.push({ hule: '-' });
        }
        else if (data.hule)
            if (l == data.hule.l) reply.push({ hule: '-' });
    }
    reply.shift();

    return reply;
}

class Player {
    constructor(id)       { this._reply = [] }
    action(msg, callback) { if (callback) callback(this._reply.shift()) }
}

module.exports = class Game extends Majiang.Game {
    constructor(script) {
        super();
        if (! script) {
            this._player = [0,1,2,3].map(id=>new Majiang.Player(id));
        }
        else if (script.shan) {
            this._model.qijia = script.qijia;
            this._shan = [];
            for (let i = 0; i < script.shan.length; i++) {
                let j = i % 4;
                if (! this._shan[j]) this._shan[j] = [];
                this._shan[j].push(script.shan[i]);
            }
            this._player = [0,1,2,3].map(id=>new Majiang.Player(id));
        }
        else {
            this._model.title = script.title;
            this._model.qijia = script.qijia;
            this._model.player = script.player;
            this._script = script;
            for (let id = 0; id < 4; id++) { this._player[id] = new Player(id) }
        }
        this._speed = 0;
    }
    qipai() {
        if (this._shan) {
            let pai;
            if (this._model.zhuangfeng % 2 == 0)
                    pai = this._shan[this._model.jushu].shift();
            else    pai = this._shan[this._model.jushu].pop();
            if (! pai) console.log('***',
                                   this._model.zhuangfeng, this._model.jushu);
            super.qipai(pai ? new Shan(pai) : new Majiang.Shan(this._hongpai));
        }
        else if (this._script) {
            const log = this._script.log.shift();
            for (let l = 0; l < 4; l++) {
                let id = (this._model.qijia + this._model.jushu + l) % 4;
                this._player[id]._reply = make_reply(l, log);
            }
            super.qipai(make_shan(log));
        }
        else {
            super.qipai();
        }
    }
    zimo() {
        if (this._model.shan.lunban)
                        this._model.shan.lunban(this._model.lunban);
        super.zimo();
    }
    do_test() {
        this._stop = false;
        this._no_wait = true;
        this.kaiju();
        while (this._status != 'jieju') {
            if      (this._status == 'zimo')     this.reply_zimo();
            else if (this._status == 'dapai')    this.reply_dapai();
            else if (this._status == 'fulou')    this.reply_fulou();
            else if (this._status == 'gang')     this.reply_gang();
            else if (this._status == 'gangzimo') this.reply_zimo();
            else if (this._status == 'hule')     this.reply_hule();
            else if (this._status == 'pingju')   this.reply_pingju();
        }
        this.reply_jieju();
        return this;
    }
    stop()  { if (! this._no_wait) super.stop()  }
    start() { if (! this._no_wait) super.start() }
    delay(callback, timeout) {
        if (this._no_wait) callback();
        else super.delay(callback, timeout);
    }
    notify_players(type, msg) {
        if (this._no_wait) {
            for (let l = 0; l < 4; l++) {
                this ._player[this._model.player_id[l]].action(msg[l]);
            }
        }
        else super.notify_players(type, msg);
    }
    call_players(type, msg, timeout) {
        if (this._no_wait) {
            this._status = type;
            this._reply  = [];
            for (let l = 0; l < 4; l++) {
                let id = this._model.player_id[l];
                this._player[id].action(msg[l], reply => this.reply(id, reply));
            }
        }
        else super.call_players(type, msg, timeout);
    }
    reply(id, reply = {}) {
        if (this._no_wait) this._reply[id] = reply;
        else super.reply(id, reply);
    }
}
