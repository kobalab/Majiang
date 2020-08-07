/*!
 *
 *  paipu.js
 *
 *  Copyright(C) 2017 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/Majiang/blob/master/LICENSE
 */

"use strict";

$(function(){
    $('.version').text('ver. ' + Majiang.VERSION);

    if (location.search) {
        new Majiang.View.PaipuFile($('#file'), 'Majiang.paipu',
            location.search.replace(/^\?/,''), location.hash.replace(/^#/,''));
    }
    else {
        new Majiang.View.PaipuFile($('#file'), 'Majiang.paipu');
    }
});
