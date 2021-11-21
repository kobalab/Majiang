<h1><a href="https://kobalab.net/majiang/"><img src="www/img/logo.png" alt="電脳麻将" height=72></a></h1>
HTML5 + JavaScript で動作する麻雀アプリ「電脳麻将」

## デモ
http://kobalab.net/majiang/

## ライセンス
[MIT](https://github.com/kobalab/Majiang/blob/master/LICENSE)

## 作者
[Satoshi Kobayashi](https://github.com/kobalab)

## npm-scripts
| コマンド         | 説明                                        |
|:----------------|:-------------------------------------------|
| ``release``     | リリース用にビルドする。                       |
| ``build``       | デバッグ用にビルドする。                       |
| ``build:js``    | JavaScriptのみデバッグ用にビルドする。          |
| ``build:css``   | CSSのみビルドする。                           |
| ``build:html``  | HTMLのみビルドする。                          |
| ``test``        | ユニットテストを実施する。                      |
| ``test:cover``  | カバレッジ・レポートつきでユニットテストを実施する。|

## ドキュメント
- プログラム構成
  - [電脳麻将のプログラム構成(0) ～ 全体編](https://blog.kobalab.net/entry/2020/07/19/212824)
  - [電脳麻将のプログラム構成(1) 〜 JavaScript編](https://blog.kobalab.net/entry/2020/07/24/234523)
  - [電脳麻将のプログラム構成(2) 〜 HTML/CSS編](https://blog.kobalab.net/entry/2020/07/29/003536)
- 手牌などのデータ構造
  - [麻雀の手牌のJavascript表現](https://blog.kobalab.net/entry/20151211/1449838875)
  - [麻雀の手牌の文字列表現](https://blog.kobalab.net/entry/20151218/1450441130)
  - [牌山と河のデータ構造](https://blog.kobalab.net/entry/2020/09/23/201841)
  - [電脳麻将の牌譜形式](https://blog.kobalab.net/entry/20151228/1451228689)
- シャンテン数計算
  - [向聴数を求めるプログラム(七対子・国士無双編)](https://blog.kobalab.net/entry/20151215/1450112281)
  - [向聴数を求めるプログラム(一般手編(再))](https://blog.kobalab.net/entry/20151216/1450191666)
  - [向聴数を求めるプログラム(一般手編(再々))](https://blog.kobalab.net/entry/20151217/1450357254)
  - [向聴数を求めるプログラム(修正版)](https://blog.kobalab.net/entry/20170917/1505601161)
- 和了点計算
  - [麻雀の和了点を計算するプログラム](https://blog.kobalab.net/entry/20151221/1450624780)
  - [麻雀の和了点の計算 ～ 状況役と懸賞役の一覧を作る](https://blog.kobalab.net/entry/20151222/1450710990)
  - [和了形を求めるプログラム(特殊形)](https://blog.kobalab.net/entry/20151223/1450796906)
  - [和了形を求めるプログラム(一般形)](https://blog.kobalab.net/entry/20151224/1450883400)
  - [麻雀の符を求めるプログラム](https://blog.kobalab.net/entry/20151225/1450970516)
  - [麻雀の役を判定するプログラム(再)](https://blog.kobalab.net/entry/20151226/1451057134)
  - [麻雀の和了点を計算するプログラム(最終回)](https://blog.kobalab.net/entry/20151227/1451142872)
- ゲーム進行
  - [麻雀の局進行のプログラム方式](https://blog.kobalab.net/entry/20151229/1451315733)
  - [麻雀の局進行のプログラム実装](https://blog.kobalab.net/entry/20151230/1451403553)
  - [麻雀の局進行の状態遷移](https://blog.kobalab.net/entry/20151231/1451487890)
- 思考ルーチン
  - [麻雀AIのプログラム構造](https://blog.kobalab.net/entry/20160102/1451703115)
  - [麻雀の打牌選択アルゴリズム(1)](https://blog.kobalab.net/entry/20160103/1451781343)
  - [麻雀の打牌選択アルゴリズム(2)](https://blog.kobalab.net/entry/20160104/1451907283)
  - [麻雀の打牌選択アルゴリズム(3)](https://blog.kobalab.net/entry/20160105/1451998413)
  - [ベタオリのアルゴリズム](https://blog.kobalab.net/entry/20161204/1480808089)
  - [麻雀の副露判断アルゴリズム(1)](https://blog.kobalab.net/entry/20161212/1481471543)
  - [麻雀の副露判断アルゴリズム(2)](https://blog.kobalab.net/entry/20161213/1481557260)
  - [麻雀の副露判断アルゴリズム(3)](https://blog.kobalab.net/entry/20161214/1481644278)
  - [麻雀の副露判断アルゴリズム(4)](https://blog.kobalab.net/entry/20161215/1481809226)
  - [麻雀の打牌選択アルゴリズム(4)](https://blog.kobalab.net/entry/20170731/1501502063)
  - [麻雀の打牌選択アルゴリズム(5)](https://blog.kobalab.net/entry/20170802/1501673312)
  - [麻雀の打牌選択アルゴリズム(6)](https://blog.kobalab.net/entry/20170806/1502026197)
  - [麻雀の打牌選択アルゴリズム(7)](https://blog.kobalab.net/entry/20170813/1502605785)
  - [麻雀の打牌選択アルゴリズム(8)](https://blog.kobalab.net/entry/20170819/1503150574)
  - [麻雀の副露判断アルゴリズム(5)](https://blog.kobalab.net/entry/20170822/1503401216)
  - [麻雀の打牌選択アルゴリズム(9)](https://blog.kobalab.net/entry/20170826/1503705167)
  - [押し引き表の牌姿は評価値何点？](https://blog.kobalab.net/entry/2020/12/09/002002)
  - [押し引きアルゴリズムの改善(1)](https://blog.kobalab.net/entry/2020/12/21/202933)
  - [押し引きアルゴリズムの改善(2)](https://blog.kobalab.net/entry/2020/12/25/205627)
  - [押し引きアルゴリズムの改善(3)](https://blog.kobalab.net/entry/2021/01/02/163535)
  - [天鳳鳳凰卓の牌の危険度表](https://blog.kobalab.net/entry/2021/01/16/130716)
  - [牌の危険度計算アルゴリズム(1)](https://blog.kobalab.net/entry/2021/01/22/204805)
  - [牌の危険度計算アルゴリズム(2)](https://blog.kobalab.net/entry/2021/10/28/232300)
  - [牌の危険度計算アルゴリズム(3)](https://blog.kobalab.net/entry/2021/11/15/080258)
  - [牌の危険度計算アルゴリズム(4)](https://blog.kobalab.net/entry/2021/11/22/071442)
- 表示処理
  - [麻雀の手牌を表示するプログラム](https://blog.kobalab.net/entry/2020/08/14/234729)
- その他
  - [電脳麻将のプログラム中の中国語一覧](https://blog.kobalab.net/entry/20170722/1500688645)
  - [天鳳の牌譜形式を解析する(1)](https://blog.kobalab.net/entry/20170225/1488036549)
  - [天鳳の牌譜形式を解析する(2)](https://blog.kobalab.net/entry/20170228/1488294993)
  - [天鳳の牌譜形式を解析する(3)](https://blog.kobalab.net/entry/20170312/1489315432)
  - [天鳳の牌譜形式を解析する(4)](https://blog.kobalab.net/entry/20170720/1500479235)
  - [牌画入力ツール](https://blog.kobalab.net/entry/20161218/1482078427)
  - [電脳麻将で天鳳の牌譜を検討する](https://blog.kobalab.net/entry/2020/07/08/080228)
  - [デュプリケート麻雀の実装](https://blog.kobalab.net/entry/2020/12/19/075529)

## 謝辞
ゲームで使用している牌画像は [麻雀の画像・素材](http://www.civillink.net/fsozai/majan.html)、
音声は [天鳳用オリジナルSE: アンコロキングblog](http://ancoro.way-nifty.com/blog/se.html)
のものを使用させていただいてます。
