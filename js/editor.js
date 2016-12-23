/* Model */

Majiang.PaipuFile = function() {
    this._paipu = [];
}

Majiang.PaipuFile.prototype.add_paipu = function(paipu) {
    this._paipu = this._paipu.concat(paipu);
}

Majiang.PaipuFile.prototype.get_paipu = function(idx) {
    return this._paipu[idx];
}

Majiang.PaipuFile.prototype.delete_paipu = function(idx) {
    this._paipu.splice(idx, 1);
}

/* View */

Majiang.View.PaipuFile = function(node, paipu_file) {

    this._node  = node;
    this._model = paipu_file;

    this._max_idx = 0;
    
    this._row = this._node.find('.list > div');
    
    node.find('.error').on('click', function(){
        var self = this;
        $(this).fadeOut(500, function(){ $(self).empty(); });
    });
}

Majiang.View.PaipuFile.prototype.redraw = function() {

    var node =  this._node.find('.list');
    node.empty();
    
    for (var i = 0; i < this._model._paipu.length; i++) {
        var paipu = this._model._paipu[i];
        var player = ['','','',''];
        for (var l = 0; l < 4; l++) {
            player[paipu.rank[l] - 1]
                = paipu.player[l]
                    + '(' + (paipu.point[l] > 0 ? '+' : '')
                            + paipu.point[l] + ')';
        }
        player = player.join(', ');
        
        var row = this._row.clone();
        row.find('.title').text(paipu.title);
        row.find('.player').text(player);
        node.append(row);
        if (i < this._max_idx) row.show();
    }
    this._max_idx = this._model._paipu.length;
    
    if (this._model._paipu.length == 0) this._node.find('.download').hide();
    else                                this._node.find('.download').show();
}

Majiang.View.PaipuFile.prototype.update = function() {
    this.redraw();
    this._node.find('.list > div').fadeIn();
}

Majiang.View.PaipuFile.prototype.error = function(msg) {
    var self = this;
    this._node.find('.error').append($('<div></div>').text(msg)).fadeIn();
    setTimeout(function(){ self._node.find('.error').click() }, 5000);
}

/* Controller */

Majiang.PaipuEditor = function() {

    var self = this;

    this._model  = new Majiang.PaipuFile();
    this._view   = {
        paipu_file: new Majiang.View.PaipuFile(
                        $('#editor .paipu_file'), this._model),
    };
    
    $('#editor .paipu_file .upload input').on('change', function(){
        for (var i = 0; i < this.files.length; i++) {
            var file = this.files[i];
            if (! file.type.match(/application\/json/i)
                && ! file.name.match(/\.json/i))
            {
                self._view.paipu_file.error('不正なファイル: ' + file.name);
                continue;
            }
            var reader = new FileReader();
            reader.onload = (function(filename){
                return function(event){
                    var paipu;
                    try {
                        self.add_paipu(JSON.parse(event.target.result));
                        self._view.paipu_file.update();
                    }
                    catch(e) {
                        self._view.paipu_file.error('不正なファイル: ' + filename);
                        return;
                    }
                };
            })(file.name);
            reader.readAsText(file);
        }
        $(this).val(null);
    });
    
    self._view.paipu_file.redraw();
}

Majiang.PaipuEditor.prototype.add_paipu = function(paipu) {
    
    this._model.add_paipu(paipu);
    
    var title = this._model._paipu[0].title.replace(/[ \\\/\:]/g,'_');
    
    var blob = new Blob([JSON.stringify(this._model._paipu)],
                        { type: 'application/json' });
    $('#editor .paipu_file > .download')
                    .attr('href', URL.createObjectURL(blob))
                    .attr('download', '牌譜(' + title + ').json');
}
