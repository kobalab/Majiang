/*
 *  Majiang.View.PaipuFile
 */
"use strict";

const $ = require('jquery');
require('jquery-ui/ui/widgets/sortable');

const Paipu = require('./paipu');

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
        try {
            if (this._storage)
                localStorage.setItem(this._storage, this.stringify());

        }
        catch(e) {
            this._paipu = fix_paipu(JSON.parse(
                                localStorage.getItem(this._storage) || '[]'));
            throw e;
        }
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
            if (! file.type.match(/^application\/json$/i)
                && ! file.name.match(/\.json$/i))
            {
                self.error(`不正なファイル: ${file.name}`);
                continue;
            }
            let reader = new FileReader();
            reader.onload = function(event){
                let paipu;
                try {
                    paipu = JSON.parse(event.target.result);
                }
                catch(e) {
                    self.error(`不正なファイル: ${file.name}`);
                    return;
                }
                try {
                    self._paipu.add(paipu);
                    delete self._url;
                }
                catch(e) {
                    self.error('ローカルストレージ容量オーバー');
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

    this.redraw();
}

load_paipu(url, fragment) {

    const success = data => {
        try {
            this._paipu.add(data);
            this._url = url;
            this.redraw();
        }
        catch(e) {
            this.error(`不正なファイル: ${decodeURI(url)}`);
        }
        if (fragment) {
            this.open_player(...fragment.split('/').map(x=>(x=='')?0:x));
        }
    }
    const error = e => {
        console.log(e);
        this.redraw();
        this.error(`${decodeURI(url)}: ${e.status} ${e.statusText}`);
    }

    $.ajax({
        url:         url,
        contentType: 'application/json',
        success:     success,
        error:       error
    });
}

redraw() {

    this._node.removeClass('hide');
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
            delete self._url;
            self.redraw();
        }
    });

    let ua = navigator.userAgent;
    if (ua.match(/\bMobile\b/)) {
        $('.download', this._node).hide();
        $('.move',     this._node).hide();
    }
    if (ua.match(/\bMSIE\b/) || ua.match(/\bTrident\b/)) {
        $('.download', this._node).hide();
    }

    $('.row', this._node).fadeIn();

    return this;
}

open_player(paipu_idx, viewpoint, log_idx, idx) {

    if (paipu_idx >= this._paipu.length()) return this;

    this._viewer = new Paipu($('#game'), this._paipu.get(paipu_idx));
    this._viewer._callback = ()=>{
        history.replaceState('', '', location.href.replace(/#.*$/,''));
        $('body').removeClass('game').addClass('file').hide().fadeIn();
    };
    if (this._url) this._viewer._fragment = '#' + (paipu_idx || '') + '/';
    if (viewpoint == null) this._viewer.kaiju();
    else                   this._viewer.start(viewpoint, log_idx, idx);
    $('body').removeClass('file').addClass('game').hide().fadeIn();

    return this;
}

set_handler() {

    const self = this;

    if (! this._paipu.length()) return;

    let row = $('.row', this._node);
    for (let i = 0; i < this._paipu.length(); i++) {

        $('.replay', row.eq(i)).on('click', i, function(event){
            self.open_player(event.data);
        });

        $('.delete', row.eq(i)).on('click', i, function(event){
            self._paipu.del(event.data);
            delete self._url;
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
    $('> .button .download', this._node)
                .attr('href', URL.createObjectURL(blob))
                .attr('download', `牌譜(${title}).json`);
}

error(msg) {
    let error = $('.error', this._node).append($('<div></div>').text(msg))
                                       .fadeIn();
    setTimeout(()=>error.click(), 5000);
}

}
