/*
 *  Majiang.Shan
 */
"use strict";

const Majiang = {
    Shoupai: require('./shoupai')
};

module.exports = class Shan {

constructor(hongpai = {m:0,p:0,s:0}) {

    let pai = [];
    for (let s of ['m','p','s','z']) {
        for (let n = 1; n <= (s == 'z' ? 7 : 9); n++) {
            for (let i = 0; i < 4; i++) {
                if (hongpai[s] && n == 5 && i < hongpai[s]) pai.push(s+0);
                else                                        pai.push(s+n);
            }
        }
    }
    this._pai = [];
    while (pai.length) {
        this._pai.push(pai.splice(Math.random()*pai.length, 1)[0]);
    }
    this._baopai   = [this._pai[4]];
    this._fubaopai = [this._pai[9]];
    this._weikaigang = false;
}

static zhenbaopai(p) {
    if (! Majiang.Shoupai.valid_pai(p)) throw new Error(p);
    let [s, n] = p;
    return (s == 'z') ? (n < 5  ? s + (n % 4 + 1) : s + ((n - 4) % 3 + 5))
                      : (n == 0 ? s + 6 : s + (n % 9 + 1));
}

paishu() {
    return this._pai.length - 14;
}

zimo() {
    if (this.paishu() == 0) throw new Error(this);
    if (this._weikaigang)   throw new Error(this);
    return this._pai.pop();
}

baopai() {
    return this._baopai.concat();
}

fubaopai() {
    return this._fubaopai.concat();
}

gangzimo() {
    if (this.paishu() == 0)       throw new Error(this);
    if (this._baopai.length == 5) throw new Error(this);
    if (this._weikaigang)         throw new Error(this);
    this._weikaigang = true;
    return this._pai.shift();
}

kaigang() {
    if (! this._weikaigang) throw new Error(this);
    this._baopai.push(this._pai[4]);
    this._fubaopai.push(this._pai[9]);
    this._weikaigang = false;
    return this;
}

}
