/*!
 *  電脳麻将 v2.1.1
 *
 *  Copyright(C) 2017 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/Majiang/blob/master/LICENSE
 */
"use strict";

const { hide, show, fadeIn, scale,
        setSelector, clearSelector  } = Majiang.UI.Util;

let loaded;

$(function(){

    let game;
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
    const file = new Majiang.UI.PaipuFile($('#file'), 'Majiang.game',
                                            viewer, stat);
    const rule = Majiang.rule(
                    JSON.parse(localStorage.getItem('Majiang.rule')||'{}'));

    function start() {
        let players = [ new Majiang.UI.Player($('#board'), pai, audio) ];
        for (let i = 1; i < 4; i++) {
            players[i] = new Majiang.AI();
        }
        game = new Majiang.Game(players, end, rule);
        game.view = new Majiang.UI.Board($('#board .board'),
                                        pai, audio, game.model);

        $('body').attr('class','board');
        scale($('#board'), $('#space'));

        new Majiang.UI.GameCtl($('#board'), game, 'Majiang.pref');
        game.kaiju();
    }

    function end(paipu) {
        if (paipu) file.add(paipu, 10);
        fadeIn($('body').attr('class','file'));
        file.redraw();
    }

    $('#file .start').on('click', start);

    $(window).on('resize', ()=>scale($('#board'), $('#space')));

    $(window).on('load', function(){
        hide($('#title .loading'));
        $('#title .start')
            .attr('tabindex', 0).attr('role','button')
            .on('click', ()=>{
                clearSelector('title');
                if (file.isEmpty) start();
                else              end();
            });
        show(setSelector($('#title .start'), 'title',
                        { focus: null, touch: false }));
    });
    if (loaded) $(window).trigger('load');
});

$(window).on('load', ()=> loaded = true);
