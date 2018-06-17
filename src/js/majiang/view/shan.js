/*
 *  Majiang.View.Shan
 */
"use strict";

const $ = require('jquery');
const Majiang = { View: { pai: require('./pai') } };

module.exports = class Shan {

constructor(root, shan) {

    this._node = {
        baopai:   $('.baopai',   root),
        fubaopai: $('.fubaopai', root),
        paishu:   $('.paishu',   root)
    }
    this._shan = shan;
}

redraw() {

    let baopai = this._shan.baopai();
    this._node.baopai.empty();
    for (let i = 0; i < 5; i++) {
        this._node.baopai.append(
            Majiang.View.pai(i < baopai.length ? baopai[i] : '_'));
    }

    let fubaopai = this._shan.fubaopai();
    this._node.fubaopai.empty();
    for (let i = 0; i < 5; i++) {
        this._node.fubaopai.append(
            Majiang.View.pai(i < fubaopai.length ? fubaopai[i] : '_'));
    }

    this._node.paishu.text(this._shan.paishu());

    return this;
}

update() {
    this._node.paishu.text(this._shan.paishu());
    return this;
}

}
