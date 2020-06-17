/*!
 *
 *  hule.js
 *
 *  Copyright(C) 2017 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/Majiang/blob/master/LICENSE
 */
"use strict";

$(function(){

    $('.version').text('ver. ' + Majiang.VERSION);

    $('form').on('submit', function(){

        let paistr = $('form input[name="paistr"]').val();
        if (! paistr) {
            $('.huledialog').addClass('hide').addClass('fadeout');
            return false;
        }
        let shoupai = new Majiang.Shoupai.fromString(paistr);
        $('input[name="paistr"]').val(shoupai.toString());

        let rongpai;
        if ($('input[name="zimo"]:checked').val() == 0) {
            if (shoupai._zimo && Majiang.Shoupai.valid_pai(shoupai._zimo))
                    rongpai = shoupai._zimo + '=';
        }

        if (! shoupai.menqian()) {
        }
        if (! shoupai._fulou.find(m=>m.match(/^[mpsz](\d)\1\1.*\1.*$/))) {
            $('input[name="lingshang"]').prop('checked', false);
        }

        let param = {
            zhuangfeng: + $('select[name="zhuangfeng"] option:selected').val(),
            menfeng:    + $('select[name="menfeng"] option:selected').val(),
            hupai: {
                qianggang:  $('input[name="qianggang"]').prop('checked'),
                lingshang:  $('input[name="lingshang"]').prop('checked'),
                haidi:      ! $('input[name="haidi"]').prop('checked') ? 0
                                : ! rongpai                            ? 1
                                :                                        2,
            },
        };

        let hule = Majiang.Util.hule(shoupai, rongpai, param);
        let info = {
            shoupai:  shoupai,
            hule:     hule,
            menfeng:  param.menfeng,
        };

        let chang = {
            player:     ['私','下家','対面','上家'],
            qijia:      0,
            zhuangfeng: param.zhuangfeng,
            jishu:      (4 - param.menfeng) % 4,
            defen:      [ 25000, 25000, 25000, 25000 ]
        };

        new Majiang.View.HuleDialog($('.huledialog'), chang).hule(info);

        let fragment = '#' + [
                        shoupai.toString(),
                        $('input[name="zimo"]:checked').val(),
                        $('select[name="zhuangfeng"]').val(),
                        $('select[name="menfeng"]').val(),
                        + $('input[name="haidi"]').prop('checked'),
                        + $('input[name="lingshang"]').prop('checked'),
                        + $('input[name="qianggang"]').prop('checked'),
                     ].join('/');
        history.replaceState('', '', fragment);

        return false;
    });
    $('form').on('reset', function(){
        $('form input[name="paistr"]').focus();
        $('.huledialog').addClass('hide').addClass('fadeout');
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

    $('input[name="haidi"]').on('change', function(){
        if ($(this).prop('checked')) {
            $('input[name="lingshang"]').prop('checked', false);
            $('input[name="qianggang"]').prop('checked', false);
            $('input[name="tianhu"]').prop('checked', false);
        }
    });
    $('input[name="lingshang"]').on('change', function(){
        if ($(this).prop('checked')) {
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

    let fragment = location.hash.replace(/^#/,'');
    if (fragment) {

        let [paistr, zimo, zhuangfeng, menfeng,
             haidi, lingshang, qianggang]
                = fragment.split(/\//);

        $('form input[name="paistr"]').val(paistr);
        $(`input[name="zimo"][value="${zimo}"]`).click();
        $('select[name="zhuangfeng"]').val(zhuangfeng || 0);
        $('select[name="menfeng"]').val(menfeng || 0);
        if (+haidi)     $('input[name="haidi"]').click();
        if (+lingshang) $('input[name="lingshang"]').click();
        if (+qianggang) $('input[name="qianggang"]').click();

        $('form').submit();
    }
    else {
        $('form input[name="paistr"]').focus();
        $('form input[name="paistr"]').val('m123p123z1z1,s1-23,z222=');
    }
});
