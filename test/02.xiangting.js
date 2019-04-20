const assert = require('assert');

const Majiang = require('../src/js/majiang');

const data1 = require('./data/xiangting_1.json');
const data2 = require('./data/xiangting_2.json');
const data3 = require('./data/xiangting_3.json');
const data4 = require('./data/xiangting_4.json');

suite('Majiang.Util', function(){

  suite('xiangting_yiban(shoupai)', function(){

    test('空の手牌は13向聴', function(){
      assert.equal(Majiang.Util.xiangting_yiban(
                Majiang.Shoupai.fromString()), 13);
    });
    test('聴牌形', function(){
      assert.equal(Majiang.Util.xiangting_yiban(
                Majiang.Shoupai.fromString('m123p406s789z1122')), 0);
    });
    test('和了形', function(){
      assert.equal(Majiang.Util.xiangting_yiban(
                Majiang.Shoupai.fromString('m123p456s789z11222')), -1);
    });
    test('副露あり', function(){
      assert.equal(Majiang.Util.xiangting_yiban(
                Majiang.Shoupai.fromString('m123p456s789z2,z111=')), 0);
    });
    test('雀頭なし', function(){
      assert.equal(Majiang.Util.xiangting_yiban(
                Majiang.Shoupai.fromString('m12389p456s12789z1')), 1);
    });
    test('搭子過多', function(){
      assert.equal(Majiang.Util.xiangting_yiban(
                Majiang.Shoupai.fromString('m12389p456s1289z11')), 1);
    });
    test('搭子不足', function(){
      assert.equal(Majiang.Util.xiangting_yiban(
                Majiang.Shoupai.fromString('m133345568z23677')), 2);
    });
    test('多牌: 5面子', function(){
      let shoupai = Majiang.Shoupai.fromString('m123,p123-,s456-,m789-');
      shoupai._fulou.push('z555=');
      assert.equal(Majiang.Util.xiangting_yiban(shoupai), 0);
    });
    test('少牌: 雀頭なし4面子', function(){
      assert.equal(Majiang.Util.xiangting_yiban(
                Majiang.Shoupai.fromString('p234s567,m222=,p0-67')), 1);
    });
    test('刻子＋順子', function(){
      assert.equal(Majiang.Util.xiangting_yiban(
                Majiang.Shoupai.fromString('p222345z1234567')), 4);
    });
    test('順子＋孤立牌＋順子', function(){
      assert.equal(Majiang.Util.xiangting_yiban(
                Majiang.Shoupai.fromString('p2344456z123456')), 4);
    });
    test('対子＋刻子＋順子', function(){
      assert.equal(Majiang.Util.xiangting_yiban(
                Majiang.Shoupai.fromString('p11222345z12345')), 3);
    });
    test('対子＋順子＋順子＋対子', function(){
      assert.equal(Majiang.Util.xiangting_yiban(
                Majiang.Shoupai.fromString('p2234556788z123')), 2);
    });
    test('副露直後の牌姿が和了形', function(){
      assert.equal(Majiang.Util.xiangting_yiban(
                Majiang.Shoupai.fromString('m11122,p123-,s12-3,z111=,')), 0);
    });

    test('一般手: 10000パターン', function(){
      for (let data of data1) {
        const shoupai = new Majiang.Shoupai(data.q);
        assert.equal(Majiang.Util.xiangting_yiban(shoupai), data.x[0], shoupai);
      }
    });
    test('混一手: 10000パターン', function(){
      for (let data of data2) {
        const shoupai = new Majiang.Shoupai(data.q);
        assert.equal(Majiang.Util.xiangting_yiban(shoupai), data.x[0], shoupai);
      }
    });
    test('清一手: 10000パターン', function(){
      for (let data of data3) {
        const shoupai = new Majiang.Shoupai(data.q);
        assert.equal(Majiang.Util.xiangting_yiban(shoupai), data.x[0], shoupai);
      }
    });
    test('国士手: 10000パターン', function(){
      for (let data of data4) {
        const shoupai = new Majiang.Shoupai(data.q);
        assert.equal(Majiang.Util.xiangting_yiban(shoupai), data.x[0], shoupai);
      }
    });
  });

  suite('xiangting_guoshi(shoupai)', function(){

    test('空の手牌は13向聴', function(){
      assert.equal(Majiang.Util.xiangting_guoshi(
                Majiang.Shoupai.fromString()), 13);
    });
    test('幺九牌なし', function(){
      assert.equal(Majiang.Util.xiangting_guoshi(
                Majiang.Shoupai.fromString('m23455p345s45678')), 13);
    });
    test('雀頭なし', function(){
      assert.equal(Majiang.Util.xiangting_guoshi(
                Majiang.Shoupai.fromString('m189p12s249z12345')), 4);
    });
    test('雀頭あり', function(){
      assert.equal(Majiang.Util.xiangting_guoshi(
                Majiang.Shoupai.fromString('m119p12s299z12345')), 3);
    });
    test('聴牌形', function(){
      assert.equal(Majiang.Util.xiangting_guoshi(
                Majiang.Shoupai.fromString('m11p19s19z1234567')), 0);
    });
    test('聴牌形(13面張)', function(){
      assert.equal(Majiang.Util.xiangting_guoshi(
                Majiang.Shoupai.fromString('m19p19s19z1234567')), 0);
    });
    test('和了形', function(){
      assert.equal(Majiang.Util.xiangting_guoshi(
                Majiang.Shoupai.fromString('m119p19s19z1234567')), -1);
    });
    test('副露あり', function(){
      assert.equal(Majiang.Util.xiangting_guoshi(
                Majiang.Shoupai.fromString('m19p19s19z1234,z777=')), Infinity);
    });
    test('多牌', function(){
      assert.equal(Majiang.Util.xiangting_guoshi(
                new Majiang.Shoupai(
                    ['m1','m1','m9','m9','p1','p9','s1','s9',
                     'z1','z2','z3','z4','z5','z6','z7'])), -1);
    });
    test('少牌', function(){
      assert.equal(Majiang.Util.xiangting_guoshi(
                Majiang.Shoupai.fromString('m119p19s19z12345')), 1);
    });

    test('一般手: 10000パターン', function(){
      for (let data of data1) {
        const shoupai = new Majiang.Shoupai(data.q);
        assert.equal(Majiang.Util.xiangting_guoshi(shoupai), data.x[1],
                                                   shoupai);
      }
    });
    test('混一手: 10000パターン', function(){
      for (let data of data2) {
        const shoupai = new Majiang.Shoupai(data.q);
        assert.equal(Majiang.Util.xiangting_guoshi(shoupai), data.x[1],
                                                   shoupai);
      }
    });
    test('清一手: 10000パターン', function(){
      for (let data of data3) {
        const shoupai = new Majiang.Shoupai(data.q);
        assert.equal(Majiang.Util.xiangting_guoshi(shoupai), data.x[1],
                                                   shoupai);
      }
    });
    test('国士手: 10000パターン', function(){
      for (let data of data4) {
        const shoupai = new Majiang.Shoupai(data.q);
        assert.equal(Majiang.Util.xiangting_guoshi(shoupai), data.x[1],
                                                   shoupai);
      }
    });
  });

  suite('xiangting_qidui(shoupai)', function(){

    test('空の手牌は13向聴', function(){
      assert.equal(Majiang.Util.xiangting_qidui(
                Majiang.Shoupai.fromString()), 13);
    });
    test('対子なし', function(){
      assert.equal(Majiang.Util.xiangting_qidui(
                Majiang.Shoupai.fromString('m19p19s19z1234567')), 6);
    });
    test('槓子あり', function(){
      assert.equal(Majiang.Util.xiangting_qidui(
                Majiang.Shoupai.fromString('m1188p288s05z1111')), 2);
    });
    test('暗刻あり', function(){
      assert.equal(Majiang.Util.xiangting_qidui(
                Majiang.Shoupai.fromString('m1188p2388s05z111')), 1);
    });
    test('暗刻2つ', function(){
      assert.equal(Majiang.Util.xiangting_qidui(
                Majiang.Shoupai.fromString('m1188p288s055z111')), 2);
    });
    test('聴牌形', function(){
      assert.equal(Majiang.Util.xiangting_qidui(
                Majiang.Shoupai.fromString('m1188p288s05z1177')), 0);
    });
    test('和了形', function(){
      assert.equal(Majiang.Util.xiangting_qidui(
                Majiang.Shoupai.fromString('m1188p288s05z1177p2')), -1);
    });
    test('副露あり', function(){
      assert.equal(Majiang.Util.xiangting_qidui(
                Majiang.Shoupai.fromString('m1188p288s05z2,z111=')), Infinity);
    });
    test('多牌: 8対子', function(){
      assert.equal(Majiang.Util.xiangting_qidui(
                new Majiang.Shoupai(
                    ['m1','m1','m8','m8','p2','p2','p8','p8',
                     's0','s5','z1','z1','z2','z2','z7','z7'])), -1);
    });
    test('少牌', function(){
      assert.equal(Majiang.Util.xiangting_qidui(
                Majiang.Shoupai.fromString('m1188s05z1122')), 3);
    });

    test('一般手: 10000パターン', function(){
      for (let data of data1) {
        const shoupai = new Majiang.Shoupai(data.q);
        assert.equal(Majiang.Util.xiangting_qidui(shoupai), data.x[2], shoupai);
      }
    });
    test('混一手: 10000パターン', function(){
      for (let data of data2) {
        const shoupai = new Majiang.Shoupai(data.q);
        assert.equal(Majiang.Util.xiangting_qidui(shoupai), data.x[2], shoupai);
      }
    });
    test('清一手: 10000パターン', function(){
      for (let data of data3) {
        const shoupai = new Majiang.Shoupai(data.q);
        assert.equal(Majiang.Util.xiangting_qidui(shoupai), data.x[2], shoupai);
      }
    });
    test('国士手: 10000パターン', function(){
      for (let data of data4) {
        const shoupai = new Majiang.Shoupai(data.q);
        assert.equal(Majiang.Util.xiangting_qidui(shoupai), data.x[2], shoupai);
      }
    });
  });

  suite('xiangting(shoupai)', function(){

    test('一般形聴牌', function(){
      assert.equal(Majiang.Util.xiangting(
                Majiang.Shoupai.fromString('m123p406s789z1122')), 0);
    });
    test('国士無双形聴牌', function(){
      assert.equal(Majiang.Util.xiangting(
                Majiang.Shoupai.fromString('m19p19s19z1234567')), 0);
    });
    test('七対子形聴牌', function(){
      assert.equal(Majiang.Util.xiangting(
                Majiang.Shoupai.fromString('m1188p288s05z1177')), 0);
    });

    test('一般手: 10000パターン', function(){
      for (let data of data1) {
        const shoupai = new Majiang.Shoupai(data.q);
        assert.equal(Majiang.Util.xiangting(shoupai), Math.min(...data.x),
                                            shoupai);
      }
    });
    test('混一手: 10000パターン', function(){
      for (let data of data2) {
        const shoupai = new Majiang.Shoupai(data.q);
        assert.equal(Majiang.Util.xiangting(shoupai), Math.min(...data.x),
                                            shoupai);
      }
    });
    test('清一手: 10000パターン', function(){
      for (let data of data3) {
        const shoupai = new Majiang.Shoupai(data.q);
        assert.equal(Majiang.Util.xiangting(shoupai), Math.min(...data.x),
                                            shoupai);
      }
    });
    test('国士手: 10000パターン', function(){
      for (let data of data4) {
        const shoupai = new Majiang.Shoupai(data.q);
        assert.equal(Majiang.Util.xiangting(shoupai), Math.min(...data.x),
                                            shoupai);
      }
    });
  });

  suite('tingpai(shoupai, f_xiangting)', function(){

    test('打牌可能な状態のとき、エラーとなること', function(){
      assert.throws(()=>Majiang.Util.tingpai(
                          Majiang.Shoupai.fromString('m123p456s789z12345')));
      assert.throws(()=>Majiang.Util.tingpai(
                          Majiang.Shoupai.fromString('m123p456z12345,s789-,')));
    });
    test('副露なし', function(){
      assert.deepEqual(Majiang.Util.tingpai(
                          Majiang.Shoupai.fromString('m123p456s789z1234')
                      ), ['z1','z2','z3','z4']);
    });
    test('副露あり', function(){
      assert.deepEqual(Majiang.Util.tingpai(
                          Majiang.Shoupai.fromString('m123p456z1234,s789-')
                      ), ['z1','z2','z3','z4']);
    });
    test('国士無双13面待ち', function(){
      assert.deepEqual(Majiang.Util.tingpai(
                          Majiang.Shoupai.fromString('m19p19s19z1234567')
                      ), ['m1','m9','p1','p9','s1','s9',
                          'z1','z2','z3','z4','z5','z6','z7']);
    });
    test('打牌可能な手牌に4枚ある牌は待ち牌としないこと', function(){
      assert.deepEqual(Majiang.Util.tingpai(
                          Majiang.Shoupai.fromString('m1234444p456s789')
                      ), ['m1']);
    });
    test('暗刻の牌は待ち牌とできること', function(){
      assert.deepEqual(Majiang.Util.tingpai(
                          Majiang.Shoupai.fromString('m13p456s789z11,m2222')
                      ), ['m2']);
    });
    test('七対子と面子手で同じ向聴数', function(){
      assert.deepEqual(Majiang.Util.tingpai(
                          Majiang.Shoupai.fromString('m11155p2278s66z17')
                      ),['m5','p2','p6','p7','p8','p9','s6','z1','z7']);
    });
    test('向聴数算出ルーチンを指定できること', function(){
      assert.deepEqual(Majiang.Util.tingpai(
                          Majiang.Shoupai.fromString('m11155p2278s66z17'),
                          Majiang.Util.xiangting_qidui
                      ),['p7','p8','z1','z7']);
    });
  });
});
