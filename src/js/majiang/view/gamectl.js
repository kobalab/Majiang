/*
 *  Majiang.View.GameCtl
 */
"use strict";

const $ = require('jquery');

const Game = require('./game');

module.exports = class GameCtl extends Majiang.Game {

constructor(root, player) {
    super();
    this._root = root;
    this._player = player;
    this._view = new Game(root, this._model);
    this._view.open_shoupai = false;
    this._view.open_he      = false;

    this.set_handler();
}

set_handler() {

    this.clear_handler();
    this.update_controler();

    const controler = $('.controler', this._root);
    $('.sound', controler).on('mousedown', ()=>this.sound());
    $('.plus',  controler).on('mousedown', ()=>this.speed(this._speed + 1));
    $('.minus', controler).on('mousedown', ()=>this.speed(this._speed - 1));

    $(window).on('keyup', event => {
        if      (event.key == '+')  this.speed(this._speed + 1);
        else if (event.key == '-')  this.speed(this._speed - 1);
        else if (event.key == 'a')  this.sound();
    });
}

clear_handler() {}

update_controler() {

    const controler = $('.controler', this._root);
    controler.removeClass('hide');

    $('.exit',     controler).addClass('hide');
    $('.summary',  controler).addClass('hide');
    $('.first',    controler).addClass('hide');
    $('.prev',     controler).addClass('hide');
    $('.autoplay', controler).addClass('hide');
    $('.next',     controler).addClass('hide');
    $('.last',     controler).addClass('hide');

    if (this._view.sound_on) {
        $('.sound.off', controler).addClass('hide');
        $('.sound.on',  controler).removeClass('hide');
    }
    else {
        $('.sound.on',  controler).addClass('hide');
        $('.sound.off', controler).removeClass('hide');
    }

    if (this._speed) {
        $('.speed', controler).removeClass('hide');
        $('.speed span', controler).each((i, n)=>{
            $(n).css('visibility', i + 1 > this._speed ? 'hidden' : 'visible');
        });
    }
    else {
        $('.sound', controler).addClass('hide');
        $('.speed', controler).addClass('hide');
    }
}

speed(speed) {
    this._speed = speed;
    if (this._speed < 1) this._speed = 1;
    if (this._speed > 5) this._speed = 5;
    this.update_controler();
    return false;
}

sound() {
    this._view.sound_on = ! this._view.sound_on;
    this.update_controler();
    return false;
}

start() {
    $('.download a', this._root).addClass('hide');
    super.start();
}

stop() {
    super.stop();
    let blob = new Blob([ JSON.stringify(this._paipu) ],
                        { type: 'application/json' });
    $('.download a', this._root)
        .attr('href', URL.createObjectURL(blob))
        .attr('download', '牌譜.json')
        .removeClass('hide');
}

}
