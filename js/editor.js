/* View */

Majiang.View.PaipuEditor = function(node, paipu) {
    this._node  = node;
    this._paipu = paipu;
}

Majiang.View.PaipuEditor.prototype.redraw = function() {
    
    var self = this;
    
    this.update_title();
    this.set_title_handler();
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
        self._paipu.title = $(this).val().replace(/\n+$/,'') || '(牌譜名)';
        self.update_title();
    });
}