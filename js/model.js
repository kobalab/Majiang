/*
 *  Majiang.Shoupai
 */

(function(){

Majiang.Shoupai = function(qipai) {

    this._bingpai = {
        m: [0,0,0,0,0,0,0,0,0,0],
        p: [0,0,0,0,0,0,0,0,0,0],
        s: [0,0,0,0,0,0,0,0,0,0],
        z: [0,0,0,0,0,0,0,0],
    };
    this._fulou = [];
    this._zimo  = null;
 
    if (! qipai) return;
    for (var p of qipai) {
        this._bingpai[p[0]][p[1]]++;
        if (p[1] == '0') this._bingpai[p[0]][5]++;
    }
}

Majiang.Shoupai.fromString = function(paistr) {

    var qipai   = [];
    var fulou   = paistr.split(',');
    var bingpai = fulou.shift();
    for (var substr of bingpai.match(/[mpsz]\d+/g) || []) {
        var s = substr[0];
        for (var n of substr.match(/\d/g)) {
            if (s == 'z' && (n < 1 || 7 < n)) continue;
            qipai.push(s+n);
        }
    }
    while (qipai.length > 14 - fulou.length * 3) qipai.pop();
    var zimo = (qipai.length - 2) % 3 == 0 && qipai.pop();
    var shoupai = new Majiang.Shoupai(qipai);
    if (zimo) shoupai.zimo(zimo);
    for (var m of fulou) {
        var h = m.replace(/0/g, '5');
        if (h.match(/^[mpsz](\d)\1\1[\-\+\=]?\1?$/) ||
            h.match(/^[mpsz](\d)\1\1\1[\-\+\=]?$/))
        {
            m = m.replace(/([mps])05/, '$1'+'50');
            shoupai._fulou.push(m);
        }
        else if (h.match(/^[mpsz]\d+\-\d*$/)) {
            var hongpai = m.match(/0/);
            var s = h[0];
            var nn = h.match(/\d[\-\+\=]?/g).sort();
            if (nn.length != 3) continue;
            var n = nn[0][0] - 0;
            if (n + 1 != nn[1][0] || n + 2 != nn[2][0]) continue;
            m = s+nn.join('');
            if (hongpai) m = m.replace(/5/, '0');
            shoupai._fulou.push(m);
        }
    }
 
    return shoupai;
}

Majiang.Shoupai.fromTenhouString = function(tenhoustr) {

    var fulou   = tenhoustr.split(',');
    var bingpai = fulou.shift();
    var paistr  = bingpai.replace(/(\d+)([mpsz])/g, '$2$1');
    if (fulou.length) {
        paistr += ','
                + fulou.reverse().join(',').match(/./g).reverse().join('');
    }
    return Majiang.Shoupai.fromString(paistr);
}

Majiang.Shoupai.prototype.clone = function() {

    var shoupai = new Majiang.Shoupai([]);
 
    shoupai._bingpai = {
        m: this._bingpai.m.concat(),
        p: this._bingpai.p.concat(),
        s: this._bingpai.s.concat(),
        z: this._bingpai.z.concat()
    }
    shoupai._fulou = this._fulou.concat();
    shoupai._zimo  = this._zimo;
 
    return shoupai;
}

Majiang.Shoupai.prototype.toString = function() {

    var paistr = '';
    for (var s of ['m','p','s','z']) {
        var substr = s;
        var bingpai = this._bingpai[s];
        var hongpai = bingpai[0];
        for (var n = 1; n < bingpai.length; n++) {
            var num = bingpai[n];
            if (this._zimo && s+n == this._zimo) num--;
            if (this._zimo && n == 5 && s+'0' == this._zimo) {
                hongpai--;
                num--;
            }
            for (var i = 0; i < num; i++) {
                if (n == 5 && hongpai > 0) { substr += '0'; hongpai-- }
                else                         substr += n;
            }
        }
        if (substr.length > 1) paistr += substr;
    }
    if (this._zimo && this._zimo.length == 2) {
        paistr += this._zimo;
    }
    for (var m of this._fulou) {
        paistr += ',' + m;
    }
    return paistr;
}

Majiang.Shoupai.prototype.toTenhouString = function() {
 
    var paistr  = this.toString();
    var fulou   = paistr.split(',');
    var bingpai = fulou.shift();
    var tenhoustr = bingpai.replace(/([mpsz])(\d+)/g, '$2$1');
    for (var m of fulou) {
        m = m.match(/./g).reverse().join('');
        if (! m.replace(/0/g, '5').match(/(\d)\1\1[mpsz]$/)) {
            m = m.replace(/(\d*)(\-\d)(\d*)/, '$2$1$3');
        }
        tenhoustr += ',' + m;
    }
    return tenhoustr;
}

Majiang.Shoupai.prototype.zimo = function(p) {
    if (! this._zimo) {
        this._zimo = p;
        this._bingpai[p[0]][p[1]]++;
        if (p[0] != 'z' && p[1] == '0') this._bingpai[p[0]][5]++;
    }
}

Majiang.Shoupai.prototype.dapai = function(p) {
    if (this._zimo) {
        this._zimo = null;
        this._bingpai[p[0]][p[1]]--;
        if (p[1] == '0') this._bingpai[p[0]][5]--;
    }
}

Majiang.Shoupai.prototype.fulou = function(m) {
    if (! this._zimo) {
        this._fulou.push(m);
        for (var n of m.match(/\d(?![\-\+\=])/g)) {
            this._bingpai[m[0]][n]--;
            if (n == '0') this._bingpai[m[0]][5]--;
        }
        if (! m.match(/\d{4}/)) this._zimo = m;
    }
}

Majiang.Shoupai.prototype.gang = function(p) {
    if (this._zimo && this._zimo.length == 2) {
        p = p.replace(/0/g,'5');
        if (this._bingpai[p[0]][p[1]] > 3) {
            var m = p[0]+p[1]+p[1]+p[1]+p[1];
            if (p[1] == '5') {
                while (this._bingpai[p[0]][0]) {
                    m = m.replace(/5(?!5)/, '0');
                    this._bingpai[p[0]][0]--;
                }
            }
            this._fulou.push(m);
            this._bingpai[p[0]][p[1]] -= 4;
        }
        else {
            var regexp = p[1] == '5'
                            ? new RegExp('^' + p[0] + '[05]{3}')
                            : new RegExp('^' + p[0] + p[1] + '{3}');
            for (var i = 0; i < this._fulou.length; i++) {
                if (this._fulou[i].match(regexp)) {
                    if (p[1] == '5' && this._bingpai[p[0]][0]) {
                        this._fulou[i] += '0';
                        this._bingpai[p[0]][0]--;
                    }
                    else {
                        this._fulou[i] += p[1];
                    }
                    this._bingpai[p[0]][p[1]]--;
                }
            }
        }
        this._zimo = null;
    }
}

})();


/*
 *  Majiang.Shan
 */

(function(){

Majiang.Shan = function(hongpai) {

    if (! hongpai) hongpai = { m: 0, p: 0, s: 0 };

    var pai = [];
    for (var s of ['m','p','s','z']) {
        for (var n = 1; n <= (s == 'z' ? 7 : 9); n++) {
            for (var i = 0; i < 4; i++) {
                if (hongpai[s] && n == 5 && i < hongpai[s]) pai.push(s+'0');
                else                                        pai.push(s+n);
            }
        }
    }
    this._pai = [];
    while (pai.length > 0) {
        var r = Math.floor(Math.random()*pai.length);
        var p = pai[r];
        pai.splice(r, 1);
        this._pai.push(p);
    }
 
    this._baopai   = [this._pai[4]];
    this._fubaopai = [this._pai[9]];
 
    this._weikaigang = false;
}

Majiang.Shan.zhenbaopai = function(p) {
    if (p[0] == 'z') return p[1] < 5
                            ? p[0] + (p[1] % 4 + 1)
                            : p[0] + ((p[1] - 4) % 3 + 5);
    else             return p[1] == '0'
                            ? p[0] + '6'
                            : p[0] + (p[1] % 9 + 1);
}

Majiang.Shan.prototype.paishu = function() {
    return this._pai.length - 14;
}

Majiang.Shan.prototype.zimo = function() {
    if (this.paishu() > 0) return this._pai.pop();
}

Majiang.Shan.prototype.baopai = function() {
    return this._baopai.concat();
}

Majiang.Shan.prototype.fubaopai = function() {
    return this._fubaopai.concat();
}

Majiang.Shan.prototype.gangzimo = function() {
    if (this.paishu() > 0 && this._baopai.length < 5 && ! this._weikaigang) {
        this._weikaigang = true;
        return this._pai.shift();
    }
}

Majiang.Shan.prototype.kaigang = function() {
    if (this._weikaigang) {
        this._baopai.push(this._pai[4]);
        this._fubaopai.push(this._pai[9]);
        this._weikaigang = false;
    }
}

})();


/*
 *  Majiang.He
 */

(function(){

Majiang.He = function() {
    this._pai = [];
}
Majiang.He.prototype.dapai = function(p) {
    this._pai.push(p);
}
Majiang.He.prototype.fulou = function(d) {
    this._pai[this._pai.length - 1] += d;
}

})();


/*
 *  Majiang.Shan.Fake
 */

(function(){

Majiang.Shan.Fake = function(baopai) {

    this._paishu   = 136 - 13 * 4 - 14;
    this._baopai   = [ baopai ];
    this._fubaopai = [];
}

Majiang.Shan.Fake.prototype.paishu = function() {
    return this._paishu;
}

Majiang.Shan.Fake.prototype.zimo = function(p) {
    this._paishu--;
    return p;
}

Majiang.Shan.Fake.prototype.baopai = function() {
    return this._baopai.concat();
}

Majiang.Shan.Fake.prototype.fubaopai = function(pai) {
    if (pai)    this._fubaopai = pai;
    else return this._fubaopai.concat();
}

Majiang.Shan.Fake.prototype.gangzimo = function() {
    this._paishu--;
    return '';
}

Majiang.Shan.Fake.prototype.kaigang = function(p) {
    this._baopai.push(p);
    return p;
}

})();
