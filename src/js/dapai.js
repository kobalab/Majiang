/*!
 *
 *`dapai.js
 *
 *  Copyright(C) 2019 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/Majiang/blob/master/LICENSE
 */

"use strict";

const { hide, fadeIn } = require('./majiang/view/fadein');

let _row;

class Shan {
    constructor(baopai, fubaopai) {
        this._baopai   = baopai   || [];
        this._fubaopai = fubaopai || [];
    }
    baopai()   { return this._baopai   }
    fubaopai() { return this._fubaopai }
    paishu()   { return 0 }
}

function init_analyzer(paistr, zhuangfeng, menfeng, baopai, hongpai) {

    const analyzer = new Majiang.View.Analyzer(0, $('#dapai'));

    let kaiju = {
        player:  [],
        qijia:   0,
        hongpai: hongpai
    };
    analyzer.kaiju(kaiju);

    let qipai = {
        zhuangfeng: zhuangfeng,
        jushu:      (4 - menfeng) % 4,
        changbang:  0,
        lizhibang:  0,
        defen:      [ 25000, 25000, 25000, 25000 ],
        baopai:     baopai.length && Majiang.Shoupai.valid_pai(baopai[0])
                                                            ||'z2',
        shoupai:    [ '', '', '', '' ]
    };
    qipai.shoupai[menfeng] = paistr;
    analyzer.qipai(qipai);

    for (let i = 1; i < baopai.length; i++) {
        analyzer.kaigang({ baopai: baopai[i] });
    }

    return analyzer;
}

function submit() {

    let paistr     = $('input[name="paistr"]').val();
    if (! paistr) return false;

    let zhuangfeng = + $('select[name="zhuangfeng"]').val();
    let menfeng    = + $('select[name="menfeng"]').val();
    let baopai     = $.makeArray($('input[name="baopai"]'))
                                    .map(p=>$(p).val()).filter(p=>p);
    let hongpai    = $('input[name="hongpai"]').prop('checked');

    const analyzer = init_analyzer(paistr, zhuangfeng, menfeng, baopai, hongpai
                        ? { m: 1, p: 1, s: 1 }
                        : { m: 0, p: 0, s: 0 });

    new Majiang.View.Shan('.shan', new Shan(analyzer._baopai)).redraw();
    new Majiang.View.Shoupai('.shoupai', analyzer._shoupai).redraw(true);

    analyzer.action_zimo();

    fadeIn($('#dapai'));

    paistr = analyzer._shoupai.toString();
    $('input[name="paistr"]').val(paistr);
    baopai = analyzer._baopai;
    for (let i = 0; i < baopai.length; i++) {
        $('input[name="baopai"]').eq(i).val(baopai[i]);
    }

    let fragment = '#'
                 + [ paistr, zhuangfeng, menfeng, baopai.join(',')].join('/');
    if (! hongpai) fragment += '/1';
    history.replaceState('', '', fragment)

    return false;
}

$(function(){

    $('.version').text('ver. ' + Majiang.VERSION);

    $('form').on('submit', submit);

    $('form').on('reset', ()=>{
        $('input[name="paistr"]').focus();
        hide($('#dapai'));
    });

    _row = $('.report .row');
    $('.report').empty();

    let fragment = location.hash.replace(/^#/,'');
    if (fragment) {
        let [paistr, zhuangfeng, menfeng, baopai, hongpai]
                                            = fragment.match(/([^\/]+)/g);
        baopai  = (baopai || '').split(/,/);
        hongpai = ! hongpai;

        $('input[name="paistr"]').val(paistr);
        $('select[name="zhuangfeng"]').val(zhuangfeng);
        $('select[name="menfeng"]').val(menfeng);
        for (let i = 0; i < baopai.length; i++) {
            $('input[name="baopai"]').eq(i).val(baopai[i]);
        }
        $('input[name="hongpai"]').prop('checked', hongpai);

        submit();
    }
    else {
        $('input[name="paistr"]').val('m123p1234789s338s8').focus();
        $('input[name="baopai"]').eq(0).val('s3');
    }
});
