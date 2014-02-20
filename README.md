boombox
=======

[HTMLVideo](http://www.w3.org/TR/2009/WD-html5-20090825/video.html), [HTMLAudio](http://www.w3.org/TR/html5/embedded-content-0.html#the-audio-element), [WebAudio](http://www.w3.org/TR/webaudio/)を包括したブラウザ向け音声ライブラリです。


Audio系APIを統一したインターフェースで提供し、ラジカセ([_boombox_](http://en.wikipedia.org/wiki/Boombox))のようなシンプルな操作で利用する事が可能です。

### Why you should use boombox?

ブラウザでサウンドを鳴らすには、`HTMLAudio`/`WebAudio`/`HTMLVideo` が一般的に使われますが、APIの呼び出し方法やブラウザサポートなどがまちまちです。

`boombox`は上記のような環境差異を吸収し一貫したAPIを提供しています。
また、ブラウザが非アクティブ時には音を停止したり、複数のサウンドを同時に利用するといった、スマートフォン特有の要件も想定して作成されています。

`WebAudio` では、ミキシングといった高度な利用も想定したAPIになっていますが、`boombox` はこれらの機能は拡張していません。あくまで基本的なブラウザでの利用シーンを想定しています。

しかし、これらの高度な機能へのアクセスは阻害しませんので、`boombox`を拡張することは可能です。


## Demo

[**Single Sound**](http://cyberagent.github.io/boombox.js/demo/single.html)

[![](https://raw2.github.com/CyberAgent/boombox.js/gh-pages/screenshots/demo-single.png)](http://cyberagent.github.io/boombox.js/demo/single.html)

[**Mix Sound**](http://cyberagent.github.io/boombox.js/demo/mix.html)

[![](https://raw2.github.com/CyberAgent/boombox.js/gh-pages/screenshots/demo-mix.png)](http://cyberagent.github.io/boombox.js/demo/mix.html)

## Features

- Play(再生)
- Pause(中断)
- Stop(停止)
- Replay(頭から再生)
- Resume(途中から再生)
- PowerON/PowerOFF(電源をON/OFF)
- Volume (音量の変更)
- LoopReproducing(ループ再生)
- Multi Sound Playing(複数サウンド再生)
    - ブラウザの対応状況に依存しますが、可能な限りサポート
- CORS Settings
    - crossOrigin、サウンドファイル配信サーバー・ロードオプションを適切に設定すれば[CORS](https://developer.mozilla.org/ja/docs/HTTP_access_control)を回避可能です。
- Filterings
    - 環境ごとに音の出し分けを行うフィルタリングをサポート

## Reference information


|OS/Browser|audio load event|
|:------------:|:------------:|
|IOS 5: Safari|suspend|
|IOS 6, 7: Safari|suspend|
|Android 2.3: basic|stalled|
|Android 4.0: basic|loadeddata|
|Mac OSX: Chrome|canplay|

====

|OS/Browser|Web Audio|HTML Audio|HTML Video|
|:------------:|:------------:|:------------:|:------------:|
|IOS 5: Safari|-|✔ |✔ \*1|
|IOS 6, 7: Safari|✔|✔|✔ \*1|
|Android 2.3: basic|-|✔|✔|
|Android 4.0: basic|✔ \*2|✔|✔|
|Mac OSX: Chrome|✔|✔|✔|

> `*1` 別アプリ 起動 : NG
>
> `*2` 一部機種 対応
> *HTMLVideo* : *DOMにElement追加 必須* + *DOMは、映像がないものを利用する場合は、表示領域外に指定すると良い*

====

|OS/Browser|1 sound|2 sound|multi sound|
|:------------:|:------------:|:------------:|:------------:|
|IOS 5: Safari|✔|-|-|
|IOS 6, 7: Safari|✔|✔|✔|
|Android 2.x: basic|✔|✔|✔|
|Android 4.x: basic|✔|✔ \*1|-|
|Mac OSX: Chrome|✔|✔|✔|

> `*1` HTMLAudio/HTMLVideo 併用

## Install

### Download

`boombox.js`または`boombox.min.js`をダウンロードしてください。

- [boombox.js](https://raw2.github.com/CyberAgent/boombox.js/master/boombox.js)
- [boombox.min.js](https://raw2.github.com/CyberAgent/boombox.js/master/boombox.min.js)

### npm

```sh
$ npm install boombox.js
```

### Bower

```sh
$ bower install boombox.js
```

### component

```sh
$ component install CyberAgent/boombox.js
```

### HTML

上記のいずれかの方法でダウンロードした後、`script`タグでロードしてください。

```html
<script type="text/javascript" src="YOUR/PATH/TO/boombox.js"></script><!-- for development -->
<script type="text/javascript" src="YOUR/PATH/TO/boombox.min.js"></script><!-- for product -->
```

> require.js サポート

## Build

ビルドには[Grunt](http://gruntjs.com/)を使用します。

```sh
$ git clone https://github.com/CyberAgent/boombox.js.git
$ cd boombox
$ npm install -g grunt-cli # 初回のみ
$ npm install . # 初回のみ
$ grunt
```

## Browser Test

テスト環境として[Grunt](http://gruntjs.com/)と[beez-foundation](https://npmjs.org/package/beez-foundation)を使用します。

```sh
$ npm install -g beez-foundation # テスト用のWebサーバをインストール(初回のみ)
$ cd boombox
$ npm install . # 初回のみ
$ grunt foundation # ローカルサーバ起動
```

@see [beez](https://github.com/CyberAgent/beez)

@see [beez-foundation](https://github.com/CyberAgent/beez-foundation)

**ブラウザでアクセスしてください。**

> script タグ : [http://0.0.0.0:1109/m/boombox/spec/global.html](http://0.0.0.0:1109/m/boombox.js/spec/global.html)
>
> require.js : [http://0.0.0.0:1109/m/boombox/spec/requirejs.html](http://0.0.0.0:1109/m/boombox.js/spec/requirejs.html#)

## Usage

### Setup

`boombox` を使うためのセットアップ

```javascript
boombox.setup();
```

#### Forced use options

強制的に音源の形式を指定

```javascript
{
    webaudio: {
        use: true
    },
    htmlaudio: {
        use: true
    },
    htmlvideo: {
        use: true
    }
}
```

### Load sound file

サウンドファイルをロード

```javascript
var options = {
    src: [
        {
            media: 'audio/mp4',
            path: 'http://0.0.0.0:1109/m/spec/media/sound.m4a'
        }
    ]
};
boombox.load('sound', options, function (err, audio) {
    // サウンドファイルのロード
});

```

> srcは、複数メディアタイプを指定可能です。先頭から順に評価していき、利用可能なメディアタイプをロードします。


### Play

```javascript
boombox.play() // 全てのサウンド

boombox.get('sound').play() // 特定のサウンド
```
#### Restriction

スマートフォンでは、ユーザーの操作(MouseEventsなど)をトリガーとした場合のみサウンド再生が可能な端末が多数を占めます。
これはブラウザの仕様になりますので、利用する端末で確認してください。

### Volume control

```javascript
boombox.get.volume(0.5) // 全てのサウンド。 0 < 1の間で引数の指定

boombox.get('sound').volume(0.5) // 特定のサウンド。 0 < 1の間で引数の指定
```

### Cut off the power

サウンドがなっている場合でも、ラジカセで電源をOFFにしたように音が止まります。

#### Specified sounds

```javascript
boombox.get('sound').power(boombox.POWER_OFF);
```

#### All sounds.

```javascript
boombox.power(boombox.POWER_OFF);
```

### Loop play

ループ再生には、２通りあります。

- ネイティブループ(`HTMLAudio` `WebAudio` `HTMLVideo` がサポートする機能)
- オリジナルループ(`onEnded`イベントを使っての連続再生ループ)

```javascript
boombox.get('sound').setLoop(boombox.LOOP_ORIGINAL);
boombox.get('sound').play();
// or

boombox.get('sound').setLoop(boombox.LOOP_NATIVE);
boombox.get('sound').play();
```

### onEnded

サウンドが最後まで再生された時に呼び出されます。
オーバーライドして使用してください。

```javascript
boombox.get('name').onEnded = function () {
    // コールバック処理
}
```

### Use filter

サウンドファイルをロードする前に、フィルタをいれて、端末やブラウザ毎に再生するサウンドを選ぶことができます。
複数フィルタを設定することが出来ますが、一つでも **NG** であれば残りのフィルタは処理されません。

```javascript
boombox.addFilter('chrome', function filter() {
    if (/Chrome/.test(window.navigator.userAgent)) {
        return false; // [ OK ] Chrome
    } else {
        return true;  // [ NG ] Chrome 以外
    }
});
var options = {
    src: [
        {
            media: 'audio/mp4',
            path: 'http://0.0.0.0:1109/m/spec/media/sound.m4a'
        }
    ],
    filter: ["chrome"] // 使用したいフィルタを指定
};
boombox.load('sound', options, true, function (err, audio) {
    // サウンドファイルのロード
});
```

> ブラウザのサウンドは、ブラウザにより対応がまちまちです。フィルタを使って必ず個別に制御する必要があります。

### Forced use HTMLVideo

`boombox.load()`の第3引数に`true`を渡すと強制的に`HTMLVideo`を利用します。

> HTMLAudioが１音しかサポートしていない場合に利用します。


```javascript
var options = {
    src: [
        {
            media: 'audio/mp4',
            path: 'http://0.0.0.0:1109/m/spec/media/sound.m4a'
        }
    ]
};
// loadの第3引数にtrueを渡す
boombox.load('sound', options, true, function (err, audio) {
    // サウンドファイルのロード
    // audioがHTMLVideoの場合は、DOMへ追加が必要です。
});
```

### Cache

一度ロードしたサウンドファイルは、`boombox.pool` にインスタンスとしてキャッシュされます。

ブラウザによるキャッシュはそれぞれ挙動が異なるため、SPA(シングルページアプリケーション)であれば、boombox.poolのキャッシュは非常に有効です。

### Priority

`boombox`がデフォルトで使用するAPIの順番は以下の優先度になります。

`WebAudio` > `HTMLAudio` > `HTMLVideo`

- `WebAudio`と`HTMLAudio`両方が実装されてるブラウザの場合は`WebAudio`が優先されます。
- `HTMLVideo`はオプションで有効にしない限りは使いません。

### currentTime

`HTMLAudio` `HTMLVide` のシーク設定(currentTime) が設定出来ないブラウザがある場合は
、内部でcurrentTimeが設定されても無視されます。

### Inactive

ブラウザがバックグラウンドになった状態を、`window.onpageshow/onpagehide` `window.onblur/onfocus` `Event.onVisibilityChange` を利用して判定しています。

> すべての端末で取得可能ではないので、利用している環境で確認して下さい。

### Customize Events

カスタマイズ可能な関数はすべて、`onXXXX` の命名規則になっていますのでそのまま関数を上書きしてください。

##### onVisibilityChange(e)

`visibilityChange`イベントの発生に合わせて実行されます。

##### onFocus(e)

`window.onFocus`イベントの発生に合わせて実行されます。

##### onBlur(e)

`window.onBlur`イベントの発生に合わせて実行されます。

##### onPageShow(e)

`window.onpageshow`イベントの発生に合わせて実行されます。

##### onPageHide(e)

`window.onpagehide`イベントの発生に合わせて実行されます。

##### onEnded(e)

サウンドが最後まで再生された時に実行されます。途中で停止された場合は発火しません。


```javascript

// シンプルな使用法
boombox.onFocus = function (e) {
    logger.trace('onFocus');
}

// 関数のオーバーライド

var fn = boombox.onFocus;

boombox.onFocus = function () {
    console.log("override:", onFocus);
    fn.apply(boombox, arguments);
}

```

## TODO

- AudioSprite: 音源を１ファイルにまとめる
    - Check develop branch
- localStorage: Audioのキャッシュ

====

## Sample Sound File

### Location path

- `spec/media/sound.m4a`
- `spec/media/sound.wav`

### Creation software

Sound that was created in AudioSauna

[http://www.audiosauna.com/](http://www.audiosauna.com/)


## Contributing

- Kei FUNAGAYAMA - [@fkei](https://twitter.com/fkei) [github](https://github.com/fkei)
- Masaki Sueda - [github](htpts://github.com/masakisueda)
- HIRAKI Satoru - [github](htpts://github.com/Layzie)

## Copyright

CyberAgent, Inc. All rights reserved.

## LICENSE

@see : [LICENSE](https://github.com/CyberAgent/boombox.js/blob/master/LICENSE)

```
The MIT License (MIT)

Copyright © CyberAgent, Inc. All Rights Reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

```


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/CyberAgent/boombox.js/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

