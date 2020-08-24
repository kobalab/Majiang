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
        let shoupai = Majiang.Shoupai.fromString(paistr);
        $('input[name="paistr"]').val(shoupai.toString());

        let rongpai;
        if ($('input[name="zimo"]:checked').val() == 0) {
            if (shoupai._zimo && Majiang.Shoupai.valid_pai(shoupai._zimo))
                    rongpai = shoupai._zimo + '=';
        }

        if (! shoupai.menqian()) {
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
                            .map(p=>$(p).val()).filter(p=>p);
        let fubaopai = $.makeArray($('input[name="fubaopai"]'))
                            .map(p=>$(p).val()).filter(p=>p);

        let lizhi = + $('input[name="lizhi"]:checked').val() || 0;
        let param = {
            zhuangfeng: + $('select[name="zhuangfeng"] option:selected').val(),
            menfeng:    + $('select[name="menfeng"] option:selected').val(),
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

        let hule = Majiang.Util.hule(shoupai, rongpai, param);
        let info = {
            shoupai:  shoupai,
            hule:     hule,
            menfeng:  param.menfeng,
            baopai:   param.baopai,
            fubaopai: param.fubaopai,
        };

        let chang = {
            player:     ['私','下家','対面','上家'],
            qijia:      0,
            zhuangfeng: param.zhuangfeng,
            jushu:      (4 - param.menfeng) % 4,
            changbang:  param.jicun.changbang,
            lizhibang:  param.jicun.lizhibang,
            defen:      [ 25000, 25000, 25000, 25000 ]
        };

        new Majiang.View.HuleDialog($('.huledialog'), chang).hule(info);

        let fragment = '#' + [
                        shoupai.toString(),
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
        history.replaceState('', '', fragment);

        return false;
    });
    $('form').on('reset', function(){
        $('input[name="fubaopai"]').parent().addClass('hide');
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

    $('input[name="lizhi"]').on('change', function(){
        if ($(this).prop('checked')) {
            let tggle = $(this).val() == 1 ? 2 : 1;
            $(`input[name="lizhi"][value="${tggle}"]`).prop('checked', false);
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
        if ($(this).prop('checked'))
            $('input[name="lingshang"]').prop('checked', false);
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
    if (fragment) {

        let [paistr, baopai, fubaopai, zimo, zhuangfeng, menfeng,
             lizhi, yifa, haidi, lingshang, qianggang, tianhu]
                = fragment.split(/\//);
        baopai   = (baopai   || '').split(/,/);
        fubaopai = (fubaopai || '').split(/,/);

        $('form input[name="paistr"]').val(paistr);
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

        $('form').submit();
    }
    else {
        $('form input[name="paistr"]').focus();
        $('form input[name="paistr"]').val('m123p123z1z1,s1-23,z222=');
        $('form input[name="baopai"]').eq(0).val('z1');
    }
});
