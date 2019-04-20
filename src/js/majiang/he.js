/*
 *  Majiang.He
 */
"use strict";

const Majiang = {
    Shoupai: require('./shoupai')
};

module.exports = class He {

constructor() {
    this._pai  = [];
    this._find = {}
}

dapai(p) {
    if (! Majiang.Shoupai.valid_pai(p)) throw new Error(p);
    if (p.match(/[\+\=\-]$/))           throw new Error(p);
    this._pai.push(p);
    this._find[p.substr(0,2).replace(/0/,'5')] = true;
    return this;
}

fulou(d) {
    if (! d.match(/[\+\=\-]/))          throw new Error(d);
    this._pai[this._pai.length - 1] += d;
    return this;
}

find(p) {
    return this._find[p.substr(0,2).replace(/0/,'5')];
}

}
