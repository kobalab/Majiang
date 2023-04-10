/*!
 *  電脳麻将: ルール設定 v2.1.1
 *
 *  Copyright(C) 2017 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/Majiang/blob/master/LICENSE
 */
"use strict";

const preset = require('./conf/rule.json');

function set_form(rule) {

    for (let key of Object.keys(rule)) {

        let value;

        if (key == '順位点') {
            value = rule[key].find(n=>n.match(/\./)) ? 0 : 1;
            $('input[name="順位点四捨五入あり"]').val([value]);
            for (let i = 1; i < 4; i++) {
                $('input[name="順位点"]').eq(i).val(rule[key][i]);
            }
            continue;
        }
        if (key == '赤牌') {
            $('input[name="赤牌"]').eq(0).val(rule[key].m);
            $('input[name="赤牌"]').eq(1).val(rule[key].p);
            $('input[name="赤牌"]').eq(2).val(rule[key].s);
            continue;
        }

        if ($(`input[name="${key}"]`).attr('type') == 'radio' ||
            $(`input[name="${key}"]`).attr('type') == 'checkbox')
        {
            value = rule[key] === false ? [0]
                  : rule[key] === true  ? [1]
                  :                       [rule[key]];
        }
        else {
            value = rule[key];
        }
        $(`input[name="${key}"]`).val(value);
    }

    repair_point();
    repair_gang();
    repair_damanguan();

    Majiang.UI.Util.fadeIn($('form'));
}

function get_form() {

    let rule = Majiang.rule();

    for (let key of Object.keys(rule)) {

        if (key == '順位点') {
            for (let i = 0; i < 4; i++) {
                rule[key][i] = $('input[name="順位点"]').eq(i).val();
            }
            continue;
        }
        if (key == '赤牌') {
            rule[key].m = + $('input[name="赤牌"]').eq(0).val();
            rule[key].p = + $('input[name="赤牌"]').eq(1).val();
            rule[key].s = + $('input[name="赤牌"]').eq(2).val();
            continue;
        }

        if ($(`input[name="${key}"]`).attr('type') == 'radio') {
            rule[key] = + $(`input[name="${key}"]:checked`).val();
            if ($(`input[name="${key}"]`).length == 2) {
                rule[key] = rule[key] != 0;
            }
        }
        else if ($(`input[name="${key}"]`).attr('type') == 'checkbox') {
            rule[key] = $(`input[name="${key}"]`).prop('checked');
        }
        else {
            rule[key] = + $(`input[name="${key}"]`).val();
        }
    }
    return rule;
}

function round_point(p, round) {
    p = isNaN(p) ? '0'
      : + p > 0  ? '+' + (+ p)
      :            ''  + (+ p);
    if (round) p.replace(/\.\d*$/,'');
    else       p = ! p.match(/\./) ? p + '.0' : p;
    return p;
}

function repair_point() {
    let round = $('input[name="順位点四捨五入あり"]').prop('checked');
    let sum = 0;
    for (let i = 1; i < 4; i++) {
        let p = + $('input[name="順位点"]').eq(i).val();
        sum += p;
        $('input[name="順位点"]').eq(i).val(round_point(p, round))
    }
    $('input[name="順位点"]').eq(0).val(round_point(-sum, round))
}

function repair_gang() {
    if (+ $('input[name="裏ドラあり"]:checked').val()
        && + $('input[name="カンドラあり"]:checked').val())
    {
        $('input[name="カン裏あり"]').prop('disabled', false);
    }
    else {
        $('input[name="カン裏あり"]').prop('disabled', true).val([0]);
    }

    if (+ $('input[name="カンドラあり"]:checked').val()) {
        $('input[name="カンドラ後乗せ"]').prop('disabled', false);
    }
    else {
        $('input[name="カンドラ後乗せ"]').prop('disabled', true)
                                        .prop('checked', false);
    }
}

function repair_damanguan() {
    if (+ $('input[name="役満の複合あり"]:checked').val()) {
        $('input[name="ダブル役満あり"]').prop('disabled', false);
    }
    else {
        $('input[name="ダブル役満あり"]').prop('disabled', true).val([0]);
    }
}

$(function(){

    for (let key of Object.keys(preset)) {
        $('select[name="プリセット"]').append($('<option>').val(key).text(key));
    }
    if (localStorage.getItem('Majiang.rule')) {
        $('select[name="プリセット"]').append($('<option>')
                                    .val('-').text('カスタムルール'));
        $('select[name="プリセット"]').val('-');
    }

    let rule = Majiang.rule(
                    JSON.parse(localStorage.getItem('Majiang.rule')||'{}'));
    set_form(rule);

    $('input[name="配給原点"]').on('change', function(){
        let p = $(this).val();
        if (isNaN(p) || p <= 0) $(this).val(Majiang.rule()['配給原点']);
    });
    $('input[name="順位点"]').on('change', repair_point);
    $('input[name="順位点四捨五入あり"]').on('change', repair_point);
    $('input[name="赤牌"]').on('change', function(){
        let n = $(this).val();
        if (isNaN(n) || n < 0 || 4 < n) $(this).val(0);
    });
    $('input[name="裏ドラあり"]').on('change', repair_gang);
    $('input[name="カンドラあり"]').on('change', repair_gang);
    $('input[name="役満の複合あり"]').on('change', repair_damanguan);

    $('input[name="プリセット"]').on('click', ()=>{
        let key = $('select[name="プリセット"]').val();
        set_form(Majiang.rule(key == '-'
                    ? JSON.parse(localStorage.getItem('Majiang.rule')||'{}')
                    : preset[key] || {}));
        return false;
    });

    $('form').on('submit', ()=>{
        if (! localStorage.getItem('Majiang.rule')) {
            $('select[name="プリセット"]').append($('<option>')
                                        .val('-').text('カスタムルール'));
        }
        localStorage.setItem('Majiang.rule', JSON.stringify(get_form()));
        $('select[name="プリセット"]').val('-');
        Majiang.UI.Util.fadeIn($('form'));
        Majiang.UI.Util.fadeIn($('.message'));
        setTimeout(()=>$('.message').trigger('click'), 2000);
        return false;
    });

    $('.message').on('click', function(){
        Majiang.UI.Util.fadeOut($(this));
        return false;
    });
});
