/*!
 *  電脳麻将: 牌譜ビューア v2.4.4
 *
 *  Copyright(C) 2017 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/Majiang/blob/master/LICENSE
 */
"use strict";

const { hide, show, fadeIn, scale   } = Majiang.UI.Util;

$(function(){

    const tenhou_log = 'https://kobalab.net/majiang/tenhou-log/';

    const pai   = Majiang.UI.pai($('#loaddata'));
    const audio = Majiang.UI.audio($('#loaddata'));

    const rule  = Majiang.rule(
                    JSON.parse(localStorage.getItem('Majiang.rule')||'{}'));

    let file;
    let _viewer;

    const analyzer = (kaiju)=>{
        $('body').addClass('analyzer');
        return new Majiang.UI.Analyzer($('#board > .analyzer'), kaiju, pai,
                                        ()=>$('body').removeClass('analyzer'));
    };
    const viewer = (paipu)=>{
        $('#board .controller').addClass('paipu')
        $('body').attr('class','board');
        scale($('#board'), $('#space'));
        _viewer = new Majiang.UI.Paipu(
                        $('#board'), paipu, pai, audio, 'Majiang.pref',
                        ()=>{ fadeIn($('body').attr('class','file'))
                              _viewer = null },
                        analyzer);
        $('input[name="limited"]', tenhou_dialog)
                            .prop('disabled', false).val([0]);
        return _viewer;
    };
    const stat = (paipu_list)=>{
        fadeIn($('body').attr('class','stat'));
        return new Majiang.UI.PaipuStat($('#stat'), paipu_list,
                        ()=>fadeIn($('body').attr('class','file')));
    };
    const preview = (paipu)=>{
        $('#board .controller').addClass('paipu')
        $('body').attr('class','board');
        scale($('#board'), $('#space'));
        _viewer = new Majiang.UI.Paipu(
                        $('#board'), paipu, pai, audio, 'Majiang.pref',
                        ()=>fadeIn($('body').attr('class','editor')),
                        analyzer);
        $('input[name="limited"]', tenhou_dialog)
                            .prop('disabled', true).val([1]);
        return _viewer;
    };
    const editor = (paipu, save)=>{
        new Majiang.UI.PaipuEditor($('#editor'), paipu, rule, pai,
                        ()=>{ file.storage(true);
                              fadeIn($('body').attr('class','file')) },
                        save, preview);
        fadeIn($('body').attr('class','editor'));
    };

    if (location.search) {
        file = new Majiang.UI.PaipuFile(
                                $('#file'), 'Majiang.paipu',
                                viewer, stat, editor,
                                tenhou_log,
                                location.search.replace(/^\?/,''),
                                location.hash.replace(/^#/,''));
    }
    else {
        file = new Majiang.UI.PaipuFile(
                                $('#file'), 'Majiang.paipu',
                                viewer, stat, editor,
                                tenhou_log);
    }
    file.redraw();

    $(window).on('resize', ()=>scale($('#board'), $('#space')));

    const logconv = require('@kobalab/tenhou-url-log');
    const tenhou_dialog = $('#board .tenhou-dialog');

    function set_data() {
        let type    = $('[name="type"]:checked', tenhou_dialog).val();
        let log_idx = $('[name="limited"]', tenhou_dialog).prop('checked')
                                        ? _viewer._log_idx : null;
        let data = '';
        if (type == 'JSON') {
            data = JSON.stringify(logconv(_viewer._paipu, log_idx));
            $('textarea', tenhou_dialog).attr('class','JSON');
        }
        else {
            for (let i = 0; i < _viewer._paipu.log.length; i++) {
                if (log_idx != null && i != log_idx) continue;
                data += 'https://tenhou.net/6/#json='
                        + encodeURI(JSON.stringify(logconv(_viewer._paipu, i)))
                        + '\n';
            }
            $('textarea', tenhou_dialog).attr('class','URL');
        }
        $('textarea', tenhou_dialog).val(data);
        if (! navigator.clipboard) {
            $('textarea', tenhou_dialog).attr('disabled', false).select();
            show($('[type="button"]', tenhou_dialog));
            hide($('[type="submit"]', tenhou_dialog));
        }
        else {
            show($('[type="button"]', tenhou_dialog));
            show($('[type="submit"]', tenhou_dialog));
        }
    }

    function open_tenhou_dialog() {
        if (_viewer._log_idx < 0) return;
        _viewer.clear_handler();
        show(tenhou_dialog);
        set_data();
    }
    function submit_tenhou_dialog() {
        if (navigator.clipboard) {
            let data = $('textarea', tenhou_dialog).val();
            navigator.clipboard.writeText(data);
        }
        close_tenhou_dialog();
        return false;
    }
    function close_tenhou_dialog() {
        hide(tenhou_dialog);
        _viewer.set_handler();
    }

    $(window).on('keyup', (ev)=>{
        if (! _viewer || ev.key != 't') return;
        open_tenhou_dialog();
    });
    $('form', tenhou_dialog).on('submit', submit_tenhou_dialog);
    $('form [type="button"]', tenhou_dialog).on('click', close_tenhou_dialog);
    $('input', tenhou_dialog).on('change', set_data);
});
