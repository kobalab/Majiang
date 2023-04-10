/*!
 *  電脳麻将: 自動対戦 v2.1.1
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

    const rule = Majiang.rule(
                    JSON.parse(localStorage.getItem('Majiang.rule')||'{}'));

    let open_shoupai = false;
    let open_he      = false;

    function start() {
        if (game) {
            open_shoupai = game._view.open_shoupai;
            open_he      = game._view.open_he;
        }
        let players = [];
        for (let i = 0; i < 4; i++) {
            players[i] = new Majiang.AI();
        }
        game = new Majiang.Game(players, start, rule);
        game.view = new Majiang.UI.Board($('#board .board'),
                                        pai, audio, game.model);
        game.wait  = 5000;
        game._model.title
            = game._model.title.replace(/^[^\n]*/, $('title').text());
        game._view.open_shoupai = open_shoupai;
        game._view.open_he      = open_he;

        $('body').attr('class','board');
        scale($('#board'), $('#space'));

        $(window).off('keyup').on('keyup', (ev)=>{
            if (ev.key == ' ') {
                if (gamectl.stoped) gamectl.start();
                else                gamectl.stop();
                game.handler = ()=> gamectl.stop();
            }
            else if (ev.key == 's') gamectl.shoupai();
            else if (ev.key == 'h') gamectl.he();
            return false;
        });
        $('#board .board').off('click').on('click', ()=>{
            if (gamectl.stoped) gamectl.start();
            else                gamectl.stop();
            game.handler = ()=> gamectl.stop();
        });
        $('#board .board > .shoupai')
            .off('click', '.pai')
            .on('click', '.pai', ()=>gamectl.shoupai());
        $('#board .board > .he')
            .off('click', '.pai')
            .on('click', '.pai', ()=>gamectl.he());

        const gamectl = new Majiang.UI.GameCtl(
                                        $('#board'), game, 'Majiang.pref');
        game.kaiju();
    }

    $(window).on('resize', ()=>scale($('#board'), $('#space')));

    $(window).on('load', function(){
        hide($('#title .loading'));
        $('#title .start').on('click', start)
        show($('#title .start'));
    });
    if (loaded) $(window).trigger('load');
});

$(window).on('load', ()=> loaded = true);
