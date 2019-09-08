/*
 *  Majiang.View.Analyzer
 */
"use strict";

const $ = require('jquery');
const Majiang = require('../../majiang');

module.exports = class Analyzer extends Majiang.Player {

id(id) { this._id = id }

next(data) { super.action(data) }

action(data) {
    const callback = data.zimo || data.gangzimo || data.fulou
                               ||data.dapai     || data.gang
                        ? x => { if (x) console.log(x) }
                        : x => {};
    super.action(data, callback);
}

}
