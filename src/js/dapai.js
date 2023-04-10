/*!
 *  電脳麻将: 何切る解答機 v2.1.1
 *
 *  Copyright(C) 2017 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/Majiang/blob/master/LICENSE
 */
"use strict";

const { hide, show, fadeIn, fadeOut } = Majiang.UI.Util;

let pai;

function init(fragment) {

    if (fragment) {

        let [ paistr, zhuangfeng, menfeng, baopai, hongpai ]
                = fragment.split(/\//);
        baopai  = (baopai   || '').split(/,/);
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
}

function init_analyzer(paistr, zhuangfeng, menfeng, baopai, hongpai) {

    let kaiju = {
        id:     0,
        rule:   Majiang.rule({'赤牌':hongpai}),
        player: [],
        qijia:  0
    };
    const analyzer = new Majiang.UI.Analyzer($('.analyzer'),
                                                { kaiju: kaiju }, pai);
    let qipai = {
        zhuangfeng: zhuangfeng,
        jushu:      (4 - menfeng) % 4,
        changbang:  0,
        lizhibang:  0,
        defen:      [ 25000, 25000, 25000, 25000 ],
        baopai:     baopai.length && Majiang.Shoupai.valid_pai(baopai[0])
                                  || 'z2',
        shoupai:    ['','','','']
    };
    qipai.shoupai[menfeng] = paistr;
    analyzer.next({ qipai: qipai });

    for (let i = 1; i < baopai.length; i++) {
        analyzer.next({ kaigang: { baopai: baopai[i] }});
    }

    return analyzer;
}

function submit() {

    hide($('.shan, .shoupai, .analyzer'));

    let paistr = $('input[name="paistr"]').val();
    if (! paistr) return false;

    let shoupai = Majiang.Shoupai.fromString(paistr);
    paistr = shoupai.toString();

    let zhuangfeng = + $('select[name="zhuangfeng"]').val();
    let menfeng    = + $('select[name="menfeng"]').val();
    let baopai     = $.makeArray($('input[name="baopai"]'))
                                    .map(n => $(n).val()).filter(p => p);
    let hongpai    = $('input[name="hongpai"]').prop('checked');

    const analyzer = init_analyzer(paistr, zhuangfeng, menfeng, baopai, hongpai
                        ? { m: 1, p: 1, s: 1 }
                        : { m: 0, p: 0, s: 0 });

    if (shoupai._zimo) {
        if (shoupai._zimo.length == 2)
                analyzer.action_zimo({ l: menfeng, p: shoupai._zimo });
        else    analyzer.action_fulou({ l: menfeng, m: shoupai._zimo });
    }
    new Majiang.UI.Shan($('.shan'), pai, analyzer.shan).redraw();
    new Majiang.UI.Shoupai($('.shoupai'), pai, analyzer.shoupai).redraw(true);

    fadeIn($('.shan, .shoupai, .analyzer'));

    paistr = analyzer.shoupai.toString();
    baopai = analyzer.shan.baopai;
    $('input[name="paistr"]').val(paistr);
    for (let i = 0; i < 5; i++) {
        $('input[name="baopai"]').eq(i).val(baopai[i] || '');
    }

    let fragment = '#'
                 + [ paistr, zhuangfeng, menfeng, baopai.join(',')].join('/');
    if (! hongpai) fragment += '/1';
    history.replaceState('', '', fragment)

    return false;
}

$(function(){

    pai = Majiang.UI.pai('#loaddata');

    $('form').on('submit', submit);

    $('form').on('reset', function(){
        hide($('.shan, .shoupai, .analyzer'));
        $('form input[name="paistr"]').focus();
    });

    $(window).on('keyup', (ev)=>{
        if (ev.key == 'W') {
            if ($('body').width() == 780) $('body').width('');
            else                          $('body').width(780);
        }
    });

    let fragment = location.hash.replace(/^#/,'');
    init(fragment);
});
