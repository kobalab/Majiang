/*!
 *  電脳麻将: 何切る解答機 v2.4.17
 *
 *  Copyright(C) 2017 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/Majiang/blob/master/LICENSE
 */
"use strict";

const { hide, show, fadeIn, fadeOut, scale } = Majiang.UI.Util;
const minipaipu = Majiang.AI.minipaipu;

let pai, audio;

function init(fragment) {

    if (fragment) {

        let [ baseinfo, heinfo ] = fragment.split(/&/);

        let xun, param = baseinfo.split(/\//);
        if (param.length && param[param.length-1][0] == '+') xun = param.pop();
        let [ paistr, zhuangfeng, menfeng, baopai, hongpai ] = param;
        baopai  = (baopai   || '').split(/,/);
        hongpai = ! hongpai;

        $('input[name="paistr"]').val(paistr);
        $('select[name="zhuangfeng"]').val(+zhuangfeng||0);
        $('select[name="menfeng"]').val(+menfeng||0);
        $('select[name="xun"]').val(+xun||7);
        for (let i = 0; i < baopai.length; i++) {
            $('input[name="baopai"]').eq(i).val(baopai[i]);
        }
        $('input[name="hongpai"]').prop('checked', hongpai);

        if (heinfo != null) {
            $('form input[name="heinfo"]').prop('checked', true)
                                          .trigger('change');
            let hestr = heinfo.split(/\//);
            for (let l = 0; l < 4; l++) {
                $('input[name="hestr"]').eq(l).val(hestr[l]);
            }
        }

        submit();
    }
    else {
        $('input[name="paistr"]').val('m123p1234789s338s8').focus();
        $('input[name="baopai"]').eq(0).val('s3');
    }
}

function submit(ev) {

    hide($('.shan, .shoupai, .analyzer', $('#demo')));

    let paistr = $('input[name="paistr"]').val();
    if (! paistr) return false;

    let zhuangfeng = + $('select[name="zhuangfeng"]').val();
    let menfeng    = + $('select[name="menfeng"]').val();
    let xun        = + $('select[name="xun"]').val();
    let baopai     = $('input[name="baopai"]').map((i,n)=>$(n).val()).toArray()
                                    .filter(p => Majiang.Shoupai.valid_pai(p));
    let hongpai    = $('input[name="hongpai"]').prop('checked');

    if (! baopai.length) baopai = ['z2'];

    let heinfo = $('input[name="hestr"]').map((i,n)=>$(n).val()).toArray();

    if (! hongpai) {
        paistr = paistr.replace(/0/,'5');
        baopai = baopai.map(p => p.replace(/0/,'5'));
        heinfo = heinfo.map(hestr => hestr.replace(/0/,'5'));
    }

    let baseinfo = { paistr: paistr, zhuangfeng: zhuangfeng, menfeng: menfeng,
                     baopai: baopai, hongpai: hongpai, xun: xun };

    let analyzer;
    let kaiju = { id: 0, rule: Majiang.rule(), qijia: 0 };

    if ($('form input[name="heinfo"]').prop('checked')) {

        analyzer = new Majiang.UI.Analyzer($('#board >.analyzer'), kaiju, pai);

        heinfo = minipaipu(analyzer, baseinfo, heinfo, true);

        let view = new Majiang.UI.Board($('#board .board'),
                                        pai, audio, analyzer.model);
        view.no_player_name = true;
        view.open_he        = true;
        view.redraw();

        let zimo = analyzer.shoupai._zimo
        if (zimo) {
            if (zimo.length == 2)
                    analyzer.action_zimo({ l: menfeng, p: zimo });
            else    analyzer.action_fulou({ l: menfeng, m: zimo });
        }
        else {
            let l = analyzer.model.lunban;
            if (l != -1) {
                let p = analyzer.model.he[l]._pai.slice(-1)[0];
                analyzer.action_dapai({ l: l, p: p });
            }
            else {
                analyzer.action_qipai();
            }
        }
        $('body').attr('class','board analyzer');
        scale($('#board'), $('#space'));
    }
    else {
        analyzer = new Majiang.UI.Analyzer($('#demo >.analyzer'), kaiju, pai);

        minipaipu(analyzer, baseinfo);

        new Majiang.UI.Shan($('#demo .shan'), pai, analyzer.shan).redraw();
        new Majiang.UI.Shoupai($('#demo .shoupai'), pai, analyzer.shoupai)
                                                                .redraw(true);

        let zimo = analyzer.shoupai._zimo
        if (zimo) {
            if (zimo.length == 2)
                    analyzer.action_zimo({ l: menfeng, p: zimo });
            else    analyzer.action_fulou({ l: menfeng, m: zimo });
        }
        fadeIn($('.shan, .shoupai, .analyzer', $('#demo')));

        heinfo = null;
    }

    paistr = analyzer.shoupai.toString();
    $('input[name="paistr"]').val(paistr);

    baopai = analyzer.shan.baopai;
    for (let i = 0; i < 5; i++) {
        $('input[name="baopai"]').eq(i).val(baopai[i] || '');
    }

    if (heinfo) {
        for (let i = 0; i < 4; i++)  {
            $('input[name="hestr"]').eq(i).val(heinfo[i]);
        }
    }

    let fragment = '#'
                 + [ paistr, zhuangfeng, menfeng, baopai.join(',')].join('/');
    if (! hongpai) fragment += '/1';

    if (heinfo) fragment += '&' + heinfo.join('/');
    else        fragment += '/+' + xun;

    history.replaceState('', '', fragment)

    return false;
}

function set_controller(root) {
    root.addClass('paipu');
    $(window).on('keyup', (ev)=>{
        if (ev.key == 'q' || ev.key == 'Escape') {
            if ($('body').attr('class') != 'demo')
                                    $('body').attr('class','demo');
        }
    });
    hide($('> img', root));
    show($('> img.exit', root).on('click', ()=>$('body').attr('class','demo')));
}

$(function(){

    pai = Majiang.UI.pai('#loaddata');
    audio = Majiang.UI.audio('#loaddata');

    $('form input[name="heinfo"]').on('change', function(){
        if ($(this).prop('checked')) {
            show($('form .heinfo'));
            hide($('form .xun'));
        }
        else {
            hide($('form .heinfo'));
            show($('form .xun'));
        }
    });
    hide($('form .heinfo'));

    $('form').on('submit', submit);

    $('form').on('reset', function(){
        hide($('.shan, .shoupai, .analyzer', $('#demo')));
        hide($('form .heinfo'));
        $('form input[name="paistr"]').focus();
    });

    $(window).on('resize', ()=>scale($('#board'), $('#space')));

    set_controller($('#board .controller'));

    let fragment = location.hash.replace(/^#/,'');
    init(fragment);
});
