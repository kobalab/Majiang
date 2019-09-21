/*
 *  Majiang.View.audio
 */
"use strict";

const $ = require('jquery');

const _audio = {};

module.exports = function audio(name) {
    let new_audio = _audio[name].clone()[0];
    let volume    = _audio[name].attr('volume');
    if (volume) {
        new_audio.oncanplaythrough = ()=>{
            new_audio.volume = + volume;
            new_audio.oncanplaythrough = null;
        };
    }
    return new_audio;
}

$(function(){
    $('#loaddata audio').each(function(){
        let name = $(this).data('name');
        _audio[name] = $(this);
    });
});
