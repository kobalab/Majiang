/*!
 *
 *  paili.js
 *
 *  Copyright(C) 2017 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/Majiang/blob/master/LICENSE
 */

"use strict";

const model = {};
const view  = {};

function make_shan(shan, paistr) {
    for (let suitstr of paistr.match(/([mpsz][\d\+\=\-]+)/g)) {
        let s = suitstr[0];
        for (let n of suitstr.match(/\d/g)) {
            let i = shan._pai.indexOf(s+n);
            if (i < 0) continue;
            shan._pai.splice(i, 1);
        }
    }
}

function qipai(paistr) {

    if (paistr) history.replaceState('', '', `#${paistr}`);

    model.shan = new Majiang.Shan({m:1,p:1,s:1});

    if (paistr) {
        model.shoupai = Majiang.Shoupai.fromString(paistr);
        make_shan(model.shan, model.shoupai.toString());
    } else {
        let pai = [];
        while (pai.length < 13) { pai.push(model.shan.zimo()) }
        model.shoupai = new Majiang.Shoupai(pai);
    }

    view.shoupai  = new Majiang.View.Shoupai($('.shoupai'), model.shoupai);
    view.shoupai.redraw(true);

    while (model.shan.paishu() > 18) { model.shan.zimo() }

    model.he = new Majiang.He();
    view.he  = new Majiang.View.He($('.he'), model.he);
    view.he.redraw(true);

    $('.paili').empty();

    if (! model.shoupai._zimo) setTimeout(zimo, 0);
    else                       paili();

    $('form input[name="paistr"]').val(model.shoupai.toString());
}

function set_handler() {

    let timeStamp = null;

    for (let p of model.shoupai.get_dapai()) {
        let selector = `.shoupai .bingpai > .pai[data-pai="${p}"]`;
        $(selector).on('mouseover', function(event){
            timeStamp = event.timeStamp;
            $(this).addClass('selected')
                   .off('click')
                   .on('click', function(event){
                       if (event.timeStamp == timeStamp) return false;
                       $(this).addClass('dapai');
                       dapai(p);
                       return false;
                   });
            return false;
        }).on('mouseout', function(){
            $(this).removeClass('selected')
                   .off('click');
            return false;
        });
        selector = `.shoupai .bingpai .zimo .pai[data-pai="${p}"]`;
        $(selector).on('mouseover', function(event){
            timeStamp = event.timeStamp;
            $(this).addClass('selected')
                   .off('click')
                   .on('click', function(event){
                       if (event.timeStamp == timeStamp) return false;
                       $(this).addClass('dapai');
                       dapai(p+'_');
                       return false;
                   });
            return false;
        }).on('mouseout', function(){
            $(this).removeClass('selected')
                   .off('click');
            return false;
        });
    }
}

function zimo() {
    view.he.redraw();
    view.shoupai.redraw();
    if (model.shan.paishu() == 0) {
        $('.status').text('流局……');
        return;
    }
    model.shoupai.zimo(model.shan.zimo());
    view.shoupai.redraw();
    paili();
}

function dapai(p) {

    Majiang.View.audio('dapai').play();

    $('.shoupai .bingpai .pai').off('click')
                               .off('mouseover')
                               .off('mouseout');

    if (! model.shoupai.lizhi()
        && Majiang.Util.xiangting(model.shoupai) == 0) p = p +'*';

    model.shoupai.dapai(p);
    view.shoupai.dapai(p);

    model.he.dapai(p);
    view.he.dapai(p);

    $('.paili').empty();

    setTimeout(zimo, 500);
}

function paili() {

    let n_xiangting = Majiang.Util.xiangting(model.shoupai);
    if      (n_xiangting == -1) $('.status').text('和了！！');
    else if (n_xiangting ==  0) $('.status').text('聴牌！');
    else                        $('.status').text(`${n_xiangting}向聴`);

    if (n_xiangting == 0 && ! model.shoupai.lizhi()) {
        Majiang.View.audio('lizhi').play();
    }
    else if (n_xiangting == -1) {
        Majiang.View.audio('zimo').play();
        return;
    }

    let dapai = [];
    for (let p of model.shoupai.get_dapai()) {

        let new_shoupai = model.shoupai.clone().dapai(p);
        if (Majiang.Util.xiangting(new_shoupai) > n_xiangting) continue;

        p = p.replace(/0/,'5');
        if (dapai.length && dapai[dapai.length - 1].p == p) continue;

        let tingpai   = Majiang.Util.tingpai(new_shoupai);
        let n_tingpai = tingpai.length
                          ? tingpai.map(
                                p => 4 - model.shoupai._bingpai[p[0]][p[1]]
                            ).reduce((x,y)=>x+y)
                          : 0;

        dapai.push({ p: p, tingpai: tingpai, n_tingpai: n_tingpai });
    }

    const compare = (a, b) => {
        if (a.n_tingpai == b.n_tingpai) {
            if (a.tingpai.length == b.tingpai.length) {
                return (a.p >  b.p) ?  1
                     : (a.p <  b.p) ? -1
                     :                 0;
            }
            else return b.tingpai.length - a.tingpai.length;
        }
        else return b.n_tingpai - a.n_tingpai;
    };
    for (let dp of dapai.sort(compare)) {
        let html = '<div>打: '
                 + $('<span>').append(Majiang.View.pai(dp.p)).html()
                 + ' 摸: '
                 + dp.tingpai.map(
                     p => $('<span>').append(Majiang.View.pai(p)).html()
                 ).join('')
                 + ` (${dp.n_tingpai}枚)</div>`;
        $('.paili').append($(html));
    }

    set_handler();
}

$(function(){

    $('.version').text('ver. ' + Majiang.VERSION);

    $('form input[type="button"]').on('click', function(event){
        qipai();
        return false;
    });
    $('form').on('submit', function(){
        qipai($('form input[name="paistr"]').val());
        return false;
    })
    $('form').on('reset', function(){
        $('input[name="paistr"]').focus();
    });

    let paistr = location.hash.replace(/^#/,'');
    qipai(paistr);
});
