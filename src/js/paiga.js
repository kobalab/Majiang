/*!
 *
 *  paiga.js
 *
 *  Copyright(C) 2017 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/Majiang/blob/master/LICENSE
 */
"use strict";

const $ = require('jquery');

$(function(){

    $('.version').text('ver. ' + Majiang.VERSION);

    let w = 24, h = 34;

    let imgbase = '//kobalab.github.io/paiga/';
    let img = {
        _:  'ura.gif',

        m0: 'man5red.gif',
        m1: 'man1.gif', m2: 'man2.gif', m3: 'man3.gif',
        m4: 'man4.gif', m5: 'man5.gif', m6: 'man6.gif',
        m7: 'man7.gif', m8: 'man8.gif', m9: 'man9.gif',

        p0: 'pin5red.gif',
        p1: 'pin1.gif', p2: 'pin2.gif', p3: 'pin3.gif',
        p4: 'pin4.gif', p5: 'pin5.gif', p6: 'pin6.gif',
        p7: 'pin7.gif', p8: 'pin8.gif', p9: 'pin9.gif',

        s0: 'sou5red.gif',
        s1: 'sou1.gif', s2: 'sou2.gif', s3: 'sou3.gif',
        s4: 'sou4.gif', s5: 'sou5.gif', s6: 'sou6.gif',
        s7: 'sou7.gif', s8: 'sou8.gif', s9: 'sou9.gif',

        z1: 'ton.gif',  z2: 'nan.gif',  z3: 'sha.gif',  z4: 'pei.gif',
        z5: 'haku.gif', z6: 'hatu.gif', z7: 'tyun.gif',

        m0_: 'yman5red.gif',
        m1_: 'yman1.gif', m2_: 'yman2.gif', m3_: 'yman3.gif',
        m4_: 'yman4.gif', m5_: 'yman5.gif', m6_: 'yman6.gif',
        m7_: 'yman7.gif', m8_: 'yman8.gif', m9_: 'yman9.gif',

        p0_: 'ypin5red.gif',
        p1_: 'ypin1.gif', p2_: 'ypin2.gif', p3_: 'ypin3.gif',
        p4_: 'ypin4.gif', p5_: 'ypin5.gif', p6_: 'ypin6.gif',
        p7_: 'ypin7.gif', p8_: 'ypin8.gif', p9_: 'ypin9.gif',

        s0_: 'ysou5red.gif',
        s1_: 'ysou1.gif', s2_: 'ysou2.gif', s3_: 'ysou3.gif',
        s4_: 'ysou4.gif', s5_: 'ysou5.gif', s6_: 'ysou6.gif',
        s7_: 'ysou7.gif', s8_: 'ysou8.gif', s9_: 'ysou9.gif',

        z1_: 'yton.gif',  z2_: 'ynan.gif',  z3_: 'ysha.gif',  z4_: 'ypei.gif',
        z5_: 'yhaku.gif', z6_: 'yhatu.gif', z7_: 'ytyun.gif'
    };

    function set_size(sizestr) {
        let size = sizestr.match(/^(\d+)x(\d+)$/);
        if (size) { w = size[1]; h = size[2] }
    }

    function markup(match, mark) {

        if (match[0] == '\\') return match.substr(1);

        let html = '<span style="white-space:pre;">', url, v = 0;

        for (let pai of mark.match(/[mpsz](?:\d+[\-\=]?)+|[ _]|.+/g)) {

            if (pai == ' ') {
                html += ' ';
            }
            else if (pai == '_') {
                url = imgbase + img._;
                html += '<img src="'+url+'" width="'+w+'" height="'+h+'"'
                        + ' alt="'+pai+'">';
            }
            else if (pai.match(/^[mpsz](?:\d+[\-\=]?)+/)) {
                let s = pai[0];
                for (let n of pai.match(/\d[\-\=]?/g)) {
                    let d = n[1] || ''; n = n[0];
                    if (d == '=' && ! v) {
                        html += '<span style="display:inline-block;width:'
                                    +h+'px;">';
                        v = 1;
                    }
                    else if (! d) {
                        if (v) html += '</span>';
                        v = 0;
                    }

                    if (d == '-' || d == '=') {
                        url = imgbase + img[s+n+'_'];
                        html += '<img src="'+url+'" width="'+h+'" height="'+w+'"'
                                + (d == '='
                                        ? ' style="vertical-align:bottom;'
                                                + 'display:block;"'
                                        : '')
                                + ' alt="'+(s+n+d)+'">';
                    }
                    else {
                        url = imgbase + img[s+n];
                        html += '<img src="'+url+'" width="'+w+'" height="'+h+'"'
                                + ' alt="'+(s+n)+'">';
                    }

                    if (d != '=') {
                        if (v) html += '</span>';
                        v = 0;
                    }
                }
            }
            else {
                html += '<span style="color:red;">' + pai + '</span>'
            }
        }
        if (v) html += '</span>';
        html += '</span>';

        return html;
    }

    function parse(text) {
        let html = text.replace(/\\.|{(.+?)}/g, markup);
        return html;
    }

    $('input[type="submit"]').on('click', function(event){

        set_size($('form input[name="size"]:checked').val());
        let html = parse($('form textarea').val());
        $('#paiga textarea').val(html).select();
        if (location.protocol == 'file:')
                html = html.replace(/ src=\"\/\//g, ' src="http://');
        $('#paiga div')
            .empty()
            .append($('<p style="white-space:pre-line"><br>'+html+'<br></p>'));

        return false;
    });

    $('input[type="reset"]').on('click', function(event){

        $('form textarea').val('').select();
        $('#paiga div').empty();
        $('#paiga textarea').val('');

        return false;
    });
});
