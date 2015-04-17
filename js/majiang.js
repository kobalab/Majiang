var Majiang = {};

(function(){

/*
 *  Majiang.Util
 */
function dazi(pai) {

    var n_pai = 0;
    var n_dazi = 0;
    
    for (var i = 0; i < 9; i++) {
        n_pai += pai[i];
        if (i < 7 && pai[i+1] == 0 && pai[i+2] == 0) {
            n_dazi += Math.floor(n_pai / 2);
            n_pai = 0;
        }
    }
    n_dazi += Math.floor(n_pai / 2);
    
    return n_dazi;
}
function mianzi(pai, n) {

    if (n == 9) {
        var n_dazi = dazi(pai);
        return [[0, n_dazi], [0, n_dazi]];
    }
    
    var max = mianzi(pai, n+1);
    
    if (n < 7 && pai[n] > 0 && pai[n+1] > 0 && pai[n+2] > 0) {
        pai[n]--; pai[n+1]--; pai[n+2]--;
        var r = mianzi(pai, n);
        pai[n]++; pai[n+1]++; pai[n+2]++;
        r[0][0]++; r[1][0]++;
        if (r[0][0]* 2 + r[0][1] > max[0][0]* 2 + max[0][1]) max[0] = r[0];
        if (r[1][0]*10 + r[1][1] > max[1][0]*10 + max[1][1]) max[1] = r[1];
    }
    
    if (pai[n] >= 3) {
        pai[n] -= 3;
        var r = mianzi(pai, n);
        pai[n] += 3;
        r[0][0]++; r[1][0]++;
        if (r[0][0]* 2 + r[0][1] > max[0][0]* 2 + max[0][1]) max[0] = r[0];
        if (r[1][0]*10 + r[1][1] > max[1][0]*10 + max[1][1]) max[1] = r[1];
    }
    
    return max;
}
function mianzi_all(shoupai) {

    var r = {};

    r.m = mianzi(shoupai._shouli.m, 0);
    r.p = mianzi(shoupai._shouli.p, 0);
    r.s = mianzi(shoupai._shouli.s, 0);

    r.z = [ 0, 0 ];
    for (var i = 0; i < 7; i++) {
        if (shoupai._shouli.z[i] >= 3) r.z[0]++;
        if (shoupai._shouli.z[i] == 2) r.z[1]++;
    }
    
    var min_xiangting = 8;

    for (var m = 0; m < 2; m++) {
        for (var p = 0; p < 2; p++) {
            for (var s = 0; s < 2; s++) {
                var n_mianzi = r.m[m][0] + r.p[p][0] + r.s[s][0] + r.z[0]
                             + shoupai._fulou.length;
                var n_dazi   = r.m[m][1] + r.p[p][1] + r.s[s][1] + r.z[1];
                if (n_mianzi + n_dazi > 4) n_dazi = 4 - n_mianzi;
                var xiangting = 8 - n_mianzi * 2 - n_dazi;
                if (xiangting < min_xiangting) min_xiangting = xiangting;
            }
        }
    }
    
    return min_xiangting;
}

function get_mianzi(s, pai, i) {

    if (i == 9) return [[]];
	
    if (pai[i] == 0) return get_mianzi(s, pai, i+1);

    var shunzi = [];
    if (i < 7 && pai[i] > 0 && pai[i+1] > 0 && pai[i+2] > 0) {
        pai[i]--; pai[i+1]--; pai[i+2]--;
        shunzi = get_mianzi(s, pai, i);
        pai[i]++; pai[i+1]++; pai[i+2]++;
        for (var mianzi of shunzi) {
            mianzi.unshift(s+(i+1)+(i+2)+(i+3));
        }
    }
	
    var kezi = [];
    if (pai[i] >= 3) {
        pai[i] -= 3;
        kezi = get_mianzi(s, pai, i);
        pai[i] += 3;
        for (var mianzi of kezi) {
            mianzi.unshift(s+(i+1)+(i+1)+(i+1));
        }
    }

    return shunzi.concat(kezi);
}
function get_mianzi_all(shoupai) {

    var mianzi = [[]];

    for (var s of ['m','p','s']) {
        var new_mianzi = [];
        var sub_mianzi = get_mianzi(s, shoupai._shouli[s], 0);
        for (var m of mianzi) {
            for (var n of sub_mianzi) {
                new_mianzi.push(m.concat(n));
            }
        }
        mianzi = new_mianzi;
    }

    var sub_mianzi_z = [];
    for (var n = 1; n <= 7; n++) {
        if (shoupai._shouli.z[n-1] == 0) continue;
        if (shoupai._shouli.z[n-1] != 3) return [];
        sub_mianzi_z.push('z'+n+n+n);
    }

    for (var i = 0; i < mianzi.length; i++) {
        mianzi[i] = mianzi[i].concat(sub_mianzi_z)
                             .concat(shoupai._fulou);
    }

    return mianzi;
}
function add_hulepai(mianzi, hulepai) {

    var regexp   = new RegExp('^(' + hulepai[0] + '.*' + hulepai[1] +')');
    var replacer = '$1' + hulepai.substr(2) + '_';

    var add_mianzi = [];
    for (var i = 0; i < mianzi.length; i++) {
        if (mianzi[i].match(/[\-\+\=]/)) continue;
        if (i > 0 && mianzi[i] == mianzi[i-1]) continue;
        var rep = mianzi[i].replace(regexp, replacer);
        if (rep == mianzi[i]) continue;
        var new_mianzi = mianzi.concat();
        new_mianzi[i] = rep;
        add_mianzi.push(new_mianzi);
    }

    return add_mianzi;
}
function hule_mianzi_yiban(shoupai, rongpai) {

    var hulepai = rongpai || shoupai._zimo;

    var hule_mianzi = [];
    for (var s in shoupai._shouli) {
        var pai = shoupai._shouli[s];
        for (var n = 1; n <= pai.length; n++) {
            if (pai[n-1] < 2) continue;
            var jiangpai = s+n+n;
            pai[n-1] -= 2;
            for (var mianzi of get_mianzi_all(shoupai)) {
                mianzi.unshift(jiangpai);
                for (var add_mianzi of add_hulepai(mianzi, hulepai)) {
                    hule_mianzi.push(add_mianzi);
                }
            }
            pai[n-1] += 2;
        }
    }

    return hule_mianzi;
}
function hule_mianzi_qiduizi(shoupai, rongpai) {

    if (shoupai._fulou.length > 0) return [];

    var hulepai = rongpai || shoupai._zimo;

    var hule_mianzi = [];
    for (var s in shoupai._shouli) {
        var pai = shoupai._shouli[s];
        for (var n = 1; n <= pai.length; n++) {
            if (pai[n-1] == 0) continue;
            if (pai[n-1] == 2) {
                var p = (s+n == hulepai.substr(0,2))
                            ? s+n+n + hulepai.substr(2) + '_'
                            : s+n+n;
                hule_mianzi.push(p);
            }
            else return [];
        }
    }

    return [hule_mianzi];
}
function hule_mianzi_guoshi(shoupai, rongpai) {

    var hulepai = rongpai || shoupai._zimo;

    var hule_mianzi = [];
    for (var s in shoupai._shouli) {
        var pai = shoupai._shouli[s];
        var nn = s == 'z' ? [1,2,3,4,5,6,7] : [1,9];
        for (var n of nn) {
            if (pai[n-1] == 2) {
                var p = (s+n == hulepai.substr(0,2))
                            ? s+n+n + hulepai.substr(2) + '_'
                            : s+n+n;
                hule_mianzi.unshift(p);
            }
            else if (pai[n-1] == 1) {
                var p = (s+n == hulepai.substr(0,2))
                            ? s+n + hulepai.substr(2) + '_'
                            : s+n;
                hule_mianzi.push(p);
            }
            else return [];
        }
    }

    return [hule_mianzi];
}
function hule_mianzi_jiulian(shoupai, rongpai) {

    var hulepai = rongpai || shoupai._zimo;

    var s = hulepai[0];
    if (s == 'z') return [];

    var hule_mianzi = s;
    var pai = shoupai._shouli[s];
    for (var n = 1; n <= 9; n++) {
        if ((n == 1 || n == 9) && pai[n-1] < 3) return [];
        if (pai[n-1] == 0) return [];
        var nn = (n == hulepai[1]) ? pai[n-1] -1 : pai[n-1];
        for (var i = 0; i < nn; i++) {
            hule_mianzi += n;
        }
    }
    hule_mianzi += hulepai.substr(1) + '_';

    return [[hule_mianzi]];
}
function hule_mianzi(shoupai, rongpai) {

    var new_shoupai = shoupai.clone();
    if (rongpai) new_shoupai.zimo(rongpai);
    
    return [].concat(hule_mianzi_yiban(new_shoupai, rongpai))
             .concat(hule_mianzi_qiduizi(new_shoupai, rongpai))
             .concat(hule_mianzi_guoshi(new_shoupai, rongpai))
             .concat(hule_mianzi_jiulian(new_shoupai, rongpai));
}

function check_mianzi(mianzi, zhuangfeng, menfeng) {

    var zhuangfengpai = new RegExp('^z' + (zhuangfeng + 1) + '.*$');
    var menfengpai    = new RegExp('^z' + (menfeng + 1) + '.*$');
    var fengpai       = /^z[1234].*$/;
    var sanyuanpai    = /^z[567].*$/;
    
    var yaojiu        = /^.*[z19].*$/;
    var zipai         = /^z.*$/;
    
	var jiangpai      = /^[mpsz](\d)\1([\-\+\=]?_)?$/;
    var kezi          = /^[mpsz](\d)\1\1.*$/;
    var ankezi        = /^[mpsz](\d)\1\1(?:\1|_)?$/;
    var gangzi        = /^[mpsz](\d)\1\1.*\1.*$/;
    
    var danqi         = /^[mpsz](\d)\1[\-\+\=]?_$/;
    var kanzhang      = /^[mps]\d\d[\-\+\=]?_\d$/;
    var bianzhang     = /^[mps](123[\-\+\=]?_|7[\-\+\=]?_89)$/;

    var rv = {
        fu:         20,
        menqian:    true,
        zimo:       true,
        jiangpai:   null,
        shunzi:     { m: {}, p: {}, s: {} },
        kezi:       { m: {}, p: {}, s: {}, z: {} },
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
    
        if (m.match(/[\-\+\=]_/))       rv.zimo    = false;
        if (m.match(/[\-\+\=](?!_)/))   rv.menqian = false;
 
        if (m.match(yaojiu))            rv.n_yaojiu++;
        if (m.match(zipai))             rv.n_zipai++;
 
        if (mianzi.length != 5) continue;

        if (m.match(jiangpai)) {
            var fen = 0;
            if (m.match(zhuangfengpai)) fen += 2;
            if (m.match(menfengpai))    fen += 2;
            if (m.match(sanyuanpai))    fen += 2;
            rv.fu += fen;
            if (m.match(danqi))  { rv.danqi = true; rv.fu += 2; }
            rv.jiangpai = m;
        }
        else if (m.match(kezi)) {
            rv.n_kezi++;
            var fen = 2;
            if (m.match(yaojiu)) { fen *= 2;                }
            if (m.match(ankezi)) { fen *= 2; rv.n_ankezi++; }
            if (m.match(gangzi)) { fen *= 4; rv.n_gangzi++; }
            rv.fu += fen;
            rv.kezi[m[0]][m[1]] = 1;
        }
        else {
            rv.n_shunzi++;
            if (m.match(kanzhang))  rv.fu += 2;
            if (m.match(bianzhang)) rv.fu += 2;
            var nnn = m.replace(/[^\d]/g, '');
            if (! rv.shunzi[m[0]][nnn]) rv.shunzi[m[0]][nnn] = 1;
            else                        rv.shunzi[m[0]][nnn]++;
        }
    }

    if (mianzi.length == 7) {
        rv.fu  = 25;
    }
    else {
        rv.pinghu = (rv.menqian && rv.fu == 20);
        if (rv.zimo) {
            if (! rv.pinghu)        rv.fu +=  2;
        }
        else {
            if (rv.menqian)         rv.fu += 10;
            else if (rv.fu == 20)   rv.fu =  30;
        }
        rv.fu = Math.ceil(rv.fu / 10) * 10;
    }
    
    return rv;
}
function get_pre_hupai(hupai) {

    var pre_hupai = [];
 
    if (hupai.lizhi == 1) pre_hupai.push({ name: '立直', fanshu: 1 });
    if (hupai.lizhi == 2) pre_hupai.push({ name: 'ダブル立直', fanshu: 2 });
    if (hupai.haidi == 1) pre_hupai.push({ name: '海底摸月', fanshu: 1 });
    if (hupai.haidi == 2) pre_hupai.push({ name: '河底撈魚', fanshu: 1 });
    if (hupai.lingshang)  pre_hupai.push({ name: '嶺上開花', fanshu: 1 });
    if (hupai.qianggang)  pre_hupai.push({ name: '槍槓', fanshu: 1 });

    if (hupai.tianhu)     pre_hupai = [{ name: '天和', fanshu: '*' }];
    if (hupai.dihu)       pre_hupai = [{ name: '地和', fanshu: '*' }];
 
    return pre_hupai;
}
function get_hupai(mianzi, check, pre_hupai) {

    function menqianqing() {
        if (check.menqian && check.zimo)
                return [{ name: '門前清自摸和', fanshu: 1 }];
        return [];
    }
    function fanpai() {
        var feng_hanzi = ['東','南','西','北'];
        var fanpai_all =[];
        if (check.kezi.z[check.zhuangfeng + 1])
                fanpai_all.push({ name: '翻牌 ' + feng_hanzi[check.zhuangfeng],
                                  fanshu: 1 });
        if (check.kezi.z[check.menfeng + 1])
                fanpai_all.push({ name: '翻牌 ' + feng_hanzi[check.menfeng],
                                  fanshu: 1 });
        if (check.kezi.z[5]) fanpai_all.push({ name: '翻牌 白', fanshu: 1 });
        if (check.kezi.z[6]) fanpai_all.push({ name: '翻牌 發', fanshu: 1 });
        if (check.kezi.z[7]) fanpai_all.push({ name: '翻牌 中', fanshu: 1 });
        return fanpai_all;
    }
    function pinghu() {
        if (check.pinghu)       return [{ name: '平和', fanshu: 1 }];
        return [];
    }
    function duanyaojiu() {
        if (! check.n_yaojiu)   return [{ name: '断幺九', fanshu: 1 }];
        return [];
    }
    function yibeikou() {
        if (! check.menqian)    return [];
        var beikou = 0;
        for (var s in check.shunzi) {
            for (var m in check.shunzi[s]) {
                if (check.shunzi[s][m] > 3) beikou++;
                if (check.shunzi[s][m] > 1) beikou++;
            }
        }
        if (beikou == 1)        return [{ name: '一盃口', fanshu: 1 }];
        return [];
    }
    function sansetongshun() {
        var shunzi = check.shunzi;
        for (var m in shunzi.m) {
            if (shunzi.p[m] && shunzi.s[m])
                return [{ name: '三色同順', fanshu: (check.menqian ? 2 : 1) }];
        }
        return [];
    }
    function yiqitongguan() {
        var shunzi = check.shunzi;
        for (var s in shunzi) {
            if (shunzi[s][123] && shunzi[s][456] && shunzi[s][789])
                return [{ name: '一気通貫', fanshu: (check.menqian ? 2 : 1) }];
        }
        return [];
    }
    function hunquandaiyaojiu() {
        if (check.n_yaojiu == 5 && check.n_shunzi > 0 && check.n_zipai > 0)
                return [{ name: '混全帯幺九', fanshu: (check.menqian ? 2 : 1) }];
        return [];
    }
    function qiduizi() {
        if (mianzi.length == 7)     return [{ name: '七対子', fanshu: 2 }];
        return [];
    }
    function duiduihu() {
        if (check.n_kezi == 4)      return [{ name: '対々和', fanshu: 2 }];
        return [];
    }
    function sananke() {
        if (check.n_ankezi == 3)    return [{ name: '三暗刻', fanshu: 2 }];
        return [];
    }
    function sangangzi() {
        if (check.n_gangzi == 3)    return [{ name: '三槓子', fanshu: 2 }];
        return [];
    }
    function sansetongke() {
        var kezi = check.kezi;
        for (var m in kezi.m) {
            if (kezi.p[m] && kezi.s[m])
                                    return [{ name: '三色同刻', fanshu: 2 }];
        }
        return [];
    }
    function hunlaotou() {
        if (check.n_yaojiu == mianzi.length
            && check.n_shunzi == 0 && check.n_zipai > 0)
                                    return [{ name: '混老頭', fanshu: 2 }];
        return [];
    }
    function xiaosanyuan() {
        if (check.kezi.z[5] + check.kezi.z[6] + check.kezi.z[7] == 2
            && check.jiangpai.match(/^s[567]/))
                                    return [{ name: '小三元', fanshu: 2 }];
        return [];
    }
    function hunyise() {
        for (var s of ['m','p','s']) {
            var yise = new RegExp('^[z' + s + '].*$');
            if (mianzi.filter(function(m){return m.match(yise)}).length
                        == mianzi.length
                &&  check.n_zipai > 0)
                    return [{ name: '混一色', fanshu: (check.menqian ? 3 : 2) }];
        }
        return [];
    }
    function chunquandaiyaojiu() {
        if (check.n_yaojiu == 5 && check.n_shunzi > 0 && check.n_zipai == 0)
                return [{ name: '純全帯幺九', fanshu: (check.menqian ? 3 : 2) }];
        return [];
    }
    function erbeikou() {
        if (! check.menqian)    return [];
        var beikou = 0;
        for (var s in check.shunzi) {
            for (var m in check.shunzi[s]) {
                if (check.shunzi[s][m] > 3) beikou++;
                if (check.shunzi[s][m] > 1) beikou++;
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
                &&  check.n_zipai == 0)
                    return [{ name: '清一色', fanshu: (check.menqian ? 6 : 5) }];
        }
        return [];
    }

    function guoshiwushuang() {
        if (mianzi.length != 13)    return [];
        if (check.danqi)    return [{ name: '国士無双十三面', fanshu: '**' }];
        else                return [{ name: '国士無双', fanshu: '*' }];
    }
    function sianke() {
        if (check.n_ankezi != 4)    return [];
        if (check.danqi)    return [{ name: '四暗刻単騎', fanshu: '**' }];
        else                return [{ name: '四暗刻', fanshu: '*' }];
    }
    function dasanyuan() {
        if (check.kezi.z[5] + check.kezi.z[6] + check.kezi.z[7] == 3)
                            return [{ name: '大三元', fanshu: '*' }];
        return [];
    }
    function sixihu() {
        var kezi = check.kezi;
        if (kezi.z[1] + kezi.z[2] + kezi.z[3] + kezi.z[4] == 4)
                            return [{ name: '大四喜', fanshu: '**' }];
        if (kezi.z[1] + kezi.z[2] + kezi.z[3] + kezi.z[4] == 3
            && check.jiangpai.match(/^s[1234]/))
                            return [{ name: '小四喜', fanshu: '*' }];
        return [];
    }
    function ziyise() {
        if (check.n_zipai == mianzi.length)
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
        if (check.n_kezi == 4 && check.n_yaojiu == 5 && check.n_zipai == 0)
                            return [{ name: '清老頭', fanshu: '*' }];
        return [];
    }
    function sigangzi() {
        if (check.n_gangzi == 4)
                            return [{ name: '四槓子', fanshu: '*' }];
        return [];
    }
    function jiulianbaodeng() {
        if (mianzi.length != 1)             return [];
        if (mianzi[0].match(/^[mps]1112345678999/))
                            return [{ name: '純正九蓮宝燈', fanshu: '**' }];
        else                return [{ name: '九蓮宝燈', fanshu: '*' }];
    }

    var damanguan = (pre_hupai.length && pre_hupai[0].fanshu[0] == '*')
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
function get_post_hupai(mianzi, baopai, fubaopai) {

    var post_hupai = [];
 
    var n_baopai = 0;
    for (var p of baopai) {
        var s = new RegExp('^' + p[0]);
        var n = new RegExp(p[1], 'g');
        for (var m of mianzi) {
            if (m.match(s)) {
                var nn = m.match(n);
                if (nn) n_baopai += nn.length;
            }
        }
    }
    if (n_baopai) post_hupai.push({ name: 'ドラ', fanshu: n_baopai });

    var n_fubaopai = 0;
    for (var p of fubaopai) {
        var s = new RegExp('^' + p[0]);
        var n = new RegExp(p[1], 'g');
        for (var m of mianzi) {
            if (m.match(s)) {
                var nn = m.match(n);
                if (nn) n_fubaopai += nn.length;
            }
        }
    }
    if (n_fubaopai) post_hupai.push({ name: '裏ドラ', fanshu: n_fubaopai });

    return post_hupai;
}

Majiang.Util = {

    xiangting_guoshi: function(shoupai) {
        var n_yaojiu  = 0;
        var you_duizi = false;
        for (var s of ['m','p','s']) {
            var pai = shoupai._shouli[s];
            for (var i of [0, 8]) {
                if (pai[i] > 0) n_yaojiu++;
                if (pai[i] > 1) you_duizi = true;
            }
        }
        var pai = shoupai._shouli.z;
        for (var i = 0; i < pai.length; i++) {
            if (pai[i] > 0) n_yaojiu++;
            if (pai[i] > 1) you_duizi = true;
        }
        return you_duizi ? 12 - n_yaojiu : 13 - n_yaojiu;
    },

    xiangting_qiduizi: function(shoupai) {
        var n_duizi = 0;
        var n_danqi = 0;
        for (var s in shoupai._shouli) {
            var pai = shoupai._shouli[s];
            for (var i = 0; i < pai.length; i++) {
                if      (pai[i] >= 2) n_duizi++;
                else if (pai[i] == 1) n_danqi++;
            }
        }
        if (n_duizi + n_danqi < 7)
                return 6 - n_duizi + (7 - n_duizi - n_danqi);
        else    return 6 - n_duizi;
    },
 
    xiangting_yiban: function(shoupai) {

        var min_xiangting = mianzi_all(shoupai);
    
        for (var sort in shoupai._shouli) {
            for (var i = 0; i < shoupai._shouli[sort].length; i++) {
                if (shoupai._shouli[sort][i] >= 2) {
                    shoupai._shouli[sort][i] -= 2;
                    var xiangting = mianzi_all(shoupai) - 1;
                    shoupai._shouli[sort][i] += 2;
                    if (xiangting < min_xiangting) min_xiangting = xiangting;
                }
            }
        }
    
        return min_xiangting;
    },
 
    xiangting: function(shoupai) {
 
        var min_xiangting = Majiang.Util.xiangting_guoshi(shoupai);
 
        var xiangting = Majiang.Util.xiangting_qiduizi(shoupai);
        if (xiangting < min_xiangting) min_xiangting = xiangting;
 
        var xiangting = Majiang.Util.xiangting_yiban(shoupai);
        if (xiangting < min_xiangting) min_xiangting = xiangting;
 
        return min_xiangting;
    },
 
    tingpai: function(shoupai) {
        var pai = [];
        if (shoupai._zimo) return pai;
        var n_xiangting = Majiang.Util.xiangting(shoupai);
        for (var s in shoupai._shouli) {
            var paishu = shoupai._shouli[s];
            for (var n = 1; n <= paishu.length; n++) {
                paishu[n-1]++;
                if (Majiang.Util.xiangting(shoupai) < n_xiangting) {
                    pai.push(s+n);
                }
                paishu[n-1]--;
            }
        }
        return pai;
    },
 
    hule: function(shoupai, rongpai, param) {
 
        var max = {
            hupai:   null,
            fu:      0,
            fanshu:  0,
            defen:   0,
            fenpei:  [ 0, 0, 0, 0 ],
            manguan: 0,
            dahupai: 0,
            mianzi:  []     // for DEBUG
        };
 
        for (var mianzi of hule_mianzi(shoupai, rongpai)) {
 
            var check = check_mianzi(mianzi, param.zhuangfeng, param.menfeng);
  console.log('check: ', check);
            var hupai = get_hupai(mianzi, check, get_pre_hupai(param.hupai));
            if (hupai.length == 0) continue;
 
            var defen = 0, fanshu = 0, dahupai = 0, manguan = 0;
            var fu = check.fu;
 
            if (hupai[0].fanshu[0] == '*') {
                for (var h of hupai) { dahupai += h.fanshu.match(/\*/g).length }
                defen = 8000 * dahupai;
            }
            else {
                hupai = hupai.concat(
                            get_post_hupai(mianzi, param.baopai, param.fubaopai));
                fanshu = 0;
                for (var h of hupai) { fanshu += h.fanshu }
                if      (fanshu >= 13) { defen = 8000; manguan = 4   }
                else if (fanshu >= 11) { defen = 6000; manguan = 3   }
                else if (fanshu >=  8) { defen = 4000; manguan = 2   }
                else if (fanshu >=  6) { defen = 3000; manguan = 1.5 }
                else {
                    defen = fu * 4;
                    for (var i = 0; i < fanshu; i++) { defen *= 2 }
                    if (defen >= 2000) { defen = 2000; manguan = 1   }
                }
            }
            // 役満の包が未実装
            var fenpei = [ 0, 0, 0, 0]
            var changbang = param.jicun.changbang;
            var lizhibang = param.jicun.lizhibang
            if (rongpai) {
                var baojia = rongpai[2] == '+' ? (param.menfeng + 1) % 4
                           : rongpai[2] == '=' ? (param.menfeng + 2) % 4
                           : rongpai[2] == '-' ? (param.menfeng + 3) % 4
                           : -1;
                defen = Math.ceil(
                            defen * (param.menfeng == 0 ? 6 : 4) / 100
                        ) * 100;
                fenpei[param.menfeng] = + defen + changbang * 300
                                                + lizhibang * 1000;
                fenpei[baojia]        = - defen - changbang * 300;
            }
            else {
                var zhuangjia = Math.ceil(defen * 2 / 100) * 100;
                var xianjia   = Math.ceil(defen     / 100) * 100;
                if (param.menfeng == 0) {
                    defen = zhuangjia * 3;
                    for (var i = 0; i < 4; i++) {
                        if (i == param.menfeng)
                            fenpei[i] = + defen     + changbang * 300
                                                    + lizhibang * 1000;
                        else
                            fenpei[i] = - zhuangjia - changbang * 100;
                    }
                }
                else {
                    defen = zhuangjia + xianjia * 2;
                    for (var i = 0; i < 4; i++) {
                        if (i == param.menfeng)
                            fenpei[i] = + defen     + changbang * 300
                                                    + lizhibang * 1000;
                        else if (i == 0)
                            fenpei[i] = - zhuangjia - changbang * 100;
                        else
                            fenpei[i] = - xianjia   - changbang * 100;
                    }
                }
            }
 
            if (defen + fanshu > max.defen + max.fanshu) {
                max = {
                    hupai:   hupai,
                    fu:      fu,
                    fanshu:  fanshu,
                    defen:   defen,
                    fenpei:  fenpei,
                    manguan: manguan,
                    dahupai: dahupai,
                    mianzi:  mianzi     // for DEBUG
                };
            }
        }
 
        return max;
    }
};

/******************************************************************************

    Model

******************************************************************************/

/*
 *  Majiang.Shan
 */
function zhenbaopai(jiabaipai) {
    if (jiabaipai[0] == 'z') {
        if (jiabaipai[1] < 5) return jiabaipai[0] + (jiabaipai[1] % 4 + 1);
        else                  return jiabaipai[0] + ((jiabaipai[1] - 4) % 3 + 5);
    }
    else                      return jiabaipai[0] + (jiabaipai[1] % 9 + 1);
}

Majiang.Shan = function(pai) {

    if (pai) {
        this._pai = pai;
    }
    else {
        pai = [];
        var sort = ['m', 'p', 's', 'z'];
        for (var s = 0; s < sort.length; s++) {
            for (var n = 1; n <= 9; n++) {
                if (sort[s] != 'z' || n <= 7) {
                    for (var m = 0; m < 4; m++) {
                        pai.push(sort[s]+n);
                    }
                }
            }
        }
        this._pai = [];
        while (pai.length > 0) {
            var r = Math.floor(Math.random()*pai.length);
            var p = pai[r];
            pai.splice(r, 1);
            this._pai.push(p);
        }
    }
 
    this._baopai   = [this._pai[4]];
    this._fubaopai = [this._pai[9]];

    this._weikaigang = false;
}
Majiang.Shan.prototype.paishu = function() {
    return this._pai.length - 14;
}
Majiang.Shan.prototype.zimo = function() {
    if (this.paishu() > 0) return this._pai.pop();
}
Majiang.Shan.prototype.baopai = function() {
    var baopai = [];
    for (var pai of this._baopai) {
        baopai.push(zhenbaopai(pai));
    }
    return baopai;
}
Majiang.Shan.prototype.fubaopai = function() {
    var baopai = [];
    for (var pai of this._fubaopai) {
        baopai.push(zhenbaopai(pai));
    }
    return baopai;
}
Majiang.Shan.prototype.gangzimo = function() {
    if (this.paishu() > 0 && this._baopai.length < 5 && ! this._weikaigang) {
        this._weikaigang = true;
        return this._pai.shift();
    }
}
Majiang.Shan.prototype.kaigang = function() {
    if (this._weikaigang) {
        this._baopai.push(this._pai[4]);
        this._fubaopai.push(this._pai[9]);
        this._weikaigang = false;
    }
}

/*
 *  Majiang.Shoupai
 */
Majiang.Shoupai = function(haipai) {
    this._shouli = {
        m: [0,0,0,0,0,0,0,0,0],
        p: [0,0,0,0,0,0,0,0,0],
        s: [0,0,0,0,0,0,0,0,0],
        z: [0,0,0,0,0,0,0]
    };
    this._fulou = [];
    this._zimo  = null;
    this._lizhi = false;
 
    for (var i = 0; i < haipai.length && i < 13; i++) {
        this._shouli[haipai[i][0]][haipai[i][1] - 1]++;
    }
}
Majiang.Shoupai.fromString = function(paistr) {

	function sort(a, b) {
		return a[0] == b[0] ?  0
			 : a[0] >  b[0] ?  1
			 :                -1;
	}

    var peipai = [];
	var fulou  = paistr.match(/[^,]+/g);
	var shouli = fulou.shift();
    for (var sub of shouli.match(/\d+[mpsz]/g)) {
        var s = sub.substr(-1);
        for (var n of sub.match(/\d/g)) {
            peipai.push(s+n);
        }
    }
    while (peipai.length > 14 - fulou.length * 3) peipai.pop();
    var zimo = (peipai.length - 2) % 3 == 0 && peipai.pop();
    var shoupai = new Majiang.Shoupai(peipai);
    if (zimo) shoupai.zimo(zimo);
	for (var mianzi of fulou) {
		mianzi = mianzi.match(/./g).reverse().join('');
		mianzi = mianzi[0]
               + mianzi.match(/\d[\-\+\=]?/g).sort(sort).join('');
		shoupai._fulou.push(mianzi);
	}
    return shoupai;
}
Majiang.Shoupai.prototype.clone = function() {

    var shoupai = new Majiang.Shoupai([]);
 
    shoupai._shouli = {
        m: this._shouli.m.concat(),
        p: this._shouli.p.concat(),
        s: this._shouli.s.concat(),
        z: this._shouli.z.concat()
    }
    shoupai._fulou = this._fulou.concat();
    shoupai._zimo  = this._zimo;
    shoupai._lizhi = this._lizhi;
 
    return shoupai;
}
Majiang.Shoupai.prototype.toString = function() {

    function reverse(a, b) {
        return a[0] == b[0] ?  0
                     : a[0] <  b[0] ?  1
                     :                -1;
    }

    var paistr = '';
    for (var s of ['m','p','s','z']) {
        var sub = '';
        var pai = this._shouli[s];
        for (var n = 1; n <= pai.length; n++) {
            var num = pai[n-1];
            if (this._zimo && s+n == this._zimo) num--;
            for (var i = 0; i < num; i++) {
                sub += n;
            }
        }
        if (sub.length > 0) sub += s;
        paistr += sub;
    }
    if (this._zimo && this._zimo.length == 2) {
        paistr += this._zimo[1] + this._zimo[0];
    }
    for (var mianzi of this._fulou) {
		mianzi = mianzi[0]
               + mianzi.match(/\d[\-\+\=]?/g).sort(reverse).join('');
		mianzi = mianzi.match(/./g).reverse().join('');
        paistr += ',' + mianzi;
    }
    return paistr;
}
Majiang.Shoupai.prototype.zimo = function(p) {
    if (! this._zimo) {
        this._zimo = p;
        this._shouli[p[0]][p[1] - 1]++;
    }
}
Majiang.Shoupai.prototype.fulou = function(p) {
    if (! this._zimo) {
        var s  = p[0];
        var nn = p.match(/\d(?![\-\+\=])/g);
        this._fulou.push(p);
        for (var n of nn) {
            this._shouli[s][n-1]--;
        }
        if (! p.match(/(\d)\1\1\1/)) this._zimo = p;
    }
}
Majiang.Shoupai.prototype.gang = function(p) {
    if (this._zimo && this._zimo.length == 2) {
        if (this._shouli[p[0]][p[1] - 1] == 4) {
            this._fulou.push(p[0]+p[1]+p[1]+p[1]+p[1]);
        }
        else {
            var regexp = new RegExp('^' + p[0] + p[1] + '{3}');
            for (var i = 0; i < this._fulou.length; i++) {
                if (this._fulou[i].match(regexp)) {
                    this._fulou[i] += p[1];
                }
            }
        }
        this._shouli[p[0]][p[1] - 1] = 0;
        this._zimo = null;
    }
}
Majiang.Shoupai.prototype.dapai = function(p) {
    if (this._zimo) {
        if (this._lizhi && p != this._zimo) return;
        this._zimo = null;
        this._shouli[p[0]][p[1] - 1]--;
        if (p[2] == '*') {
            this._lizhi = true;
        }
    }
}

/*
 *  Majiang.He
 */
Majiang.He = function() {
    this._pai = [];
}
Majiang.He.prototype.dapai = function(p) {
    this._pai.push(p);
}
Majiang.He.prototype.fulou = function(f) {
    this._pai[this._pai.length - 1] += f;
}

/*
 *  Majiang.Audio
 */
Majiang.Audio = {

    _audio: {
        dapai: new Audio('audio/dahai11.wav'),
        chi:   new Audio('audio/chii.wav'),
        peng:  new Audio('audio/pon.wav'),
        gang:  new Audio('audio/kan.wav'),
        lizhi: new Audio('audio/richi.wav'),
        rong:  new Audio('audio/ron.wav'),
        zimo:  new Audio('audio/tsumo.wav'),
        beep:  new Audio('audio/Purr.aiff'),
    },
    volume: function(level) {
        for (var name in this._audio)
            this._audio[name].volume = level / 5;
    },
    play: function(name) {
        this._audio[name].play();
    }
};

/******************************************************************************

    View

******************************************************************************/
Majiang.View = {};

function imgHtml(pai) {
    return pai ? '<img class="pai" data-pai="' + pai
                               + '" src="img/' + pai + '.gif" />'
               : '<img class="pai" src="img/pai.gif" />';
}

/*
 *  Majiang.View.Shoupai
 */
Majiang.View.Shoupai = function(node, shoupai, open) {
    this._node = node;
    this._shoupai = shoupai;
    this._open = open;
}
Majiang.View.Shoupai.prototype.redraw = function() {
 
    var shouli = this._node.find('.shouli');
    shouli.empty();
    for (var s of ['m','p','s','z']) {
        for (var n = 0; n < this._shoupai._shouli[s].length; n++) {
            var pai = s + (n+1);
            var num = this._shoupai._shouli[s][n];
            if (this._shoupai._zimo && pai == this._shoupai._zimo) num--;
            for (var i = 0; i < num; i++) {
                if (! this._open) pai = null;
                shouli.append(imgHtml(pai));
            }
        }
    }
    if (this._shoupai._zimo && this._shoupai._zimo.length == 2) {
        var pai = this._open ? this._shoupai._zimo : null;
        shouli.append('<span class="zimo">' + imgHtml(pai) + '</span>');
    }
 
    var fulou = this._node.find('.fulou');
    fulou.empty();
    for (var mianzi of this._shoupai._fulou) {
        var html = '<span class="mianzi">';
        var s = mianzi[0];
        if (mianzi.match(/^.(?!(\d)\1).*$/)) {              // 顺子
            var nn = (mianzi.match(/\d(?=\-)/)).concat(
                        mianzi.match(/\d(?![\-\+\=])/g));
            html += '<span class="rotate">' + imgHtml(s + nn[0]) + '</span>';
            html += imgHtml(s + nn[1]) + imgHtml(s + nn[2]);
        }
        if (mianzi.match(/^.(\d)\1\1\1?[\-\+\=]\1?$/)) {    // 刻子 or 明杠子
            var n  = mianzi[1];
            var d  = mianzi.match(/[\-\+\=]/).shift();
            var nn = mianzi.match(/\d+/).shift().match(/\d/g);
            var jiagang = (mianzi.match(/[\-\+\=]\d$/) != null);
            var img   = imgHtml(s + n);
            var img_r = '<span class="rotate">'
                        + (jiagang ? img + img : img) + '</span>';
            for (var i = 0; i < nn.length; i++) { nn[i] = img }
            if (d == '-') nn[0]            = img_r;
            if (d == '=') nn[1]            = img_r;
            if (d == '+') nn[nn.length -1] = img_r;
            for (var str of nn) { html += str }
        }
        if (mianzi.match(/^.(\d)\1\1\1$/)) {                // 暗杠子
            n = mianzi[1];
            html += imgHtml() + imgHtml(s + n) + imgHtml(s + n) + imgHtml();
        }
        html += '</span>';
        fulou.prepend($(html));
    }
}

/*
 *  Majiang.View.Shan
 */
Majiang.View.Shan = function(node, shan) {
    this._node = node;
    this._shan = shan;
}
Majiang.View.Shan.prototype.redraw = function() {
    var baopai = this._shan._baopai;
    this._node.find('.baopai .pai').each(function(i){
        $(this).after(
            i < baopai.length ? $(imgHtml(baopai[i])) : $(imgHtml())
        );
        $(this).remove();
    });;
    var fubaopai = this._shan._fubaopai;
    var x = this._node.find('.fubaopai .pai');
    this._node.find('.fubaopai .pai').each(function(i){
        $(this).after(
            i < fubaopai.length ? $(imgHtml(fubaopai[i])) : $(imgHtml())
        );
        $(this).remove();
    });;
    this._node.find('.paishu').text(this._shan.paishu());
}

/*
 *  Majiang.View.He
 */
Majiang.View.He = function(node, lizhi, he) {
    this._node  = node;
    this._lizhi = lizhi;
    this._he    = he;
    this._lizhi.find('.choma').hide();
}
Majiang.View.He.prototype.redraw = function() {
    this._node.empty();
    var lizhi = false;
    var i = 0;
    for (var pai of this._he._pai) {
        if (pai[2] == '*') {
            lizhi = true;
            this._lizhi.find('.choma').show();
        }
        if (pai.match(/[\-\+\=]$/)) continue;
        if (lizhi) {
            this._node.append(
                $('<span class="lizhi">' + imgHtml(pai.substr(0,2)) + '</span>')
            );
            lizhi = false;
        }
        else this._node.append($(imgHtml(pai)));
        i++;
        if (i < 18 && i % 6 == 0) {
            this._node.append($('<span class="break"></span>'))
        }
    }
}
Majiang.View.He.prototype.dapai = function(p) {
    var c = (p[2] == '*') ? 'dapai lizhi' : 'dapai';
    this._node.append(
        $('<span class="' + c + '">' + imgHtml(p.substr(0,2)) + '</span>')
    );
 
}

/*
 *  Majiang.View.Chang
 */
Majiang.View.Chang = function(node, chang) {
    this._node   = node;
    this._chang  = chang;
    this._lunban = [];
}
Majiang.View.Chang.prototype.redraw = function() {
    var menfeng = ['東','南','西','北'];
    var jushu   = ['一','二','三','四'];
    var feng    = ['dong','nan','xi','bei'];

    this._node.find('.title').text(
                menfeng[this._chang.menfeng] + jushu[this._chang.jushu] + '局');
    this._node.find('.jicun .changbang').text(this._chang.jicun.changbang);
    this._node.find('.jicun .lizhibang').text(this._chang.jicun.lizhibang);
    this._node.find('.defen .lunban').removeClass('lunban');
 
    for (var i = 0; i < 4; i++) {
        var id = (this._chang.qijia + this._chang.jushu + i) % 4;
        var defen = '' + this._chang.defen[id];
        defen = defen.replace(/(\d{3})$/, ',$1');
        this._node.find('.defen .' + feng[id]).text(menfeng[i] + ': ' + defen);
    }
}
Majiang.View.Chang.prototype.update = function(lunban) {
    var feng = ['dong','nan','xi','bei'];
    var f = feng[(this._chang.qijia + this._chang.jushu + lunban) % 4];
    this._node.find('.defen .lunban').removeClass('lunban');
    this._node.find('.defen .' + f).addClass('lunban');
}

/*
 *  Majiang.View.Jiesuan
 */
Majiang.View.Jiesuan = function(node, data) {

    var feng_hanzi = ['東','南','西','北'];
    var feng_class = ['dong','nan','xi','bei'];

    this._node = node;
    node.hide();
 
    if (data.type == 'hule') {
 
        node.find('.liuju').hide();
 
        (new Majiang.View.Shan(node.find('.shan'), data.shan)).redraw();
        if (data.shoupai._lizhi) node.find('.fubaopai').show();
        else                     node.find('.fubaopai').hide();
        node.find('.shan').show();
 
        (new Majiang.View.Shoupai(node.find('.shoupai'), data.shoupai, open)).redraw();
        node.find('.shoupai').show();
 
        node.find('.hupai table').empty();
        for (var hupai of data.hupai) {
            var hupai_node = $('<tr><td class="name"></td>'
                             + '<td class="fanshu"></td></tr>');
            hupai_node.find('.name').text(hupai.name);
            if (data.defen.dahupai)
                    hupai_node.find('.fanshu').text(hupai.fanshu);
            else    hupai_node.find('.fanshu').text(hupai.fanshu + '翻');
            node.find('.hupai table').append(hupai_node);
        }
        var gongji_node = $('<tr><td colspan="2" class="gongji"></td></tr>');
        var text = data.defen.fu + '符 ' + data.defen.fanshu + '翻 ';
        if      (data.defen.manguan == 1)   text += '満貫 ';
        else if (data.defen.manguan == 1.5) text += '跳満 ';
        else if (data.defen.manguan == 2)   text += '倍満 ';
        else if (data.defen.manguan == 3)   text += '三倍満 ';
        else if (data.defen.manguan == 4)   text += '数え役満 ';
        if      (data.defen.dahupai == 1)   text  = '役満 ';
        else if (data.defen.dahupai == 2)   text  = 'ダブル役満 ';
        else if (data.defen.dahupai == 3)   text  = 'トリプル役満 ';
        else if (data.defen.dahupai == 4)   text  = '四倍役満 ';
        else if (data.defen.dahupai == 5)   text  = '五倍役満 ';
        else if (data.defen.dahupai == 6)   text  = '六倍役満 ';
        text += data.defen.fen + '点';
        gongji_node.find('.gongji').text(text);
        node.find('.hupai table').append(gongji_node);
        node.find('.hupai').show();
 
        node.find('.jicun .changbang').text(data.chang.jicun.changbang);
        node.find('.jicun .lizhibang').text(data.chang.jicun.lizhibang);
        node.find('.jicun').show();
    }
    else {
        node.find('.liuju').text(data.liuju).show();
        node.find('.shan').hide();
        node.find('.shoupai').hide();
        node.find('.hupai').hide();
        node.find('.jicun').hide();
    }
 
    var zhuangjia = (data.chang.qijia + data.chang.jushu) % 4;
 
    for (var i = 0; i < 4; i++) {
        var id = (zhuangjia + i) % 4;
        var jia = node.find('.fenpei .' + feng_class[id]);

        jia.find('.name').text(feng_hanzi[i] +':');
 
        var defen = '' + data.chang.defen[id];
        defen = defen.replace(/(\d{3})$/, ',$1');
        jia.find('.defen').text(defen);
 
        jia.find('.diff').removeClass('plus');
        jia.find('.diff').removeClass('minus');
        var diff = data.diff[i];
        if      (diff > 0) jia.find('.diff').addClass('plus');
        else if (diff < 0) jia.find('.diff').addClass('minus');
        diff = (diff > 0) ? '+' + diff
             : (diff < 0) ? ''  + diff
             : '';
        diff = diff.replace(/(\d{3})$/, ',$1');
        jia.find('.diff').text(diff);
    }
}
Majiang.View.Jiesuan.prototype.show = function() {
    this._node.fadeIn();
}

/******************************************************************************

    Controller

******************************************************************************/

/*
 *  Majiang.Game
 */

Majiang.Game = function() {
    this._chang = {
        menfeng: 0,
        jushu:   0,
        qijia:   Math.floor(Math.random() * 4),
        jicun:  { changbang: 0, lizhibang: 0 },
        defen:  [ 25000, 25000, 25000, 25000 ]  // 仮親からの順
    };
 
    this._player = [ new Majiang.UI(0) ];       // 仮親は常にUI
    for (var i = 1; i < 4; i++) {
        this._player.push(new Majiang.Player(i));
    }
    this._reply = [];
 
    Majiang.Audio.volume(2);
 
    $('.jiesuan').hide();
}
Majiang.Game.prototype.player = function(lunban) {
    return (this._chang.qijia + this._chang.jushu + lunban) % 4;
}
Majiang.Game.prototype.kaiju = function() {
  console.log('*** 開局 ***');  // for DEBUG

    this._model = {
        shan:    new Majiang.Shan(),
        he:      [],
        shoupai: [],
    };
    this._view = {
        chang:   new Majiang.View.Chang($('.chang'), this._chang),
        shan:    new Majiang.View.Shan($('.shan'), this._model.shan),
        he:      [],
        shoupai: [],
    }
    this._lunban = 0;

    this._view.chang.redraw();

    var haipai = [ [], [], [], [] ];        // この局の東南西北の順
    for (var n = 0; n < 3; n++) {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                haipai[i].push(this._model.shan.zimo());
            }
        }
    }
    for (var i = 0; i < 4; i++) {
        haipai[i].push(this._model.shan.zimo());
    }
 
    var feng = ['dong','nan','xi','bei'];
    for (var i = 0; i < 4; i++) {           // この局の東南西北の順
        this._model.shoupai[i] = new Majiang.Shoupai(haipai[i]);
        this._model.he[i]      = new Majiang.He();

        var f = feng[this.player(i)];
        this._view.shoupai[i]
            = new Majiang.View.Shoupai(
                    $('.shoupai.'+f), this._model.shoupai[i], f == 'dong');
        this._view.he[i] = new Majiang.View.He(
                    $('.he.'+f), $('.lizhi.'+f), this._model.he[i]);

        this._view.shoupai[i].redraw();
        this._view.he[i].redraw();
    }
 
    for (var i = 0; i < 4; i++) {           // この局の東南西北の順
        var data = {
            chang: { /*** 実装要 ***/},
            zifeng: i,
            haipai: haipai[i]
        }
        this._player[this.player(i)].kaiju(data);
    }
 
    this.zimo();
}
Majiang.Game.prototype.zimo = function() {

    var zimo   = this._model.shan.zimo();
    var paishu = this._model.shan.paishu();
    this._model.shoupai[this._lunban].zimo(zimo);

    this._view.chang.update(this._lunban);
    this._view.shan.redraw();
    this._view.shoupai[this._lunban].redraw();

    var self = this;
    this._reply = [];
    for (var i = 0; i < 4; i++) {
        var p = (i == this.player(this._lunban)) ? zimo : null;
        this._player[i].zimo(
            { lunban: self._lunban, zimo: p, paishu: paishu },
            function(id, type, data){self.reply_zimo(id, type, data)},
            1000
        );
    }
}
Majiang.Game.prototype.dapai = function(dapai) {

    Majiang.Audio.play('dapai');

    this._model.shoupai[this._lunban].dapai(dapai);
    this._view.shoupai[this._lunban].redraw();

    this._model.he[this._lunban].dapai(dapai);
    this._view.he[this._lunban].dapai(dapai);
 
    var self = this;
    this._reply = [];
    for (var i = 0; i < 4; i++) {
        this._player[i].dapai(
            { lunban: self._lunban, dapai: dapai },
            function(id, type, data){self.reply_dapai(id, type, data)},
            50
        );
    }
}
Majiang.Game.prototype.fulou = function(data) {

    var f = data.match(/[\-\+\=]/)[0];

    this._model.he[this._lunban].fulou(f);
    this._view.he[this._lunban].redraw();

    var lunban = this._lunban;
    this._lunban = (f == '-') ? (this._lunban + 1) % 4
                 : (f == '=') ? (this._lunban + 2) % 4
                 : (f == '+') ? (this._lunban + 3) % 4
                 :               this._lunban;
    this._view.chang.update(this._lunban);

    this._model.shoupai[this._lunban].fulou(data);
    this._view.shoupai[this._lunban].redraw();

    var self = this;
    this._reply = [];
    if (data.match(/^[mpsz](\d)\1\1\1[\-\+\=]$/)) {
        for (var i = 0; i < 4; i++) {
            this._player[i].gang(
                { lunban: self._lunban, gang: data },
                function(id, type, data){self.reply_gang(id, type, data)},
                1000
            );
        }
    }
    else {
        for (var i = 0; i < 4; i++) {
            this._player[i].fulou(
                { lunban: self._lunban, fulou: data },
                function(id, type, data){self.reply_fulou(id, type, data)},
                1000
            );
        }
    }
}
Majiang.Game.prototype.gang = function(data) {

    this._model.shoupai[this._lunban].gang(data);
    this._view.shoupai[this._lunban].redraw();

    var self = this;
    this._reply = [];
    for (var i = 0; i < 4; i++) {
        this._player[i].gang(
            { lunban: self._lunban, gang: data },
            function(id, type, data){self.reply_gang(id, type, data)},
            1000
        );
    }
}
Majiang.Game.prototype.gangzimo = function() {
 
    var zimo = this._model.shan.gangzimo();
    var paishu = this._model.shan.paishu();
    this._model.shoupai[this._lunban].zimo(zimo);

    this._model.shan.kaigang(); // 明カンの場合はここで開カンしてはいけない。

    this._view.chang.update(this._lunban);
    this._view.shan.redraw();
    this._view.shoupai[this._lunban].redraw();

    var self = this;
    this._reply = [];
    for (var i = 0; i < 4; i++) {
        var p = (i == this.player(this._lunban)) ? zimo : null;
        this._player[i].zimo(
            { lunban: self._lunban, zimo: p, paishu: paishu },
            function(id, type, data){self.reply_zimo(id, type, data)},
            1000
        );
    }
}
Majiang.Game.prototype.liuju = function() {
    this._view.he[this._lunban].redraw();
 
    var self = this;
    var tingpai = [];
    var n_tingpai = 0;
    for (var i  = 0; i < 4; i++) {
        if (Majiang.Util.xiangting(this._model.shoupai[i]) == 0) {
            tingpai[i] = true;
            n_tingpai++;
            this._view.shoupai[i]._open = true;
            (function(){
                var j = i;
                setTimeout(function(){ self._view.shoupai[j].redraw() }, 1000);
            })();
        }
    }
 
    var fenpei = [0,0,0,0];
    if (n_tingpai > 0) {
        for (var i = 0; i < 4; i++) {
            fenpei[i] = tingpai[i] ?  3000 / n_tingpai : -3000 / (4 - n_tingpai);
        }
    }
 
    var self = this;
    var data = {
        type:    'liuju',
        liuju:   '荒牌平局',
        chang:   this._chang,
        shan:    this._model.shan,
        diff:    fenpei,
    };
    (new Majiang.View.Jiesuan($('.jiesuan'), data)).show();
 
    var lianzguang = tingpai[0];
    this._chang.jicun.changbang++;

    $('body').click(function(){
        $('body').unbind('click');
        $('.jiesuan').hide();
        self.jiesuan(data.diff, lianzhuang);
    });
}
Majiang.Game.prototype.hule = function(id) {

    for (var i = 0; i < 4; i++) {
        if (this.player(i) == id) {

            this._view.shoupai[i]._open = true;
            this._view.shoupai[i].redraw();
 
            var rongpai;
            if (! this._model.shoupai[i]._zimo) {
                var he = this._model.he[this._lunban];
                rongpai = he._pai[he._pai.length - 1].substr(0,2);
                rongpai += ['','+','=','-'][(4 + this._lunban - i) % 4];
            }
 
            var param = {
                zhuangfeng: this._chang.menfeng,    // 用語不統一
                menfeng:    i,                      // 用語不統一
                hupai: {
                    lizhi: (this._model.shoupai[i]._lizhi) ? 1 : 0,
                    haidi: (this._model.shan.paishu() > 0) ? 0
                            : ! rongpai                    ? 1
                            :                                2,
                },
                baopai:     this._model.shan.baopai(),
                fubaopai:   (this._model.shoupai[i]._lizhi)
                                ? this._model.shan.fubaopai() : [],
                jicun:      this._chang.jicun
            };
  console.log('param: ', param);

            var hule = Majiang.Util.hule(
                                this._model.shoupai[i], rongpai, param);
  console.log('hule: ', hule);

            var shoupai = this._model.shoupai[i].clone();
            if (rongpai) shoupai.zimo(rongpai.substr(0,2));
 
            var self = this;
            var data = {
                type:    'hule',
                chang:   this._chang,
                shan:    this._model.shan,
                shoupai: shoupai,
                hupai:   hule.hupai,
                defen:   {  fu:      hule.fu,
                            fanshu:  hule.fanshu,
                            fen:     hule.defen,    // 用語不統一
                            manguan: hule.manguan,
                            dahupai: hule.dahupai   },
                diff:    hule.fenpei,               // 用語不統一
            };
            (new Majiang.View.Jiesuan($('.jiesuan'), data)).show();

            this._chang.jicun.lizhibang = 0;

            var lianzhuang = i == 0;
            if (lianzhuang) this._chang.jicun.changbang++;
            else            this._chang.jicun.changbang = 0;

            $('body').click(function(){
                $('body').unbind('click');
                $('.jiesuan').hide();
                self.jiesuan(hule.fenpei, lianzhuang);
            });

        }
    }
}
Majiang.Game.prototype.jiesuan = function(fenpei, lianzhuang) {

    for (var i = 0; i < 4; i++) {
        this._chang.defen[this.player(i)] += fenpei[i];
    }

    this._view.chang.redraw();

    if (! lianzhuang) {
        this._chang.jushu++;
        if (this._chang.jushu == 4) {
            this._chang.menfeng++;
            this._chang.jushu = 0;
        }
        if (this._chang.menfeng == 2) return;
    }
 
    var self = this;
    setTimeout(function(){ self.kaiju() }, 1000);
}
Majiang.Game.prototype.reply_zimo = function(id, type, data) {
//  console.log('[' + id +'] (' + type + ', ' + data + ')');  // for DEBUG

    this._reply.push( { id: id, type: type, data: data } );
    if (this._reply.length < 4) return;

    var self = this;
    for (var reply of this._reply) {
 
        if (reply.id != this.player(this._lunban)) continue;
 
        if (reply.type == 'dapai') {
            if (reply.data[2] == '*' && this.player(this._lunban) != 0) {
                Majiang.Audio.play('lizhi');
                var dapai = reply.data;
                setTimeout(function(){ self.dapai(dapai) }, 1000);
            }
            else this.dapai(reply.data);
        }
        else if (reply.type == 'gang') {
            if (this.player(this._lunban) != 0) {
                Majiang.Audio.play('gang');
                var gang = reply.data;
                setTimeout(function(){ self.gang(gang) }, 1000);
            }
            else this.gang(reply.data);
        }
        else if (reply.type == 'hule') {
            if (this.player(this._lunban) != 0) {
                Majiang.Audio.play('zimo');
                var id = reply.id;
                setTimeout(function(){ self.hule(id) }, 1000);
            }
            else this.hule(reply.id);
        }
    }
}
Majiang.Game.prototype.reply_dapai = function(id, type, data) {
  console.log('[' + id +'] (' + type + ', ' + data + ')');  // for DEBUG
 
    this._reply.push( { id: id, type: type, data: data } );
    if (this._reply.length < 4) return;

    var self = this;
    var hule = [];
    for (var reply of this._reply) {
        if (reply.type == 'hule') hule.push(reply.id);
    }
    if (hule.length > 0) {
        Majiang.Audio.play('rong');
        var id = hule[0];       // 要修正。ダブロン、三家和の考慮なし。
        setTimeout(function(){ self.hule(id) }, 1000);
        return;
    }
 
    var he = this._model.he[this._lunban];
    if (he._pai[he._pai.length-1][2] == '*') {
        this._chang.defen[this.player(this._lunban)] -= 1000;
        this._chang.jicun.lizhibang++;
        this._view.chang.redraw();
    }
 
    for (var reply of this._reply) {
        if (reply.type == 'fulou' && reply.data.match(/^[mpsz](\d)\1\1\1/)) {
            if (reply.id != 0) {
                Majiang.Audio.play('gang');
                var gang = reply.data;
                setTimeout(function(){ self.fulou(gang) }, 1000);
            }
            else this.fulou(reply.data);
            return;
        }
        if (reply.type == 'fulou' && reply.data.match(/^[mpsz](\d)\1\1/)) {
            if (reply.id != 0) {
                Majiang.Audio.play('peng');
                var peng = reply.data;
                setTimeout(function(){ self.fulou(peng) }, 1000);
            }
            else this.fulou(reply.data);
            return;
        }
    }
    for (var reply of this._reply) {
        if (reply.type == 'fulou') {
            if (reply.id != 0) {
                Majiang.Audio.play('chi');
                var chi = reply.data;
                setTimeout(function(){ self.fulou(chi) }, 1000);
            }
            else this.fulou(reply.data);
            return;
        }
    }
 
    if (this._model.shan.paishu() == 0) {
        this.liuju();
        return;
    }

    this._view.he[this._lunban].redraw();

    this._lunban = (this._lunban + 1) % 4;
    this._view.chang.update(this._lunban);
 
    this.zimo();
}
Majiang.Game.prototype.reply_fulou = function(id, type, data) {
  console.log('[' + id +'] (' + type + ', ' + data + ')');  // for DEBUG

    this._reply.push( { id: id, type: type, data: data } );
    if (this._reply.length < 4) return;

    for (var reply of this._reply) {
        if (reply.id != this.player(this._lunban)) continue;
        if (reply.type == 'dapai') this.dapai(reply.data);
    }
}
Majiang.Game.prototype.reply_gang = function(id, type, data) {
  console.log('[' + id +'] (' + type + ', ' + data + ')');  // for DEBUG

    this._reply.push( { id: id, type: type, data: data } );
    if (this._reply.length < 4) return;

    var self = this;
    var hule = [];
    for (var reply of this._reply) {
        if (reply.type == 'hule') hule.push(reply.id);
    }
    if (hule.length > 0) {
        Majiang.Audio.play('rong');
        var id = hule[0];       // 要修正。ダブロン、三家和の考慮なし。
        setTimeout(function(){ self.hule(id) }, 1000);
        return;
    }

    for (var reply of this._reply) {
        if (reply.id == this.player(this._lunban)) this.gangzimo();
    }
}

/*
 *  Majiang.Player
 */

function paili(shoupai, xiangting) {
    var dapai = {};
    if (! shoupai._zimo) return dapai;
    var n_xiangting = xiangting(shoupai);
    var zimo = shoupai._zimo;
    shoupai._zimo = null;
    for (var s in shoupai._shouli) {
        var paishu = shoupai._shouli[s];
        for (var n = 1; n <= paishu.length; n++) {
            if (paishu[n-1] == 0) continue;
            paishu[n-1]--;
            if (xiangting(shoupai) == n_xiangting) {
                dapai[s+n] = Majiang.Util.tingpai(shoupai);
            }
            paishu[n-1]++;
        }
    }
    shoupai._zimo = zimo;
    return dapai;
}

Majiang.Player = function(id) {
    this._id = id;
}
Majiang.Player.prototype.kaiju = function(data) {
  console.log('=> [' + this._id +'] (kaiju, ' + data.zifeng + ')');  // for DEBUG

    this._zifeng = data.zifeng;
    this._shoupai = new Majiang.Shoupai(data.haipai);
    this._dapai = {};
    this._neng_rong = true;
}
Majiang.Player.prototype.zimo = function(data, callback, timeout) {
  console.log('=> [' + this._id +'] (zimo, ' + data.zimo + ')');  // for DEBUG
 
    var id = this._id;
    this._paishu = data.paishu;
 
    if (data.lunban != this._zifeng) {
        setTimeout(function(){ callback(id, '') }, timeout);
        return;
    }
 
    this._shoupai.zimo(data.zimo);

    if (Majiang.Util.xiangting(this._shoupai) == -1) {
        setTimeout(function(){ callback(id, 'hule') }, timeout);
        return;
    }
    var gang = this._select_gang();
    if (gang) {
        setTimeout(function(){ callback(id, 'gang', gang) }, timeout);
        return;
    }
    if (this._shoupai._lizhi) {
        setTimeout(function(){ callback(id, 'dapai', data.zimo) }, timeout);
        return;
    }

    var dapai = this._select_dapai();
    var mianqing
        = (this._shoupai._fulou.filter(
                    function(mianzi){return mianzi.match(/[\-\+\=]/)}
                ).length == 0);
    var xiangting = Majiang.Util.xiangting(this._shoupai);
    if (mianqing && xiangting == 0 && this._paishu >= 4) dapai += '*';
    setTimeout(function(){ callback(id, 'dapai', dapai) }, timeout);
}
Majiang.Player.prototype.dapai = function(data, callback, timeout) {
  console.log('=> [' + this._id +'] (dapai, ' + data.dapai + ')');  // for DEBUG

    var id = this._id;

    if (data.lunban == this._zifeng) {
        this._shoupai.dapai(data.dapai);
        this._dapai[data.dapai] = true;
        if (! this._shoupai._lizhi) this._neng_rong = true;
        if (Majiang.Util.xiangting(this._shoupai) == 0) {
            for (var p of Majiang.Util.tingpai(this._shoupai)) {
                if (this._dapai[p]) this._neng_rong = false;
            }
        }
        setTimeout(function(){ callback(id, '') }, timeout);
        return;
    }

    this._shoupai._shouli[data.dapai[0]][data.dapai[1]-1]++;
    var xiangting = Majiang.Util.xiangting(this._shoupai);
    this._shoupai._shouli[data.dapai[0]][data.dapai[1]-1]--;
    if (xiangting == -1 && this._neng_rong) {
        if (this._shoupai._lizhi) {
            setTimeout(function(){ callback(id, 'hule') }, timeout);
            return;
        }
        else {
            this._neng_rong = false;
        }
    }

    var fulou = this._select_fulou(data);
    if (fulou) setTimeout(function(){ callback(id, 'fulou', fulou) }, timeout);
    else       setTimeout(function(){ callback(id, '') }, timeout);
}
Majiang.Player.prototype.fulou = function(data, callback, timeout) {
  console.log('=> [' + this._id +'] (fulou, ' + data.fulou + ')');  // for DEBUG

    var id = this._id;

    if (data.lunban != this._zifeng) {
        setTimeout(function(){ callback(id, '') }, timeout);
        return;
    }

    this._shoupai.fulou(data.fulou);
 
    var dapai = this._select_dapai();
    setTimeout(function(){ callback(id, 'dapai', dapai) }, timeout);
}
Majiang.Player.prototype.gang = function(data, callback, timeout) {
  console.log('=> [' + this._id +'] (gang, ' + data.gang + ')');  // for DEBUG

    var id = this._id;

    if (data.lunban == this._zifeng) {
        if (this._shoupai._zimo) this._shoupai.gang(data.gang);
        else                     this._shoupai.fulou(data.gang);
        setTimeout(function(){ callback(id, '') }, timeout);
        return;
    }

    this._shoupai._shouli[data.gang[0]][data.gang[1]-1]++;
    var xiangting = Majiang.Util.xiangting(this._shoupai);
    this._shoupai._shouli[data.gang[0]][data.gang[1]-1]--;
    if (xiangting == -1 && this._neng_rong) {
        if (this._shoupai._lizhi) {
            setTimeout(function(){ callback(id, 'hule') }, timeout);
            return;
        }
        else {
            this._neng_rong = false;
        }
    }
    setTimeout(function(){ callback(id, '') }, timeout);
}
Majiang.Player.prototype._select_dapai = function() {

    var dapai = paili(this._shoupai, Majiang.Util.xiangting);

    var selected, max = 0;
    for (var p in dapai) {
        if (dapai[p].length >= max) {
            max = dapai[p].length;
            selected = p;
        }
    }
    return selected;
}
Majiang.Player.prototype._select_fulou = function(data) {

    function check_xiangting(shoupai, mianzi) {
        var tmp_shoupai = shoupai.clone();
        tmp_shoupai.fulou(mianzi);
        if (mianzi.match(/(\d)\1\1\1/)) {
            if (Majiang.Util.xiangting(tmp_shoupai) <= xiangting) return mianzi;
        }
        else if (Majiang.Util.xiangting(tmp_shoupai) < xiangting) return mianzi;
    }
 
    return;             // とりあえず今は鳴かない

    if (this._shoupai._lizhi) return;
    if (this._paishu == 0) return;

    var xiangting = Majiang.Util.xiangting(this._shoupai);
    if (xiangting == 0) return;
 
    var s = data.dapai[0], n = data.dapai[1] - 0;
    var f = [null, '+', '=', '-'][(4 + data.lunban - this._zifeng) % 4];

    var pai = this._shoupai._shouli[s];

    if (pai[n-1] == 3) {
        var mianzi = s+n+n+n+n+f;
        return check_xiangting(this._shoupai, mianzi);
    }
    if (pai[n-1] >= 2) {
        var mianzi = s+n+n+n+f;
        return check_xiangting(this._shoupai, mianzi);
    }
    if (s != 'z' && f == '-') {
        if (2 <= n && n <= 8 && pai[n-2] > 0 && pai[n] > 0) {
            var mianzi = s+(n-1)+(n+f)+(n+1);
            return check_xiangting(this._shoupai, mianzi);
        }
        if (3 <= n && pai[n-3] > 0 && pai[n-2] > 0) {
            var mianzi = s+(n-2)+(n-1)+(n+f);
            return check_xiangting(this._shoupai, mianzi);
        }
        if (n <= 7 && pai[n] > 0 && pai[n+1] > 0) {
            var mianzi = s+(n+f)+(n+1)+(n+2);
            return check_xiangting(this._shoupai, mianzi);
        }
    }
    return;
}
Majiang.Player.prototype._select_gang = function() {

    function check_xiangting(shoupai, mianzi) {
        var tmp_shoupai = shoupai.clone();
        tmp_shoupai.gang(mianzi);
        if (Majiang.Util.xiangting(tmp_shoupai) <= xiangting) return mianzi;
    }

    if (this._paishu == 0) return;

    var xiangting = Majiang.Util.xiangting(this._shoupai);
 
    for (var s in this._shoupai._shouli) {
        var pai = this._shoupai._shouli[s];
        for (var n = 1; n <= pai.length; n++) {
            if (pai[n-1] == 0) continue;
            if (pai[n-1] == 4) {
                var mianzi = s+n+n+n+n;
                return check_xiangting(this._shoupai, mianzi);
            }
            else {
                var regexp = new RegExp('^' + s + n + '{3}');
                for (var mianzi of this._shoupai._fulou) {
                    if (mianzi.match(regexp)) {
                        var mianzi = mianzi+n;
                        return check_xiangting(this._shoupai, mianzi);
                    }
                }
            }
        }
    }
    return;
}

/*
 *  Majiang.UI
 */

function get_chi_mianzi(shoupai, dapai) {
    var s = dapai[0];
    var n = dapai[1] - 1;
    var pai = shoupai._shouli[s];
    var chi_mianzi = [];
    if (s == 'z') return chi_mianzi;
    if (n > 1 && pai[n-2] > 0 && pai[n-1] > 0) {
        chi_mianzi.push(s + (n-1) + n + (n+1) + '-');
    }
    if (n < 7 && pai[n+1] > 0 && pai[n+2] > 0) {
        chi_mianzi.push(s + (n+1) + '-' + (n+2) + (n+3));
    }
    if (n > 0 && n < 8 && pai[n-1] > 0 && pai[n+1] > 0) {
        chi_mianzi.push(s + n + (n+1) + '-' + (n+2));
    }
    return chi_mianzi;
}
function set_chi_event(chi_mianzi, id, callback) {
 
    function handler(event) {
        var fulou = event.data;
        var s = fulou[0];
        var nn = fulou.match(/\d(?!\-)/g);
        var node = $('.shoupai.dong .shouli');
        var img;
        if ($(this).data('pai') == s+nn[0])
                img = node.find('.pai[data-pai="'+s+nn[1]+'"]').eq(0);
        else    img = node.find('.pai[data-pai="'+s+nn[0]+'"]').eq(-1);
        node.find('.pai').removeClass('selected').removeClass('dapai');
        $(this).addClass('selected');
        img.addClass('selected');
    }
 
    var pai = {};
    for (var fulou of chi_mianzi) {
        var s = fulou[0];
        for (var n of fulou.match(/\d(?!\-)/g)) {
            pai[s+n] = fulou;
        }
    }
    for (var p in pai) {
        $('.shoupai.dong .shouli .pai[data-pai="'+p+'"]')
            .addClass('dapai')
            .bind('mouseover', pai[p], handler)
            .bind('click', pai[p], function(event){
                callback(id, 'fulou', event.data);
            });
    }
}
function get_gang_mianzi(shoupai) {
    var gang_mianzi = [];
    for (var s in shoupai._shouli) {
        var pai = shoupai._shouli[s];
        for (var n = 1; n <= pai.length; n++) {
            if (pai[n-1] == 0) continue;
            if (pai[n-1] == 4) {
                gang_mianzi.push(s+n+n+n+n);
            }
            else {
                var regexp = new RegExp('^' + s + n + '{3}');
                for (var mianzi of shoupai._fulou) {
                    if (mianzi.match(regexp)) gang_mianzi.push(mianzi+n);
                }
            }
        }
    }
    return gang_mianzi;
}
function set_gang_event(gang_mianzi, id, callback) {
    var pai = {};
    for (var fulou of gang_mianzi) {
        pai[fulou.substr(0,2)] = fulou;
    }
    for (var p in pai) {
        $('.shoupai.dong .shouli .pai[data-pai="'+p+'"]')
            .addClass('dapai')
            .bind('click', pai[p], function(event){
                callback(id, 'gang', event.data);
            });
    }
}
function get_dapai_of_lizhi(shoupai) {
    var dapai = [];
    if (shoupai._lizhi) return dapai;
    if (shoupai._fulou.filter(
            function(mianzi){return mianzi.match(/[\-\+\=]/)}).length > 0)
        return dapai;
    if (Majiang.Util.xiangting(shoupai) > 0) return dapai;
    for (var s in shoupai._shouli) {
        var paishu = shoupai._shouli[s];
        for (var n = 1; n <= paishu.length; n++) {
            if (paishu[n-1] ==0) continue;
            paishu[n-1]--;
            if (Majiang.Util.xiangting(shoupai) == 0) {
                dapai.push(s+n);
            }
            paishu[n-1]++;
        }
    }
    return dapai;
}
function set_lizhi_event(dapai, id, callback) {
    for (var p of dapai) {
        $('.shoupai.dong .shouli .pai[data-pai="'+p+'"]')
            .addClass('dapai')
            .bind('click', p+'*', function(event){
                callback(id, 'dapai', event.data);
            });
    }
}

Majiang.UI = function(id) {
    this._id = id;
    $('.UI span').hide();
}
Majiang.UI.prototype.kaiju = function(data) {
  console.log('=> [' + this._id +'] (kaiju, ' + data.zifeng + ')');  // for DEBUG
    this._zifeng = data.zifeng;
    this._shoupai = new Majiang.Shoupai(data.haipai);
    this._dapai = {};
    this._neng_rong = true;
}
Majiang.UI.prototype.zimo = function(data, callback, timeout) {
  console.log('=> [' + this._id +'] (zimo, ' + data.zimo + ')');  // for DEBUG
    $('.UI.resize').width($('.shoupai.dong .shouli').width());
    var id = this._id;
    this._paishu = data.paishu;
    if (data.lunban != this._zifeng) {
        setTimeout(function(){ callback(id, '') }, timeout);
        return;
    }
 
    this._shoupai.zimo(data.zimo);
  console.log('    '+this._shoupai.toString());  // for DEBUG
 
    var action = false;
    // リーチできるかチェックする。
    var dapai = get_dapai_of_lizhi(this._shoupai);
    if (dapai.length > 0 && this._paishu >= 4) {
        var self = this;
        $('.UI .lizhi').bind('click', function(){
            $('body').unbind('click');
            $('.UI span').unbind('click');
            $('.UI span').hide();
            $('.shoupai.dong .shouli .pai').unbind('click');
            Majiang.Audio.play('lizhi');
            set_lizhi_event(dapai, id, callback);
            return false;
        }).show();
        action = true;
    }
    if (Majiang.Util.xiangting(this._shoupai) == -1) {
        $('.UI .zimo').bind('click', function(){
            $('body').unbind('click');
            $('.UI span').unbind('click');
            $('.UI span').hide();
            $('.shoupai.dong .shouli .pai').unbind('click');
            Majiang.Audio.play('zimo');
            callback(id, 'hule')
            return false;
        }).show();
        action = true;
    }
    // 暗カンもしくは加カンできるかチェックする。後で共通化する。
    var gang_mianzi = get_gang_mianzi(this._shoupai);
    if (gang_mianzi.length == 1) {
        $('.UI .gang').bind('click', function(){
            $('body').unbind('click');
            $('.UI span').unbind('click');
            $('.UI span').hide();
            $('.shoupai.dong .shouli .pai').unbind('click');
            Majiang.Audio.play('gang');
            callback(id, 'gang', gang_mianzi[0])
            return false;
        }).show();
        action = true;
    }
    if (gang_mianzi.length > 1) {
        $('.UI .gang').bind('click', function(){
            $('body').unbind('click');
            $('.UI span').unbind('click');
            $('.UI span').hide();
            $('.shoupai.dong .shouli .pai').unbind('click');
            Majiang.Audio.play('gang');
            set_gang_event(gang_mianzi, id, callback);
            return false;
        }).show();
        action = true;
    }

    var self = this;
    if (this._shoupai._lizhi) {
        if (action) {
            $('body').bind('click', function(){
                $('body').unbind('click');
                $('.UI span').unbind('click');
                $('.UI span').hide();
                callback(id, 'dapai', data.zimo);
                return false;
            });
        }
        else setTimeout(function(){ callback(id, 'dapai',  data.zimo) }, timeout);
    }
    else {
        $('.shoupai.dong .shouli .pai').each(function(){
            var dapai = $(this).data('pai');
            $(this).bind('click', dapai, function(event){
                $('.UI span').hide();
                $('.shoupai.dong .shouli .pai').unbind('click');
                callback(id, 'dapai', event.data);
                return false;
            });
        });
    }
}
Majiang.UI.prototype.dapai = function(data, callback, timeout) {
  console.log('=> [' + this._id +'] (dapai, ' + data.dapai + ')');  // for DEBUG
    $('.UI.resize').width($('.shoupai.dong .shouli').width());
    var id = this._id;
    if (data.lunban == this._zifeng) {
        this._shoupai.dapai(data.dapai);
        this._dapai[data.dapai] = true;
        if (! this._shoupai._lizhi) this._neng_rong = true;
        if (Majiang.Util.xiangting(this._shoupai) == 0) {
            for (var p of Majiang.Util.tingpai(this._shoupai)) {
                if (this._dapai[p]) this._neng_rong = false;
            }
        }
  console.log('    neng_rong: '+this._neng_rong);  // for DEBUG
        setTimeout(function(){ callback(id, '') }, timeout);
        return;
    }
    var action = false;
    var self = this;
    // ロンできるかチェックする。修正要(役あり)
    this._shoupai._shouli[data.dapai[0]][data.dapai[1]-1]++;
    var xiangting = Majiang.Util.xiangting(this._shoupai);
    this._shoupai._shouli[data.dapai[0]][data.dapai[1]-1]--;
    if (xiangting == -1 && this._neng_rong) {
        $('.UI .rong').bind('click', function(){
            $('.shoupai.dong .shouli .pai').unbind('click');
            $('body').unbind('click');
            $('.UI span').unbind('click');
            $('.UI span').hide();
            Majiang.Audio.play('rong');
            callback(id, 'hule');
            return false;
        }).show();
        action = true;
    }
    // 大明カンできるかチェックする。後で共通化する。
    if (! this._shoupai._lizhi
        && this._shoupai._shouli[data.dapai[0]][data.dapai[1]-1] == 3
        && this._paishu > 0)
    {
        var f = [null, '+', '=', '-']
        var mianzi
            = data.dapai[0] + data.dapai[1] + data.dapai[1] + data.dapai[1]
            + data.dapai[1]+ f[(4 + data.lunban - this._zifeng) % 4];
        $('.UI .gang').bind('click', mianzi, function(event){
            $('.shoupai.dong .shouli .pai').unbind('click');
            $('body').unbind('click');
            $('.UI span').unbind('click');
            $('.UI span').hide();
            Majiang.Audio.play('gang');
            callback(id, 'fulou', event.data);
            return false;
        }).show();
        action = true;
    }
    // ポンできるかチェックする。後で共通化する。
    if (! this._shoupai._lizhi
        && this._shoupai._shouli[data.dapai[0]][data.dapai[1]-1] >= 2
        && this._paishu > 0)
    {
        var f = [null, '+', '=', '-']
        var mianzi
            = data.dapai[0] + data.dapai[1] + data.dapai[1] + data.dapai[1]
            + f[(4 + data.lunban - this._zifeng) % 4];
        $('.UI .peng').bind('click', mianzi, function(event){
            $('.shoupai.dong .shouli .pai').unbind('click');
            $('body').unbind('click');
            $('.UI span').unbind('click');
            $('.UI span').hide();
            Majiang.Audio.play('peng');
            callback(id, 'fulou', event.data);
            return false;
        }).show();
        action = true;
    }
    // チーできるかチェックする。後で共通化する。
    if (! this._shoupai._lizhi
        && (data.lunban + 1) % 4 == this._zifeng
        && this._paishu > 0)
    {
        var chi_mianzi = get_chi_mianzi(this._shoupai, data.dapai);
        if (chi_mianzi.length == 1) {
            $('.UI .chi').bind('click', function(){
                $('.shoupai.dong .shouli .pai').unbind('click');
                $('body').unbind('click');
                $('.UI span').unbind('click');
                $('.UI span').hide();
                Majiang.Audio.play('chi');
                callback(id, 'fulou', chi_mianzi[0]);
                return false;
            }).show();
            action = true;
        }
        if (chi_mianzi.length > 1) {
            $('.UI .chi').bind('click', function(){
                $('.shoupai.dong .shouli .pai').unbind('click');
                $('body').unbind('click');
                $('.UI span').unbind('click');
                $('.UI span').hide();
                Majiang.Audio.play('chi');
                set_chi_event(chi_mianzi, id, callback);
                return false;
            }).show();
            action = true;
        }
    }
    if (action) {
        $('body').bind('click', function(){
            $('body').unbind('click');
            $('.UI span').unbind('click');
            $('.UI span').hide();
            if (xiangting == -1) self._neng_rong = false;
            callback(id, '');
            return false;
        });
    }
    else setTimeout(function(){ callback(id, '') }, timeout);
}
Majiang.UI.prototype.fulou = function(data, callback, timeout) {
  console.log('=> [' + this._id +'] (fulou, ' + data.fulou + ')');  // for DEBUG
    $('.UI.resize').width($('.shoupai.dong .shouli').width());
    var id = this._id;
    if (data.lunban != this._zifeng) {
        setTimeout(function(){ callback(id, '') }, timeout);
        return;
    }
    this._shoupai.fulou(data.fulou);
    var self = this;
    $('.shoupai.dong .shouli .pai').each(function(){
        var dapai = $(this).data('pai');
        $(this).bind('click', dapai, function(event){
            $('.UI span').hide();
            $('.shoupai.dong .shouli .pai').unbind('click');
            self._shoupai.dapai(dapai);
            callback(id, 'dapai', event.data);
            return false;
        });
    });
}
Majiang.UI.prototype.gang = function(data, callback, timeout) {
  console.log('=> [' + this._id +'] (gang, ' + data.gang + ')');  // for DEBUG
    $('.UI.resize').width($('.shoupai.dong .shouli').width());
    var id = this._id;
    if (data.lunban == this._zifeng) {
        if (this._shoupai._zimo) this._shoupai.gang(data.gang);
        else                     this._shoupai.fulou(data.gang);
        setTimeout(function(){ callback(id, '') }, timeout);
        return;
    }
    // 槍槓できるかチェックする。
    var action = false;
    var self = this;
    this._shoupai._shouli[data.gang[0]][data.gang[1]-1]++;
    var xiangting = Majiang.Util.xiangting(this._shoupai);
    this._shoupai._shouli[data.gang[0]][data.gang[1]-1]--;
    if (xiangting == -1) {
        $('.UI .rong').bind('click', function(){
            $('.shoupai.dong .shouli .pai').unbind('click');
            $('body').unbind('click');
            $('.UI span').unbind('click');
            $('.UI span').hide();
            Majiang.Audio.play('rong');
            callback(id, 'hule');
            return false;
        }).show();
        action = true;
    }
    if (action) {
        $('body').bind('click', function(){
            $('body').unbind('click');
            $('.UI span').unbind('click');
            $('.UI span').hide();
            if (xiangting == -1) self._neng_rong = false;
            callback(id, '');
            return false;
        });
    }
    else setTimeout(function(){ callback(id, '') }, timeout);
}

})();
