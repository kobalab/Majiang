/*
 *  Majiang.View.Shoupai
 */
"use strict";

const $ = require('jquery');
const Majiang = { View: { pai: require('./pai') } };

module.exports = class Shoupai {

constructor(root, shoupai, open) {

    this._node = {
        bingpai: $('.bingpai', root),
        fulou:   $('.fulou',   root)
    }
    this._shoupai = shoupai;
    this._open    = open;
}

redraw(open) {

    if (open != null) this._open = open;

    this._node.bingpai.empty();
    let zimo = this._shoupai._zimo;
    for (let s of ['m','p','s','z']) {
        let bingpai = this._shoupai._bingpai[s];
        let n_hongpai = bingpai[0];
        for (let n = 1; n < bingpai.length; n++) {
            let n_pai = bingpai[n];
            if (s+n == this._shoupai._zimo) n_pai--;
            else if (n == 5 && s+0 == this._shoupai._zimo) {
                n_hongpai--;
                n_pai--;
            }
            for (let i = 0; i < n_pai; i++) {
                let p = s;
                if (n == 5 && n_hongpai > 0) { p += 0; n_hongpai-- }
                else                           p += n;
                this._node.bingpai
                    .append(Majiang.View.pai(this._open ? p : '_'));
            }
        }
    }
    if (zimo && zimo.length == 2) {
        this._node.bingpai
            .append($('<span class="zimo">')
                        .append(Majiang.View.pai(this._open ? zimo : '_')));
    }

    this._node.fulou.empty();
    for (let m of this._shoupai._fulou) {
        let mianzi = $('<span class="mianzi">');
        let [s] = m;
        if (m.replace(/0/g,'5').match(/^[mpsz](\d)\1\1\1$/)) {
            let nn = m.match(/\d/g);
            mianzi.append(Majiang.View.pai('_'))
                  .append(Majiang.View.pai(s+nn[2]))
                  .append(Majiang.View.pai(s+nn[3]))
                  .append(Majiang.View.pai('_'));
        }
        else if (m.replace(/0/g,'5').match(/^[mpsz](\d)\1\1\1?[\+\=\-]\1?$/)) {
            let jiagang = m.match(/[\+\=\-]\d$/);
            let d       = m.match(/[\+\=\-]/)[0];
            let pai     = m.match(/\d/g).map(n => Majiang.View.pai(s+n));
            let pai_r   = $('<span class="rotate">')
                            .append(jiagang ? [ pai[2], pai[3] ]
                                            : pai[pai.length - 1]);
            let pai_l   = (! jiagang && pai.length == 4)
                                ? [ pai[1], pai[2] ] : pai[1];
            if (d == '+') mianzi.append(pai[0]).append(pai_l).append(pai_r);
            if (d == '=') mianzi.append(pai[0]).append(pai_r).append(pai_l);
            if (d == '-') mianzi.append(pai_r).append(pai[0]).append(pai_l);
        }
        else {
            let nn = m.match(/\d(?=\-)/).concat(m.match(/\d(?!\-)/g));
            mianzi.append($('<span class="rotate">')
                            .append(Majiang.View.pai(s+nn[0])))
                  .append(Majiang.View.pai(s+nn[1]))
                  .append(Majiang.View.pai(s+nn[2]));
        }
        this._node.fulou.append(mianzi);
    }

    return this;
}

dapai(p) {

    let dapai = $('.pai.dapai', this._node.bingpai);
    if (! dapai.length) {
        if (p[2] == '_') dapai = $('.zimo .pai', this._node.bingpai);
    }
    if (! dapai.length) {
        if (this._open) {
            p = p.substr(0,2);
            dapai = $(`.pai[data-pai="${p}"]`, this._node.bingpai).eq(0);
        }
        else {
            dapai = $('.pai', this._node.bingpai);
            dapai = dapai.eq(Math.floor(Math.random()*(dapai.length-1)));
        }
    }
    dapai.addClass('deleted');

    return this;
}

}
