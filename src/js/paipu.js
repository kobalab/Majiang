/*!
 *  電脳麻将: 牌譜ビューア v2.4.1
 *
 *  Copyright(C) 2017 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/Majiang/blob/master/LICENSE
 */
"use strict";

const { hide, show, fadeIn, scale   } = Majiang.UI.Util;

$(function(){

    const tenhou_log = 'https://kobalab.net/majiang/tenhou-log/';

    const pai   = Majiang.UI.pai($('#loaddata'));
    const audio = Majiang.UI.audio($('#loaddata'));

    const rule  = Majiang.rule(
                    JSON.parse(localStorage.getItem('Majiang.rule')||'{}'));

    let file;

    const analyzer = (kaiju)=>{
        $('body').addClass('analyzer');
        return new Majiang.UI.Analyzer($('#board > .analyzer'), kaiju, pai,
                                        ()=>$('body').removeClass('analyzer'));
    };
    const viewer = (paipu)=>{
        $('#board .controller').addClass('paipu')
        $('body').attr('class','board');
        scale($('#board'), $('#space'));
        return new Majiang.UI.Paipu(
                        $('#board'), paipu, pai, audio, 'Majiang.pref',
                        ()=>fadeIn($('body').attr('class','file')),
                        analyzer);
    };
    const stat = (paipu_list)=>{
        fadeIn($('body').attr('class','stat'));
        return new Majiang.UI.PaipuStat($('#stat'), paipu_list,
                        ()=>fadeIn($('body').attr('class','file')));
    };
    const preview = (paipu)=>{
        $('#board .controller').addClass('paipu')
        $('body').attr('class','board');
        scale($('#board'), $('#space'));
        return new Majiang.UI.Paipu(
                        $('#board'), paipu, pai, audio, 'Majiang.pref',
                        ()=>fadeIn($('body').attr('class','editor')),
                        analyzer);
    };
    const editor = (paipu, save)=>{
        new Majiang.UI.PaipuEditor($('#editor'), paipu, rule, pai,
                        ()=>{ file.storage(true);
                              fadeIn($('body').attr('class','file')) },
                        save, preview);
        fadeIn($('body').attr('class','editor'));
    };

    if (location.search) {
        file = new Majiang.UI.PaipuFile(
                                $('#file'), 'Majiang.paipu',
                                viewer, stat, editor,
                                tenhou_log,
                                location.search.replace(/^\?/,''),
                                location.hash.replace(/^#/,''));
    }
    else {
        file = new Majiang.UI.PaipuFile(
                                $('#file'), 'Majiang.paipu',
                                viewer, stat, editor,
                                tenhou_log);
    }
    file.redraw();

    $(window).on('resize', ()=>scale($('#board'), $('#space')));
});
