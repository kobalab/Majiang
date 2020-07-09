/*
 *  Majiang.View.GameCtl
 */
"use strict";

const $ = require('jquery');

const Game = require('./game');

module.exports = class GameCtl {

constructor(root, game) {

    this._root = root;
    this._game = game;

    game._view = new Game(root, game._model);
    game._view.open_shoupai = false;
    game._view.open_he      = false;

    this.set_handler();
}

set_handler() {

    this.clear_handler();
    this.update_controler();

    const controler = $('.controler', this._root);
    const game = this._game;
    $('.sound', controler).on('mousedown', ()=>this.sound());
    $('.plus',  controler).on('mousedown', ()=>this.speed(game._speed + 1));
    $('.minus', controler).on('mousedown', ()=>this.speed(game._speed - 1));

    $(window).on('keyup', event => {
        if      (event.key == '+')  this.speed(game._speed + 1);
        else if (event.key == '-')  this.speed(game._speed - 1);
        else if (event.key == 'a')  this.sound();
    });
}

clear_handler() {}

update_controler() {

    const game = this._game;
    const controler = $('.controler', this._root);
    controler.removeClass('hide');

    $('.exit',     controler).addClass('hide');
    $('.summary',  controler).addClass('hide');
    $('.analyzer', controler).addClass('hide');
    $('.first',    controler).addClass('hide');
    $('.prev',     controler).addClass('hide');
    $('.autoplay', controler).addClass('hide');
    $('.next',     controler).addClass('hide');
    $('.last',     controler).addClass('hide');

    if (game._view.sound_on) {
        $('.sound.off', controler).addClass('hide');
        $('.sound.on',  controler).removeClass('hide');
    }
    else {
        $('.sound.on',  controler).addClass('hide');
        $('.sound.off', controler).removeClass('hide');
    }

    if (game._speed) {
        $('.speed', controler).removeClass('hide');
        $('.speed span', controler).each((i, n)=>{
            $(n).css('visibility', i + 1 > game._speed ? 'hidden' : 'visible');
        });
    }
    else {
        $('.sound', controler).addClass('hide');
        $('.speed', controler).addClass('hide');
    }
}

speed(speed) {
    const game = this._game;
    game._speed = speed;
    if (game._speed < 1) game._speed = 1;
    if (game._speed > 5) game._speed = 5;
    this.update_controler();
    return false;
}

sound() {
    const game = this._game;
    game._view.sound_on = ! game._view.sound_on;
    this.update_controler();
    return false;
}

shoupai() {
    const game = this._game;
    if (game._status == 'hule')   return true;
    if (game._status == 'pingju') return true;
    if (game._status == 'jieju')  return true;
    game._view.open_shoupai = ! game._view.open_shoupai;
    game._view.redraw();
    return false;
}

he() {
    const game = this._game;
    if (game._status == 'hule')   return true;
    if (game._status == 'pingju') return true;
    if (game._status == 'jieju')  return true;
    game._view.open_he = ! game._view.open_he;
    game._view.redraw();
    return false;
}

start() {
    const game = this._game;
    $('.download a', this._root).addClass('hide');
    game.start();
}

stop() {
    let ua = navigator.userAgent;
    if (ua.match(/\bMobile\b/)) return;

    const game = this._game;
    game.stop();

    let blob = new Blob([ JSON.stringify(game._paipu) ],
                        { type: 'application/json' });
    $('.download a', this._root)
        .attr('href', URL.createObjectURL(blob))
        .attr('download', '牌譜.json')
        .removeClass('hide');
}

}
