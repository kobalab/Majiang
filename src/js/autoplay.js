/*!
 *
 *  autoplay.js
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

let loaded, gamectl;

$(function(){
    let game;
    let speed = 3;
    let sound = true;

    $(window).on('keyup', function(event){
        if (event.key == ' ') {
            if (game._stop) gamectl.start();
            else            gamectl.stop();
            game._jieju_handler = ()=>{ gamectl.stop() };
        }
    });

    function start() {
        if (game) {
           speed = game._speed;
           sound = game._view.sound_on;
        }
        game = new Majiang.Game();
        game._player = [
            new Majiang.Player(0),
            new Majiang.Player(1),
            new Majiang.Player(2),
            new Majiang.Player(3),
        ];
        game._callback = start;
        game._delay = 5000;
        gamectl = new Majiang.View.GameCtl($('#game'), game);
        game._speed = speed;
        game._view.sound_on = sound;
        gamectl.update_controler();
        game.kaiju();
    }

    $('.version').text('ver. ' + Majiang.VERSION);

    $(window).on('load', function(){
        $('#title .loading').hide();
        $('#title .start').on('click', function(){
            $('body').attr('class','game');
            start();
        }).show();
    });
    if (loaded) $(window).trigger('load');
});

$(window).on('load', ()=>loaded = true);
