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
    if (hupai.yifa)       pre_hupai.push({ name: '一発', fanshu: 1 });
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
            && check.jiangpai.match(/^z[567]/))
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
            menfeng[this._chang.zhuangfeng] + jushu[this._chang.jushu] + '局');
    this._node.find('.jicun .changbang').text(this._chang.jicun.changbang);
    this._node.find('.jicun .lizhibang').text(this._chang.jicun.lizhibang);
    this._node.find('.defen .lunban').removeClass('lunban');
 
    for (var i = 0; i < 4; i++) {
        var id = (this._chang.qijia + this._chang.jushu + i) % 4;
        var defen = '' + this._chang.defen[id];
        defen = defen.replace(/(\d)(\d{3})$/, '$1,$2');
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
        defen = defen.replace(/(\d)(\d{3})$/, '$1,$2');
        jia.find('.defen').text(defen);
 
        jia.find('.diff').removeClass('plus');
        jia.find('.diff').removeClass('minus');
        var diff = data.diff[i];
        if      (diff > 0) jia.find('.diff').addClass('plus');
        else if (diff < 0) jia.find('.diff').addClass('minus');
        diff = (diff > 0) ? '+' + diff
             : (diff < 0) ? ''  + diff
             : '';
        diff = diff.replace(/(\d)(\d{3})$/, '$1,$2');
        jia.find('.diff').text(diff);
    }
}
Majiang.View.Jiesuan.prototype.show = function() {
    this._node.fadeIn();
}

/*
 *  Majiang.View.Zongjiesuan
 */
Majiang.View.Zongjiesuan = function(node, data) {

    var feng_hanzi  = ['東','南','西','北'];
    var feng_class  = ['dong','nan','xi','bei'];
    var jushu_hanzi = ['一','二','三','四'];

    this._node = node;
    node.hide();
 
    for (var l = 0; l < 4; l++) {
        var feng = feng_class[l];
        node.find('thead .'+ feng).text(data.name[l]);
    }
 
    node.find('tbody').empty();
    for (var jiesuan of data.jiesuan) {
 
        var jiesuan_node
            = $('<tr>'
                + '<td class="jushu"></td>'
                + '<td class="changbang"></td>'
                + '<td class="jieguo"></td>'
                + '<td class="dong"></td>'
                + '<td class="nan"></td>'
                + '<td class="xi"></td>'
                + '<td class="bei"></td>'
                + '</tr>'
            );

        var jushu = feng_hanzi[jiesuan.zhuangfeng]
                  + jushu_hanzi[jiesuan.jushu]
                  + '局';
        jiesuan_node.find('.jushu').text(jushu);
 
        var changbang = jiesuan.changbang + '本場';
        jiesuan_node.find('.changbang').text(changbang);
 
        var jieguo = jiesuan.type == 'liuju' ? '流局'
                   : jiesuan.data.rongpai    ? 'ロン'
                   :                           'ツモ';
        jiesuan_node.find('.jieguo').text(jieguo);
 
        for (var l = 0; l < 4; l++) {
            var id = (data.qijia + jiesuan.jushu + l) % 4;
            var feng = feng_class[id];
            if (l == 0) jiesuan_node.find('.'+ feng).addClass('zhuangjia');
            var defen = jiesuan.data.fenpei[l];
            if (jiesuan.type == 'hule') {
                if (jiesuan.data.lunban == l)
                    jiesuan_node.find('.'+ feng).addClass('hule');
                if (jiesuan.data.rongpai && defen < 0)
                    jiesuan_node.find('.'+ feng).addClass('beirong');
            }
            defen = defen > 0 ? '+' + defen
                  : defen < 0 ? ''  + defen
                  :             '';
            defen = defen.replace(/(\d)(\d{3})$/, '$1,$2');
            jiesuan_node.find('.'+ feng).text(defen);
        }

        node.find('tbody').append(jiesuan_node);
    }
 
    for (var l = 0; l < 4; l++) {
        var feng = feng_class[l];

        var weici  = '';
        node.find('tfoot .defen .' + feng).removeClass('guanjun');
        node.find('tfoot .defen .' + feng).removeClass('pochan');
        if (data.weici[l] == 1)
            node.find('tfoot .defen .' + feng).addClass('guanjun');
        if (data.defen[l] < 0)
            node.find('tfoot .defen .' + feng).addClass('pochan');

        var defen = '' + data.defen[l];
        defen = defen.replace(/(\d)(\d{3})$/, '$1,$2');
        node.find('tfoot .defen .' + feng).text(defen);

        node.find('tfoot .jiezhang .' + feng).removeClass('plus');
        node.find('tfoot .jiezhang .' + feng).removeClass('minus');
        if (data.jiezhang[l] > 0)
            node.find('tfoot .jiezhang .' + feng).addClass('plus');
        if (data.jiezhang[l] < 0)
            node.find('tfoot .jiezhang .' + feng).addClass('minus');
        var jiezhang
            = data.jiezhang[l] > 0 ? '+' + data.jiezhang[l] : data.jiezhang[l];
        node.find('tfoot .jiezhang .'+ feng).text(jiezhang);
    }
}
Majiang.View.Zongjiesuan.prototype.show = function() {
    this._node.fadeIn();
}

/******************************************************************************

    Controller

******************************************************************************/

/*
 *  Majiang.Game
 */

Majiang.Game = function() {

    this._timeout = 1000;
    this._callback = function(){ new Majiang.Game().kaiju() };
 
    this._chang = {
        zhuangfeng: 0,
        jushu:      0,
        qijia:      Math.floor(Math.random() * 4),
        jicun:      { changbang: 0, lizhibang: 0 },
        name:       ['あなた','下家','対面','上家'],
        defen:      [ 25000, 25000, 25000, 25000 ], // 仮親からの順
        jiesuan:    []
    };
 
    this._player = [ new Majiang.UI(0) ];           // 仮親は常にUI
    for (var id = 1; id < 4; id++) {
        this._player[id] = new Majiang.Player(id);
    }
    this._reply = [];
}

Majiang.Game.prototype.player_id = function(lunban) {
    return (this._chang.qijia + this._chang.jushu + lunban) % 4;
}

Majiang.Game.prototype.call_players = function(type, msg, delay) {

    var self = this;

    this._status = type;
 
    this._reply = [];
    for (var l = 0; l < 4; l++) {
        (function(){
            var id = self.player_id(l);
            var lb = l;
            var timeout = self._player[id] instanceof Majiang.UI ? 0 : delay;
            setTimeout(function(){
                self._player[id].action(type, msg[lb], function(type, reply){
                    self.next(id, type || '', reply)
                });
            }, timeout);
        })();
    }
}

Majiang.Game.prototype.notify_players = function(type, msg) {

    for (var l = 0; l < 4; l++) {
        var id = this.player_id(l);
        this._player[id].action(type, msg[l]);
    }
}

Majiang.Game.prototype.next = function(id, type, data) {
//  console.log(' => ['+id+']', type, data);

    var self = this;
 
    this._reply[id] = { type: type, data: data };
    if (this._reply.filter(function(x){return x}).length < 4) return;
 
    if      (this._status == 'zimo')     this.reply_zimo()
    else if (this._status == 'gangzimo') this.reply_zimo()
    else if (this._status == 'dapai')    this.reply_dapai()
    else if (this._status == 'fulou')    this.reply_fulou()
    else if (this._status == 'gang')     this.reply_gang()
    else if (this._status == 'hule')     this.reply_hule()
    else if (this._status == 'liuju')    this.reply_liuju()
    else if (this._status == 'finish')   this.reply_finish()
    else throw new Error('**** 状態不正 ****', this._status);
}

Majiang.Game.prototype.reply_zimo = function() {
 
    var self = this;

    var reply = this._reply[this.player_id(this._lunban)];
 
    if (reply.type == 'liuju' && this._diyizimo) {
        setTimeout(function(){ self.liuju('九種九牌') }, this._timeout);
    }
    else if (reply.type == 'hule') {
        this.audio_play('zimo', this._lunban, function(){
            self.hule()
        });
    }
    else if (reply.type == 'gang') {
        this.audio_play('gang', this._lunban, function(){
            self.gang(reply.data)
        });
    }
    else if (reply.type == 'dapai') {
        if (reply.data[2] == '*') {
            this.audio_play('lizhi', this._lunban, function(){
                self.dapai(reply.data)
            });
        }
        else this.dapai(reply.data);
    }
    else throw new Error('*** 不正応答 ***');
}

Majiang.Game.prototype.reply_dapai = function() {
 
    var self = this;

    var hule = [];
    for (var i = 1; i < 4; i++) {
        var lunban = (this._lunban + i) % 4;
        var reply = this._reply[this.player_id(lunban)];
        if (reply.type == 'hule')  hule.push(lunban);
    }
    if (hule.length == 3) {
        setTimeout(function(){ self.liuju('三家和') }, this._timeout);
        return;
    }
    if (hule.length  > 0) {
        this.audio_play('rong');
        setTimeout(function(){ self.hule(hule[0]) }, this._timeout);
        return;
    }
 
    if (this._dapai[2] == '*') {
        this._chang.defen[this.player_id(this._lunban)] -= 1000;
        this._chang.jicun.lizhibang++;
        this._view.chang.redraw();

        if (this._lizhi.filter(function(x){return x}).length == 4) {
            setTimeout(function(){ self.liuju('四家立直') }, this._timeout);
            return;
        }
    }
 
    for (var i = 0; i < 4; i++) {
        var lunban = (this._lunban + i) % 4;
        var reply = this._reply[this.player_id(lunban)];
        if (reply.type == 'fulou')  {
            if (reply.data.match(/^[mpsz](\d)\1\1\1/)) {
                this.audio_play('gang', lunban, function(){
                    self.fulou(reply.data)
                });
                return;
            }
            else if (reply.data.match(/^[mpsz](\d)\1\1/)) {
                this.audio_play('peng', lunban, function(){
                    self.fulou(reply.data)
                });
                return;
            }
        }
    }
    for (var i = 0; i < 4; i++) {
        var lunban = (this._lunban + i) % 4;
        var reply = this._reply[this.player_id(lunban)];
        if (reply.type == 'fulou')  {
            this.audio_play('chi', lunban, function(){
                self.fulou(reply.data)
            });
            return;
        }
    }

    this.zimo();
}

Majiang.Game.prototype.reply_fulou = function() {

    var self = this;

    var reply = this._reply[this.player_id(this._lunban)];
    if (reply.type == 'dapai') {
        this.dapai(reply.data);
    }
    else throw new Error('*** 不正応答 ***');
}

Majiang.Game.prototype.reply_gang = function() {
 
    var self = this;

    var hule = [];
    for (var i = 1; i < 4; i++) {
        var lunban = (this._lunban + i) % 4;
        reply = this._reply[this.player_id(lunban)];
        if (reply.type == 'hule')  hule.push(lunban);
    }
    if (hule.length == 3) {
        setTimeout(function(){ self.liuju('三家和') }, this._timeout);
        return;
    }
    if (hule.length  > 0) {
        this.audio_play('rong');
        setTimeout(function(){ self.hule(hule[0]) }, this._timeout);
        return;
    }
 
    var reply = this._reply[this.player_id(this._lunban)];
    this.gangzimo(reply.data);
}

Majiang.Game.prototype.reply_hule = function() {
    $('.jiesuan').hide();
    this.jiesuan();
}

Majiang.Game.prototype.reply_liuju = function() {
    $('.jiesuan').hide();
    this.jiesuan();
}

Majiang.Game.prototype.reply_finish = function() {
    $('.zongjiesuan').hide();
    this._callback();
}

Majiang.Game.prototype.audio_play = function(name, lunban, callback) {
    var audio_off
            = lunban != null
                && this._player[this.player_id(lunban)] instanceof Majiang.UI
            || this._timeout < 500;
    if (callback) {
        if (audio_off) callback();
        else {
            Majiang.Audio.play(name);
            setTimeout(callback, this._timeout);
        }
    }
    else if (! audio_off) Majiang.Audio.play(name);
}

Majiang.Game.prototype.create_view = function() {

    this._view = {
        chang:   new Majiang.View.Chang($('.chang'), this._chang),
        shan:    new Majiang.View.Shan($('.shan'), this._model.shan),
        he:      [],
        shoupai: [],
    };

    var feng_class = ['dong','nan','xi','bei'];
    for (var l = 0; l < 4; l++) {
        var c = feng_class[this.player_id(l)];
        this._view.shoupai[l]
            = new Majiang.View.Shoupai(
                    $('.shoupai.'+c), this._model.shoupai[l], c == 'dong');
        this._view.he[l] = new Majiang.View.He(
                    $('.he.'+c), $('.lizhi.'+c), this._model.he[l]);
    }
}

Majiang.Game.prototype.kaiju = function() {

    this._model = {
        shan:    new Majiang.Shan(),
        he:      [],
        shoupai: [],
    };

    this._lunban    = -1;

    this._diyizimo  = true;
    this._lizhi     = [0,0,0,0];
    this._yifa      = [0,0,0,0];
    this._gang      = [0,0,0,0];
    this._dafengpai = true;
    this._dapai     = null;
    this._gangpai   = null;
    this._kaigang   = false;
 
    var qipai = [ [], [], [], [] ];
    for (var n = 0; n < 3; n++) {
        for (var l = 0; l < 4; l++) {
            for (var i = 0; i < 4; i++) {
                qipai[l].push(this._model.shan.zimo());
            }
        }
    }
    for (var l = 0; l < 4; l++) {
        qipai[l].push(this._model.shan.zimo());
    }
 
    for (var l = 0; l < 4; l++) {
        this._model.shoupai[l] = new Majiang.Shoupai(qipai[l]);
        this._model.he[l]      = new Majiang.He();
    }
 
    this.create_view();
    this._view.chang.redraw();
    this._view.shan.redraw();
    for (var l = 0; l < 4; l++) {
        this._view.shoupai[l].redraw();
        this._view.he[l].redraw();
    }
 
    var msg = [];
    var chang = {
        zhuangfeng: this._chang.zhuangfeng,
        jushu:      this._chang.jushu,
        changbang:  this._chang.jicun.changbang,
        lizhibang:  this._chang.jicun.lizhibang,
        baopai:     this._model.shan.baopai()[0],
        defen:      []
    };
    for (var l = 0; l < 4; l++) {
        chang.defen[l] = this._chang.defen[this.player_id(l)];
    }
    for (var l = 0; l < 4; l++) {
        msg[l] = { chang: chang, menfeng: l, qipai: qipai[l] }
    }
    this.notify_players('kaiju', msg);
 
    var self = this;
    setTimeout(function(){ self.zimo() }, this._timeout);
}

Majiang.Game.prototype.zimo = function() {

    var self = this;

    this._gangpai = null;

    if (this._lunban >= 0) this._view.he[this._lunban].redraw();

    if (this._model.shan.paishu() == 0) {
        setTimeout(function(){ self.liuju('荒牌平局') }, this._timeout);
        return;
    }

    this._lunban = (this._lunban + 1) % 4;
 
    var zimo   = this._model.shan.zimo();
    var paishu = this._model.shan.paishu();
 
    this._model.shoupai[this._lunban].zimo(zimo);

    this._view.chang.update(this._lunban);
    this._view.shan.redraw();
    this._view.shoupai[this._lunban].redraw();
 
    var msg = [];
    for (var l = 0; l < 4; l++) {
        var lb = this._lunban;
        msg[l] = { lunban: lb, zimo: (l == lb ? zimo : ''), paishu: paishu };
    }
    this.call_players('zimo', msg, this._timeout);
}

Majiang.Game.prototype.dapai = function(dapai) {
 
    var self = this;
 
    if (this._kaigang) this.kaigang();
    if (this._model.shan.baopai().length == 5) {
        for (var l = 0; l < 4; l++) {
            if (0 < this._gang[l] && this._gang[l] < 4) {
                setTimeout(function(){ self.liuju('四開槓') }, this._timeout);
                return;
            }
        }
    }
 
    this._yifa[this._lunban] = false;

    this._model.shoupai[this._lunban].dapai(dapai);
    this._model.he[this._lunban].dapai(dapai);

    this._view.shoupai[this._lunban].redraw();
    this.audio_play('dapai');
    this._view.he[this._lunban].dapai(dapai);
 
    if (this._diyizimo) {
        if (! dapai.match(/^z[1234]/))  this._dafengpai = false;
        else if (this._lunban != 0
                 && dapai.substr(0,2) != this._dapai.substr(0,2))
                                        this._dafengpai = false;
        if (this._lunban == 3 && this._dafengpai) {
            setTimeout(function(){ self.liuju('四風連打') }, this._timeout);
            return;
        }
    }
 
    if (dapai[2] == '*') {
        this._lizhi[this._lunban] = this._diyizimo ? 2 : 1;
        this._yifa[this._lunban]  = true;
    }

    this._dapai = dapai;

    if (this._diyizimo && this._lunban == 3) {
        this._diyizimo = false;
    }

    var msg = [];
    for (var l = 0; l < 4; l++) {
        msg[l] = { lunban: this._lunban, dapai: dapai };
    }
    this.call_players('dapai', msg);
}

Majiang.Game.prototype.fulou = function(fulou) {

    var self = this;

    if (this._diyizimo) this._diyizimo = false;
    for (var l = 0; l < 4; l++) {
        this._yifa[l] = false;
    }
    this._dapai = null;

    var d = fulou.match(/[\-\+\=]/)[0];
 
    this._model.he[this._lunban].fulou(d);
    this._view.he[this._lunban].redraw();
 
    this._lunban = (d == '-') ? (this._lunban + 1) % 4
                 : (d == '=') ? (this._lunban + 2) % 4
                 : (d == '+') ? (this._lunban + 3) % 4
                 :               this._lunban;
    this._view.chang.update(this._lunban);
 
    this._model.shoupai[this._lunban].fulou(fulou);
    this._view.shoupai[this._lunban].redraw();

    var msg = [];
    if (fulou.match(/^[mpsz](\d)\1\1\1/)) {
        for (var l = 0; l < 4; l++) {
            msg[l] = { lunban: this._lunban, gang: fulou };
        }
        this.call_players('gang', msg, this._timeout);
    }
    else {
        for (var l = 0; l < 4; l++) {
            msg[l] = { lunban: this._lunban, fulou: fulou };
        }
        this.call_players('fulou', msg, this._timeout);
    }
}

Majiang.Game.prototype.gang = function(gang) {

    var self = this;

    if (this._diyizimo) this._diyizimo = false;
    for (var l = 0; l < 4; l++) {
        this._yifa[l] = false;
    }
    this._dapai = null;

    if (this._model.shan.baopai().length == 5) {
        for (var l = 0; l < 4; l++) {
            if (0 < this._gang[l] && this._gang[l] < 4) {
                setTimeout(function(){ self.liuju('四開槓') }, this._timeout);
                return;
            }
        }
    }

    this._model.shoupai[this._lunban].gang(gang);
    this._view.shoupai[this._lunban].redraw();
 
    this._gang[this._lunban]++;
    this._gangpai = gang;

    var msg = [];
    for (var l = 0; l < 4; l++) {
        msg[l] = { lunban: this._lunban, gang: gang };
    }
    this.call_players('gang', msg);
}

Majiang.Game.prototype.gangzimo = function(gang) {

    var self = this;
 
    if (this._kaigang) this.kaigang();

    var zimo   = this._model.shan.gangzimo();
    var paishu = this._model.shan.paishu();
 
    this._model.shoupai[this._lunban].zimo(zimo);
 
    if (gang && gang.match(/^[mpsz](\d)\1\1\1$/)) this.kaigang();
    else this._kaigang = true;

    this._view.chang.update(this._lunban);
    this._view.shan.redraw();
    this._view.shoupai[this._lunban].redraw();

    var msg = [];
    for (var l = 0; l < 4; l++) {
        var lb = this._lunban;
        msg[l] = { lunban: lb, zimo: (l == lb ? zimo : ''), paishu: paishu };
    }
    setTimeout(function(){ self.call_players('gangzimo', msg) }, this._timeout);
}

Majiang.Game.prototype.kaigang = function() {

    this._model.shan.kaigang();
    this._view.shan.redraw();

    var baopai = this._model.shan.baopai().pop();
    this._kaigang = false;
 
    var msg = [];
    for (var l = 0; l < 4; l++) {
        msg[l] = { baopai: baopai };
    }
    this.notify_players('kaigang', msg);
}

Majiang.Game.prototype.hule = function(lunban) {

    if (this._kaigang) this.kaigang();

    var rongpai;
    if (lunban != null) {
        rongpai = (this._status == 'gang') ? this._gangpai : this._dapai;
        rongpai = rongpai.substr(0,2)
                + ['','+','=','-'][(4 + this._lunban - lunban) % 4];
    }
    var lunban = lunban != null ? lunban : this._lunban;
 
    this._view.shoupai[lunban]._open = true;
    this._view.shoupai[lunban].redraw();

    var param = {
        zhuangfeng: this._chang.zhuangfeng,
        menfeng:    lunban,
        hupai: {
            lizhi:      this._lizhi[lunban],
            yifa:       this._yifa[lunban],
            qianggang:  this._status == 'gang',
            lingshang:  this._status == 'gangzimo',
            tianhu:     this._diyizimo && ! rongpai && lunban == 0,
            dihu:       this._diyizimo && ! rongpai && lunban != 0,
            haidi:      (this._model.shan.paishu() > 0) ? 0
                         : this._status == 'zimo'       ? 1
                         : this._status == 'dapai'      ? 2
                         :                                0,
        },
        baopai:     this._model.shan.baopai(),
        fubaopai:   this._lizhi[lunban] ? this._model.shan.fubaopai() : [],
        jicun:      this._chang.jicun
    };

    var hule = Majiang.Util.hule(this._model.shoupai[lunban], rongpai, param);

    var shoupai = this._model.shoupai[lunban].clone();
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
 
    data = {
        lunban:     lunban,
        rongpai:    rongpai,
        shoupai:    shoupai,
        hupai:      hule.hupai,
        defen:      {   fu:      hule.fu,
                        fanshu:  hule.fanshu,
                        fen:     hule.defen,    // 用語不統一
                        manguan: hule.manguan,
                        dahupai: hule.dahupai   },
        fenpei:     hule.fenpei,
    };
    this._chang.jiesuan.push({
        zhuangfeng: this._chang.zhuangfeng,
        jushu:      this._chang.jushu,
        changbang:  this._chang.jicun.changbang,
        type:       'hule',
        data:       data
    });

    this._chang.jicun.lizhibang = 0;

    this._lianzhuang = lunban == 0;
    if (this._lianzhuang) this._chang.jicun.changbang++;
    else                  this._chang.jicun.changbang = 0;

    for (var l = 0; l < 4; l++) {
        this._chang.defen[this.player_id(l)] += data.fenpei[l];
    }
 
    var msg = [];
    for (var l = 0; l < 4; l++) {
        msg[l] = JSON.parse(JSON.stringify(data));
    }
    this.call_players('hule', msg, this._timeout * 5);
}

Majiang.Game.prototype.liuju = function(name) {

    var self = this;

    var fenpei = [0,0,0,0];
    if (this._model.shan.paishu() == 0) {
 
        var tingpai = [];
        var n_tingpai = 0;
        for (var l = 0; l < 4; l++) {
            if (Majiang.Util.xiangting(this._model.shoupai[l]) == 0) {
                tingpai[l] = true;
                n_tingpai++;
                this._view.shoupai[l]._open = true;
                this._view.shoupai[l].redraw();
            }
        }
 
        var liuju_manguan = false;
        for (var l = 0; l < 4; l++) {
            var all_yaojiu = true;
            for (var p of this._model.he[l]._pai) {
                if (p.match(/[\-\+\=]$/)) { all_yaojiu = false; break }
                if (p.match(/^z/))          continue;
                if (p.match(/^[mps][19]/))  continue;
                all_yaojiu = false; break;
            }
            if (all_yaojiu) {
                name = '流し満貫';
                liuju_manguan = true;
                for (var ll = 0; ll < 4; ll++) {
                    fenpei[ll] += l == 0 && ll == l ? 12000
                                : l == 0            ? -4000
                                : l != 0 && ll == l ?  8000
                                : l != 0 && ll == 0 ? -4000
                                :                     -2000;
                }
            }
        }
 
        if (! liuju_manguan && 0 < n_tingpai && n_tingpai < 4) {
            for (var l = 0; l < 4; l++) {
                fenpei[l] = tingpai[l] ?  3000 / n_tingpai
                                       : -3000 / (4 - n_tingpai);
            }
        }
    }
    else if (name == '九種九牌') {
        this._view.shoupai[this._lunban]._open = true;
        this._view.shoupai[this._lunban].redraw();
    }
    else if (name == '四家立直') {
        this._view.he[this._lunban].redraw()
        for (var l = 0; l < 4; l++) {
            this._view.shoupai[l]._open = true;
            this._view.shoupai[l].redraw();
        }
    }
 
    var data = {
        type:    'liuju',
        liuju:   name,
        chang:   this._chang,
        shan:    this._model.shan,
        diff:    fenpei,
    };
    (new Majiang.View.Jiesuan($('.jiesuan'), data)).show();

    data = {
        liuju:      name,
        fenpei:     fenpei,
    }
    this._chang.jiesuan.push({
        zhuangfeng: this._chang.zhuangfeng,
        jushu:      this._chang.jushu,
        changbang:  this._chang.jicun.changbang,
        type:       'liuju',
        data:       data
    });

    if (this._model.shan.paishu() == 0) {
        this._lianzhuang = tingpai[0];
        this._chang.jicun.changbang++;
    }
    else this._lianzhuang = true;

    for (var l = 0; l < 4; l++) {
        this._chang.defen[this.player_id(l)] += data.fenpei[l];
    }
 
    var msg = [];
    for (var l = 0; l < 4; l++) {
        msg[l] = JSON.parse(JSON.stringify(data));
    }
    this.call_players('liuju', msg, this._timeout * 5);
}

Majiang.Game.prototype.jiesuan = function() {

    var self = this;

    this._view.chang.redraw();

    if (! this._lianzhuang) {
        this._chang.jushu++;
        if (this._chang.jushu == 4) {
            this._chang.zhuangfeng++;
            this._chang.jushu = 0;
        }
    }
 
    var finish = false;
    var guanjun = -1;
    var defen = this._chang.defen;
    for (var i = 0; i < 4; i++) {
        var id = (this._chang.qijia + i) % 4;
        if (defen[id] < 0) finish = true;
        if (defen[id] >= 30000
            && (guanjun == -1 || defen[id] > defen[guanjun])) guanjun = id;
    }
    
    if      (this._chang.zhuangfeng == 3) finish = true;
    else if (this._chang.zhuangfeng == 2) {
        if (guanjun != -1) finish = true;
    }
    else if (this._chang.zhuangfeng == 1 && this._chang.jushu == 3) {
        if (guanjun == this.player_id(0) && this._lianzhuang) finish = true;
    }

    if (finish)
        setTimeout(function(){ self.finish() }, this._timeout);
    else
        setTimeout(function(){ self.kaiju() }, this._timeout);
}

Majiang.Game.prototype.finish = function() {

    var paiming = [];
    for (var i = 0; i < 4; i++) {
        var id = (this._chang.qijia + i) % 4;
        for (var j = 0; j <= paiming.length; j++) {
            if (j == paiming.length
                || this._chang.defen[id] > this._chang.defen[paiming[j]])
            {
                paiming.splice(j, 0, id);
                break;
            }
        }
    }
    var weici = [];
    for (var i = 0; i < 4; i++) {
        weici[paiming[i]] = i + 1;
    }
 
    var jiezhang = [];
    var sum = 0;
    for (var pm = 1; pm < 4; pm++) {
        var id = paiming[pm];
        jiezhang[id]
            = Math.floor((this._chang.defen[id]
                + (   pm == 1 ?  10000
                    : pm == 2 ? -10000
                    : pm == 3 ? -20000
                    :                0  )
                - 30000) / 1000);
        sum += jiezhang[id];
    }
    jiezhang[paiming[0]] = 0 - sum;
 
    var data = {
        name:       this._chang.name,
        qijia:      this._chang.qijia,
        jiesuan:    this._chang.jiesuan,
        defen:      this._chang.defen,
        weici:      weici,
        jiezhang:   jiezhang
    };
 
    new Majiang.View.Zongjiesuan($('.zongjiesuan'), data).show();
 
    data = { weici: weici, jiezhang: jiezhang };
    var msg = [];
    for (var l = 0; l < 4; l++) {
        msg[l] = JSON.parse(JSON.stringify(data));
    }
    this.call_players('finish', msg, this._timeout * 5);
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

Majiang.Player.prototype.action = function(type, data, callback) {
//  console.log('['+this._id+']', type, data);
 
    if      (type == 'kaiju')    this.kaiju(data);
    else if (type == 'zimo')     this.zimo(data, callback);
    else if (type == 'dapai')    this.dapai(data, callback);
    else if (type == 'fulou')    this.fulou(data, callback);
    else if (type == 'gang')     this.gang(data, callback);
    else if (type == 'kaigang')  this.kaigang(data);
    else if (type == 'gangzimo') this.zimo(data, callback, 'lingshang');
    else if (type == 'hule')     this.hule(data, callback);
    else if (type == 'liuju')    this.liuju(data, callback);
    else if (type == 'finish')   this.finish(data, callback);
    else                         throw '*** 未実装 ***';
}

Majiang.Player.prototype.kaiju = function(data) {

    this._chang     = data.chang;
    this._menfeng   = data.menfeng;
 
    this._shoupai   = new Majiang.Shoupai(data.qipai);
    this._dapai     = {};
    this._neng_rong = true;
 
    this._baopai    = [ data.chang.baopai ];
    this._diyizimo  = true;
    this._lizhi     = [];
    this._kaigang   = [];
 
    this._menqian   = true;     // Majiang.Shoupai で判定できるようにする。
}

Majiang.Player.prototype.zimo = function(data, callback, option) {

    this._paishu = data.paishu;
 
    if (data.lunban != this._menfeng) { callback(); return }
 
    this._shoupai.zimo(data.zimo);

    var gang;
    if      (this.select_liuju())       callback('liuju');
    else if (this.select_hule(null, option))
                                        callback('hule');
    else if (gang = this.select_gang()) callback('gang', gang);
    else                                callback('dapai', this.select_dapai());
 
    this._diyizimo = false;
}

Majiang.Player.prototype.dapai = function(data, callback) {

    if (data.dapai[2] == '*') {
        this._lizhi[data.lunban] = this._diyizimo ? 2 : 1;
    }
    var dapai = data.dapai.substr(0,2);

    if (data.lunban == this._menfeng) {
        this._shoupai.dapai(data.dapai);
        this._dapai[dapai] = true;
        if (! this._shoupai._lizhi) this._neng_rong = true;
        if (Majiang.Util.xiangting(this._shoupai) == 0) {
            for (var p of Majiang.Util.tingpai(this._shoupai)) {
                if (this._dapai[p]) this._neng_rong = false;
            }
        }
        callback();
        return;
    }

    var fulou;
    if      (this.select_hule(data))          callback('hule');
    else if (fulou = this.select_fulou(data)) callback('fulou', fulou);
    else                                      callback();

    var new_shoupai = this._shoupai.clone();
    new_shoupai.zimo(dapai);
    if (Majiang.Util.xiangting(new_shoupai) == -1) {
        this._neng_rong = false;
    }
}

Majiang.Player.prototype.fulou = function(data, callback) {

    this._diyizimo = false;
 
    if (data.lunban != this._menfeng) {
        callback();
        return;
    }
 
    this._shoupai.fulou(data.fulou);
    this._menqian = false;
 
    callback('dapai', this.select_dapai());
}

Majiang.Player.prototype.gang = function(data, callback) {

    this._diyizimo = false;

    if (data.lunban == this._menfeng) {
        if (this._shoupai._zimo) this._shoupai.gang(data.gang);
        else {
            this._shoupai.fulou(data.gang);
            this._menqian = false;
        }
        callback();
        return;
    }

    if (! data.gang.match(/^[mpsz](\d)\1\1\1/)) {
 
        if (this.select_hule(data, 'qianggang')) callback('hule');
        else {
            var new_shoupai = this._shoupai.clone();
            new_shoupai.zimo(data.gang.substr(0,2));
            if (Majiang.Util.xiangting(new_shoupai) == -1) {
                this._neng_rong = false;
            }
            callback();
        }
    }
    else callback();
}

Majiang.Player.prototype.kaigang = function(data) {

    this._baopai.push(data.baopai);
}

Majiang.Player.prototype.hule = function(data, callback) {
    callback();
}

Majiang.Player.prototype.liuju = function(data, callback) {
    callback();
}

Majiang.Player.prototype.finish = function(data, callback) {
    callback();
}

Majiang.Player.prototype.jiuzhongyaojiu = function() {

    if (! this._diyizimo) return false;
    if (this._lunban != this._menfeng) return false;
    if (! this._shoupai._zimo) return false;

    var n_yaojiu = 0;
    for (var s of  ['m','p','s']) {
        for (var n of [1, 9]) {
            if (this._shoupai._shouli[s][n-1] > 0) n_yaojiu++;
        }
    }
    for (var n = 1; n <= 7; n++) {
        if (this._shoupai._shouli.z[n-1] > 0) n_yaojiu++;
    }
    return (n_yaojiu >= 9);
}

Majiang.Player.prototype.allow_lizhi = function() {

    return (! this._shoupai._lizhi && this._menqian
            && Majiang.Util.xiangting(this._shoupai) == 0
            && this._paishu >= 4 && this._chang.defen[this._menfeng] >= 1000)
}

Majiang.Player.prototype.allow_hule = function(data, option) {

    var rongpai = data && (data.dapai ? data.dapai.substr(0,2)
                                      : data.gang.substr(0,2));

    if (rongpai && ! this._neng_rong) return;
 
    var new_shoupai = this._shoupai.clone();
    if (rongpai) new_shoupai.zimo(rongpai);
    if (Majiang.Util.xiangting(new_shoupai) != -1) return false;

    if (rongpai) {
        rongpai += ['','+','=','-'][(4 + data.lunban - this._menfeng) % 4];
    }
    var l = this._menfeng;
    var param = {
        zhuangfeng: this._chang.zhuangfeng,
        menfeng:    l,
        hupai: {
            lizhi:      this._lizhi[l],
            yifa:       false,              // 後で実装する
            qianggang:  (option == 'qianggang'),
            lingshang:  (option == 'lingshang'),
            tianhu:     this._diyizimo && ! rongpai && l == 0,
            dihu:       this._diyizimo && ! rongpai && l != 0,
            haidi:      (this._paishu > 0) ? 0
                         : ! rongpai       ? 1
                         :                   2,
        },
        baopai:     this._baopai,
        fubaopai:   [],
        jicun:      { changbang: this._chang.changbang,
                      lizhibang: this._chang.lizhibang  }
    };
    var hule = Majiang.Util.hule(this._shoupai, rongpai, param);

    return hule.hupai;
}

Majiang.Player.prototype.get_chi_mianzi = function(data) {

    var mianzi = [];

    if (this._paishu == 0) return mianzi;
    if (this._shoupai._lizhi) return mianzi;

    var s = data.dapai[0], n = data.dapai[1] - 0;
    var d = ['','+','=','-'][(4 + data.lunban - this._menfeng) % 4];

    var pai = this._shoupai._shouli[s];

    if (s != 'z' && d == '-') {
        if (3 <= n && pai[n-3] > 0 && pai[n-2] > 0) {
            mianzi.push(s+(n-2)+(n-1)+(n+d));
        }
        if (n <= 7 && pai[n] > 0 && pai[n+1] > 0) {
            mianzi.push(s+(n+d)+(n+1)+(n+2));
        }
        if (2 <= n && n <= 8 && pai[n-2] > 0 && pai[n] > 0) {
            mianzi.push(s+(n-1)+(n+d)+(n+1));
        }
    }
    return mianzi;
}

Majiang.Player.prototype.get_peng_mianzi = function(data) {

    var mianzi = [];

    if (this._paishu == 0) return mianzi;
    if (this._shoupai._lizhi) return mianzi;

    var s = data.dapai[0], n = data.dapai[1] - 0;
    var d = ['','+','=','-'][(4 + data.lunban - this._menfeng) % 4];

    var pai = this._shoupai._shouli[s];

    if (pai[n-1] >= 2) mianzi = [ s+n+n+n+d ];
    return mianzi;
}

Majiang.Player.prototype.get_gang_mianzi = function(data) {

    var mianzi = [];

    if (this._paishu == 0) return mianzi;

    if (data) {
        if (this._shoupai._lizhi) return mianzi;
 
        var s = data.dapai[0], n = data.dapai[1] - 0;
        var d = ['','+','=','-'][(4 + data.lunban - this._menfeng) % 4];

        var pai = this._shoupai._shouli[s];

        if (pai[n-1] == 3) mianzi = [ s+n+n+n+n+d ];
    }
    else {
        for (var s in this._shoupai._shouli) {
            var pai = this._shoupai._shouli[s];
            for (var n = 1; n <= pai.length; n++) {
                if (pai[n-1] == 0) continue;
                if (pai[n-1] == 4) mianzi.push(s+n+n+n+n);
                else {
                    var regexp = new RegExp('^' + s + n + '{3}');
                    for (var fulou of this._shoupai._fulou) {
                        if (fulou.match(regexp)) mianzi.push(fulou+n);
                    }
                }
            }
        }
    }
    return mianzi;
}

Majiang.Player.prototype.select_liuju = function() {

    if (Majiang.Util.xiangting(this._shoupai) < 4) return false;
    return this.jiuzhongyaojiu();
}

Majiang.Player.prototype.select_hule = function(data, option) {

    return this.allow_hule(data, option);
}

Majiang.Player.prototype.select_dapai = function() {

    if (this._shoupai._lizhi) {
        return this._shoupai._zimo;
    }

    var xiangting = Majiang.Util.xiangting(this._shoupai);
    if (xiangting == -1) {
        return this._shoupai._zimo;
    }

    var pai = paili(this._shoupai, Majiang.Util.xiangting);
 
    var dapai, max = 0;
    for (var p in pai) {
        if (pai[p].length >= max) {
            max = pai[p].length;
            dapai = p;
        }
    }
    if (this.allow_lizhi()) dapai += '*';
    return dapai;
}

Majiang.Player.prototype.select_fulou = function(data) {

    function check_xiangting(shoupai, mianzi) {
        var tmp_shoupai = shoupai.clone();
        tmp_shoupai.fulou(mianzi);
        if (mianzi.match(/(\d)\1\1\1/)) {
            if (Majiang.Util.xiangting(tmp_shoupai) <= xiangting) return mianzi;
        }
        else if (Majiang.Util.xiangting(tmp_shoupai) < xiangting) return mianzi;
    }
 
    return;             // とりあえず今は鳴かない

    var xiangting = Majiang.Util.xiangting(this._shoupai);
    if (xiangting == 0) return;
 
    for (var mianzi of this.get_gang_mianzi(data)) {
        return check_xiangting(this._shoupai, mianzi);
    }
    for (var mianzi of this.get_peng_mianzi(data)) {
        return check_xiangting(this._shoupai, mianzi);
    }
    for (var mianzi of this.get_chi_mianzi(data)) {
        return check_xiangting(this._shoupai, mianzi);
    }
}

Majiang.Player.prototype.select_gang = function() {

    function check_xiangting(shoupai, mianzi) {
        var tmp_shoupai = shoupai.clone();
        tmp_shoupai.gang(mianzi);
        if (Majiang.Util.xiangting(tmp_shoupai) <= xiangting) return mianzi;
    }

    var xiangting = Majiang.Util.xiangting(this._shoupai);
 
    for (var mianzi of this.get_gang_mianzi()) {
        return check_xiangting(this._shoupai, mianzi);
    }
}

/*
 *  Majiang.UI
 */

function get_dapai(shoupai, lizhi) {       // Majiang.Shoupai 側で実装要
    var dapai = [];
    if (! shoupai._zimo) return dapai;
    for (var s in shoupai._shouli) {
        var pai = shoupai._shouli[s];
        for (var n = 1; n <= pai.length; n++) {
            if (pai[n-1] > 0) dapai.push(s+n);  // 喰替えの考慮要
        }
    }
    return dapai;
}

Majiang.UI = function(id) {
    Majiang.Player.call(this, id);
    $('.UI span').hide();           // 後で削除する
}

Majiang.UI.prototype = new Majiang.Player();

Majiang.UI.prototype.clear_handler = function() {
    $('body').unbind('click');
    $('.UI span').unbind('click');
    $('.shoupai.dong .shouli .pai').unbind('click');
    $('.UI span').hide();
    $('.UI').hide();
}

Majiang.UI.prototype.zimo = function(data, callback, option) {

    var self = this;

    function set_lizhi_handler(dapai) {
        for (var p of dapai) {
            var selecter = '.shoupai.dong .shouli .pai[data-pai="'+p+'"]';
            $(selecter).addClass('dapai')
                       .bind('click', p+'*', function(event){
                            self.clear_handler();
                            callback('dapai', event.data)
                       });
        }
    }
    function set_gang_handler(gang_mianzi) {
        for (var mianzi of gang_mianzi) {
            var p = mianzi.substr(0,2);
            var selecter = '.shoupai.dong .shouli .pai[data-pai="'+p+'"]';
            $(selecter).addClass('dapai')
                       .bind('click', mianzi, function(event){
                            self.clear_handler();
                            callback('gang', event.data)
                       });
        }
    }

    this._paishu = data.paishu;
 
    if (data.lunban != this._menfeng) { callback(); return }
 
    this._shoupai.zimo(data.zimo);
 
    var set_handler;
 
    if (this.jiuzhongyaojiu()) {
        $('.UI .liuju').bind('click', function(){
            self.clear_handler();
            callback('liuju');
            return false;
        }).show();
        set_handler = true;
    }

    if (this.allow_hule(null, option)) {
        $('.UI .zimo').bind('click', function(){
            self.clear_handler();
            Majiang.Audio.play('zimo');
            callback('hule');
            return false;
        }).show();
        set_handler = true;
    }
 
    var gang_mianzi = this.get_gang_mianzi();
    if (gang_mianzi.length == 1) {
        $('.UI .gang').bind('click', function(){
            self.clear_handler();
            Majiang.Audio.play('gang');
            callback('gang', gang_mianzi[0]);
            return false;
        }).show();
        set_handler = true;
    }
    else if (gang_mianzi.length > 1) {
        $('.UI .gang').bind('click', function(){
            self.clear_handler();
            Majiang.Audio.play('gang');
            set_gang_handler(gang_mianzi);
            return false;
        }).show();
        set_handler = true;
    }

    var dapai = this.get_dapai_of_lizhi();
    if (dapai.length > 0) {
        $('.UI .lizhi').bind('click', function(){
            self.clear_handler();
            Majiang.Audio.play('lizhi');
            set_lizhi_handler(dapai);
            return false;
        }).show();
    }
 
    if (this._shoupai._lizhi && set_handler) {
        $('body').bind('click', function(){
            self.clear_handler();
            callback('dapai', data.zimo);
            return false;
        });
    }
    else {
        for (var p of get_dapai(this._shoupai)) {
            var selecter = '.shoupai.dong .shouli .pai[data-pai="'+p+'"]';
            $(selecter).bind('click', p, function(event){
                self.clear_handler();
                callback('dapai', event.data);
                return false;
            });
        }
    }
 
    $('.UI.resize').width($('.shoupai.dong .shouli').width()).show();
 
    this._diyizimo = false;
 
    if (this._shoupai._lizhi && ! set_handler) {
        callback('dapai', data.zimo);
    }
}

Majiang.UI.prototype.dapai = function(data, callback) {

    function set_chi_handler(chi_mianzi) {
 
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
        for (var mianzi of chi_mianzi) {
            var s = mianzi[0];
            for (var n of mianzi.match(/\d(?!\-)/g)) {
                pai[s+n] = mianzi;
            }
        }
        for (var p in pai) {
            var selecter = '.shoupai.dong .shouli .pai[data-pai="'+p+'"]';
            $(selecter).addClass('dapai')
                       .bind('mouseover', pai[p], handler)
                       .bind('click', pai[p], function(event){
                            self.clear_handler();
                            callback('fulou', event.data)
                       });
        }
    }

    var self = this;

    if (data.dapai[2] == '*') {
        this._lizhi[data.lunban] = this._diyizimo ? 2 : 1;
    }
    var dapai = data.dapai.substr(0,2);

    if (data.lunban == this._menfeng) {
        this._shoupai.dapai(data.dapai);
        this._dapai[dapai] = true;
        if (! this._shoupai._lizhi) this._neng_rong = true;
        if (Majiang.Util.xiangting(this._shoupai) == 0) {
            for (var p of Majiang.Util.tingpai(this._shoupai)) {
                if (this._dapai[p]) this._neng_rong = false;
            }
        }
        callback();
        return;
    }

    var set_handler;

    if (this.allow_hule(data)) {
        $('.UI .rong').bind('click', function(){
            self.clear_handler();
            Majiang.Audio.play('rong');
            callback('hule');
            return false;
        }).show();
        set_handler = true;
    }

    var gang_mianzi = this.get_gang_mianzi(data);
    if (gang_mianzi.length == 1) {
        $('.UI .gang').bind('click', function(){
            self.clear_handler();
            Majiang.Audio.play('gang');
            callback('fulou', gang_mianzi[0]);
            return false;
        }).show();
        set_handler = true;
    }

    var peng_mianzi = this.get_peng_mianzi(data);
    if (peng_mianzi.length == 1) {
        $('.UI .peng').bind('click', function(){
            self.clear_handler();
            Majiang.Audio.play('peng');
            callback('fulou', peng_mianzi[0]);
            return false;
        }).show();
        set_handler = true;
    }

    var chi_mianzi = this.get_chi_mianzi(data);
    if (chi_mianzi.length == 1) {
        $('.UI .chi').bind('click', function(){
            self.clear_handler();
            Majiang.Audio.play('chi');
            callback('fulou', chi_mianzi[0]);
            return false;
        }).show();
        set_handler = true;
    }
    if (chi_mianzi.length > 1) {
        $('.UI .chi').bind('click', function(){
            self.clear_handler();
            Majiang.Audio.play('chi');
            set_chi_handler(chi_mianzi);
            return false;
        }).show();
        set_handler = true;
    }

    $('.UI.resize').width($('.shoupai.dong .shouli').width()).show();

    var new_shoupai = this._shoupai.clone();
    new_shoupai.zimo(dapai);
    if (Majiang.Util.xiangting(new_shoupai) == -1) {
        this._neng_rong = false;
    }

    if (set_handler) {
        $('body').bind('click', function(){
            self.clear_handler();
            callback();
            return false;
        });
    }
    else callback();
}

Majiang.UI.prototype.fulou = function(data, callback) {

    var self = this;

    this._diyizimo = false;
 
    if (data.lunban != this._menfeng) {
        callback();
        return;
    }
 
    this._shoupai.fulou(data.fulou);
    this._menqian = false;

    for (var p of get_dapai(this._shoupai)) {
        var selecter = '.shoupai.dong .shouli .pai[data-pai="'+p+'"]';
        $(selecter).bind('click', p, function(event){
            self.clear_handler();
            callback('dapai', event.data);
            return false;
        });
    }
}

Majiang.UI.prototype.gang = function(data, callback) {

    this._diyizimo = false;

    if (data.lunban == this._menfeng) {
        if (this._shoupai._zimo) this._shoupai.gang(data.gang);
        else {
            this._shoupai.fulou(data.gang);
            this._menqian = false;
        }
        callback();
        return;
    }

    if (! data.gang.match(/^[mpsz](\d)\1\1\1/)) {
 
        var set_handler;
 
        if (this.allow_hule(data, 'qianggang')) {
            $('.UI .rong').bind('click', function(){
                self.clear_handler();
                Majiang.Audio.play('rong');
                callback('hule');
                return false;
            }).show();
            set_handler = true;
        }
 
        $('.UI.resize').width($('.shoupai.dong .shouli').width()).show();

        var new_shoupai = this._shoupai.clone();
        new_shoupai.zimo(data.gang.substr(0,2));
        if (Majiang.Util.xiangting(new_shoupai) == -1) {
            this._neng_rong = false;
        }
 
        if (set_handler) {
            $('body').bind('click', function(){
                self.clear_handler();
                callback();
                return false;
            });
        }
        else callback();
    }
    else callback();
}

Majiang.UI.prototype.hule = function(data, callback) {
    var self = this;
    $('body').bind('click', function(){
        self.clear_handler();
        callback();
        return false;
    });
}

Majiang.UI.prototype.liuju = function(data, callback) {
    var self = this;
    $('body').bind('click', function(){
        self.clear_handler();
        callback();
        return false;
    });
}

Majiang.UI.prototype.finish = function(data, callback) {
    var self = this;
    $('body').bind('click', function(){
        self.clear_handler();
        callback();
        return false;
    });
}

Majiang.UI.prototype.get_dapai_of_lizhi = function() {

    var dapai = [];
 
    if (! this.allow_lizhi()) return dapai;
 
    for (var s in this._shoupai._shouli) {
        var pai = this._shoupai._shouli[s];
        for (var n = 1; n <= pai.length; n++) {
            if (pai[n-1] == 0) continue;
            pai[n-1]--;
            if (Majiang.Util.xiangting(this._shoupai) == 0) dapai.push(s+n);
            pai[n-1]++;
        }
    }
    return dapai;
}

})();
