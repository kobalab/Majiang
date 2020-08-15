/*
 *  Majiang.View.HuleDialog
 */
"use strict";

const $ = require('jquery');
const Majiang = {
    View: {
        pai:     require('./pai'),
        Shoupai: require('./shoupai'),
        Shan:    require('./shan')
    }
};
const { hide, fadeIn } = require('./fadein');

let _hupai;
let _defen;

class Shan {
    constructor(baopai, fubaopai) {
        this._baopai   = baopai   || [];
        this._fubaopai = fubaopai || [];
    }
    baopai()   { return this._baopai   }
    fubaopai() { return this._fubaopai }
    paishu()   { return 0 }
}

module.exports = class HuleDialog {

constructor(root, chang, viewpoint = 0) {

    this._node = {
        root:   root,
        hule:   $('.hule', root),
        pingju: $('.pingju', root),
        fenpei: $('.fenpei', root),
    };
    this._chang = chang;
    this._viewpoint = viewpoint;

    this.hide();
}

hule(info) {

    if (info.baopai)   $('.shan.baopai',   this._node.hule).removeClass('hide');
    else               $('.shan.baopai',   this._node.hule).addClass('hide');
    if (info.fubaopai) $('.shan.fubaopai', this._node.hule).removeClass('hide');
    else               $('.shan.fubaopai', this._node.hule).addClass('hide');

    new Majiang.View.Shan(
        $('.shan', this._node.hule),
        new Shan(info.baopai, info.fubaopai)
    ).redraw();

    new Majiang.View.Shoupai(
        $('.shoupai', this._node.hule), info.shoupai, true).redraw();

    let hupai = $('.hupai', this._node.hule);
    hupai.empty();
    if (! info.hule || ! info.hule.hupai) {
        let r_defen = _defen.clone();
        $('.defen', r_defen).text('役なし');
        hupai.append(r_defen);
        $('.jicun', this._node.hule).addClass('hide');
        this._node.fenpei.addClass('hide');
    }
    else {
        for (let h of info.hule.hupai) {
            let r_hupai = _hupai.clone();
            $('.name', r_hupai).text(h.name);
            $('.fanshu', r_hupai).text(
                                h.fanshu + (h.fanshu[0] == '*' ? '' : '翻'));
            hupai.append(r_hupai);
        }
        let text = (info.hule.damanguan) ? ''
                 : info.hule.fu + '符 ' + info.hule.fanshu + '翻 ';
        let manguan = info.hule.defen / (info.menfeng == 0 ? 6 : 4) / 2000;
        text += (manguan >= 4 * 6) ? '六倍役満 '
              : (manguan >= 4 * 5) ? '五倍役満 '
              : (manguan >= 4 * 4) ? '四倍役満 '
              : (manguan >= 4 * 3) ? 'トリプル役満 '
              : (manguan >= 4 * 2) ? 'ダブル役満 '
              : (manguan >= 4)     ? '役満 '
              : (manguan >= 3)     ? '三倍満 '
              : (manguan >= 2)     ? '倍満 '
              : (manguan >= 1.5)   ? '跳満 '
              : (manguan >= 1)     ? '満貫 '
              :                    '';
        text += info.hule.defen + '点';
        let r_defen = _defen.clone();
        $('.defen', r_defen).text(text);
        hupai.append(r_defen);

        $('.jicun', this._node.hule).removeClass('hide');
        $('.jicun .changbang', this._node.hule).text(this._chang.changbang);
        $('.jicun .lizhibang', this._node.hule).text(this._chang.lizhibang);

        this.fenpei(info.hule.fenpei);
    }

    this._node.hule.removeClass('hide');
    this._node.pingju.addClass('hide');

    this.show();

    return this;
}

pingju(info) {

    this._node.pingju.text(info.pingju.name);

    this.fenpei(info.pingju.fenpei);

    this._node.pingju.removeClass('hide');
    this._node.hule.addClass('hide');

    this.show();

    return this;
}

fenpei(fenpei) {

    const feng_hanzi = ['東','南','西','北'];
    const view_class = ['main','xiajia','duimian','shangjia'];

    this._node.fenpei.removeClass('hide');

    $('.diff', this._node.fenpei).removeClass('plus')
                                 .removeClass('muinus');

    for (let l = 0; l < 4; l++) {

        let id = (this._chang.qijia + this._chang.jushu + l) % 4;
        let c  = view_class[(id + 4 - this._viewpoint) % 4];
        let node = $(`.${c}`, this._node.fenpei);

        $('.feng', node).text(feng_hanzi[l]);

        $('.player', node).text(this._chang.player[id].replace(/\n.*$/,''));

        let defen = (''+this._chang.defen[id]).replace(/(\d)(\d{3})$/,'$1,$2');
        $('.defen', node).text(defen);

        let diff = fenpei[l];
        if      (diff > 0) $('.diff', node).addClass('plus');
        else if (diff < 0) $('.diff', node).addClass('muinus');
        diff = (diff > 0) ? '+' + diff
             : (diff < 0) ? ''  + diff
             :              '';
        diff = diff.replace(/(\d)(\d{3})$/, '$1,$2');
        $('.diff', node).text(diff);
    }
}

show() {
    fadeIn(this._node.root);
    return this;
}

hide() {
    this._node.root.scrollTop(0);
    hide(this._node.root);
    return this;
}

}

$(function(){
    _hupai = $('.huledialog .hule .hupai .r_hupai');
    _defen = $('.huledialog .hule .hupai .r_defen');
});
