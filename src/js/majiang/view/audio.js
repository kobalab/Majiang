/*
 *  Majiang.View.audio
 */
"use strict";

const $ = require('jquery');

const _audio = {};

module.exports = function audio(name) {
    return _audio[name].clone()[0];
}

$(function(){
    $('#loaddata audio').each(function(){
        let name = $(this).data('name');
        _audio[name] = $(this);
    });
});
