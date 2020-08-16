/*!
 *
 *  autoplay.js
 *
 *  Copyright(C) 2017 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/Majiang/blob/master/LICENSE
 */

"use strict";

const { hide, show } = require('./majiang/view/fadein');

let loaded, gamectl;

$(function(){
    let game;
    let speed = 3;
    let sound = true;
    let open_shoupai = false;
    let open_he      = false;

    function init() {
        $(window).on('keyup', function(event){
            if (event.key == ' ') {
                if (game._stop) gamectl.start();
                else            gamectl.stop();
                game._jieju_handler = ()=>{ gamectl.stop() };
            }
            else if (event.key == 's') gamectl.shoupai();
            else if (event.key == 'h') gamectl.he();
        });
        $('#game > .shoupai').on('mousedown', '.pai', ()=>gamectl.shoupai());
        $('#game > .he'     ).on('mousedown', '.pai', ()=>gamectl.he());

        start();
    }

    function start() {
        if (game) {
            speed        = game._speed;
            sound        = game._view.sound_on;
            open_shoupai = game._view.open_shoupai;
            open_he      = game._view.open_he;
        }
        game = new Majiang.Game();
        game._model.title
            = game._model.title.replace(/^.*?(?=\n)/, $('title').text());
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
        game._view.open_shoupai = open_shoupai;
        game._view.open_he      = open_he;
        gamectl.update_controler();
        game.kaiju();
    }

    $('.version').text('ver. ' + Majiang.VERSION);

    $(window).on('load', function(){
        hide($('#title .loading'));
        $('#title .start').on('click', function(){
            $('body').attr('class','game');
            init();
        });
        show($('#title .start'));
    });
    if (loaded) $(window).trigger('load');
});

$(window).on('load', ()=>loaded = true);
