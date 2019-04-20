/*!
 *
 *  game.js
 *
 *  Copyright(C) 2017 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/Majiang/blob/master/LICENSE
 */

"use strict";

let ua = navigator.userAgent;
if (ua.match(/\bMSIE\b/) || ua.match(/\bTrident\b/)) {
    Majiang.Player = require('./majiang/dev/player0202');
}

let loaded;

$(function(){
    let game, paipu;

    function start() {
        $('#game > .player').hide();
        $('body').attr('class','game');
        game = new Majiang.Game();
        new Majiang.View.GameCtl($('#game'), game);
        game._player = [
            new Majiang.View.Player(0, $('#game')),
            new Majiang.Player(1),
            new Majiang.Player(2),
            new Majiang.Player(3),
        ];
        game._callback = end;
        game.kaiju();
    }

    function end() {
        $('body').attr('class','file').hide().fadeIn();
        $('#game > .player').show();
        if (game) {
            paipu._paipu.add(game._paipu);
        }
        while (paipu._paipu.length() > 10) {
            paipu._paipu.del(0);
        }
        paipu.redraw();
    }

    $('.version').text('ver. ' + Majiang.VERSION);

    paipu = new Majiang.View.PaipuFile($('#file'), 'Majiang.game');
    $('#file .next').on('click', start);

    $(window).on('load', function(){
        $('#title .loading').hide();
        $('#title .start').on('click', function(){
            if (paipu._paipu.length()) end();
            else                       start();
        }).show();
    });
    if (loaded) $(window).trigger('load');
});

$(window).on('load', ()=>loaded = true);
