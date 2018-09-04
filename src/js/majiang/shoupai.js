/*
 *  Majiang.Shoupai
 */
"use strict";

module.exports = class Shoupai {

constructor(qipai) {

    this._bingpai = {
        m: [0,0,0,0,0,0,0,0,0,0],
        p: [0,0,0,0,0,0,0,0,0,0],
        s: [0,0,0,0,0,0,0,0,0,0],
        z: [0,0,0,0,0,0,0,0],
    };
    this._fulou = [];
    this._zimo  = null;
    this._lizhi = false;

    if (! qipai) return;
    for (let p of qipai) {
        let [s, n] = p;
        this._bingpai[s][n]++;
        if (s != 'z' && n == 0) this._bingpai[s][5]++;
    }
}

static valid_pai(p) {
    if (p.match(/^(?:[mps]\d|z[1-7])_?\*?[\+\=\-]?$/)) return p;
}

static valid_mianzi(m) {

    let h = (m[0] == 'z') ? m.replace(/[089]/g,'')
                          : m.replace(/0/g,'5');
    if (h.match(/^[mpsz](\d)\1\1[\+\=\-]\1?$/)) {
        return m.replace(/([mps])05/,'$1'+'50');
    }
    else if (h.match(/^[mpsz](\d)\1\1\1[\+\=\-]?$/)) {
        return m[0]+m.match(/\d(?![\+\=\-])/g).sort().reverse().join('')
                   +(m.match(/\d[\+\=\-]$/)||[''])[0];
    }
    else if (h.match(/^[mps]\d+\-\d*$/)) {
        let hongpai = m.match(/0/);
        let nn = h.match(/\d/g).sort();
        if (nn.length != 3)                               return;
        if (+nn[0] + 1 != +nn[1] || +nn[1] + 1 != +nn[2]) return;
        h = h[0]+h.match(/\d[\+\=\-]?/g).sort().join('');
        return hongpai ? h.replace(/5/,'0') : h;
    }
}

static fromString(paistr) {

    paistr      = paistr || '';
    let qipai   = [];
    let fulou   = paistr.split(',');
    let bingpai = fulou.shift();
    let lizhi   = (bingpai && bingpai.substr(-1) == '*') || false;

    for (let suitstr of bingpai.match(/[mpsz]\d+/g) || []) {
        let s = suitstr[0];
        for (let n of suitstr.match(/\d/g)) {
            if (s == 'z' && (n < 1 || 7 < n)) continue;
            qipai.push(s+n);
        }
    }
    while (qipai.length > 14 - fulou.filter(x=>x).length * 3) qipai.pop();
    let zimo = (qipai.length - 2) % 3 == 0 && qipai.slice(-1)[0];
    const shoupai = new Shoupai(qipai);

    let last;
    for (let m of fulou) {
        if (!m) { shoupai._zimo = last; break }
        m = Shoupai.valid_mianzi(m);
        if (m) {
            shoupai._fulou.push(m);
            shoupai._zimo = null;
            last = m;
        }
    }

    shoupai._zimo  = shoupai._zimo || zimo || null;
    shoupai._lizhi = lizhi;

    return shoupai;
}

toString() {

    let paistr = '';

    for (let s of ['m','p','s','z']) {
        let suitstr   = s;
        let bingpai   = this._bingpai[s];
        let n_hongpai = (s != 'z') ? bingpai[0] : 0;
        for (let n = 1; n < bingpai.length; n++) {
            let n_pai = bingpai[n];
            if (this._zimo && s+n == this._zimo) n_pai--;
            if (this._zimo && s != 'z' && n == 5 && s+0 == this._zimo) {
                n_hongpai--;
                n_pai--;
            }
            for (let i = 0; i < n_pai; i++) {
                if (n == 5 && n_hongpai > 0) { suitstr += 0; n_hongpai-- }
                else                           suitstr += n;
            }
        }
        if (suitstr.length > 1) paistr += suitstr;
    }
    if (this._zimo && this._zimo.length == 2) paistr += this._zimo;
    if (this._lizhi)                          paistr += '*';

    for (let m of this._fulou) {
        paistr += ',' + m;
    }
    if (this._zimo && this._zimo.length > 2)  paistr += ',';

    return paistr;
}

clone() {

    const shoupai = new Shoupai();

    shoupai._bingpai = {
        m: this._bingpai.m.concat(),
        p: this._bingpai.p.concat(),
        s: this._bingpai.s.concat(),
        z: this._bingpai.z.concat(),
    };
    shoupai._fulou = this._fulou.concat();
    shoupai._zimo  = this._zimo;
    shoupai._lizhi = this._lizhi;

    return shoupai;
}

zimo(p) {
    if (! Shoupai.valid_pai(p))                 throw new Error(p);
    if (this._zimo)                             throw new Error([this,p]);
    let [s, n] = p;
    let bingpai = this._bingpai[s];
    if (bingpai[n] == 4)                        throw new Error([this,p]);
    bingpai[n]++;
    if (n == 0) bingpai[5]++;
    this._zimo = p.substr(0,2);
    return this;
}

dapai(p) {
    if (! Shoupai.valid_pai(p))                 throw new Error(p);
    if (! this._zimo)                           throw new Error([this,p]);
    let [s, n] = p;
    let bingpai = this._bingpai[s];
    if (bingpai[n] == 0)                        throw new Error([this,p]);
    if (n == 5 && bingpai[0] == bingpai[5])     throw new Error([this,p]);
    bingpai[n]--;
    if (n == 0) bingpai[5]--;
    this._zimo = null;
    if (p.match(/\*/)) this._lizhi = true;
    return this;
}

fulou(m) {
    if (m != Shoupai.valid_mianzi(m))           throw new Error(m);
    if (this._zimo)                             throw new Error([this,m]);
    let [s] = m;
    let bingpai = this._bingpai[s];
    for (let n of m.match(/\d(?![\+\=\-])/g)) {
        if (bingpai[n] == 0)                    throw new Error([this,m]);
        if (n == 5 && bingpai[0] == bingpai[5]) throw new Error([this,p]);
        bingpai[n]--;
        if (n == 0) bingpai[5]--;
    }
    this._fulou.push(m);
    if (! m.match(/\d{4}/)) this._zimo = m;
    return this;
}

gang(p) {
    if (! Shoupai.valid_pai(p))                 throw new Error(p);
    if (! this._zimo || this._zimo.length != 2) throw new Error([this,p]);
    let [s, n] = p;
    let bingpai = this._bingpai[s];
    if (bingpai[n] > 3) {
        let m = s+n+n+n+n;
        if (s != 'z' && n == 5) {
            while (bingpai[0]) {
                m = m.replace(/5(?!5)/,'0');
                bingpai[0]--;
            }
        }
        bingpai[n] -= 4;
        this._fulou.push(m);
    }
    else {
        if (bingpai[n] == 0)                    throw new Error([this,p]);
        if (n == 5 && bingpai[0] == bingpai[5]) throw new Error([this,p]);
        const regexp = (s != 'z' && (n == 0 || n == 5))
                            ? new RegExp(`^${s}[05]{3}`)
                            : new RegExp(`^${s}${n}{3}`);
        let i = this._fulou.findIndex(m=>m.match(regexp));
        if (i < 0)                              throw new Error([this,p]);
        this._fulou[i] += n;
        bingpai[n]--;
        if (n == 0) bingpai[5]--;
    }
    this._zimo = null;
    return this;
}

menqian() {
    return (this._fulou.filter(m=>m.match(/[\+\=\-]/)).length == 0);
}

lizhi() {
    return this._lizhi;
}

get_dapai() {

    if (! this._zimo)                           throw new Error([this,p]);;

    let deny = {};
    let s = this._zimo[0];
    let m = (s == 'z') ? this._zimo : this._zimo.replace(/0/,'5');
    let n = + m.match(/\d(?=[\+\=\-])/);
    if (n) {
        deny[s+n] = true;
        if (! m.match(/^[mpsz](\d)\1\1/)) {
            if (n < 7 && m.match(/^[mps]\d\-\d\d$/)) deny[s+(n+3)] = true;
            if (3 < n && m.match(/^[mps]\d\d\d\-$/)) deny[s+(n-3)] = true;
        }
    }

    let pai = [];

    for (let s of ['m','p','s','z']) {
        let bingpai = this._bingpai[s];
        for (let n = 1; n < bingpai.length; n++) {
            if (bingpai[n] == 0) continue;
            if (deny[s+n])       continue;
            if (s == 'z' || n != 5)          pai.push(s+n);
            else {
                if (bingpai[0] > 0)          pai.push(s+0);
                if (bingpai[0] < bingpai[5]) pai.push(s+n);
            }
        }
    }

    return pai;
}

get_chi_mianzi(p) {

    if (! Shoupai.valid_pai(p))                 throw new Error(p);
    if (this._zimo)                             throw new Error([this,p]);

    let mianzi = [];

    let [s, n, d] = p.replace(/[\_\*]/g,''); n = +n || 5;
    if (! d)                                    throw new Error([this,p]);
    if (s == 'z' || d != '-') return mianzi;

    let bingpai = this._bingpai[s];
    const hongpai_first = n => (n == 5 && bingpai[0] > 0) ? 0 : n;
    let [p0, p1, p2] = [p[1]];

    if (3 <= n && bingpai[n-2] > 0 && bingpai[n-1] > 0) {
        p1 = hongpai_first(n-2);
        p2 = hongpai_first(n-1);
        if ((3 < n ? bingpai[n-3] : 0) + bingpai[n]
                < 14 - (this._fulou.length + 1) * 3)
                                        mianzi.push(s + p1 + p2 + (p0+d));
    }
    if (2 <= n && n <= 8 && bingpai[n-1] > 0 && bingpai[n+1] > 0) {
        p1 = hongpai_first(n-1);
        p2 = hongpai_first(n+1);
        if (bingpai[n] < 14 - (this._fulou.length + 1) * 3)
                                        mianzi.push(s + p1 + (p0+d) + p2);
    }
    if (n <= 7 && bingpai[n+1] > 0 && bingpai[n+2] > 0) {
        p1 = hongpai_first(n+1);
        p2 = hongpai_first(n+2);
        if (bingpai[n] + (n < 7 ? bingpai[n+3] : 0)
                < 14 - (this._fulou.length + 1) * 3)
                                        mianzi.push(s + (p0+d) + p1 + p2);
    }

    return mianzi;
}

get_peng_mianzi(p) {

    if (! Shoupai.valid_pai(p))                 throw new Error(p);
    if (this._zimo)                             throw new Error([this,p]);

    let mianzi = [];

    let [s, n, d] = p.replace(/[\_\*]/g,''); n = +n || 5;
    if (! d)                                    throw new Error([this,p]);

    let bingpai = this._bingpai[s];
    const hongpai_first = (n, x) => (n == 5 && bingpai[0] > x) ? 0 : n;
    let [p0, p1, p2] = [p[1]];

    if (bingpai[n] >= 2) {
        p1 = hongpai_first(n, 1);
        p2 = hongpai_first(n, 0);
        mianzi = [ s + p1 + p2 + (p0+d) ];
    }

    return mianzi;
}

get_gang_mianzi(p) {

    let mianzi = [];

    if (p) {
        if (! Shoupai.valid_pai(p))             throw new Error(p);
        if (this._zimo)                         throw new Error([this,p]);

        let [s, n, d] = p.replace(/[\_\*]/g,''); n = +n || 5;
        if (! d)                                throw new Error([this,p]);

        let bingpai = this._bingpai[s];
        const hongpai_first = (n, x) => (n == 5 && bingpai[0] > x) ? 0 : n;
        let [p0, p1, p2, p3] = [p[1]];

        if (bingpai[n] == 3) {
            p1 = hongpai_first(n, 2);
            p2 = hongpai_first(n, 1);
            p3 = hongpai_first(n, 0);
            mianzi = [ s + p1 + p2 + p3 + (p0+d) ];
        }
    }
    else {
        if (! this._zimo)                       throw new Error([this,p]);
        if (this._zimo.length != 2)             throw new Error([this,p]);

        for (let s of ['m','p','s','z']) {
            let bingpai = this._bingpai[s];
            const hongpai_first = (n, x) => (n == 5 && bingpai[0] > x) ? 0 : n;

            for (let n = 1; n < bingpai.length; n++) {
                if (bingpai[n] == 0) continue;
                if (bingpai[n] == 4) {
                    let p0 = hongpai_first(n, 3);
                    let p1 = hongpai_first(n, 2);
                    let p2 = hongpai_first(n, 1);
                    let p3 = hongpai_first(n, 0);
                    mianzi.push(s + p0 + p1 +p2 + p3)
                }
                else {
                    for (let m of this._fulou) {
                        if (m.replace(/0/g,'5').substr(0,4) == s+n+n+n) {
                            let p0 = hongpai_first(n, 0);
                            mianzi.push(m+p0);
                        }
                    }
                }
            }
        }
    }

    return mianzi;
}

}
