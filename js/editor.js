/* View */

Majiang.View.PaipuEditor = function(node, paipu) {
    this._node  = node;
    this._paipu = paipu;
}

Majiang.View.PaipuEditor.prototype.redraw = function() {
    
    var self = this;
    this._node.find('.title textarea').text(this._paipu.title);
    this._node.find('.title textarea').off('focusout').on('focusout', function(){
        self._paipu.title = $(this).val().replace(/\n+$/,'');
    });
}