/*
 *  Majiang.Game.Paipu
 */

Majiang.Game.Paipu = function(paipu) {
    
    this._paipu = paipu;
    
    this._chang = {
        title:  paipu.title,
        player: paipu.player,
        qijia:  paipu.qijia,
        defen:  [0,0,0,0]
    };
    
    this._mode = { shoupai: true, he: true, auto_play: false };
    
    this._log_idx = 0;
    this._idx     = 0;
    
    this._delay  = false;
    this._replay = false;
    
    this._speed = 3;
    this._timeout_id;

    this._callback;
}

Majiang.Game.Paipu.prototype.player_id = Majiang.Game.prototype.player_id;

Majiang.Game.Paipu.prototype.audio_play = Majiang.Game.prototype.audio_play;

Majiang.Game.Paipu.prototype.say = Majiang.Game.prototype.say;

Majiang.Game.Paipu.prototype.next = function() {

    var self = this;

    if (this._delay) return;
    
    if (this._log_idx >= this._paipu.log.length) {
        this.jieju();
        return;
    }
    if (this._idx >= this._paipu.log[this._log_idx].length) return;

    if (this._mode.auto_play) {
        this._timeout_id = clearTimeout(self._timeout_id);
    }

    var data = this._paipu.log[this._log_idx][this._idx];
    this._idx++;
    
    if (this._lizhi && ! data.hule) {
        this._chang.defen[this.player_id(this._lunban)] -= 1000;
        this._chang.lizhibang++;
        this._lizhi = false;
    }

    if      (data.qipai)    this.qipai(data.qipai);
    else if (data.zimo)     this.zimo(data.zimo);
    else if (data.dapai)    this.dapai(data.dapai);
    else if (data.fulou)    this.fulou(data.fulou);
    else if (data.gang)     this.gang(data.gang);
    else if (data.gangzimo) this.gangzimo(data.gangzimo);
    else if (data.kaigang)  this.kaigang(data.kaigang);
    else if (data.hule)     this.hule(data.hule);
    else if (data.pingju)   this.pingju(data.pingju);
    else throw ('*** 未実装: ' + JSON.stringify(data));

    if (this._mode.auto_play && ! this._delay) {
        this._timeout_id
            = setTimeout(function(){ self.next() }, self._speed * 200);
    }
}

Majiang.Game.Paipu.prototype._qipai = function(data) {

    this._chang.zhuangfeng = data.zhuangfeng;
    this._chang.jushu      = data.jushu;
    this._chang.changbang  = data.changbang;
    this._chang.lizhibang  = data.lizhibang;
    
    for (var l = 0; l < 4; l++) {
        this._chang.defen[this.player_id(l)] = data.defen[l];
    }
    
    this._model = {
        shan:    new Majiang.Shan.Fake(data.baopai),
        shoupai: [],
        he:      []
    };
    
    this._lunban = 0;
    this._lizhi  = false;
    
    for (var l = 0; l < 4; l++) {
        this._model.shoupai[l] = Majiang.Shoupai.fromString(data.shoupai[l]);
        this._model.he[l]      = new Majiang.He();
    }
}
Majiang.Game.Paipu.prototype._create_view = Majiang.Game.prototype.create_view;

Majiang.Game.Paipu.prototype.create_view = function() {

    this._create_view();
    
    for (var l = 0; l < 4; l++) {
        this._view.shoupai[l]._open = this._mode.shoupai;
        this._view.shoupai[l].redraw()
        this._view.he[l]._open = this._mode.he;
        this._view.he[l].redraw()
    }
    
    var self = this;

    if (! this._mode.auto_play) $('.controler .speed').hide();

    $('#game').unbind('click').bind('click', function(){
        self._mode.auto_play = ! self._mode.auto_play;
        if (self._mode.auto_play) {
            self.next();
            $('.controler .speed').show();
        }
        else {
            this._timeout_id = clearTimeout(self._timeout_id);
            $('.controler .speed').hide();
        }
        return false;
    });
    
    $(window).unbind('keydown').bind('keydown', function(event){
        if (event.keyCode == 40) {
            if (event.shiftKey) {
                var log = self._paipu.log[self._log_idx];
                for (var i = 0; i < log.length; i++) {
                    if (log[i].hule || log[i].pingju) {
                        self.seek(self._log_idx, i - 1);
                        self.next();
                    }
                }
            }
            else self.next();
        }
        if (event.keyCode == 38) {
            if (event.shiftKey) self.seek(self._log_idx, 0);
            else                self.seek(self._log_idx, self._idx - 2);
        }
        if (event.keyCode == 37) self.seek(self._log_idx - 1, 0);
        if (event.keyCode == 39) self.seek(self._log_idx + 1, 0);
    });
}

Majiang.Game.Paipu.prototype.qipai = function(data) {

    this._qipai(data);
    
    this.create_view();
}

Majiang.Game.Paipu.prototype.zimo = function(data) {

    this._view.shoupai[this._lunban].redraw();
    this._view.he[this._lunban].redraw();
    this._view.chang.redraw();
    
    this._model.shan.zimo(data.p);
    this._model.shoupai[data.l].zimo(data.p);
    
    this._view.chang.update(data.l);
    this._view.shan.redraw();
    this._view.shoupai[data.l].redraw();

    this._lunban = data.l;
}

Majiang.Game.Paipu.prototype.dapai = function(data) {

    if (data.p.substr(-1) == '*' && ! this._replay) {
        this.say('lizhi', data.l);
        this._replay = true;
        this._idx--;
        return;
    }
    this._replay = false;

    this._model.shoupai[data.l].dapai(data.p);
    this._model.he[data.l].dapai(data.p);
    if (data.p.substr(-1) == '*') this._lizhi = true;
    
    this._view.shoupai[data.l].dapai(data.p);
    this.audio_play('dapai');
    this._view.he[data.l].dapai(data.p);
    
    if (this._paipu.log[this._log_idx][this._idx].kaigang) {
        var self = this;
        setTimeout(function(){ self.next() }, 0);
    }
}

Majiang.Game.Paipu.prototype.fulou = function(data) {

    var self = this;
    
    if (! this._delay) {
        var m = data.m.replace(/0/g,'5');
        if      (m.match(/^[mpsz](\d)\1\1\1/)) this.say('gang', data.l);
        else if (m.match(/^[mpsz](\d)\1\1/))   this.say('peng', data.l);
        else                                   this.say('chi',  data.l);
        this._delay = true;
        this._timeout_id = clearTimeout(this._timeout_id);
        setTimeout(function(){ self.fulou(data) }, 500);
        return;
    }
    this._delay = false;
    
    var d = data.m.match(/[\-\+\=]/)[0];
    
    this._view.shoupai[this._lunban].redraw();
    this._model.he[this._lunban].fulou(d);
    this._view.he[this._lunban].redraw();
    this._view.chang.redraw();
    
    this._view.chang.update(data.l);
    
    this._model.shoupai[data.l].fulou(data.m);
    this._view.shoupai[data.l].redraw();

    this._lunban = data.l;

    if (this._mode.auto_play) {
        this._timeout_id
            = setTimeout(function(){ self.next() }, self._speed * 200);
    }
}

Majiang.Game.Paipu.prototype.gang = function(data) {

    var self = this;

    if (! this._delay) {
        this.say('gang', data.l);
        this._delay = true;
        this._timeout_id = clearTimeout(this._timeout_id);
        setTimeout(function(){ self.gang(data) }, 500);
        return;
    }
    this._delay = false;
    
    this._model.shoupai[data.l].gang(data.m);
    this._view.shoupai[data.l].redraw();

    if (this._mode.auto_play) {
        this._timeout_id = setTimeout(function(){ self.next() }, self._timeout);
    }

    if (this._paipu.log[this._log_idx][this._idx].kaigang) {
        var self = this;
        setTimeout(function(){ self.next() }, 0);
    }
}

Majiang.Game.Paipu.prototype.gangzimo = function(data) {

    var self = this;

    this._model.shan.gangzimo(data.p);
    this._model.shoupai[data.l].zimo(data.p);
    
    this._view.shan.redraw();
    this._view.shoupai[data.l].redraw();

    if (this._paipu.log[this._log_idx][this._idx].kaigang) {
        setTimeout(function(){ self.next() }, 0);
    }
}

Majiang.Game.Paipu.prototype.kaigang = function(data) {

    this._model.shan.kaigang(data.baopai);
    this._view.shan.redraw();
}

Majiang.Game.Paipu.prototype.hule = function(data) {

    var self = this;
    
    if (! this._delay) {
        if (data.baojia == null) this.say('zimo', data.l);
        else                     this.say('rong', data.l);
        this._delay = true;
        this._timeout_id = clearTimeout(this._timeout_id);
        setTimeout(function(){ self.hule(data) }, 500);
        return;
    }
    this._delay = false;
    
    this._model.shan.fubaopai(data.fubaopai);
    
    var hule = {
        hupai:      data.hupai,
        fu:         data.fu,
        fanshu:     data.fanshu,
        damanguan:  data.damanguan,
        defen:      data.defen,
        fubaopai:   data.fubaopai
    };
    var info = {
        lunban:   data.l,
        shoupai:  Majiang.Shoupai.fromString(data.shoupai),
        hule:     hule,
        fubaopai: data.fubaopai,
        fenpei:   data.fenpei
    };
    this._view.jiesuan.hule(info);

    $('#game').unbind('click').bind('click', function(){
        self._view.jiesuan.hide();
        if (self._idx == self._paipu.log[self._log_idx].length) {
            self._log_idx++; self._idx = 0; self.next();
        }
        else self.next();
        return false;
    });
}

Majiang.Game.Paipu.prototype.pingju = function(data) {

    var self = this;

    this._view.shoupai[this._lunban].redraw();
    this._view.he[this._lunban].redraw();

    for (var l = 0; l < 4; l++) {
        if (! data.shoupai[l] && this.player_id(l) != 0) {
            this._view.shoupai[l]._open = false;
            this._view.shoupai[l].redraw();
        }
    }

    this._view.jiesuan.pingju({ name: data.name, fenpei: data.fenpei });

    $('#game').unbind('click').bind('click', function(){
        self._view.jiesuan.hide();
        self._log_idx++; self._idx = 0; self.next();
        return false;
    });
}

Majiang.Game.Paipu.prototype.jieju = function(data) {

    Majiang.View.Jiezhang($('.jiezhang'), this._paipu);
    
    /* 暫定 */
    var self = this;
    $('.jiezhang .paipu .next').unbind('click').bind('click', function(){
        if (self._callback) self._callback();
    });
    $('.jiezhang .paipu .replay').hide();
    
    if (this._callback) $('#game').off().on('click', this._callback);
}

Majiang.Game.Paipu.prototype.seek = function(log_idx, idx) {

    var self = this;
    
    idx = idx || idx > 0 || 0;
    if (log_idx < 0 || this._paipu.log.length <= log_idx) return;

    if (this._mode.auto_play) {
        this._timeout_id = clearTimeout(self._timeout_id);
        this._mode.auto_play = false;
    }

    this._log_idx = log_idx;
    this._idx = 0;
    
    while (this._idx <= idx) {

        var data = this._paipu.log[this._log_idx][this._idx];
        
        if (this._lizhi && ! data.hule) {
            this._chang.defen[this.player_id(this._lunban)] -= 1000;
            this._chang.lizhibang++;
            this._lizhi = false;
        }

        if (data.qipai) {
            this._qipai(data.qipai);
        }
        else if (data.zimo) {
            this._model.shan.zimo(data.zimo.p);
            this._model.shoupai[data.zimo.l].zimo(data.zimo.p);
            this._lunban = data.zimo.l;
        }
        else if (data.dapai) {
            this._model.shoupai[data.dapai.l].dapai(data.dapai.p);
            this._model.he[data.dapai.l].dapai(data.dapai.p);
            if (data.dapai.p.substr(-1) == '*') this._lizhi = true;
        }
        else if (data.fulou) {
            var d = data.fulou.m.match(/[\-\+\=]/)[0];
            this._model.he[this._lunban].fulou(d);
            this._model.shoupai[data.fulou.l].fulou(data.fulou.m);
            this._lunban = data.fulou.l;
        }
        else if (data.gang) {
            this._model.shoupai[data.gang.l].gang(data.gang.m);
        }
        else if (data.gangzimo) {
            this._model.shan.gangzimo(data.gangzimo.p);
            this._model.shoupai[data.gangzimo.l].zimo(data.gangzimo.p);
        }
        else if (data.kaigang) {
            this._model.shan.kaigang(data.kaigang.baopai);
        }
        
        this._idx++;
    }
    
    this.create_view();
}
