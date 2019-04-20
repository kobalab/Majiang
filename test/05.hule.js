const assert = require('assert');

const Majiang = require('../src/js/majiang');

const data = require('./data/hule.json');

function param(opt = {}) {

    let param = {
        zhuangfeng: 0,
        menfeng:    1,
        hupai:      {},
        baopai:     [],
        fubaopai:   null,
        jicun:      { changbang: 0, lizhibang: 0 }
    };

    for (let key in opt) {
        if (param.jicun[key] !== undefined) param.jicun[key] = opt[key];
        else if (param[key]  !== undefined) param[key]       = opt[key];
        else                                param.hupai[key] = opt[key];
    }
    return param;
}

suite('Majiang.Util', function(){

  suite('hule(shoupai, rongpai, param)', function(){

    let hule;

    test('和了形以外: 空の手牌', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString(), null, param());
      assert.ifError(hule);
    });
    test('和了形以外: 打牌直後の手牌', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m123p456s789z1122'),
                null, param());
      assert.ifError(hule);
    });
    test('和了形以外: 副露直後の手牌', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m123p456s789z11,z333=,'),
                null, param());
      assert.ifError(hule);
    });
    test('和了形以外: 一般手聴牌', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m123333p89z111,s456-'),
                null, param());
      assert.ifError(hule);
    });
    test('和了形以外: 少牌', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m11'), null, param());
      assert.ifError(hule);
    });
    test('和了形以外: 七対子形4枚使い', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m114477p1199s1111'),
                null, param());
      assert.ifError(hule);
    });
    test('和了形以外: 国士無双13面待ち聴牌', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m19p19s19z1234567m0*'),
                null, param({lizhi: 1}));
      assert.ifError(hule);
    });
    test('和了形以外: 九蓮宝燈聴牌', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m111234567899p1m9'),
                null, param());
      assert.ifError(hule);
    });

    test('符計算: 平和ツモは20符', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m345567p234s33789'),
                null, param());
      assert.equal(hule.fu, 20);
    });
    test('符計算: 平和ロンは30符', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m345567p234s33789'),
                's9=', param());
      assert.equal(hule.fu, 30);
    });
    test('符計算: オタ風の雀頭に符はつかない', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m112233p456z33s789'),
                's9=', param());
      assert.equal(hule.fu, 30);
    });
    test('符計算: 場風の雀頭は2符', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m112233p456z11s789'),
                's9=', param());
      assert.equal(hule.fu, 40);
    });
    test('符計算: 自風の雀頭は2符', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m112233p456z22s789'),
                's9=', param());
      assert.equal(hule.fu, 40);
    });
    test('符計算: 三元牌の雀頭は2符', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m112233p456z55s789'),
                's9=', param());
      assert.equal(hule.fu, 40);
    });
    test('符計算: 連風牌の雀頭は4符', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m112233z444z11s789'),
                's9=', param({menfeng:0}));
      assert.equal(hule.fu, 50);
    });
    test('符計算: 中張牌の明刻は2符', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m123z11m888,p888+,s888-'),
                'm8=', param({menfeng:0}));
      assert.equal(hule.fu, 30);
    });
    test('符計算: 幺九牌の明刻は4符', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m123p22s999,z222+,p111-'),
                's9=', param());
      assert.equal(hule.fu, 40);
    });
    test('符計算: 中張牌の暗刻は4符', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('z33p222777s888m234'),
                'm4=', param());
      assert.equal(hule.fu, 50);
    });
    test('符計算: 幺九牌の暗刻は8符', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('s33p111999z555m234'),
                'm4=', param());
      assert.equal(hule.fu, 60);
    });
    test('符計算: 中張牌の明槓は8符', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('p33m222456678,s444+4'),
                'm8=', param());
      assert.equal(hule.fu, 40);
    });
    test('符計算: 幺九牌の明槓は16符', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('p33m234456678,z6666-'),
                'm8=', param());
      assert.equal(hule.fu, 40);
    });
    test('符計算: 中張牌の暗槓は16符', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('p33m234456678,s4444'),
                'm8=', param());
      assert.equal(hule.fu, 50);
    });
    test('符計算: 幺九牌の暗槓は32符', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('p33m234456678,z7777'),
                'm8=', param());
      assert.equal(hule.fu, 70);
    });
    test('符計算: ツモ和了は2符加算', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('p33m222s222345,s888-'),
                null, param());
      assert.equal(hule.fu, 40);
    });
    test('符計算: 単騎待ちは2符加算', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m222s222345p33,s888-'),
                'p3=', param());
      assert.equal(hule.fu, 40);
    });
    test('符計算: 嵌張待ちは2符加算', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('p33m222s222354,s888-'),
                's4=', param());
      assert.equal(hule.fu, 40);
    });
    test('符計算: 辺張待ちは2符加算', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('p33z111m123897,s222-'),
                'm7=', param());
      assert.equal(hule.fu, 40);
    });
    test('符計算: 喰い平和は30符', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m22p345678s345,s67-8'),
                's5=', param());
      assert.equal(hule.fu, 30);
    });
    test('符計算: 七対子は25符', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m2255p88s1166z1155'),
                null, param());
      assert.equal(hule.fu, 25);
    });
    test('符計算: 国士無双は符なし', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m19p19s1z12345677s9'),
                null, param());
      assert.ifError(hule.fu);
    });
    test('符計算: 九蓮宝燈は符なし', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m11123456789995'),
                null, param());
      assert.ifError(hule.fu);
    });

    test('和了役: 役なし', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m344556s24678z66s3'),
                's3=', param());
      assert.ifError(hule.hupai);
    });

    test('和了役: 立直', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m344556s24678z66s3*'),
                's3=', param({lizhi:1}));
      assert.deepEqual(hule.hupai, [{ name: '立直', fanshu: 1 }]);
    });
    test('和了役: ダブル立直', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m344556s24678z66s3*'),
                's3=', param({lizhi:2}));
      assert.deepEqual(hule.hupai, [{ name: 'ダブル立直', fanshu: 2 }]);
    });
    test('和了役: 立直・一発', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m344556s24678z66s3*'),
                's3=', param({lizhi:1, yifa:true}));
      assert.deepEqual(hule.hupai, [{ name: '立直', fanshu: 1 },
                                    { name: '一発', fanshu: 1 }]);
    });
    test('和了役: 海底摸月', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m344556s24z66s3,s6-78'),
                null, param({haidi:1}));
      assert.deepEqual(hule.hupai, [{ name: '海底摸月', fanshu: 1 }]);
    });
    test('和了役: 河底撈魚', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m344556s24678z66s3'),
                's3=', param({haidi:2}));
      assert.deepEqual(hule.hupai, [{ name: '河底撈魚', fanshu: 1 }]);
    });
    test('和了役: 嶺上開花', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m344556s24z66s3,s777+7'),
                null, param({lingshang:true}));
      assert.deepEqual(hule.hupai, [{ name: '嶺上開花', fanshu: 1 }]);
    });
    test('和了役: 槍槓', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m344556s24678z66s3'),
                's3=', param({qianggang:true}));
      assert.deepEqual(hule.hupai, [{ name: '槍槓', fanshu: 1 }]);
    });
    test('和了役: 天和', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m344556s24678z66s3'),
                null, param({tianhu:1}));
      assert.deepEqual(hule.hupai, [{ name: '天和', fanshu: '*' }]);
    });
    test('和了役: 地和', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m344556s24678z66s3'),
                null, param({tianhu:2}));
      assert.deepEqual(hule.hupai, [{ name: '地和', fanshu: '*' }]);
    });

    test('和了役: 門前清自摸和', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m344556s24678z66s3'),
                null, param());
      assert.deepEqual(hule.hupai, [{ name: '門前清自摸和', fanshu: 1 }]);
    });
    test('和了役: 場風 東', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m345567s33789z111'),
                's9=', param());
      assert.deepEqual(hule.hupai, [{ name: '場風 東', fanshu: 1 }]);
    });
    test('和了役: 自風 西', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m345567s33789,z333+'),
                null, param({menfeng:2}));
      assert.deepEqual(hule.hupai, [{ name: '自風 西', fanshu: 1 }]);
    });
    test('和了役: 連風牌 南', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m345567s33z222,s789-'),
                'z2=', param({zhuangfeng:1}));
      assert.deepEqual(hule.hupai, [{ name: '場風 南', fanshu: 1 },
                                    { name: '自風 南', fanshu: 1 }]);
    });
    test('和了役: 翻牌 白', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m345567s33789,z555+5'),
                null, param());
      assert.deepEqual(hule.hupai, [{ name: '翻牌 白', fanshu: 1 }]);
    });
    test('和了役: 翻牌 發・中', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m345567s33,z6666+,z7777'),
                null, param());
      assert.deepEqual(hule.hupai, [{ name: '翻牌 發', fanshu: 1 },
                                    { name: '翻牌 中', fanshu: 1 }]);
    });
    test('和了役: 平和', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('z33m234456p78s123p9'),
                'p9=', param());
      assert.deepEqual(hule.hupai, [{ name: '平和', fanshu: 1 }]);
    });
    test('和了役: 平和・ツモ', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('z33m234456p78s123p9'),
                null, param());
      assert.deepEqual(hule.hupai, [{ name: '門前清自摸和', fanshu: 1 },
                                    { name: '平和', fanshu: 1 }]);
    });
    test('和了役: 喰い平和(役なし)', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('z33m234456p78p9,s1-23'),
                'p9=', param());
      assert.ifError(hule.hupai);
    });
    test('和了役: 断幺九', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m22555p234s786,p777-'),
                's6=', param());
      assert.deepEqual(hule.hupai, [{ name: '断幺九', fanshu: 1 }]);
    });
    test('和了役: 断幺九(七対子形)', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m2255p4488s336677'),
                's7=', param());
      assert.deepEqual(hule.hupai, [{ name: '断幺九', fanshu: 1 },
                                    { name: '七対子', fanshu: 2 }]);
    });
    test('和了役: 一盃口', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m33455p111s33789m4'),
                'm4=', param());
      assert.deepEqual(hule.hupai, [{ name: '一盃口', fanshu: 1 }]);
    });
    test('和了役: 喰い一盃口(役なし)', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m33455p111s33m4,s78-9'),
                'm4=', param());
      assert.ifError(hule.hupai);
    });
    test('和了役: 三色同順', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m567p567s22567999'),
                's9=', param());
      assert.deepEqual(hule.hupai, [{ name: '三色同順', fanshu: 2 }]);
    });
    test('和了役: 三色同順(喰い下がり)', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m567s22567999,p56-7'),
                's9=', param());
      assert.deepEqual(hule.hupai, [{ name: '三色同順', fanshu: 1 }]);
    });
    test('和了役: 一気通貫', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m12456789s33789m3'),
                'm3=', param());
      assert.deepEqual(hule.hupai, [{ name: '一気通貫', fanshu: 2 }]);
    });
    test('和了役: 一気通貫(喰い下がり)', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m12789s33789m3,m4-56'),
                'm3=', param());
      assert.deepEqual(hule.hupai, [{ name: '一気通貫', fanshu: 1 }]);
    });
    test('和了役: 混全帯幺九', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m123999p789z33s123'),
                's3=', param());
      assert.deepEqual(hule.hupai, [{ name: '混全帯幺九', fanshu: 2 }]);
    });
    test('和了役: 混全帯幺九(喰い下がり)', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m123p789z33s123,m999+'),
                's3=', param());
      assert.deepEqual(hule.hupai, [{ name: '混全帯幺九', fanshu: 1 }]);
    });
    test('和了役: 七対子', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m115599p2233s8z22s8'),
                's8=', param());
      assert.deepEqual(hule.hupai, [{ name: '七対子', fanshu: 2 }]);
    });
    test('和了役: 対々和', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m55888z333s222,p111='),
                's2=', param());
      assert.deepEqual(hule.hupai, [{ name: '対々和', fanshu: 2 }]);
    });
    test('和了役: 三暗刻', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('p99s111m555,p345-,s3333'),
                null, param());
      assert.deepEqual(hule.hupai, [{ name: '三暗刻', fanshu: 2 }]);
    });
    test('和了役: 三槓子', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('p11m453,s2222+,m888=8,z4444'),
                'm3=', param());
      assert.deepEqual(hule.hupai, [{ name: '三槓子', fanshu: 2 }]);
    });
    test('和了役: 三色同刻', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('s12377m222,p222-,s222-'),
                'm2=', param());
      assert.deepEqual(hule.hupai, [{ name: '三色同刻', fanshu: 2 }]);
    });
    test('和了役: 混老頭(対々和形)', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('z11p111999,m111=,z333+'),
                'p9=', param());
      assert.deepEqual(hule.hupai, [{ name: '対々和', fanshu: 2 },
                                    { name: '混老頭', fanshu: 2 }]);
    });
    test('和了役: 混老頭(七対子形)', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m1199p11s99z113355'),
                'z5=', param());
      assert.deepEqual(hule.hupai, [{ name: '七対子', fanshu: 2 },
                                    { name: '混老頭', fanshu: 2 }]);
    });
    test('和了役: 小三元', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('z55577m567p222,z666-'),
                'p2=', param());
      assert.deepEqual(hule.hupai, [{ name: '翻牌 白', fanshu: 1 },
                                    { name: '翻牌 發', fanshu: 1 },
                                    { name: '小三元',  fanshu: 2 }]);
    });
    test('和了役: 混一色', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m111234789z11333'),
                'z3=', param());
      assert.deepEqual(hule.hupai, [{ name: '混一色', fanshu: 3 }]);
    });
    test('和了役: 混一色(喰い下がり)', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('z11333p234789,p111+'),
                'p9=', param());
      assert.deepEqual(hule.hupai, [{ name: '混一色', fanshu: 2 }]);
    });
    test('和了役: 混一色(七対子形)', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('s11224488z225577'),
                'z7=', param());
      assert.deepEqual(hule.hupai, [{ name: '七対子', fanshu: 2 },
                                    { name: '混一色', fanshu: 3 }]);
    });
    test('和了役: 純全帯幺九', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m11s123p789s789m999'),
                'm9=', param());
      assert.deepEqual(hule.hupai, [{ name: '純全帯幺九', fanshu: 3 }]);
    });
    test('和了役: 純全帯幺九(喰い下がり)', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m11s123p789s789,m999='),
                's9=', param());
      assert.deepEqual(hule.hupai, [{ name: '純全帯幺九', fanshu: 2 }]);
    });
    test('和了役: 二盃口', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m223344p667788s99'),
                's9=', param());
      assert.deepEqual(hule.hupai, [{ name: '二盃口', fanshu: 3 }]);
    });
    test('和了役: 二盃口(4枚使い)', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m222233334444s99'),
                's9=', param());
      assert.deepEqual(hule.hupai, [{ name: '二盃口', fanshu: 3 }]);
    });
    test('和了役: 喰い二盃口(役なし)', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m223344p678s99,p678-'),
                's9=', param());
      assert.ifError(hule.hupai);
    });
    test('和了役: 清一色', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m11134566777789'),
                'm9=', param());
      assert.deepEqual(hule.hupai, [{ name: '清一色', fanshu: 6 }]);
    });
    test('和了役: 清一色(喰い下がり)', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('p23445551,p12-3,p7-89'),
                'p1=', param());
      assert.deepEqual(hule.hupai, [{ name: '清一色', fanshu: 5 }]);
    });
    test('和了役: 清一色(七対子形)', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('s11224455778899'),
                's9=', param());
      assert.deepEqual(hule.hupai, [{ name: '七対子', fanshu: 2 },
                                    { name: '清一色', fanshu: 6 }]);
    });
    test('和了役: 国士無双', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m119p19s19z1234567'),
                null, param());
      assert.deepEqual(hule.hupai, [{ name: '国士無双', fanshu: '*' }]);
    });
    test('和了役: 国士無双十三面', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m19p19s19z1234567m1'),
                null, param());
      assert.deepEqual(hule.hupai, [{ name: '国士無双十三面', fanshu: '**' }]);
    });
    test('和了役: 四暗刻', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m33m111p333s777z111'),
                null, param());
      assert.deepEqual(hule.hupai, [{ name: '四暗刻', fanshu: '*' }]);
    });
    test('和了役: 四暗刻単騎', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m111p333s777z111m33'),
                'm3=', param());
      assert.deepEqual(hule.hupai, [{ name: '四暗刻単騎', fanshu: '**' }]);
    });
    test('和了役: 大三元', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('z555m456p22z666,z777+'),
                'z6=', param());
      assert.deepEqual(hule.hupai, [{ name: '大三元', fanshu: '*'}]);
    });
    test('和了役: 大三元(パオ)', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m22345,z555-5,z6666,z777+'),
                'm5=', param());
      assert.deepEqual(hule.hupai,
                        [{ name: '大三元', fanshu: '*', baojia: '+' }]);
    });
    test('和了役: 小四喜', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m234z22444,z333+,z111-'),
                'z4=', param());
      assert.deepEqual(hule.hupai, [{ name: '小四喜', fanshu: '*' }]);
    });
    test('和了役: 大四喜', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m22z222444,z333+,z111-'),
                'z4=', param());
      assert.deepEqual(hule.hupai, [{ name: '大四喜', fanshu: '**'}]);
    });
    test('和了役: 大四喜(パオ)', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m22,z222+,z4444,z333+,z111-'),
                'm2=', param());
      assert.deepEqual(hule.hupai,
                        [{ name: '大四喜', fanshu: '**', baojia: '-' }]);
    });
    test('和了役: 字一色', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('z11122777,z555=,z444+'),
                'z7=', param());
      assert.deepEqual(hule.hupai, [{ name: '字一色', fanshu: '*' }]);
    });
    test('和了役: 字一色(七対子形)', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('z11223344556677'),
                'z7=', param());
      assert.deepEqual(hule.hupai, [{ name: '字一色', fanshu: '*' }]);
    });
    test('和了役: 緑一色', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('s22334466z666,s888+'),
                'z6=', param());
      assert.deepEqual(hule.hupai, [{ name: '緑一色', fanshu: '*' }]);
    });
    test('和了役: 緑一色(發なし)', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('s44666,s222=,s333+,s888-'),
                's6=', param());
      assert.deepEqual(hule.hupai, [{ name: '緑一色', fanshu: '*' }]);
    });
    test('和了役: 清老頭', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('s11p111m111,s999-,m999='),
                'm1=', param());
      assert.deepEqual(hule.hupai, [{ name: '清老頭', fanshu: '*' }]);
    });
    test('和了役: 四槓子', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m11,z5555,p222+2,p777-7,s1111-'),
                'm1=', param());
      assert.deepEqual(hule.hupai, [{ name: '四槓子', fanshu: '*' }]);
    });
    test('和了役: 九蓮宝燈', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m11122345678999'),
                'm4=', param());
      assert.deepEqual(hule.hupai, [{ name: '九蓮宝燈', fanshu: '*' }]);
    });
    test('和了役: 純正九蓮宝燈', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m11123456789992'),
                'm2=', param());
      assert.deepEqual(hule.hupai, [{ name: '純正九蓮宝燈', fanshu: '**' }]);
    });

    test('ドラ: ドラなし', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('p55m234s789,m4-56,z111+'),
                's9=', param({baopai:['s1']}));
      assert.deepEqual(hule.hupai, [{ name: '場風 東', fanshu: 1 }]);
    });
    test('ドラ: 手牌内: 1', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('p55m234s789,m4-56,z111+'),
                's9=', param({baopai:['m2']}));
      assert.deepEqual(hule.hupai, [{ name: '場風 東', fanshu: 1 },
                                    { name: 'ドラ',    fanshu: 1 }]);
    });
    test('ドラ: 手牌内: 2', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('p55m234s789,m4-56,z111+'),
                's9=', param({baopai:['p4']}));
      assert.deepEqual(hule.hupai, [{ name: '場風 東', fanshu: 1 },
                                    { name: 'ドラ',    fanshu: 2 }]);
    });
    test('ドラ: 手牌内: 1, 副露内: 1', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('p55m234s789,m4-56,z111+'),
                's9=', param({baopai:['m3']}));
      assert.deepEqual(hule.hupai, [{ name: '場風 東', fanshu: 1 },
                                    { name: 'ドラ',    fanshu: 2 }]);
    });
    test('ドラ: 槓ドラ: 1', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('p55m234s789,m4-56,z111+'),
                's9=', param({baopai:['s1','m2']}));
      assert.deepEqual(hule.hupai, [{ name: '場風 東', fanshu: 1 },
                                    { name: 'ドラ',    fanshu: 1 }]);
    });
    test('ドラ: 赤ドラ: 2', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('p50m234s789,m4-06,z111+'),
                's9=', param({baopai:['s1']}));
      assert.deepEqual(hule.hupai, [{ name: '場風 東', fanshu: 1 },
                                    { name: '赤ドラ',  fanshu: 2 }]);
    });
    test('ドラ: 赤のダブドラ', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('p55m234s789,m4-06,z111+'),
                's9=', param({baopai:['m4']}));
      assert.deepEqual(hule.hupai, [{ name: '場風 東', fanshu: 1 },
                                    { name: 'ドラ',    fanshu: 1 },
                                    { name: '赤ドラ',  fanshu: 1 }]);
    });
    test('ドラ: ドラ表示牌が赤牌', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('p55m234s789,m4-56,z111+'),
                's9=', param({baopai:['m0']}));
      assert.deepEqual(hule.hupai, [{ name: '場風 東', fanshu: 1 },
                                    { name: 'ドラ',    fanshu: 1 }]);
    });
    test('ドラ: 裏ドラなし', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m344556s24678z66s3*'),
                's3=', param({lizhi:1, baopai:['s9'], fubaopai:['s9']}));
      assert.deepEqual(hule.hupai, [{ name: '立直',   fanshu: 1 }]);
    });
    test('ドラ: 裏ドラ: 1', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m344556s24678z66s3*'),
                's3=', param({lizhi:1, baopai:['s9'], fubaopai:['m2']}));
      assert.deepEqual(hule.hupai, [{ name: '立直',   fanshu: 1 },
                                    { name: '裏ドラ', fanshu: 1 }]);
    });
    test('ドラ: ドラ: 1, 裏ドラ: 1', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m344556s24678z66s3*'),
                's3=', param({lizhi:1, baopai:['m2'], fubaopai:['m2']}));
      assert.deepEqual(hule.hupai, [{ name: '立直',   fanshu: 1 },
                                    { name: 'ドラ',   fanshu: 1 },
                                    { name: '裏ドラ', fanshu: 1 }]);
    });
    test('ドラ: ドラのみでの和了は不可', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m344556s24678z66s3'),
                's3=', param({baopai:['m2']}));
      assert.ifError(hule.hupai);
    });
    test('ドラ: 役満にドラはつかない', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m119p19s19z1234567'),
                null, param({baopai:['m9']}));
      assert.deepEqual(hule.hupai, [{ name: '国士無双', fanshu: '*' }]);
    });

    test('点計算: 20符 2翻 子 ツモ → 400/700', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('z33m123p456s789m234'),
                null, param());
      assert.deepEqual(hule,
                        { hupai: [{ name: '門前清自摸和', fanshu: 1 },
                                  { name: '平和',       fanshu: 1 }],
                          fu: 20, fanshu: 2, damanguan: null, defen: 1500,
                          fenpei: [  -700,  1500,  -400,  -400]});
    });
    test('点計算: 20符 3翻 親 ツモ → 1300∀', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('z33m123p456s789m231'),
                null, param({menfeng:0}));
      assert.deepEqual(hule,
                        { hupai: [{ name: '門前清自摸和', fanshu: 1 },
                                  { name: '平和',       fanshu: 1 },
                                  { name: '一盃口',      fanshu: 1 }],
                          fu: 20, fanshu: 3, damanguan: null, defen: 3900,
                          fenpei: [  3900, -1300, -1300, -1300]});
    });
    test('点計算: 20符 4翻 子 ツモ → 1300/2600', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('z33m123p234s234m234'),
                null, param());
      assert.deepEqual(hule,
                        { hupai: [{ name: '門前清自摸和', fanshu: 1 },
                                  { name: '平和',       fanshu: 1 },
                                  { name: '三色同順',    fanshu: 2 }],
                          fu: 20, fanshu: 4, damanguan: null, defen: 5200,
                          fenpei: [ -2600,  5200, -1300, -1300]});
    });
    test('点計算: 25符 2翻 子 ロン → 1600', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m1122p3344s5566z77'),
                'z7-', param({lizhibang:1,changbang:1}));
      assert.deepEqual(hule,
                        { hupai: [{ name: '七対子', fanshu: 2 }],
                          fu: 25, fanshu: 2, damanguan: null, defen: 1600,
                          fenpei: [ -1900,  2900,     0,     0]});
    });
    test('点計算: 25符 3翻 親 ツモ → 1600∀', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m1122p3344s5566z77'),
                null, param({menfeng:0,lizhibang:1,changbang:1}));
      assert.deepEqual(hule,
                        { hupai: [{ name: '門前清自摸和', fanshu: 1 },
                                  { name: '七対子',      fanshu: 2 }],
                          fu: 25, fanshu: 3, damanguan: null, defen: 4800,
                          fenpei: [  6100, -1700, -1700, -1700]});
    });
    test('点計算: 25符 4翻 子 ツモ → 1600/3200', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m2277p3344s556688'),
                null, param({lizhibang:1,changbang:1}));
      assert.deepEqual(hule,
                        { hupai: [{ name: '門前清自摸和', fanshu: 1 },
                                  { name: '断幺九',      fanshu: 1 },
                                  { name: '七対子',      fanshu: 2 }],
                          fu: 25, fanshu: 4, damanguan: null, defen: 6400,
                          fenpei: [ -3300,  7700, -1700, -1700]});
    });
    test('点計算: 30符 1翻 親 ロン → 1500', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m77234p456s678,m34-5'),
                's8=', param({menfeng:0}));
      assert.deepEqual(hule,
                        { hupai: [{ name: '断幺九', fanshu: 1 }],
                          fu: 30, fanshu: 1, damanguan: null, defen: 1500,
                          fenpei: [  1500,     0, -1500,     0]});
    });
    test('点計算: 30符 2翻 子 ロン → 2000', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m77234p345s345,m34-5'),
                's5-', param());
      assert.deepEqual(hule,
                        { hupai: [{ name: '断幺九',    fanshu: 1 },
                                  { name: '三色同順',  fanshu: 1 }],
                          fu: 30, fanshu: 2, damanguan: null, defen: 2000,
                          fenpei: [ -2000,  2000,     0,     0]});
    });
    test('点計算: 30符 3翻 親 ツモ → 2000∀', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m22z111p445566s789'),
                null, param({zhuangfeng:1,menfeng:0}));
      assert.deepEqual(hule,
                        { hupai: [{ name: '門前清自摸和', fanshu: 1 },
                                  { name: '自風 東',     fanshu: 1 },
                                  { name: '一盃口',      fanshu: 1 }],
                          fu: 30, fanshu: 3, damanguan: null, defen: 6000,
                          fenpei: [  6000, -2000, -2000, -2000]});
    });
    test('点計算: 30符 4翻 子 ツモ → 2000/3900', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m11z111p123789s789'),
                null, param());
      assert.deepEqual(hule,
                        { hupai: [{ name: '門前清自摸和', fanshu: 1 },
                                  { name: '場風 東',     fanshu: 1 },
                                  { name: '混全帯幺九',   fanshu: 2 }],
                          fu: 30, fanshu: 4, damanguan: null, defen: 7900,
                          fenpei: [ -3900,  7900, -2000, -2000]});
    });
    test('点計算: 40符 1翻 親 ロン → 2000', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m11234234p456s897'),
                's7=', param({menfeng:0}));
      assert.deepEqual(hule,
                        { hupai: [{ name: '一盃口', fanshu: 1 }],
                          fu: 40, fanshu: 1, damanguan: null, defen: 2000,
                          fenpei: [  2000,     0, -2000,     0]});
    });
    test('点計算: 40符 2翻 子 ロン → 2600', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m22334455p456s687'),
                's7-', param());
      assert.deepEqual(hule,
                        { hupai: [{ name: '断幺九',    fanshu: 1 },
                                  { name: '一盃口',    fanshu: 1 }],
                          fu: 40, fanshu: 2, damanguan: null, defen: 2600,
                          fenpei: [ -2600,  2600,     0,     0]});
    });
    test('点計算: 40符 3翻 親 ツモ → 2600∀', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('z33222m222,s222=,p999+'),
                null, param({zhuangfeng:1,menfeng:0}));
      assert.deepEqual(hule,
                        { hupai: [{ name: '場風 南',     fanshu: 1 },
                                  { name: '対々和',      fanshu: 2 }],
                          fu: 40, fanshu: 3, damanguan: null, defen: 7800,
                          fenpei: [  7800, -2600, -2600, -2600]});
    });
    test('点計算: 40符 4翻 子 ツモ → 2000/4000', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('z33222m222,s222=,p999+'),
                null, param({zhuangfeng:1}));
      assert.deepEqual(hule,
                        { hupai: [{ name: '場風 南',     fanshu: 1 },
                                  { name: '自風 南',     fanshu: 1 },
                                  { name: '対々和',      fanshu: 2 }],
                          fu: 40, fanshu: 4, damanguan: null, defen: 8000,
                          fenpei: [ -4000,  8000, -2000, -2000]});
    });
    test('点計算: 50符 1翻 親 ロン → 2400', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m123p456s789z22277'),
                'z7=', param({zhuangfeng:1,menfeng:0}));
      assert.deepEqual(hule,
                        { hupai: [{ name: '場風 南',     fanshu: 1 }],
                          fu: 50, fanshu: 1, damanguan: null, defen: 2400,
                          fenpei: [  2400,     0, -2400,     0]});
    });
    test('点計算: 50符 2翻 子 ロン → 3200', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m123p456s789z22277'),
                'z7-', param({zhuangfeng:1}));
      assert.deepEqual(hule,
                        { hupai: [{ name: '場風 南',     fanshu: 1 },
                                  { name: '自風 南',     fanshu: 1 }],
                          fu: 50, fanshu: 2, damanguan: null, defen: 3200,
                          fenpei: [ -3200,  3200,     0,     0]});
    });
    test('点計算: 50符 3翻 親 ツモ → 3200∀', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('z33m222z222,p8888,s789-'),
                null, param({zhuangfeng:1,menfeng:0}));
      assert.deepEqual(hule,
                        { hupai: [{ name: '場風 南',     fanshu: 1 },
                                  { name: '三暗刻',      fanshu: 2 }],
                          fu: 50, fanshu: 3, damanguan: null, defen: 9600,
                          fenpei: [  9600, -3200, -3200, -3200]});
    });
    test('点計算: 50符 4翻 子 ツモ → 2000/4000', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('z33m222z222,p8888,s789-'),
                null, param({zhuangfeng:1}));
      assert.deepEqual(hule,
                        { hupai: [{ name: '場風 南',     fanshu: 1 },
                                  { name: '自風 南',     fanshu: 1 },
                                  { name: '三暗刻',      fanshu: 2 }],
                          fu: 50, fanshu: 4, damanguan: null, defen: 8000,
                          fenpei: [ -4000,  8000, -2000, -2000]});
    });
    test('点計算: 60符 1翻 親 ロン → 2900', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('s789z22277,m2222,p111='),
                'z7=', param({zhuangfeng:1,menfeng:0}));
      assert.deepEqual(hule,
                        { hupai: [{ name: '場風 南',     fanshu: 1 }],
                          fu: 60, fanshu: 1, damanguan: null, defen: 2900,
                          fenpei: [  2900,     0, -2900,     0]});
    });
    test('点計算: 60符 2翻 子 ロン → 3900', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('s789z22277,m2222,p111='),
                'z7-', param({zhuangfeng:1}));
      assert.deepEqual(hule,
                        { hupai: [{ name: '場風 南',     fanshu: 1 },
                                  { name: '自風 南',     fanshu: 1 }],
                          fu: 60, fanshu: 2, damanguan: null, defen: 3900,
                          fenpei: [ -3900,  3900,     0,     0]});
    });
    test('点計算: 60符 3翻 親 ツモ → 3900∀', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m11222789,z2222,m444='),
                null, param({zhuangfeng:1,menfeng:0}));
      assert.deepEqual(hule,
                        { hupai: [{ name: '場風 南',     fanshu: 1 },
                                  { name: '混一色',      fanshu: 2 }],
                          fu: 60, fanshu: 3, damanguan: null, defen: 11700,
                          fenpei: [ 11700, -3900, -3900, -3900]});
    });
    test('点計算: 60符 4翻 子 ツモ → 2000/4000', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m11222789,z2222,m444='),
                null, param({zhuangfeng:1}));
      assert.deepEqual(hule,
                        { hupai: [{ name: '場風 南',     fanshu: 1 },
                                  { name: '自風 南',     fanshu: 1 },
                                  { name: '混一色',      fanshu: 2 }],
                          fu: 60, fanshu: 4, damanguan: null, defen: 8000,
                          fenpei: [ -4000,  8000, -2000, -2000]});
    });
    test('点計算: 70符 1翻 親 ロン → 3400', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m12377p456s78s9,z2222'),
                's9=', param({zhuangfeng:1,menfeng:0}));
      assert.deepEqual(hule,
                        { hupai: [{ name: '場風 南',     fanshu: 1 }],
                          fu: 70, fanshu: 1, damanguan: null, defen: 3400,
                          fenpei: [  3400,     0, -3400,     0]});
    });
    test('点計算: 70符 2翻 子 ロン → 4500', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m12377p456s78s9,z2222'),
                's9-', param({zhuangfeng:1}));
      assert.deepEqual(hule,
                        { hupai: [{ name: '場風 南',     fanshu: 1 },
                                  { name: '自風 南',     fanshu: 1 }],
                          fu: 70, fanshu: 2, damanguan: null, defen: 4500,
                          fenpei: [ -4500,  4500,     0,     0]});
    });
    test('点計算: 70符 3翻 親 ツモ → 4000∀', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('p77s223344,z2222,m2222'),
                null, param({zhuangfeng:1,menfeng:0}));
      assert.deepEqual(hule,
                        { hupai: [{ name: '門前清自摸和', fanshu: 1 },
                                  { name: '場風 南',     fanshu: 1 },
                                  { name: '一盃口',      fanshu: 1 }],
                          fu: 70, fanshu: 3, damanguan: null, defen: 12000,
                          fenpei: [ 12000, -4000, -4000, -4000]});
    });
    test('点計算: 80符 1翻 親 ロン → 3900', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m22s888p345,z222+2,z4444'),
                'p5=', param({zhuangfeng:1,menfeng:0}));
      assert.deepEqual(hule,
                        { hupai: [{ name: '場風 南',     fanshu: 1 }],
                          fu: 80, fanshu: 1, damanguan: null, defen: 3900,
                          fenpei: [  3900,     0, -3900,     0]});
    });
    test('点計算: 80符 2翻 子 ロン → 5200', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m22s888p345,z222+2,z4444'),
                'p5-', param({zhuangfeng:1}));
      assert.deepEqual(hule,
                        { hupai: [{ name: '場風 南',     fanshu: 1 },
                                  { name: '自風 南',     fanshu: 1 }],
                          fu: 80, fanshu: 2, damanguan: null, defen: 5200,
                          fenpei: [ -5200,  5200,     0,     0]});
    });
    test('点計算: 80符 3翻 親 ツモ → 4000∀', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m11p999s123,z222+2,z1111'),
                null, param({zhuangfeng:1,menfeng:0}));
      assert.deepEqual(hule,
                        { hupai: [{ name: '場風 南',     fanshu: 1 },
                                  { name: '自風 東',     fanshu: 1 },
                                  { name: '混全帯幺九',   fanshu: 1 }],
                          fu: 80, fanshu: 3, damanguan: null, defen: 12000,
                          fenpei: [ 12000, -4000, -4000, -4000]});
    });
    test('点計算: 90符 1翻 親 ロン → 4400', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('p88m123s999,s6666,z2222'),
                's9=', param({zhuangfeng:1,menfeng:0}));
      assert.deepEqual(hule,
                        { hupai: [{ name: '場風 南',     fanshu: 1 }],
                          fu: 90, fanshu: 1, damanguan: null, defen: 4400,
                          fenpei: [  4400,     0, -4400,     0]});
    });
    test('点計算: 90符 2翻 子 ロン → 5800', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('p88m123s999,s6666,z2222'),
                's9-', param({zhuangfeng:1}));
      assert.deepEqual(hule,
                        { hupai: [{ name: '場風 南',     fanshu: 1 },
                                  { name: '自風 南',     fanshu: 1 }],
                          fu: 90, fanshu: 2, damanguan: null, defen: 5800,
                          fenpei: [ -5800,  5800,     0,     0]});
    });
    test('点計算: 90符 3翻 親 ツモ → 4000∀', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m22s345,z5555,z2222,z666-'),
                null, param({zhuangfeng:1,menfeng:0}));
      assert.deepEqual(hule,
                        { hupai: [{ name: '場風 南',     fanshu: 1 },
                                  { name: '翻牌 白',     fanshu: 1 },
                                  { name: '翻牌 發',     fanshu: 1 }],
                          fu: 90, fanshu: 3, damanguan: null, defen: 12000,
                          fenpei: [ 12000, -4000, -4000, -4000]});
    });
    test('点計算: 100符 1翻 親 ロン → 4800', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m22p345s678,z2222,s9999'),
                's8=', param({zhuangfeng:1,menfeng:0}));
      assert.deepEqual(hule,
                        { hupai: [{ name: '場風 南',     fanshu: 1 }],
                          fu: 100, fanshu: 1, damanguan: null, defen: 4800,
                          fenpei: [  4800,     0, -4800,     0]});
    });
    test('点計算: 100符 2翻 子 ロン → 6400', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m22p345s678,z2222,s9999'),
                's8-', param({zhuangfeng:1}));
      assert.deepEqual(hule,
                        { hupai: [{ name: '場風 南',     fanshu: 1 },
                                  { name: '自風 南',     fanshu: 1 }],
                          fu: 100, fanshu: 2, damanguan: null, defen: 6400,
                          fenpei: [ -6400,  6400,     0,     0]});
    });
    test('点計算: 100符 3翻 親 ツモ → 4000∀', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('z11m999p243,s1111,s9999'),
                null, param({zhuangfeng:1,menfeng:0}));
      assert.deepEqual(hule,
                        { hupai: [{ name: '門前清自摸和', fanshu: 1 },
                                  { name: '三暗刻',      fanshu: 2 }],
                          fu: 100, fanshu: 3, damanguan: null, defen: 12000,
                          fenpei: [ 12000, -4000, -4000, -4000]});
    });
    test('点計算: 110符 1翻 親 ロン → 5300', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m234z11777,p1111,s9999'),
                'z7=', param({menfeng:0}));
      assert.deepEqual(hule,
                        { hupai: [{ name: '翻牌 中',     fanshu: 1 }],
                          fu: 110, fanshu: 1, damanguan: null, defen: 5300,
                          fenpei: [  5300,     0, -5300,     0]});
    });
    test('点計算: 110符 2翻 子 ロン → 7100', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m234z22777,p1111,z5555'),
                'z7-', param({zhuangfeng:1}));
      assert.deepEqual(hule,
                        { hupai: [{ name: '翻牌 白',     fanshu: 1 },
                                  { name: '翻牌 中',     fanshu: 1 }],
                          fu: 110, fanshu: 2, damanguan: null, defen: 7100,
                          fenpei: [ -7100,  7100,     0,     0]});
    });
    test('点計算: 110符 3翻 親 ツモ → 4000∀', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m243z11,p1111,s9999,z555+5'),
                null, param({zhuangfeng:1,menfeng:0}));
      assert.deepEqual(hule,
                        { hupai: [{ name: '翻牌 白',     fanshu: 1 },
                                  { name: '三槓子',      fanshu: 2 }],
                          fu: 110, fanshu: 3, damanguan: null, defen: 12000,
                          fenpei: [ 12000, -4000, -4000, -4000]});
    });
    test('点計算: 5翻 親 ロン → 12000', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m22456p456s445566'),
                's6=', param({menfeng:0}));
      assert.deepEqual(hule,
                        { hupai: [{ name: '平和',        fanshu: 1 },
                                  { name: '断幺九',      fanshu: 1 },
                                  { name: '一盃口',      fanshu: 1 },
                                  { name: '三色同順',    fanshu: 2 }],
                          fu: 30, fanshu: 5, damanguan: null, defen: 12000,
                          fenpei: [ 12000,     0,-12000,     0]});
    });
    test('点計算: 6翻 子 ツモ → 3000/6000', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m22456p456s445566'),
                null, param());
      assert.deepEqual(hule,
                        { hupai: [{ name: '門前清自摸和', fanshu: 1 },
                                  { name: '平和',        fanshu: 1 },
                                  { name: '断幺九',      fanshu: 1 },
                                  { name: '一盃口',      fanshu: 1 },
                                  { name: '三色同順',    fanshu: 2 }],
                          fu: 20, fanshu: 6, damanguan: null, defen: 12000,
                          fenpei: [ -6000, 12000, -3000, -3000]});
    });
    test('点計算: 7翻 親 ロン → 18000', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m111z333444,z222=,m999-'),
                'z4=', param({zhuangfeng:1,menfeng:0}));
      assert.deepEqual(hule,
                        { hupai: [{ name: '場風 南',     fanshu: 1 },
                                  { name: '対々和',      fanshu: 2 },
                                  { name: '混老頭',      fanshu: 2 },
                                  { name: '混一色',      fanshu: 2 }],
                          fu: 50, fanshu: 7, damanguan: null, defen: 18000,
                          fenpei: [ 18000,     0,-18000,     0]});
    });
    test('点計算: 8翻 子 ツモ → 4000/8000', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m111z333444,z222=,m999-'),
                null, param({zhuangfeng:1}));
      assert.deepEqual(hule,
                        { hupai: [{ name: '場風 南',     fanshu: 1 },
                                  { name: '自風 南',     fanshu: 1 },
                                  { name: '対々和',      fanshu: 2 },
                                  { name: '混老頭',      fanshu: 2 },
                                  { name: '混一色',      fanshu: 2 }],
                          fu: 50, fanshu: 8, damanguan: null, defen: 16000,
                          fenpei: [ -8000, 16000, -4000, -4000]});
    });
    test('点計算: 9翻 親 ロン → 24000', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('s22233344555678'),
                's8=', param({menfeng:0}));
      assert.deepEqual(hule,
                        { hupai: [{ name: '断幺九',      fanshu: 1 },
                                  { name: '三暗刻',      fanshu: 2 },
                                  { name: '清一色',      fanshu: 6 }],
                          fu: 50, fanshu: 9, damanguan: null, defen: 24000,
                          fenpei: [ 24000,     0,-24000,     0]});
    });
    test('点計算: 10翻 子 ツモ → 4000/8000', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('s22233344555678'),
                null, param());
      assert.deepEqual(hule,
                        { hupai: [{ name: '門前清自摸和', fanshu: 1 },
                                  { name: '断幺九',      fanshu: 1 },
                                  { name: '三暗刻',      fanshu: 2 },
                                  { name: '清一色',      fanshu: 6 }],
                          fu: 40, fanshu: 10, damanguan: null, defen: 16000,
                          fenpei: [ -8000, 16000, -4000, -4000]});
    });
    test('点計算: 11翻 親 ロン → 36000', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('p22334455667788'),
                'p8=', param({menfeng:0}));
      assert.deepEqual(hule,
                        { hupai: [{ name: '平和',        fanshu: 1 },
                                  { name: '断幺九',      fanshu: 1 },
                                  { name: '二盃口',      fanshu: 3 },
                                  { name: '清一色',      fanshu: 6 }],
                          fu: 30, fanshu: 11, damanguan: null, defen: 36000,
                          fenpei: [ 36000,     0,-36000,     0]});
    });
    test('点計算: 12翻 子 ツモ → 6000/12000', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('p22334455667788'),
                null, param());
      assert.deepEqual(hule,
                        { hupai: [{ name: '門前清自摸和', fanshu: 1 },
                                  { name: '平和',        fanshu: 1 },
                                  { name: '断幺九',      fanshu: 1 },
                                  { name: '二盃口',      fanshu: 3 },
                                  { name: '清一色',      fanshu: 6 }],
                          fu: 20, fanshu: 12, damanguan: null, defen: 24000,
                          fenpei: [-12000, 24000, -6000, -6000]});
    });
    test('点計算: 13翻 親 ロン → 48000', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m11777788889999'),
                'm9=', param({menfeng:0}));
      assert.deepEqual(hule,
                        { hupai: [{ name: '平和',        fanshu: 1 },
                                  { name: '純全帯幺九',   fanshu: 3 },
                                  { name: '二盃口',      fanshu: 3 },
                                  { name: '清一色',      fanshu: 6 }],
                          fu: 30, fanshu: 13, damanguan: null, defen: 48000,
                          fenpei: [ 48000,     0,-48000,     0]});
    });
    test('点計算: 役満複合 子 ツモ → 24000/48000', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('z77111z444,z222+,z333-'),
                null, param());
      assert.deepEqual(hule,
                        { hupai: [{ name: '大四喜',      fanshu: '**' },
                                  { name: '字一色',      fanshu: '*'  }],
                          fu: null, fanshu: null, damanguan: 3, defen: 96000,
                          fenpei: [-48000, 96000,-24000,-24000]});
    });
    test('点計算: 役満パオ 放銃者なし、責任払い', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m11p456,z555+,z666=,z777-'),
                null, param({menfeng:0,lizhibang:1,changbang:1}));
      assert.deepEqual(hule,
                        { hupai: [{ name: '大三元', fanshu: '*', baojia: '-' }],
                          fu: null, fanshu: null, damanguan: 1, defen: 48000,
                          fenpei: [ 49300,     0,     0,-48300]});
    });
    test('点計算: 役満パオ 放銃者あり、放銃者と折半', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m11p456,z555+,z666=,z777-'),
                'p6=', param({menfeng:0,lizhibang:1,changbang:1}));
      assert.deepEqual(hule,
                        { hupai: [{ name: '大三元', fanshu: '*', baojia: '-' }],
                          fu: null, fanshu: null, damanguan: 1, defen: 48000,
                          fenpei: [ 49300,     0,-24300,-24000]});
    });
    test('点計算: 役満パオ パオが放銃、全額責任払い', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m11p456,z555+,z666=,z777-'),
                'p6-', param({menfeng:0,lizhibang:1,changbang:1}));
      assert.deepEqual(hule,
                        { hupai: [{ name: '大三元', fanshu: '*', baojia: '-' }],
                          fu: null, fanshu: null, damanguan: 1, defen: 48000,
                          fenpei: [ 49300,     0,     0,-48300]});
    });
    test('点計算: ダブル役満パオ 放銃者なし、関連役満のみ責任払い', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('z77,z111-,z2222,z333=3,z444+'),
                null, param({lizhibang:1,changbang:1}));
      assert.deepEqual(hule,
                        { hupai: [{ name: '大四喜', fanshu: '**', baojia: '+' },
                                  { name: '字一色', fanshu: '*' }],
                          fu: null, fanshu: null, damanguan: 3, defen: 96000,
                          fenpei: [-16100, 97300,-72100, -8100]});
    });
    test('点計算: ダブル役満パオ 放銃者あり、関連役満のみ放銃者と折半', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('z77,z111-,z2222,z333=3,z444+'),
                'z7-', param({lizhibang:1,changbang:1}));
      assert.deepEqual(hule,
                        { hupai: [{ name: '大四喜', fanshu: '**', baojia: '+' },
                                  { name: '字一色', fanshu: '*' }],
                          fu: null, fanshu: null, damanguan: 3, defen: 96000,
                          fenpei: [-64300, 97300,-32000,     0]});
    });
    test('点計算: ダブル役満パオ パオが放銃、全額責任払い', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('z77,z111-,z2222,z333=3,z444+'),
                'z7+', param({lizhibang:1,changbang:1}));
      assert.deepEqual(hule,
                        { hupai: [{ name: '大四喜', fanshu: '**', baojia: '+' },
                                  { name: '字一色', fanshu: '*' }],
                          fu: null, fanshu: null, damanguan: 3, defen: 96000,
                          fenpei: [     0, 97300,-96300,     0]});
    });
    test('高点法: 七対子と二盃口の選択', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m223344p556677s88'),
                's8=', param());
      assert.deepEqual(hule,
                        { hupai: [{ name: '断幺九',      fanshu: 1 },
                                  { name: '二盃口',      fanshu: 3 }],
                          fu: 40, fanshu: 4, damanguan: null, defen: 8000,
                          fenpei: [     0,  8000,    0, -8000]});
    });
    test('高点法: 雀頭候補2つの選択', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m2234455p234s234m3'),
                'm3=', param());
      assert.deepEqual(hule,
                        { hupai: [{ name: '断幺九',      fanshu: 1 },
                                  { name: '一盃口',      fanshu: 1 },
                                  { name: '三色同順',    fanshu: 2 }],
                          fu: 40, fanshu: 4, damanguan: null, defen: 8000,
                          fenpei: [     0,  8000,    0, -8000]});
    });
    test('高点法: 順子と刻子の選択', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m111222333p89997'),
                'p7=', param());
      assert.deepEqual(hule,
                        { hupai: [{ name: '一盃口',      fanshu: 1 },
                                  { name: '純全帯幺九',   fanshu: 3 }],
                          fu: 40, fanshu: 4, damanguan: null, defen: 8000,
                          fenpei: [     0,  8000,    0, -8000]});
    });
    test('高点法: 嵌張待ち両面待ちの選択', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m12334p567z11z777m2'),
                'm2=', param());
      assert.deepEqual(hule,
                        { hupai: [{ name: '翻牌 中',     fanshu: 1 }],
                          fu: 50, fanshu: 1, damanguan: null, defen: 1600,
                          fenpei: [     0,  1600,    0, -1600]});
    });
    test('高点法: 得点が同じ場合は翻数が多い方を選択', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m111222333p78999'),
                'p9=', param());
      assert.deepEqual(hule,
                        { hupai: [{ name: '平和',        fanshu: 1 },
                                  { name: '一盃口',      fanshu: 1 },
                                  { name: '純全帯幺九',   fanshu: 3 }],
                          fu: 30, fanshu: 5, damanguan: null, defen: 8000,
                          fenpei: [     0,  8000,    0, -8000]});
    });
    test('高点法: 得点・翻数が同じ場合は符が多い方を選択', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('s11122233355789'),
                's9=', param());
      assert.deepEqual(hule,
                        { hupai: [{ name: '三暗刻',      fanshu: 2 },
                                  { name: '清一色',      fanshu: 6 }],
                          fu: 50, fanshu: 8, damanguan: null, defen: 16000,
                          fenpei: [     0, 16000,    0,-16000]});
    });
    test('高点法: 役満と数え役満では役満を選択', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m11123457899996'),
                null, param({lizhi:1,yifa:true,baopai:['m2'],fubaopai:['m5']}));
      assert.deepEqual(hule,
                        { hupai: [{ name: '九蓮宝燈',    fanshu: '*' }],
                          fu: null, fanshu: null, damanguan: 1, defen: 32000,
                          fenpei: [-16000, 32000, -8000, -8000]});
    });

    test('和了点計算: 10000パターン', function(){
      for (let t of data) {
        hule = Majiang.Util.hule(Majiang.Shoupai.fromString(t.in.shoupai),
                                 t.in.rongpai, t.in.param);
        assert.deepEqual(hule, t.out, t.in.shoupai);                         
      }
    });
  });
});
