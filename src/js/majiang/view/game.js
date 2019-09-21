/*
 *  Majiang.View.Game
 */
"use strict";

const $ = require('jquery');

const audio      = require('./audio');
const Shan       = require('./shan');
const Shoupai    = require('./shoupai');
const He         = require('./he');
const HuleDialog = require('./huledialog');

const view_class = ['main','xiajia','duimian','shangjia'];
const feng_hanzi = ['東','南','西','北'];
const shu_hanzi  = ['一','二','三','四'];

const say_text   = {    chi:    'チー',
                        peng:   'ポン',
                        gang:   'カン',
                        lizhi:  'リーチ',
                        rong:   'ロン',
                        zimo:   'ツモ'    };

class Chang {

    constructor(root, model) {
        this._model = model;
        this._view = {
            root:      root,
            jushu:     $('.jushu', root),
            changbang: $('.changbang', root),
            lizhibang: $('.lizhibang', root),
            defen:     []
        };
        this._viewpoint = 0;
    }

    redraw(viewpoint) {

        if (viewpoint != null) this._viewpoint = viewpoint;

        let jushu = feng_hanzi[this._model.zhuangfeng]
                  + shu_hanzi[this._model.jushu] + '局';
        this._view.jushu.text(jushu);
        this._view.changbang.text(this._model.changbang);
        this._view.lizhibang.text(this._model.lizhibang);

        for (let l = 0; l < 4; l++) {
            let id = this._model.player_id[l];
            let defen = '' + this._model.defen[id];
            defen = defen.replace(/(\d)(\d{3})$/,'$1,$2');
            defen = `${feng_hanzi[l]}: ${defen}`;
            let c = view_class[(id + 4 - this._viewpoint) % 4];
            this._view.defen[l] = $(`.defen .${c}`, this._root);
            this._view.defen[l].removeClass('lunban').text(defen);
            if (l == this._model.lunban) this._view.defen[l].addClass('lunban');
        }
        return this;
    }

    update() {
        let lunban = this._model.lunban < 0 ? 0 : this._model.lunban
        for (let l = 0; l < 4; l++) {
            if (l == lunban) this._view.defen[l].addClass('lunban');
            else             this._view.defen[l].removeClass('lunban');
        }
    }
}

module.exports = class Game {

constructor(root, model) {
    this._root  = root;
    this._model = model;
    this._view  = {
        chang:   new Chang($('.chang', root), model),
        shan:    null,
        shoupai: [],
        he:      [],
        say:     [],
        kaiju:   $('> .kaiju', root),
        dialog:  null,
        summary: $('> .summary', root)
    };
    this._lunban = -1;
    this._say = [];

    this.viewpoint    = 0;
    this.sound_on     = true;
    this.open_shoupai = true;
    this.open_he      = true;

    this._timer_id;

    this._audio = get_audio();
}

redraw() {

    this._timer_id = clearTimeout(this._timer_id);

    $('> *', this._root).removeClass('hide');
    $('.UI', this._root).addClass('hide');
    $('.UI span', this._root).addClass('hide');
    this._view.kaiju.hide();
    this.summary();

    this._view.chang.redraw(this.viewpoint);

    for (let id = 0; id < 4; id++) {
        let name = this._model.player[id].replace(/\n.*$/,'');
        let c = view_class[(id + 4 - this.viewpoint) % 4];
        $(`> .player.${c}`, this._root).text(name);
    }

    this._view.shan = new Shan($('.shan', this._root),
                                this._model.shan).redraw();

    for (let l = 0; l < 4; l++) {
        let id = this._model.player_id[l];
        let c = view_class[(id + 4 - this.viewpoint) % 4];
        let open = this._model.player_id[l] == this.viewpoint
                    || this.open_shoupai;
        this._view.shoupai[l] = new Shoupai($(`.shoupai.${c}`, this._root),
                                        this._model.shoupai[l]).redraw(open);
        this._view.he[l]      = new He($(`.he.${c}`, this._root),
                                        this._model.he[l]).redraw(this.open_he);
        this._view.say[l]     = $(`.say.${c}`, this._root)
                                    .addClass('hide')
                                    .removeClass('fadeout')
                                    .text('');
        this._say[l]          = null;
    }

    this._view.dialog = new HuleDialog(
                                $('.huledialog', this._root), this._model, this.viewpoint
                            ).hide();

    this._lunban = this._model.lunban;
    this._view.chang.update();

    return this;
}

update(data = {}) {

    if (this._lunban >= 0 && this._lunban != this._model.lunban) {
        if (this._say[this._lunban]) {
            this._view.say[this._lunban].addClass('fadeout');
            this._say[this._lunban] = null;
        }
        else {
            this._view.say[this._lunban].addClass('hide')
                                        .removeClass('fadeout')
                                        .text('');
        }
        this._view.he[this._lunban].redraw();
        this._view.shoupai[this._lunban].redraw();
    }

    if (   (this._say[this._lunban] == 'lizhi')
        || (this._say[this._lunban] == 'chi'   && ! data.fulou)
        || (this._say[this._lunban] == 'peng'  && ! data.fulou)
        || (this._say[this._lunban] == 'gang'
                            && !(data.fulou || data.gang || data.kaigang)))
    {
        this._view.say[this._lunban].addClass('fadeout');
        this._say[this._lunban] = null;
    }

    if (data.zimo) {
        this._view.say[data.zimo.l].addClass('hide')
                                   .removeClass('fadeout')
                                   .text('');
        this._view.shan.redraw();
        this._view.shoupai[data.zimo.l].redraw();
    }
    else if (data.dapai) {
        this._view.shoupai[data.dapai.l].dapai(data.dapai.p);
        if (this.sound_on) this._audio.dapai[data.dapai.l].play();
        this._view.he[data.dapai.l].dapai(data.dapai.p);
    }
    else if (data.fulou) {
        this._view.shoupai[data.fulou.l].redraw();
    }
    else if (data.gang) {
        this._view.shoupai[data.gang.l].redraw();
    }
    else if (data.gangzimo) {
        this._view.shan.redraw();
        this._view.shoupai[data.gangzimo.l].redraw();
    }
    else if (data.kaigang) {
        this._view.shan.redraw();
    }
    else if (data.hule) {
        this._view.chang.redraw();
        this.hule(data.hule);
    }
    else if (data.pingju) {
        this._view.chang.redraw();
        this.pingju(data.pingju);
    }
    else {
        this._view.chang.redraw();
    }

    this._lunban = this._model.lunban
    if (this._lunban >= 0) this._view.chang.update();

    return this;
}

say(name, l) {
    if (this.sound_on) {
        this._audio[name][l].currentTime = 0;
        this._audio[name][l].play();
    }
    this._view.say[l].text(say_text[name])
                        .removeClass('fadeout').removeClass('hide');
    this._say[l] = name;
}

hule(hule) {

    let info = {
        shoupai:  Majiang.Shoupai.fromString(hule.shoupai),
        hule:     {
            hupai:     hule.hupai,
            fu:        hule.fu,
            fanshu:    hule.fanshu,
            damanguan: hule.damanguan,
            defen:     hule.defen,
            fenpei:    hule.fenpei
        },
        menfeng:  hule.l,
        baopai:   this._model.shan.baopai(),
        fubaopai: hule.fubaopai
    };

    this._view.dialog.hide();
    for (let l = 0; l < 4; l++) { this._view.say[l].addClass('fadeout') }

    this._timer_id = setTimeout(()=>{
        this._view.shoupai[hule.l].redraw(true);
        this._view.dialog.hule(info);
        if (this.sound_on && hule.damanguan) this._audio.gong.play();
    }, 400);
}

pingju(pingju) {

    for (let l = 0; l < 4; l++) { this._view.say[l].addClass('fadeout') }
    let duration = 0;
    if (pingju.name.match(/^三家和/)) {
        duration = 400;
    }
    else {
        this._view.he[this._lunban].redraw();
        this._view.shoupai[this._lunban].redraw();
    }

    this._timer_id = setTimeout(()=>{
        for (let l = 0; l < 4; l++) {
            let open = this._model.player_id[l] == this.viewpoint
                        || pingju.shoupai[l];
            this._view.shoupai[l].redraw(open);
        }
        this._view.dialog.pingju({pingju:pingju});
    }, duration);
}

kaiju() {

    $('> *', this._root).addClass('hide');

    let title = $('<span>').text(this._model.title).html()
                                                .replace(/\n/g, '<br>');
    $('.title', this._view.kaiju).html(title);
    for (let id = 0; id < 4; id++) {
        let name = this._model.player[id].replace(/\n.*$/,'');
        $(`.player .${view_class[id]}`, this._view.kaiju).text(name);
    }

    this._view.kaiju.removeClass('hide').hide().fadeIn();
}

summary(paipu) {

    if (! paipu) {
        this._view.summary.addClass('hide').addClass('fadeout');
        return;
    }

    this._timer_id = clearTimeout(this._timer_id);

    if (this._view.dialog) this._view.dialog.hide();
    else                   this._view.kaiju.hide();

    const player = $('thead .player', this._view.summary);
    for (let i = 0; i < 4; i++) {
        let id = (this.viewpoint + i) % 4;
        player.eq(i).text(paipu.player[id].replace(/\n.*$/,''));
    }

    const tbody = $('tbody', this._view.summary).empty();
    for (let log of paipu.log) {

        if (log.length == 0) continue;

        let qipai = log[0].qipai;

        let last = [], lizhi = [0,0,0,0], lunban = null;
        for (let data of log) {
            if (lunban != null) {
                if (! data.hule
                    && ! (data.pingju && data.pingju.name.match(/^三家和/)))
                        lizhi[lunban] = 1;
                else    lunban = null;
            }
            if (data.dapai && data.dapai.p.substr(-1) == '*')
                    lunban = data.dapai.l;
            if (data.hule || data.pingju) last.push(data);
        }

        let tr = _tr.clone();
        $('.jushu', tr).text(
            `${feng_hanzi[qipai.zhuangfeng]}${shu_hanzi[qipai.jushu]}局`);
        $('.changbang', tr).text(`${qipai.changbang}本場`);
        $('.last', tr).text(
              last.length == 0            ? '−'
            : last[0].pingju              ? '流局'
            : last[0].hule.baojia == null ? 'ツモ'
            :                               'ロン'
        );

        const diff = $('.diff', tr);
        for (let i = 0; i < 4; i++) {

            let l = (8 + this.viewpoint - paipu.qijia - qipai.jushu + i) % 4;

            if (l == 0) diff.eq(i).addClass('zhuangjia');

            if (last.length == 0) continue;

            let fenpei = - lizhi[l] * 1000
            for (let data of last) {
                if (data.hule)   fenpei += data.hule.fenpei[l]
                if (data.pingju) fenpei += data.pingju.fenpei[l]
                if (! data.hule) continue;
                if (data.hule.baojia == l) diff.eq(i).addClass('baojia');
                if (data.hule.l      == l) diff.eq(i).addClass('hule');
            }
            fenpei = fenpei > 0 ? '+' + fenpei
                   : fenpei < 0 ? ''  + fenpei
                   :              '';
            fenpei = fenpei.replace(/(\d)(\d{3})$/,'$1,$2');

            diff.eq(i).text(fenpei);
        }

        tbody.append(tr);
    }

    const defen = $('tfoot .defen', this._view.summary);
    for (let i = 0; i < 4; i++) {
        let id = (this.viewpoint + i) % 4;
        defen.eq(i).text((''+paipu.defen[id]).replace(/(\d)(\d{3})$/,'$1,$2'));
        if (paipu.rank[id] == 1) defen.eq(i).addClass('guanjun');
        else                     defen.eq(i).removeClass('guanjun');
        if (paipu.defen[id] < 0) defen.eq(i).addClass('minus');
        else                     defen.eq(i).removeClass('minus');
    }

    const point = $('tfoot .point td', this._view.summary);
    for (let i = 0; i < 4; i++) {
        let id = (this.viewpoint + i) % 4;
        point.eq(i).text((paipu.point[id] > 0 ?'+' : '') + paipu.point[id]);
        if (paipu.point[id] > 0) point.eq(i).addClass('plus');
        else                     point.eq(i).removeClass('plus');
        if (paipu.point[id] < 0) point.eq(i).addClass('minus');
        else                     point.eq(i).removeClass('minus');
    }

    this._view.summary.removeClass('hide').scrollTop(0);
    setTimeout(() => this._view.summary.removeClass('fadeout'), 10);
}

}

let _audio;
function get_audio() {

    if (_audio) return _audio;

    _audio = {};
    for (let name of ['dapai','chi','peng','gang','rong','zimo','lizhi']) {
        _audio[name] = [];
        for (let l = 0; l < 4; l++) {
            _audio[name][l] = audio(name);
        }
    }
    _audio.gong = audio('gong');
    return _audio;
}

let _tr;
$(function(){
    _tr = $('.summary tbody tr');
});
