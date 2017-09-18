/*
 *  Majiang.He
 */
"use strict";

const Majiang = {
    Shoupai: require('./shoupai')
};

module.exports = class He {

constructor() {
    this._pai = [];
}

dapai(p) {
    if (! Majiang.Shoupai.valid_pai(p)) throw new Error(p);
    if (p.match(/[\+\=\-]$/))           throw new Error(p);
    this._pai.push(p);
    return this;
}

fulou(d) {
    if (! d.match(/[\+\=\-]/))          throw new Error(d);
    this._pai[this._pai.length - 1] += d;
    return this;
}

}
