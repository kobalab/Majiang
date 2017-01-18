/*
 *  Majiang.View.PaipuEditor
 */

(function(){

var imgHtml = Majiang.View.imgHtml;

var feng_hanzi = ['東','南','西','北'];
var shu_hanzi  = ['一','二','三','四'];

function input_pai(type, p, val, str) {

    var node    = $('<label>').addClass('input_pai');
    
    if (type == null) return node;
    
    var input   = $('<div>').addClass('input').append($('<input>').val(val||p));
    var caption = $('<div>').addClass('caption').text(str||'');
    
    if (p == null) {
        if (type == 'mo')      node.append(caption).append(input);
        else if (type == 'da') node.append(input).append(caption);
        else                   node.append(input);
        return node;
    }

    var pai     = p == '_'  ? $('<div>').addClass('pai').text('↓')
                            : imgHtml(p);

    if (type == 'mo')      node.append(caption).append(pai).append(input);
    else if (type == 'da') node.append(pai).append(input).append(caption);
    else                   node.append(pai).append(input);

    input.hide();
    node.on('click', function(){
        $(this).find('.pai').hide();
        $(this).find('.caption').css('visibility','hidden');
        $(this).find('.input').show();
    });
    node.on('focusout', function(){
        $(this).find('.input').hide();
        $(this).find('.pai').show();
        $(this).find('.caption').css('visibility','visible');
    });

    return node;
}

Majiang.View.PaipuEditor = function(node, paipu) {
    this._node  = node;
    this._paipu = paipu;
    this._log_idx = 0;
}

Majiang.View.PaipuEditor.prototype.player_id = function(l) {
    return (this._paipu.qijia
            + this._paipu.log[this._log_idx][0].qipai.jushu
            + l) % 4;
}

Majiang.View.PaipuEditor.prototype.redraw = function() {
    
    var self = this;
    
    this._node.hide();
 
    this.draw();
    
    this.set_title_handler();
    this.set_jushu_handler();
    this.set_jicun_handler();
    this.set_baopai_handler();

    this.set_log_list_handler();

    for (var l = 0; l < 4; l++) {
        this.set_player_handler(l);
        this.set_defen_handler(l);
        this.set_qipai_handler(l);
    }

    this.set_replay_handler();
 
    this._node.fadeIn();
}

Majiang.View.PaipuEditor.prototype.draw = function() {

    this.draw_title();
    this.draw_jushu();
    this.draw_jicun();
    this.draw_baopai();
    this.draw_log_list();

    for (var l = 0; l < 4; l++) {
        this.draw_player(l);
        this.draw_defen(l);
        this.draw_qipai(l);
    }
 
    this.draw_moda();
}

Majiang.View.PaipuEditor.prototype.set_replay_handler = function() {

    var self = this;
    
    this._node.find('.replay').on('click', function(){
        var game = new Majiang.Game.Paipu(self._paipu, self._log_idx);
        game._callback = function(){
            $('body').removeClass('game').addClass('editor');
            $('#game').hide();
            $('#editor').show();
            self.redraw();
        };
        $('body').removeClass('editor').addClass('game');
        $('#editor').hide();
        $('#game').show();
        game.next();
    });
}

Majiang.View.PaipuEditor.prototype.draw_title = function() {

    var title_html = this._paipu.title
                        .split(/\n/)
                        .map(function(str){return $('<p>').text(str).html()})
                        .join('<br>');
    this._node.find('.title div').html(title_html).show();
    this._node.find('.title textarea').val(this._paipu.title).hide();
}

Majiang.View.PaipuEditor.prototype.set_title_handler = function() {

    var self = this;

    this._node.find('.title').off('click').on('click', function(){
        $(this).find('div').hide();
        $(this).find('textarea').show();
    });
    
    this._node.find('.title textarea').off('focusout').on('focusout', function(){
        self.draw_title();
    });
    this._node.find('.title textarea').off('change').on('change', function(){
        self._paipu.title = $(this).val().replace(/\n+$/,'') || '（牌譜名）';
        self.draw_title();
    });
}

Majiang.View.PaipuEditor.prototype.draw_jushu = function() {

    var qipai = this._paipu.log[this._log_idx][0].qipai;
    
    this._node.find('.jushu div').text(
                          feng_hanzi[qipai.zhuangfeng]
                        + shu_hanzi[qipai.jushu]
                        + '局').show();
    var select = this._node.find('.jushu select').empty().hide();
    for (var zhuangfeng = 0; zhuangfeng < 4; zhuangfeng++) {
        for (var jushu = 0; jushu < 4; jushu++) {
            var option = $('<option>').text(
                          feng_hanzi[zhuangfeng]
                        + shu_hanzi[jushu]
                        + '局')
                        .val(zhuangfeng * 4 + jushu);
            if (zhuangfeng == qipai.zhuangfeng && jushu == qipai.jushu) {
                option.attr('selected', 'selected')
            }
            select.append(option);
        }
    }
}

Majiang.View.PaipuEditor.prototype.set_jushu_handler = function() {

    var self = this;

    this._node.find('.jushu').off('click').on('click', function(){
        $(this).find('div').hide();
        $(this).find('select').show();
    });

    this._node.find('.jushu').off('focusout').on('focusout', function(){
        $(this).find('select').hide();
        $(this).find('div').show();
    });
    this._node.find('.jushu select').off('change').on('change', function(){
        self._paipu.log[self._log_idx][0].qipai.zhuangfeng
                                    = Math.floor($(this).val() / 4);
        self._paipu.log[self._log_idx][0].qipai.jushu
                                    = Math.floor($(this).val() % 4);
        self.redraw();
    });
}

Majiang.View.PaipuEditor.prototype.draw_jicun = function() {
    this._node.find('.jicun .changbang input')
                .val(this._paipu.log[this._log_idx][0].qipai.changbang);
    this._node.find('.jicun .lizhibang input')
                .val(this._paipu.log[this._log_idx][0].qipai.lizhibang);
}

Majiang.View.PaipuEditor.prototype.set_jicun_handler = function() {

    var self = this;
    
    this._node.find('.jicun .changbang input').off('change')
                                              .on('change', function(){
        self._paipu.log[self._log_idx][0].qipai.changbang = $(this).val();
    });
    this._node.find('.jicun .lizhibang input').off('change')
                                              .on('change', function(){
        self._paipu.log[self._log_idx][0].qipai.lizhibang = $(this).val();
    });
}

Majiang.View.PaipuEditor.prototype.draw_baopai = function() {

    var baopai = this._paipu.log[this._log_idx][0].qipai.baopai;
    this._node.find('.baopai').empty()
                              .append('<span>ドラ </span>')
                              .append(input_pai('baopai', baopai))
                              .append($(imgHtml()))
                              .append($(imgHtml()))
                              .append($(imgHtml()))
                              .append($(imgHtml()));
}

Majiang.View.PaipuEditor.prototype.set_baopai_handler = function() {

    var self = this;
    
    this._node.find('.baopai input').off('change').on('change', function(){
        self._paipu.log[self._log_idx][0].qipai.baopai = $(this).val();
        self.draw_baopai();
        self.set_baopai_handler();
    });
}

Majiang.View.PaipuEditor.prototype.draw_log_list = function() {

    var log_list = this._node.find('.log').empty();
    
    for (var log_idx = 0; log_idx < this._paipu.log.length; log_idx++) {
        var qipai = this._paipu.log[log_idx][0].qipai;
        var log = $('<div>').text(
                          feng_hanzi[qipai.zhuangfeng]
                        + shu_hanzi[qipai.jushu]
                        + '局 '
                        + qipai.changbang
                        + '本場');
        if (log_idx == this._log_idx) log.addClass('selected');
        log_list.append(log);
    }
}

Majiang.View.PaipuEditor.prototype.set_log_list_handler = function() {

    var self = this;
    
    this._node.find('.log > div').each(function(i){
        $(this).off('click').on('click', i, function(event){
            self._log_idx = event.data;
            self.redraw();
        });
    });
}

Majiang.View.PaipuEditor.prototype.draw_player = function(l) {

    var id = this.player_id(l);

    this._node.find('.player .name').eq(l).text(this._paipu.player[id]).show();
    this._node.find('.player input').eq(l).val(this._paipu.player[id]).hide();
}

Majiang.View.PaipuEditor.prototype.set_player_handler = function(l) {

    var self = this;

    this._node.find('.player').off('click').on('click', function(){
        $(this).find('.name').hide();
        $(this).find('input').attr('size', 10).show();
    });

    this._node.find('.player input').eq(l)
                                    .off('change').on('change', function(){
        self._paipu.player[self.player_id(l)] = $(this).val();
        self.draw_player(l);
    });
    this._node.find('.player input').eq(l)
                                    .off('focusout').on('focusout', function(){
        self.draw_player(l);
    });
}

Majiang.View.PaipuEditor.prototype.draw_defen = function(l) {

    var qipai = this._paipu.log[this._log_idx][0].qipai;

    this._node.find('.defen input').eq(l).val(qipai.defen[l]);
}

Majiang.View.PaipuEditor.prototype.set_defen_handler = function(l) {

    var self = this;
    var qipai = this._paipu.log[this._log_idx][0].qipai;
    
    this._node.find('.defen input').eq(l)
                                   .off('change').on('change', function(){
        qipai.defen[l] = + $(this).val();
    });
}

Majiang.View.PaipuEditor.prototype.draw_qipai = function(l) {

    var qipai = this._paipu.log[this._log_idx][0].qipai;
    var paistr = qipai.shoupai[l];
    
    var input   = this._node.find('.qipai input').eq(l);
    var shoupai = this._node.find('.qipai > span').eq(l);
    
    new Majiang.View.Shoupai(
                shoupai, Majiang.Shoupai.fromString(paistr), true
    ).redraw();
    
    if (paistr) {
        input.val(paistr).hide();
        shoupai.show();
    }
    else {
        shoupai.hide();
        input.val('').show();
    }
    
}

Majiang.View.PaipuEditor.prototype.set_qipai_handler = function(l) {

    var self = this;
    var qipai = this._paipu.log[this._log_idx][0].qipai;
    
    this._node.find('.qipai').off('click').on('click', function(){
        $(this).find('> span').hide();
        $(this).find('input').show();
    });
    
    this._node.find('.qipai input').eq(l)
                                .off('change').on('change', l, function(event){
        qipai.shoupai[event.data]
                    = Majiang.Shoupai.fromString($(this).val()).toString();
        self.draw_qipai(event.data);
    });
    
    this._node.find('.qipai input').eq(l)
                            .off('focusout').on('focusout', l, function(event){
        self.draw_qipai(event.data);
    });
}

Majiang.View.PaipuEditor.prototype.draw_moda = function() {

    var log = this._paipu.log[this._log_idx];
    
    var mo = this._node.find('.paipu .mo').empty();
    var da = this._node.find('.paipu .da').empty();
    
    var shoupai = [];
    for (var l = 0; l < 4; l++) {
        shoupai.push(Majiang.Shoupai.fromString(log[0].qipai.shoupai[l]));
    }
    
    var i = 1, j = 0;
    while (i < log.length) {
    
        var k = log[i];
        var l = Math.floor(j/2);
        
        if (k.pingju || k.kaigang) {
            i++;
            continue;
        }
        if (k.hule) {
            shoupai[k.hule.l] = Majiang.Shoupai.fromString(k.hule.shoupai);
            i++;
            continue;
        }
        
        if (j % 2 == 0) {
            if (k.zimo && k.zimo.l == l) {
                var p = k.zimo.p;
                if (log[i+1].hule)
                        mo.eq(l).append(input_pai('mo', p, p+'!', 'ツモ'));
                else if (log[i+1].pingju)
                        mo.eq(l).append(input_pai('mo', p, p+'~'));
                else if (log[i+1].dapai && log[i+1].dapai.p[2] == '_')
                        mo.eq(l).append(input_pai('mo', '_', p));
                else    mo.eq(l).append(input_pai('mo', p));
                shoupai[l].zimo(p);
                i++;
            }
            else if (k.gangzimo && k.gangzimo.l == l) {
                var p = k.gangzimo.p;
                if (log[i+1].hule)
                        mo.eq(l).append(input_pai('mo', p, p, 'ツモ'));
                else if (log[i+1].dapai && log[i+1].dapai.p[2] == '_')
                        mo.eq(l).append(input_pai('mo', '_', p));
                else    mo.eq(l).append(input_pai('mo', p));
                shoupai[l].zimo(p);
                i++;
            }
            else if (k.fulou && k.fulou.l == l) {
                var m = k.fulou.m.replace('0','5');
                var caption = m.match(/^[mpsz](\d)\1\1\1/) ? 'カン'
                            : m.match(/^[mpsz](\d)\1\1/)   ? 'ポン'
                            :                                'チー';
                var p = m[0] + m.match(/(\d)[\+\-\=]/)[1];
                mo.eq(l).append(input_pai('mo', p, k.fulou.m, caption));
                shoupai[l].fulou(k.fulou.m);
                i++;
            }
            else {
                mo.eq(l).append(input_pai());
            }
        }
        else {
            if (k.dapai && k.dapai.l == l) {
                var p = k.dapai.p, caption = '', val = p;
                if (p.substr(-1) == '*') caption += 'リーチ';
                if (log[i+1].hule)       caption += '放銃';
                if (p[2] == '_')         val = p.substr(2);
                if (log[i+1].hule)       val += '!';
                if (log[i+1].pingju)     val += '~';
                da.eq(l).append(input_pai('da', p.substr(0,2), val, caption));
                shoupai[l].dapai(p);
                i++;
                if (log[i].fulou) {
                    j++;
                    while (j < 8) {
                        l = Math.floor(j/2);
                        mo.eq(l).append(input_pai());
                        da.eq(l).append(input_pai());
                        j += 2;
                    }
                    j = 0;
                    continue;
                }
            }
            else if (k.gang && k.gang.l == l) {
                var p = k.gang.m[0] + k.gang.m.substr(-1);
                var caption = 'カン';
                var val = p + '^';
                if (log[i+1].hule)       caption += '放銃';
                da.eq(l).append(input_pai('da', p, val, caption));
                shoupai[l].gang(k.gang.m);
                i++;
            }
            else {
                da.eq(l).append(input_pai());
            }
        }
        
        j = (j + 1) % 8;
    }
    
    for (var l = 0; l < 4; l++) {
        (new Majiang.View.Shoupai(
            this._node.find('.shoupai').eq(l), shoupai[l], true
        )).redraw();
    }
}

})();
