/*!
 *  電脳麻将: 牌理 v2.1.1
 *
 *  Copyright(C) 2017 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/Majiang/blob/master/LICENSE
 */
"use strict";

const { setSelector, clearSelector } = Majiang.UI.Util;

const model = {};
const view  = {};

const rule = Majiang.rule();

let pref;

function repair_shan(shan, shoupai) {
    let paistr = shoupai.toString();
    for (let suitstr of paistr.match(/[mpsz][\d\+\=\-]+/g)) {
        let s = suitstr[0];
        for (let n of suitstr.match(/\d/g)) {
            let i = shan._pai.indexOf(s+n);
            if (i >= 0) shan._pai.splice(i, 1);
        }
    }
}

function qipai(paistr) {

    model.shan = new Majiang.Shan(rule);

    if (paistr) {
        model.shoupai = Majiang.Shoupai.fromString(paistr);
        repair_shan(model.shan, model.shoupai);
    }
    else {
        let qipai = [];
        while (qipai.length < 13) qipai.push(model.shan.zimo());
        model.shoupai = new Majiang.Shoupai(qipai);
        model.shoupai.zimo(model.shan.zimo());
    }
    model.lizhi = false;

    while (model.shan.paishu > 17) model.shan.zimo();

    $('form input[name="paistr"]').val(model.shoupai.toString());
    if (paistr) history.replaceState('', '', `#${model.shoupai.toString()}`);

    view.shoupai = new Majiang.UI.Shoupai(
                                $('.shoupai'), view.pai, model.shoupai
                            ).redraw(true);

    model.he = new Majiang.He();
    view.he  = new Majiang.UI.He($('.he'), view.pai, model.he).redraw(true);

    paili(1);
}

function set_handler() {

    for (let p of model.shoupai.get_dapai()) {
        let pai = $(p.substr(-1) == '_'
                        ? `.zimo .pai[data-pai="${p.substr(0,2)}"]`
                        : `> .pai[data-pai="${p}"]`,
                    $('.shoupai .bingpai'));
        pai.attr('tabindex', 0).attr('role','button')
            .on('click.dapai', (ev)=>{
                $(ev.target).addClass('dapai');
                dapai(p);
            });
    }
    setSelector($('.shoupai .bingpai .pai[tabindex]'), 'dapai', {focus: -1});
}

function dapai(p) {

    clearSelector('dapai');

    if (pref.sound_on) view.audio('dapai').play();
    model.shoupai.dapai(p);
    view.shoupai.dapai(p);

    if (! model.lizhi && Majiang.Util.xiangting(model.shoupai) == 0) {
        model.lizhi = true;
        p += '*';
    }

    model.he.dapai(p);
    view.he.dapai(p);

    setTimeout(zimo, 600);
}

function zimo() {

    if (! model.shan.paishu) {
        view.shoupai.redraw();
        view.he.redraw();
        $('.status').text('流局……');
        $('.paili').empty();
        return;
    }

    model.shoupai.zimo(model.shan.zimo());
    view.shoupai.redraw();
    view.he.redraw();

    paili();
}

function paili(start) {

    $('.paili').empty();

    let n_xiangting = Majiang.Util.xiangting(model.shoupai);
    if      (n_xiangting == -1) $('.status').text('和了！！');
    else if (n_xiangting ==  0) $('.status').text('聴牌！');
    else                        $('.status').text(`${n_xiangting}向聴`);

    if (n_xiangting == -1) {
        if (pref.sound_on) view.audio('zimo').play();
        return;
    }
    else if (n_xiangting == 0 && ! model.lizhi) {
        if (pref.sound_on) view.audio('lizhi').play();
    }

    let dapai = [];
    for (let p of model.shoupai.get_dapai()) {

        let shoupai = model.shoupai.clone().dapai(p);
        if (Majiang.Util.xiangting(shoupai) > n_xiangting) continue;

        p = p[0] + (+p[1]||5);
        if (dapai.find(dapai => dapai.p == p)) continue;

        let tingpai = Majiang.Util.tingpai(shoupai);
        let n = tingpai.map(p => 4 - model.shoupai._bingpai[p[0]][p[1]])
                       .reduce((x, y)=> x + y, 0)

        dapai.push({ p: p, tingpai: tingpai, n: n });
    }

    const cmp = (a, b) => b.n - a.n
                       || b.tingpai.length - a.tingpai.length
                       || (a.p < b.p ? -1 : 1);
    for (let d of dapai.sort(cmp)) {
        let html = '<div>打: '
                 + $('<span>').append(view.pai(d.p)).html()
                 + ' 摸: '
                 + d.tingpai.map(
                     p => $('<span>').append(view.pai(p)).html()
                 ).join('')
                 + ` (${d.n}枚)</div>`;
        $('.paili').append($(html));
    }

    if (start) setTimeout(set_handler, 600);
    else       set_handler();
}

$(function(){

    view.pai   = Majiang.UI.pai('#loaddata');
    view.audio = Majiang.UI.audio('#loaddata');

    pref = JSON.parse(localStorage.getItem('Majiang.pref'));

    $('form input[type="button"]').on('click', function(){
        qipai();
        return false;
    });
    $('form').on('submit', function(){
        qipai($('form input[name="paistr"]').val());
        return false;
    });
    $('form').on('reset', function(){
        $('input[name="paistr"]').trigger('focus');
        history.replaceState('', '', location.href.replace(/#.*$/,''));
    });

    let paistr = location.hash.replace(/^#/,'');
    qipai(paistr);
});
