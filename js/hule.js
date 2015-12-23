/*
 *  Majiang.Util.hule
 */

(function(){

function mianzi(s, bingpai, n) {

    if (n > 9) return [[]];
    
    if (bingpai[n] == 0) return mianzi(s, bingpai, n+1);
    
    var shunzi = [];
    if (n <= 7 && bingpai[n] > 0 && bingpai[n+1] > 0 && bingpai[n+2] > 0) {
        bingpai[n]--; bingpai[n+1]--; bingpai[n+2]--;
        shunzi = mianzi(s, bingpai, n);
        bingpai[n]++; bingpai[n+1]++; bingpai[n+2]++;
        for (var s_mianzi of shunzi) {
            s_mianzi.unshift(s+(n)+(n+1)+(n+2));
        }
    }
    
    var kezi = [];
    if (bingpai[n] >= 3) {
        bingpai[n] -= 3;
        kezi = mianzi(s, bingpai, n);
        bingpai[n] += 3;
        for (var k_mianzi of kezi) {
            k_mianzi.unshift(s+n+n+n);
        }
    }
    
    return shunzi.concat(kezi);
}

function mianzi_all(shoupai) {

    var all_mianzi = [[]];
    
    for (var s of ['m','p','s']) {
        var new_mianzi = [];
        var sub_mianzi = mianzi(s, shoupai._bingpai[s], 1);
        for (var mm of all_mianzi) {
            for (var nn of sub_mianzi) {
                new_mianzi.push(mm.concat(nn));
            }
        }
        all_mianzi = new_mianzi;
    }
    
    var sub_mianzi_z = [];
    for (var n = 1; n <= 7; n++) {
        if (shoupai._bingpai.z[n] == 0) continue;
        if (shoupai._bingpai.z[n] != 3) return [];
        sub_mianzi_z.push('z'+n+n+n);
    }
    
    var fulou = shoupai._fulou.map(function(m){return m.replace(/0/g ,'5')});
    for (var i = 0; i < all_mianzi.length; i++) {
        all_mianzi[i] = all_mianzi[i].concat(sub_mianzi_z)
                                     .concat(fulou);
    }
    
    return all_mianzi;
}

function add_hulepai(hule_mianzi, p) {

    var regexp   = new RegExp('^(' + p[0] + '.*' + (p[1] || '5') +')');
    var replacer = '$1' + p[2] + '!';
    
    var new_mianzi = [];
    
    for (var i = 0; i < hule_mianzi.length; i++) {
        if (hule_mianzi[i].match(/[\-\+\=]/)) continue;
        if (i > 0 && hule_mianzi[i] == hule_mianzi[i-1]) continue;
        var m = hule_mianzi[i].replace(regexp, replacer);
        if (m == hule_mianzi[i]) continue;
        var tmp_mianzi = hule_mianzi.concat();
        tmp_mianzi[i] = m;
        new_mianzi.push(tmp_mianzi);
    }
    
    return new_mianzi;
}

function hule_mianzi_yiban(shoupai, hulepai) {

    var hule_mianzi = [];
    
    for (var s in shoupai._bingpai) {
        var bingpai = shoupai._bingpai[s];
        for (var n = 1; n < bingpai.length; n++) {
            if (bingpai[n] < 2) continue;
            bingpai[n] -= 2;
            var jiangpai = s+n+n;
            for (var mm of mianzi_all(shoupai)) {
                mm.unshift(jiangpai);
                if (mm.length != 5) continue;
                hule_mianzi = hule_mianzi.concat(add_hulepai(mm, hulepai));
            }
            bingpai[n] += 2;
        }
    }
    
    return hule_mianzi;
}

function hule_mianzi_qiduizi(shoupai, hulepai) {

    var mianzi = [];
    
    for (var s in shoupai._bingpai) {
        var bingpai = shoupai._bingpai[s];
        for (var n = 1; n < bingpai.length; n++) {
            if (bingpai[n] == 0) continue;
            if (bingpai[n] == 2) {
                var p = (s+n == hulepai.substr(0,2))
                            ? s+n+n + hulepai[2] + '!'
                            : s+n+n;
                mianzi.push(p);
            }
            else return [];
        }
    }

    return (mianzi.length == 7) ? [mianzi] : [];
}

function hule_mianzi_guoshi(shoupai, hulepai) {

    var mianzi = [];

    if (shoupai._fulou.length > 0) return mianzi;
    
    var you_duizi = false;
    for (var s in shoupai._bingpai) {
        var bingpai = shoupai._bingpai[s];
        var nn = (s == 'z') ? [1,2,3,4,5,6,7] : [1,9];
        for (var n of nn) {
            if (bingpai[n] == 2) {
                var p = (s+n == hulepai.substr(0,2))
                            ? s+n+n + hulepai[2] + '!'
                            : s+n+n;
                mianzi.unshift(p);
                you_duizi = true;
            }
            else if (bingpai[n] == 1) {
                var p = (s+n == hulepai.substr(0,2))
                            ? s+n + hulepai[2] + '!'
                            : s+n;
                mianzi.push(p);
            }
            else return [];
        }
    }

    return you_duizi ? [mianzi] : [];
}

function hule_mianzi_jiulian(shoupai, hulepai) {

    var s = hulepai[0];
    if (! s.match(/^[mps]$/)) return [];
    
    var mianzi = s;
    var bingpai = shoupai._bingpai[s];
    for (var n = 1; n <= 9; n++) {
        if ((n == 1 || n == 9) && bingpai[n] < 3) return [];
        if (bingpai[n] == 0) return [];
        var nn = (n == hulepai[1]) ? bingpai[n] - 1 : bingpai[n];
        for (var i = 0; i < nn; i++) {
            mianzi += n;
        }
    }
    mianzi += hulepai.substr(1) + '!';

    return [[mianzi]];
}

function hule_mianzi(shoupai, rongpai) {

    var hulepai = rongpai || shoupai._zimo + '_';
    hulepai = hulepai.replace(/0/, '5');
    
    return [].concat(hule_mianzi_yiban(shoupai, hulepai))
             .concat(hule_mianzi_qiduizi(shoupai, hulepai))
             .concat(hule_mianzi_guoshi(shoupai, hulepai))
             .concat(hule_mianzi_jiulian(shoupai, hulepai));
}

function get_hudi(mianzi, zhuangfeng, menfeng) {

    var zhuangfengpai = new RegExp('^z' + (zhuangfeng + 1) + '.*$');
    var menfengpai    = new RegExp('^z' + (menfeng + 1) + '.*$');
    var sanyuanpai    = /^z[567].*$/;
    
    var yaojiu        = /^.*[z19].*$/;
    var zipai         = /^z.*$/;
    
    var kezi          = /^[mpsz](\d)\1\1.*$/;
    var ankezi        = /^[mpsz](\d)\1\1(?:\1|_\!)?$/;
    var gangzi        = /^[mpsz](\d)\1\1.*\1.*$/;
    
    var danqi         = /^[mpsz](\d)\1[\-\+\=\_]\!$/;
    var kanzhang      = /^[mps]\d\d[\-\+\=\_]\!\d$/;
    var bianzhang     = /^[mps](123[\-\+\=\_]\!|7[\-\+\=\_]\!89)$/;

    var hudi = {
        fu:         20,
        menqian:    true,
        zimo:       true,
        shunzi:     { m: {}, p: {}, s: {} },
        kezi:       { m: [0,0,0,0,0,0,0,0,0,0],
                      p: [0,0,0,0,0,0,0,0,0,0],
                      s: [0,0,0,0,0,0,0,0,0,0],
                      z: [0,0,0,0,0,0,0,0]      },
        n_shunzi:   0,
        n_kezi:     0,
        n_ankezi:   0,
        n_gangzi:   0,
        n_zipai:    0,
        n_yaojiu:   0,
        danqi:      false,
        pinghu:     false,
        zhuangfeng: zhuangfeng,
        menfeng:    menfeng
    };
    
    for (var m of mianzi) {
    
        if (m.match(/[\-\+\=]\!/))      hudi.zimo    = false;
        if (m.match(/[\-\+\=](?!\!)/))  hudi.menqian = false;
        
        if (m.match(yaojiu))            hudi.n_yaojiu++;
        if (m.match(zipai))             hudi.n_zipai++;

        if (m.match(danqi))             hudi.danqi = true;
        
        if (mianzi.length != 5) continue;
        
        if (m == mianzi[0]) {
            var fu = 0;
            if (m.match(zhuangfengpai)) fu += 2;
            if (m.match(menfengpai))    fu += 2;
            if (m.match(sanyuanpai))    fu += 2;
            hudi.fu += fu;
            if (hudi.danqi)             hudi.fu += 2;
        }
        else if (m.match(kezi)) {
            hudi.n_kezi++;
            var fu = 2;
            if (m.match(yaojiu)) { fu *= 2;                  }
            if (m.match(ankezi)) { fu *= 2; hudi.n_ankezi++; }
            if (m.match(gangzi)) { fu *= 4; hudi.n_gangzi++; }
            hudi.fu += fu;
            hudi.kezi[m[0]][m[1]] = 1;
        }
        else {
            hudi.n_shunzi++;
            if (m.match(kanzhang))  hudi.fu += 2;
            if (m.match(bianzhang)) hudi.fu += 2;
            var nnn = m.replace(/[^\d]/g, '');
            if (! hudi.shunzi[m[0]][nnn])   hudi.shunzi[m[0]][nnn] = 1;
            else                            hudi.shunzi[m[0]][nnn]++;
        }
    }
    
    if (mianzi.length == 7) {
        hudi.fu = 25;
    }
    else if (mianzi.length == 5) {
        hudi.pinghu = (hudi.menqian && hudi.fu == 20);
        if (hudi.zimo) {
            if (! hudi.pinghu)      hudi.fu +=  2;
        }
        else {
            if (hudi.menqian)       hudi.fu += 10;
            else if (hudi.fu == 20) hudi.fu  = 30;
        }
        hudi.fu = Math.ceil(hudi.fu / 10) * 10;
    }
    
    return hudi;
}

function get_pre_hupai(hupai) {

    var pre_hupai = [];
    
    if (hupai.lizhi == 1)   pre_hupai.push({ name: '立直', fanshu: 1 });
    if (hupai.lizhi == 2)   pre_hupai.push({ name: 'ダブル立直', fanshu: 2 });
    if (hupai.yifa)         pre_hupai.push({ name: '一発', fanshu: 1 });
    if (hupai.haidi == 1)   pre_hupai.push({ name: '海底摸月', fanshu: 1 });
    if (hupai.haidi == 2)   pre_hupai.push({ name: '河底撈魚', fanshu: 1 });
    if (hupai.lingshang)    pre_hupai.push({ name: '嶺上開花', fanshu: 1 });
    if (hupai.qianggang)    pre_hupai.push({ name: '槍槓', fanshu: 1 });

    if (hupai.tianhu == 1)  pre_hupai = [{ name: '天和', fanshu: '*' }];
    if (hupai.tianhu == 2)  pre_hupai = [{ name: '地和', fanshu: '*' }];

    return pre_hupai;
}

function get_hupai(mianzi, hudi, pre_hupai) {

    function menqianqing() {
        if (hudi.menqian && hudi.zimo)
                return [{ name: '門前清自摸和', fanshu: 1 }];
        return [];
    }
    function fanpai() {
        var feng_hanzi = ['東','南','西','北'];
        var fanpai_all = [];
        if (hudi.kezi.z[hudi.zhuangfeng+1])
                fanpai_all.push({ name: '場風 ' + feng_hanzi[hudi.zhuangfeng],
                                  fanshu: 1 });
        if (hudi.kezi.z[hudi.menfeng+1])
                fanpai_all.push({ name: '自風 ' + feng_hanzi[hudi.menfeng],
                                  fanshu: 1 });
        if (hudi.kezi.z[5]) fanpai_all.push({ name: '翻牌 白', fanshu: 1 });
        if (hudi.kezi.z[6]) fanpai_all.push({ name: '翻牌 發', fanshu: 1 });
        if (hudi.kezi.z[7]) fanpai_all.push({ name: '翻牌 中', fanshu: 1 });
        return fanpai_all;
    }
    function pinghu() {
        if (hudi.pinghu)        return [{ name: '平和', fanshu: 1 }];
        return [];
    }
    function duanyaojiu() {
        if (hudi.n_yaojiu == 0) return [{ name: '断幺九', fanshu: 1 }];
        return [];
    }
    function yibeikou() {
        if (! hudi.menqian)     return [];
        var beikou = 0;
        for (var s in hudi.shunzi) {
            for (var m in hudi.shunzi[s]) {
                if (hudi.shunzi[s][m] > 3) beikou++;
                if (hudi.shunzi[s][m] > 1) beikou++;
            }
        }
        if (beikou == 1)        return [{ name: '一盃口', fanshu: 1 }];
        return [];
    }
    function sansetongshun() {
        var shunzi = hudi.shunzi;
        for (var m in shunzi.m) {
            if (shunzi.p[m] && shunzi.s[m])
                return [{ name: '三色同順', fanshu: (hudi.menqian ? 2 : 1) }];
        }
        return [];
    }
    function yiqitongguan() {
        var shunzi = hudi.shunzi;
        for (var s in shunzi) {
            if (shunzi[s][123] && shunzi[s][456] && shunzi[s][789])
                return [{ name: '一気通貫', fanshu: (hudi.menqian ? 2 : 1) }];
        }
        return [];
    }
    function hunquandaiyaojiu() {
        if (hudi.n_yaojiu == 5 && hudi.n_shunzi > 0 && hudi.n_zipai > 0)
                return [{ name: '混全帯幺九', fanshu: (hudi.menqian ? 2 : 1) }];
        return [];
    }
    function qiduizi() {
        if (mianzi.length == 7)     return [{ name: '七対子', fanshu: 2 }];
        return [];
    }
    function duiduihu() {
        if (hudi.n_kezi == 4)       return [{ name: '対々和', fanshu: 2 }];
        return [];
    }
    function sananke() {
        if (hudi.n_ankezi == 3)     return [{ name: '三暗刻', fanshu: 2 }];
        return [];
    }
    function sangangzi() {
        if (hudi.n_gangzi == 3)     return [{ name: '三槓子', fanshu: 2 }];
        return [];
    }
    function sansetongke() {
        var kezi = hudi.kezi;
        for (var n = 1; n <= 9; n++) {
            if (kezi.m[n] + kezi.p[n] + kezi.s[n] == 3)
                                    return [{ name: '三色同刻', fanshu: 2 }];
        }
        return [];
    }
    function hunlaotou() {
        if (hudi.n_yaojiu == mianzi.length
            && hudi.n_shunzi == 0 && hudi.n_zipai > 0)
                                    return [{ name: '混老頭', fanshu: 2 }];
        return [];
    }
    function xiaosanyuan() {
        if (hudi.kezi.z[5] + hudi.kezi.z[6] + hudi.kezi.z[7] == 2
            && mianzi[0].match(/^z[567]/))
                                    return [{ name: '小三元', fanshu: 2 }];
        return [];
    }
    function hunyise() {
        for (var s of ['m','p','s']) {
            var yise = new RegExp('^[z' + s + '].*$');
            if (mianzi.filter(function(m){return m.match(yise)}).length
                        == mianzi.length
                &&  hudi.n_zipai > 0)
                    return [{ name: '混一色', fanshu: (hudi.menqian ? 3 : 2) }];
        }
        return [];
    }
    function chunquandaiyaojiu() {
        if (hudi.n_yaojiu == 5 && hudi.n_shunzi > 0 && hudi.n_zipai == 0)
                return [{ name: '純全帯幺九', fanshu: (hudi.menqian ? 3 : 2) }];
        return [];
    }
    function erbeikou() {
        if (! hudi.menqian)     return [];
        var beikou = 0;
        for (var s in hudi.shunzi) {
            for (var m in hudi.shunzi[s]) {
                if (hudi.shunzi[s][m] > 3) beikou++;
                if (hudi.shunzi[s][m] > 1) beikou++;
            }
        }
        if (beikou == 2)        return [{ name: '二盃口', fanshu: 3 }];
        return [];
    }
    function qingyise() {
        for (var s of ['m','p','s']) {
            var yise = new RegExp('^[z' + s + '].*$');
            if (mianzi.filter(function(m){return m.match(yise)}).length
                        == mianzi.length
                &&  hudi.n_zipai == 0)
                    return [{ name: '清一色', fanshu: (hudi.menqian ? 6 : 5) }];
        }
        return [];
    }

    function guoshiwushuang() {
        if (mianzi.length != 13)    return [];
        if (hudi.danqi)     return [{ name: '国士無双十三面', fanshu: '**' }];
        else                return [{ name: '国士無双', fanshu: '*' }];
    }
    function sianke() {
        if (hudi.n_ankezi != 4)     return [];
        if (hudi.danqi)     return [{ name: '四暗刻単騎', fanshu: '**' }];
        else                return [{ name: '四暗刻', fanshu: '*' }];
    }
    function dasanyuan() {
        if (hudi.kezi.z[5] + hudi.kezi.z[6] + hudi.kezi.z[7] == 3) {
            var bao_mianzi = mianzi.filter(function(m){
                        return m.match(/^z([567])\1\1(?:[\-\+\=]|\1)(?!\!)/)});
            var baojia = (bao_mianzi[2] && bao_mianzi[2].match(/[\-\+\=]/));
            return [{ name: '大三元', fanshu: '*', baojia: baojia && baojia[0] }];
        }
        return [];
    }
    function sixihu() {
        var kezi = hudi.kezi;
        if (kezi.z[1] + kezi.z[2] + kezi.z[3] + kezi.z[4] == 4) {
            var bao_mianzi = mianzi.filter(function(m){
                        return m.match(/^z([1234])\1\1(?:[\-\+\=]|\1)(?!\!)/)});
            var baojia = (bao_mianzi[3] && bao_mianzi[3].match(/[\-\+\=]/));
            return [{ name: '大四喜', fanshu: '**', baojia: baojia && baojia[0] }];
        }
        if (kezi.z[1] + kezi.z[2] + kezi.z[3] + kezi.z[4] == 3
            && mianzi[0].match(/^z[1234]/))
                            return [{ name: '小四喜', fanshu: '*' }];
        return [];
    }
    function ziyise() {
        if (hudi.n_zipai == mianzi.length)
                            return [{ name: '字一色', fanshu: '*' }];
        return [];
    }
    function lvyise() {
        if (mianzi.filter(function(m){return m.match(/^[mp]/)}).length > 0)
                                            return [];
        if (mianzi.filter(function(m){return m.match(/^z[^6]/)}).length > 0)
                                            return [];
        if (mianzi.filter(function(m){return m.match(/^s.*[1579]/)}).length > 0)
                                            return [];
        return [{ name: '緑一色', fanshu: '*' }];
    }
    function qinglaotou() {
        if (hudi.n_kezi == 4 && hudi.n_yaojiu == 5 && hudi.n_zipai == 0)
                            return [{ name: '清老頭', fanshu: '*' }];
        return [];
    }
    function sigangzi() {
        if (hudi.n_gangzi == 4)
                            return [{ name: '四槓子', fanshu: '*' }];
        return [];
    }
    function jiulianbaodeng() {
        if (mianzi.length != 1)             return [];
        if (mianzi[0].match(/^[mps]1112345678999/))
                            return [{ name: '純正九蓮宝燈', fanshu: '**' }];
        else                return [{ name: '九蓮宝燈', fanshu: '*' }];
    }

    var damanguan = (pre_hupai.length > 0 && pre_hupai[0].fanshu[0] == '*')
                        ? pre_hupai : [];
    damanguan = damanguan
                .concat(guoshiwushuang())
                .concat(sianke())
                .concat(dasanyuan())
                .concat(sixihu())
                .concat(ziyise())
                .concat(lvyise())
                .concat(qinglaotou())
                .concat(sigangzi())
                .concat(jiulianbaodeng());

    if (damanguan.length > 0) return damanguan;
    else return pre_hupai
                .concat(menqianqing())
                .concat(fanpai())
                .concat(pinghu())
                .concat(duanyaojiu())
                .concat(yibeikou())
                .concat(sansetongshun())
                .concat(yiqitongguan())
                .concat(hunquandaiyaojiu())
                .concat(qiduizi())
                .concat(duiduihu())
                .concat(sananke())
                .concat(sangangzi())
                .concat(sansetongke())
                .concat(hunlaotou())
                .concat(xiaosanyuan())
                .concat(hunyise())
                .concat(chunquandaiyaojiu())
                .concat(erbeikou())
                .concat(qingyise());
}

function get_post_hupai(paistr, baopai, fubaopai) {

    var post_hupai = [];
    
    var substr = paistr.match(/[mpsz][^mpsz,]*/g) || [];
    
    var n_baopai = 0;
    for (var p of baopai) {
        p = Majiang.Shan.zhenbaopai(p);
        var regexp = new RegExp(p[1],'g');
        for (var str of substr) {
            if (str[0] != p[0]) continue;
            str = str.replace(/0/, '5');
            var nn = str.match(regexp);
            if (nn) n_baopai += nn.length;
        }
    }
    if (n_baopai) post_hupai.push({ name: 'ドラ', fanshu: n_baopai });
    
    var n_hongpai = 0;
    var nn = paistr.match(/0/g);
    if (nn) n_hongpai = nn.length;
    if (n_hongpai) post_hupai.push({ name: '赤ドラ', fanshu: n_hongpai });
    
    var n_fubaopai = 0;
    for (var p of fubaopai) {
        p = Majiang.Shan.zhenbaopai(p);
        var regexp = new RegExp(p[1],'g');
        for (var str of substr) {
            if (str[0] != p[0]) continue;
            str = str.replace(/0/, '5');
            var nn = str.match(regexp);
            if (nn) n_fubaopai += nn.length;
        }
    }
    if (n_fubaopai) post_hupai.push({ name: '裏ドラ', fanshu: n_fubaopai });
    
    return post_hupai;
}

Majiang.Util.hule = function(shoupai, rongpai, param) {

    var max = {
        hupai:      null,
        fu:         0,
        fanshu:     0,
        damanguan:  0,
        defen:      0,
        fenpei:     [ 0, 0, 0, 0 ]
    };
    
    var pre_hupai  = get_pre_hupai(param.hupai);
    var post_hupai = get_post_hupai(
                        shoupai.toString(), param.baopai, param.fubaopai);
    
    for (var mianzi of hule_mianzi(shoupai, rongpai)) {
    
        var hudi  = get_hudi(mianzi, param.zhuangfeng, param.menfeng);
        var hupai = get_hupai(mianzi, hudi, pre_hupai);
        
        if (hupai.length == 0) continue;
        
        var fu = hudi.fu;
        var fanshu = 0, defen = 0, damanguan = 0;
 
        var baojia2, defen2 = 0;

        if (hupai[0].fanshu[0] == '*') {
            for (var h of hupai) {
                damanguan += h.fanshu.match(/\*/g).length;
                if (h.baojia) {
                    baojia2 = h.baojia == '+' ? (param.menfeng + 1) % 4
                            : h.baojia == '=' ? (param.menfeng + 2) % 4
                            : h.baojia == '-' ? (param.menfeng + 3) % 4
                            : -1;
                    defen2  = 8000 * h.fanshu.match(/\*/g).length;
                }
            }
            defen = 8000 * damanguan;
        }
        else {
            hupai = hupai.concat(post_hupai);
            for (var h of hupai) { fanshu += h.fanshu }
            if      (fanshu >= 13) defen = 8000;
            else if (fanshu >= 11) defen = 6000;
            else if (fanshu >=  8) defen = 4000;
            else if (fanshu >=  6) defen = 3000;
            else {
                defen = fu * 2 * 2;
                for (var i = 0; i < fanshu; i++) { defen *= 2 }
                if (defen >= 2000) defen = 2000;
            }
        }
        
        var fenpei = [ 0, 0, 0, 0 ];
 
        if (defen2 > 0) {
            if (rongpai) defen2 = defen2 / 2;
            defen  = defen - defen2;
            defen2 = defen2 * (param.menfeng == 0 ? 6 : 4);
            fenpei[param.menfeng] =  defen2;
            fenpei[baojia2]       = -defen2;
        }
 
        var changbang = param.jicun.changbang;
        var lizhibang = param.jicun.lizhibang;
        
        if (rongpai || defen == 0) {
            var baojia = defen == 0        ? baojia2
                       : rongpai[2] == '+' ? (param.menfeng + 1) % 4
                       : rongpai[2] == '=' ? (param.menfeng + 2) % 4
                       : rongpai[2] == '-' ? (param.menfeng + 3) % 4
                       : -1;
            defen = Math.ceil(defen * (param.menfeng == 0 ? 6 : 4) / 100) * 100;
            fenpei[param.menfeng] +=  defen + changbang * 300 + lizhibang * 1000;
            fenpei[baojia]        += -defen - changbang * 300;
        }
        else {
            var zhuangjia = Math.ceil(defen * 2 / 100) * 100;
            var sanjia    = Math.ceil(defen     / 100) * 100;
            if (param.menfeng == 0) {
                defen = zhuangjia * 3;
                for (var l = 0; l < 4; l++) {
                    if (l == param.menfeng)
                        fenpei[l] += defen + changbang * 300 + lizhibang * 1000;
                    else
                        fenpei[l] += -zhuangjia - changbang * 100;
                }
            }
            else {
                defen = zhuangjia + sanjia * 2;
                for (var l = 0; l < 4; l++) {
                    if (l == param.menfeng)
                        fenpei[l] += defen      + changbang * 300
                                               + lizhibang * 1000;
                    else if (l == 0)
                        fenpei[l] += -zhuangjia - changbang * 100;
                    else
                        fenpei[l] += -sanjia    - changbang * 100;
                }
            }
        }
        
        if (defen + defen2 > max.defen) {
            max = {
                hupai:      hupai,
                fu:         fu,
                fanshu:     fanshu,
                damanguan:  damanguan,
                defen:      defen + defen2,
                fenpei:     fenpei
            };
        }
    }
    
    return max;
}

})();
