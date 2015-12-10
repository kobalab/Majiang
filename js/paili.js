$(function(){

    var shan;
    var shoupai;
    var he;
    var view = {};
    var n_xiangting;
  
    var imgHtml = Majiang.View.imgHtml;

    $('input[type=button]').bind('click', function(){
        qipai();
    });
    $('form').bind('submit', function(){
        qipai($(this).find('input[type=text]').val());
        return false;
    });
  
    Majiang.Audio.volume(2);

    qipai();

    function get_dapai() {
        var pai = [];
        if (! shoupai._zimo) return pai;
        for (var s of ['m','p','s','z']) {
            var bingpai = shoupai._bingpai[s];
            for (var n = 1; n < bingpai.length; n++) {
                if (bingpai[n] == 0) continue;
                if (n != 5)                         pai.push(s+n);
                else {
                    if (bingpai[0] > 0)             pai.push(s+'0');
                    if (bingpai[0] < bingpai[5])    pai.push(s+'5');
                }
            }
        }
        return pai;
    }
  
    function set_handler() {
        for (var p of get_dapai()) {
            view.shoupai._node.find('.bingpai .pai[data-pai="'+p+'"]')
                .bind('click', p, function(event){
                    view.shoupai._node.find('.pai').unbind('click');
                    $(this).addClass('dapai');
                    dapai(event.data);
                    return false;
                });
        }
        var p = shoupai._zimo;
        view.shoupai._node.find('.zimo .pai[data-pai="'+p+'"]')
            .unbind('click')
            .bind('click', p, function(event){
                view.shoupai._node.find('.pai').unbind('click');
                $(this).fadeOut(100, function(){
                    dapai(event.data + '_');
                });
                return false;
            });
    }

    function qipai(paistr) {

        shan = new Majiang.Shan({m:1,p:1,s:1});
        he   = new Majiang.He();
    
        if (paistr) {

            shoupai = Majiang.Shoupai.fromTenhouString(paistr);

            for (var s in shoupai._bingpai) {
                var bingpai = shoupai._bingpai[s];
                for (var n = 1; n < bingpai.length; n++) {
                    for (var i = 0; i < bingpai[n]; i++) {
                        var p = s + (n == 5 && i < bingpai[0] ? 0 : n);
                        for (var j = shan._pai.length - 1; j >=0; j--) {
                            if (shan._pai[j] == p) {
                                shan._pai.splice(j, 1);
                                break;
                            }
                        }
                    }
                }
            }
        }
        else {
            var qipai = [];
            for (var i = 0; i < 13; i++) { qipai.push(shan.zimo()) }
            shoupai = new Majiang.Shoupai(qipai);
        }
        
        while (shan.paishu() > 18) { shan.zimo() }
        
        if (! shoupai._zimo) shoupai.zimo(shan.zimo());
    
        $('input[type=text]').val(shoupai.toTenhouString());
        
        view.shoupai = new Majiang.View.Shoupai($('.shoupai'), shoupai, true);
        view.shoupai.redraw();
        
        view.he = new Majiang.View.He($('.he'), he, true);
        view.he.redraw();
  
        paili();

        set_handler();
    }
  
    function dapai(p) {
  
        Majiang.Audio.play('dapai');
  
        shoupai.dapai(p);
        view.shoupai.dapai(p);
  
        he.dapai(p);
        view.he.redraw();

        setTimeout(zimo, 100);
    }
  
    function zimo() {
  
        if (shan.paishu() == 0) {
            $('.status').text('流局...');
            $('.paili').empty();
            view.shoupai.redraw()
            return;
        }
  
        shoupai.zimo(shan.zimo());
        view.shoupai.redraw();
  
        var x = Majiang.Util.xiangting(shoupai);
        if (x < n_xiangting && x == 0)  Majiang.Audio.play('lizhi');
  
        paili();
  
        if (n_xiangting == -1) {
            Majiang.Audio.play('zimo');
            return;
        }
  
        set_handler();
    }
  
    function paili() {
  
        $('.paili').empty();
  
        n_xiangting = Majiang.Util.xiangting(shoupai);
        if (n_xiangting == -1)      $('.status').text('和了！！');
        else if (n_xiangting == 0)  $('.status').text('聴牌！');
        else                        $('.status').text(n_xiangting + '向聴');
  
        var dapai = [];
        for (var p of get_dapai()) {
  
            p = p.replace(/0/, '5');
            if (dapai.length > 0 && p == dapai[dapai.length - 1].da) continue;

            var new_shoupai = shoupai.clone();
            new_shoupai.dapai(p);
  
            if (Majiang.Util.xiangting(new_shoupai) > n_xiangting) continue;

            var paishu = 0;
            var tingpai = [];
            for (var tp of Majiang.Util.tingpai(new_shoupai)) {
                paishu += 4 - shoupai._bingpai[tp[0]][tp[1]];
                tingpai.push(tp);
            }
  
            dapai.push({ da: p, mo: tingpai, shu: paishu });
        }
  
        for (var dp of dapai.sort(function(a,b){return b.shu - a.shu})) {
            var html = '<div>打: ' + imgHtml(dp.da) + ' 摸: '
                     + dp.mo.map(imgHtml).join('')
                     + ' (' + dp.shu + '枚)</div>';
            $('.paili').append($(html));
        }
    }

});

