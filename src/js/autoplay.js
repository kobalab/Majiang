/*!
 *
 *  autoplay.js
 *
 *  Copyright(C) 2017 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/Majiang/blob/master/LICENSE
 */

"use strict";

        var loaded, gamectl;

        $(function(){
            var game;
            var speed = 3;
            var sound = true;
            var highspeed = false;

            $(window).on('keyup', function(event){
                if (event.key == ' ') {
                    if (game._stop) gamectl.start();
                    else            gamectl.stop();
                }
                gamectl.update_controler();
            });
            $('#game').on('dblclick', function(){
                if (highspeed) {
                    game._speed = speed;
                    game._view.sound_on = sound;
                    highspeed = false;
                }
                else {
                    highspeed = true;
                    speed = game._speed;
                    sound = game._view.sound_on;
                    game._speed = 0;
                    game._view.sound_on = false;
                }
                gamectl.update_controler();
            });

            function start() {
                if (game && ! highspeed) {
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
                if (highspeed) {
                    game._speed = 0;
                    game._view.sound_on = false;
                }
                else {
                    game._speed = speed;
                    game._view.sound_on = sound;
                }
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
