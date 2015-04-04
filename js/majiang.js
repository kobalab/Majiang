var Majiang = {};

(function(){

/*
 *  Majiang.Util
 */
function dazi(pai) {

    var n_pai = 0;
    var n_dazi = 0;
    
    for (var i = 0; i < 9; i++) {
        n_pai += pai[i];
        if (i < 7 && pai[i+1] == 0 && pai[i+2] == 0) {
            n_dazi += Math.floor(n_pai / 2);
            n_pai = 0;
        }
    }
    n_dazi += Math.floor(n_pai / 2);
    
    return n_dazi;
}
function mianzi(pai, n) {

    if (n == 9) {
        var n_dazi = dazi(pai);
        return [[0, n_dazi], [0, n_dazi]];
    }
    
    var max = mianzi(pai, n+1);
    
    if (n < 7 && pai[n] > 0 && pai[n+1] > 0 && pai[n+2] > 0) {
        pai[n]--; pai[n+1]--; pai[n+2]--;
        var r = mianzi(pai, n);
        pai[n]++; pai[n+1]++; pai[n+2]++;
        r[0][0]++; r[1][0]++;
        if (r[0][0]* 2 + r[0][1] > max[0][0]* 2 + max[0][1]) max[0] = r[0];
        if (r[1][0]*10 + r[1][1] > max[1][0]*10 + max[1][1]) max[1] = r[1];
    }
    
    if (pai[n] >= 3) {
        pai[n] -= 3;
        var r = mianzi(pai, n);
        pai[n] += 3;
        r[0][0]++; r[1][0]++;
        if (r[0][0]* 2 + r[0][1] > max[0][0]* 2 + max[0][1]) max[0] = r[0];
        if (r[1][0]*10 + r[1][1] > max[1][0]*10 + max[1][1]) max[1] = r[1];
    }
    
    return max;
}
function mianzi_all(shoupai) {

    var r = {};

    r.m = mianzi(shoupai._shouli.m, 0);
    r.p = mianzi(shoupai._shouli.p, 0);
    r.s = mianzi(shoupai._shouli.s, 0);

    r.z = [ 0, 0 ];
    for (var i = 0; i < 7; i++) {
        if (shoupai._shouli.z[i] >= 3) r.z[0]++;
        if (shoupai._shouli.z[i] == 2) r.z[1]++;
    }
    
    var min_xiangting = 8;

    for (var m = 0; m < 2; m++) {
        for (var p = 0; p < 2; p++) {
            for (var s = 0; s < 2; s++) {
                var n_mianzi = r.m[m][0] + r.p[p][0] + r.s[s][0] + r.z[0]
                             + shoupai._fulou.length;
                var n_dazi   = r.m[m][1] + r.p[p][1] + r.s[s][1] + r.z[1];
                if (n_mianzi + n_dazi > 4) n_dazi = 4 - n_mianzi;
                var xiangting = 8 - n_mianzi * 2 - n_dazi;
                if (xiangting < min_xiangting) min_xiangting = xiangting;
            }
        }
    }
    
    return min_xiangting;
}

Majiang.Util = {

    xiangting_guoshi: function(shoupai) {
        var n_yaojiu  = 0;
        var you_duizi = false;
        for (var s of ['m','p','s']) {
            var pai = shoupai._shouli[s];
            for (var i of [0, 8]) {
                if (pai[i] > 0) n_yaojiu++;
                if (pai[i] > 1) you_duizi = true;
            }
        }
        var pai = shoupai._shouli.z;
        for (var i = 0; i < pai.length; i++) {
            if (pai[i] > 0) n_yaojiu++;
            if (pai[i] > 1) you_duizi = true;
        }
        return you_duizi ? 12 - n_yaojiu : 13 - n_yaojiu;
    },

    xiangting_qiduizi: function(shoupai) {
        var n_duizi = 0;
        var n_danqi = 0;
        for (var s in shoupai._shouli) {
            var pai = shoupai._shouli[s];
            for (var i = 0; i < pai.length - 1; i++) {
                if      (pai[i] >= 2) n_duizi++;
                else if (pai[i] == 1) n_danqi++;
            }
        }
        if (n_duizi + n_danqi < 7)
                return 6 - n_duizi + (7 - n_duizi - n_danqi);
        else    return 6 - n_duizi;
    },
 
    xiangting_yiban: function(shoupai) {

        var min_xiangting = mianzi_all(shoupai);
    
        for (var sort in shoupai._shouli) {
            for (var i = 0; i < shoupai._shouli[sort].length; i++) {
                if (shoupai._shouli[sort][i] >= 2) {
                    shoupai._shouli[sort][i] -= 2;
                    var xiangting = mianzi_all(shoupai) - 1;
                    shoupai._shouli[sort][i] += 2;
                    if (xiangting < min_xiangting) min_xiangting = xiangting;
                }
            }
        }
    
        return min_xiangting;
    },
 
    xiangting: function(shoupai) {
 
        var min_xiangting = Majiang.Util.xiangting_guoshi(shoupai);
 
        var xiangting = Majiang.Util.xiangting_qiduizi(shoupai);
        if (xiangting < min_xiangting) min_xiangting = xiangting;
 
        var xiangting = Majiang.Util.xiangting_yiban(shoupai);
        if (xiangting < min_xiangting) min_xiangting = xiangting;
 
        return min_xiangting;
    }
 
};

/******************************************************************************

    Model

******************************************************************************/

/*
 *  Majiang.Shan
 */
function zhenbaopai(jiabaipai) {
    if (jiabaipai[0] == 'z') {
        if (jiabaipai[1] < 5) return jiabaipai[0] + (jiabaipai[1] % 4 + 1);
        else                  return jiabaipai[0] + ((jiabaipai[1] - 4) % 3 + 5);
    }
    else                      return jiabaipai[0] + (jiabaipai[1] % 9 + 1);
}

Majiang.Shan = function(pai) {

    if (pai) {
        this._pai = pai;
    }
    else {
        pai = [];
        var sort = ['m', 'p', 's', 'z'];
        for (var s = 0; s < sort.length; s++) {
            for (var n = 1; n <= 9; n++) {
                if (sort[s] != 'z' || n <= 7) {
                    for (var m = 0; m < 4; m++) {
                        pai.push(sort[s]+n);
                    }
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
    }
 
    this._baopai   = [this._pai[4]];
    this._fubaopai = [this._pai[8]];

    this._weikaigang = false;
}
Majiang.Shan.prototype.paishu = function() {
    return this._pai.length - 14;
}
Majiang.Shan.prototype.zimo = function() {
    if (this.paishu() > 0) return this._pai.pop();
}
Majiang.Shan.prototype.baopai = function() {
    var baopai = [];
    for (var pai of this._baopai) {
        baopai.push(zhenbaopai(pai));
    }
    return baopai;
}
Majiang.Shan.prototype.fubaopai = function() {
    var baopai = [];
    for (var pai of this._fubaopai) {
        baopai.push(zhenbaopai(pai));
    }
    return baopai;
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
        this._fubaopai.push(this._pai[8]);
        this._weikaigang = false;
    }
}

/*
 *  Majiang.Shoupai
 */
Majiang.Shoupai = function(haipai) {
    this._shouli = {
        m: [0,0,0,0,0,0,0,0,0],
        p: [0,0,0,0,0,0,0,0,0],
        s: [0,0,0,0,0,0,0,0,0],
        z: [0,0,0,0,0,0,0]
    };
    this._fulou = [];
    this._zimo  = null;
    this._lizhi = false;
 
    for (var i = 0; i < haipai.length && i < 13; i++) {
        this._shouli[haipai[i][0]][haipai[i][1] - 1]++;
    }
}
Majiang.Shoupai.fromString = function(paistr) {

	function sort(a, b) {
		return a[0] == b[0] ?  0
			 : a[0] >  b[0] ?  1
			 :                -1;
	}

    var peipai = [];
	var fulou  = paistr.match(/[^,]+/g);
	var shouli = fulou.shift();
    for (var sub of shouli.match(/\d+[mpsz]/g)) {
        var s = sub.substr(-1);
        for (var n of sub.match(/\d/g)) {
            peipai.push(s+n);
        }
    }
    while (peipai.length > 14 - fulou.length * 3) peipai.pop();
    var zimo = (peipai.length - 2) % 3 == 0 && peipai.pop();
    var shoupai = new Majiang.Shoupai(peipai);
    if (zimo) shoupai.zimo(zimo);
	for (var mianzi of fulou) {
		mianzi = mianzi.match(/./g).reverse().join('');
		mianzi = mianzi[0]
               + mianzi.match(/\d[\-\+\=]?/g).sort(sort).join('');
		shoupai._fulou.push(mianzi);
	}
    return shoupai;
}
Majiang.Shoupai.prototype.toString = function() {

    function reverse(a, b) {
        return a[0] == b[0] ?  0
                     : a[0] <  b[0] ?  1
                     :                -1;
    }

    var paistr = '';
    for (var s of ['m','p','s','z']) {
        var sub = '';
        var pai = this._shouli[s];
        for (var n = 1; n <= pai.length; n++) {
            var num = pai[n-1];
            if (this._zimo && s+n == this._zimo) num--;
            for (var i = 0; i < num; i++) {
                sub += n;
            }
        }
        if (sub.length > 0) sub += s;
        paistr += sub;
    }
    if (this._zimo && this._zimo.length == 2) {
        paistr += this._zimo[1] + this._zimo[0];
    }
    for (var mianzi of this._fulou) {
		mianzi = mianzi[0]
               + mianzi.match(/\d[\-\+\=]?/g).sort(reverse).join('');
		mianzi = mianzi.match(/./g).reverse().join('');
        paistr += ',' + mianzi;
    }
    return paistr;
}
Majiang.Shoupai.prototype.zimo = function(p) {
    if (! this._zimo) {
        this._zimo = p;
        this._shouli[p[0]][p[1] - 1]++;
    }
}
Majiang.Shoupai.prototype.fulou = function(p) {
    if (! this._zimo) {
        var s  = p[0];
        var nn = p.match(/\d(?![\-\+\=])/g);
        this._fulou.push(p);
        for (var n of nn) {
            this._shouli[s][n-1]--;
        }
        if (! p.match(/(\d)\1\1\1/)) this._zimo = p;
    }
}
Majiang.Shoupai.prototype.gang = function(p) {
    if (this._zimo && this._zimo.length == 2) {
        if (this._shouli[p[0]][p[1] - 1] == 4) {
            this._fulou.push(p[0]+p[1]+p[1]+p[1]+p[1]);
        }
        else {
            var regexp = new RegExp('^' + p[0] + p[1] + '{3}');
            for (var i = 0; i < this._fulou.length; i++) {
                if (this._fulou[i].match(regexp)) {
                    this._fulou[i] += p[1];
                }
            }
        }
        this._shouli[p[0]][p[1] - 1] = 0;
        this._zimo = null;
    }
}
Majiang.Shoupai.prototype.dapai = function(p) {
    if (this._zimo) {
        if (this._lizhi && p != this._zimo) return;
        this._zimo = null;
        this._shouli[p[0]][p[1] - 1]--;
        if (p[2] == '*') {
            this._lizhi = true;
        }
    }
}

/*
 *  Majiang.He
 */
Majiang.He = function() {
    this._pai = [];
}
Majiang.He.prototype.dapai = function(p) {
    this._pai.push(p);
}
Majiang.He.prototype.fulou = function(f) {
    this._pai[this._pai.length - 1] += f;
}

/*
 *  Majiang.Audio
 */
Majiang.Audio = {

    _audio: {
        dapai: new Audio('audio/dahai11.wav'),
        chi:   new Audio('audio/chii.wav'),
        peng:  new Audio('audio/pon.wav'),
        gang:  new Audio('audio/kan.wav'),
        lizhi: new Audio('audio/richi.wav'),
        rong:  new Audio('audio/ron.wav'),
        zimo:  new Audio('audio/tsumo.wav'),
        beep:  new Audio('audio/Purr.aiff'),
    },
    volume: function(level) {
        for (var name in this._audio)
            this._audio[name].volume = level / 5;
    },
    play: function(name) {
        this._audio[name].play();
    }
};

/******************************************************************************

    View

******************************************************************************/
Majiang.View = {};

function imgHtml(pai) {
    return pai ? '<img class="pai" data-pai="' + pai
                               + '" src="img/' + pai + '.gif" />'
               : '<img class="pai" src="img/pai.gif" />';
}

/*
 *  Majiang.View.Shoupai
 */
Majiang.View.Shoupai = function(node, shoupai, open) {
    this._node = node;
    this._shoupai = shoupai;
    this._open = open;
}
Majiang.View.Shoupai.prototype.redraw = function() {
 
    var shouli = this._node.find('.shouli');
    shouli.empty();
    for (var s of ['m','p','s','z']) {
        for (var n = 0; n < this._shoupai._shouli[s].length; n++) {
            var pai = s + (n+1);
            var num = this._shoupai._shouli[s][n];
            if (this._shoupai._zimo && pai == this._shoupai._zimo) num--;
            for (var i = 0; i < num; i++) {
                if (! this._open) pai = null;
                shouli.append(imgHtml(pai));
            }
        }
    }
    if (this._shoupai._zimo && this._shoupai._zimo.length == 2) {
        var pai = this._open ? this._shoupai._zimo : null;
        shouli.append('<span class="zimo">' + imgHtml(pai) + '</span>');
    }
 
    var fulou = this._node.find('.fulou');
    fulou.empty();
    for (var mianzi of this._shoupai._fulou) {
        var html = '<span class="mianzi">';
        var s = mianzi[0];
        if (mianzi.match(/^.(?!(\d)\1).*$/)) {              // 顺子
            var nn = (mianzi.match(/\d(?=\-)/)).concat(
                        mianzi.match(/\d(?![\-\+\=])/g));
            html += '<span class="rotate">' + imgHtml(s + nn[0]) + '</span>';
            html += imgHtml(s + nn[1]) + imgHtml(s + nn[2]);
        }
        if (mianzi.match(/^.(\d)\1\1\1?[\-\+\=]\1?$/)) {    // 刻子 or 明杠子
            var n  = mianzi[1];
            var d  = mianzi.match(/[\-\+\=]/).shift();
            var nn = mianzi.match(/\d+/).shift().match(/\d/g);
            var jiagang = (mianzi.match(/[\-\+\=]\d$/) != null);
            var img   = imgHtml(s + n);
            var img_r = '<span class="rotate">'
                        + (jiagang ? img + img : img) + '</span>';
            for (var i = 0; i < nn.length; i++) { nn[i] = img }
            if (d == '-') nn[0]            = img_r;
            if (d == '=') nn[1]            = img_r;
            if (d == '+') nn[nn.length -1] = img_r;
            for (var str of nn) { html += str }
        }
        if (mianzi.match(/^.(\d)\1\1\1$/)) {                // 暗杠子
            n = mianzi[1];
            html += imgHtml() + imgHtml(s + n) + imgHtml(s + n) + imgHtml();
        }
        html += '</span>';
        fulou.prepend($(html));
    }
}

/*
 *  Majiang.View.Shan
 */
Majiang.View.Shan = function(node, shan) {
    this._node = node;
    this._shan = shan;
}
Majiang.View.Shan.prototype.redraw = function() {
    var baopai = this._shan._baopai;
    var x = this._node.find('.baopai .pai');
    this._node.find('.baopai .pai').each(function(i){
        $(this).after(
            i < baopai.length ? $(imgHtml(baopai[i])) : $(imgHtml())
        );
        $(this).remove();
    });;
    this._node.find('.paishu').text(this._shan.paishu());
}

/*
 *  Majiang.View.He
 */
Majiang.View.He = function(node, lizhi, he) {
    this._node  = node;
    this._lizhi = lizhi;
    this._he    = he;
    this._lizhi.find('.choma').hide();
}
Majiang.View.He.prototype.redraw = function() {
    this._node.empty();
    var lizhi = false;
    var i = 0;
    for (var pai of this._he._pai) {
        if (pai[2] == '*') {
            lizhi = true;
            this._lizhi.find('.choma').show();
        }
        if (pai.match(/[\-\+\=]$/)) continue;
        if (lizhi) {
            this._node.append(
                $('<span class="lizhi">' + imgHtml(pai.substr(0,2)) + '</span>')
            );
            lizhi = false;
        }
        else this._node.append($(imgHtml(pai)));
        i++;
        if (i < 18 && i % 6 == 0) {
            this._node.append($('<span class="break"></span>'))
        }
    }
}
Majiang.View.He.prototype.dapai = function(p) {
    var c = (p[2] == '*') ? 'dapai lizhi' : 'dapai';
    this._node.append(
        $('<span class="' + c + '">' + imgHtml(p.substr(0,2)) + '</span>')
    );
 
}

/*
 *  Majiang.View.Chang
 */
Majiang.View.Chang = function(node, chang) {
    this._node   = node;
    this._chang  = chang;
    this._lunban = [];
}
Majiang.View.Chang.prototype.redraw = function() {
    var menfeng = ['東','南','西','北'];
    var jushu   = ['一','二','三','四'];
    var feng    = ['dong','nan','xi','bei'];

    this._node.find('.title').text(
                menfeng[this._chang.menfeng] + jushu[this._chang.jushu] + '局');
    this._node.find('.jicun .changbang').text(this._chang.jicun.changbang);
    this._node.find('.jicun .lizhibang').text(this._chang.jicun.lizhibang);
    this._node.find('.defen .lunban').removeClass('lunban');
 
    for (var i = 0; i < 4; i++) {
        var f = feng[(this._chang.qijia + this._chang.jushu + i) % 4];
        var defen = '' + this._chang.defen[i];
        defen = defen.replace(/(\d{3})$/, ',$1');
        this._node.find('.defen .' + f).text(menfeng[i] + ': ' + defen);
    }
    this._node.find('.defen .lunban').removeClass('lunban');
}
Majiang.View.Chang.prototype.update = function(lunban) {
    var feng = ['dong','nan','xi','bei'];
    var f = feng[(this._chang.qijia + this._chang.jushu + lunban) % 4];
    this._node.find('.defen .lunban').removeClass('lunban');
    this._node.find('.defen .' + f).addClass('lunban');
}

/******************************************************************************

    Controller

******************************************************************************/

/*
 *  Majiang.Game
 */

Majiang.Game = function() {
    this._chang = {
        menfeng: 0,
        jushu:   0,
        qijia:   Math.floor(Math.random() * 4),
        jicun:  { changbang: 0, lizhibang: 0 },
        defen:  [ 25000, 25000, 25000, 25000 ]  // 仮親からの順
    };
 
    this._player = [ new Majiang.UI(0) ];       // 仮親は常にUI
    for (var i = 1; i < 4; i++) {
        this._player.push(new Majiang.Player(i));
    }
    this._reply = [];
 
    Majiang.Audio.volume(2);
}
Majiang.Game.prototype.player = function(lunban) {
    return (this._chang.qijia + this._chang.jushu + lunban) % 4;
}
Majiang.Game.prototype.kaiju = function() {
  console.log('*** 開局 ***');  // for DEBUG

    this._model = {
        shan:    new Majiang.Shan(),
        he:      [],
        shoupai: [],
    };
    this._view = {
        chang:   new Majiang.View.Chang($('.chang'), this._chang),
        shan:    new Majiang.View.Shan($('.shan'), this._model.shan),
        he:      [],
        shoupai: [],
    }
    this._lunban = 0;

    this._view.chang.redraw();

    var haipai = [ [], [], [], [] ];        // この局の東南西北の順
    for (var n = 0; n < 3; n++) {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                haipai[i].push(this._model.shan.zimo());
            }
        }
    }
    for (var i = 0; i < 4; i++) {
        haipai[i].push(this._model.shan.zimo());
    }
 
    var feng = ['dong','nan','xi','bei'];
    for (var i = 0; i < 4; i++) {           // この局の東南西北の順
        this._model.shoupai[i] = new Majiang.Shoupai(haipai[i]);
        this._model.he[i]      = new Majiang.He();

        var f = feng[this.player(i)];
        this._view.shoupai[i]
            = new Majiang.View.Shoupai(
                    $('.shoupai.'+f), this._model.shoupai[i], f == 'dong');
        this._view.he[i] = new Majiang.View.He(
                    $('.he.'+f), $('.lizhi.'+f), this._model.he[i]);

        this._view.shoupai[i].redraw();
        this._view.he[i].redraw();
    }
 
    for (var i = 0; i < 4; i++) {           // この局の東南西北の順
        var data = {
            chang: { /*** 実装要 ***/},
            zifeng: i,
            haipai: haipai[i]
        }
        this._player[this.player(i)].kaiju(data);
    }
 
    this.zimo();
}
Majiang.Game.prototype.zimo = function() {

    var zimo   = this._model.shan.zimo();
    var paishu = this._model.shan.paishu();
    this._model.shoupai[this._lunban].zimo(zimo);

    this._view.chang.update(this._lunban);
    this._view.shan.redraw();
    this._view.shoupai[this._lunban].redraw();

    var self = this;
    this._reply = [];
    for (var i = 0; i < 4; i++) {
        var p = (i == this.player(this._lunban)) ? zimo : null;
        this._player[i].zimo(
            { lunban: self._lunban, zimo: p, paishu: paishu },
            function(id, type, data){self.reply_zimo(id, type, data)},
            1000
        );
    }
}
Majiang.Game.prototype.dapai = function(dapai) {

    Majiang.Audio.play('dapai');

    this._model.shoupai[this._lunban].dapai(dapai);
    this._view.shoupai[this._lunban].redraw();

    this._model.he[this._lunban].dapai(dapai);
    this._view.he[this._lunban].dapai(dapai);
 
    var self = this;
    this._reply = [];
    for (var i = 0; i < 4; i++) {
        this._player[i].dapai(
            { lunban: self._lunban, dapai: dapai },
            function(id, type, data){self.reply_dapai(id, type, data)},
            0
        );
    }
}
Majiang.Game.prototype.fulou = function(data) {

    var f = data.match(/[\-\+\=]/)[0];

    this._model.he[this._lunban].fulou(f);
    this._view.he[this._lunban].redraw();

    var lunban = this._lunban;
    this._lunban = (f == '-') ? (this._lunban + 1) % 4
                 : (f == '=') ? (this._lunban + 2) % 4
                 : (f == '+') ? (this._lunban + 3) % 4
                 :               this._lunban;
    this._view.chang.update(this._lunban);

    this._model.shoupai[this._lunban].fulou(data);
    this._view.shoupai[this._lunban].redraw();

    var self = this;
    this._reply = [];
    if (data.match(/^[mpsz](\d)\1\1\1[\-\+\=]$/)) {
        for (var i = 0; i < 4; i++) {
            this._player[i].gang(
                { lunban: self._lunban, gang: data },
                function(id, type, data){self.reply_gang(id, type, data)},
                1000
            );
        }
    }
    else {
        for (var i = 0; i < 4; i++) {
            this._player[i].fulou(
                { lunban: self._lunban, fulou: data },
                function(id, type, data){self.reply_fulou(id, type, data)},
                1000
            );
        }
    }
}
Majiang.Game.prototype.gang = function(data) {

    this._model.shoupai[this._lunban].gang(data);
    this._view.shoupai[this._lunban].redraw();

    var self = this;
    this._reply = [];
    for (var i = 0; i < 4; i++) {
        this._player[i].gang(
            { lunban: self._lunban, gang: data },
            function(id, type, data){self.reply_gang(id, type, data)},
            1000
        );
    }
}
Majiang.Game.prototype.gangzimo = function() {
 
    var zimo = this._model.shan.gangzimo();
    this._model.shoupai[this._lunban].zimo(zimo);

    this._model.shan.kaigang(); // 明カンの場合はここで開カンしてはいけない。

    this._view.chang.update(this._lunban);
    this._view.shan.redraw();
    this._view.shoupai[this._lunban].redraw();

    var self = this;
    this._reply = [];
    this._player[this.player(this._lunban)].zimo(
        { lunban: self._lunban, zimo: zimo },
        function(id, type, data){self.reply_zimo(id, type, data)},
        1000
    );
}
Majiang.Game.prototype.liuju = function() {
    this._view.he[this._lunban].redraw();
    this.hule();
}
Majiang.Game.prototype.hule = function() {

    this._chang.jushu++;
    if (this._chang.jushu == 4) {
        this._chang.menfeng++;
        this._chang.jushu = 0;
    }
    if (this._chang.menfeng == 2) return;

    var self = this;
    setTimeout(function(){ self.kaiju() }, 5000);
}
Majiang.Game.prototype.reply_zimo = function(id, type, data) {
  console.log('[' + id +'] (' + type + ', ' + data + ')');  // for DEBUG
    if      (type == 'dapai')   this.dapai(data)
    else if (type == 'gang')    this.gang(data)
    else if (type == 'hule')    this.hule()
}
Majiang.Game.prototype.reply_dapai = function(id, type, data) {
  console.log('[' + id +'] (' + type + ', ' + data + ')');  // for DEBUG
 
    this._reply.push( { id: id, type: type, data: data } );
    if (this._reply.length < 4) return;
 
    for (var reply of this._reply) {    // 修正要(チョンボ、ダブロンの考慮なし)
        if (reply.type == 'hule') {
            this.hule();
            return;
        }
        if (reply.type == 'fulou') {
            this.fulou(data);
            return;
        }
    }
 
    if (this._model.shan.paishu() == 0) {
        this.liuju();
        return;
    }

    this._view.he[this._lunban].redraw();

    this._lunban = (this._lunban + 1) % 4;
    this._view.chang.update(this._lunban);
 
    this.zimo();
}
Majiang.Game.prototype.reply_fulou = function(id, type, data) {
  console.log('[' + id +'] (' + type + ', ' + data + ')');  // for DEBUG
    if (type == 'dapai') this.dapai(data);
}
Majiang.Game.prototype.reply_gang = function(id, type, data) {
  console.log('[' + id +'] (' + type + ', ' + data + ')');  // for DEBUG
    if (type == 'hule') this.hule();
    if (id == this.player(this._lunban)) this.gangzimo();
}

/*
 *  Majiang.Player
 */
Majiang.Player = function(id) {
    this._id = id;
}
Majiang.Player.prototype.kaiju = function(data) {
  console.log('=> [' + this._id +'] (kaiju, ' + data.zifeng + ')');  // for DEBUG
    this._zifeng = data.zifeng;
    this._shoupai = new Majiang.Shoupai(data.haipai);
}
Majiang.Player.prototype.zimo = function(data, callback, timeout) {
  console.log('=> [' + this._id +'] (zimo, ' + data.zimo + ')');  // for DEBUG
    var id = this._id;
    this._paishu = data.paishu;
    if (data.lunban != this._zifeng) return;
    this._shoupai.zimo(data.zimo);
    setTimeout(function(){ callback(id, 'dapai', data.zimo) }, timeout);
}
Majiang.Player.prototype.dapai = function(data, callback, timeout) {
  console.log('=> [' + this._id +'] (dapai, ' + data.dapai + ')');  // for DEBUG
    var id = this._id;
    if (data.lunban == this._zifeng) {
        this._shoupai.dapai(data.dapai);
    }
    setTimeout(function(){ callback(id, '') }, timeout);
}
Majiang.Player.prototype.fulou = function(data, callback, timeout) {
  console.log('=> [' + this._id +'] (fulou, ' + data.fulou + ')');  // for DEBUG
    var id = this._id;
    setTimeout(function(){ callback(id, '') }, timeout);
}
Majiang.Player.prototype.gang = function(data, callback, timeout) {
  console.log('=> [' + this._id +'] (gang, ' + data.gang + ')');  // for DEBUG
    var id = this._id;
    setTimeout(function(){ callback(id, '') }, timeout);
}

/*
 *  Majiang.UI
 */

function get_chi_mianzi(shoupai, dapai) {
    var s = dapai[0];
    var n = dapai[1] - 1;
    var pai = shoupai._shouli[s];
    var chi_mianzi = [];
    if (s == 'z') return chi_mianzi;
    if (n > 1 && pai[n-2] > 0 && pai[n-1] > 0) {
        chi_mianzi.push(s + (n-1) + n + (n+1) + '-');
    }
    if (n < 7 && pai[n+1] > 0 && pai[n+2] > 0) {
        chi_mianzi.push(s + (n+1) + '-' + (n+2) + (n+3));
    }
    if (n > 0 && n < 8 && pai[n-1] > 0 && pai[n+1] > 0) {
        chi_mianzi.push(s + n + (n+1) + '-' + (n+2));
    }
    return chi_mianzi;
}
function set_chi_event(chi_mianzi, id, callback) {
 
    function handler(event) {
        var fulou = event.data;
        var s = fulou[0];
        var nn = fulou.match(/\d(?!\-)/g);
        var node = $('.shoupai.dong .shouli');
        var img;
        if ($(this).data('pai') == s+nn[0])
                img = node.find('.pai[data-pai="'+s+nn[1]+'"]').eq(0);
        else    img = node.find('.pai[data-pai="'+s+nn[0]+'"]').eq(-1);
        node.find('.pai').removeClass('selected').removeClass('dapai');
        $(this).addClass('selected');
        img.addClass('selected');
    }
 
    var pai = {};
    for (var fulou of chi_mianzi) {
        var s = fulou[0];
        for (var n of fulou.match(/\d(?!\-)/g)) {
            pai[s+n] = fulou;
        }
    }
    for (var p in pai) {
        $('.shoupai.dong .shouli .pai[data-pai="'+p+'"]')
            .addClass('dapai')
            .bind('mouseover', pai[p], handler)
            .bind('click', pai[p], function(event){
                callback(id, 'fulou', event.data);
            });
    }
}
function get_gang_mianzi(shoupai) {
    var gang_mianzi = [];
    for (var s in shoupai._shouli) {
        var pai = shoupai._shouli[s];
        for (var n = 1; n <= pai.length; n++) {
            if (pai[n-1] == 0) continue;
            if (pai[n-1] == 4) {
                gang_mianzi.push(s+n+n+n+n);
            }
            else {
                var regexp = new RegExp('^' + s + n + '{3}');
                for (var mianzi of shoupai._fulou) {
                    if (mianzi.match(regexp)) gang_mianzi.push(mianzi+n);
                }
            }
        }
    }
    return gang_mianzi;
}
function set_gang_event(gang_mianzi, id, callback) {
    var pai = {};
    for (var fulou of gang_mianzi) {
        pai[fulou.substr(0,2)] = fulou;
    }
    for (var p in pai) {
        $('.shoupai.dong .shouli .pai[data-pai="'+p+'"]')
            .addClass('dapai')
            .bind('click', pai[p], function(event){
                callback(id, 'gang', event.data);
            });
    }
}
function get_dapai_of_lizhi(shoupai) {
    var dapai = [];
    if (shoupai._lizhi) return dapai;
    if (shoupai._fulou.filter(
            function(mianzi){return mianzi.match(/[\-\+\=]/)}).length > 0)
        return dapai;
    if (Majiang.Util.xiangting(shoupai) > 0) return dapai;
    for (var s in shoupai._shouli) {
        var paishu = shoupai._shouli[s];
        for (var n = 1; n <= paishu.length; n++) {
            if (paishu[n-1] ==0) continue;
            paishu[n-1]--;
            if (Majiang.Util.xiangting(shoupai) == 0) {
                dapai.push(s+n);
            }
            paishu[n-1]++;
        }
    }
    return dapai;
}
function set_lizhi_event(dapai, id, callback) {
    for (var p of dapai) {
        $('.shoupai.dong .shouli .pai[data-pai="'+p+'"]')
            .addClass('dapai')
            .bind('click', p+'*', function(event){
                callback(id, 'dapai', event.data);
            });
    }
}

Majiang.UI = function(id) {
    this._id = id;
    $('.UI span').hide();
}
Majiang.UI.prototype.kaiju = function(data) {
  console.log('=> [' + this._id +'] (kaiju, ' + data.zifeng + ')');  // for DEBUG
    this._zifeng = data.zifeng;
    this._shoupai = new Majiang.Shoupai(data.haipai);
}
Majiang.UI.prototype.zimo = function(data, callback, timeout) {
  console.log('=> [' + this._id +'] (zimo, ' + data.zimo + ')');  // for DEBUG
    $('.UI.resize').width($('.shoupai.dong .shouli').width());
    var id = this._id;
    this._paishu = data.paishu;
    if (data.lunban != this._zifeng) return;
 
    this._shoupai.zimo(data.zimo);
  console.log('    '+this._shoupai.toString());  // for DEBUG
 
    var action = false;
    // リーチできるかチェックする。
    var dapai = get_dapai_of_lizhi(this._shoupai);
    if (dapai.length > 0 && this._paishu >= 4) {
        var self = this;
        $('.UI .lizhi').bind('click', function(){
            $('body').unbind('click');
            $('.UI span').unbind('click');
            $('.UI span').hide();
            $('.shoupai.dong .shouli .pai').unbind('click');
            Majiang.Audio.play('lizhi');
            set_lizhi_event(dapai, id, callback);
            return false;
        }).show();
        action = true;
    }
    if (Majiang.Util.xiangting(this._shoupai) == -1) {
        $('.UI .zimo').bind('click', function(){
            $('.UI span').hide();
            $('.shoupai.dong .shouli .pai').unbind('click');
            Majiang.Audio.play('zimo');
            callback(id, 'hule')
            return false;
        }).show();
        action = true;
    }
    // 暗カンもしくは加カンできるかチェックする。後で共通化する。
    var gang_mianzi = get_gang_mianzi(this._shoupai);
    if (gang_mianzi.length == 1) {
        $('.UI .gang').bind('click', function(){
            $('body').unbind('click');
            $('.UI span').unbind('click');
            $('.UI span').hide();
            $('.shoupai.dong .shouli .pai').unbind('click');
            Majiang.Audio.play('gang');
            callback(id, 'gang', gang_mianzi[0])
            return false;
        }).show();
        action = true;
    }
    if (gang_mianzi.length > 1) {
        $('.UI .gang').bind('click', function(){
            $('body').unbind('click');
            $('.UI span').unbind('click');
            $('.UI span').hide();
            $('.shoupai.dong .shouli .pai').unbind('click');
            Majiang.Audio.play('gang');
            set_gang_event(gang_mianzi, id, callback);
            return false;
        }).show();
        action = true;
    }

    var self = this;
    if (this._shoupai._lizhi) {
        if (action) {
            $('body').bind('click', function(){
                $('body').unbind('click');
                $('.UI span').unbind('click');
                $('.UI span').hide();
                callback(id, 'dapai', data.zimo);
                return false;
            });
        }
        else setTimeout(function(){ callback(id, 'dapai',  data.zimo) }, timeout);
    }
    else {
        $('.shoupai.dong .shouli .pai').each(function(){
            var dapai = $(this).data('pai');
            $(this).bind('click', dapai, function(event){
                $('.UI span').hide();
                $('.shoupai.dong .shouli .pai').unbind('click');
                callback(id, 'dapai', event.data);
                return false;
            });
        });
    }
}
Majiang.UI.prototype.dapai = function(data, callback, timeout) {
  console.log('=> [' + this._id +'] (dapai, ' + data.dapai + ')');  // for DEBUG
    $('.UI.resize').width($('.shoupai.dong .shouli').width());
    var id = this._id;
    if (data.lunban == this._zifeng) {
        this._shoupai.dapai(data.dapai);
        setTimeout(function(){ callback(id, '') }, timeout);
        return;
    }
    var action = false;
    // ロンできるかチェックする。修正要(役あり、フリテンなし)
    this._shoupai._shouli[data.dapai[0]][data.dapai[1]-1]++;
    var xiangting = Majiang.Util.xiangting(this._shoupai);
    this._shoupai._shouli[data.dapai[0]][data.dapai[1]-1]--;
    if (xiangting == -1) {
        $('.UI .rong').bind('click', function(){
            $('.shoupai.dong .shouli .pai').unbind('click');
            $('body').unbind('click');
            $('.UI span').unbind('click');
            $('.UI span').hide();
            Majiang.Audio.play('rong');
            callback(id, 'hule');
            return false;
        }).show();
        action = true;
    }
    // 大明カンできるかチェックする。後で共通化する。
    if (! this._shoupai._lizhi
        && this._shoupai._shouli[data.dapai[0]][data.dapai[1]-1] == 3
        && this._paishu > 0)
    {
        var f = [null, '+', '=', '-']
        var mianzi
            = data.dapai[0] + data.dapai[1] + data.dapai[1] + data.dapai[1]
            + data.dapai[1]+ f[(4 + data.lunban - this._zifeng) % 4];
        $('.UI .gang').bind('click', mianzi, function(event){
            $('.shoupai.dong .shouli .pai').unbind('click');
            $('body').unbind('click');
            $('.UI span').unbind('click');
            $('.UI span').hide();
            Majiang.Audio.play('gang');
            callback(id, 'fulou', event.data);
            return false;
        }).show();
        action = true;
    }
    // ポンできるかチェックする。後で共通化する。
    if (! this._shoupai._lizhi
        && this._shoupai._shouli[data.dapai[0]][data.dapai[1]-1] >= 2
        && this._paishu > 0)
    {
        var f = [null, '+', '=', '-']
        var mianzi
            = data.dapai[0] + data.dapai[1] + data.dapai[1] + data.dapai[1]
            + f[(4 + data.lunban - this._zifeng) % 4];
        $('.UI .peng').bind('click', mianzi, function(event){
            $('.shoupai.dong .shouli .pai').unbind('click');
            $('body').unbind('click');
            $('.UI span').unbind('click');
            $('.UI span').hide();
            Majiang.Audio.play('peng');
            callback(id, 'fulou', event.data);
            return false;
        }).show();
        action = true;
    }
    // チーできるかチェックする。後で共通化する。
    if (! this._shoupai._lizhi
        && (data.lunban + 1) % 4 == this._zifeng
        && this._paishu > 0)
    {
        var chi_mianzi = get_chi_mianzi(this._shoupai, data.dapai);
        if (chi_mianzi.length == 1) {
            $('.UI .chi').bind('click', function(){
                $('.shoupai.dong .shouli .pai').unbind('click');
                $('body').unbind('click');
                $('.UI span').unbind('click');
                $('.UI span').hide();
                Majiang.Audio.play('chi');
                callback(id, 'fulou', chi_mianzi[0]);
                return false;
            }).show();
            action = true;
        }
        if (chi_mianzi.length > 1) {
            $('.UI .chi').bind('click', function(){
                $('.shoupai.dong .shouli .pai').unbind('click');
                $('body').unbind('click');
                $('.UI span').unbind('click');
                $('.UI span').hide();
                Majiang.Audio.play('chi');
                set_chi_event(chi_mianzi, id, callback);
                return false;
            }).show();
            action = true;
        }
    }
    if (action) {
        $('body').bind('click', function(){
            $('body').unbind('click');
            $('.UI span').unbind('click');
            $('.UI span').hide();
            callback(id, '');
            return false;
        });
    }
    else setTimeout(function(){ callback(id, '') }, timeout);
}
Majiang.UI.prototype.fulou = function(data, callback, timeout) {
  console.log('=> [' + this._id +'] (fulou, ' + data.fulou + ')');  // for DEBUG
    $('.UI.resize').width($('.shoupai.dong .shouli').width());
    var id = this._id;
    if (data.lunban != this._zifeng) {
        setTimeout(function(){ callback(id, '') }, timeout);
        return;
    }
    this._shoupai.fulou(data.fulou);
    var self = this;
    $('.shoupai.dong .shouli .pai').each(function(){
        var dapai = $(this).data('pai');
        $(this).bind('click', dapai, function(event){
            $('.UI span').hide();
            $('.shoupai.dong .shouli .pai').unbind('click');
            self._shoupai.dapai(dapai);
            callback(id, 'dapai', event.data);
            return false;
        });
    });
}
Majiang.UI.prototype.gang = function(data, callback, timeout) {
  console.log('=> [' + this._id +'] (gang, ' + data.gang + ')');  // for DEBUG
    $('.UI.resize').width($('.shoupai.dong .shouli').width());
    var id = this._id;
    if (data.lunban == this._zifeng) {
        if (this._shoupai._zimo) this._shoupai.gang(data.gang);
        else                     this._shoupai.fulou(data.gang);
        setTimeout(function(){ callback(id, '') }, timeout);
        return;
    }
    // 槍槓できるかチェックする。
    var action = false;
    var self = this;
    this._shoupai._shouli[data.gang[0]][data.gang[1]-1]++;
    var xiangting = Majiang.Util.xiangting(this._shoupai);
    this._shoupai._shouli[data.gang[0]][data.gang[1]-1]--;
    if (xiangting == -1) {
        $('.UI .rong').bind('click', function(){
            $('.shoupai.dong .shouli .pai').unbind('click');
            $('body').unbind('click');
            $('.UI span').unbind('click');
            $('.UI span').hide();
            Majiang.Audio.play('rong');
            callback(id, 'hule');
            return false;
        }).show();
        action = true;
    }
    if (action) {
        $('body').bind('click', function(){
            $('body').unbind('click');
            $('.UI span').unbind('click');
            $('.UI span').hide();
            callback(id, '');
            return false;
        });
    }
    else setTimeout(function(){ callback(id, '') }, timeout);
}

})();
