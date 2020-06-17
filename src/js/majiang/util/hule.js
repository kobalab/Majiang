/*
 *  Majiang.Util.hule
 */
"use strict";

const Majiang = { Shan: require('../shan') };

/**
 * @param {string} s 数牌花色。m, p, s
 * @param {array} bingpai 花色s的兵牌
 * @param {number} n 开始数字
 *
 * @return {array{array}} 所有可能的面子组合
 *
 * @example mianzi('m', [0, 3, 4, 4, 1, 0, 0, 0, 0, 0]) -> [["m123", "m123", "m123", "m234"], ["m111", "m234", "m222", "m333"], ["m111", "m222", "m234", "m333"]]
 **/
function mianzi(s, bingpai, n = 1) {

    if (n > 9) return [[]];

    if (bingpai[n] == 0) return mianzi(s, bingpai, n+1);

    let shunzi = [];
    if (n <= 7 && bingpai[n] > 0 && bingpai[n+1] > 0 && bingpai[n+2] > 0) {
        bingpai[n]--; bingpai[n+1]--; bingpai[n+2]--;
        shunzi = mianzi(s, bingpai, n);
        bingpai[n]++; bingpai[n+1]++; bingpai[n+2]++;
        for (let s_mianzi of shunzi) {
            s_mianzi.unshift(s+(n)+(n+1)+(n+2));
        }
    }

    let kezi = [];
    if (bingpai[n] >= 3) {
        bingpai[n] -= 3;
        kezi = mianzi(s, bingpai, n);
        bingpai[n] += 3;
        for (let k_mianzi of kezi) {
            k_mianzi.unshift(s+n+n+n);
        }
    }

    return shunzi.concat(kezi);
}

/**
 * @param {Majiang.Shoupai} shoupai 手牌
 *
 * @return {array{array}} 所有可能的面子组合
 *
 * @example mianzi_all(Majiang.Shoupai.fromString('m111222333p123')) -> [["m123", "m123", "m123", "p123"], ["m111", "m222", "m333", "p123"]]
 **/
function mianzi_all(shoupai) {

    let shupai_all = [[]];
    for (let s of ['m', 'p', 's']) {
        let new_mianzi = [];
        for (let mm of shupai_all) {
            for (let nn of mianzi(s, shoupai._bingpai[s])) {
                new_mianzi.push(mm.concat(nn));
            }
        }
        shupai_all = new_mianzi;
    }

    let zipai = [];
    for (let n = 1; n <= 7; n++) {
        if (shoupai._bingpai.z[n] == 0) continue;
        if (shoupai._bingpai.z[n] != 3) return [];
        zipai.push('z'+n+n+n);
    }

    let fulou = shoupai._fulou;

    return shupai_all.map(shupai => shupai.concat(zipai).concat(fulou));
}

/**
 * @param {array} mian 所有面子
 * @param {string} p 和了牌（包括点炮信息）
 *
 * @return {array} 加入了和了牌信息的面子组合
 *
 * @example add_hulepai(["m123", "m123", "m123", "p123"], 'm1-') -> [["m1-!23", "m123", "m123", "p123"]]
 **/
function add_hulepai(mianzi, p) {

    let [s, n, d] = p;
    let regexp   = new RegExp(`^(${s}.*${n})`);
    let replacer = `$1${d}!`;

    let new_mianzi = [];

    for (let i = 0; i < mianzi.length; i++) {
        // 不考虑副露面子
        if (mianzi[i].match(/[\+\=\-]/)) continue;
        // 不考虑重复面子
        if (i > 0 && mianzi[i] == mianzi[i-1]) continue;
        let m = mianzi[i].replace(regexp, replacer);
        if (m == mianzi[i]) continue;
        let tmp_mianzi = mianzi.concat();
        tmp_mianzi[i] = m;
        new_mianzi.push(tmp_mianzi);
    }

    return new_mianzi;
}

/**
 * @param {Majiang.Shoupai} shoupai 手牌
 * @param {string} hulepai 和了牌（包括点炮信息）
 *
 * @return {array{array}} 一般和牌形所有可能的分割（包括将牌）
 *
 * @example hule_mianzi_yiban(Majiang.Shoupai.fromString('m111222333p123s11'), 'm1-') -> [["s11", "m1-!23", "m123", "m123", "p123"], ["s11", "m111-!", "m222", "m333", "p123"]]
 **/
function hule_mianzi_yiban(shoupai, hulepai) {

    let mianzi = [];

    for (let s of ['m', 'p', 's', 'z']) {
        let bingpai = shoupai._bingpai[s];
        for (let n = 1; n < bingpai.length; n++) {
            if (bingpai[n] < 2) continue;
            bingpai[n] -= 2;
            let jiangpai = s+n+n;
            for (let mm of mianzi_all(shoupai)) {
                mm.unshift(jiangpai);
                if (mm.length != 5) continue;
                mianzi = mianzi.concat(add_hulepai(mm, hulepai));
            }
            bingpai[n] += 2;
        }
    }

    return mianzi;
}

/**
 * @param {Majiang.Shoupai} shoupai 手牌
 * @param {string} hulepai 和了牌（包括点炮信息）
 *
 * @return {array{array}} 七对和牌形的分割
 *
 * @example hule_mianzi_qidui(Majiang.Shoupai.fromString('m111122223333s11'), 'm1-') -> [["m11-!", "m11", "m22", "m22", "m33", "m33", "s11"]]
 **/
function hule_mianzi_qidui(shoupai, hulepai) {

    if (shoupai._fulou.length > 0) return [];

    let mianzi = [];

    for (let s of ['m', 'p', 's', 'z']) {
        let bingpai = shoupai._bingpai[s];
        for (let n = 1; n < bingpai.length; n++) {
            if (bingpai[n] == 0) continue;
            if (bingpai[n] == 2 || bingpai[n] == 4) {
                let m = (s+n == hulepai.substr(0,2))
                            ? s+n+n + hulepai[2] + '!'
                            : s+n+n;
                mianzi.push(m);
                if (bingpai[n] == 4) { mianzi.push(s+n+n); }
            }
            else return [];
        }
    }

    return (mianzi.length == 7) ? [ mianzi ] : [];
}

/**
 * @param {Majiang.Shoupai} shoupai 手牌
 * @param {string} hulepai 和了牌（包括点炮信息）
 *
 * @return {array{array}} 国士（十三幺）和牌形的分割
 *
 * @example hule_mianzi_shisanyao(Majiang.Shoupai.fromString('m19p19s19z11234567'), 'z3-') -> [["z11", "m1", "m9", "p1", "p9", "s1", "s9", "z2", "z3-!", "z4", "z5", "z6", "z7"]]
 */
function hule_mianzi_shisanyao(shoupai, hulepai) {

    if (shoupai._fulou.length > 0) return [];

    let mianzi = [];
    let n_duizi = 0;

    for (let s of ['m', 'p', 's', 'z']) {
        let bingpai = shoupai._bingpai[s];
        let nn = (s == 'z') ? [1,2,3,4,5,6,7] : [1,9];
        for (let n of nn) {
            if (bingpai[n] == 2) {
                let m = (s+n == hulepai.substr(0,2))
                            ? s+n+n + hulepai[2] + '!'
                            : s+n+n;
                mianzi.unshift(m);
                n_duizi++;
            }
            else if (bingpai[n] == 1) {
                let m = (s+n == hulepai.substr(0,2))
                            ? s+n + hulepai[2] + '!'
                            : s+n;
                mianzi.push(m);
            }
            else return [];
        }
    }

    return (n_duizi == 1) ? [ mianzi ] : [];
}

/**
 * @param {Majiang.Shoupai} shoupai 手牌
 * @param {string} hulepai 和了牌（包括点炮信息）
 *
 * @return {array{array}} 不靠和牌形的分割
 *
 * @example hule_mianzi_bukao(Majiang.Shoupai.fromString('m39p147s258z123456'), 'z5-') -> [["p1", "p4", "p7", "s2", "s5", "s8", "m3", "m9", "z1", "z2", "z3", "z4", "z5-!", "z6"]]
 */
function hule_mianzi_bukao(shoupai, hulepai) {

    if (shoupai._fulou.length > 0) return [];

    let zipai = [];

    for (let n = 1; n <= 7; n++) {
        let bingpai = shoupai._bingpai.z;
        if (bingpai[n] == 0) continue;

        if (bingpai[n] == 1) {
            let m = ('z'+n == hulepai.substr(0,2))
                        ? 'z'+n + hulepai[2] + '!'
                        : 'z'+n;
            zipai.push(m);
        }
        else return [];
    }

    for (let s_ of ['mps', 'msp', 'pms', 'psm', 'smp', 'spm']) {
        let shupai = [];
        for (let n = 1; n <= 3; n++) {
            let s = s_[n - 1];
            let bingpai = shoupai._bingpai[s];
            for (let nn of [n, n + 3, n + 6]) {
                if (bingpai[nn] == 0) continue;

                if (bingpai[nn] == 1) {
                    let m = (s+nn == hulepai.substr(0,2))
                                ? s+nn + hulepai[2] + '!'
                                : s+nn;
                    shupai.push(m);
                }
                else return [];
            }
        }
        if (zipai.concat(shupai).length == 14) return [ zipai.concat(shupai) ];
    }

    return [];
}

/**
 * @param {Majiang.Shoupai} shoupai 手牌
 * @param {string} hulepai 和了牌（包括点炮信息）
 *
 * @return {array{array}} 组合龙和牌形的分割（不含不靠）
 *
 * @example hule_mianzi_zuhelong(Majiang.Shoupai.fromString('m147p258s369m11123'), 'm1-') -> [["m1-!", "m4", "m7", "p2", "p5", "p8", "s3", "s6", "s9", "m11", "m123"]]
 */
function hule_mianzi_zuhelong(shoupai, hulepai) {

    let mianzi_zuhelong = [];
    let hulepai_zuhelong = false;

    loop1:
    for (let s_ of ['mps', 'msp', 'pms', 'psm', 'smp', 'spm']) {
        mianzi_zuhelong = [];
        for (let n = 1; n <= 3; n++) {
            let s = s_[n - 1];
            let bingpai = shoupai._bingpai[s];
            for (let nn of [n, n + 3, n + 6]) {
                if (bingpai[nn] == 0) continue loop1;

                let m = s+nn;
                if (s+nn == hulepai.substr(0,2)) {
                    hulepai_zuhelong = true;
                    m += hulepai[2] + '!';
                }
                mianzi_zuhelong.push(m);
            }
        }
        if (mianzi_zuhelong.length == 9) break;
    }

    if (mianzi_zuhelong.length != 9) return [];

    for (let m of mianzi_zuhelong) {
        shoupai._bingpai[m[0]][m[1]]--;
    }

    let mianzi = [];

    loop2:
    for (let s of ['m', 'p', 's', 'z']) {
        let bingpai = shoupai._bingpai[s];
        for (let n = 1; n < bingpai.length; n++) {
            if (bingpai[n] < 2) continue;

            bingpai[n] -= 2;
            mianzi = [];
            let jiangpai = s+n+n;
            for (let mm of mianzi_all(shoupai)) {
                mm.unshift(jiangpai);
                if (mm.length != 2) continue;

                if (!hulepai_zuhelong) mianzi = mianzi.concat(add_hulepai(mm, hulepai)[0]);
                else mianzi = mianzi.concat(mm);

                for (let m of mianzi_zuhelong) {
                    shoupai._bingpai[m[0]][m[1]]++;
                }

                bingpai[n] += 2;
                return [ mianzi_zuhelong.concat(mianzi) ];
            }
            bingpai[n] += 2;
        }
    }

    for (let m of mianzi_zuhelong) {
        shoupai._bingpai[m[0]][m[1]]++;
    }
    return [];
}

function hule_mianzi_jiulian(shoupai, hulepai) {

    if (shoupai._fulou.length > 0) return [];

    let s = hulepai[0];
    if (s == 'z') return [];

    let mianzi = s;
    let bingpai = shoupai._bingpai[s];
    for (let n = 1; n <= 9; n++) {
        if ((n == 1 || n == 9) && bingpai[n] < 3) return [];
        if (bingpai[n] == 0) return [];
        let n_pai = (n == hulepai[1]) ? bingpai[n] - 1 : bingpai[n];
        for (let i = 0; i < n_pai; i++) {
            mianzi += n;
        }
    }
    if (mianzi.length != 14) return [];
    if (!mianzi.match(/^[mps]1112345678999/)) return [];

    mianzi += hulepai + '!';

    return [ [mianzi] ];
}

function hule_mianzi(shoupai, rongpai) {

    if (! shoupai._zimo || shoupai._zimo.length > 2) return [];

    let hulepai = rongpai || shoupai._zimo + '_';

    return [].concat(hule_mianzi_yiban(shoupai, hulepai))
             .concat(hule_mianzi_qidui(shoupai, hulepai))
             .concat(hule_mianzi_zuhelong(shoupai, hulepai))
             .concat(hule_mianzi_shisanyao(shoupai, hulepai))
             .concat(hule_mianzi_bukao(shoupai, hulepai))
             .concat(hule_mianzi_jiulian(shoupai, hulepai));
}

function get_hudi(mianzi) {

    const sanyuanpai    = /^z[567].*$/;

    const yaojiu        = /^.*[z19].*$/;
    const zipai         = /^z.*$/;

    const danzhang      = /^[mpsz]\d[\+\=\-\_]?\!?$/;
    const duizi         = /^[mpsz](\d)\1[\+\=\-\_]?\!?$/;
    const kezi          = /^[mpsz](\d)\1\1.*$/;
    const ankezi        = /^[mpsz](\d)\1\1(?:\1|_\!)?$/;
    const gangzi        = /^[mpsz](\d)\1\1.*\1.*$/;
    const angangzi      = /^[mpsz](\d)\1\1\1$/;

    let hudi = {
        fu:         20,
        menqian:    true,
        zimo:       true,
        danzhang:   { m: [0,0,0,0,0,0,0,0,0,0],
                      p: [0,0,0,0,0,0,0,0,0,0],
                      s: [0,0,0,0,0,0,0,0,0,0],
                      z: [0,0,0,0,0,0,0,0]      },
        duizi:      { m: [0,0,0,0,0,0,0,0,0,0],
                      p: [0,0,0,0,0,0,0,0,0,0],
                      s: [0,0,0,0,0,0,0,0,0,0],
                      z: [0,0,0,0,0,0,0,0]      },
        shunzi:     { m: [0,0,0,0,0,0,0,0],
                      p: [0,0,0,0,0,0,0,0],
                      s: [0,0,0,0,0,0,0,0]  },
        kezi:       { m: [0,0,0,0,0,0,0,0,0,0],
                      p: [0,0,0,0,0,0,0,0,0,0],
                      s: [0,0,0,0,0,0,0,0,0,0],
                      z: [0,0,0,0,0,0,0,0]      },
        n_danzhang: 0,
        n_duizi:    0,
        n_shunzi:   0,
        n_kezi:     0,
        n_ankezi:   0,
        n_gangzi:   0,
        n_angangzi: 0,
    };

    for (let m of mianzi) {

        if (m.match(/[\+\=\-]\!/))      hudi.zimo    = false;
        if (m.match(/[\+\=\-](?!\!)/))  hudi.menqian = false;

        // 九莲宝灯
        if (mianzi.length == 1) continue;

        // 十三幺
        if (mianzi.length == 13) continue;

        // 不靠
        if (mianzi.length == 14) continue;

        if (m.match(danzhang)) {
            hudi.n_danzhang++;
            hudi.danzhang[m[0]][m[1]]++;
        }
        else if (m.match(duizi)) {
            hudi.n_duizi++;
            hudi.duizi[m[0]][m[1]]++;
        }
        else if (m.match(kezi)) {
            hudi.n_kezi++;
            let fu = 2;
            if (m.match(ankezi)) { hudi.n_ankezi++; }
            if (m.match(gangzi)) { hudi.n_gangzi++; }
            if (m.match(angangzi)) { hudi.n_angangzi++; }
            hudi.kezi[m[0]][m[1]]++;
        }
        else {
            hudi.n_shunzi++;
            hudi.shunzi[m[0]][m[1]]++;
        }
    }

    return hudi;
}

function get_fanzhong(mianzi, hudi, param) {

    console.log(mianzi);

    function dasixi() {
        const kezi = hudi.kezi;
        if (kezi.z[1] + kezi.z[2] + kezi.z[3] + kezi.z[4] == 4) return 1;
        return 0;
    }
    function dasanyuan() {
        const kezi = hudi.kezi;
        if (kezi.z[5] + kezi.z[6] + kezi.z[7] == 3) return 1;
        return 0;
    }
    function shisanyao() {
        if (mianzi.length == 13) return 1;
        return 0;
    }
    function lvyise() {
        if (mianzi.filter(m => m.match(/^[mp]/)).length > 0) return 0;
        if (mianzi.filter(m => m.match(/^z[^6]/)).length > 0) return 0;
        if (mianzi.filter(m => m.match(/^s.*[1579]/)).length > 0) return 0;
        return 1;
    }
    // 九莲宝灯在后面特殊处理
    function jiulianbaodeng() {
        // if (mianzi[0].match(/^[mpsz]1112345678999/)) return 1;
        return 0;
    }
    function lianqidui() {
        const duizi = hudi.duizi;
        if (hudi.n_duizi != 7) return 0;
        for (let s of ['m', 'p', 's']) {
            if (duizi[s][3] && duizi[s][4] && duizi[s][5] && duizi[s][6] && duizi[s][7] && ((duizi[s][1] && duizi[s][2]) || (duizi[s][2] && duizi[s][8]) || (duizi[s][8] && duizi[s][9]))) return 1;
        }
        return 0;
    }
    function sigang() {
        if (hudi.n_gangzi == 4) return 1;
        return 0;
    }
    function xiaosixi() {
        const kezi = hudi.kezi;
        if (kezi.z[1] + kezi.z[2] + kezi.z[3] + kezi.z[4] == 3 && mianzi[0].match(/^z[1234]/)) return 1;
        return 0;
    }
    function xiaosanyuan() {
        const kezi = hudi.kezi;
        if (kezi.z[5] + kezi.z[6] + kezi.z[7] == 2 && mianzi[0].match(/^z[567]/)) return 1;
        return 0;
    }
    function ziyise() {
        const zipai = /^z/;
        if (mianzi.filter(m => m.match(zipai)).length == mianzi.length) return 1;
        return 0;
    }
    function yiseshuanglonghui() {
        const shunzi = hudi.shunzi;
        const duizi = hudi.duizi;
        for (let s of ['m', 'p', 's']) {
            if (shunzi[s][1] == 2 && shunzi[s][7] == 2 && duizi[s][5] == 1) return 1;
        }
        return 0;
    }
    function qingyaojiu() {
        const laotoupai = /^[mps]([19])\1\1*.*$/;
        if (mianzi.filter(m => m.match(laotoupai)).length == mianzi.length) return 1;
        return 0;
    }
    function sianke() {
        if (hudi.n_ankezi == 4) return 1;
        return 0;
    }
    function yisesitongshun() {
        const shunzi = hudi.shunzi;
        for (let s of ['m', 'p', 's']) {
            for (let n = 1; n <= 7; n++) {
                if (shunzi[s][n] == 4) return 1;
            }
        }
        return 0;
    }
    function yisesijiegao() {
        const kezi = hudi.kezi;
        for (let s of ['m', 'p', 's']) {
            for (let n = 1; n <= 6; n++) {
                if (kezi[s][n] && kezi[s][n + 1] && kezi[s][n + 2] && kezi[s][n + 3]) return 1;
            }
        }
        return 0;
    }
    function yisesibugao() {
        const shunzi = hudi.shunzi;
        for (let s of ['m', 'p', 's']) {
            if (shunzi[s][1] && shunzi[s][3] && shunzi[s][5] && shunzi[s][7]) return 1;
            for (let n = 1; n <= 4; n++) {
                if (shunzi[s][n] && shunzi[s][n + 1] && shunzi[s][n + 2] && shunzi[s][n + 3]) return 1;
            }
        }
        return 0;
    }
    function hunyaojiu() {
        const laotoupai = /^[mps]([19])\1\1*.*$/;
        const zipai = /^z([1-7])\1\1*.*$/;
        if (mianzi.filter(m => m.match(laotoupai) || m.match(zipai)).length == mianzi.length
                && mianzi.filter(m => m.match(laotoupai)).length > 0
                && mianzi.filter(m => m.match(zipai)).length > 0) return 1;
        return 0;
    }
    function sangang() {
        if (hudi.n_gangzi == 3) return 1;
        return 0;
    }
    function qidui() {
        if (hudi.n_duizi == 7) return 1;
        return 0;
    }
    function qixingbukao() {
        if (mianzi.length != 14) return 0;
        const zi= /^z/;
        if (mianzi.filter(m => m.match(zi)).length == 7) return 1;
        return 0;
    }
    function qingyise() {
        for (let s of ['m', 'p', 's']) {
            const yise = new RegExp(`^${s}`);
            if (mianzi.filter(m => m.match(yise)).length == mianzi.length) return 1;
        }
        return 0;
    }
    function yisesantongshun() {
        const shunzi = hudi.shunzi;
        for (let s of ['m', 'p', 's']) {
            for (let n = 1; n <= 7; n++) {
                if (shunzi[s][n] >= 3) return 1;
            }
        }
        return 0;
    }
    function yisesanjiegao() {
        const kezi = hudi.kezi;
        for (let s of ['m', 'p', 's']) {
            for (let n = 1; n <= 7; n++) {
                if (kezi[s][n] && kezi[s][n + 1] && kezi[s][n + 2]) return 1;
            }
        }
        return 0;
    }
    function quanda() {
        if (mianzi.filter(m => m.match(/^[mps].*[123456]/)).length > 0) return 0;
        if (mianzi.filter(m => m.match(/^z/)).length > 0) return 0;
        return 1;
    }
    function quanzhong() {
        if (mianzi.filter(m => m.match(/^[mps].*[123789]/)).length > 0) return 0;
        if (mianzi.filter(m => m.match(/^z/)).length > 0) return 0;
        return 1;
    }
    function quanxiao() {
        if (mianzi.filter(m => m.match(/^[mps].*[456789]/)).length > 0) return 0;
        if (mianzi.filter(m => m.match(/^z/)).length > 0) return 0;
        return 1;
    }
    function quanshuangke() {
        if (mianzi.length != 5) return 0;
        if (mianzi.filter(m => m.match(/^[mps].*[13579]/)).length > 0) return 0;
        if (mianzi.filter(m => m.match(/^z/)).length > 0) return 0;
        return 1;
    }
    function qinglong() {
        const shunzi = hudi.shunzi;
        for (let s of ['m', 'p', 's']) {
            if (shunzi[s][1] && shunzi[s][4] && shunzi[s][7]) return 1;
        }
        return 0;
    }
    function yisesanbugao() {
        const shunzi = hudi.shunzi;
        for (let s of ['m', 'p', 's']) {
            for (let n = 1; n <= 3; n++) {
                if (shunzi[s][n] && shunzi[s][n + 2] && shunzi[s][n + 4]) return 1;
            }
            for (let n = 1; n <= 5; n++) {
                if (shunzi[s][n] && shunzi[s][n + 1] && shunzi[s][n + 2]) return 1;
            }
        }
        return 0;
    }
    function sanseshuanglonghui() {
        const shunzi = hudi.shunzi;
        const duizi = hudi.duizi;
        for (let s_ of ['mps', 'msp', 'pms', 'psm', 'smp', 'spm']) {
            if (shunzi[s_[0]][1] == 2 && shunzi[s_[1]][7] == 2 && duizi[s_[2]][5] == 1) return 1;
        }
        return 0;
    }
    function quandaiwu() {
        if (mianzi.filter(m => m.match(/^[mps].*[5]/)).length == mianzi.length) return 1;
        return 0;
    }
    function santongke() {
        const kezi = hudi.kezi;
        for (let n = 1; n <= 9; n++) {
            if (kezi.m[n] && kezi.p[n] && kezi.s[n]) return 1;
        }
        return 0;
    }
    function sananke() {
        if (hudi.n_ankezi == 3) return 1;
        return 0;
    }
    function quanbukao() {
        if (mianzi.length != 14) return 0;
        const zi= /^z/;
        if (mianzi.filter(m => m.match(zi)).length <= 6) return 1;
        return 0;
    }
    function zuhelong() {
        if (mianzi.length == 11) return 1;
        if (mianzi.length == 14) {
            const zi= /^z/;
            if (mianzi.filter(m => m.match(zi)).length == 5) return 1;
        }
        return 0;
    }
    function dayuwu() {
        if (mianzi.filter(m => m.match(/^[mps].*[12345]/)).length > 0) return 0;
        if (mianzi.filter(m => m.match(/^z/)).length > 0) return 0;
        return 1;
    }
    function xiaoyuwu() {
        if (mianzi.filter(m => m.match(/^[mps].*[56789]/)).length > 0) return 0;
        if (mianzi.filter(m => m.match(/^z/)).length > 0) return 0;
        return 1;
    }
    function sanfengke() {
        const kezi = hudi.kezi;
        if (kezi.z[1] + kezi.z[2] + kezi.z[3] + kezi.z[4] == 3) return 1;
        return 0;
    }
    function hualong() {
        const shunzi = hudi.shunzi;
        for (let s_ of ['mps', 'msp', 'pms', 'psm', 'smp', 'spm']) {
            if (shunzi[s_[0]][1] && shunzi[s_[1]][4] && shunzi[s_[2]][7]) return 1;
        }
        return 0;
    }
    function sansesantongshun() {
        const shunzi = hudi.shunzi;
        for (let n = 1; n <= 7; n++) {
            if (shunzi.m[n] && shunzi.p[n] && shunzi.s[n]) return 1;
        }
        return 0;
    }
    function sansesanjiegao() {
        const kezi = hudi.kezi;
        for (let s_ of ['mps', 'msp', 'pms', 'psm', 'smp', 'spm']) {
            for (let n = 1; n <= 7; n++) {
                if (kezi[s_[0]][n] && kezi[s_[1]][n + 1] && kezi[s_[2]][n + 2]) return 1;
            }
        }
        return 0;
    }
    // 暂时先设为0，最后再调整
    function wufanhu() {
        return 0;
    }
    function tuibudao() {
        if (mianzi.filter(m => m.match(/^m/)).length > 0) return 0;
        if (mianzi.filter(m => m.match(/^p.*[67]/)).length > 0) return 0;
        if (mianzi.filter(m => m.match(/^s.*[137]/)).length > 0) return 0;
        if (mianzi.filter(m => m.match(/^z.*[123456]/)).length > 0) return 0;
        return 1;
    }
    function miaoshouhuichun() {
        if (param.hupai.haidi == 1) return 1;
        return 0;
    }
    function haidilaoyue() {
        if (param.hupai.haidi == 2) return 1;
        return 0;
    }
    function gangshangkaihua() {
        if (param.hupai.lingshang) return 1;
        return 0;
    }
    function qiangganghu() {
        if (param.hupai.qianggang) return 1;
        return 0;
    }
    function pengpenghu() {
        if (hudi.n_kezi == 4) return 1;
        return 0;
    }
    function hunyise() {
        const zipai = new RegExp(`^z`);
        for (let s of ['m', 'p', 's']) {
            const yise = new RegExp(`^${s}`);
            if (mianzi.filter(m => m.match(yise) || m.match(zipai)).length == mianzi.length
                && mianzi.filter(m => m.match(yise)).length > 0
                && mianzi.filter(m => m.match(zipai)).length > 0) return 1;
        }
        return 0;
    }
    function quanqiuren() {
        const fulou = /[\+\=\-]/;
        if (mianzi.filter(m => m.match(fulou)).length == mianzi.length) return 1;
        return 0;
    }
    function sansesanbugao() {
        const shunzi = hudi.shunzi;
        for (let s_ of ['mps', 'msp', 'pms', 'psm', 'smp', 'spm']) {
            for (let n = 1; n <= 5; n++) {
                if (shunzi[s_[0]][n] && shunzi[s_[1]][n + 1] && shunzi[s_[2]][n + 2]) return 1;
            }
        }
        return 0;
    }
    function wumenqi() {
        if (mianzi.filter(m => m.match(/^m/)).length > 0
            && mianzi.filter(m => m.match(/^p/)).length > 0
            && mianzi.filter(m => m.match(/^s/)).length > 0
            && mianzi.filter(m => m.match(/^z[1234]/)).length > 0
            && mianzi.filter(m => m.match(/^z[567]/)).length > 0) return 1;
        return 0;
    }
    function shuangangang() {
        if (hudi.n_angangzi == 2) return 1;
        return 0;
    }
    function shuangjianke() {
        const kezi = hudi.kezi;
        if (kezi.z[5] + kezi.z[6] + kezi.z[7] == 2) return 1;
        return 0;
    }
    function buqiuren() {
        if (hudi.menqian && hudi.zimo) return 1;
        return 0;
    }
    function quandaiyao() {
        if (mianzi.filter(m => m.match(/^.*[z19].*$/)).length == mianzi.length) return 1;
        return 0;
    }
    function shuangminggang() {
        if (hudi.n_gangzi == 2 && hudi.n_angangzi == 0) return 1;
        return 0;
    }
    function hujuezhang() {
        if (param.hupai.juezhang) return 1;
        return 0;
    }
    function menqianqing() {
        if (hudi.menqian) return 1;
        return 0;
    }
    function duanyao() {
        if (mianzi.filter(m => m.match(/^.*[z19].*$/)).length == 0) return 1;
        return 0;
    }
    function pinghu() {
        if (hudi.n_shunzi != 4) return 0;
        if (mianzi[0].match(/^z/)) return 0;
        return 1;
    }
    function jianke() {
        const kezi = hudi.kezi;
        if (kezi.z[5] + kezi.z[6] + kezi.z[7] == 1) return 1;
        return 0;
    }
    function quanfengke() {
        if (hudi.kezi.z[param.quanfeng + 1]) return 1;
        return 0;
    }
    function menfengke() {
        if (hudi.kezi.z[param.menfeng + 1]) return 1;
        return 0;
    }
    function siguiyi() {
        let zhangshu =  { m: [0,0,0,0,0,0,0,0,0,0],
                          p: [0,0,0,0,0,0,0,0,0,0],
                          s: [0,0,0,0,0,0,0,0,0,0],
                          z: [0,0,0,0,0,0,0,0]      };
        for (let m of mianzi) {
            let s = m[0];
            for (let n of m) {
                if (isNaN(n)) continue;

                zhangshu[s][n]++;
            }
        }

        let result = -hudi.n_gangzi;

        for (let s of ['m', 'p', 's', 'z']) {
            result += zhangshu[s].filter(n => n == 4).length;
        }
                
        return result;
    }
    function shuangtongke() {
        let result = 0;
        const kezi = hudi.kezi;
        for (let n = 1; n <= 9; n++) {
            if (kezi.m[n] + kezi.p[n] + kezi.s[n] == 2) result++;
        }
        return result;
    }
    function shuanganke() {
        if (hudi.n_ankezi == 2) return 1;
        return 0;
    }
    function angang() {
        return hudi.n_angangzi;
    }
    function queyimen() {
        for (let s_ of ['mps', 'psm', 'smp']) {
            if (mianzi.filter(m => m.match(new RegExp(`^[${s_[0]}]`))).length > 0
                && mianzi.filter(m => m.match(new RegExp(`^[${s_[1]}]`))).length > 0
                && mianzi.filter(m => m.match(new RegExp(`^[${s_[2]}]`))).length == 0) return 1;
        }
        return 0;
    }
    function wuzi() {
        if (mianzi.filter(m => m.match(/^z/)).length == 0) return 1;
        return 0;
    }
    function yibangao() {
        const shunzi = hudi.shunzi;
        return shunzi.m.concat(shunzi.p).concat(shunzi.s).map(x => Math.max(0, x - 1)).reduce((a, b) => a + b);
    }
    function lianliu() {
        let result = 0;
        const shunzi = hudi.shunzi;
        for (let s of ['m', 'p', 's']) {
            for (let n = 1; n <= 4; n++) {
                if (shunzi[s][n] && shunzi[s][n + 3]) result++;
            }
        }
        return result;
    }
    function laoshaofu() {
        let result = 0;
        const shunzi = hudi.shunzi;
        for (let s of ['m', 'p', 's']) {
            if (shunzi[s][1] && shunzi[s][7]) result++;
        }
        return result;
    }
    function xixiangfeng() {
        let result = 0;
        const shunzi = hudi.shunzi;
        for (let s_ of ['mp', 'ps', 'sm']) {
            for (let n = 1; n <= 7; n++) {
                if (shunzi[s_[0]][n] && shunzi[s_[1]][n]) result++;
            }
        }
        return result;
    }
    function yaojiuke() {
        let result = 0;
        const laotoupai_kezi = /^[mps]([19])\1\1.*$/;
        const fengpai_kezi = /^z([1-4])\1\1.*$/;
        let n_yaojiukezi = mianzi.filter(m => m.match(laotoupai_kezi) || m.match(fengpai_kezi)).length;
        return n_yaojiukezi - hudi.kezi.z[param.quanfeng + 1] - hudi.kezi.z[param.menfeng + 1];
    }
    function minggang() {
        return (hudi.n_gangzi - hudi.n_angangzi);
    }
    function bianzhang() {
        const bianzhang_ = /^[mps](123[\+\=\-\_]\!|7[\+\=\-\_]\!89)$/;
        if (mianzi.filter(m => m.match(bianzhang_)).length > 0) return 1;
        return 0;
    }
    function kanzhang() {
        const bianzhang_ = /^[mps]\d\d[\+\=\-\_]\!\d$/;
        if (mianzi.filter(m => m.match(bianzhang_)).length > 0) return 1;
        return 0;
    }
    function dandiaojiang() {
        const dandiaojiang_ = /^[mpsz](\d)\1[\+\=\-\_]\!$/;
        if (mianzi.filter(m => m.match(dandiaojiang_)).length > 0) return 1;
        return 0;
    }
    function mingangang() {
        if (hudi.n_gangzi == 2 && hudi.n_angangzi == 1) return 1;
        return 0;
    }
    function zimo() {
        if (hudi.zimo) return 1;
        return 0;
    }

    let hupai = [];

    const fanzhongs = [
        { name_zh: '大四喜', fenshu: 88 },
        { name_zh: '大三元', fenshu: 88 },
        { name_zh: '十三幺', fenshu: 88 },
        { name_zh: '绿一色', fenshu: 88 },
        { name_zh: '九莲宝灯', fenshu: 88 },
        { name_zh: '连七对', fenshu: 88 },
        { name_zh: '四杠', fenshu: 88 },
        { name_zh: '小四喜', fenshu: 64 },
        { name_zh: '小三元', fenshu: 64 },
        { name_zh: '字一色', fenshu: 64 },
        { name_zh: '一色双龙会', fenshu: 64 },
        { name_zh: '清幺九', fenshu: 64 },
        { name_zh: '四暗刻', fenshu: 64 },
        { name_zh: '一色四同顺', fenshu: 48 },
        { name_zh: '一色四节高', fenshu: 48 },
        { name_zh: '一色四步高', fenshu: 32 },
        { name_zh: '混幺九', fenshu: 32 },
        { name_zh: '三杠', fenshu: 32 },
        { name_zh: '七对', fenshu: 24 },
        { name_zh: '七星不靠', fenshu: 24 },
        { name_zh: '清一色', fenshu: 24 },
        { name_zh: '一色三同顺', fenshu: 24 },
        { name_zh: '一色三节高', fenshu: 24 },
        { name_zh: '全大', fenshu: 24 },
        { name_zh: '全中', fenshu: 24 },
        { name_zh: '全小', fenshu: 24 },
        { name_zh: '全双刻', fenshu: 24 },
        { name_zh: '清龙', fenshu: 16 },
        { name_zh: '一色三步高', fenshu: 16 },
        { name_zh: '三色双龙会', fenshu: 16 },
        { name_zh: '全带五', fenshu: 16 },
        { name_zh: '三同刻', fenshu: 16 },
        { name_zh: '三暗刻', fenshu: 16 },
        { name_zh: '全不靠', fenshu: 12 },
        { name_zh: '组合龙', fenshu: 12 },
        { name_zh: '大于五', fenshu: 12 },
        { name_zh: '小于五', fenshu: 12 },
        { name_zh: '三风刻', fenshu: 12 },
        { name_zh: '花龙', fenshu: 8 },
        { name_zh: '三色三同顺', fenshu: 8 },
        { name_zh: '三色三节高', fenshu: 8 },
        { name_zh: '无番和', fenshu: 8 },
        { name_zh: '推不倒', fenshu: 8 },
        { name_zh: '妙手回春', fenshu: 8 },
        { name_zh: '海底捞月', fenshu: 8 },
        { name_zh: '杠上开花', fenshu: 8 },
        { name_zh: '抢杠和', fenshu: 8 },
        { name_zh: '碰碰和', fenshu: 6 },
        { name_zh: '混一色', fenshu: 6 },
        { name_zh: '全求人', fenshu: 6 },
        { name_zh: '三色三步高', fenshu: 6 },
        { name_zh: '五门齐', fenshu: 6 },
        { name_zh: '双暗杠', fenshu: 6 },
        { name_zh: '双箭刻', fenshu: 6 },
        { name_zh: '不求人', fenshu: 4 },
        { name_zh: '全带幺', fenshu: 4 },
        { name_zh: '双明杠', fenshu: 4 },
        { name_zh: '和绝张', fenshu: 4 },
        { name_zh: '门前清', fenshu: 2 },
        { name_zh: '断幺', fenshu: 2 },
        { name_zh: '平和', fenshu: 2 },
        { name_zh: '箭刻', fenshu: 2 },
        { name_zh: '圈风刻', fenshu: 2 },
        { name_zh: '门风刻', fenshu: 2 },
        { name_zh: '四归一', fenshu: 2 },
        { name_zh: '双同刻', fenshu: 2 },
        { name_zh: '双暗刻', fenshu: 2 },
        { name_zh: '暗杠', fenshu: 2 },
        { name_zh: '缺一门', fenshu: 1 },
        { name_zh: '无字', fenshu: 1 },
        { name_zh: '一般高', fenshu: 1 },
        { name_zh: '连六', fenshu: 1 },
        { name_zh: '老少副', fenshu: 1 },
        { name_zh: '喜相逢', fenshu: 1 },
        { name_zh: '幺九刻', fenshu: 1 },
        { name_zh: '明杠', fenshu: 1 },
        { name_zh: '边张', fenshu: 1 },
        { name_zh: '坎张', fenshu: 1 },
        { name_zh: '单钓将', fenshu: 1 },
        { name_zh: '自摸', fenshu: 1 },
        { name_zh: '明暗杠', fenshu: 5 },
        // { name_zh: '花牌', fenshu: 1 },
    ];

    let fanzhong_nums = Array(fanzhongs.length).fill(0);

    // 九莲宝灯单独考虑
    if (mianzi.length == 1) {
        fanzhong_nums[4] = 1;
        let hulepai_shu = mianzi[0][15];
        switch (hulepai_shu) {
            case '1':
            case '9':
                fanzhong_nums[27] = 1;
                fanzhong_nums[64] = 1;
                break;
            case '2':
            case '8':
                fanzhong_nums[71] = 1;
                fanzhong_nums[74] = 1;
                break;
            case '3':
            case '4':
            case '6':
            case '7':
                fanzhong_nums[71] = 4;
                break;
            case '5':
                fanzhong_nums[74] = 4;
                break;
        }
    }
    else {
        let fanzhong_functions = [
            dasixi,
            dasanyuan,
            shisanyao,
            lvyise,
            jiulianbaodeng,
            lianqidui,
            sigang,
            xiaosixi,
            xiaosanyuan,
            ziyise,
            yiseshuanglonghui,
            qingyaojiu,
            sianke,
            yisesitongshun,
            yisesijiegao,
            yisesibugao,
            hunyaojiu,
            sangang,
            qidui,
            qixingbukao,
            qingyise,
            yisesantongshun,
            yisesanjiegao,
            quanda,
            quanzhong,
            quanxiao,
            quanshuangke,
            qinglong,
            yisesanbugao,
            sanseshuanglonghui,
            quandaiwu,
            santongke,
            sananke,
            quanbukao,
            zuhelong,
            dayuwu,
            xiaoyuwu,
            sanfengke,
            hualong,
            sansesantongshun,
            sansesanjiegao,
            wufanhu,
            tuibudao,
            miaoshouhuichun,
            haidilaoyue,
            gangshangkaihua,
            qiangganghu,
            pengpenghu,
            hunyise,
            quanqiuren,
            sansesanbugao,
            wumenqi,
            shuangangang,
            shuangjianke,
            buqiuren,
            quandaiyao,
            shuangminggang,
            hujuezhang,
            menqianqing,
            duanyao,
            pinghu,
            jianke,
            quanfengke,
            menfengke,
            siguiyi,
            shuangtongke,
            shuanganke,
            angang,
            queyimen,
            wuzi,
            yibangao,
            lianliu,
            laoshaofu,
            xixiangfeng,
            yaojiuke,
            minggang,
            bianzhang,
            kanzhang,
            dandiaojiang,
            zimo,
            mingangang,
        ];
        for (const [index, f] of fanzhong_functions.entries()) {
            fanzhong_nums[index] = f();
        }

        //    -3: 自身，所以不计
        //    -2: 没有复合可能，所以不计
        //    -1: 必然复合，所以不计
        //     0: 正常计算
        // n(>0): 减算 n 个
        var fanzhong_chongfu_table = new Array(fanzhongs.length);
        for (let n = 0; n < fanzhongs.length; n++) {
            fanzhong_chongfu_table = new Array(fanzhongs.length).fill(0);
        }
        var fanzhong_chongfus = [
            [80, 75],
            [80, 67],
            [60, 69],
            [59, 69],
            [56, 75],
            [54, 79],
            [54, 58],
            [53, 61],
            [52, 67],
            [49, 78],
            [46, 57],
            [45, 79],
            [43, 79],
            [42, 68],
            [36, 69],
            [35, 69],
            [33, 58],
            [33, 54],
            [33, 51],
            [30, 59],
            [29, 73],
            [29, 72],
            [29, 60],
            [26, 59],
            [26, 47],
            [25, 36],
            [24, 59],
            [23, 35],
            [21, 70],
            [20, 69],
            [19, 78],
            [19, 58],
            [19, 54],
            [19, 51],
            [18, 78],
            [18, 58],
            [18, 54],
            [18, 51],
            [16, 74],
            [16, 55],
            [16, 47],
            [15, 73],
            [15, 71],
            [14, 47],
            [14, 22],
            [13, 64],
            [13, 21],
            [12, 58],
            [12, 54],
            [12, 47],
            [11, 74],
            [11, 69],
            [11, 55],
            [11, 47],
            [10, 72],
            [10, 70],
            [10, 60],
            [10, 20],
            [10, 18],
            [9, 74],
            [9, 16],
            [8, 53],
            [7, 74],
            [7, 37],
            [6, 78],
            [6, 75],
            [6, 47],
            [5, 20],
            [5, 18],
            [4, 58],
            [4, 54],
            [4, 20],
            [2, 78],
            [2, 58],
            [2, 55],
            [2, 54],
            [2, 51],
            [2, 16],
            [1, 53],
            [0, 74],
            [0, 63],
            [0, 62],
            [0, 47],
            [0, 37],
        ];
        for (let fc of fanzhong_chongfus) {
            if (fanzhong_nums[fc[0]] > 0) {
                fanzhong_nums[fc[1]] = 0;
            }
        }
    }

    for (const [index, f] of fanzhongs.entries()) {
        if (fanzhong_nums[index] == 0) continue;

        hupai = hupai.concat([{name_zh: f.name_zh, fenshu: f.fenshu * fanzhong_nums[index]}]);
    }

    if (hupai.length == 0) {
        hupai = [{name_zh: fanzhongs[41].name_zh, fenshu: fanzhongs[41].fenshu}];
    }

    return hupai;
}

function get_defen(hupai, rongpai, param) {

    const difen = 8;

    if (hupai.length == 0) return { defen: 0 };

    let menfeng = param.menfeng;
    let defen, chongjia;

    defen = hupai.map(h => h.fenshu).reduce((x, y) => x + y);

    let fenpei = [ 0, 0, 0, 0 ];
    for (let l = 0; l < 4; l++) {
        if (l == menfeng) fenpei[l] = difen * 3;
        else fenpei[l] = -difen;
    }

    if (rongpai) {
        chongjia = menfeng + { '+': 1, '=': 2, '-': 3}[rongpai[2]] % 4;
        fenpei[menfeng] += defen;
        fenpei[chongjia] -= defen;
    }
    else {
        for (let l = 0; l < 4; l++) {
            if (l == menfeng) fenpei[l] += defen * 3;
            else fenpei[l] -= defen;
        }
    }

    return {
        hupai:      hupai,
        defen:      defen,
        fenpei:     fenpei
    };
}

function hule(shoupai, rongpai, param) {

    let max;

    let mianzis = hule_mianzi(shoupai, rongpai);

    // TODO: duting

    for (let mianzi of mianzis) {

        let hudi  = get_hudi(mianzi);
        let hupai = get_fanzhong(mianzi, hudi, param);
        let rv    = get_defen(hupai, rongpai, param);

        if (! max || rv.defen > max.defen
            || rv.defen == max.defen
                && (! rv.fanshu || rv.fanshu > max.fanshu
                    || rv.fanshu == max.fanshu && rv.fu > max.fu)) max = rv;
    }

    console.log(max);
    return max;
}

module.exports = hule;
