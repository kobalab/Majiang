/*
 *  Majiang.UI
 */

(function(){

Majiang.UI = function(id) {
    Majiang.Player.call(this, id);
    this.clear_handler();
}

Majiang.UI.prototype = new Majiang.Player();

Majiang.UI.prototype.clear_handler = function() {
    $('#game').unbind('click');
    $('.shoupai.main .bingpai .pai').unbind('click')
                                    .unbind('mouseover')
                                    .removeClass('blink')
                                    .removeClass('selected');
    $('.UI span').unbind('click').hide();
    $('.UI').hide();
}

Majiang.UI.prototype.wait = function(callback) {
    var self = this;
    $('#game').bind('click', function(){
        self.clear_handler();
        callback();
        return false;
    });
}

Majiang.UI.prototype.get_dapai_of_lizhi = function() {

    var dapai = [];
 
    if (! this.allow_lizhi()) return dapai;
 
    for (var p of this.get_dapai()) {
        var new_shoupai = this._shoupai.clone();
        new_shoupai.dapai(p);
        if (Majiang.Util.xiangting(new_shoupai) == 0
            && Majiang.Util.tingpai(new_shoupai).length > 0) dapai.push(p);
    }
 
    return dapai;
}

Majiang.UI.prototype.action_zimo = function(data, callback, option) {

    function set_lizhi_handler(dapai) {
        for (var p of dapai) {
            var selecter = '.shoupai.main .bingpai > .pai[data-pai="'+p+'"]';
            $(selecter).bind('click', p, function(event){
                self.clear_handler();
                $(this).addClass('dapai');
                callback('dapai', event.data + '*');
                return false;
            }).addClass('blink');

            var selecter = '.shoupai.main .bingpai .zimo .pai[data-pai="'+p+'"]';
            $(selecter).bind('click', p, function(event){
                self.clear_handler();
                $(this).addClass('dapai');
                callback('dapai', event.data + '_*');
                return false;
            }).addClass('blink');
        }
    }
 
    function set_gang_handler(mianzi) {
        for (var m of mianzi) {
            var p = mianzi.substr(0,2).replace(/0/,'5');
            var selecter = '.shoupai.main .bingpai .pai[data-pai="'+p+'"]';
            $(selecter).bind('click', m, function(event){
                self.clear_handler();
                callback('gang', event.data);
                return false;
            }).addClass('blink');
        }
    }

    var self = this;
 
    var show_botton = false;
 
    $('.UI.resize').width($('.shoupai.main .bingpai').width());
    $('.UI').show();
 
    if (this.allow_hule(null, option)) {
        $('.UI .zimo').bind('click', function(){
            self.clear_handler();
            callback('hule');
            return false;
        }).show();
        show_botton = true;
    }
 
    var gang_mianzi = this.get_gang_mianzi();
    if (gang_mianzi.length == 1) {
        $('.UI .gang').bind('click', function(){
            self.clear_handler();
            callback('gang', gang_mianzi[0]);
            return false;
        }).show();
        show_botton = true;
    }
    else if (gang_mianzi.length > 1) {
        $('.UI .gang').bind('click', function(){
            self.clear_handler();
            set_gang_handler(gang_mianzi);
            return false;
        }).show();
        show_botton = true;
    }
 
    if (this._lizhi[this._menfeng]) {
        if (show_botton) {
            $('#game').bind('click', function(){
                self.clear_handler();
                callback('dapai', data.p + '_');
                return false;
            });
        }
        else    callback('dapai', data.p + '_');
        return;
    }
 
    var dapai = this.get_dapai_of_lizhi();
    if (dapai.length > 0) {
        $('.UI .lizhi').bind('click', function(){
            self.clear_handler();
            set_lizhi_handler(dapai);
            return false;
        }).show();
    }

    for (var p of this.get_dapai()) {

        var selecter = '.shoupai.main .bingpai > .pai[data-pai="'+p+'"]';
        $(selecter).bind('click', p, function(event){
            self.clear_handler();
            $(this).addClass('dapai');
            callback('dapai', event.data);
            return false;
        });

        selecter = '.shoupai.main .bingpai .zimo .pai[data-pai="'+p+'"]';
        $(selecter).bind('click', p, function(event){
            self.clear_handler();
            $(this).addClass('dapai');
            callback('dapai', event.data + '_');
            return false;
        });
    }
}

Majiang.UI.prototype.action_dapai = function(data, callback) {

    function set_chi_handler(mianzi) {
 
        function handler(event) {
            var fulou = event.data;
            var s = fulou[0];
            var nn = fulou.match(/\d(?!\-)/g);
            var node = $('.shoupai.main .bingpai');
            var img;
            if ($(this).data('pai') == s+nn[0])
                    img = node.find('.pai[data-pai="'+s+nn[1]+'"]').eq(0);
            else    img = node.find('.pai[data-pai="'+s+nn[0]+'"]').eq(-1);
            node.find('.pai').removeClass('selected');
            $(this).addClass('selected');
            img.addClass('selected');
        }
 
        var map = {};
        for (var m of mianzi) {
            var s = m[0];
            for (var n of m.match(/\d(?!\-)/g)) {
                map[s+n] = m;
            }
        }
        for (var p in map) {
            var selecter = '.shoupai.main .bingpai .pai[data-pai="'+p+'"]';
            $(selecter).addClass('blink')
                .bind('mouseover', map[p], handler)
                .bind('click', map[p], function(event){
                    self.clear_handler;
                    callback('fulou', event.data);
                    return false;
                });
        }
    }

    var self = this;
 
    var show_botton = false;
 
    $('.UI.resize').width($('.shoupai.main .bingpai').width());
    $('.UI').show();
 
    if (this.allow_hule(data)) {
        $('.UI .rong').bind('click', function(){
            self.clear_handler();
            callback('hule');
            return false;
        }).show();
        show_botton = true;
    }

    var gang_mianzi = this.get_gang_mianzi(data);
    if (gang_mianzi.length == 1) {
        $('.UI .gang').bind('click', function(){
            self.clear_handler();
            callback('fulou', gang_mianzi[0]);
            return false;
        }).show();
        show_botton = true;
    }

    var peng_mianzi = this.get_peng_mianzi(data);
    if (peng_mianzi.length == 1) {
        $('.UI .peng').bind('click', function(){
            self.clear_handler();
            callback('fulou', peng_mianzi[0]);
            return false;
        }).show();
        show_botton = true;
    }

    var chi_mianzi = this.get_chi_mianzi(data);
    if (chi_mianzi.length == 1) {
        $('.UI .chi').bind('click', function(){
            callback('fulou', chi_mianzi[0]);
            self.clear_handler();
            return false;
        }).show();
        show_botton = true;
    }
    else if (chi_mianzi.length > 1) {
        $('.UI .chi').bind('click', function(){
            self.clear_handler();
            set_chi_handler(chi_mianzi);
            return false;
        }).show();
        show_botton = true;
    }

    if (show_botton) {
        $('#game').bind('click', function(){
            self.clear_handler();
            callback();
            return false;
        });
    }
    else    callback();
}

Majiang.UI.prototype.action_fulou = function(data, callback) {

    var self = this;
 
    var show_botton = false;
 
    $('.UI.resize').width($('.shoupai.main .bingpai').width());
    $('.UI').show();
 
    for (var p of this.get_dapai()) {

        var selecter = '.shoupai.main .bingpai > .pai[data-pai="'+p+'"]';
        $(selecter).bind('click', p, function(event){
            self.clear_handler();
            $(this).addClass('dapai');
            callback('dapai', event.data);
            return false;
        });

        selecter = '.shoupai.main .bingpai .zimo .pai[data-pai="'+p+'"]';
        $(selecter).bind('click', p, function(event){
            self.clear_handler();
            $(this).addClass('dapai');
            callback('dapai', event.data + '_');
            return false;
        });
    }
}

Majiang.UI.prototype.action_gang = function(data, callback) {

    var self = this;
 
    var show_botton = false;
 
    $('.UI.resize').width($('.shoupai.main .bingpai').width());
    $('.UI').show();
 
    if (this.allow_hule(data, 'qianggang')) {
        $('.UI .rong').bind('click', function(){
            self.clear_handler();
            callback('hule');
            return false;
        }).show();
        show_botton = true;
    }

    if (show_botton) {
        $('#game').bind('click', function(){
            self.clear_handler();
            callback();
            return false;
        });
    }
    else    callback();
}

})();
