/*
 * Majiang.Dev.Shan
 */
"use strict";

const Majiang = require('../../majiang');

module.exports = class Shan {

    constructor(pai) {
        this._wangpai = pai.splice(0, 14);
        this._qipai   = pai.splice(0, 13 * 4);
        this._zimo    = [[],[],[],[]];
        let l = 0;
        while (pai.length) {
            this._zimo[l].push(pai.shift());
            l = (l + 1) % 4;
        }
        this._lunban = -1;
        this._paishu = 136 - 14;

        this._baopai   = [];
        this._fubaopai = [];
        this.kaigang();
    }
    static zhenbaopai(p) { return Majiang.Shan.zhenbaopai(p) }
    lunban(l) { this._lunban = (l + 1) % 4 }
    paishu()  { return this._paishu }
    zimo() {
        this._paishu--;
        if (this._lunban < 0) return this._qipai.shift();
        if (this._zimo[this._lunban].length)
                            return this._zimo[this._lunban].shift();
        let l = [0,1,2,3].reduce((x,y)=>
                        this._zimo[x].length > this._zimo[y].length ? x : y);
        return this._zimo[l].pop();
    }
    gangzimo() { return this.zimo() }
    baopai()   { return this._baopai.concat()   }
    fubaopai() { return this._fubaopai.concat() }
    kaigang() {
        this._baopai.push(this._wangpai.shift());
        this._fubaopai.push(this._wangpai.shift());
    }
}
