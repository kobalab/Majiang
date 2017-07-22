/*
 *  Majiang.Player
 */

(function(){

Majiang.Player = function(id) {
    this._id = id;
}

Majiang.Player.prototype.action = function(type, data, callback) {

    if      (type == 'kaiju')    this.kaiju(data);
    else if (type == 'qipai')    this.qipai(data);
    else if (type == 'zimo')     this.zimo(data, callback);
    else if (type == 'dapai')    this.dapai(data, callback);
    else if (type == 'fulou')    this.fulou(data, callback);
    else if (type == 'gang')     this.gang(data, callback);
    else if (type == 'kaigang')  this.kaigang(data);
    else if (type == 'gangzimo') this.zimo(data, callback, 'lingshang');
    else if (type == 'hule')     this.hule(data, callback);
    else if (type == 'pingju')   this.pingju(data, callback);
    else if (type == 'jieju')    this.jieju(data, callback);
}

Majiang.Player.prototype.wait = function(callback) { callback() }

Majiang.Player.prototype.kaiju = function(data) {

    this._chang = {
        player:  data.player,
        qijia:   data.qijia,
        hongpai: data.hongpai
    }
}

Majiang.Player.prototype.qipai = function(data) {

    this._zhuangfeng = data.zhuangfeng;
    this._menfeng    = (8 + this._id - this._chang.qijia - data.jushu) % 4;
    this._changbang  = data.changbang;
    this._lizhibang  = data.lizhibang;
    this._defen      = data.defen;
 
    this._shoupai    = Majiang.Shoupai.fromString(data.shoupai[this._menfeng]);
    this._menqian    = true;
    this._dapai      = {};
    this._neng_rong  = true;
 
    this._paishu     = 136 - 13 * 4 - 14;
    this._baopai     = [ data.baopai ];
    this._diyizimo   = true;
    this._lizhi      = [0, 0, 0, 0];
    this._yifa       = [false, false, false, false];

    this._suanpai = new Majiang.SuanPai(this._chang.hongpai)
    this._suanpai.qipai(data, this._menfeng);
}

Majiang.Player.prototype.zimo = function(data, callback, option) {

    this._suanpai.zimo(data);

    this._paishu--;
 
    if (data.l != this._menfeng) { callback(); return }
 
    this._shoupai.zimo(data.p);
 
    this.action_zimo(data, callback, option);

    this._diyizimo = false;
}

Majiang.Player.prototype.action_zimo = function(data, callback, option) {

    var mianzi;
    if (this.select_hule(null, option))   callback('hule');
    else if (this.select_pingju())        callback('pingju');
    else if (mianzi = this.select_gang()) callback('gang', mianzi);
    else                                  callback('dapai', this.select_dapai());
}

Majiang.Player.prototype.dapai = function(data, callback) {

    this._suanpai.dapai(data);

    this._yifa[data.l] == false;

    if (data.l == this._menfeng) {
 
        this._shoupai.dapai(data.p);
 
        if (! this._lizhi[this._menfeng]) this._neng_rong = true;
        this._dapai[data.p[0]+(data.p[1]||'5')] = true;
        if (Majiang.Util.xiangting(this._shoupai) == 0) {
            for (var p of Majiang.Util.tingpai(this._shoupai)) {
                if (this._dapai[p]) this._neng_rong = false;
            }
        }
 
        callback();
    }
    else {
        this.action_dapai(data, callback);
    } 
 
    if (data.p.match(/\*$/)) {
        this._lizhi[data.l] = this._diyizimo ? 2 : 1;
        this._yifa[data.l]  = true;
        this._lizhibang++;
    }

    var new_shoupai = this._shoupai.clone();
    new_shoupai.zimo(data.p.substr(0,2));
    if (Majiang.Util.xiangting(new_shoupai) == -1) {
        this._neng_rong = false;
    }
}

Majiang.Player.prototype.action_dapai = function(data, callback) {

    var mianzi;
    if      (this.select_hule(data))           callback('hule');
    else if (mianzi = this.select_fulou(data)) callback('fulou', mianzi);
    else                                       callback();
}

Majiang.Player.prototype.fulou = function(data, callback) {

    this._suanpai.fulou(data);

    this._diyizimo = false;
    this._yifa     = [false, false, false, false];
 
    if (data.l != this._menfeng) {
        callback();
        return;
    }
 
    this._shoupai.fulou(data.m);
    this._menqian = false;
 
    if (data.m.match(/^[mpsz]\d{4}/)) {
        callback();
        return;
    }

    this.action_fulou(data, callback);
}

Majiang.Player.prototype.action_fulou = function(data, callback) {

    callback('dapai', this.select_dapai());
}

Majiang.Player.prototype.gang = function(data, callback) {

    this._suanpai.gang(data);

    this._diyizimo = false;
    this._yifa     = [false, false, false, false];

    if (data.l == this._menfeng) {
        this._shoupai.gang(data.m);
        callback();
        return;
    }
 
    if (! data.m.match(/^[mpsz]\d{4}/)) {
 
        this.action_gang(data, callback);

        var new_shoupai = this._shoupai.clone();
        new_shoupai.zimo(data.m.substr(0,2));
        if (Majiang.Util.xiangting(new_shoupai) == -1) {
            this._neng_rong = false;
        }
    }
    else callback();
}

Majiang.Player.prototype.action_gang = function(data, callback) {
 
    if (this.select_hule(data, 'qianggang')) callback('hule');
    else                                     callback();
}

Majiang.Player.prototype.kaigang = function(data) {

    this._suanpai.kaigang(data);

    this._baopai.push(data.baopai);
}

Majiang.Player.prototype.hule = function(data, callback) {
    this.wait(callback);
}

Majiang.Player.prototype.pingju = function(data, callback) {
    this.wait(callback);
}

Majiang.Player.prototype.jieju = function(data, callback) {
    this.wait(callback);
}

Majiang.Player.prototype.get_dapai = function() {

    var pai = []
 
    if (this._lizhi[this._menfeng]) return [ this._shoupai._zimo ];
 
    var fulou = this._shoupai._zimo.replace(/0/,'5');
    var deny = {};
    var chipai = fulou.match(/\d(?=[\-\+\=])/);
    if (chipai) {
        var s = fulou[0];
        var n = chipai[0] -0;
        deny[s+n] = true;
        if (! fulou.match(/^[mpsz](\d)\1\1.*$/)) {
            if (n < 7 && fulou.match(/^[mps]\d\-\d\d$/)) deny[s+(n+3)] = true;
            if (3 < n && fulou.match(/^[mps]\d\d\d\-$/)) deny[s+(n-3)] = true;
        }
    }
 
    for (var s in this._shoupai._bingpai) {
        var bingpai = this._shoupai._bingpai[s];
        for (var n = 1; n < bingpai.length; n++) {
            if (bingpai[n] == 0) continue;
            if (deny[s+n]) continue;
            if (n != 5)                         pai.push(s+n);
            else {
                if (bingpai[0] > 0)             pai.push(s+'0');
                if (bingpai[0] < bingpai[5])    pai.push(s+'5');
            }
        }
    }
 
    return pai;
}

function get_chi_mianzi(shoupai, p) {

    var mianzi = [];
    
    var s = p[0], n = p[1] -0 || 5, d = p[2];
    if (s == 'z' || d != '-') return mianzi;
    
    var bingpai = shoupai._bingpai[s];
    var p0 = p[1], p1, p2;
    
    if (3 <= n && bingpai[n-2] > 0 && bingpai[n-1] > 0) {
        p1 = (n-2 == 5 && bingpai[0] > 0) ? 0 : n-2;
        p2 = (n-1 == 5 && bingpai[0] > 0) ? 0 : n-1;
        if (shoupai._fulou.length == 3
            && bingpai[n] == 1 && 3 < n && bingpai[n-3] == 1)
            ;
        else mianzi.push(s + p1 + p2 + (p0+d));
    }
    if (n <= 7 && bingpai[n+1] > 0 && bingpai[n+2] > 0) {
        p1 = (n+1 == 5 && bingpai[0] > 0) ? 0 : n+1;
        p2 = (n+2 == 5 && bingpai[0] > 0) ? 0 : n+2;
        if (shoupai._fulou.length == 3
            && bingpai[n] == 1 && n < 7 && bingpai[n+3] == 1)
            ;
        else mianzi.push(s + (p0+d) + p1 + p2);
    }
    if (2 <= n &&  n <= 8 && bingpai[n-1] > 0 && bingpai[n+1] > 0) {
        p1 = (n-1 == 5 && bingpai[0] > 0) ? 0 : n-1;
        p2 = (n+1 == 5 && bingpai[0] > 0) ? 0 : n+1;
        if (shoupai._fulou.length == 3 && bingpai[n] == 2) ;
        else mianzi.push(s + p1 + (p0+d) + p2);
    }
    
    return mianzi;
}

Majiang.Player.prototype.get_chi_mianzi = function(data) {

    if (this._paishu == 0) return [];
    if (this._lizhi[this._menfeng]) return [];
 
    var d = ['','+','=','-'][(4 + data.l - this._menfeng) % 4];

    return get_chi_mianzi(this._shoupai, data.p.substr(0,2)+d);
}

function get_peng_mianzi(shoupai, p) {

    var mianzi = [];
 
    var s = p[0], n = p[1] -0 || '5', d = p[2];
    var bingpai = shoupai._bingpai[s];
 
    if (bingpai[n] >= 2) {
        var p0 = p[1];
        var p1 = (n == 5 && bingpai[0] > 1) ? 0 : n;
        var p2 = (n == 5 && bingpai[0] > 0) ? 0 : n;
        mianzi = [ (s + p1 + p2 + (p0+d)) ];
    }
 
    return mianzi;
}

Majiang.Player.prototype.get_peng_mianzi = function(data) {

    if (this._paishu == 0) return [];
    if (this._lizhi[this._menfeng]) return [];
 
    var d = ['','+','=','-'][(4 + data.l - this._menfeng) % 4];

    return get_peng_mianzi(this._shoupai, data.p.substr(0,2)+d);
}

Majiang.Player.prototype.get_gang_mianzi = function(data) {

    var mianzi = [];
 
    if (this._paishu == 0) return mianzi;
    if (this._baopai.length == 5) return mianzi;
 
    if (data) {
        if (this._lizhi[this._menfeng]) return mianzi;
 
        var s = data.p[0], n = data.p[1] -0 || 5;
        var d = ['','+','=','-'][(4 + data.l - this._menfeng) % 4];
        var bingpai = this._shoupai._bingpai[s];
 
        if (bingpai[n] == 3) {
            var p0 = data.p[1];
            var p1 = (n == 5 && bingpai[0] > 2) ? 0 : n;
            var p2 = (n == 5 && bingpai[0] > 1) ? 0 : n;
            var p3 = (n == 5 && bingpai[0] > 0) ? 0 : n;
            mianzi = [ (s + p1 + p2 + p3 + (p0+d)) ]
        }
    }
    else {
        for (var s in this._shoupai._bingpai) {
            var bingpai = this._shoupai._bingpai[s];
            for (var n = 1; n < bingpai.length; n++) {
                if (bingpai[n] == 0) continue;
                if (bingpai[n] == 4) {
                    var p0 = (n == 5 && bingpai[0] > 3) ? 0 : n;
                    var p1 = (n == 5 && bingpai[0] > 2) ? 0 : n;
                    var p2 = (n == 5 && bingpai[0] > 1) ? 0 : n;
                    var p3 = (n == 5 && bingpai[0] > 0) ? 0 : n;
                    mianzi.push(s + p0 + p1 + p2 + p3);
                }
                else {
                    for (var m of this._shoupai._fulou) {
                        if (m.replace(/0/g,'5').substr(0,4) == s+n+n+n) {
                            var p0 = (n == 5 && bingpai[0] > 0) ? 0 : n;
                            mianzi.push(m+p0);
                        }
                    }
                }
            }
        }
        if (this._lizhi[this._menfeng] && mianzi.length > 0) {

            var new_shoupai = this._shoupai.clone();
            new_shoupai.dapai(this._shoupai._zimo);
            var tingpai = Majiang.Util.tingpai(new_shoupai).join(',');
 
            for (var m of mianzi) {
                if (this._shoupai._zimo.replace(/0/,'5')
                                != m.replace(/0/,'5').substr(0,2)) continue;
                new_shoupai = this._shoupai.clone();
                new_shoupai.gang(m);
                if (Majiang.Util.xiangting(new_shoupai) == 0
                    && Majiang.Util.tingpai(new_shoupai).join(',') == tingpai) {
                    return [ m ];
                }
            }
            return [];
        }
    }
 
    return mianzi;
}

Majiang.Player.prototype.allow_lizhi = function(p) {

    if (! this._lizhi[this._menfeng] && this._menqian
        && Majiang.Util.xiangting(this._shoupai) == 0
        && this._paishu >= 4 && this._defen[this._menfeng] >= 1000)
    {
        if (p == null) return true;
        else {
            var new_shoupai = this._shoupai.clone();
            new_shoupai.dapai(p);
            return Majiang.Util.xiangting(new_shoupai) == 0
                    && Majiang.Util.tingpai(new_shoupai).length > 0;
        }
    }
    return false;
}

Majiang.Player.prototype.allow_hule = function(data, option) {

    var rongpai = data && (data.p ? data.p.substr(0,2)
                                  : data.m[0] + data.m.substr(-1));
 
    if (rongpai && ! this._neng_rong) return false;
 
    var new_shoupai = this._shoupai.clone();
    if (rongpai) new_shoupai.zimo(rongpai);
    if (Majiang.Util.xiangting(new_shoupai) != -1) return false;
 
    if (rongpai) rongpai += ['','+','=','-'][(4 + data.l - this._menfeng) % 4];
 
    var l = this._menfeng;
    var param = {
        zhuangfeng:     this._zhuangfeng,
        menfeng:        l,
        hupai: {
            lizhi:      this._lizhi[l],
            yifa:       this._yifa[l],
            qianggang:  option == 'qianggang',
            lingshang:  option == 'lingshang',
            haidi:      (this._paishu > 0) ? 0
                            : ! rongpai    ? 1
                            :                2,
            tianhu:     (this._diyizimo && ! rongpai) ? (l == 0 ? 1 : 2) : 0,
        },
        baopai:         this._baopai,
        fubaopai:       [],
        jicun:          { changbang: this._changbang,
                          lizhibang: this._lizhibang }
    };
    var hule = Majiang.Util.hule(new_shoupai, rongpai, param);

    return hule.hupai;
}

Majiang.Player.prototype.allow_pingju = function() {

    if (! this._diyizimo) return false;
 
    var n_yaojiu = 0;
    for (var s in this._shoupai._bingpai) {
        var bingpai = this._shoupai._bingpai[s];
        var nn = (s == 'z') ? [1,2,3,4,5,6,7] : [1,9];
        for (var n of nn) {
            if (bingpai[n] > 0) n_yaojiu++;
        }
    }
    return (n_yaojiu >= 9);
}

Majiang.Player.prototype.select_fulou = function(data) {

    function check_xiangting(shoupai, m, n_xiangting) {
        var new_shoupai = shoupai.clone();
        new_shoupai.fulou(m);
        if (m.match(/(\d)\1\1\1/)) {
            if (shoupai._fulou.filter(function(mm){
                    return mm.match(/^[mpsz](\d)\1\1.*\1.*$/)}).length >= 2)
            {
                return m;
            }
        }
        else {
            if (self.xiangting(new_shoupai) <  n_xiangting) return m;
        }
    }
 
    var self = this;

    if (this._lizhi.filter(function(x){return x}).length > 0) return;
 
    var n_xiangting = this.xiangting(this._shoupai);
    if (n_xiangting == 0) return;
 
    for (var m of this.get_gang_mianzi(data)) {
        return check_xiangting(this._shoupai, m, n_xiangting);
    }
    for (var m of this.get_peng_mianzi(data)) {
        return check_xiangting(this._shoupai, m, n_xiangting);
    }
    for (var m of this.get_chi_mianzi(data)) {
        return check_xiangting(this._shoupai, m, n_xiangting);
    }
}

Majiang.Player.prototype.select_gang = function() {

    function check_xiangting(shoupai, m, n_xiangting) {
        var new_shoupai = shoupai.clone();
        new_shoupai.gang(m);
        if (self.xiangting(new_shoupai) <= n_xiangting) return m;
    }
 
    var self = this;

    var n_xiangting = this.xiangting(this._shoupai);

    if (this._lizhi.filter(function(x){return x}).length > 0
        && n_xiangting > 0) return;
 
    for (var m of this.get_gang_mianzi()) {
        return check_xiangting(this._shoupai, m, n_xiangting);
    }
}

Majiang.Player.prototype.select_lizhi = function(p) {
    return this.allow_lizhi(p);
}

Majiang.Player.prototype.select_hule = function(data, option) {
    return this.allow_hule(data, option);
}

Majiang.Player.prototype.select_pingju = function() {
    if (Majiang.Util.xiangting(this._shoupai) < 4) return false;
    return this.allow_pingju();
}

Majiang.Player.prototype.select_dapai = function() {

    function suan_weixian(p) {
        var weixian = 0;
        for (var l = 0; l < 4; l++) {
            if (! self._lizhi[l]) continue;
            var w = self._suanpai.suan_weixian(p, l);
            if (w > weixian) weixian = w;
        }
        return weixian;
    }
    
    var self = this;

    if (this._lizhi[this._menfeng]) {
        return this._shoupai._zimo + '_';
    }

    var n_xiangting = this.xiangting(this._shoupai);
    if (n_xiangting == -1) n_xiangting = 0;
 
    var anquan, min = Infinity;
    if (this._lizhi.filter(function(x){return x}).length > 0) {
        for (var p of this.get_dapai()) {
            var weixian = suan_weixian(p);
            if (weixian < min) {
                min = weixian;
                anquan = p;
            }
        }
    }

    var dapai, max = 0;
    for (var p of this.get_dapai()) {
        var new_shoupai = this._shoupai.clone();
        new_shoupai.dapai(p);
        if (this.xiangting(new_shoupai) > n_xiangting) continue;
        var x = 1 - this._suanpai.paijia(p)/100;
        for (var tp of this.tingpai(new_shoupai)) {
            x += this._suanpai.paishu(tp.substr(0,2))
                    * (tp[2] == '+' ? 4 :
                       tp[2] == '-' ? 2 :
                                      1   );
        }
        if (x >= max) {
            max = x;
            dapai = p;
        }
    }
    
    if (anquan) {
        if      (n_xiangting > 1)                             dapai = anquan;
        else if (n_xiangting == 1 && suan_weixian(dapai) > 5) dapai = anquan;
    }
 
    if (dapai == this._shoupai._zimo) dapai += '_';
 
    if (this.select_lizhi(dapai)) dapai += '*';
 
    return dapai;
}

Majiang.Player.prototype.xiangting = function(shoupai) {

    function xiangting_menqian(shoupai) {
        if (shoupai._fulou.filter(function(m){return m.match(/[\-\+\=]/)}).length)
                                                            return Infinity;
        return Majiang.Util.xiangting(shoupai);
    }
 
    function xiangting_fanpai(shoupai) {
        var n_fanpai = 0, back;
        for (var n of [self._zhuangfeng+1, self._menfeng+1, 5, 6, 7]) {
            if (shoupai._bingpai.z[n] >= 3) n_fanpai++;
            else if (shoupai._bingpai.z[n] == 2
                        && self._suanpai.paishu('z'+n) > 0) back = n;
            for (var m of shoupai._fulou) {
                if (m[0] == 'z' && m[1] == n) n_fanpai++;
            }
        }
        if (n_fanpai) return Majiang.Util.xiangting(shoupai);
        if (back) {
            var new_shoupai = shoupai.clone();
            new_shoupai._bingpai.z[back] = 0;
            new_shoupai._fulou.push('z'+n+n+n+'=');
            return Majiang.Util.xiangting(new_shoupai) + 1;
        }
        return Infinity;
    }
 
    function xiangting_duanyao(shoupai) {
        if (shoupai._fulou.filter(function(m){return m.match(/^z|[19]/)}).length)
                                                            return Infinity;
        var new_shoupai = shoupai.clone();
        for (var s of ['m','p','s']) {
            for (var n of [1,9]) {
                new_shoupai._bingpai[s][n] = 0;
            }
        }
        new_shoupai._bingpai.z = [0,0,0,0,0,0,0,0];

        return Majiang.Util.xiangting(new_shoupai);
    }
 
    function xiangting_duidui(shoupai) {
        if (shoupai._fulou.filter(
                function(m){return ! m.match(/^[mpsz](\d)\1\1/)}).length)
                                                            return Infinity;
        var n_kezi = shoupai._fulou.length, n_duizi = 0;
        for (var s in shoupai._bingpai) {
            var bingpai = shoupai._bingpai[s];
            for (var n = 1; n < bingpai.length; n++) {
                if (bingpai[n] >= 3) n_kezi++;
                if (bingpai[n] == 2) n_duizi++;
            }
        }
        if (n_kezi + n_duizi > 5) n_duizi = 5 - n_kezi;
        return 8 - n_kezi * 2 - n_duizi;
    }
 
    function xiangting_yise(shoupai, sort) {
        var regexp = new RegExp('^[^z'+sort+']');
        if (shoupai._fulou.filter(function(m){return m.match(regexp)}).length)
                                                            return Infinity;
        var new_shoupai = shoupai.clone();
        for (var s of ['m','p','s']) {
            if (s != sort) new_shoupai._bingpai[s] = [0,0,0,0,0,0,0,0,0,0];
        }
        return Majiang.Util.xiangting(new_shoupai);
    }

    var self = this;
 
    return Math.min(
                xiangting_menqian(shoupai),
                xiangting_fanpai(shoupai),
                xiangting_duanyao(shoupai),
                xiangting_duidui(shoupai),
                xiangting_yise(shoupai, 'm'),
                xiangting_yise(shoupai, 'p'),
                xiangting_yise(shoupai, 's')
            );
}

Majiang.Player.prototype.tingpai = function(shoupai) {

    var self = this;
    
    var n_xiangting = this.xiangting(shoupai);
    
    var pai = [];
    for (var p of Majiang.Util.tingpai(
                        shoupai, function(s){return self.xiangting(s)}))
    {
        if (n_xiangting > 0) {

            for (var m of get_peng_mianzi(shoupai, p+'+')) {
                var new_shoupai = shoupai.clone();
                new_shoupai.fulou(m);
                if (this.xiangting(new_shoupai) < n_xiangting) {
                    pai.push(p+'+');
                    break;
                }
            }
            if (pai[pai.length - 1] == p+'+') continue;

            for (var m of get_chi_mianzi(shoupai, p+'-')) {
                var new_shoupai = shoupai.clone();
                new_shoupai.fulou(m);
                if (this.xiangting(new_shoupai) < n_xiangting) {
                    pai.push(p+'-');
                    break;
                }
            }
            if (pai[pai.length - 1] == p+'-') continue;
        }
        pai.push(p);
    }
    return pai;
}

})();
