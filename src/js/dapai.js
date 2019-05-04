/*!
 *
 *`dapai.js
 *
 *  Copyright(C) 2019 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/Majiang/blob/master/LICENSE
 */

"use strict";

const $ = require('jquery');

let _row;

class Shan {
    constructor(baopai, fubaopai) {
        this._baopai   = baopai   || [];
        this._fubaopai = fubaopai || [];
    }
    baopai()   { return this._baopai   }
    fubaopai() { return this._fubaopai }
    paishu()   { return 0 }
}

function init_player(paistr, zhuangfeng, menfeng, baopai, hongpai) {

    const player = new Majiang.Player(0);

    let kaiju = {
        player:  [],
        qijia:   0,
        hongpai: hongpai
    };
    player.kaiju(kaiju);

    let qipai = {
        zhuangfeng: zhuangfeng,
        jushu:      (4 - menfeng) % 4,
        changbang:  0,
        lizhibang:  0,
        defen:      [ 25000, 25000, 25000, 25000 ],
        baopai:     baopai.length && Majiang.Shoupai.valid_pai(baopai[0])
                                                            ||'z2',
        shoupai:    [ '', '', '', '' ]
    };
    qipai.shoupai[menfeng] = paistr;
    player.qipai(qipai);

    for (let i = 1; i < baopai.length; i++) {
        player.kaigang({ baopai: baopai[i] });
    }

    return player;
}

function report(info) {

    $('.report').empty();

    for (let r of info.sort((a, b)=> b.ev - a.ev)) {
        let row = _row.clone();
        $('.dapai', row).append(Majiang.View.pai(r.p));
        if (r.gang) $('.dapai', row).append($('<span>').text('カン'));
        $('.xiangting', row).text(
                    r.n_xiangting ==  0 ? '聴牌' : `${r.n_xiangting}向聴`);
        if (r.n_xiangting < 3) {
            let ev = Math.floor(r.ev * 100);
            ev = ev < 100 ? ('00' + ev).substr(-3) : '' + ev;
            ev = ev.replace(/(\d{2})$/, '.$1');
            $('.eval', row).text(ev);
        }
        for (let p of r.tingpai) {
            $('.tingpai', row).append(Majiang.View.pai(p));
        }
        $('.tingpai', row).append($('<span>').text(`(${r.n_tingpai}枚)`));
        $('.report').append(row);
    }
    $('#dapai').hide().fadeIn();
}

function submit() {

    let paistr     = $('input[name="paistr"]').val();
    if (! paistr) return false;

    let zhuangfeng = + $('select[name="zhuangfeng"] option:selected').val();
    let menfeng    = + $('select[name="menfeng"] option:selected').val();
    let baopai     = $.makeArray($('input[name="baopai"]'))
                                    .map(p=>$(p).val()).filter(p=>p);
    let hongpai    = $('input[name="hongpai"]').prop('checked');

    const player = init_player(paistr, zhuangfeng, menfeng, baopai, hongpai
                        ? { m: 1, p: 1, s: 1 }
                        : { m: 0, p: 0, s: 0 });

    new Majiang.View.Shan('.shan', new Shan(player._baopai)).redraw();
    new Majiang.View.Shoupai('.shoupai', player._shoupai).redraw(true);

    let info = [];
    let gang  = player.select_gang(info);
    let dapai = player.select_dapai(info);
    report(info);

    paistr = player._shoupai.toString();
    $('input[name="paistr"]').val(paistr);
    baopai = player._baopai;
    for (let i = 0; i < baopai.length; i++) {
        $('input[name="baopai"]').eq(i).val(baopai[i]);
    }

    let fragment = '#'
                 + [ paistr, zhuangfeng, menfeng, baopai.join(',')].join('/');
    if (! hongpai) fragment += '/1';
    history.replaceState('', '', fragment)

    return false;
}

$(function(){

    $('form').on('submit', submit);

    $('form').on('reset', ()=>{
        $('input[name="paistr"]').focus();
        $('#dapai').hide();
    });

    $('#dapai').hide();
    _row = $('.report .row');
    $('.report').empty();

    let fragment = location.hash.replace(/^#/,'');
    if (fragment) {
        let [paistr, zhuangfeng, menfeng, baopai, hongpai]
                                            = fragment.match(/([^\/]+)/g);
        baopai  = (baopai || '').split(/,/);
        hongpai = ! hongpai;

        $('input[name="paistr"]').val(paistr);
        $('select[name="zhuangfeng"] option')
                                .eq(zhuangfeng).attr('selected', 'selected');
        $('select[name="menfeng"] option')
                                .eq(menfeng).attr('selected', 'selected');
        for (let i = 0; i < baopai.length; i++) {
            $('input[name="baopai"]').eq(i).val(baopai[i]);
        }
        $('input[name="hongpai"]').prop('checked', hongpai);

        submit();
    }
    else {
        $('input[name="paistr"]').val('m123p1234789s338s8').focus();
        $('input[name="baopai"]').eq(0).val('s3');
    }
});
