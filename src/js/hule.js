/*!
 *  電脳麻将: 和了点計算 v2.1.1
 *
 *  Copyright(C) 2017 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/Majiang/blob/master/LICENSE
 */
"use strict";

const { hide, show, fadeIn, fadeOut } = Majiang.UI.Util;

const preset = require('./conf/rule.json');
const view = {};

function init(fragment) {

    if (fragment) {

        let [ paistr, baopai, fubaopai, zimo, zhuangfeng, menfeng,
              lizhi, yifa, haidi, lingshang, qianggang, tianhu, rule ]
                    = fragment.split(/\//);
        baopai   = (baopai   || '').split(/,/);
        fubaopai = (fubaopai || '').split(/,/);
        rule     = decodeURIComponent(rule||'');

        $('input[name="paistr"]').val(paistr);
        for (let i = 0; i < baopai.length; i++) {
            $('input[name="baopai"]').eq(i).val(baopai[i]);
        }
        for (let i = 0; i < fubaopai.length; i++) {
            $('input[name="fubaopai"]').eq(i).val(fubaopai[i]);
        }
        $(`input[name="zimo"][value="${zimo}"]`).click();
        $('select[name="zhuangfeng"]').val(zhuangfeng || 0);
        $('select[name="menfeng"]').val(menfeng || 0);
        $(`input[name="lizhi"][value="${lizhi}"]`).click();
        if (+yifa)      $('input[name="yifa"]').click();
        if (+haidi)     $('input[name="haidi"]').click();
        if (+lingshang) $('input[name="lingshang"]').click();
        if (+qianggang) $('input[name="qianggang"]').click();
        if (+tianhu)    $('input[name="tianhu"]').click();
        if (rule)       $('select[name="rule"]').val(rule);

        $('form').submit();
    }
    else {
        let paistr = 'm123p123z1z1,s1-23,z222=';
        let baopai = ['z1'];

        $('input[name="paistr"]').val(paistr).focus();
        for (let i = 0; i < baopai.length; i++) {
            $('input[name="baopai"]').eq(i).val(baopai[i]);
        }
    }
}

function submit() {

    let paistr = $('input[name="paistr"]').val();
    if (! paistr) {
        return false;
    }
    let shoupai = Majiang.Shoupai.fromString(paistr);
    $('input[name="paistr"]').val(shoupai.toString());

    let rongpai;
    if ($('input[name="zimo"]:checked').val() == 0) {
        if (shoupai._zimo) {
            rongpai = shoupai._zimo + '=';
            shoupai.dapai(shoupai._zimo);
        }
    }

    if (! shoupai.menqian) {
        $('input[name="lizhi"]').prop('checked', false);
        $('input[name="fubaopai"]').parent().addClass('hide');
        $('input[name="yifa"]').prop('checked', false)
                               .prop('disabled', true);
        $('input[name="tianhu"]').prop('checked', false);
    }
    if (! shoupai._fulou
            .find(m=>m.replace(/0/g,'5').match(/^[mpsz](\d)\1\1.*\1.*$/)))
    {
        $('input[name="lingshang"]').prop('checked', false);
    }

    let baopai   = $.makeArray($('input[name="baopai"]'))
                        .map(n => Majiang.Shoupai.valid_pai($(n).val()))
                        .filter(p => p);
    let fubaopai = $.makeArray($('input[name="fubaopai"]'))
                        .map(n => Majiang.Shoupai.valid_pai($(n).val()))
                        .filter(p => p);

    let lizhi = + $('input[name="lizhi"]:checked').val() || 0;

    let rule = $('select[name="rule"]').val();
    rule = ! rule      ? {}
         : rule == '-' ? JSON.parse(localStorage.getItem('Majiang.rule')||'{}')
         :               preset[rule];
    rule = Majiang.rule(rule);

    if (! rule['一発あり']) {
        $('input[name="yifa"]').prop('checked', false);
    }
    if (! rule['カンドラあり']) {
        while (baopai.length > 1) baopai.pop();
        while (fubaopai.length > 1) fubaopai.pop();
    }
    if (! rule['カン裏あり']) {
        while (fubaopai.length > 1) fubaopai.pop();
    }
    if (! rule['裏ドラあり']) {
        fubaopai = null;
    }

    let param = {
        rule:       rule,
        zhuangfeng: + $('select[name="zhuangfeng"]').val(),
        menfeng:    + $('select[name="menfeng"]').val(),
        hupai: {
            lizhi:      lizhi,
            yifa:       $('input[name="yifa"]').prop('checked'),
            qianggang:  $('input[name="qianggang"]').prop('checked'),
            lingshang:  $('input[name="lingshang"]').prop('checked'),
            haidi:      ! $('input[name="haidi"]').prop('checked') ? 0
                            : ! rongpai                            ? 1
                            :                                        2,
            tianhu:     + $('input[name="tianhu"]:checked').val() || 0,
        },
        baopai:     baopai,
        fubaopai:   lizhi ? fubaopai : null,
        jicun:      { changbang: 0, lizhibang: 0 }
    };

    let hule = Majiang.Util.hule(shoupai, rongpai, param) || {};

    const model = {
        player: ['','','',''],
        defen:  [0,0,0,0],
        changbang: param.jicun.changbang,
        lizhibang: param.jicunlizhibang,
        shan: {
            baopai:   param.baopai,
            fubaopai: param.fubaopai,
            paishu:   0
        },
        player_id:  [0,1,2,3],
    };
    const paipu = {
        l:          param.menfeng,
        shoupai:    paistr,
        baojia:     rongpai ? (param.menfeng + 2) % 2 : null,
        fubaopai:   param.fubaopai,
        fu:         hule.fu,
        fanshu:     hule.fanshu,
        damanguan:  hule.damanguan,
        defen:      hule.defen,
        hupai:      hule.hupai,
        fenpei:     hule.fenpei,
    };

    new Majiang.UI.HuleDialog($('.hule-dialog'), view.pai, model).hule(paipu);
    fadeIn($('.hule-dialog'));

    $('input[name="baopai"]').val('');
    for (let i = 0; i < baopai.length; i++) {
        $('input[name="baopai"]').eq(i).val(baopai[i]);
    }
    $('input[name="fubaopai"]').val('');
    if (! fubaopai) fubaopai = [];
    for (let i = 0; i < fubaopai.length; i++) {
        $('input[name="fubaopai"]').eq(i).val(fubaopai[i]);
    }

    let fragment = '#' + [
                    paistr,
                    baopai.join(','),
                    fubaopai.join(','),
                    $('input[name="zimo"]:checked').val(),
                    $('select[name="zhuangfeng"]').val(),
                    $('select[name="menfeng"]').val(),
                    $('input[name="lizhi"]:checked').val(),
                    + $('input[name="yifa"]').prop('checked'),
                    + $('input[name="haidi"]').prop('checked'),
                    + $('input[name="lingshang"]').prop('checked'),
                    + $('input[name="qianggang"]').prop('checked'),
                    + $('input[name="tianhu"]:checked').val() || 0
                ].join('/');
    rule = $('select[name="rule"]').val();
    if (rule) fragment += `/${rule}`;

    if (rule == '-')
            history.replaceState('', '', location.href.replace(/#.*$/,''));
    else    history.replaceState('', '', fragment);

    return false;
}

$(function(){

    view.pai = Majiang.UI.pai('#loaddata');

    for (let key of Object.keys(preset)) {
        $('select[name="rule"]').append($('<option>').val(key).text(key));
    }
    if (localStorage.getItem('Majiang.rule')) {
        $('select[name="rule"]').append($('<option>')
                                .val('-').text('カスタムルール'));
    }

    $('form').on('submit', submit);

    $('form').on('reset', function(){
        hide($('.hule-dialog'));
        $('input[name="fubaopai"]').parent().addClass('hide');
        $('input[name="tianhu"]').next().text('地和');
        $('input[name="tianhu"]').val(2);
        $('form input[name="paistr"]').focus();
    });

    $('input[name="zimo"]').on('change', function(){
        if ($(this, ':checked').val() == 1) {
            $('input[name="qianggang"]').prop('checked', false);
        }
        else {
            $('input[name="lingshang"]').prop('checked', false);
            $('input[name="tianhu"]').prop('checked', false);
        }
    });
    $('select[name="menfeng"]').on('change', function(){
        if ($(this, ':selected').val() == 0) {
            $('input[name="tianhu"]').next().text('天和');
            $('input[name="tianhu"]').val(1);
        }
        else {
            $('input[name="tianhu"]').next().text('地和');
            $('input[name="tianhu"]').val(2);
        }
    });
    $('input[name="lizhi"]').on('change', function(){
        if ($(this).prop('checked')) {
            let val = $(this).val() == 1 ? 2 : 1;
            $(`input[name="lizhi"][value="${val}"]`).prop('checked', false);
            $('input[name="fubaopai"]').parent().removeClass('hide');
            $('input[name="yifa"]').prop('disabled', false);
            $('input[name="tianhu"]').prop('checked', false);
        }
        else {
            $('input[name="fubaopai"]').parent().addClass('hide');
            $('input[name="yifa"]').prop('checked', false)
                                   .prop('disabled', true);
        }
    });
    $('input[name="yifa"]').on('change', function(){
        if ($(this).prop('checked')) {
            $('input[name="lingshang"]').prop('checked', false);
        }
    });
    $('input[name="haidi"]').on('change', function(){
        if ($(this).prop('checked')) {
            $('input[name="lingshang"]').prop('checked', false);
            $('input[name="qianggang"]').prop('checked', false);
            $('input[name="tianhu"]').prop('checked', false);
        }
    });
    $('input[name="lingshang"]').on('change', function(){
        if ($(this).prop('checked')) {
            $('input[name="yifa"]').prop('checked', false);
            $('input[name="haidi"]').prop('checked', false);
            $('input[name="qianggang"]').prop('checked', false);
            $('input[name="tianhu"]').prop('checked', false);
            $('input[name="zimo"][value="1"]').click();
        }
    });
    $('input[name="qianggang"]').on('change', function(){
        if ($(this).prop('checked')) {
            $('input[name="haidi"]').prop('checked', false);
            $('input[name="lingshang"]').prop('checked', false);
            $('input[name="tianhu"]').prop('checked', false);
            $('input[name="zimo"][value="0"]').click();
        }
    });
    $('input[name="tianhu"]').on('change', function(){
        if ($(this).prop('checked')) {
            $('input[name="lizhi"]').prop('checked', false);
            $('input[name="fubaopai"]').parent().addClass('hide');
            $('input[name="yifa"]').prop('checked', false)
                                   .prop('disabled', true);
            $('input[name="haidi"]').prop('checked', false);
            $('input[name="lingshang"]').prop('checked', false);
            $('input[name="qianggang"]').prop('checked', false);
            $('input[name="zimo"][value="1"]').click();
        }
    });

    let fragment = location.hash.replace(/^#/,'');
    init(fragment);
});
