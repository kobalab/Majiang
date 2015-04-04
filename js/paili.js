function imgHtml(pai) {
    return '<img class="pai" src="img/' + pai + '.gif" />'
}

function canpaibiao(shoupai, he) {
    var biao = {
        m: [4,4,4,4,4,4,4,4,4],
        p: [4,4,4,4,4,4,4,4,4],
        s: [4,4,4,4,4,4,4,4,4],
        z: [4,4,4,4,4,4,4]
    }
    for (var sort in shoupai._shouli) {
        for (var i = 0; i < shoupai._shouli[sort].length; i++) {
            biao[sort][i] -= shoupai._shouli[sort][i];
        }
    }
    for (var p of he._pai) {
        biao[p[0]][p[1]-1] --;
    }
    return biao;
}
function paili(shoupai, he) {
    var n_xiangting = Majiang.Util.xiangting(shoupai);
    var canpai = canpaibiao(shoupai, he);
    var dapai = [];
    for (var sort in shoupai._shouli) {
        for (var i = 0; i < shoupai._shouli[sort].length; i++) {
            if (shoupai._shouli[sort][i] == 0) continue;
            shoupai._shouli[sort][i]--;
            if (Majiang.Util.xiangting(shoupai) == n_xiangting) {
                var _dapai = {
                    da:   sort + (i+1),
                    shu:  0,
                    ting: []
                }
                for (var s in canpai) {
                    for (var j = 0; j < canpai[s].length; j++) {
                        if (canpai[s][j] == 0) continue;
                        shoupai._shouli[s][j]++;
                        if (Majiang.Util.xiangting(shoupai) < n_xiangting) {
                            _dapai.shu += canpai[s][j];
                            _dapai.ting.push(s+(j+1));
                        }
                        shoupai._shouli[s][j]--;
                    }
                }
                if (_dapai.shu > 0) dapai.push(_dapai);
            }
            shoupai._shouli[sort][i]++;
        }
    }
    return dapai;
}

$(function(){

    Majiang.Audio.volume(2);
  
    var shan;
    var shoupai;
    var he;
  
    var n_xiangting;
  
    $('input[value="新規"]').click(function(){
        xipai();
    });
    $('input[value="選択"]').click(function(){
        xipai($('input[type=text]').val());
    });
  
    function showShoupai() {
        var node = $('.shoupai');
        var view = new Majiang.View.Shoupai(node, shoupai, true);
        view.redraw();
  
        var shouli = shoupai._shouli;
        var str ='';
        var sort = ['m', 'p', 's', 'z'];
        for (var s = 0; s < sort.length; s++) {
            for (var n = 0; n < shouli[sort[s]].length; n++) {
                var p = sort[s] + (n+1);
                node.find('.shouli .pai[data-pai="'+p+'"]')
                    .bind('click', p, function(event){
                        dapai(event.data);
                    });
            }
        }
    }
  
    function showHe() {
        var view = new Majiang.View.He($('.he'), $('.lizhi'), he);
        view.redraw();
    }
  
    function showPaili(paili) {
        var node = $('.paili');
        node.empty();

        var n_xiangting = Majiang.Util.xiangting(shoupai);
        var html = '<p>';
        if      (n_xiangting == -1) html += '和了！！';
        else if (n_xiangting ==  0) html += '聴牌！';
        else                        html += n_xiangting + '向聴';
        html += '</p>';
  
        paili.sort(function(a,b){ return b.shu - a.shu; });
        for (var dapai of paili) {
            var mo = '';
            for (var pai of dapai.ting) { mo += imgHtml(pai) }
            html += '打: ' + imgHtml(dapai.da)
                  + ' 摸: ' + mo + ' (' + dapai.shu + '枚)<br>';
        }
  
        node.html(html);
    }

    function dapai(p) {

        Majiang.Audio.play('dapai');

        shoupai.dapai(p);
        he.dapai(p);
  
        showShoupai();
        showHe();

        p = shan.zimo();
        if (! p) {
            $('.shoupai img').off('click');
            $('.paili').empty();
            $('.paili').html('<p>流局...</p>');
            Majiang.Audio.play('beep');
            return;
        }

        shoupai.zimo(p);
        showShoupai();
 
        showPaili(paili(shoupai, he));

        var x = Majiang.Util.xiangting(shoupai);
        if (x < n_xiangting && x == 0) Majiang.Audio.play('lizhi');
        n_xiangting = x;

        if (n_xiangting == -1) {
            Majiang.Audio.play('zimo');
            $('.shouli img').off('click');
        }
  
    }
  
    function xipai(paistr) {
        shan = new Majiang.Shan();
        he   = new Majiang.He();

        var haipai = [];
    
        if (paistr) {
            for (var substr of paistr.match(/\d+[mpsz]/g)) {
                var sort = substr[substr.length - 1];
                for (var n of substr.match(/\d/g)) {
                    haipai.push(sort + n);
                }
            }
            for (var pai of haipai) {
                for (var i = shan._pai.length - 1; i >= 0; i--) {
                    if (shan._pai[i] == pai) shan._pai.splice(i, 1);
                }
            }
            shoupai = Majiang.Shoupai.fromString(paistr);
        }
        else {
            for (var i = 0; i < 13; i++) {
                var p = shan.zimo();
                haipai.push(p);
            }
            shoupai = new Majiang.Shoupai(haipai);
        }
  
        while (shan.paishu() > 18) {
            shan.zimo();
        }
  
        $('input[type=text]').val(shoupai.toString());

        if (! shoupai._zimo) shoupai.zimo(shan.zimo());

        showHe();
        showShoupai();
        showPaili(paili(shoupai, he));
  
        n_xiangting = Majiang.Util.xiangting(shoupai);
    }

    xipai();
});