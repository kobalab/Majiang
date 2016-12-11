Majiang.Util = {};

(function(){

/*
 *  Majiang.Util.xiangting
 */

function dazi(bingpai) {

    var n_pai  = 0;
    var n_dazi = 0;
    
    for (var n = 1; n <= 9; n++) {
        n_pai += bingpai[n];
        if (n <= 7 && bingpai[n+1] == 0 && bingpai[n+2] == 0) {
            n_dazi += Math.floor(n_pai / 2);
            n_pai = 0;
        }
    }
    n_dazi += Math.floor(n_pai / 2);
    
    return n_dazi;
}

function mianzi(bingpai, n) {

    if (n > 9) {
        var n_dazi = dazi(bingpai);
        return [[0, n_dazi], [0, n_dazi]];
    }
    
    var max = mianzi(bingpai, n+1);
    
    if (n <= 7 && bingpai[n] > 0 && bingpai[n+1] > 0 && bingpai[n+2] > 0) {
        bingpai[n]--; bingpai[n+1]--; bingpai[n+2]--;
        var r = mianzi(bingpai, n);
        bingpai[n]++; bingpai[n+1]++; bingpai[n+2]++;
        r[0][0]++; r[1][0]++
        if (r[0][0]* 2 + r[0][1] > max[0][0]* 2 + max[0][1]) max[0] = r[0];
        if (r[1][0]*10 + r[1][1] > max[1][0]*10 + max[1][1]) max[1] = r[1];
    }
    
    if (bingpai[n] >= 3) {
        bingpai[n] -= 3;
        var r = mianzi(bingpai, n);
        bingpai[n] += 3;
        r[0][0]++; r[1][0]++
        if (r[0][0]* 2 + r[0][1] > max[0][0]* 2 + max[0][1]) max[0] = r[0];
        if (r[1][0]*10 + r[1][1] > max[1][0]*10 + max[1][1]) max[1] = r[1];
    }
    
    return max;
}

function mianzi_all(shoupai) {

    var r = {};
    
    r.m = mianzi(shoupai._bingpai.m ,1);
    r.p = mianzi(shoupai._bingpai.p ,1);
    r.s = mianzi(shoupai._bingpai.s ,1);
    
    var z = [0, 0];
    for (var n = 1; n <=7; n++) {
        if (shoupai._bingpai.z[n] >= 3) z[0]++;
        if (shoupai._bingpai.z[n] == 2) z[1]++;
    }

    var n_fulou = shoupai._fulou.length;

    var min_xiangting = 8;
    
    for (var m of r.m) {
        for (var p of r.p) {
            for (var s of r.s) {
                var n_mianzi = m[0] + p[0] + s[0] + z[0] + n_fulou;
                var n_dazi   = m[1] + p[1] + s[1] + z[1];
                if (n_mianzi > 4) n_mianzi = 4;
                if (n_mianzi + n_dazi > 4) n_dazi = 4 - n_mianzi;
                var xiangting = 8 - n_mianzi * 2 - n_dazi;
                if (xiangting < min_xiangting) min_xiangting = xiangting;
            }
        }
    }
    
    return min_xiangting;
}

function paishu(shoupai) {
 
    var n_pai = shoupai._fulou.length * 3;
    for (var s in shoupai._bingpai) {
        var bingpai = shoupai._bingpai[s];
        for (var n = 1; n < bingpai.length; n++) {
            n_pai += bingpai[n];
        }
    }
    return n_pai;
}

function xiangting_yiban(shoupai) {
    
    var min_xiangting = mianzi_all(shoupai) + (paishu(shoupai) < 13 ? 1 : 0);
    
    for (var s of ['m','p','s','z']) {
        for (var n = 1; n <= shoupai._bingpai[s].length; n++) {
            if (shoupai._bingpai[s][n] >= 2) {
                shoupai._bingpai[s][n] -= 2;
                var xiangting = mianzi_all(shoupai) - 1;
                shoupai._bingpai[s][n] += 2;
                if (xiangting < min_xiangting) min_xiangting = xiangting;
            }
        }
    }
    
    return min_xiangting;
}

function xiangting_guoshi(shoupai) {

    var n_yaojiu  = 0;
    var you_duizi = false;

    for (var s in shoupai._bingpai) {
        var bingpai = shoupai._bingpai[s];
        var nn = (s == 'z') ? [1,2,3,4,5,6,7] : [1,9];
        for (var n of nn) {
            if (bingpai[n] > 0) n_yaojiu++;
            if (bingpai[n] > 1) you_duizi = true;
        }
    }

    return you_duizi ? 12 - n_yaojiu : 13 - n_yaojiu;
}

function xiangting_qiduizi(shoupai) {

    var n_duizi = 0;
    var n_danqi = 0;
    
    for (var s of ['m','p','s','z']) {
        var bingpai = shoupai._bingpai[s];
        for (var n = 1; n < bingpai.length; n++) {
            if      (bingpai[n] >= 2) n_duizi++;
            else if (bingpai[n] == 1) n_danqi++;
        }
    }
    
    return (n_duizi + n_danqi < 7)
                ? 6 - n_duizi + (7 - n_duizi - n_danqi)
                : 6 - n_duizi;
}

Majiang.Util.xiangting = function(shoupai) {

    var min_xiangting = xiangting_yiban(shoupai);
    
    if (shoupai._fulou.length == 0) {
    
        var xiangting = xiangting_qiduizi(shoupai);
        if (xiangting < min_xiangting) min_xiangting = xiangting;
    
        var xiangting = xiangting_guoshi(shoupai);
        if (xiangting < min_xiangting) min_xiangting = xiangting;
    }
    
    return min_xiangting;
}

Majiang.Util.tingpai = function(shoupai, xiangting) {

    var pai = [];
 
    if (shoupai._zimo) return pai;
 
    xiangting = xiangting || Majiang.Util.xiangting;
 
    var n_xiangting = xiangting(shoupai);
    for (var s of ['m','p','s','z']) {
        var bingpai = shoupai._bingpai[s];
        for (var n = 1; n < bingpai.length; n++) {
            if (bingpai[n] >= 4) continue;
            bingpai[n]++;
            if (xiangting(shoupai) < n_xiangting) pai.push(s+n);
            bingpai[n]--;
        }
    }
 
    return pai;
}

})();
