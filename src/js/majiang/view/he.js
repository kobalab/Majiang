/*
 *  Majiang.View.He
 */
"use strict";

const $ = require('jquery');
const Majiang = { View: { pai: require('./pai') } };

module.exports = class He {

constructor(root, he, open) {

    this._node = {
        choma: $('.choma', root),
        dapai: $('div.dapai', root)
    }
    this._he   = he;
    this._open = open;
    this._node.choma.addClass('hide');
}

redraw(open) {

    if (open != null) this._open = open;

    this._node.dapai.empty();
    let lizhi = false;
    let i = 0;
    for (let p of this._he._pai) {
        if (p.match(/\*/)) {
            lizhi = true;
            this._node.choma.removeClass('hide');
        }
        if (p.match(/[\+\=\-]/)) continue;

        let pai = Majiang.View.pai(p);
        if (this._open && p[2] == '_') {
            pai.addClass('mopai');
        }
        if (lizhi) {
            pai = $('<span class="lizhi">').append(pai);
            lizhi = false;
        }
        this._node.dapai.append(pai);

        i++;
        if (i < 18 && i % 6 == 0) {
            this._node.dapai.append($('<span class="break">'));
        }
    }
    return this;
}

dapai(p) {

    let pai = Majiang.View.pai(p).addClass('dapai');
    if (p[2] == '_') pai.addClass('mopai');
    if (p.match(/\*/)) pai = $('<span class="lizhi">').append(pai);
    this._node.dapai.append(pai);
    return this;
}

}
