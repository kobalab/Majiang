/* View */

Majiang.View.PaipuEditor = function(node, paipu) {
    this._node  = node;
    this._paipu = paipu;
    this._log_idx = 0;
}

Majiang.View.PaipuEditor.prototype.player_id = function(l) {
    return (this._paipu.qijia
            + this._paipu.log[this._log_idx][0].qipai.jushu
            + l) % 4;
}

Majiang.View.PaipuEditor.prototype.redraw = function() {
    
    var self = this;
    
    this._node.hide();
    
    this.update_title();
    this.set_title_handler();
    
    this.update_jushu();
    this.set_jushu_handler();

    this.update_jicun();
    this.set_jicun_handler();

    for (var l = 0; l < 4; l++) {
        this.update_player(l);
        this.set_player_handler(l);
    }

    this._node.fadeIn();
}

Majiang.View.PaipuEditor.prototype.update_title = function() {

    var title_html = this._paipu.title
                        .split(/\n/)
                        .map(function(str){return $('<p>').text(str).html()})
                        .join('<br>');
    this._node.find('.title div').html(title_html).show();
    this._node.find('.title textarea').val(this._paipu.title).hide();
}

Majiang.View.PaipuEditor.prototype.set_title_handler = function() {

    var self = this;

    this._node.find('.title').off('click').on('click', function(){
        $(this).find('div').hide();
        $(this).find('textarea').show();
    });
    
    this._node.find('.title textarea').off('focusout').on('focusout', function(){
        self.update_title();
    });
    this._node.find('.title textarea').off('change').on('change', function(){
        self._paipu.title = $(this).val().replace(/\n+$/,'') || '（牌譜名）';
        self.update_title();
    });
}

Majiang.View.PaipuEditor.prototype.update_jushu = function() {

    var feng_hanzi = ['東','南','西','北'];
    var shu_hanzi  = ['一','二','三','四'];

    var qipai = this._paipu.log[this._log_idx][0].qipai;
    
    this._node.find('.jushu div').text(
                          feng_hanzi[qipai.zhuangfeng]
                        + shu_hanzi[qipai.jushu]
                        + '局').show();
    var select = this._node.find('.jushu select').empty().hide();
    for (var zhuangfeng = 0; zhuangfeng < 4; zhuangfeng++) {
        for (var jushu = 0; jushu < 4; jushu++) {
            var option = $('<option>').text(
                          feng_hanzi[zhuangfeng]
                        + shu_hanzi[jushu]
                        + '局')
                        .val(zhuangfeng * 4 + jushu);
            if (zhuangfeng == qipai.zhuangfeng && jushu == qipai.jushu) {
                option.attr('selected', 'selected')
            }
            select.append(option);
        }
    }
}

Majiang.View.PaipuEditor.prototype.set_jushu_handler = function() {

    var self = this;

    this._node.find('.jushu').off('click').on('click', function(){
        $(this).find('div').hide();
        $(this).find('select').show();
    });

    this._node.find('.jushu').off('focusout').on('focusout', function(){
        $(this).find('select').hide();
        $(this).find('div').show();
    });
    this._node.find('.jushu select').off('change').on('change', function(){
        self._paipu.log[self._log_idx][0].qipai.zhuangfeng
                                    = Math.floor($(this).val() / 4);
        self._paipu.log[self._log_idx][0].qipai.jushu
                                    = Math.floor($(this).val() % 4);
        self.redraw();
    });
}

Majiang.View.PaipuEditor.prototype.update_jicun = function() {
    this._node.find('.jicun .changbang input')
                .val(this._paipu.log[this._log_idx][0].qipai.changbang);
    this._node.find('.jicun .lizhibang input')
                .val(this._paipu.log[this._log_idx][0].qipai.lizhibang);
}

Majiang.View.PaipuEditor.prototype.set_jicun_handler = function() {

    var self = this;
    
    this._node.find('.jicun .changbang input').off('change')
                                              .on('change', function(){
        self._paipu.log[self._log_idx][0].qipai.changbang = $(this).val();
    });
    this._node.find('.jicun .lizhibang input').off('change')
                                              .on('change', function(){
        self._paipu.log[self._log_idx][0].qipai.lizhibang = $(this).val();
    });
}

Majiang.View.PaipuEditor.prototype.update_player = function(l) {

    var id = this.player_id(l);

    this._node.find('.player .name').eq(l).text(this._paipu.player[id]).show();
    this._node.find('.player input').eq(l).val(this._paipu.player[id]).hide();
}

Majiang.View.PaipuEditor.prototype.set_player_handler = function(l) {

    var self = this;

    this._node.find('.player').off('click').on('click', function(){
        $(this).find('.name').hide();
        $(this).find('input').attr('size', 10).show();
    });

    this._node.find('.player input').eq(l)
                                    .off('focusout').on('focusout', function(){
        self._paipu.player[self.player_id(l)] = $(this).val();
        self.update_player(l);
    });
}
