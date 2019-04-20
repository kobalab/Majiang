/*
 * Majiang.View.Player
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
    this._show_button = false;
}

callback(reply) {
    this.clear_handler();
    this._callback(reply);
    return false;
}

wait() {
    this.set_cansel();
}

set_cansel(reply) {
    this._root.on('click', ()=>this.callback(reply));
}

set_button(type, handler) {
    $(`.UI .${type}`, this._root).on('click', handler).removeClass('hide');
    this._show_button = true;
}

show_button() {
    $('.UI', this._root)
        .width($('.shoupai.main .bingpai', this._root).width())
        .removeClass('hide');
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

    if (this.allow_hule(null, option)) {
        this.set_button('zimo', ()=>this.callback({hule: '-'}));
    }

    if (this.allow_pingju()) {
        this.set_button('pingju', ()=>this.callback({pingju: '-'}));
    }

    let gang_mianzi = this.get_gang_mianzi();
    if (gang_mianzi.length == 1) {
        this.set_button('gang', ()=>this.callback({gang: gang_mianzi[0]}));
    }
    else if (gang_mianzi.length > 1) {
        this.set_button('gang', ()=>set_gang_handler(gang_mianzi));
    }

    if (this._shoupai.lizhi()) {
        if (this._show_button) this.set_cansel({dapai: zimo.p+'_'});
        else            return this.callback({dapai: zimo.p+'_'});
    }

    let dapai = this.allow_lizhi();
    if (dapai.length > 0) {
        this.set_button('lizhi', ()=>set_lizhi_handler(dapai));
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

    this.show_button();
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

    if (this.allow_hule(dapai)) {
        this.set_button('rong', ()=>this.callback({hule: '-'}));
    }

    let gang_mianzi = this.get_gang_mianzi(dapai);
    if (gang_mianzi.length == 1) {
        this.set_button('gang', ()=>this.callback({fulou: gang_mianzi[0]}));
    }

    let peng_mianzi = this.get_peng_mianzi(dapai);
    if (peng_mianzi.length == 1) {
        this.set_button('peng', ()=>this.callback({fulou: peng_mianzi[0]}));
    }

    let chi_mianzi = this.get_chi_mianzi(dapai);
    if (chi_mianzi.length == 1) {
        this.set_button('chi', ()=>this.callback({fulou: chi_mianzi[0]}));
    }
    else if (chi_mianzi.length > 1) {
        this.set_button('chi', ()=>set_chi_handler(chi_mianzi));
    }

    this.show_button();

    if (this._show_button) this.set_cansel();
    else            return this.callback();
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
}

action_gang(gang) {

    if (this.allow_hule(gang, 'qiangang')) {
        this.set_button('rong', ()=>this.callback({hule: '-'}));
    }

    this.show_button();

    if (this._show_button) this.set_cansel();
    else            return this.callback();
}

}
