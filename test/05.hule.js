const assert = require('assert');

const Majiang = require('../src/js/majiang');

const data = require('./data/hule.json');

function param(opt = {}) {

    let param = {
        quanfeng:   0,
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
    // test('和了形以外: 空の手牌', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString(), null, param());
    //   assert.ifError(hule);
    // });
    // test('和了形以外: 打牌直後の手牌', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m123p456s789z1122'),
    //             null, param());
    //   assert.ifError(hule);
    // });
    // test('和了形以外: 副露直後の手牌', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m123p456s789z11,z333=,'),
    //             null, param());
    //   assert.ifError(hule);
    // });
    // test('和了形以外: 一般手聴牌', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m123333p89z111,s456-'),
    //             null, param());
    //   assert.ifError(hule);
    // });
    // test('和了形以外: 少牌', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m11'), null, param());
    //   assert.ifError(hule);
    // });
    // test('和了形以外: 七对子形4枚使い', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m114477p1199s1111'),
    //             null, param());
    //   assert.ifError(hule);
    // });
    // test('和了形以外: 国士無双13面待ち聴牌', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m19p19s19z1234567m0*'),
    //             null, param({lizhi: 1}));
    //   assert.ifError(hule);
    // });
    // test('和了形以外: 九蓮宝燈聴牌', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m111234567899p1m9'),
    //             null, param());
    //   assert.ifError(hule);
    // });
    //
    // test('符計算: 平和ツモは20符', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m345567p234s33789'),
    //             null, param());
    //   assert.equal(hule.fu, 20);
    // });
    // test('符計算: 平和ロンは30符', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m345567p234s33789'),
    //             's9=', param());
    //   assert.equal(hule.fu, 30);
    // });
    // test('符計算: オタ風の雀頭に符はつかない', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m112233p456z33s789'),
    //             's9=', param());
    //   assert.equal(hule.fu, 30);
    // });
    // test('符計算: 場風の雀頭は2符', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m112233p456z11s789'),
    //             's9=', param());
    //   assert.equal(hule.fu, 40);
    // });
    // test('符計算: 自風の雀頭は2符', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m112233p456z22s789'),
    //             's9=', param());
    //   assert.equal(hule.fu, 40);
    // });
    // test('符計算: 三元牌の雀頭は2符', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m112233p456z55s789'),
    //             's9=', param());
    //   assert.equal(hule.fu, 40);
    // });
    // test('符計算: 連風牌の雀頭は4符', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m112233z444z11s789'),
    //             's9=', param({menfeng:0}));
    //   assert.equal(hule.fu, 50);
    // });
    // test('符計算: 中張牌の明刻は2符', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m123z11m888,p888+,s888-'),
    //             'm8=', param({menfeng:0}));
    //   assert.equal(hule.fu, 30);
    // });
    // test('符計算: 幺九牌の明刻は4符', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m123p22s999,z222+,p111-'),
    //             's9=', param());
    //   assert.equal(hule.fu, 40);
    // });
    // test('符計算: 中張牌の暗刻は4符', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('z33p222777s888m234'),
    //             'm4=', param());
    //   assert.equal(hule.fu, 50);
    // });
    // test('符計算: 幺九牌の暗刻は8符', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('s33p111999z555m234'),
    //             'm4=', param());
    //   assert.equal(hule.fu, 60);
    // });
    // test('符計算: 中張牌の明槓は8符', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('p33m222456678,s444+4'),
    //             'm8=', param());
    //   assert.equal(hule.fu, 40);
    // });
    // test('符計算: 幺九牌の明槓は16符', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('p33m234456678,z6666-'),
    //             'm8=', param());
    //   assert.equal(hule.fu, 40);
    // });
    // test('符計算: 中張牌の暗槓は16符', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('p33m234456678,s4444'),
    //             'm8=', param());
    //   assert.equal(hule.fu, 50);
    // });
    // test('符計算: 幺九牌の暗槓は32符', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('p33m234456678,z7777'),
    //             'm8=', param());
    //   assert.equal(hule.fu, 70);
    // });
    // test('符計算: ツモ和了は2符加算', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('p33m222s222345,s888-'),
    //             null, param());
    //   assert.equal(hule.fu, 40);
    // });
    // test('符計算: 単騎待ちは2符加算', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m222s222345p33,s888-'),
    //             'p3=', param());
    //   assert.equal(hule.fu, 40);
    // });
    // test('符計算: 嵌張待ちは2符加算', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('p33m222s222354,s888-'),
    //             's4=', param());
    //   assert.equal(hule.fu, 40);
    // });
    // test('符計算: 辺張待ちは2符加算', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('p33z111m123897,s222-'),
    //             'm7=', param());
    //   assert.equal(hule.fu, 40);
    // });
    // test('符計算: 喰い平和は30符', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m22p345678s345,s67-8'),
    //             's5=', param());
    //   assert.equal(hule.fu, 30);
    // });
    // test('符計算: 七对子は25符', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m2255p88s1166z1155'),
    //             null, param());
    //   assert.equal(hule.fu, 25);
    // });
    // test('符計算: 国士無双は符なし', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m19p19s1z12345677s9'),
    //             null, param());
    //   assert.ifError(hule.fu);
    // });
    // test('符計算: 九蓮宝燈は符なし', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m11123456789995'),
    //             null, param());
    //   assert.ifError(hule.fu);
    // });
    //
    // test('番种 - 役なし', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m344556s24678z66s3'),
    //             's3=', param());
    //   assert.ifError(hule.hupai);
    // });
    //
    // test('番种 - 立直', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m344556s24678z66s3*'),
    //             's3=', param({lizhi:1}));
    //   assert.deepEqual(hule.hupai, [{ name: '立直', fanshu: 1 }]);
    // });
    // test('番种 - ダブル立直', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m344556s24678z66s3*'),
    //             's3=', param({lizhi:2}));
    //   assert.deepEqual(hule.hupai, [{ name: 'ダブル立直', fanshu: 2 }]);
    // });
    // test('番种 - 立直・一発', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m344556s24678z66s3*'),
    //             's3=', param({lizhi:1, yifa:true}));
    //   assert.deepEqual(hule.hupai, [{ name: '立直', fanshu: 1 },
    //                                 { name: '一発', fanshu: 1 }]);
    // });
    // test('番种 - 海底摸月', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m344556s24z66s3,s6-78'),
    //             null, param({haidi:1}));
    //   assert.deepEqual(hule.hupai, [{ name: '海底摸月', fanshu: 1 }]);
    // });
    // test('番种 - 河底撈魚', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m344556s24678z66s3'),
    //             's3=', param({haidi:2}));
    //   assert.deepEqual(hule.hupai, [{ name: '河底撈魚', fanshu: 1 }]);
    // });
    // test('番种 - 嶺上開花', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m344556s24z66s3,s777+7'),
    //             null, param({lingshang:true}));
    //   assert.deepEqual(hule.hupai, [{ name: '嶺上開花', fanshu: 1 }]);
    // });
    // test('番种 - 槍槓', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m344556s24678z66s3'),
    //             's3=', param({qianggang:true}));
    //   assert.deepEqual(hule.hupai, [{ name: '槍槓', fanshu: 1 }]);
    // });
    // test('番种 - 天和', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m344556s24678z66s3'),
    //             null, param({tianhu:1}));
    //   assert.deepEqual(hule.hupai, [{ name: '天和', fanshu: '*' }]);
    // });
    // test('番种 - 地和', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m344556s24678z66s3'),
    //             null, param({tianhu:2}));
    //   assert.deepEqual(hule.hupai, [{ name: '地和', fanshu: '*' }]);
    // });
    //
    // test('番种 - 門前清自摸和', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m344556s24678z66s3'),
    //             null, param());
    //   assert.deepEqual(hule.hupai, [{ name: '門前清自摸和', fanshu: 1 }]);
    // });
    // test('番种 - 場風 東', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m345567s33789z111'),
    //             's9=', param());
    //   assert.deepEqual(hule.hupai, [{ name: '場風 東', fanshu: 1 }]);
    // });
    // test('番种 - 自風 西', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m345567s33789,z333+'),
    //             null, param({menfeng:2}));
    //   assert.deepEqual(hule.hupai, [{ name: '自風 西', fanshu: 1 }]);
    // });
    // test('番种 - 連風牌 南', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m345567s33z222,s789-'),
    //             'z2=', param({zhuangfeng:1}));
    //   assert.deepEqual(hule.hupai, [{ name: '場風 南', fanshu: 1 },
    //                                 { name: '自風 南', fanshu: 1 }]);
    // });
    // test('番种 - 翻牌 白', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m345567s33789,z555+5'),
    //             null, param());
    //   assert.deepEqual(hule.hupai, [{ name: '翻牌 白', fanshu: 1 }]);
    // });
    // test('番种 - 翻牌 發・中', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m345567s33,z6666+,z7777'),
    //             null, param());
    //   assert.deepEqual(hule.hupai, [{ name: '翻牌 發', fanshu: 1 },
    //                                 { name: '翻牌 中', fanshu: 1 }]);
    // });
    // test('番种 - 平和', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('z33m234456p78s123p9'),
    //             'p9=', param());
    //   assert.deepEqual(hule.hupai, [{ name: '平和', fanshu: 1 }]);
    // });
    // test('番种 - 平和・ツモ', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('z33m234456p78s123p9'),
    //             null, param());
    //   assert.deepEqual(hule.hupai, [{ name: '門前清自摸和', fanshu: 1 },
    //                                 { name: '平和', fanshu: 1 }]);
    // });
    // test('番种 - 喰い平和(役なし)', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('z33m234456p78p9,s1-23'),
    //             'p9=', param());
    //   assert.ifError(hule.hupai);
    // });
    // test('番种 - 断幺九', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m22555p234s786,p777-'),
    //             's6=', param());
    //   assert.deepEqual(hule.hupai, [{ name: '断幺九', fanshu: 1 }]);
    // });
    // test('番种 - 断幺九(七对子形)', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m2255p4488s336677'),
    //             's7=', param());
    //   assert.deepEqual(hule.hupai, [{ name: '断幺九', fanshu: 1 },
    //                                 { name: '七对子', fanshu: 2 }]);
    // });
    // test('番种 - 一盃口', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m33455p111s33789m4'),
    //             'm4=', param());
    //   assert.deepEqual(hule.hupai, [{ name: '一盃口', fanshu: 1 }]);
    // });
    // test('番种 - 喰い一盃口(役なし)', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m33455p111s33m4,s78-9'),
    //             'm4=', param());
    //   assert.ifError(hule.hupai);
    // });
    // test('番种 - 三色同順', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m567p567s22567999'),
    //             's9=', param());
    //   assert.deepEqual(hule.hupai, [{ name: '三色同順', fanshu: 2 }]);
    // });
    // test('番种 - 三色同順(喰い下がり)', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m567s22567999,p56-7'),
    //             's9=', param());
    //   assert.deepEqual(hule.hupai, [{ name: '三色同順', fanshu: 1 }]);
    // });
    // test('番种 - 一気通貫', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m12456789s33789m3'),
    //             'm3=', param());
    //   assert.deepEqual(hule.hupai, [{ name: '一気通貫', fanshu: 2 }]);
    // });
    // test('番种 - 一気通貫(喰い下がり)', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m12789s33789m3,m4-56'),
    //             'm3=', param());
    //   assert.deepEqual(hule.hupai, [{ name: '一気通貫', fanshu: 1 }]);
    // });
    // test('番种 - 混全帯幺九', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m123999p789z33s123'),
    //             's3=', param());
    //   assert.deepEqual(hule.hupai, [{ name: '混全帯幺九', fanshu: 2 }]);
    // });
    // test('番种 - 混全帯幺九(喰い下がり)', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m123p789z33s123,m999+'),
    //             's3=', param());
    //   assert.deepEqual(hule.hupai, [{ name: '混全帯幺九', fanshu: 1 }]);
    // });
    // test('番种 - 七对子', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m115599p2233s8z22s8'),
    //             's8=', param());
    //   assert.deepEqual(hule.hupai, [{ name: '七对子', fanshu: 2 }]);
    // });
    // test('番种 - 対々和', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m55888z333s222,p111='),
    //             's2=', param());
    //   assert.deepEqual(hule.hupai, [{ name: '対々和', fanshu: 2 }]);
    // });
    // test('番种 - 三暗刻', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('p99s111m555,p345-,s3333'),
    //             null, param());
    //   assert.deepEqual(hule.hupai, [{ name: '三暗刻', fanshu: 2 }]);
    // });
    // test('番种 - 三槓子', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('p11m453,s2222+,m888=8,z4444'),
    //             'm3=', param());
    //   assert.deepEqual(hule.hupai, [{ name: '三槓子', fanshu: 2 }]);
    // });
    // test('番种 - 三色同刻', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('s12377m222,p222-,s222-'),
    //             'm2=', param());
    //   assert.deepEqual(hule.hupai, [{ name: '三色同刻', fanshu: 2 }]);
    // });
    // test('番种 - 混老頭(対々和形)', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('z11p111999,m111=,z333+'),
    //             'p9=', param());
    //   assert.deepEqual(hule.hupai, [{ name: '対々和', fanshu: 2 },
    //                                 { name: '混老頭', fanshu: 2 }]);
    // });
    // test('番种 - 混老頭(七对子形)', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m1199p11s99z113355'),
    //             'z5=', param());
    //   assert.deepEqual(hule.hupai, [{ name: '七对子', fanshu: 2 },
    //                                 { name: '混老頭', fanshu: 2 }]);
    // });
    // test('番种 - 小三元', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('z55577m567p222,z666-'),
    //             'p2=', param());
    //   assert.deepEqual(hule.hupai, [{ name: '翻牌 白', fanshu: 1 },
    //                                 { name: '翻牌 發', fanshu: 1 },
    //                                 { name: '小三元',  fanshu: 2 }]);
    // });
    // test('番种 - 混一色', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m111234789z11333'),
    //             'z3=', param());
    //   assert.deepEqual(hule.hupai, [{ name: '混一色', fanshu: 3 }]);
    // });
    // test('番种 - 混一色(喰い下がり)', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('z11333p234789,p111+'),
    //             'p9=', param());
    //   assert.deepEqual(hule.hupai, [{ name: '混一色', fanshu: 2 }]);
    // });
    // test('番种 - 混一色(七对子形)', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('s11224488z225577'),
    //             'z7=', param());
    //   assert.deepEqual(hule.hupai, [{ name: '七对子', fanshu: 2 },
    //                                 { name: '混一色', fanshu: 3 }]);
    // });
    // test('番种 - 純全帯幺九', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m11s123p789s789m999'),
    //             'm9=', param());
    //   assert.deepEqual(hule.hupai, [{ name: '純全帯幺九', fanshu: 3 }]);
    // });
    // test('番种 - 純全帯幺九(喰い下がり)', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m11s123p789s789,m999='),
    //             's9=', param());
    //   assert.deepEqual(hule.hupai, [{ name: '純全帯幺九', fanshu: 2 }]);
    // });
    // test('番种 - 二盃口', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m223344p667788s99'),
    //             's9=', param());
    //   assert.deepEqual(hule.hupai, [{ name: '二盃口', fanshu: 3 }]);
    // });
    // test('番种 - 二盃口(4枚使い)', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m222233334444s99'),
    //             's9=', param());
    //   assert.deepEqual(hule.hupai, [{ name: '二盃口', fanshu: 3 }]);
    // });
    // test('番种 - 喰い二盃口(役なし)', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m223344p678s99,p678-'),
    //             's9=', param());
    //   assert.ifError(hule.hupai);
    // });
    // test('番种 - 清一色', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m11134566777789'),
    //             'm9=', param());
    //   assert.deepEqual(hule.hupai, [{ name: '清一色', fanshu: 6 }]);
    // });
    // test('番种 - 清一色(喰い下がり)', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('p23445551,p12-3,p7-89'),
    //             'p1=', param());
    //   assert.deepEqual(hule.hupai, [{ name: '清一色', fanshu: 5 }]);
    // });
    // test('番种 - 清一色(七对子形)', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('s11224455778899'),
    //             's9=', param());
    //   assert.deepEqual(hule.hupai, [{ name: '七对子', fanshu: 2 },
    //                                 { name: '清一色', fanshu: 6 }]);
    // });
    test('番种 - 大四喜', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m22z22244z4,z333+,z111-'),
                'z4=', param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '大四喜').length, 1);
    });
    test('番种 - 大三元', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m456p22z55566z6,z777+'),
                'z6=', param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '大三元').length, 1);
    });
    test('番种 - 十三幺', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m19p19s19z1234567m1'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '十三幺').length, 1);
    });
    test('番种 - 绿一色', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('s22334466z66z6,s888+'),
                'z6=', param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '绿一色').length, 1);
    });
    test('番种 - 绿一色(七对)', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('s2222444466888s8'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '绿一色').length, 1);
    });
    test('番种 - 九莲宝灯', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('s1112345678999s2'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '九莲宝灯').length, 1);
    });
    test('番种 - 九莲宝灯(清龙)', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('s1112345678999s1'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '九莲宝灯').length, 1);
    });
    test('番种 - 九莲宝灯(非纯正不计)', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('s1123456789999s1'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '九莲宝灯').length, 0);
    });
    test('番种 - 连七对', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('s2233445566788s7'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '连七对').length, 1);
    });
    test('番种 - 四杠', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m1m1,z5555,p222+2,p777-7,s1111-'),
                'm1=', param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '四杠').length, 1);
    });
    test('番种 - 小四喜', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m234z2244z4,z333+,z111-'),
                'z4=', param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '小四喜').length, 1);
    });
    test('番种 - 小三元', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m456p22z55566p2,z777+'),
                'p2=', param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '小三元').length, 1);
    });
    test('番种 - 字一色', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('z1112277z7,z555=,z444+'),
                'z7=', param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '字一色').length, 1);
    });
    test('番种 - 字一色(七对)', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('z1122334455667z7'),
                'z7=', param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '字一色').length, 1);
    });
    test('番种 - 一色双龙会', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('s1235789s5,s123-,s7-89'),
                's5=', param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '一色双龙会').length, 1);
    });
    test('番种 - 一色双龙会(七对)', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('s1122335778899s5'),
                's5=', param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '一色双龙会').length, 1);
    });
    test('番种 - 清幺九', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m1p111s111m1,s999-,m999='),
                'm1=', param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '清幺九').length, 1);
    });
    test('番种 - 清幺九(七对)', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m11119p99s111199m9'),
                'm9=', param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '清幺九').length, 1);
    });
    test('番种 - 四暗刻', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m11133p333s77z111s7'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '四暗刻').length, 1);
    });
    test('番种 - 一色四同顺', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('s1111222233334s4'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '一色四同顺').length, 1);
    });
    test('番种 - 一色四节高', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('s2223334445s5,s111='),
                's5=', param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '一色四节高').length, 1);
    });
    test('番种 - 一色四步高', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('s12334557z22s6,s789-'),
                's6=', param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '一色四步高').length, 1);
    });
    test('番种 - 混幺九', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('p11m111z11p1,s111-,z666='),
                'p1=', param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '混幺九').length, 1);
    });
    test('番种 - 混幺九(七对)', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m11119p99s11z1166m9'),
                'm9=', param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '混幺九').length, 1);
    });
    test('番种 - 三杠', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m1567m1,p222+2,p777-7,s1111-'),
                'm1=', param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '三杠').length, 1);
    });
    test('番种 - 七对', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m115599p2233s8z22s8'),
                's8=', param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '七对').length, 1);
    });
    test('番种 - 七对(四归一)', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m115599p22s888z22s8'),
                's8=', param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '七对').length, 1);
    });
    test('番种 - 七星不靠', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m39p147s28z123456z7'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '七星不靠').length, 1);
    });
    test('番种 - 清一色', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m1113456677778m9'),
                'm9=', param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '清一色').length, 1);
    });
    test('番种 - 清一色(七对)', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m1133445566778m8'),
                'm8=', param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '清一色').length, 1);
    });
    test('番种 - 一色三同顺', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('s1223399s1,s1-23,z555='),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '一色三同顺').length, 1);
    });
    test('番种 - 一色三节高', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('s2223355s3,s444-,p111='),
                's3=', param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '一色三节高').length, 1);
    });
    test('番种 - 全大', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m789p7999p8,s7-89,m789-'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '全大').length, 1);
    });
    test('番种 - 全大(七对)', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m779999p77899s99p8'),
                'p8=', param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '全大').length, 1);
    });
    test('番种 - 全中', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m666p44466s55s5,s444-'),
                's5+', param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '全中').length, 1);
    });
    test('番种 - 全中(七对)', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m446666p44566s66p5'),
                'p5=', param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '全中').length, 1);
    });
    test('番种 - 全小', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m11p12233p1,p1-23,p123-'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '全小').length, 1);
    });
    test('番种 - 全小(七对)', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m113333p112233s33p2'),
                'p2=', param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '全小').length, 1);
    });
    test('番种 - 全双刻', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('p22288s44p8,s666-,s888-'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '全双刻').length, 1);
    });
    test('番种 - 全双刻(七对不计)', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m222288p446666s8s8'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '全双刻').length, 0);
    });
    test('番种 - 清龙', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('s12345567z22s6,s789-'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '清龙').length, 1);
    });
    test('番种 - 一色三步高(紧)', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('s11156778z22s6,s789-'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '一色三步高').length, 1);
    });
    test('番种 - 一色三步高(松)', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('s11134557z22s6,s789-'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '一色三步高').length, 1);
    });
    test('番种 - 三色双龙会', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m789p5s123p5,s123-,m7-89'),
                'p5=', param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '三色双龙会').length, 1);
    });
    test('番种 - 全带五', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m456p555s5567s5,s456-'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '全带五').length, 1);
    });
    test('番种 - 三同刻', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m11144p11p1,s111=,z111+'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '三同刻').length, 1);
    });
    test('番种 - 三暗刻(自摸)', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m11133s77z111s7,p45-6'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '三暗刻').length, 1);
    });
    test('番种 - 三暗刻(点和)', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m11133p333s77z111s7'),
                's7=', param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '三暗刻').length, 1);
    });
    test('番种 - 全不靠', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m39p147s258z13456z7'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '全不靠').length, 1);
    });
    test('番种 - 组合龙(全不靠)', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m369p147s258z1346z7'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '组合龙').length, 1);
    });
    test('番种 - 组合龙(一般 听无关)', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m369p147s2245899s3'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '组合龙').length, 1);
    });
    test('番种 - 组合龙(一般 听龙架)', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m369p147s12358z11s2'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '组合龙').length, 1);
    });
    test('番种 - 组合龙(一般 副露)', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m369p147s5899s2,s345-'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '组合龙').length, 1);
    });
    test('番种 - 大于五', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m789p6777p8,s7-89,m789-'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '大于五').length, 1);
    });
    test('番种 - 小于五', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m44p12233p1,p1-23,p123-'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '小于五').length, 1);
    });
    test('番种 - 三风刻', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('z2224455566z4,z333+'),
                'z4=', param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '三风刻').length, 1);
    });
    test('番种 - 花龙', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m123p45567z22p6,s789-'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '花龙').length, 1);
    });
    test('番种 - 三色三同顺', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m12377p123s12345s6'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '三色三同顺').length, 1);
    });
    test('番种 - 三色三节高', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m11177p222s33345s3'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '三色三节高').length, 1);
    });
    test('番种 - 无番和', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m123888s78z77s6,p4-56'),
                's6=', param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '无番和').length, 1);
    });
    test('番种 - 推不倒', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('p123888s456z7z7,p34-5'),
                'z7=', param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '推不倒').length, 1);
    });
    test('番种 - 妙手回春', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m344556s24z66s3,s6-78'),
                null, param({haidi: 1}));
      assert.equal(hule.hupai.filter(h => h.name_zh == '妙手回春').length, 1);
    });
    test('番种 - 海底捞月', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m344556s24z66s3,s6-78'),
                null, param({haidi: 2}));
      assert.equal(hule.hupai.filter(h => h.name_zh == '海底捞月').length, 1);
    });
    test('番种 - 杠上开花', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m344556s24z66s3,s6-78'),
                null, param({lingshang: 1}));
      assert.equal(hule.hupai.filter(h => h.name_zh == '杠上开花').length, 1);
    });
    test('番种 - 抢杠和', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m344556s24z66s3,s6-78'),
                null, param({qianggang: true}));
      assert.equal(hule.hupai.filter(h => h.name_zh == '抢杠和').length, 1);
    });
    test('番种 - 碰碰和', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('p11188s44p8,s666-,s888-'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '碰碰和').length, 1);
    });
    test('番种 - 混一色', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('p23478z11333p9,p111='),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '混一色').length, 1);
    });
    test('番种 - 全求人', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('p7p7,m12-3,z333=3,s222+,m6-78'),
                'p7+', param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '全求人').length, 1);
    });
    test('番种 - 三色三步高', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m12377p234s12345s3'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '三色三步高').length, 1);
    });
    test('番种 - 五门齐', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m123p234s222z1z1,z555-'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '五门齐').length, 1);
    });
    test('番种 - 双暗杠', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m67s99z444m5,p2222,s5555'),
                'm5=', param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '双暗杠').length, 1);
    });
    test('番种 - 双箭刻', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m1567m1,z666+,z7777,s111='),
                'm1=', param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '双箭刻').length, 1);
    });
    test('番种 - 不求人', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m345567s24567z66s3'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '不求人').length, 1);
    });
    test('番种 - 全带幺', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m123s1112z333s3,s999+'),
                's3=', param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '全带幺').length, 1);
    });
    test('番种 - 双明杠(加杠，大明杠)', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m67s99z555m5,m111-1,s5555='),
                'm5=', param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '双明杠').length, 1);
    });
    test('番种 - 和绝张', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m345567s24z66s3,s5-67'),
                null, param({juezhang: 1}));
      assert.equal(hule.hupai.filter(h => h.name_zh == '和绝张').length, 1);
    });
    test('番种 - 门前清', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m345p678s2456667s3'),
                's3=', param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '门前清').length, 1);
    });
    test('番种 - 断幺', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m345p678s2456667s3'),
                's3=', param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '断幺').length, 1);
    });
    test('番种 - 平和', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m345p678s2456667s3'),
                's3=', param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '平和').length, 1);
    });
    test('番种 - 箭刻', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('p23478z11555p9,p111='),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '箭刻').length, 1);
    });
    test('番种 - 圈风刻', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('p23478z11155p9,p111='),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '圈风刻').length, 1);
    });
    test('番种 - 门风刻', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('p23478z22255p9,p111='),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '门风刻').length, 1);
    });
    test('番种 - 四归一', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('p123456s2279s8,s999-'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '四归一').length, 1);
    });
    test('番种 - 双同刻', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m222555p68s33p7,p555-'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '双同刻').length, 1);
    });
    test('番种 - 双暗刻', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m222555p68s33p7,p555-'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '双暗刻').length, 1);
    });
    test('番种 - 暗杠', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m234p68s33p7,m5555,p555-'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '暗杠').length, 1);
    });
    test('番种 - 缺一门', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('p123456s4688s5,s999-9'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '缺一门').length, 1);
    });
    test('番种 - 无字', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('p123456s4688s5,s999-9'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '无字').length, 1);
    });
    test('番种 - 一般高', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('p12344566s88p5,s999-9'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '一般高').length, 1);
    });
    test('番种 - 连六', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('p123456s4688s5,s999-9'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '连六').length, 1);
    });
    test('番种 - 老少副', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('p123789s2279s8,s111-1'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '老少副').length, 1);
    });
    test('番种 - 喜相逢', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('p123456s4688s5,s999-9'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '喜相逢').length, 1);
    });
    test('番种 - 幺九刻', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m123s12789z33s3,p999+'),
                's3=', param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '幺九刻').length, 1);
    });
    test('番种 - 明杠', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('p123456s4688s5,s999-9'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '明杠').length, 1);
    });
    test('番种 - 边张', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('p123456s1288s3,s999-9'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '明杠').length, 1);
    });
    test('番种 - 坎张', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('p123456s1388s2,s999-9'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '坎张').length, 1);
    });
    test('番种 - 单钓将', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('p123456s1238s8,s999-9'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '单钓将').length, 1);
    });
    test('番种 - 自摸', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('p123456s1388s2,s999-9'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '自摸').length, 1);
    });
    test('番种 - 明暗杠', function(){
      hule = Majiang.Util.hule(
                Majiang.Shoupai.fromString('m234p67z33p8,m5555,s555-5'),
                null, param());
      assert.equal(hule.hupai.filter(h => h.name_zh == '明暗杠').length, 1);
    });
    // test('番种 - 九蓮宝燈', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m11122345678999'),
    //             'm4=', param());
    //   assert.deepEqual(hule.hupai, [{ name: '九蓮宝燈', fanshu: '*' }]);
    // });
    // test('番种 - 純正九蓮宝燈', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m11123456789992'),
    //             'm2=', param());
    //   assert.deepEqual(hule.hupai, [{ name: '純正九蓮宝燈', fanshu: '**' }]);
    // });
    //
    // test('ドラ: ドラなし', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('p55m234s789,m4-56,z111+'),
    //             's9=', param({baopai:['s1']}));
    //   assert.deepEqual(hule.hupai, [{ name: '場風 東', fanshu: 1 }]);
    // });
    // test('ドラ: 手牌内: 1', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('p55m234s789,m4-56,z111+'),
    //             's9=', param({baopai:['m2']}));
    //   assert.deepEqual(hule.hupai, [{ name: '場風 東', fanshu: 1 },
    //                                 { name: 'ドラ',    fanshu: 1 }]);
    // });
    // test('ドラ: 手牌内: 2', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('p55m234s789,m4-56,z111+'),
    //             's9=', param({baopai:['p4']}));
    //   assert.deepEqual(hule.hupai, [{ name: '場風 東', fanshu: 1 },
    //                                 { name: 'ドラ',    fanshu: 2 }]);
    // });
    // test('ドラ: 手牌内: 1, 副露内: 1', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('p55m234s789,m4-56,z111+'),
    //             's9=', param({baopai:['m3']}));
    //   assert.deepEqual(hule.hupai, [{ name: '場風 東', fanshu: 1 },
    //                                 { name: 'ドラ',    fanshu: 2 }]);
    // });
    // test('ドラ: 槓ドラ: 1', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('p55m234s789,m4-56,z111+'),
    //             's9=', param({baopai:['s1','m2']}));
    //   assert.deepEqual(hule.hupai, [{ name: '場風 東', fanshu: 1 },
    //                                 { name: 'ドラ',    fanshu: 1 }]);
    // });
    // test('ドラ: 赤ドラ: 2', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('p50m234s789,m4-06,z111+'),
    //             's9=', param({baopai:['s1']}));
    //   assert.deepEqual(hule.hupai, [{ name: '場風 東', fanshu: 1 },
    //                                 { name: '赤ドラ',  fanshu: 2 }]);
    // });
    // test('ドラ: 赤のダブドラ', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('p55m234s789,m4-06,z111+'),
    //             's9=', param({baopai:['m4']}));
    //   assert.deepEqual(hule.hupai, [{ name: '場風 東', fanshu: 1 },
    //                                 { name: 'ドラ',    fanshu: 1 },
    //                                 { name: '赤ドラ',  fanshu: 1 }]);
    // });
    // test('ドラ: ドラ表示牌が赤牌', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('p55m234s789,m4-56,z111+'),
    //             's9=', param({baopai:['m0']}));
    //   assert.deepEqual(hule.hupai, [{ name: '場風 東', fanshu: 1 },
    //                                 { name: 'ドラ',    fanshu: 1 }]);
    // });
    // test('ドラ: 裏ドラなし', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m344556s24678z66s3*'),
    //             's3=', param({lizhi:1, baopai:['s9'], fubaopai:['s9']}));
    //   assert.deepEqual(hule.hupai, [{ name: '立直',   fanshu: 1 }]);
    // });
    // test('ドラ: 裏ドラ: 1', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m344556s24678z66s3*'),
    //             's3=', param({lizhi:1, baopai:['s9'], fubaopai:['m2']}));
    //   assert.deepEqual(hule.hupai, [{ name: '立直',   fanshu: 1 },
    //                                 { name: '裏ドラ', fanshu: 1 }]);
    // });
    // test('ドラ: ドラ: 1, 裏ドラ: 1', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m344556s24678z66s3*'),
    //             's3=', param({lizhi:1, baopai:['m2'], fubaopai:['m2']}));
    //   assert.deepEqual(hule.hupai, [{ name: '立直',   fanshu: 1 },
    //                                 { name: 'ドラ',   fanshu: 1 },
    //                                 { name: '裏ドラ', fanshu: 1 }]);
    // });
    // test('ドラ: ドラのみでの和了は不可', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m344556s24678z66s3'),
    //             's3=', param({baopai:['m2']}));
    //   assert.ifError(hule.hupai);
    // });
    // test('ドラ: 役満にドラはつかない', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m119p19s19z1234567'),
    //             null, param({baopai:['m9']}));
    //   assert.deepEqual(hule.hupai, [{ name: '国士無双', fanshu: '*' }]);
    // });
    //
    // test('点計算: 20符 2翻 子 ツモ → 400/700', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('z33m123p456s789m234'),
    //             null, param());
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '門前清自摸和', fanshu: 1 },
    //                               { name: '平和',       fanshu: 1 }],
    //                       fu: 20, fanshu: 2, damanguan: null, defen: 1500,
    //                       fenpei: [  -700,  1500,  -400,  -400]});
    // });
    // test('点計算: 20符 3翻 親 ツモ → 1300∀', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('z33m123p456s789m231'),
    //             null, param({menfeng:0}));
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '門前清自摸和', fanshu: 1 },
    //                               { name: '平和',       fanshu: 1 },
    //                               { name: '一盃口',      fanshu: 1 }],
    //                       fu: 20, fanshu: 3, damanguan: null, defen: 3900,
    //                       fenpei: [  3900, -1300, -1300, -1300]});
    // });
    // test('点計算: 20符 4翻 子 ツモ → 1300/2600', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('z33m123p234s234m234'),
    //             null, param());
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '門前清自摸和', fanshu: 1 },
    //                               { name: '平和',       fanshu: 1 },
    //                               { name: '三色同順',    fanshu: 2 }],
    //                       fu: 20, fanshu: 4, damanguan: null, defen: 5200,
    //                       fenpei: [ -2600,  5200, -1300, -1300]});
    // });
    // test('点計算: 25符 2翻 子 ロン → 1600', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m1122p3344s5566z77'),
    //             'z7-', param({lizhibang:1,changbang:1}));
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '七对子', fanshu: 2 }],
    //                       fu: 25, fanshu: 2, damanguan: null, defen: 1600,
    //                       fenpei: [ -1900,  2900,     0,     0]});
    // });
    // test('点計算: 25符 3翻 親 ツモ → 1600∀', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m1122p3344s5566z77'),
    //             null, param({menfeng:0,lizhibang:1,changbang:1}));
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '門前清自摸和', fanshu: 1 },
    //                               { name: '七对子',      fanshu: 2 }],
    //                       fu: 25, fanshu: 3, damanguan: null, defen: 4800,
    //                       fenpei: [  6100, -1700, -1700, -1700]});
    // });
    // test('点計算: 25符 4翻 子 ツモ → 1600/3200', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m2277p3344s556688'),
    //             null, param({lizhibang:1,changbang:1}));
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '門前清自摸和', fanshu: 1 },
    //                               { name: '断幺九',      fanshu: 1 },
    //                               { name: '七对子',      fanshu: 2 }],
    //                       fu: 25, fanshu: 4, damanguan: null, defen: 6400,
    //                       fenpei: [ -3300,  7700, -1700, -1700]});
    // });
    // test('点計算: 30符 1翻 親 ロン → 1500', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m77234p456s678,m34-5'),
    //             's8=', param({menfeng:0}));
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '断幺九', fanshu: 1 }],
    //                       fu: 30, fanshu: 1, damanguan: null, defen: 1500,
    //                       fenpei: [  1500,     0, -1500,     0]});
    // });
    // test('点計算: 30符 2翻 子 ロン → 2000', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m77234p345s345,m34-5'),
    //             's5-', param());
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '断幺九',    fanshu: 1 },
    //                               { name: '三色同順',  fanshu: 1 }],
    //                       fu: 30, fanshu: 2, damanguan: null, defen: 2000,
    //                       fenpei: [ -2000,  2000,     0,     0]});
    // });
    // test('点計算: 30符 3翻 親 ツモ → 2000∀', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m22z111p445566s789'),
    //             null, param({zhuangfeng:1,menfeng:0}));
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '門前清自摸和', fanshu: 1 },
    //                               { name: '自風 東',     fanshu: 1 },
    //                               { name: '一盃口',      fanshu: 1 }],
    //                       fu: 30, fanshu: 3, damanguan: null, defen: 6000,
    //                       fenpei: [  6000, -2000, -2000, -2000]});
    // });
    // test('点計算: 30符 4翻 子 ツモ → 2000/3900', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m11z111p123789s789'),
    //             null, param());
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '門前清自摸和', fanshu: 1 },
    //                               { name: '場風 東',     fanshu: 1 },
    //                               { name: '混全帯幺九',   fanshu: 2 }],
    //                       fu: 30, fanshu: 4, damanguan: null, defen: 7900,
    //                       fenpei: [ -3900,  7900, -2000, -2000]});
    // });
    // test('点計算: 40符 1翻 親 ロン → 2000', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m11234234p456s897'),
    //             's7=', param({menfeng:0}));
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '一盃口', fanshu: 1 }],
    //                       fu: 40, fanshu: 1, damanguan: null, defen: 2000,
    //                       fenpei: [  2000,     0, -2000,     0]});
    // });
    // test('点計算: 40符 2翻 子 ロン → 2600', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m22334455p456s687'),
    //             's7-', param());
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '断幺九',    fanshu: 1 },
    //                               { name: '一盃口',    fanshu: 1 }],
    //                       fu: 40, fanshu: 2, damanguan: null, defen: 2600,
    //                       fenpei: [ -2600,  2600,     0,     0]});
    // });
    // test('点計算: 40符 3翻 親 ツモ → 2600∀', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('z33222m222,s222=,p999+'),
    //             null, param({zhuangfeng:1,menfeng:0}));
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '場風 南',     fanshu: 1 },
    //                               { name: '対々和',      fanshu: 2 }],
    //                       fu: 40, fanshu: 3, damanguan: null, defen: 7800,
    //                       fenpei: [  7800, -2600, -2600, -2600]});
    // });
    // test('点計算: 40符 4翻 子 ツモ → 2000/4000', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('z33222m222,s222=,p999+'),
    //             null, param({zhuangfeng:1}));
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '場風 南',     fanshu: 1 },
    //                               { name: '自風 南',     fanshu: 1 },
    //                               { name: '対々和',      fanshu: 2 }],
    //                       fu: 40, fanshu: 4, damanguan: null, defen: 8000,
    //                       fenpei: [ -4000,  8000, -2000, -2000]});
    // });
    // test('点計算: 50符 1翻 親 ロン → 2400', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m123p456s789z22277'),
    //             'z7=', param({zhuangfeng:1,menfeng:0}));
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '場風 南',     fanshu: 1 }],
    //                       fu: 50, fanshu: 1, damanguan: null, defen: 2400,
    //                       fenpei: [  2400,     0, -2400,     0]});
    // });
    // test('点計算: 50符 2翻 子 ロン → 3200', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m123p456s789z22277'),
    //             'z7-', param({zhuangfeng:1}));
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '場風 南',     fanshu: 1 },
    //                               { name: '自風 南',     fanshu: 1 }],
    //                       fu: 50, fanshu: 2, damanguan: null, defen: 3200,
    //                       fenpei: [ -3200,  3200,     0,     0]});
    // });
    // test('点計算: 50符 3翻 親 ツモ → 3200∀', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('z33m222z222,p8888,s789-'),
    //             null, param({zhuangfeng:1,menfeng:0}));
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '場風 南',     fanshu: 1 },
    //                               { name: '三暗刻',      fanshu: 2 }],
    //                       fu: 50, fanshu: 3, damanguan: null, defen: 9600,
    //                       fenpei: [  9600, -3200, -3200, -3200]});
    // });
    // test('点計算: 50符 4翻 子 ツモ → 2000/4000', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('z33m222z222,p8888,s789-'),
    //             null, param({zhuangfeng:1}));
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '場風 南',     fanshu: 1 },
    //                               { name: '自風 南',     fanshu: 1 },
    //                               { name: '三暗刻',      fanshu: 2 }],
    //                       fu: 50, fanshu: 4, damanguan: null, defen: 8000,
    //                       fenpei: [ -4000,  8000, -2000, -2000]});
    // });
    // test('点計算: 60符 1翻 親 ロン → 2900', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('s789z22277,m2222,p111='),
    //             'z7=', param({zhuangfeng:1,menfeng:0}));
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '場風 南',     fanshu: 1 }],
    //                       fu: 60, fanshu: 1, damanguan: null, defen: 2900,
    //                       fenpei: [  2900,     0, -2900,     0]});
    // });
    // test('点計算: 60符 2翻 子 ロン → 3900', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('s789z22277,m2222,p111='),
    //             'z7-', param({zhuangfeng:1}));
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '場風 南',     fanshu: 1 },
    //                               { name: '自風 南',     fanshu: 1 }],
    //                       fu: 60, fanshu: 2, damanguan: null, defen: 3900,
    //                       fenpei: [ -3900,  3900,     0,     0]});
    // });
    // test('点計算: 60符 3翻 親 ツモ → 3900∀', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m11222789,z2222,m444='),
    //             null, param({zhuangfeng:1,menfeng:0}));
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '場風 南',     fanshu: 1 },
    //                               { name: '混一色',      fanshu: 2 }],
    //                       fu: 60, fanshu: 3, damanguan: null, defen: 11700,
    //                       fenpei: [ 11700, -3900, -3900, -3900]});
    // });
    // test('点計算: 60符 4翻 子 ツモ → 2000/4000', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m11222789,z2222,m444='),
    //             null, param({zhuangfeng:1}));
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '場風 南',     fanshu: 1 },
    //                               { name: '自風 南',     fanshu: 1 },
    //                               { name: '混一色',      fanshu: 2 }],
    //                       fu: 60, fanshu: 4, damanguan: null, defen: 8000,
    //                       fenpei: [ -4000,  8000, -2000, -2000]});
    // });
    // test('点計算: 70符 1翻 親 ロン → 3400', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m12377p456s78s9,z2222'),
    //             's9=', param({zhuangfeng:1,menfeng:0}));
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '場風 南',     fanshu: 1 }],
    //                       fu: 70, fanshu: 1, damanguan: null, defen: 3400,
    //                       fenpei: [  3400,     0, -3400,     0]});
    // });
    // test('点計算: 70符 2翻 子 ロン → 4500', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m12377p456s78s9,z2222'),
    //             's9-', param({zhuangfeng:1}));
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '場風 南',     fanshu: 1 },
    //                               { name: '自風 南',     fanshu: 1 }],
    //                       fu: 70, fanshu: 2, damanguan: null, defen: 4500,
    //                       fenpei: [ -4500,  4500,     0,     0]});
    // });
    // test('点計算: 70符 3翻 親 ツモ → 4000∀', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('p77s223344,z2222,m2222'),
    //             null, param({zhuangfeng:1,menfeng:0}));
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '門前清自摸和', fanshu: 1 },
    //                               { name: '場風 南',     fanshu: 1 },
    //                               { name: '一盃口',      fanshu: 1 }],
    //                       fu: 70, fanshu: 3, damanguan: null, defen: 12000,
    //                       fenpei: [ 12000, -4000, -4000, -4000]});
    // });
    // test('点計算: 80符 1翻 親 ロン → 3900', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m22s888p345,z222+2,z4444'),
    //             'p5=', param({zhuangfeng:1,menfeng:0}));
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '場風 南',     fanshu: 1 }],
    //                       fu: 80, fanshu: 1, damanguan: null, defen: 3900,
    //                       fenpei: [  3900,     0, -3900,     0]});
    // });
    // test('点計算: 80符 2翻 子 ロン → 5200', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m22s888p345,z222+2,z4444'),
    //             'p5-', param({zhuangfeng:1}));
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '場風 南',     fanshu: 1 },
    //                               { name: '自風 南',     fanshu: 1 }],
    //                       fu: 80, fanshu: 2, damanguan: null, defen: 5200,
    //                       fenpei: [ -5200,  5200,     0,     0]});
    // });
    // test('点計算: 80符 3翻 親 ツモ → 4000∀', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m11p999s123,z222+2,z1111'),
    //             null, param({zhuangfeng:1,menfeng:0}));
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '場風 南',     fanshu: 1 },
    //                               { name: '自風 東',     fanshu: 1 },
    //                               { name: '混全帯幺九',   fanshu: 1 }],
    //                       fu: 80, fanshu: 3, damanguan: null, defen: 12000,
    //                       fenpei: [ 12000, -4000, -4000, -4000]});
    // });
    // test('点計算: 90符 1翻 親 ロン → 4400', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('p88m123s999,s6666,z2222'),
    //             's9=', param({zhuangfeng:1,menfeng:0}));
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '場風 南',     fanshu: 1 }],
    //                       fu: 90, fanshu: 1, damanguan: null, defen: 4400,
    //                       fenpei: [  4400,     0, -4400,     0]});
    // });
    // test('点計算: 90符 2翻 子 ロン → 5800', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('p88m123s999,s6666,z2222'),
    //             's9-', param({zhuangfeng:1}));
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '場風 南',     fanshu: 1 },
    //                               { name: '自風 南',     fanshu: 1 }],
    //                       fu: 90, fanshu: 2, damanguan: null, defen: 5800,
    //                       fenpei: [ -5800,  5800,     0,     0]});
    // });
    // test('点計算: 90符 3翻 親 ツモ → 4000∀', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m22s345,z5555,z2222,z666-'),
    //             null, param({zhuangfeng:1,menfeng:0}));
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '場風 南',     fanshu: 1 },
    //                               { name: '翻牌 白',     fanshu: 1 },
    //                               { name: '翻牌 發',     fanshu: 1 }],
    //                       fu: 90, fanshu: 3, damanguan: null, defen: 12000,
    //                       fenpei: [ 12000, -4000, -4000, -4000]});
    // });
    // test('点計算: 100符 1翻 親 ロン → 4800', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m22p345s678,z2222,s9999'),
    //             's8=', param({zhuangfeng:1,menfeng:0}));
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '場風 南',     fanshu: 1 }],
    //                       fu: 100, fanshu: 1, damanguan: null, defen: 4800,
    //                       fenpei: [  4800,     0, -4800,     0]});
    // });
    // test('点計算: 100符 2翻 子 ロン → 6400', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m22p345s678,z2222,s9999'),
    //             's8-', param({zhuangfeng:1}));
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '場風 南',     fanshu: 1 },
    //                               { name: '自風 南',     fanshu: 1 }],
    //                       fu: 100, fanshu: 2, damanguan: null, defen: 6400,
    //                       fenpei: [ -6400,  6400,     0,     0]});
    // });
    // test('点計算: 100符 3翻 親 ツモ → 4000∀', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('z11m999p243,s1111,s9999'),
    //             null, param({zhuangfeng:1,menfeng:0}));
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '門前清自摸和', fanshu: 1 },
    //                               { name: '三暗刻',      fanshu: 2 }],
    //                       fu: 100, fanshu: 3, damanguan: null, defen: 12000,
    //                       fenpei: [ 12000, -4000, -4000, -4000]});
    // });
    // test('点計算: 110符 1翻 親 ロン → 5300', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m234z11777,p1111,s9999'),
    //             'z7=', param({menfeng:0}));
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '翻牌 中',     fanshu: 1 }],
    //                       fu: 110, fanshu: 1, damanguan: null, defen: 5300,
    //                       fenpei: [  5300,     0, -5300,     0]});
    // });
    // test('点計算: 110符 2翻 子 ロン → 7100', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m234z22777,p1111,z5555'),
    //             'z7-', param({zhuangfeng:1}));
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '翻牌 白',     fanshu: 1 },
    //                               { name: '翻牌 中',     fanshu: 1 }],
    //                       fu: 110, fanshu: 2, damanguan: null, defen: 7100,
    //                       fenpei: [ -7100,  7100,     0,     0]});
    // });
    // test('点計算: 110符 3翻 親 ツモ → 4000∀', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m243z11,p1111,s9999,z555+5'),
    //             null, param({zhuangfeng:1,menfeng:0}));
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '翻牌 白',     fanshu: 1 },
    //                               { name: '三槓子',      fanshu: 2 }],
    //                       fu: 110, fanshu: 3, damanguan: null, defen: 12000,
    //                       fenpei: [ 12000, -4000, -4000, -4000]});
    // });
    // test('点計算: 5翻 親 ロン → 12000', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m22456p456s445566'),
    //             's6=', param({menfeng:0}));
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '平和',        fanshu: 1 },
    //                               { name: '断幺九',      fanshu: 1 },
    //                               { name: '一盃口',      fanshu: 1 },
    //                               { name: '三色同順',    fanshu: 2 }],
    //                       fu: 30, fanshu: 5, damanguan: null, defen: 12000,
    //                       fenpei: [ 12000,     0,-12000,     0]});
    // });
    // test('点計算: 6翻 子 ツモ → 3000/6000', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m22456p456s445566'),
    //             null, param());
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '門前清自摸和', fanshu: 1 },
    //                               { name: '平和',        fanshu: 1 },
    //                               { name: '断幺九',      fanshu: 1 },
    //                               { name: '一盃口',      fanshu: 1 },
    //                               { name: '三色同順',    fanshu: 2 }],
    //                       fu: 20, fanshu: 6, damanguan: null, defen: 12000,
    //                       fenpei: [ -6000, 12000, -3000, -3000]});
    // });
    // test('点計算: 7翻 親 ロン → 18000', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m111z333444,z222=,m999-'),
    //             'z4=', param({zhuangfeng:1,menfeng:0}));
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '場風 南',     fanshu: 1 },
    //                               { name: '対々和',      fanshu: 2 },
    //                               { name: '混老頭',      fanshu: 2 },
    //                               { name: '混一色',      fanshu: 2 }],
    //                       fu: 50, fanshu: 7, damanguan: null, defen: 18000,
    //                       fenpei: [ 18000,     0,-18000,     0]});
    // });
    // test('点計算: 8翻 子 ツモ → 4000/8000', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m111z333444,z222=,m999-'),
    //             null, param({zhuangfeng:1}));
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '場風 南',     fanshu: 1 },
    //                               { name: '自風 南',     fanshu: 1 },
    //                               { name: '対々和',      fanshu: 2 },
    //                               { name: '混老頭',      fanshu: 2 },
    //                               { name: '混一色',      fanshu: 2 }],
    //                       fu: 50, fanshu: 8, damanguan: null, defen: 16000,
    //                       fenpei: [ -8000, 16000, -4000, -4000]});
    // });
    // test('点計算: 9翻 親 ロン → 24000', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('s22233344555678'),
    //             's8=', param({menfeng:0}));
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '断幺九',      fanshu: 1 },
    //                               { name: '三暗刻',      fanshu: 2 },
    //                               { name: '清一色',      fanshu: 6 }],
    //                       fu: 50, fanshu: 9, damanguan: null, defen: 24000,
    //                       fenpei: [ 24000,     0,-24000,     0]});
    // });
    // test('点計算: 10翻 子 ツモ → 4000/8000', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('s22233344555678'),
    //             null, param());
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '門前清自摸和', fanshu: 1 },
    //                               { name: '断幺九',      fanshu: 1 },
    //                               { name: '三暗刻',      fanshu: 2 },
    //                               { name: '清一色',      fanshu: 6 }],
    //                       fu: 40, fanshu: 10, damanguan: null, defen: 16000,
    //                       fenpei: [ -8000, 16000, -4000, -4000]});
    // });
    // test('点計算: 11翻 親 ロン → 36000', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('p22334455667788'),
    //             'p8=', param({menfeng:0}));
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '平和',        fanshu: 1 },
    //                               { name: '断幺九',      fanshu: 1 },
    //                               { name: '二盃口',      fanshu: 3 },
    //                               { name: '清一色',      fanshu: 6 }],
    //                       fu: 30, fanshu: 11, damanguan: null, defen: 36000,
    //                       fenpei: [ 36000,     0,-36000,     0]});
    // });
    // test('点計算: 12翻 子 ツモ → 6000/12000', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('p22334455667788'),
    //             null, param());
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '門前清自摸和', fanshu: 1 },
    //                               { name: '平和',        fanshu: 1 },
    //                               { name: '断幺九',      fanshu: 1 },
    //                               { name: '二盃口',      fanshu: 3 },
    //                               { name: '清一色',      fanshu: 6 }],
    //                       fu: 20, fanshu: 12, damanguan: null, defen: 24000,
    //                       fenpei: [-12000, 24000, -6000, -6000]});
    // });
    // test('点計算: 13翻 親 ロン → 48000', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m11777788889999'),
    //             'm9=', param({menfeng:0}));
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '平和',        fanshu: 1 },
    //                               { name: '純全帯幺九',   fanshu: 3 },
    //                               { name: '二盃口',      fanshu: 3 },
    //                               { name: '清一色',      fanshu: 6 }],
    //                       fu: 30, fanshu: 13, damanguan: null, defen: 48000,
    //                       fenpei: [ 48000,     0,-48000,     0]});
    // });
    // test('点計算: 役満複合 子 ツモ → 24000/48000', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('z77111z444,z222+,z333-'),
    //             null, param());
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '大四喜',      fanshu: '**' },
    //                               { name: '字一色',      fanshu: '*'  }],
    //                       fu: null, fanshu: null, damanguan: 3, defen: 96000,
    //                       fenpei: [-48000, 96000,-24000,-24000]});
    // });
    // test('点計算: 役満パオ 放銃者なし、責任払い', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m11p456,z555+,z666=,z777-'),
    //             null, param({menfeng:0,lizhibang:1,changbang:1}));
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '大三元', fanshu: '*', baojia: '-' }],
    //                       fu: null, fanshu: null, damanguan: 1, defen: 48000,
    //                       fenpei: [ 49300,     0,     0,-48300]});
    // });
    // test('点計算: 役満パオ 放銃者あり、放銃者と折半', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m11p456,z555+,z666=,z777-'),
    //             'p6=', param({menfeng:0,lizhibang:1,changbang:1}));
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '大三元', fanshu: '*', baojia: '-' }],
    //                       fu: null, fanshu: null, damanguan: 1, defen: 48000,
    //                       fenpei: [ 49300,     0,-24300,-24000]});
    // });
    // test('点計算: 役満パオ パオが放銃、全額責任払い', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m11p456,z555+,z666=,z777-'),
    //             'p6-', param({menfeng:0,lizhibang:1,changbang:1}));
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '大三元', fanshu: '*', baojia: '-' }],
    //                       fu: null, fanshu: null, damanguan: 1, defen: 48000,
    //                       fenpei: [ 49300,     0,     0,-48300]});
    // });
    // test('点計算: ダブル役満パオ 放銃者なし、関連役満のみ責任払い', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('z77,z111-,z2222,z333=3,z444+'),
    //             null, param({lizhibang:1,changbang:1}));
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '大四喜', fanshu: '**', baojia: '+' },
    //                               { name: '字一色', fanshu: '*' }],
    //                       fu: null, fanshu: null, damanguan: 3, defen: 96000,
    //                       fenpei: [-16100, 97300,-72100, -8100]});
    // });
    // test('点計算: ダブル役満パオ 放銃者あり、関連役満のみ放銃者と折半', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('z77,z111-,z2222,z333=3,z444+'),
    //             'z7-', param({lizhibang:1,changbang:1}));
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '大四喜', fanshu: '**', baojia: '+' },
    //                               { name: '字一色', fanshu: '*' }],
    //                       fu: null, fanshu: null, damanguan: 3, defen: 96000,
    //                       fenpei: [-64300, 97300,-32000,     0]});
    // });
    // test('点計算: ダブル役満パオ パオが放銃、全額責任払い', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('z77,z111-,z2222,z333=3,z444+'),
    //             'z7+', param({lizhibang:1,changbang:1}));
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '大四喜', fanshu: '**', baojia: '+' },
    //                               { name: '字一色', fanshu: '*' }],
    //                       fu: null, fanshu: null, damanguan: 3, defen: 96000,
    //                       fenpei: [     0, 97300,-96300,     0]});
    // });
    // test('高点法: 七对子と二盃口の選択', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m223344p556677s88'),
    //             's8=', param());
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '断幺九',      fanshu: 1 },
    //                               { name: '二盃口',      fanshu: 3 }],
    //                       fu: 40, fanshu: 4, damanguan: null, defen: 8000,
    //                       fenpei: [     0,  8000,    0, -8000]});
    // });
    // test('高点法: 雀頭候補2つの選択', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m2234455p234s234m3'),
    //             'm3=', param());
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '断幺九',      fanshu: 1 },
    //                               { name: '一盃口',      fanshu: 1 },
    //                               { name: '三色同順',    fanshu: 2 }],
    //                       fu: 40, fanshu: 4, damanguan: null, defen: 8000,
    //                       fenpei: [     0,  8000,    0, -8000]});
    // });
    // test('高点法: 順子と刻子の選択', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m111222333p89997'),
    //             'p7=', param());
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '一盃口',      fanshu: 1 },
    //                               { name: '純全帯幺九',   fanshu: 3 }],
    //                       fu: 40, fanshu: 4, damanguan: null, defen: 8000,
    //                       fenpei: [     0,  8000,    0, -8000]});
    // });
    // test('高点法: 嵌張待ち両面待ちの選択', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m12334p567z11z777m2'),
    //             'm2=', param());
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '翻牌 中',     fanshu: 1 }],
    //                       fu: 50, fanshu: 1, damanguan: null, defen: 1600,
    //                       fenpei: [     0,  1600,    0, -1600]});
    // });
    // test('高点法: 得点が同じ場合は翻数が多い方を選択', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m111222333p78999'),
    //             'p9=', param());
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '平和',        fanshu: 1 },
    //                               { name: '一盃口',      fanshu: 1 },
    //                               { name: '純全帯幺九',   fanshu: 3 }],
    //                       fu: 30, fanshu: 5, damanguan: null, defen: 8000,
    //                       fenpei: [     0,  8000,    0, -8000]});
    // });
    // test('高点法: 得点・翻数が同じ場合は符が多い方を選択', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('s11122233355789'),
    //             's9=', param());
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '三暗刻',      fanshu: 2 },
    //                               { name: '清一色',      fanshu: 6 }],
    //                       fu: 50, fanshu: 8, damanguan: null, defen: 16000,
    //                       fenpei: [     0, 16000,    0,-16000]});
    // });
    // test('高点法: 役満と数え役満では役満を選択', function(){
    //   hule = Majiang.Util.hule(
    //             Majiang.Shoupai.fromString('m11123457899996'),
    //             null, param({lizhi:1,yifa:true,baopai:['m2'],fubaopai:['m5']}));
    //   assert.deepEqual(hule,
    //                     { hupai: [{ name: '九蓮宝燈',    fanshu: '*' }],
    //                       fu: null, fanshu: null, damanguan: 1, defen: 32000,
    //                       fenpei: [-16000, 32000, -8000, -8000]});
    // });
    //
    // test('和了点計算: 10000パターン', function(){
    //   for (let t of data) {
    //     hule = Majiang.Util.hule(Majiang.Shoupai.fromString(t.in.shoupai),
    //                              t.in.rongpai, t.in.param);
    //     assert.deepEqual(hule, t.out, t.in.shoupai);
    //   }
    // });
  });



});
