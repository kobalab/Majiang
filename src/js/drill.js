/*!
 *  電脳麻将: 点数計算ドリル v2.3.7
 *
 *  Copyright(C) 2017 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/Majiang/blob/master/LICENSE
 */
"use strict";

const { hide, show, fadeIn, fadeOut } = Majiang.UI.Util;

const preset = require('./conf/rule.json');
const view = {};

const feng_hanzi = ['東','南','西','北'];

let player, next_exam, miss_exams, stat;

class Player extends Majiang.AI {
    select_lizhi(p) {
        return this.allow_lizhi(this.shoupai, p) && Math.random() < 0.3;
    }
}

function init_player() {

    let player = new Player();

    let rule = $('select[name="rule"]').val();
    rule = ! rule      ? {}
         : rule == '-' ? JSON.parse(localStorage.getItem('Majiang.rule')||'{}')
         :               preset[rule];
    rule = Majiang.rule(rule);

    player.kaiju({ id: 0, qijia: 0, title: '', player: [], rule: rule });

    return player;
}

function make_exam(player) {
    for (;;) {
        let zhuangfeng = (Math.random()*2)|0;
        let menfeng    = (Math.random()*4)|0;
        let shoupai    = [ '', '', '', '' ];
        let shan = new Majiang.Shan(player._rule);
        let qipai = [];
        for (let i = 0; i < 13; i++) qipai.push(shan.zimo());
        shoupai[menfeng] = (new Majiang.Shoupai(qipai)).toString();
        player.qipai({
            zhuangfeng: zhuangfeng,
            jushu:      [0,3,2,1][menfeng],
            changbang:  0,
            lizhibang:  0,
            defen:      [ 25000, 25000, 25000, 25000 ],
            baopai:     shan.baopai[0],
            shoupai:    shoupai
        });
        player.shan.paishu = shan.paishu + 4;
        let gang = null, lunban = 0;
        while (shan.paishu) {
            let p;
            if (gang) {
                p = shan.gangzimo();
                if (shan._weikaigang) shan.kaigang();
                gang = null;
            }
            else {
                p = shan.zimo();
            }
            let msg = { l: lunban, p: p };
            if (lunban == menfeng) {
                player.zimo(msg);
                if (player.select_hule()) {
                    shan.close();
                    return {
                        shoupai:    player.shoupai,
                        zhuangfeng: zhuangfeng,
                        menfeng:    menfeng,
                        baopai:     shan.baopai,
                        fubaopai:   player.shoupai.lizhi && shan.fubaopai
                    };
                }
                let m = player.select_gang();
                if (m)  {
                    player.gang({ l: menfeng, m: m});
                    gang = m;
                    continue;
                }
                player.dapai({ l: menfeng, p: player.select_dapai()});
            }
            else {
                player.zimo(msg);
                player.dapai(msg);
                player._neng_rong = true;
                if (player.select_hule(msg)) {
                    shan.close();
                    let rongpai
                            = p + ['','+','=','-'][(4 + lunban - menfeng) % 4];
                    return {
                        shoupai:    player.shoupai,
                        rongpai:    rongpai,
                        zhuangfeng: zhuangfeng,
                        menfeng:    menfeng,
                        baopai:     shan.baopai,
                        fubaopai:   player.shoupai.lizhi && shan.fubaopai
                    };
                }
                let m = player.select_fulou(msg);
                if (m) {
                    player.fulou({ l: menfeng, m: m });
                    if (m.match(/^[mpsz]\d{4}/)) {
                        gang = m;
                        continue;
                    }
                    player.dapai({ l: menfeng, p: player.select_dapai()});
                }
            }
            lunban = (lunban + 1) % 4;
        }
    }
}

function parse_fragment(hash) {
    let [ paistr, baopai, fubaopai, zimo, zhuangfeng, menfeng, lizhi ]
            = hash.split('/');
    let shoupai = Majiang.Shoupai.fromString(paistr);
    let rongpai;
    if (zimo != '1' && shoupai._zimo) {
        rongpai = shoupai._zimo + '=';
        shoupai.dapai(shoupai._zimo);
    }
    if (lizhi == '1') {
        shoupai._lizhi = true;
    }
    baopai      = baopai ? baopai.split(',') : [];
    fubaopai    = fubaopai ? fubaopai.split(',')
                : shoupai.lizhi ? [] : null;
    zhuangfeng  = +(zhuangfeng || 0);
    menfeng     = +(menfeng || 0);
    return {
        shoupai:    shoupai,
        rongpai:    rongpai,
        zhuangfeng: zhuangfeng,
        menfeng:    menfeng,
        baopai:     baopai,
        fubaopai:   fubaopai
    };
}

function show_exam(exam) {

    let hule = Majiang.Util.hule(
                    exam.shoupai,
                    exam.rongpai,
                    Majiang.Util.hule_param({
                        rule:       player._rule,
                        zhuangfeng: exam.zhuangfeng,
                        menfeng:    exam.menfeng,
                        baopai:     exam.baopai,
                        fubaopai:   exam.fubaopai,
                        lizhi:      exam.shoupai.lizhi
                    }));

    $('.zhuangfeng').text(feng_hanzi[exam.zhuangfeng]);
    $('.menfeng').text(feng_hanzi[exam.menfeng]);

    if (exam.shoupai.lizhi) show($('.lizhi'));
    else                    hide($('.lizhi'));

    let shan = {
        baopai:   exam.baopai,
        fubaopai: exam.fubaopai,
        paishu:   0
    };
    if (exam.fubaopai) show($('.shan.fubaopai'));
    else               hide($('.shan.fubaopai'));
    view.baopai = new Majiang.UI.Shan($('.shan'), view.pai, shan).redraw(true);

    let shoupai = exam.shoupai.clone();
    if (exam.rongpai) shoupai.zimo(exam.rongpai);

    view.shoupai = new Majiang.UI.Shoupai(
                            $('.shoupai'), view.pai, shoupai
                        ).redraw(true);
    if (exam.rongpai) $('.shoupai .zimo').prepend('<span>ロン</span>');
    else              $('.shoupai .zimo').append('<span>ツモ</span>');

    let defen;
    if (hule && hule.defen) {
        defen = (exam.rongpai ? 'ロン: ' : 'ツモ: ')
              + (exam.rongpai ? hule.defen
                    : exam.menfeng
                        ? (Math.ceil(hule.defen / 200) * 100 / 2)
                            + ' / ' + (Math.floor(hule.defen / 200) * 100)
                        : `${hule.defen / 3}オール`)
              + (hule.damanguan
                  ? (hule.damanguan > 1
                        ? ` (役満 ×${hule.damanguan})`
                        : ' (役満)')
                  : ` (${hule.fu}符 ${hule.fanshu}翻)`);
    }
    else {
        defen = '(役なし)';
    }
    $('.defen').text(defen);

    let hupai = '';
    if (hule && hule.hupai)
        hupai = hule.hupai.map(h =>
                    h.name.match(/^(赤|裏)?ドラ$/)
                        ? `${h.name} ×${h.fanshu}` : h.name
                ).join(' / ');
    $('.hupai').text(hupai);

    stat.total++;

    hide($('.answer'));
    show($('.button'));

    $('.answer button.miss').off('click').on('click', ()=>{
        miss_exams.push(exam);
        next();
    });

    show($('.exam'));
    hide($('.break'));
    show($('.drill'));

    next_exam = null;
    setTimeout(()=>{
        next_exam = miss_exams.splice(Math.random() * 5, 1)[0]
                        || make_exam(player);
    }, 10);
}

function next() {
    hide($('.drill'));
    $('.stat').text(
        `回答数: ${stat.total}、`
        + `正答率: ${(stat.right / stat.total * 100)|0}%`);
    if (stat.total % 10 == 0) take_break();
    else                      show_exam(next_exam || make_exam(player));
}

function take_break() {
    hide($('.exam'));
    show($('.break'));
    show($('.drill'));
}

function restart() {

    hide($('.drill'));
    $('.stat').text('');

    next_exam = null;
    miss_exams = [];
    player = init_player();
    stat = { total:  0, right:  0 };

    if (location.hash)
            show_exam(parse_fragment(location.hash.replace(/^#/,'')));
    else    show_exam(make_exam(player));
}

$(function(){

    view.pai = Majiang.UI.pai('#loaddata');

    for (let key of Object.keys(preset)) {
        $('select[name="rule"]').append($('<option>').val(key).text(key));
    }
    if (localStorage.getItem('Majiang.rule')) {
        $('select[name="rule"]').append($('<option>')
                                .val('-').text('カスタムルール')
                                .attr('selected',true));
    }

    $('select[name="rule"]').on('change', restart);

    $('.button button').on('click', ()=>{
        show($('.answer'));
        hide($('.button'));
    });
    $('.answer button.right').on('click', ()=>{
        stat.right++;
        next();
    });
    $('.break button').on('click', ()=>{
        show_exam(next_exam || make_exam(player));
    });

    restart();
});
