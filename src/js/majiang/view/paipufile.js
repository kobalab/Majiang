/*
 *  Majiang.View.PaipuFile
 */
"use strict";

const $ = require('jquery');
require('jquery-ui/ui/widgets/sortable');

function fix_paipu(paipu) {

    const format = {};
    for (let key of ['title','player','qijia','log','defen','rank','point']) {
        format[key] = true;
    }

    for (let p of [].concat(paipu)) {
        for (let key in format) {
            if (p[key] == undefined) throw new Error(`${key}: ${p[key]}`);
        }
        for (let key in p) {
            if (! format[key]) delete p[key];
        }
    }
    return paipu;
}

class PaipuStorage {

    constructor(storage) {
        this._paipu = [];
        try {
            if (storage && localStorage) {
                this._paipu = fix_paipu(JSON.parse(
                                        localStorage.getItem(storage) || '[]'));
                this._storage = storage;
            }
        }
        catch(e) {
            console.log(e);
        }
    }

    length() {
        return this._paipu.length;
    }

    stringify(idx) {
        return JSON.stringify(idx == null ? this._paipu : this._paipu[idx]);
    }

    save() {
        if (this._storage)
            localStorage.setItem(this._storage, this.stringify());
    }

    add(paipu) {
        this._paipu = this._paipu.concat(fix_paipu(paipu));
        this.save();
    }

    del(idx) {
        this._paipu.splice(idx, 1);
        this.save();
    }

    get(idx) {
        return this._paipu[idx];
    }

    sort(sort) {
        let tmp = this._paipu.concat();
        for (let i = 0; i < this.length(); i++) {
            this._paipu[i] = tmp[sort[i]];
        }
        this.save();
    }
}

module.exports = class PaipuFile {

constructor(node, storage) {

    this._node    = node;
    this._paipu   = new PaipuStorage(storage);
    this._row     = $('.row', node);
    this._max_idx = 0;

    const self = this;

    $('.upload input', node).on('change', function(){
        for (let file of  this.files) {
            if (! file.type.match(/^application\/json$/i)) {
                self.error(`不正なファイル: ${file.name}`);
                continue;
            }
            let reader = new FileReader();
            reader.onload = function(event){
                try {
                    self._paipu.add(JSON.parse(event.target.result));
                }
                catch(e) {
                    self.error(`不正なファイル: ${file.name}`);
                    return;
                }
                self.redraw();
            };
            reader.readAsText(file);
        }
        $(this).val(null);
    });

    $('.error', node).on('click', function(){
        $(this).fadeOut(500, ()=>$(this).empty());
    });
}

redraw() {

    let list = $('.list', this._node).empty();
    for (let i = 0; i < this._paipu.length(); i++) {
        let paipu  = this._paipu.get(i);
        let player = [];
        for (let l = 0; l < 4; l++) {
            let point = (paipu.point[l] > 0 ? '+' : '') + paipu.point[l];
            player[paipu.rank[l] - 1] = `${paipu.player[l]}(${point})`;
        }

        let row = this._row.clone();
        row.attr('data-idx', i);
        $('.title', row).text(paipu.title);
        $('.player', row).text(player.join(' '));
        list.append(row.hide());
        if (i < this._max_idx) row.show();
    }
    this._max_idx = this._paipu.length();

    if (this._paipu.length()) $('.download', this._node).show();
    else                      $('.download', this._node).hide();

    this.set_handler();

    const self = this;
    $('.list', this._node).sortable({
        opacity:     0.7,
        cursor:      'move',
        axis:        'y',
        containment: 'parent',
        tolerance:   'pointer',
        handle:      '.move',
        update:      function(event, ui){
            let sort = $.makeArray($(this).children().map(
                            function(){return $(this).data('idx')}));
            self._paipu.sort(sort);
            self.redraw();
        }
    });

    $('.row', this._node).fadeIn();
}

set_handler() {

    const self = this;

    if (! this._paipu.length()) return;

    let row = $('.row', this._node);
    for (let i = 0; i < this._paipu.length(); i++) {

        $('.delete', row.eq(i)).on('click', i, function(event){
            self._paipu.del(event.data);
            row.eq(event.data).slideUp(200, ()=>self.redraw());
        });

        let title = this._paipu.get(i).title.replace(/[\ \\\/\:\n]/g, '_');
        let blob  = new Blob([ this._paipu.stringify(i) ],
                             { type: 'application/json' });
        $('.download', row.eq(i))
                    .attr('href', URL.createObjectURL(blob))
                    .attr('download', `牌譜(${title}).json`);
    }

    let title = this._paipu.get(0).title.replace(/[\ \\\/\:\n]/g, '_');
    let blob  = new Blob([ this._paipu.stringify() ],
                         { type: 'application/json' });
    $('.file > .button .download', this._node)
                .attr('href', URL.createObjectURL(blob))
                .attr('download', `牌譜(${title}).json`);
}

error(msg) {
    let error = $('.error', this._node).append($('<div></div>').text(msg))
                                       .fadeIn();
    setTimeout(()=>error.click(), 5000);
}

}
