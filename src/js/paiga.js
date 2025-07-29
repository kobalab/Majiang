/*!
 *  電脳麻将: 牌画入力 v2.5.0
 *
 *  Copyright(C) 2017 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/Majiang/blob/master/LICENSE
 */
"use strict";

const example = 'このような記述ができます。\n'
              + '{s067z1 z1}(ツモ) {p2-13} {z666=6} {_z77_} {  }(ドラ){m1}';

const imgbase = 'https://kobalab.github.io/paiga/2/';

function markup(paistr, w, h) {

    let url, v = 0;
    let html = '<span style="white-space:pre;">';

    for (let pai of paistr.match(/[mpsz](?:\d\d\=|\d\-|\d)+|[ _]|.+/g)||[]) {

        if (pai == ' ') {
            html += '&nbsp;';
        }
        else if (pai == '_') {
            url = imgbase + 'pai.png';
            html += `<img src="${url}" width="${w}" height="${h}"`
                  + ` alt="${pai}">`;
        }
        else if (pai.match(/^[mpsz](?:\d\d\=|\d\-|\d)+$/)) {
            let s = pai[0];
            for (let n of pai.match(/\d\d\=|\d\-|\d/g)) {
                let url = imgbase, x, y;
                if (n.slice(-1) == '=') {
                    url += s + n.slice(0,2) + '_.png';
                    x = h; y = w * 2;
                }
                else if (n.slice(-1) == '-') {
                    url += s + n.slice(0,1) + '_.png';
                    x = h; y = w;
                }
                else {
                    url += s + n + '.png';
                    x = w; y = h;
                }
                html += `<img src="${url}" width="${x}" height="${y}"`
                            + ` alt="${s+n}">`;
            }
        }
        else {
            html += `<span style="color:red;">${pai}</span>`;
        }
    }
    html += '</span>';
    return html;
}

function parse(text, w, h) {
    return text.replace(/\\.|{(.+?)}/g, (match, mark)=>
        match[0] == '\\' ? match.slice(1)
                         : markup(mark, w, h)
    );
}

$(function(){

    $('textarea[name="text"]').val(example).focus();

    $('form').on('submit', ()=>{

        let [ , w, h ] = $('input[name="size"]:checked').val()
                                                        .match(/^(\d+)x(\d+)$/);
        let text = $('textarea[name="text"]').val();
        let html = parse(text, w, h);
        $('.paiga div')
            .empty()
            .append($(`<p  style="white-space:pre-line">${html}</p>`));
        $('.paiga textarea').val(html).select();

        return false;
    });

    $('form').on('reset', ()=>{
        $('.paiga div').empty();
        $('.paiga textarea').val('');
        $('textarea[name="text"]').focus();
    });
});
