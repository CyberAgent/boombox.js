boombox
=======

**日本語ドキュメントは[こちら](https://github.com/CyberAgent/boombox.js/blob/master/README.md)**

---

"boombox.js" provides unified audio API for browser, such as [HTMLVideo](http://www.w3.org/TR/2009/WD-html5-20090825/video.html) / [HTMLAudio](http://www.w3.org/TR/html5/embedded-content-0.html#the-audio-element) / [WebAudio](http://www.w3.org/TR/webaudio/).

This library has simple API, like [_boombox_](http://en.wikipedia.org/wiki/Boombox).

### Why you should use boombox?

Web browseres have `HTMLAudio` / `WebAudio` / `HTMLVideo` API for playing audio. However these API have diffrent way to use and browser have no compatibility.
`boombox` provides unified API and solves diffrence enviroment between web browser.

In addition to this library has function for mobile web browser support, eg: stop to play sound when a web browser is inactive, handle multiple audio source.

`WebAudio` API has advanced feature like "Mixing sound" but `boombox` doesn't extend these feature. Because the library suppose basic usage.
However `boombox` doesn't restrict these features, you can extend `boombox` function.

## Demo

[**Single Sound**](http://cyberagent.github.io/boombox.js/demo/single.html)

[![](https://raw2.github.com/CyberAgent/boombox.js/gh-pages/screenshots/demo-single.png)](http://cyberagent.github.io/boombox.js/demo/single.html)

[**Mix Sound**](http://cyberagent.github.io/boombox.js/demo/mix.html)

[![](https://raw2.github.com/CyberAgent/boombox.js/gh-pages/screenshots/demo-mix.png)](http://cyberagent.github.io/boombox.js/demo/mix.html)

## Features

- Play
- Pause
- Stop
- Replay
- Resume
- PowerON/PowerOFF
- Volume
- LoopReproducing
- Playing Multi Sound
    - `boombox.js` supports this feature as far as possible but depends on web browser support.
- CORS Settings
    - `boombox.js` has several configurations to observe [CORS](https://developer.mozilla.org/ja/docs/HTTP_access_control) specifications.
- Filterings
    - `boombox.js` divided out sound souces based on browser detection.

## Reference information


|OS/Browser|HTMLAudio or HTMLVideo load event|
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

> `*1`Can't support for starting another application.
>
> `*2` Some smart phones are supported.
> *HTMLVideo* : *You should append DOM elements. In case for no visual element, it's good idea to put DOM in outside display area.

====

|OS/Browser|1 sound|2 sound|multi sound|
|:------------:|:------------:|:------------:|:------------:|
|IOS 5: Safari|✔|-|-|
|IOS 6, 7: Safari|✔|✔|✔|
|Android 2.x: basic|✔|✔|✔|
|Android 4.x: basic|✔|✔ \*1|-|
|Mac OSX: Chrome|✔|✔|✔|

> `*1` HTMLAudio/HTMLVideo are used in combination.

## Install

### Download

You can download `boombox.js` or `boombox.min.js` from following links.

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

Load `boombox.js` using `script` tag after download it.

```html
<script type="text/javascript" src="YOUR/PATH/TO/boombox.js"></script><!-- for development -->
<script type="text/javascript" src="YOUR/PATH/TO/boombox.min.js"></script><!-- for product -->
```

> `boombox.js` supports `require.js`

## Build

Use [Grunt](http://gruntjs.com/) for build.

```sh
$ git clone https://github.com/CyberAgent/boombox.js.git
$ cd boombox
$ npm install -g grunt-cli # If you haven't already installed grunt-cli.
$ npm install . # If you haven't already installed local npm.
$ grunt
```

## Browser Test

You can test `boombox.js` using [Grunt](http://gruntjs.com/) & [beez-foundation](https://npmjs.org/package/beez-foundation).

```sh
$ npm install -g beez-foundation # If you haven't already installed beez-foundation that is web server.
$ cd boombox
$ npm install . # Once at first if you don't install local npm.
$ grunt foundation # Starting local server.
```

@see [beez](https://github.com/CyberAgent/beez)

@see [beez-foundation](https://github.com/CyberAgent/beez-foundation)

**Access in your favorite browser**

> If you load `boombox.js` in script tag: [http://0.0.0.0:1109/m/boombox/spec/global.html](http://0.0.0.0:1109/m/boombox.js/spec/global.html)
>
> If you load `boombox.js` using require.js : [http://0.0.0.0:1109/m/boombox/spec/requirejs.html](http://0.0.0.0:1109/m/boombox.js/spec/requirejs.html#)

## Usage

### Setup `boombox.js`

Setup method for using `boombox.js`.

```javascript
boombox.setup();
```

#### Use specify format of the sound sources forcibly

The option for forced use specify format of the sound sources.

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

### Load sound sorces

Load the sound sorce.

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
    // callback function
});

```

> You can set multiple sound sources in `options.src`, `boombox.js` evaluate `options.src` from the beginning
then load sources if available to use.

### Play sounds

```javascript
boombox.play() // All of loaded sounds.

boombox.get('sound').play() // Play specify sound.
```

#### Restriction for using `boombox.js` in mobile web browser

Many of mobile web browseres can't play sounds without user operation. (`MouseEvents` etc.)
This restriction depends on web browseres specification, It is better to check the web browseres to be used.

### Control of volume

```javascript
boombox.get.volume(0.5) // All sound . Argument takes between 0 to 1.

boombox.get('sound').volume(0.5) // Specified sound. Argument takes between 0 to 1.
```

### Turn off sounds

Turn off sounds whenever playing sound. (like actualy _boombox_ :p)

#### Specified sounds

```javascript
boombox.get('sound').power(boombox.POWER_OFF);
```

#### All sounds.

```javascript
boombox.power(boombox.POWER_OFF);
```

### Loop playback

There are two ways for loop playback.

- Native loop (This function uses the API supported in `HTMLAudio` / `WebAudio` / `HTMLVideo`)
- Original loop (This function uses `onEnded` event for continuous playback loop)

```javascript
boombox.get('sound').setLoop(boombox.LOOP_ORIGINAL);
boombox.get('sound').play();
// or

boombox.get('sound').setLoop(boombox.LOOP_NATIVE);
boombox.get('sound').play();
```

### onEnded

This event is called when a sound have been played to the end.

You should override for using this.

```javascript
boombox.get('name').onEnded = function () {
    // callback function
}
```

### Use filter

- You can choose which web broswers and smart phones to play sounds
- You can specify multiple filters, but if any filter is NG, boombox quit evaluation immediately

```javascript
boombox.addFilter('chrome', function filter() {
    if (/Chrome/.test(window.navigator.userAgent)) {
        return false; // [ OK ] Chrome
    } else {
        return true;  // [ NG ] Another browseres
    }
});
var options = {
    src: [
        {
            media: 'audio/mp4',
            path: 'http://0.0.0.0:1109/m/spec/media/sound.m4a'
        }
    ],
    filter: ["chrome"] // Assign the filters you want to use.
};
boombox.load('sound', options, true, function (err, audio) {
    // load sound resources.
});
```

> You **should** control to play sounds individually because web browseres have large diffrence in audiio API support.

### Use HTMLVideo forcibly

You can utilize `HTMLVideo` when pass `true` to `boombox.load()`'s '3rd argument.

> The case you may use this feature when `HTMLAudio` support only one note to play.

```javascript
var options = {
    src: [
        {
            media: 'audio/mp4',
            path: 'http://0.0.0.0:1109/m/spec/media/sound.m4a'
        }
    ]
};
// Pass `true` to 3rd argument in `boombox.load()`
boombox.load('sound', options, true, function (err, audio) {
    // load sound resources.
    // You should append DOM elements. In case for no visual element, you put DOM in outside display area.
});
```

### Cache

`boombox.pool` cache the sound source when loaded.

Web browseres have diffrent behaviour about cache, so this functioin is very effective especially in SPA.

### Priority

The priority order for using API by default are following.

`WebAudio` > `HTMLAudio` > `HTMLVideo`

- If web browser has both `WebAudio` and `HTMLAudio` then `WebAudio` has priority.
- `boombox.js` doesn't use `HTMLVideo` as long as it doesn't enable in option.

### currentTime

`boombox.js` ignores `currentTime` when web browser can't set seek setting on `HTMLAudio` and `HTMLVideo`.:w

### Inactive

`boombox.js` can judge state that the browser has become background using `window.onpageshow/onpagehide`, `window.onblur/onfocus` and `Event.onVisibilityChange`.

> It is not obtainable on all browser, so you may avouch in your web browser.

### Customize Events

All customizable events are named by `onXXXX`, so you can override these events.

##### onVisibilityChange(e)

This event is fired this event by the occurrence of `visibilityChange` event.

##### onFocus(e)

This event is fired this event by the occurrence of `window.onFocus` event.

##### onBlur(e)

This event is fired this event by the occurrence of `window.onBlur` event.

##### onPageShow(e)

This event is fired this event by the occurrence of `window.onpageshow` event.

##### onPageHide(e)

This event is fired this event by the occurrence of `window.onpagehide` event.

##### onEnded(e)

This event is fired when a sound have been played to the end.
It will not be fired when the sound stops on the way.


```javascript

// Simple usage.
boombox.onFocus = function (e) {
    logger.trace('onFocus');
}

// Override function.

var fn = boombox.onFocus;

boombox.onFocus = function () {
    console.log("override:", onFocus);
    fn.apply(boombox, arguments);
}

```

## TODO

- AudioSprite: put together audio sources in one file
    - Check develop branch
- localStorage: cache audio sources.

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

