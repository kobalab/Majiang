/*
 *  Majiang.Game
 */

(function(){

Majiang.Game = function() {

    this._speed    = 3;
    this._stop     = false;
    this._callback;
    
    this._chang = {
        title:      (new Date()).toLocaleString(),
        player:     ['私','下家','対面','上家'],
        qijia:       Math.floor(Math.random() * 4),
        zhuangfeng:  0,
        jushu:       0,
        changbang:   0,
        lizhibang:   0,
        defen:       [ 25000, 25000, 25000, 25000 ],
        hongpai:     { m: 1, p: 1, s: 1 }
    };
 
    this._player = [ new Majiang.UI(0) ];
    for (var id = 1; id < 4; id++) {
        this._player[id] = new Majiang.Player(id);
    }
}

Majiang.Game.prototype.delay = function(callback, timeout) {

    setTimeout(
        callback,
        (this._speed == 0 ? 0 : (timeout == null ? 500 : timeout))
    );
}

Majiang.Game.prototype.kaiju = function() {

    this._paipu = {
        title:  this._chang.title,
        player: this._chang.player.concat(),
        qijia:  this._chang.qijia,
        log:    []
    };
 
    var data = [];
    for (var i = 0; i < 4; i++) {
        data[i] = JSON.parse(JSON.stringify({
            player:  this._paipu.player,
            qijia:   this._paipu.qijia,
            hongpai: this._chang.hongpai
        }));
    }
    this.notify_players('kaiju', data);
 
    this.qipai();
}

Majiang.Game.prototype.add_paipu = function(data) {

    var log = this._paipu.log[this._paipu.log.length - 1];
    log.push(data);
}

Majiang.Game.prototype.player_id = function(lunban) {
    return (this._chang.qijia + this._chang.jushu + lunban) % 4;
}

Majiang.Game.prototype.notify_players = function(type, data) {

    var self = this;
 
    for (var l = 0; l < 4; l++) {
        (function(){
            var id = self.player_id(l);
            var lb = l;
            setTimeout(function(){
                self._player[id].action(type, data[lb]);
            }, 0);
        })();
    }
}

Majiang.Game.prototype.call_players = function(type, data, timeout) {

    var self = this;
 
    this._status = type;
 
    if (this._speed != 0 && timeout != null) {
        if (this._player.filter(
                    function(p){ return p instanceof Majiang.UI }).length)
            timeout = 0;
    }
    else    timeout = this._speed * 200;
 
    this._reply = [];
    for (var l = 0; l < 4; l++) {
        (function(){
            var id = self.player_id(l);
            var lb = l;
            var delay = (self._player[id] instanceof Majiang.UI) ? 0 : timeout;
            setTimeout(function(){
                self._player[id].action(type, data[lb], function(type, reply){
                    self.next(id, type || '', reply)
                });
            }, delay);
        })();
    }
}

Majiang.Game.prototype.next = function(id, type, data) {

    var self = this;
 
    if (id != null) this._reply[id] = { type: type, data: data };
    if (this._reply.filter(function(x){return x}).length < 4) return;
    if (this._stop) return;
 
    if      (this._status == 'zimo')     this.reply_zimo();
    else if (this._status == 'dapai')    this.reply_dapai();
    else if (this._status == 'fulou')    this.reply_fulou();
    else if (this._status == 'gang')     this.reply_gang();
    else if (this._status == 'gangzimo') this.reply_zimo();
    else if (this._status == 'hule')     this.reply_hule();
    else if (this._status == 'pingju')   this.reply_pingju();
    else if (this._status == 'jieju')    this.reply_jieju();
}

Majiang.Game.prototype.reply_zimo = function() {

    var self = this;
 
    var reply = this._reply[this.player_id(this._lunban)];
 
    if (reply.type == 'pingju') {
        this.delay(function(){ self.pingju('九種九牌') }, 0)
    }
    else if (reply.type == 'hule') {
        this.say('zimo');
        this.delay(function(){ self.hule() });
    }
    else if (reply.type == 'gang') {
        this.say('gang');
        this.delay(function(){ self.gang(reply.data) });
    }
    else if (reply.type == 'dapai') {
        if (reply.data.match(/\*$/)) {
            this.say('lizhi');
            this.delay(function(){ self.dapai(reply.data) },
                  (this._speed < 3) ? 500 : this._speed * 200
            );
        }
        else this.dapai(reply.data);
    }
}

Majiang.Game.prototype.reply_dapai = function() {

    var self = this;
 
    for (var i = 0; i < 4; i++) {
        var lunban = (this._lunban + i) % 4;
        var reply = this._reply[this.player_id(lunban)];
        if (reply.type == 'hule') {
            (function(){
                var lb = lunban;
                var delay = self._hule.length * 150;
                setTimeout(function(){ self.say('rong', lb) }, delay);
            })();
            this._hule.push(lunban);
        }
    }
    if (this._hule.length > 0) {
        if (this._hule.length == 3)
                this.delay(function(){ self.pingju('三家和') }, 0)
        else    this.delay(function(){ self.hule() });
        return;
    }

    if (this._dapai.match(/\*$/)) {
        this._chang.defen[this.player_id(this._lunban)] -= 1000;
        this._chang.lizhibang++;
        this._view.chang.redraw();
 
        if (this._lizhi.filter(function(x){return x}).length == 4) {
            this._view.he[this._lunban].redraw();
            this.delay(function(){ self.pingju('四家立直') }, 0);
            return;
        }
    }
 
    if (this._diyizimo && this._lunban == 3) {
        this._diyizimo = false;
        if (this._dafengpai) {
            this.delay(function(){ self.pingju('四風連打') }, 0);
            return;
        }
    }

    if (this._model.shan.baopai().length == 5) {
        for (var l = 0; l < 4; l++) {
            if (0 < this._gang[l] && this._gang[l] < 4) {
                this.delay(function(){ self.pingju('四開槓') }, 0);
                return;
            }
        }
    }

    for (var i = 0; i < 4; i++) {
        var lunban = (this._lunban + i) % 4;
        var reply = this._reply[this.player_id(lunban)];
        if (reply.type == 'fulou') {
            var m = reply.data.replace(/0/g,'5');
            if (m.match(/^[mpsz](\d)\1\1\1/)) {
                this.say('gang', lunban);
                this.delay(function(){ self.fulou(reply.data) });
                return;
            }
            else if (m.match(/^[mpsz](\d)\1\1/)) {
                this.say('peng', lunban);
                this.delay(function(){ self.fulou(reply.data) });
                return;
            }
        }
    }
    for (var i = 0; i < 4; i++) {
        var lunban = (this._lunban + i) % 4;
        var reply = this._reply[this.player_id(lunban)];
        if (reply.type == 'fulou') {
            this.say('chi', lunban);
            this.delay(function(){ self.fulou(reply.data) });
            return;
        }
    }
 
    this.zimo();
}

Majiang.Game.prototype.reply_fulou = function() {

    var self = this;

    if (this._fulou.match(/^[mpsz]\d{4}/)) {
        this._gang[this._lunban]++;
        this.gangzimo();
        return;
    }
 
    var reply = this._reply[this.player_id(this._lunban)];
    if (reply.type == 'dapai') {
        this.dapai(reply.data);
    }
}

Majiang.Game.prototype.reply_gang = function() {

    var self = this;

    for (var i = 0; i < 4; i++) {
        var lunban = (this._lunban + i) % 4;
        var reply = this._reply[this.player_id(lunban)];
        if (reply.type == 'hule') {
            (function(){
                var lb = lunban;
                var delay = self._hule.length * 150;
                setTimeout(function(){ self.say('rong', lb) }, delay);
            })();
            this._hule.push(lunban);
        }
    }
    if (this._hule.length > 0) {
        if (this._hule.length == 3)
                this.delay(function(){ self.pingju('三家和') }, 0);
        else    this.delay(function(){ self.hule() });
        return;
    }

    this.gangzimo();
}

Majiang.Game.prototype.reply_hule = function() {

    var self = this;
 
    this._view.jiesuan.hide();
 
    if (this._hule.length > 0) {
        this.delay(function(){ self.hule() });
    }
    else this.jiesuan();
}

Majiang.Game.prototype.reply_pingju = function() {
    this._view.jiesuan.hide();
    this.jiesuan();
}

Majiang.Game.prototype.reply_jieju = function() {
    if (this._callback) this._callback();
}

Majiang.Game.prototype.say = function(name, lunban) {
    this.audio_play(name, lunban);
    Majiang.View.Say.play(name,
        this.player_id(lunban == null ? this._lunban : lunban));
}

Majiang.Game.prototype.audio_play = function(name, lunban) {
    if (this._speed == 0) return;
    Majiang.Audio.play(name,
        this.player_id(lunban == null ? this._lunban : lunban));
}

Majiang.Game.prototype.create_view = function(viewpoint) {

    $('.jiezhang').removeClass('summary').hide();
    $('.say').hide();
    $('.menu').hide();
 
    viewpoint = viewpoint || 0;

    this._view = {
        shan:    new Majiang.View.Shan($('.chang .shan'), this._model.shan),
        shoupai: [],
        he:      [],
        chang:   new Majiang.View.Chang($('.chang'), this._chang, viewpoint)
    };
 
    this._view.chang.redraw();
    this._view.shan.redraw();
 
    var view_class = ['main','xiajia','duimian','shangjia'];
    for (var l = 0; l < 4; l++) {
        var c = view_class[(this.player_id(l) + 4 - viewpoint) % 4];
        this._view.shoupai[l]
            = new Majiang.View.Shoupai(
                    $('.shoupai.'+c), this._model.shoupai[l],
                                            this.player_id(l) == viewpoint);
        this._view.shoupai[l].redraw();
 
        this._view.he[l]
            = new Majiang.View.He($('.he.'+c), this._model.he[l]);
        this._view.he[l].redraw();
    }
 
    Majiang.View.Say.init(viewpoint);
 
    this._view.jiesuan = new Majiang.View.Jiesuan($('.jiesuan'),
                                this._model.shan, this._chang, viewpoint);
 
    new Majiang.View.Controler($('.controler'), this);
}

Majiang.Game.prototype.qipai = function() {

    var self = this;

    this._model = {
        shan:    new Majiang.Shan(this._chang.hongpai),
        shoupai: [],
        he:      []
    };
    
    this._lunban    = -1;
    this._dapai     = null;
    this._gangpai   = null;
    this._fulou     = null;
    this._kaigang   = false;

    this._diyizimo  = true;
    this._dafengpai = true;

    this._lizhi = [ 0, 0, 0, 0];
    this._yifa  = [ false, false, false, false ];
    this._gang  = [ 0, 0, 0, 0];
 
    this._hule          = [];
    this._hule_option   = null;
    this._tmp_changbang = this._chang.changbang;
    this._lianzhuang    = false;


    var qipai = [ [], [], [], [] ];
    for (var l = 0; l < 4; l++) {
        for (var i = 0; i < 13; i++) {
            qipai[l].push(this._model.shan.zimo());
        }
        this._model.shoupai[l] = new Majiang.Shoupai(qipai[l]);
        this._model.he[l]      = new Majiang.He();
    }
 
    this.create_view();
 
    this._paipu.log.push([]);

    var defen = [0, 0, 0, 0];
    for (var l = 0; l < 4; l++) {
        defen[l] = this._chang.defen[this.player_id(l)];
    }

    var paipu = {
        qipai: {
            zhuangfeng: this._chang.zhuangfeng,
            jushu:      this._chang.jushu,
            changbang:  this._chang.changbang,
            lizhibang:  this._chang.lizhibang,
            defen:      defen,
            baopai:     this._model.shan.baopai()[0],
            shoupai:    this._model.shoupai.map(function(s){return s.toString()})
        }
    };
    this.add_paipu(paipu);
 
    var data = [];
    for (var l = 0; l < 4; l++) {
        data[l] = JSON.parse(JSON.stringify(paipu.qipai));
        for (var i = 0; i < 4; i++) {
            if (i != l) data[l].shoupai[i] = '';
        }
    }
    this.notify_players('qipai', data);
 
    this.delay(function(){ self.zimo() });
}

Majiang.Game.prototype.zimo = function() {

    var self = this;

    if (this._lunban >= 0) {
        this._view.shoupai[this._lunban].redraw();
        this._view.he[this._lunban].redraw();
    }
 
    if (this._model.shan.paishu() == 0) {
        this.delay(function(){ self.pingju('荒牌平局') }, 0);
        return;
    }
 
    this._lunban = (this._lunban + 1) % 4;
 
    var zimo = this._model.shan.zimo();
    this._model.shoupai[this._lunban].zimo(zimo);
 
    this._view.chang.update(this._lunban);
    this._view.shan.redraw();
    this._view.shoupai[this._lunban].redraw();
 
    var paipu = { zimo: { l: this._lunban, p: zimo } };
    this.add_paipu(paipu);
 
    var data = [];
    for (var l = 0; l < 4; l++) {
        data[l] = JSON.parse(JSON.stringify(paipu.zimo));
        if (l != this._lunban) data[l].p = '';
    }
    this.call_players('zimo', data);
}

Majiang.Game.prototype.dapai = function(dapai) {

    var self = this;
 
    this._yifa[this._lunban] = false;
    this._fulou = null;
 
    this._model.shoupai[this._lunban].dapai(dapai);
    this._model.he[this._lunban].dapai(dapai);
 
    this._view.shoupai[this._lunban].dapai(dapai);
    this.audio_play('dapai');
    this._view.he[this._lunban].dapai(dapai);

    if (this._diyizimo) {
        if (! dapai.match(/^z[1234]/))  this._dafengpai = false;
        if (this._lunban > 0 && dapai.substr(0,2) != this._dapai.substr(0,2))
                                        this._dafengpai = false;
    }
    else this._dafengpai = false;
 
    if (dapai.match(/\*$/)) {
        this._lizhi[this._lunban] = this._diyizimo ? 2 : 1;
        this._yifa[this._lunban]  = true;
    }
 
    this._dapai = dapai;
 
    var paipu = { dapai: { l: this._lunban, p: dapai } };
    this.add_paipu(paipu);
 
    if (this._kaigang) this.kaigang();
 
    var data = [];
    for (var l = 0; l < 4; l++) {
        data[l] = JSON.parse(JSON.stringify(paipu.dapai));
    }
    this.call_players('dapai', data);
}

Majiang.Game.prototype.fulou = function(fulou) {

    var self = this;
 
    this._diyizimo = false;
    this._yifa     = [false, false, false, false];
    this._dapai    = null;
 
    var d = fulou.match(/[\-\+\=]/)[0];

    this._view.shoupai[this._lunban].redraw();
    this._model.he[this._lunban].fulou(d);
    this._view.he[this._lunban].redraw();

    this._lunban = (d == '-') ? (this._lunban + 1) % 4
                 : (d == '=') ? (this._lunban + 2) % 4
                 : (d == '+') ? (this._lunban + 3) % 4
                 :               this._lunban;
    this._view.chang.update(this._lunban);
 
    this._model.shoupai[this._lunban].fulou(fulou);
    this._view.shoupai[this._lunban].redraw();
 
    this._fulou = fulou;

    var paipu = { fulou: { l: this._lunban, m: fulou } };
    this.add_paipu(paipu);

    var data = [];
    for (var l = 0; l < 4; l++) {
        data[l] = JSON.parse(JSON.stringify(paipu.fulou));
    }
    this.call_players('fulou', data);
}

Majiang.Game.prototype.gang = function(gang) {

    var self = this;
 
    this._diyizimo = false;
    this._yifa     = [false, false, false, false];
    this._dapai    = null;

    this._model.shoupai[this._lunban].gang(gang);
    this._view.shoupai[this._lunban].redraw();

    this._gang[this._lunban]++;
    this._gangpai = gang;

    var paipu = { gang: { l: this._lunban, m: gang } };
    this.add_paipu(paipu);

    var data = [];
    for (var l = 0; l < 4; l++) {
        data[l] = JSON.parse(JSON.stringify(paipu.gang));
    }
    this.call_players('gang', data);
}

Majiang.Game.prototype.gangzimo = function() {

    var self = this;
 
    if (this._kaigang) this.kaigang();
 
    var zimo = this._model.shan.gangzimo();
    this._model.shoupai[this._lunban].zimo(zimo);
 
    this._view.shan.redraw();
    this._view.shoupai[this._lunban].redraw();
 
    var paipu = { gangzimo: { l: this._lunban, p: zimo } };
    this.add_paipu(paipu);

    if (this._gangpai && this._gangpai.match(/^[mpsz]\d{4}$/)) this.kaigang();
    else this._kaigang = true;
 
    this._gangpai = null;
 
    var data = [];
    for (var l = 0; l < 4; l++) {
        data[l] = JSON.parse(JSON.stringify(paipu.gangzimo));
        if (l != this._lunban) data[l].p = '';
    }
    this.call_players('gangzimo', data);
}

Majiang.Game.prototype.kaigang = function() {

    this._model.shan.kaigang();
    this._view.shan.redraw();
 
    var baopai = this._model.shan.baopai().pop();
    this._kaigang = false;

    var paipu = { kaigang: { baopai: baopai } };
    this.add_paipu(paipu);

    var data = [];
    for (var l = 0; l < 4; l++) {
        data[l] = JSON.parse(JSON.stringify(paipu.kaigang));
    }
    this.notify_players('kaigang', data);
}

Majiang.Game.prototype.hule = function() {

    var self = this;

    if (this._status != 'hule') {
        this._hule_option = (this._status == 'gang')     ? 'qianggang'
                          : (this._status == 'gangzimo') ? 'lingshang'
                          : null;
    }

    var lunban = (this._hule.length > 0) ? this._hule.shift() : null;
    var rongpai;
    if (lunban != null) {
        rongpai = (this._hule_option == 'qianggang')
                        ? this._gangpai[0] + this._gangpai.substr(-1)
                        : this._dapai.substr(0,2);
        rongpai = rongpai + ['','+','=','-'][(4 + this._lunban - lunban) % 4];
    }
    lunban = (lunban != null) ? lunban : this._lunban;
 
    var new_shoupai = this._model.shoupai[lunban].clone();
    if (rongpai) new_shoupai.zimo(rongpai.substr(0,2));

    this._view.shoupai[lunban].open();
 
    var fubaopai = this._lizhi[lunban] ? this._model.shan.fubaopai() : null;
 
    var param = {
        zhuangfeng:     this._chang.zhuangfeng,
        menfeng:        lunban,
        hupai: {
            lizhi:      this._lizhi[lunban],
            yifa:       this._yifa[lunban],
            qianggang:  this._hule_option == 'qianggang',
            lingshang:  this._hule_option == 'lingshang',
            haidi:      (this._model.shan.paishu() > 0
                        || this._hule_option == 'lingshang') ? 0
                            : ! rongpai                      ? 1
                            :                                  2,
            tianhu:     (this._diyizimo && ! rongpai) ? (l == 0 ? 1 : 2) : 0,
        },
        baopai:         this._model.shan.baopai(),
        fubaopai:       fubaopai || [],
        jicun:          { changbang: this._chang.changbang,
                          lizhibang: this._chang.lizhibang }
    };
    var hule = Majiang.Util.hule(new_shoupai, rongpai, param);
 
    var info = {
        lunban:   lunban,
        shoupai:  new_shoupai,
        hule:     hule,
        fubaopai: fubaopai,
        fenpei:   hule.fenpei
    };
    this._view.jiesuan.hule(info);
 
    if (lunban == 0) this._lianzhuang = true;
    this._chang.lizhibang = 0;
    this._chang.changbang = 0;
 
    for (var l = 0; l < 4; l++) {
        this._chang.defen[this.player_id(l)] += hule.fenpei[l];
    }

    if (this._hule.length == 0) {
        if (this._lianzhuang) this._chang.changbang = this._tmp_changbang + 1;
        else                  this._chang.changbang = 0;
    }

    var paipu = {
        hule: {
            l:        lunban,
            shoupai:  new_shoupai.toString(),
            baojia:   rongpai ? this._lunban : null,
            fubaopai: fubaopai,
            defen:    hule.defen,
            hupai:    hule.hupai,
            fenpei:   hule.fenpei
        }
    };
    if (hule.damanguan) {
        paipu.hule.damanguan = hule.damanguan;
    }
    else {
        paipu.hule.fu      = hule.fu;
        paipu.hule.fanshu  = hule.fanshu;
    }
    this.add_paipu(paipu);

    var data = [];
    for (var l = 0; l < 4; l++) {
        data[l] = JSON.parse(JSON.stringify(paipu.hule));
    }
    this.call_players('hule', data, 5000);
}

Majiang.Game.prototype.pingju = function(name) {

    var self = this;

    var shoupai = ['','','',''];
    var fenpei  = [0,0,0,0];

    if (name == '荒牌平局') {

        var n_tingpai = 0;
        for (var l = 0; l < 4; l++) {
            if (Majiang.Util.xiangting(this._model.shoupai[l]) == 0
                && Majiang.Util.tingpai(this._model.shoupai[l]).length > 0)
            {
                n_tingpai++;
                this._view.shoupai[l].open();
                shoupai[l] = this._model.shoupai[l].toString();
            }
        }
 
        for (var l = 0; l < 4; l++) {
            var all_yaojiu = true;
            for (var p of this._model.he[l]._pai) {
                if (p.match(/[\-\+\=]$/)) { all_yaojiu = false; break }
                if (p.match(/^z/))          continue;
                if (p.match(/^[mps][19]/))  continue;
                all_yaojiu = false; break;
            }
            if (all_yaojiu) {
                name = '流し満貫';
                for (var lb = 0; lb < 4; lb++) {
                    fenpei[lb] += l == 0 && lb == l ? 12000
                                : l == 0            ? -4000
                                : l != 0 && lb == l ?  8000
                                : l != 0 && lb == 0 ? -4000
                                :                     -2000;
                }
            }
        }
 
        if (name == '荒牌平局' && 0 < n_tingpai && n_tingpai < 4) {
            for (var l = 0; l < 4; l++) {
                fenpei[l] = shoupai[l] ?  3000 / n_tingpai
                                       : -3000 / (4 - n_tingpai);
            }
        }
    }
    else if (name == '九種九牌') {
        this._view.shoupai[this._lunban].open();
        shoupai[this._lunban] = this._model.shoupai[this._lunban].toString();
    }
    else if (name == '四家立直') {
        for (var l = 0; l < 4; l++) {
            this._view.shoupai[l].open();
            shoupai[l] = this._model.shoupai[l].toString();
        }
    }
    else if (name == '三家和') {
        for (var l of this._hule) {
            this._view.shoupai[l].open();
            shoupai[l] = this._model.shoupai[l].toString();
        }
    }
 
    this._view.jiesuan.pingju({name: name, fenpei: fenpei});
 
    if (this._model.shan.paishu() == 0) {
        this._lianzhuang = shoupai[0] != '';
    }
    else this._lianzhuang = true;
    this._chang.changbang++;

    for (var l = 0; l < 4; l++) {
        this._chang.defen[this.player_id(l)] += fenpei[l];
    }
 
    var paipu = { pingju: { name: name, shoupai: shoupai, fenpei: fenpei } };
    this.add_paipu(paipu);

    var data = [];
    for (var l = 0; l < 4; l++) {
        data[l] = JSON.parse(JSON.stringify(paipu.pingju));
    }
    this.call_players('pingju', data, 5000);
}

Majiang.Game.prototype.jiesuan = function() {

    var self = this;

    this._view.chang.redraw();
 
    if (! this._lianzhuang) {
        this._chang.jushu++;
        if (this._chang.jushu == 4) {
            this._chang.zhuangfeng++;
            this._chang.jushu = 0;
        }
    }
 
    var jieju = false;
    var guanjun = -1;
    var defen = this._chang.defen;
    for (var i = 0; i < 4; i++) {
        var id = (this._chang.qijia + i) % 4;
        if (defen[id] < 0) jieju = true;
        if (defen[id] >= 30000
            && (guanjun == -1|| defen[id] > defen[guanjun])) guanjun = id;
    }
 
    if      (this._chang.zhuangfeng == 3) jieju = true;
    else if (this._chang.zhuangfeng == 2) {
        if (guanjun != -1) jieju = true;
    }
    else if (this._chang.zhuangfeng == 1 && this._chang.jushu == 3) {
        if (guanjun == this.player_id(0) && this._lianzhuang) jieju = true;
    }
 
    if (jieju) this.delay(function(){ self.jieju() });
    else       this.delay(function(){ self.qipai() });
}

Majiang.Game.prototype.jieju = function() {

    var self = this;

    var paiming = [];
    var defen = this._chang.defen;
    for (var i = 0; i < 4; i++) {
        var id = (this._chang.qijia + i) % 4;
        for (var j = 0; j < 4; j++) {
            if (j == paiming.length || defen[id] > defen[paiming[j]]) {
                paiming.splice(j, 0, id);
                break;
            }
        }
    }
    defen[paiming[0]] += this._chang.lizhibang * 1000;
 
    var rank = [0,0,0,0];
    for (var i = 0; i < 4; i++) {
        rank[paiming[i]] = i + 1;
    }
 
    var point = [0,0,0,0];
    for (var i = 1; i < 4; i++) {
        var id = paiming[i];
        point[id] = Math.round((defen[id] - 30000) / 1000)
                  + (   i == 1 ?  10
                      : i == 2 ? -10
                      : i == 3 ? -20
                      :            0 );
        point[paiming[0]] -= point[id];
    }
 
    this._paipu.defen = defen.concat();
    this._paipu.rank  = rank.concat();
    this._paipu.point = point.concat();
 
    Majiang.View.Jiezhang($('.jiezhang'), this._paipu);

    var data = [];
    for (var l = 0; l < 4; l++) {
        data[l] = {
            jieju: {
                defen: defen.concat(),
                rank:  rank.concat(),
                point: point.concat()
            }
        };
    }
    this.call_players('jieju', data, 10000);
}

})();
