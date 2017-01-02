/*
 *  Majiang.PaipuFile
 */

(function(){

function fix_paipu(paipu) {

    var format = {
        title:  true,
        player: true,
        qijia:  true,
        log:    true,
        defen:  true,
        rank:   true,
        point:  true
    };
    
    for (var p of [].concat(paipu)) {
        for (var key in format) {
            if (p[key] == undefined) throw new Error(key+': '+p[key]);
        }
        for (var key in p) {
            if (! format[key]) delete p[key];
        }
    }
    return paipu;
}

Majiang.PaipuFile = function(storage) {

    this._paipu = [];

    if (storage && localStorage) {
        if (localStorage.getItem(storage)) {
            this._paipu = fix_paipu(JSON.parse(localStorage.getItem(storage)));
        }
        this._storage = storage;
    }
}

Majiang.PaipuFile.prototype.length = function() {
    return this._paipu.length;
}

Majiang.PaipuFile.prototype.stringify = function(idx) {
    if (idx == null) return JSON.stringify(this._paipu);
    else             return JSON.stringify(this._paipu[idx]);
}

Majiang.PaipuFile.prototype.update = function() {
    if (this._storage) {
        localStorage.setItem(this._storage, this.stringify())
    }
}

Majiang.PaipuFile.prototype.add_paipu = function(paipu) {
    this._paipu = this._paipu.concat(fix_paipu(paipu));
    this.update();
}

Majiang.PaipuFile.prototype.get_paipu = function(idx) {
    return this._paipu[idx];
}

Majiang.PaipuFile.prototype.del_paipu = function(idx) {
    this._paipu.splice(idx, 1);
    this.update();
}

})();

/*
 *  Majiang.View.PaipuFile
 */

(function(){

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
    
    for (var i = 0; i < this._model.length(); i++) {
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
    this._max_idx = this._model.length();
    
    if (this._model.length() == 0) this._node.find('.download').hide();
    else                           this._node.find('.download').show();

    this._node.find('.list > div').fadeIn();
}

Majiang.View.PaipuFile.prototype.error = function(msg) {
    var self = this;
    this._node.find('.error').append($('<div></div>').text(msg)).fadeIn();
    setTimeout(function(){ self._node.find('.error').click() }, 5000);
}

})();

/*
 *  Majiang.PaipuEditor
 */

(function(){

Majiang.PaipuEditor = function(storage) {

    var self = this;

    this._model  = new Majiang.PaipuFile(storage);
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
                        self._model.add_paipu(JSON.parse(event.target.result));
                    }
                    catch(e) {
                        self._view.paipu_file.error('不正なファイル: ' + filename);
                        return;
                    }
                    self._view.paipu_file.redraw();
                    self.set_handler();
                };
            })(file.name);
            reader.readAsText(file);
        }
        $(this).val(null);
    });
}

Majiang.PaipuEditor.prototype.start = function(paipu) {

    $('body').removeClass('game').addClass('editor');
    $('#game').hide();
    $('#editor').fadeIn();

    if (paipu) this._model.add_paipu(paipu);
    this._view.paipu_file.redraw();
    this.set_handler();
}

Majiang.PaipuEditor.prototype.set_handler = function(paipu) {

    var self = this;
 
    $('#editor .paipu_file > .edit').off('click').on('click', function(){
        self.edit();
    });
 
    if (this._model.length() == 0) return;
    
    var list = $('#editor .paipu_file .list > div');
    for (var i = 0; i < this._model.length(); i++) {

        list.eq(i).find('.delete').off('click').on('click', i, function(event){
            self._model.del_paipu(event.data);
            self._view.paipu_file.redraw();
            self.set_handler();
        });
    
        var title = this._model._paipu[i].title.replace(/[ \\\/\:\n]/g,'_');
        var blob = new Blob([ this._model.stringify(i) ],
                            { type: 'application/json' });
        list.eq(i).find('.download')
                        .attr('href', URL.createObjectURL(blob))
                        .attr('download', '牌譜(' + title + ').json');
        
        list.eq(i).find('.replay').off('click').on('click', i, function(event){
            var paipu = self._model.get_paipu(event.data);
            var game  = new Majiang.Game.Paipu(paipu);
            game._callback = function(){ self.start() };
            $('body').removeClass('editor').addClass('game');
            $('#editor').hide();
            $('#game').show();
            game.kaiju();
        });
 
        list.eq(i).find('.edit').off('click').on('click', i, function(event){
            var paipu = self._model.get_paipu(event.data);
            self.edit(paipu);
        });
    }

    var title = this._model._paipu[0].title.replace(/[ \\\/\:\n]/g,'_');
    
    var blob = new Blob([ this._model.stringify() ],
                        { type: 'application/json' });
    $('#editor .paipu_file > .download')
                    .attr('href', URL.createObjectURL(blob))
                    .attr('download', '牌譜(' + title + ').json');
 
    var ua = navigator.userAgent;
    if (! ua.match(/\bChrome\b/) && ua.match(/\bSafari\b/)) {
        $('.download').hide();
    }
}

Majiang.PaipuEditor.prototype.edit = function(paipu) {

    var self = this;
 
    if (! paipu) {
        paipu = {
            title:  '(牌譜名)',
            player: ['仮東','仮南','仮西','仮北'],
            qijia:  0,
            log:    [[{qipai: {
                        zhuangfeng: 0,
                        jushu:      0,
                        changbang:  0,
                        lizhibang:  0,
                        defen:      [25000,25000,25000,25000],
                        baopai:     '',
                        shoupai:    ['','','','']
                    }}]],
            defen:  [25000,25000,25000,25000],
            rank:   [1,2,3,4],
            point:  [0,0,0,0]
        };
        this._model.add_paipu(paipu);
    }
 
    $('#editor .paipu_file').hide();
    $('#editor .paipu .close').off('click').on('click', function(){
        self.close();
    });
    var editor = new Majiang.View.PaipuEditor($('#editor .paipu'), paipu);
    editor.redraw();
    $('#editor .paipu').show();
}

Majiang.PaipuEditor.prototype.close = function() {

    $('#editor .paipu').hide();
    $('#editor .paipu_file').show();

    this._model.update();
    this._view.paipu_file.redraw();
    this.set_handler();
}

})();
