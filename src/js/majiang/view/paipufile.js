/*
 *  Majiang.View.PaipuFile
 */
"use strict";

const $ = require('jquery');
require('jquery-ui/ui/widgets/sortable');

const Paipu = require('./paipu');
const stat  = require('./stat');

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
        if (idx == null) return this._paipu;
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

constructor(node, storage, url, hash) {

    this._node    = node;
    this._storage = storage;
    this._row     = $('.row', node).hide();
    this._max_idx = 0;

    this.storage(! url);

    if (url) {
        this._url = url;
        this.load_paipu(url, hash);
    }

    $('.upload input', node).on('change', (event)=>{
        for (let file of  event.target.files) {
            this.read_paipu(file);
        }
        $(event.target).val(null);
    });

    $('input[name="storage"]').on('change', (event)=>{
        this.storage($(event.target).prop('checked'));
        history.replaceState('', '', location.pathname);
        this._node.hide().fadeIn();
    });

    $('.button .stat', this._node).on('click', ()=>this.open_stat());

    $('.error', node).on('click', (event)=>{
        $(event.target).fadeOut(500, ()=>$(event.target).empty());
    });
}

storage(on) {
    this._paipu = new PaipuStorage(on ? this._storage : null);
    $('input[name="storage"]').prop('checked', on);
    delete this._url;
    this.redraw();
}

read_paipu(file) {

    if (! file.type.match(/^application\/json$/i)
        && ! file.name.match(/\.json$/i))
    {
        this.error(`不正なファイル: ${file.name}`);
        return;
    }
    const reader = new FileReader();
    reader.onload = (event)=>{
        let paipu;
        try {
            paipu = JSON.parse(event.target.result);
        }
        catch(e) {
            this.error(`不正なファイル: ${file.name}`);
            return;
        }
        try {
            this._paipu.add(paipu);
            this.redraw();
        }
        catch(e) {
            this.error('ローカルストレージ容量オーバー');
            return;
        }
    };
    delete this._url;
    reader.readAsText(file);
}

load_paipu(url, hash) {

    const success = data => {
        try {
            this._paipu.add(data);
            this.redraw();
        }
        catch(e) {
            this.error(`不正なファイル: ${decodeURI(url)}`);
        }
        this.open(hash);
    }
    const error = e => {
        this.redraw();
        this.error(`${decodeURI(url)}: ${e.status} ${e.statusText}`);
    }

    if (this._paipu.length()) delete this._url;

    $.ajax({
        url:         url,
        contentType: 'application/json',
        success:     success,
        error:       error
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

    if (this._paipu.length())
            $('.download, .stat', this._node).show();
    else    $('.download, .stat', this._node).hide();

    this.set_handler();

    $('.list', this._node).sortable({
        opacity:     0.7,
        cursor:      'move',
        axis:        'y',
        containment: 'parent',
        tolerance:   'pointer',
        handle:      '.move',
        update:      (event, ui)=>{
            let sort = $.makeArray($(event.target).children().map(
                            (i, row)=>$(row).data('idx')));
            this._paipu.sort(sort);
            delete this._url;
            this.redraw();
        }
    });

    let ua = navigator.userAgent;
    if (ua.match(/\bMobile\b/)) {
        $('.download', this._node).hide();
        $('.move',     this._node).hide();
    }

    $('.file', this._node).removeClass('hide');
    $('.row', this._node).fadeIn();
}

open(hash) {

    if (hash == 'stat') {
        this.open_stat();
    }
    else if (hash) {
        let [fragment, opt] = hash.split(':');

        this.open_viewer(...fragment.split('/').map(x=>(x=='')?0:+x));

        if (opt) {
            if (opt.match(/s/)) this._viewer.shoupai();
            if (opt.match(/h/)) this._viewer.he();
            if (opt.match(/i/)) this._viewer.analyzer();
            for (let x of opt.match(/\+/g)||[]) {
                if (this._viewer._deny_repeat) break;
                this._viewer.next();
            }
        }
    }
}

open_viewer(paipu_idx, viewpoint, log_idx, idx) {

    if (paipu_idx >= this._paipu.length()) return;

    this._viewer = new Paipu($('#game'), this._paipu.get(paipu_idx));
    this._viewer._callback = ()=>{
        history.replaceState('', '', location.href.replace(/#.*$/,''));
        $('body').removeClass('game')
                 .removeClass('analyzer')
                 .addClass('file').hide().fadeIn();
    };
    if (this._url) this._viewer._fragment = '#' + (paipu_idx || '') + '/';
    if (viewpoint == null) this._viewer.kaiju();
    else                   this._viewer.start(viewpoint, log_idx, idx);
    $('body').removeClass('file').addClass('game').hide().fadeIn();
}

open_stat() {
    $('body').removeClass('file').addClass('stat').hide().fadeIn();
    if (this._url) history.replaceState('', '', '#stat');
    stat(this._paipu.get(), ()=>{
        $('body').removeClass('stat').addClass('file').hide().fadeIn();
        history.replaceState('', '', location.href.replace(/#.*$/,''));
    });
}

set_handler() {

    const self = this;

    if (! this._paipu.length()) return;

    let row = $('.row', this._node);
    for (let i = 0; i < this._paipu.length(); i++) {

        $('.replay', row.eq(i)).on('click', i, function(event){
            self.open_viewer(event.data);
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
    $('.file .button .download', this._node)
                .attr('href', URL.createObjectURL(blob))
                .attr('download', `牌譜(${title}).json`);
}

error(msg) {
    let error = $('.error', this._node).append($('<div>').text(msg)).fadeIn();
    setTimeout(()=>error.trigger('click'), 5000);
}

}
