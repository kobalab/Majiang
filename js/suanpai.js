/*
 *  Majiang.SuanPai
 */

(function(){

Majiang.SuanPai = function(hongpai) {

    this._paishu = {
        m: [0,4,4,4,4,4,4,4,4,4],
        p: [0,4,4,4,4,4,4,4,4,4],
        s: [0,4,4,4,4,4,4,4,4,4],
        z: [0,4,4,4,4,4,4,4],
    }
    if (hongpai) {
        this._paishu.m[0] = hongpai.m;
        this._paishu.p[0] = hongpai.p;
        this._paishu.s[0] = hongpai.s;
    }
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
        rv = this.paishu(s+n) * weight(s+n);
    }
    else {
        var left   = (1 <= n-2)
                   ? Math.min(this.paishu(s+(n-2)), this.paishu(s+(n-1))) : 0;
        var center = (1 <= n-1 && n+1 <= 9)
                   ? Math.min(this.paishu(s+(n-1)), this.paishu(s+(n+1))) : 0;
        var right  = (n+2 <= 9)
                   ? Math.min(this.paishu(s+(n+1)), this.paishu(s+(n+2))) : 0;

        rv = left                    * weight(s, n-2)
           + Math.max(left, center)  * weight(s, n-1)
           + this.paishu(s+n)        * weight(s, n)
           + Math.max(center, right) * weight(s, n+1)
           + right                   * weight(s, n+2);
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

})();
