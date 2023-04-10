/*!
 *  電脳麻将: 牌譜ビューア v2.1.1
 *
 *  Copyright(C) 2017 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/Majiang/blob/master/LICENSE
 */
"use strict";

const { hide, show, fadeIn, scale   } = Majiang.UI.Util;

$(function(){

    const pai   = Majiang.UI.pai($('#loaddata'));
    const audio = Majiang.UI.audio($('#loaddata'));

    const analyzer = (kaiju)=>{
        $('body').addClass('analyzer');
        return new Majiang.UI.Analyzer($('#board > .analyzer'), kaiju, pai,
                                        ()=>$('body').removeClass('analyzer'));
    };
    const viewer = (paipu)=>{
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

    if (location.search) {
        new Majiang.UI.PaipuFile($('#file'), 'Majiang.paipu',
                                viewer, stat,
                                'https://kobalab.net/majiang/tenhou-log/',
                                location.search.replace(/^\?/,''),
                                location.hash.replace(/^#/,'')).redraw();
    }
    else {
        new Majiang.UI.PaipuFile($('#file'), 'Majiang.paipu',
                                viewer, stat,
                                'https://kobalab.net/majiang/tenhou-log/'
                            ).redraw();
    }

    $(window).on('resize', ()=>scale($('#board'), $('#space')));
});
