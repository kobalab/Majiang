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

})();
