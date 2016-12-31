/*
 *  Majiang.View
 */

(function(){

Majiang.View = {

    imgHtml: function(p) {
        return p ? '<img class="pai" data-pai="' + p
                        + '" src="img/' + p + '.gif">'
                 : '<img class="pai" src="img/pai.gif">';
    }
};

})();

/*
 *  Majiang.View.Shoupai
 */

(function(){

var imgHtml = Majiang.View.imgHtml;

Majiang.View.Shoupai = function(node, shoupai, open) {
    this._node = node;
    this._shoupai = shoupai;
    this._open = open;
}

Majiang.View.Shoupai.prototype.redraw = function() {

    var bingpai = this._node.find('.bingpai');
    bingpai.empty();
    for (var s of ['m','p','s','z']) {
        var hongpai = this._shoupai._bingpai[s][0];
        for (var n = 1; n < this._shoupai._bingpai[s].length; n++) {
            var num = this._shoupai._bingpai[s][n];
            if (this._shoupai._zimo && s+n == this._shoupai._zimo) num--;
            if (this._shoupai._zimo && n == 5 && s+'0' == this._shoupai._zimo) {
                hongpai--;
                num--;
            }
            for (var i = 0; i < num; i++) {
                var p;
                if (n == 5 && hongpai > 0) { p = s+'0'; hongpai-- }
                else                         p = s+n;
                bingpai.append(imgHtml(this._open ? p : null));
            }
        }
    }
    if (this._shoupai._zimo && this._shoupai._zimo.length == 2) {
        bingpai.append(
              '<span class="zimo">'
            + imgHtml(this._open ? this._shoupai._zimo : null)
            + '</span>'
        );
    }
 
    var fulou = this._node.find('.fulou');
    fulou.empty();
    for (var m of this._shoupai._fulou) {
        var s = m[0];
        var html = '<span class="mianzi">';
        if (m.replace(/0/g,'5').match(/^[mpsz](\d)\1\1\1$/)) {
            var nn = m.match(/\d/g);
            html += imgHtml() + imgHtml(s+nn[2]) + imgHtml(s+nn[3]) + imgHtml();
        }
        else if (m.replace(/0/g,'5').match(/^[mpsz](\d)\1\1\1?[\-\+\=]\1?$/)) {
            var jiagang = (m.match(/[\-\+\=]\d$/) != null);
            var d       = m.match(/[\-\+\=]/).shift();
            var img     = m.match(/\d/g).map(function(n){return imgHtml(s+n)});
            var img_r   = '<span class="rotate">'
                        + (jiagang ? img[2] + img[3] : img[img.length - 1])
                        + '</span>';
            var daminggang = ! jiagang && img.length == 4;
            if (d == '-')
                html += img_r + img[0] + img[1] + (daminggang ? img[2] : '');
            if (d == '=')
                html += img[0] + img_r + img[1] + (daminggang ? img[2] : '');
            if (d == '+')
                html += img[0] + img[1] + (daminggang ? img[2] : '') + img_r;
        }
        else {
            var nn = m.match(/\d(?=\-)/).concat(m.match(/\d(?!\-)/g));
            html += '<span class="rotate">' + imgHtml(s + nn[0]) + '</span>';
            html += imgHtml(s + nn[1]) + imgHtml(s + nn[2]);
        }
        html += '</span>';
        fulou.append(html);
    }
}

Majiang.View.Shoupai.prototype.dapai = function(p) {

    var bingpai = this._node.find('.bingpai');
    var dapai = bingpai.find('.pai.dapai');
    if (dapai.length == 0) {
        if (p[2] == '_') dapai = bingpai.find('.zimo .pai');
    }
    if (dapai.length == 0) {
        if (this._open) {
            dapai = bingpai.find('.pai[data-pai="'+p.substr(0,2)+'"]:first');
        }
        else {
            dapai = bingpai.find('.pai');
            dapai = dapai.eq(Math.floor(Math.random()*(dapai.length-1)));
        }
    }
    dapai.fadeOut(100);
}

Majiang.View.Shoupai.prototype.open = function() {
    this._open = true;
    this.redraw();
}

})();


/*
 *  Majiang.View.Shan
 */

(function(){

var imgHtml = Majiang.View.imgHtml;

Majiang.View.Shan = function(node, shan) {
    this._node = node;
    this._shan = shan;
}

Majiang.View.Shan.prototype.redraw = function() {

    var baopai = this._shan.baopai();
    this._node.find('.baopai .pai').each(function(i){
        $(this).after(
            (i < baopai.length) ? $(imgHtml(baopai[i])) : $(imgHtml()));
        $(this).remove();
    });

    var fubaopai = this._shan.fubaopai();
    this._node.find('.fubaopai .pai').each(function(i){
        $(this).after(
            (i < fubaopai.length) ? $(imgHtml(fubaopai[i])) : $(imgHtml()));
        $(this).remove();
    });
 
    this._node.find('.paishu').text(this._shan.paishu());
}

})();


/*
 *  Majiang.View.He
 */

(function(){

var imgHtml = Majiang.View.imgHtml;

Majiang.View.He = function(node, he, open){
    this._node = node;
    this._he   = he;
    this._open = open;
    this._node.find('.choma').hide();
}

Majiang.View.He.prototype.redraw = function() {

    var dapai = this._node.find('div.dapai');
    dapai.empty();
    var lizhi = false;
    var i = 0;
    for (var p of this._he._pai) {
        if (p.match(/\*/)) {
            lizhi = true;
            this._node.find('.choma').show();
        }
        if (p.match(/[\-\+\=]$/)) continue;

        var img = imgHtml(p.substr(0,2));
        if (lizhi) {
            img = '<span class="lizhi">' + img + '</span>';
            lizhi = false;
        }
        if (this._open && p[2] == '_') {
            img = '<span class="damopai">' + img + '</span>'
        }
        dapai.append(img);

        i++;
        if (i < 18 && i % 6 == 0) {
            dapai.append('<span class="break"></span>');
        }
    }
}

Majiang.View.He.prototype.dapai = function(p) {

    var dapai = this._node.find('div.dapai');
    var img = imgHtml(p.substr(0,2));
    var c = p.match(/\*/) ? 'dapai lizhi' : 'dapai';
    dapai.append('<span class="'+c+'">' + img + '</span>');
}

})();


/*
 *  Majiang,View.Chang
 */

(function(){

Majiang.View.Chang = function(node, chang, viewpoint) {
    this._node      = node;
    this._chang     = chang;
    this._viewpoint = viewpoint;
}

Majiang.View.Chang.prototype.redraw = function() {

    var feng_hanzi = ['東','南','西','北'];
    var shu_hanzi  = ['一','二','三','四'];
    var view_class = ['main','xiajia','duimian','shangjia'];
 
    this._node.find('.title').text(
            feng_hanzi[this._chang.zhuangfeng]
                + shu_hanzi[this._chang.jushu] + '局');
    this._node.find('.jicun .changbang').text(this._chang.changbang);
    this._node.find('.jicun .lizhibang').text(this._chang.lizhibang);
    this._node.find('.defen .lunban').removeClass('lunban');
 
    for (var l = 0; l < 4; l++) {
        var id = (this._chang.qijia + this._chang.jushu + l) % 4;
        var c  = view_class[(id + 4 - this._viewpoint) % 4];
        $('.player.'+c).text(this._chang.player[id]);
        var defen = '' + this._chang.defen[id];
        defen = defen.replace(/(\d)(\d{3})$/, '$1,$2');
        this._node.find('.defen .'+c).text(feng_hanzi[l] + ': ' + defen);
    }
}

Majiang.View.Chang.prototype.update = function(l) {

    var view_class = ['main','xiajia','duimian','shangjia'];
    var id = (this._chang.qijia + this._chang.jushu + l) % 4;
    var c  = view_class[(id + 4 - this._viewpoint) % 4];
    this._node.find('.defen .lunban').removeClass('lunban');
    this._node.find('.defen .'+c).addClass('lunban');
}

})();


/*
 *  Majiang.View.Jiesuan
 */

(function(){

Majiang.View.Jiesuan = function(node, shan, chang, viewpoint) {

    this._node      = node;
    this._shan      = shan;
    this._chang     = chang;
    this._viewpoint = viewpoint;

    this.hide();
}

Majiang.View.Jiesuan.prototype.fenpei = function(info) {

    var feng_hanzi = ['東','南','西','北'];
    var view_class = ['main','xiajia','duimian','shangjia'];

    for (var l = 0; l < 4; l++) {
 
        var id = (this._chang.qijia + this._chang.jushu + l) % 4;
        var c  = view_class[(id + 4 - this._viewpoint) % 4];
        var node = this._node.find('.fenpei .'+c);
 
        node.find('.name').text(feng_hanzi[l]+':');
 
        var defen = '' + this._chang.defen[id];
        defen = defen.replace(/(\d)(\d{3})$/, '$1,$2');
        node.find('.defen').text(defen);
 
        node.find('.diff').removeClass('plus');
        node.find('.diff').removeClass('minus');
        var diff = info.fenpei[l];
        if      (diff > 0) node.find('.diff').addClass('plus');
        else if (diff < 0) node.find('.diff').addClass('minus');
        diff = (diff > 0) ? '+' + diff
             : (diff < 0) ? ''  + diff
             : '';
        diff = diff.replace(/(\d)(\d{3})$/, '$1,$2');
        node.find('.diff').text(diff);
    }
    this._node.find('.fenpei').show();
}

Majiang.View.Jiesuan.prototype.hule = function(info) {

    this.hide();

    if (this._shan) {
        new Majiang.View.Shan(this._node.find('.shan'), this._shan).redraw();
        if (info.fubaopai) this._node.find('.shan .fubaopai').show();
        else               this._node.find('.shan .fubaopai').hide();
        this._node.find('.shan').show();
    }
 
    var shoupai = this._node.find('.shoupai');
    new Majiang.View.Shoupai(shoupai, info.shoupai, true).redraw();
    shoupai.show();
    
    var hupai = this._node.find('.hupai table');
    hupai.empty();
    if (! info.hule.hupai) {
        var node = $('<tr><td>役なし</td></tr>');
        hupai.append(node);
    }
    else {
        for (var h of info.hule.hupai) {
            var node = $('<tr><td class="name"></td>'
                            + '<td class="fanshu"></td></tr>');
            node.find('.name').text(h.name);
            if (info.hule.damanguan)
                    node.find('.fanshu').text(h.fanshu);
            else    node.find('.fanshu').text(h.fanshu + '翻');
            hupai.append(node);
        }
        var node = $('<tr><td colspan="2" class="defen"></td></tr>');
        var text = info.hule.fu + '符 ' + info.hule.fanshu + '翻 ';

        if      (info.hule.fanshu >= 13)    text += '数え役満 ';
        else if (info.hule.fanshu >= 11)    text += '三倍満 ';
        else if (info.hule.fanshu >=  8)    text += '倍満 ';
        else if (info.hule.fanshu >=  6)    text += '跳満 ';
        else if (info.lunban == 0 && info.hule.defen >= 12000
              || info.lunban != 0 && info.hule.defen >=  8000)
                                            text += '満貫 ';

        if      (info.hule.damanguan == 1)  text  = '役満 ';
        else if (info.hule.damanguan == 2)  text  = 'ダブル役満 ';
        else if (info.hule.damanguan == 3)  text  = 'トリプル役満 ';
        else if (info.hule.damanguan == 4)  text  = '四倍役満 ';
        else if (info.hule.damanguan == 5)  text  = '五倍役満 ';
        else if (info.hule.damanguan == 6)  text  = '六倍役満 ';

        text += info.hule.defen + '点';
        node.find('.defen').text(text);
        hupai.append(node);
    }
    this._node.find('.hupai').show();

    if (this._chang) {
        var node = this._node.find('.jicun');
        node.find('.changbang').text(this._chang.changbang);
        node.find('.lizhibang').text(this._chang.lizhibang);
        node.show();
    }

    if (info.fenpei) this.fenpei(info);

    this._node.fadeIn();
}

Majiang.View.Jiesuan.prototype.pingju = function(info) {

    this.hide();
 
    this._node.find('.pingju').text(info.name).show();
    if (info.fenpei) this.fenpei(info);
 
    this._node.fadeIn();
}

Majiang.View.Jiesuan.prototype.hide = function() {

    this._node.hide();
    this._node.find('.pingju').hide();
    this._node.find('.shan').hide();
    this._node.find('.shoupai').hide();
    this._node.find('.hupai').hide();
    this._node.find('.jicun').hide();
    this._node.find('.fenpei').hide();
}

})();


/*
 *  Majiang.View.Jiezhang
 */

(function(){

Majiang.View.Jiezhang = function(node, paipu) {

    var feng_hanzi = ['東','南','西','北'];
    var shu_hanzi  = ['一','二','三','四'];

    var table = node.find('table').empty();

    var thead = $('<thead></thead>').appendTo(table);
    var tr = $('<tr></tr>').append($('<th colspan="3"></th>')).appendTo(thead);
    for (var name of paipu.player) {
        tr.append($('<th class="name"></th>').text(name));
    }
 
    var tbody = $('<tbody></tbody>').appendTo(table);
    for (var ju of paipu.log) {
 
        var tr = $('<tr></tr>').appendTo(tbody);

        var qipai = ju[0].qipai;

        $('<td class="jushu"></td>')
            .text(feng_hanzi[qipai.zhuangfeng] + shu_hanzi[qipai.jushu] + '局')
            .appendTo(tr);
        $('<td class="changbang"></td>')
            .text(qipai.changbang + '本場')
            .appendTo(tr);

        var jieguo = ju.filter(function(log){return log.pingju || log.hule});
 
        var text = jieguo.length == 0            ? 'ー'
                 : jieguo[0].pingju              ? '流局'
                 : jieguo[0].hule.baojia == null ? 'ツモ'
                 :                                 'ロン';
        $('<td class="jieguo"></td>').text(text).appendTo(tr);
 
        for (var id = 0; id < 4; id++) {
 
            var l = (8 + id - paipu.qijia - qipai.jushu) % 4;
 
            var n = $('<td class="diff"></td>').appendTo(tr);
            if (l == 0) n.addClass('zhuangjia');
 
            if (jieguo.length == 0) continue;
 
            var diff = 0;
            for(var log of jieguo) {
                if (log.hule)   diff += log.hule.fenpei[l]
                if (log.pingju) diff += log.pingju.fenpei[l]
            }
            diff = diff > 0 ? '+' + diff
                 : diff < 0 ? ''  + diff
                 :            '';
            diff = diff.replace(/(\d)(\d{3})$/,'$1,$2');
            n.text(diff);

            for(var log of jieguo) {
                if (log.hule) {
                    if (log.hule.baojia == l) n.addClass('baojia');
                    if (log.hule.l      == l) n.addClass('hule');
                }
            }
         }
    }

    var tfoot = $('<tfoot></tfoot>').appendTo(table);

    tr = $('<tr></tr>').append($('<td colspan="3"></td>')).appendTo(tfoot);
    for (var id = 0; id < 4; id++) {
 
        var n = $('<td class="defen"></td>').appendTo(tr);

        var defen = '' + paipu.defen[id];
        defen = defen.replace(/(\d)(\d{3})$/,'$1,$2');
        n.text(defen);

        if (paipu.rank[id] == 1) n.addClass('guanjun');
        if (paipu.defen[id] < 0) n.addClass('pochan');
    }

    tr = $('<tr></tr>').append($('<td colspan="3" class="point"></td>'))
                       .appendTo(tfoot);
    for (var id = 0; id < 4; id++) {
 
        var n = $('<td class="point"></td>').appendTo(tr);

        var point = paipu.point[id];
        point = (point > 0 ? '+' : '') + point;
        n.text(point);
 
        if (paipu.point[id] > 0) n.addClass('plus');
        if (paipu.point[id] < 0) n.addClass('minus');
    }
 
    node.fadeIn();
}

})();


/*
 *  Majiang.View.Controler
 */

(function(){

Majiang.View.Controler = function(node, game) {

    this._node = node;
    this._game = game;

    var self = this;
 
    this._node.find('.sound .label').unbind('click').bind('click', function(){
        Majiang.Audio.volume(0);
        self.update();
        return false;
    });
    this._node.find('.sound .scale span').each(function(i){
        $(this).unbind('click').bind('click', function(){
            Majiang.Audio.volume(i+1);
            self.update();
            return false;
        });
    });
 
    this._node.find('.speed .scale span').each(function(i){
        $(this).unbind('click').bind('click', function(){
            self._game._speed = i + 1;
            self.update();
            return false;
        });
    });
 
    this._node.children().show();

    this.update();
}

Majiang.View.Controler.prototype.update = function() {

    var self = this;

    this._node.find('.sound .scale span').each(function(i){
        if (i >= Majiang.Audio.volume()) $(this).addClass('off');
        else                             $(this).removeClass('off');
    });
    this._node.find('.speed .scale span').each(function(i){
        if (i >= self._game._speed) $(this).addClass('off');
        else                        $(this).removeClass('off');
    });
}

})();


/*
 *  Majiang.View.Say
 */

(function(){

var view_class = ['main','xiajia','duimian','shangjia'];

Majiang.View.Say = {

    _str: {
        chi:    'チー',
        peng:   'ポン',
        gang:   'カン',
        lizhi:  'リーチ',
        rong:   'ロン',
        zimo:   'ツモ',
    },
    _node: [],
 
    init: function(viewpoint) {
        viewpoint = viewpoint || 0;
        for (var l = 0; l < 4; l++) {
            this._node[l] = $('.say.' + view_class[(l + 4 - viewpoint) % 4]);
        }
    },
 
    play: function(name, l) {
        this._node[l].text(this._str[name]).show().fadeOut(1000);
    }
}

$(function(){ Majiang.View.Say.init() });

})();

/*
 *  Majiang.Audio
 */

(function(){

Majiang.Audio = {

    _audio: {
        dapai: new Audio('audio/dahai11.wav'),
        chi:   new Audio('audio/chii.wav'),
        peng:  new Audio('audio/pon.wav'),
        gang:  new Audio('audio/kan.wav'),
        lizhi: new Audio('audio/richi.wav'),
        rong:  new Audio('audio/ron.wav'),
        zimo:  new Audio('audio/tsumo.wav'),
    },
    _volume: 5,
 
    volume: function(level) {
        if (level == null) return this._volume;
        for (var name in this._audio) {
            this._audio[name].volume = level / 5;
        }
        this._volume = level;
    },
    play: function(name, i) {
        this._audio[name].play();
    }
};

})();
