/*
 *  Majiang.View.PaipuStat
 */
"use strict";

const $ = require('jquery');

function make_stat(paipu_all) {
    let title = paipu_all[0].title.replace(/\n.*$/,'');
    let player = {};
    for (let paipu of paipu_all) {
        if (paipu.title.replace(/\n.*$/,'') != title) title = '';
        for (let id = 0; id < 4; id++) {
            let name = paipu.player[id].replace(/\n.*$/,'');
            player[name] = player_stat(player[name], paipu, id);
        }
    }
    return { title: title, player: player };
}

function player_stat(stat, paipu, id) {
    if (! stat) {
        stat = {
            n_game:     0,
            n_rank:     [0,0,0,0],
            sum_point:  0,
            n_ju:       0,
            n_hule:     0,
            n_baojia:   0,
            n_lizhi:    0,
            n_fulou:    0,
            sum_defen:  0,
        }
    }
    for (let log of paipu.log) {
        stat.n_ju++;
        let l = (8 + id  - paipu.qijia - log[0].qipai.jushu) % 4;
        let data;
        if (data = log.find(data=>data.hule && data.hule.l == l)) {
            stat.n_hule++;
            stat.sum_defen += + data.hule.defen;
        }
        if (data = log.find(data=>data.hule && data.hule.baojia == l)) {
            stat.n_baojia++;
        }
        if (data = log.find(data=>data.dapai && data.dapai.l == l
                                    && data.dapai.p.substr(-1) == '*'))
        {
            stat.n_lizhi++;
        }
        if (data = log.find(data=>data.fulou && data.fulou.l == l)) {
            stat.n_fulou++;
        }
    }
    stat.n_game++;
    stat.n_rank[paipu.rank[id] - 1]++;
    stat.sum_point += + paipu.point[id];
    return stat;
}

function make_table(hash) {
    let table = [];
    let max_game = 0;
    for (let name of sort(hash)) {
        let r = hash[name];
        if (r.n_game > max_game) max_game = r.n_game;
        table.push([
            name,
            r.n_game,
            nfmt(r.sum_point, 1, 2),

            nfmt((r.n_rank[0] + r.n_rank[1] * 2 + r.n_rank[2] * 3
                        + r.n_rank[3] * 4)   / r.n_game, 2),
            nfmt(r.n_rank[0]                 / r.n_game, 3, 1),
            nfmt((r.n_rank[0] + r.n_rank[1]) / r.n_game, 3, 1),
            nfmt(r.n_rank[3]                 / r.n_game, 3, 1),

            nfmt(r.n_hule   / r.n_ju, 3, 1),
            nfmt(r.n_baojia / r.n_ju, 3, 1),
            nfmt(r.n_lizhi  / r.n_ju, 3, 1),
            nfmt(r.n_fulou  / r.n_ju, 3, 1),

            nfmt(r.n_hule ? r.sum_defen / r.n_hule : 0, 0),
        ]);
    }
    return table.filter(r=>r[1] >= max_game / 5);
}

function sort(hash) {
    return Object.keys(hash).sort((a,b)=>
        hash[b].n_game - hash[a].n_game
                || hash[b].sum_point - hash[a].sum_point
    );
}

function nfmt(n, r, f) {
    let s = n.toFixed(r+1).replace(/\d$/,'').replace(/\.$/,'');
    return   f == 1          ? s.replace(/^0\./,'.')
           : f == 2 && n > 0 ? '+' + s
           :                   s;
}

let _tr;

module.exports = class PaipuStat {

constructor(node, paipu_all, callback) {

    if (! _tr) _tr = $('tbody tr', node)

    this._node = node;
    this._tr   = _tr;

    $('tbody', this._node).empty();

    let { title, player } = make_stat(paipu_all);
    this._table = make_table(player);

    $('.title', this._node).text(title);
    $('.file', this._node).on('click', callback);
}

show() {
    const tbody = $('tbody', this._node);
    tbody.empty();
    for (let stat of this._table) {
        let tr = this._tr.clone();
        for (let i = 0; i < stat.length; i++) {
            $('td', tr).eq(i).text(stat[i]);
        }
        tbody.append(tr);
    }
    $(window).scrollTop(0)
    $('.stat', this._node).scrollLeft(0);
}

}
