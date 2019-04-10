/*
 * Majiang.View.player
 */
"use strict";

const $ = require('jquery');
const Majiang = require('../../majiang');

module.exports = class Player extends Majiang.Player {

constructor(id, root) {
    super(id);
    this._root = root;
}

clear_handler() {
    $('.UI', this._root).addClass('hide');
    $('.UI span', this._root).addClass('hide').off('click');
    this._root.off('click');
    $('.shoupai.main .bingpai .pai')
        .off('mouseover mouseout touchstart click')
        .removeClass('selected blink');
}

get_dapai_of_lizhi() {
    let dapai = [];
    if (! this.allow_lizhi()) return dapai;
    for (let p of this.get_dapai()) {
        let shoupai = this._shoupai.clone().dapai(p);
        if (Majiang.Util.xiangting(shoupai) == 0
            && Majiang.Util.tingpai(shoupai).length > 0) dapai.push(p);
    }
    return dapai;
}

callback(reply) {
    this.clear_handler();
    this._callback(reply);
    return false;
}

wait() {
    this._root.on('click', ()=>this.callback());
}

action_zimo(zimo, option) {

    const set_lizhi_handler = (dapai)=>{
        this.clear_handler();
        for (let p of dapai) {
            let selector
                = `.shoupai.main .bingpai .pai[data-pai="${p.substr(0,2)}"]`;
            $(selector, this._root).on('click', e =>{
                $(e.target).addClass('dapai');
                return this.callback({dapai: p+'*'});
            }).addClass('blink');
        }
        return false;
    };
    const set_gang_handler = (mianzi)=>{
        this.clear_handler();
        for (let m of mianzi) {
            let selector
                = `.shoupai.main .bingpai .pai[data-pai="${m.substr(0,2)}"], `
                + `.shoupai.main .bingpai .pai[data-pai="${m[0]+m.substr(-1)}"]`;
            $(selector, this._root).on('click', e =>{
                return this.callback({gang: m});
            }).addClass('blink');
        }
        return false;
    };

    let show_button = false;

    if (this.allow_hule(null, option)) {
        $('.UI .zimo', this._root)
            .on('click', ()=>this.callback({hule: '-'}))
            .removeClass('hide');
        show_button = true;
    }

    if (this.allow_pingju()) {
        $('.UI .pingju', this._root)
            .on('click', ()=>this.callback({pingju: '-'}))
            .removeClass('hide');
        show_button = true;
    }

    let gang_mianzi = this.get_gang_mianzi();
    if (gang_mianzi.length == 1) {
        $('.UI .gang', this._root)
            .on('click', ()=>this.callback({gang: gang_mianzi[0]}))
            .removeClass('hide');
        show_button = true;
    }
    else if (gang_mianzi.length > 1) {
        $('.UI .gang', this._root)
            .on('click', ()=>set_gang_handler(gang_mianzi))
            .removeClass('hide');
        show_button = true;
    }

    if (this._shoupai.lizhi()) {
        if (show_button) {
            this._root.on('click', ()=>this.callback({dapai: zimo.p+'_'}));
        }
        else {
            this.callback({dapai: zimo.p+'_'})
            return;
        }
    }

    let dapai = this.get_dapai_of_lizhi();
    if (dapai.length > 0) {
        $('.UI .lizhi', this._root)
            .on('click', ()=>set_lizhi_handler(dapai))
            .removeClass('hide');
        show_button = true;
    }

    for (let p of this.get_dapai()) {
        let selector = p.substr(-1) == '_'
            ? `.shoupai.main .bingpai .zimo .pai[data-pai="${p.substr(0,2)}"]`
            : `.shoupai.main .bingpai > .pai[data-pai="${p}"]`;
        $(selector, this._root).on('click', (e)=>{
            $(e.target).addClass('dapai');
            return this.callback({dapai: p});
        });
    }

    $('.UI', this._root)
        .width($('.shoupai.main .bingpai', this._root).width())
        .removeClass('hide');
}

action_dapai(dapai) {

    const set_chi_handler = (mianzi) => {

        let map = {};

        const select_handler = (e, m)=>{

            for (let p in map) {
                let selector = `.shoupai.main .bingpai .pai[data-pai="${p}"]`;
                $(selector, this._root)
                    .off('touchstart')
                    .on('touchstart', (e)=>select_handler(e, map[p]))
                    .removeClass('selected');
            }

            let s  = m[0];
            let nn = m.match(/\d(?!\-)/g);
            let pair = ($(e.target).data('pai') == s+nn[0])
                    ? $(`.shoupai.main .bingpai .pai[data-pai="${s+nn[1]}"]`,
                            this._root).eq(0)
                    : $(`.shoupai.main .bingpai .pai[data-pai="${s+nn[0]}"]`,
                            this._root).eq(-1);
            $(e.target).off('touchstart').addClass('selected');
            pair.addClass('selected');
            return false;
        };

        this.clear_handler();

        for (let m of mianzi) {
            let s = m[0];
            for (let n of m.match(/\d(?!\-)/g)) {
                map[s+n] = m;
            }
        }
        for (let p in map) {
            let selector = `.shoupai.main .bingpai .pai[data-pai="${p}"]`;
            $(selector, this._root)
                .on('mouseover touchstart', (e)=>select_handler(e, map[p]))
                .on('click', ()=>this.callback({fulou: map[p]}))
                .addClass('blink');
        }
        return false;
    };

    let show_button = false;

    if (this.allow_hule(dapai)) {
        $('.UI .rong', this._root)
            .on('click', ()=>this.callback({hule: '-'}))
            .removeClass('hide');
        show_button = true;
    }

    let gang_mianzi = this.get_gang_mianzi(dapai);
    if (gang_mianzi.length == 1) {
        $('.UI .gang', this._root)
            .on('click', ()=>this.callback({fulou: gang_mianzi[0]}))
            .removeClass('hide');
        show_button = true;
    }

    let peng_mianzi = this.get_peng_mianzi(dapai);
    if (peng_mianzi.length == 1) {
        $('.UI .peng', this._root)
            .on('click', ()=>this.callback({fulou: peng_mianzi[0]}))
            .removeClass('hide');
        show_button = true;
    }

    let chi_mianzi = this.get_chi_mianzi(dapai);
    if (chi_mianzi.length == 1) {
        $('.UI .chi', this._root)
            .on('click', ()=>this.callback({fulou: chi_mianzi[0]}))
            .removeClass('hide');
        show_button = true;
    }
    else if (chi_mianzi.length > 1) {
        $('.UI .chi', this._root)
            .on('click', ()=>set_chi_handler(chi_mianzi))
            .removeClass('hide');
        show_button = true;
    }

    $('.UI', this._root)
        .width($('.shoupai.main .bingpai', this._root).width())
        .removeClass('hide');

    if (show_button) {
        this._root.on('click', ()=>this.callback());
    }
    else this.callback();
}

action_fulou(fulou) {

    for (let p of this.get_dapai()) {
        let selector = p.substr(-1) == '_'
            ? `.shoupai.main .bingpai .zimo .pai[data-pai="${p.substr(0,2)}"]`
            : `.shoupai.main .bingpai > .pai[data-pai="${p}"]`;
        $(selector, this._root).on('click', e =>{
            $(e.target).addClass('dapai');
            return this.callback({dapai: p});
        });
    }

    $('.UI', this._root)
        .width($('.shoupai.main .bingpai', this._root).width())
        .removeClass('hide');
}

action_gang(gang) {

    let show_button = false;

    if (this.allow_hule(gang, 'qiangang')) {
        $('.UI .rong', this._root)
            .on('click', ()=>this.callback({hule: '-'}))
            .removeClass('hide');
        show_button = true;
    }

    $('.UI', this._root)
        .width($('.shoupai.main .bingpai', this._root).width())
        .removeClass('hide');

    if (show_button) {
        this._root.on('click', ()=>this.callback());
    }
    else this.callback();
}

}
