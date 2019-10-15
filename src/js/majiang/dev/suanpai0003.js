/*
 *  Majiang.SuanPai
 */
"use strict";

module.exports = class SuanPai {

constructor(hongpai) {

    this._paishu = {
        m: [0,4,4,4,4,4,4,4,4,4],
        p: [0,4,4,4,4,4,4,4,4,4],
        s: [0,4,4,4,4,4,4,4,4,4],
        z: [0,4,4,4,4,4,4,4]
    };
    if (hongpai) {
        this._paishu.m[0] = hongpai.m;
        this._paishu.p[0] = hongpai.p;
        this._paishu.s[0] = hongpai.s;
    }
    this._zhuangfeng = 0;
    this._menfeng    = 0;
    this._baopai     = [];
}

diaopai(p) {
    this._paishu[p[0]][p[1]]--;
    if (p[1] == 0) this._paishu[p[0]][5]--;
}

paishu(p) {
    return (p[1] == 5) ? this._paishu[p[0]][5] - this._paishu[p[0]][0]
                       : this._paishu[p[0]][p[1]];
}

qipai(qipai, menfeng) {

    this._zhuangfeng = qipai.zhuangfeng;
    this._menfeng    = menfeng;
    this._baopai     = [ qipai.baopai ];
    this.diaopai(qipai.baopai);

    let paistr = qipai.shoupai[menfeng];
    for (let suitstr of paistr.match(/[mpsz]\d[\d\+\=\-]*/g)) {
        let s = suitstr[0];
        for (let n of suitstr.match(/\d/g)) {
            this.diaopai(s+n);
        }
    }
}

zimo(zimo) {
    if (zimo.l == this._menfeng) this.diaopai(zimo.p);
}

dapai(dapai) {
    if (dapai.l != this._menfeng) this.diaopai(dapai.p);
}

fulou(fulou) {
    if (fulou.l != this._menfeng) {
        let s = fulou.m[0];
        for (let n of fulou.m.match(/\d(?![\+\=\-])/g)) {
            this.diaopai(s+n);
        }
    }
}

gang(gang) {
    if (gang.l != this._menfeng) {
        if (gang.m.match(/^[mpsz]\d{4}$/)) {
            let s = gang.m[0];
            for (let n of gang.m.match(/\d/g)) {
                this.diaopai(s+n);
            }
        }
        else {
            let s = gang.m[0], n = gang.m.substr(-1);
            this.diaopai(s+n);
        }
    }
}

kaigang(kaigang) {
    this._baopai.push(kaigang.baopai);
    this.diaopai(kaigang.baopai);
}

}
