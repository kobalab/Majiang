/*
 *  Majiang.View.pai
 */
"use strict";

const $ = require('jquery');

const _pai = {};

module.exports = function pai(p) {
    return _pai[p.substr(0,2)].clone();
};

$(function(){
    $('#loaddata .pai').each(function(){
        let p = $(this).data('pai');
        _pai[p] = $(this);
    });
});
