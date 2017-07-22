/*
 *  Majiang.SuanPai
 */

(function(){

Majiang.SuanPai = function(hongpai) {

    this._paishu = {
        m: [0,4,4,4,4,4,4,4,4,4],
        p: [0,4,4,4,4,4,4,4,4,4],
        s: [0,4,4,4,4,4,4,4,4,4],
        z: [0,4,4,4,4,4,4,4]
    }
    if (hongpai) {
        this._paishu.m[0] = hongpai.m;
        this._paishu.p[0] = hongpai.p;
        this._paishu.s[0] = hongpai.s;
    }
 
    this._dapai = [];
    for (var l = 0; l < 4; l++) {
        this._dapai[l] = {};
    }
    this._lizhi = [false, false, false, false];
}

Majiang.SuanPai.prototype.paishu = function(p) {
    return this._paishu[p[0]][p[1]];
}

Majiang.SuanPai.prototype.diaopai = function(p) {
    this._paishu[p[0]][p[1]]--;
    if (p[1] == '0') this._paishu[p[0]][5]--;
}

Majiang.SuanPai.prototype.qipai = function(data, menfeng) {
    this._zhuangfeng = data.zhuangfeng;
    this._menfeng    = menfeng;
    this._baopai     = [ data.baopai ];
    
    var paistr = data.shoupai[this._menfeng];
    for (var substr of paistr.match(/[mpsz]\d+/g)) {
        var s = substr[0];
        for (var n of substr.match(/\d/g)) {
            this.diaopai(s+n);
        }
    }
    this.diaopai(data.baopai);
}

Majiang.SuanPai.prototype.zimo = function(data) {
    if (data.l == this._menfeng) this.diaopai(data.p);
}

Majiang.SuanPai.prototype.dapai = function(data) {
    if (data.l != this._menfeng) this.diaopai(data.p);
 
    var p = data.p.substr(0,2).replace(/0/,'5');
    this._dapai[data.l][p] = true;

    if (data.p.match(/\*$/)) this._lizhi[data.l] = true;
    for (var l = 0; l < 4; l++) {
        if (this._lizhi[l]) this._dapai[l][p] = true;
    }
}

Majiang.SuanPai.prototype.fulou = function(data) {
    if (data.l != this._menfeng) {
        var s = data.m[0];
        for (var n of data.m.match(/\d(?![\-\+\=])/g)) {
            this.diaopai(s+n);
        }
    }
}

Majiang.SuanPai.prototype.gang = function(data) {
    if (data.l != this._menfeng) {
        if (data.m.match(/^[mpsz]\d{4}$/)) {
            var s = data.m[0];
            for (var n of data.m.match(/\d/g)) {
                this.diaopai(s+n);
            }
        }
        else {
            var s = data.m[0], n = data.m.substr(-1);
            this.diaopai(s+n);
        }
    }
}

Majiang.SuanPai.prototype.kaigang = function(data) {
    this._baopai.push(data.baopai);
    this.diaopai(data.baopai);
}

Majiang.SuanPai.prototype.paijia = function(p) {

    function weight(s, n) {
        if (n < 1 || 9 < n) return 0;
        var rv = 1;
        for (var baopai of self._baopai) {
            if (s+n == Majiang.Shan.zhenbaopai(baopai)) rv *= 2;
        }
        return rv;
    }

    var self = this;

    var rv;
    var s = p[0], n = p[1]-0||5;

    if (s == 'z') {
        rv = this.paishu(s+n) * weight(s, n);
    }
    else {
        var left   = (1 <= n-2)
                   ? Math.min(this.paishu(s+(n-2)), this.paishu(s+(n-1))) : 0;
        var center = (1 <= n-1 && n+1 <= 9)
                   ? Math.min(this.paishu(s+(n-1)), this.paishu(s+(n+1))) : 0;
        var right  = (n+2 <= 9)
                   ? Math.min(this.paishu(s+(n+1)), this.paishu(s+(n+2))) : 0;

        var n_pai = [
            left,
            Math.max(left, center),
            this.paishu(s+n),
            Math.max(center, right),
            right
        ];
        var n_hongpai = this.paishu(s+'0');

        rv  = n_pai[0] * weight(s, n-2)
            + n_pai[1] * weight(s, n-1)
            + n_pai[2] * weight(s, n)
            + n_pai[3] * weight(s, n+1)
            + n_pai[4] * weight(s, n+2);
 
        rv += n_hongpai == 0 ? 0
            : (n == 7)       ? Math.min(n_hongpai, n_pai[0]) * weight(s, n-2)
            : (n == 6)       ? Math.min(n_hongpai, n_pai[1]) * weight(s, n-1)
            : (n == 5)       ? Math.min(n_hongpai, n_pai[2]) * weight(s, n)
            : (n == 4)       ? Math.min(n_hongpai, n_pai[3]) * weight(s, n+1)
            : (n == 3)       ? Math.min(n_hongpai, n_pai[4]) * weight(s, n+2)
            :                  0;
    }

    if (p[1] == '0')                   rv *= 2;
    if (p == 'z'+(this._zhuangfeng+1)) rv *= 2;
    if (p == 'z'+(this._menfeng+1))    rv *= 2;
    if (p.match(/^z[567]/))            rv *= 2;
    rv *= weight(s, n);

    return rv;
}

Majiang.SuanPai.prototype.paijia_all = function() {

    var paijia = { m: [], p: [], s: [], z: [] };
    for (var s of ['m','p','s','z']) {
        var nn = (s == 'z') ? [1,2,3,4,5,6,7] : [0,1,2,3,4,5,6,7,8,9];
        for (var n of nn) {
            paijia[s][n] = this.paijia(s+n);
        }
    }
    return paijia;
}

Majiang.SuanPai.prototype.suan_weixian = function(p, l) {

    var s = p[0], n = p[1]-0||5;
 
    if (this._dapai[l][s+n]) return 0;
 
    if (s == 'z')   return Math.min(this.paishu(s+n), 3);
    if (n == 1)     return this._dapai[l][s+(n+3)] ? 3 : 6;
    if (n == 9)     return this._dapai[l][s+(n-3)] ? 3 : 6;
    if (n == 2)     return this._dapai[l][s+(n+3)] ? 4 : 8;
    if (n == 8)     return this._dapai[l][s+(n-3)] ? 4 : 8;
    if (n == 3)     return this._dapai[l][s+(n+3)] ? 5 : 8;
    if (n == 7)     return this._dapai[l][s+(n-3)] ? 5 : 8;

    return    this._dapai[l][s+(n-3)] && this._dapai[l][s+(n+3)] ?  4
            : this._dapai[l][s+(n-3)] || this._dapai[l][s+(n+3)] ?  8
            :                                                      12;
}

Majiang.SuanPai.prototype.suan_weixian_all = function(l) {

    var weixian = { m: [], p: [], s: [], z: [] };
    for (var s of ['m','p','s','z']) {
        var nn = (s == 'z') ? [1,2,3,4,5,6,7] : [0,1,2,3,4,5,6,7,8,9];
        for (var n of nn) {
            weixian[s][n] = this.suan_weixian(s+n, l);
        }
    }
    return weixian;
}

})();
