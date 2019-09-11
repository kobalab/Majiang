/*
 *  Majiang.View.Analyzer
 */
"use strict";

const $ = require('jquery');
const Majiang = require('../../majiang');
Majiang.View = {
    pai: require('./pai'),
};

let _dapai;

module.exports = class Analyzer extends Majiang.Player {

constructor(id, root) {
    super(id);
    this._root = root;
    if (! _dapai) {
        _dapai = $('.dapai .row', root);
    }
    $('.dapai', root).empty();
}

id(id) { this._id = id }

next(data) {
    $('.dapai', this._root).empty();
    super.action(data);
}

action(data) {
    if (data.qipai || data.zimo || data.gangzimo || data.fulou
        || data.hule || data.pingju)
    {
        $('.dapai', this._root).empty();
    }
    const callback = data.dapai || data.gang
                        ? x => { if (x) console.log(x) }
                        : x => {};
    super.action(data, callback);
}

dapai(dapai) {
    if (dapai.l == this._model.menfeng) {
        this.update_dapai(dapai.p.substr(0,2));
    }
    super.dapai(dapai);
}

gang(gang) {
    if (gang.l == this._model.menfeng) {
        this.update_dapai(gang.m);
    }
    super.gang(gang);
}

action_zimo(zimo, option) {
    let info  = [];
    let gang  = this.select_gang(info);
    let dapai = this.select_dapai(info);
    if (gang) {
        for (let i of info) {
            if (i.m == gang) {
                i.selected = true;
            }
        }
    }
    else if (dapai) {
        let p = dapai.substr(0,2);
        for (let i of info) {
            if (i.p == p && ! i.m) {
                i.selected = true;
            }
        }
    }
    this.redraw_dapai(info);
}

action_fulou(fulou) {
    let info  = [];
    let dapai = this.select_dapai(info);
    let p = dapai.substr(0,2);
    for (let i of info) {
        if (i.p == p && ! i.m) {
            i.selected = true;
        }
    }
    this.redraw_dapai(info);
}

redraw_dapai(info) {

    $('.dapai', this._root).empty();
    for (let i of info.sort((a,b) => a.selected ? -1
                                   : b.selected ?  1
                                   : b.ev - a.ev))
    {
        let row = _dapai.clone();
        row.attr('data-dapai', i.m || i.p);
        $('.p', row).append(Majiang.View.pai(i.p));
        if (i.m) $('.p', row).append($('<span>').text('カン'));
        $('.xiangting', row).text(
                    i.n_xiangting == 0 ? '聴牌' : `${i.n_xiangting}向聴`);
        if (i.n_xiangting < 3) {
            let ev = Math.floor(i.ev * 100);
            ev = ev < 100 ? ('00' + ev).substr(-3) : '' + ev;
            ev = ev.replace(/(\d{2})$/, '.$1');
            $('.eval', row).text(ev);
        }
        else {
            let ev = i.n_tingpai
                   + (i.ev > i.n_tingpai ? `(+${i.ev - i.n_tingpai})` : '')
                   + '枚';
            $('.eval', row).text(ev);
        }
        for (let p of i.tingpai) {
            $('.tingpai', row).append(Majiang.View.pai(p));
        }
        if (i.n_xiangting < 3) {
            $('.tingpai', row).append($('<span>').text(`(${i.n_tingpai}枚)`));
        }
        $('.dapai', this._root).append(row);
    }
}

update_dapai(dapai) {
    $(`.dapai tr[data-dapai="${dapai}"]`).addClass('selected');
}

}
