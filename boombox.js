/**
 * Browser sound library which blended HTMLVideo and HTMLAudio and WebAudio
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 CyberAgent, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 *
 * @license MIT
 * @author Kei Funagayama <funagayama_kei@cyberagent.co.jp>
 */
(function (w) {
    'use strict';

    var none = function () {};

    var isRequire = !!(typeof define === 'function' && define.amd);

    var SPRITE_SEPARATOR = '-';
    var LOGGER_DEFAULT_SEPARATOR = '-';

    var getSpriteName = function (name) {
        return {
            prefix: name.substring(0, name.indexOf(SPRITE_SEPARATOR)),
            suffix: name.substring(name.indexOf(SPRITE_SEPARATOR) + 1),
            name: name
        };
    };

    /**
     * off:
     * trace: 1
     * debug: 2
     * info:  3
     * warn:  4
     * error: 5
     *
     */
    var LOG_LEVEL = 3; // default: info

    var Logger = (function () {
        function Logger(prefix) {
            this.prefix = prefix || LOGGER_DEFAULT_SEPARATOR;
            this.prefix = '[' + this.prefix + ']';
        }

        Logger.prototype.trace = function () {
            if (LOG_LEVEL <= 1) {
                console.debug('[TRACE]', this.prefix, Array.prototype.slice.call(arguments).join(' '));
            }
        };
        Logger.prototype.debug = function () {
            if (LOG_LEVEL <= 2) {
                console.debug('[DEBUG]', this.prefix, Array.prototype.slice.call(arguments).join(' '));
            }
        };
        Logger.prototype.info = function () {
            if (LOG_LEVEL <= 3) {
                console.info('[INFO ]', this.prefix, Array.prototype.slice.call(arguments).join(' '));
            }
        };
        Logger.prototype.warn = function () {
            if (LOG_LEVEL <= 4) {
                console.warn('[WARN ]', this.prefix, Array.prototype.slice.call(arguments).join(' '));
            }
        };
        Logger.prototype.error = function () {
            if (LOG_LEVEL <= 5) {
                console.error('[ERROR]', this.prefix, Array.prototype.slice.call(arguments).join(' '));
            }
        };

        return Logger;

    })();


    //////////////////////////////////
    // BoomBox Class

    var BoomBox = (function () {
        function BoomBox() {

            /**
             * Version
             * @memberof boombox
             * @name VERSION
             */
            this.VERSION = '0.6.6';


            /**
             * Loop off
             *
             * @memberof boombox
             * @name LOOP_NOT
             * @constant
             * @type {int}
             */
            this.LOOP_NOT = 0;


            /**
             * orignal loop
             *
             * @memberof boombox
             * @name LOOP_ORIGINAL
             * @constant
             * @type {int}
             */
            this.LOOP_ORIGINAL = 1;


            /**
             * Native loop
             *
             * @memberof boombox
             * @name LOOP_NATIVE
             * @constant
             * @type {int}
             */
            this.LOOP_NATIVE = 2;

            /**
             * Turn off the power.
             *
             * @memberof boombox
             * @name POWER_OFF
             * @constant
             * @type {boolean}
             */
            this.POWER_OFF = false;

            /**
             * Turn on the power.
             *
             * @memberof boombox
             * @name POWER_ON
             * @constant
             * @type {boolean}
             */
            this.POWER_ON = true;

            /**
             * It does not support the media type.
             *
             * @memberof boombox
             * @name ERROR_MEDIA_TYPE
             * @constant
             * @type {int}
             */
            this.ERROR_MEDIA_TYPE = 0;

            /**
             * Hit the filter
             *
             * @memberof boombox
             * @name ERROR_HIT_FILTER
             * @constant
             * @type {int}
             */
            this.ERROR_HIT_FILTER = 1;

            /**
             * flag setup
             * @memberof boombox
             * @name setuped
             */
            this.setuped = false;

            /**
             * Environmental support information
             *
             * @memberof boombox
             * @name support
             */
            this.support = {
                mimes: [],
                webaudio: {
                    use: !!w.webkitAudioContext
                },
                htmlaudio: {
                    use: false
                },
                htmlvideo: {
                    use: false
                }
            };

            if (this.support.webaudio.use) {
                /**
                 * WebAudioContext instance (singleton)
                 *
                 * @memberof boombox
                 * @name WEB_AUDIO_CONTEXT
                 * @type {AudioContext}
                 */
                this.WEB_AUDIO_CONTEXT = new w.webkitAudioContext();
                if (!this.WEB_AUDIO_CONTEXT.createGain) {
                    this.WEB_AUDIO_CONTEXT.createGain = this.WEB_AUDIO_CONTEXT.createGainNode;
                }
            }

            // Check HTML Audio support.
            try {
                /**
                 * Test local HTMLAudio
                 * @memberof boombox
                 * @name _audio
                 */
                this._audio = new w.Audio();
                if (this._audio.canPlayType) {
                    this.support.htmlaudio.use = true;
                } else {
                    this.support.htmlaudio.use = false;
                }
            } catch (e) {
                this.support.htmlaudio.use = false;
            }

            // Check HTML Video support.
            try {
                /**
                 * Test local HTMLVideo
                 * @memberof boombox
                 * @name _video
                 */
                this._video = document.createElement('video');
                if (this._video.canPlayType) {
                    this.support.htmlvideo.use = true;
                } else {
                    this.support.htmlvideo.use = false;
                }
            } catch (e) {
                this.support.htmlvideo.use = false;
            }

            /**
             * Audio instance pool
             *
             * @memberof boombox
             * @name pool
             */
            this.pool = {};

            /**
             * Audio instance of waiting
             *
             * @memberof boombox
             * @name waits
             */
            this.waits = [];

            /**
             * Visibility of browser
             *
             * @memberof boombox
             * @name visibility
             */
            this.visibility = {
                hidden: undefined,
                visibilityChange: undefined
            };

            /**
             * State of boombox
             *
             * @memberof boombox
             * @name state
             * @type {Object}
             */
            this.state = {
                power: this.POWER_ON
            };


            /**
             * Filtering function
             *
             * @memberof boombox
             * @name filter
             * @type {Object}
             */
            this.filter = {};

        }

        //// prototype

        /**
         * The availability of the WebLAudio
         *
         * @memberof boombox
         * @name isWebAudio
         * @return {boolean}
         */
        BoomBox.prototype.isWebAudio = function () {
            return this.support.webaudio.use;
        };

        /**
         * The availability of the HTMLAudio
         *
         * @memberof boombox
         * @name isHTMLAudio
         * @return {boolean}
         */
        BoomBox.prototype.isHTMLAudio = function () {
            return this.support.htmlaudio.use;
        };

        /**
         * The availability of the HTMLVideo
         *
         * @memberof boombox
         * @name isHTMLVideo
         * @return {boolean}
         */
        BoomBox.prototype.isHTMLVideo = function () {
            return this.support.htmlvideo.use;
        };

        /**
         * boombox to manage, Audio is playing
         *
         * @memberof boombox
         * @name isPlayback
         * @return {boolean}
         */
        BoomBox.prototype.isPlayback = function () {
            var self = this;
            var res = false;

            for (var name in this.pool) {
                if (this.pool[name].isPlayback()) {
                    res = true;
                    break;
                }
            }
            return res;
        };

        /**
         * Setup processing
         *
         * @memberof boombox
         * @name setup
         * @example
         * var options = {
         *     webaudio: {},
         *     htmlaudio: {},
         *     htmlvideo: {},
         *     loglevel: Number, ) trace:5, debug:4, info:3, warn:2, error:1
         * }
         *
         */
        BoomBox.prototype.setup = function setup(options) {
            var self = this;

            options = options || {};

            if (typeof options.loglevel !== 'undefined') {
                LOG_LEVEL = options.loglevel;
            }

            this.logger = new Logger('BoomBox '); // log

            if (this.setuped) {
                this.logger.warn('"setup" already, are running.');
                return this;
            }
            options = options || {};

            if (options.webaudio) {
                if (typeof options.webaudio.use !== 'undefined') {
                    this.support.webaudio.use = options.webaudio.use;
                    this.logger.info('options.webaudio.use:', this.support.webaudio.use);
                }
            }

            if (options.htmlaudio) {
                if (typeof options.htmlaudio.use !== 'undefined') {
                    this.support.htmlaudio.use = options.htmlaudio.use;
                    this.logger.info('options.htmlaudio.use: ', this.support.htmlaudio.use);
                }
            }

            if (options.htmlvideo) {
                if (typeof options.htmlvideo.use !== 'undefined') {
                    this.support.htmlvideo.use = options.htmlvideo.use;
                    this.logger.info('options htmlvideo', this.support.htmlvideo);
                }
            }

            this._browserControl();


            // Log: WebAudio support.
            if (this.support.webaudio.use) {
                this.logger.debug('WebAudio use support.');
            } else {
                this.logger.debug('WebAudio use not support.');
            }
            // Log: HTMLAudio support.
            if (this.support.htmlaudio.use) {
                this.logger.debug('HTMLAudio use support.');
            } else {
                this.logger.debug('HTMLAudio use not support.');
            }
            // Log: HTMLVideo support.
            if (this.support.htmlvideo.use) {
                this.logger.debug('HTMLVideo use support.');
            } else {
                this.logger.debug('HTMLVideo use not support.');
            }

            //this.logger.debug('support:', JSON.stringify(this.support));


            this.setuped = true;

            return this;
        };

        /**
         * Get Audio instance
         *
         * @memberof boombox
         * @name get
         * @param {String} name audio name
         * @return {WebAudio|HTMLAudio|HTMLVideo}
         */
        BoomBox.prototype.get = function (name) {
            return this.pool[name];
        };

        /**
         * Loading audio
         *
         * @memberof boombox
         * @name load
         * @param {String} name audio name
         * @param {Object} options Audio options
         * @param {Boolean} useHTMLVideo forced use HTMLVideo
         * @param {function} callback
         * @return {boombox}
         * @example
         * var options = {
         *     src: [
         *         {
         *             media: 'audio/mp4',
         *             path: 'http://example.com/sample.m4a',
         *         }
         *     ]
         *     filter: ['android2', 'android4', 'ios5', 'ios6', 'ios7' ]
         * }
         *
         */
        BoomBox.prototype.load = function (name, options, useHTMLVideo, callback) {
            if (typeof arguments[2] === 'function') {
                callback = useHTMLVideo;
                useHTMLVideo = null;
            }

            if (!this.setuped) {
                callback && callback(new Error('setup incomplete boombox. run: boombox.setup(options)'));
                return this;
            }

            if (this.pool[name]) {
                this.logger.trace('audio pool cache hit!!', name);
                return callback && callback(null, this.pool[name]);
            }

            // check support media type
            var src = this.useMediaType(options.src);
            if (src) {
                options.media = src.media;
                options.src = src.path;
            }

            // forced use HTMLVideo
            if (useHTMLVideo && this.isHTMLVideo()) {
                var htmlvideo = new boombox.HTMLVideo(name);

                if (!src) {
                    htmlvideo.state.error = this.ERROR_MEDIA_TYPE;
                }

                if (typeof htmlvideo.state.error === 'undefined' && !this.runfilter(htmlvideo, options)) {
                    htmlvideo.load(options, callback);
                }

                this.setPool(name, htmlvideo, boombox.HTMLVideo);

                return this;
            }

            //////////////////////
            if (this.isWebAudio()) {
                this.logger.debug("use web audio");
                var webaudio = new boombox.WebAudio(name);

                if (!src) {
                    webaudio.state.error = this.ERROR_MEDIA_TYPE;
                }

                if (typeof webaudio.state.error === 'undefined' && !this.runfilter(webaudio, options)) {
                    webaudio.load(options, callback);
                }

                this.setPool(name, webaudio, boombox.WebAudio);


            } else if (this.isHTMLAudio()) {
                this.logger.debug("use html audio");
                var htmlaudio = new boombox.HTMLAudio(name);
                if (!src) {
                    htmlaudio.state.error = this.ERROR_MEDIA_TYPE;
                }

                if (typeof htmlaudio.state.error === 'undefined' && !this.runfilter(htmlaudio, options)) {
                    htmlaudio.load(options, callback);
                }


                this.setPool(name, htmlaudio, boombox.HTMLAudio);

            } else {
                callback && callback(new Error('This environment does not support HTMLAudio, both WebAudio both.'), this);
            }

            return this;

        };

        /**
         * remove audio
         *
         * @memberof boombox
         * @name remove
         * @param {String} name
         * @return {boombox}
         */
        BoomBox.prototype.remove = function (name) {
            if (this.pool[name]) { // change object
                this.logger.trace('Remove Audio that is pooled. name', name);
                this.pool[name].dispose && this.pool[name].dispose();
                this.pool[name] = undefined;
                delete this.pool[name];
            }
            return this;
        };

        /**
         * Set pool
         *
         * @memberof boombox
         * @name setPool
         * @param {String} name
         * @param {WebAudio|HTMLAudio|HTMLVideo} obj
         * @return {boombox}
         */
        BoomBox.prototype.setPool = function (name, obj, Obj) {
            if (obj.isParentSprite()) {
                for (var r in this.pool) {
                    if (!!~r.indexOf(name + SPRITE_SEPARATOR)) {
                        delete this.pool[r];
                    }
                }

                for (var n in obj.sprite.options) {
                    var cname = name + SPRITE_SEPARATOR + n;
                    var audio = new Obj(cname, obj);
                    this.pool[audio.name] = audio;
                }
            }

            this.remove(name);
            this.pool[name] = obj;

            return this;
        };

        /**
         * Run filter
         *
         * @memberof boombox
         * @name runfilter
         * @param {WebAudio|HTMLAudio|HTMLVideo} audio
         * @param {Object} options
         * @return {boolean}
         */
        BoomBox.prototype.runfilter = function (audio, options) {
            var hit;

            var list = options.filter || [];

            for (var i = 0; i < list.length; i++) {
                var name = list[i];

                var fn = this.filter[name];
                if (!fn) {
                    this.logger.warn('filter not found. name:', name);
                    return;
                }
                this.logger.debug('filter run. name:', name);

                if (fn(name, audio, options)) {
                    hit = name;
                    break;
                }
            }

            if (hit) {
                audio.state.error = this.ERROR_HIT_FILTER; // set error
                this.logger.warn('Hit the filter of', hit);
                return true;
            } else {
                return false;
            }

        };

        /**
         * check support media type
         *
         * @memberof boombox
         * @name useMediaType
         * @param {Array} src audio file data
         * @return {Object|undefined}
         */
        BoomBox.prototype.useMediaType = function (src) {
            for (var i = 0; i < src.length; i++) {
                var t = src[i];
                if (this._audio.canPlayType(t.media)) {
                    return t;
                } else {
                    this.logger.warn('skip audio type.', t.media);
                }
            }

            return undefined;
        };

        /**
         * pause sound playback in managing boombox
         *
         * @memberof boombox
         * @name pause
         * @return {boombox}
         */
        BoomBox.prototype.pause = function () {
            var self = this;
            this.logger.trace('pause');

            for (var name in this.pool) {
                var audio = this.pool[name];
                audio.pause();
                self.waits.push(name);
            }

            return this;
        };

        /**
         * resume the paused, to manage the boombox
         *
         * @memberof boombox
         * @name resume
         * @return {boombox}
         */
        BoomBox.prototype.resume = function () {
            this.logger.trace('resume');
            var name = this.waits.shift();
            if (name && this.pool[name]) {
                this.pool[name].resume();
            }
            if (0 < this.waits.length) {
                this.resume();
            }
            return this;
        };

        /**
         * Change all audio power on/off
         *
         * @memberof boombox
         * @name power
         * @param {boolean} p power on/off. boombox.(POWER_ON|POWER_OFF)
         * @return {boombox}
         */
        BoomBox.prototype.power = function (p) {
            var self = this;
            this.logger.trace('power:', this.name, 'flag:', p);

            for (var name in this.pool) {
                var audio = this.pool[name];
                audio.power(p);
            }

            this.state.power = p;
            return this;
        };

        /**
         * audio change volume.
         *
         * @memberof boombox
         * @method
         * @name volume
         * @return {boombox}
         */
        BoomBox.prototype.volume = function (v) {
            var self = this;
            this.logger.trace('volume:', this.name, 'volume:', v);

            for (var name in this.pool) {
                var audio = this.pool[name];
                audio.volume(v);
            }
        };

        /**
         * Firing in the occurrence of events VisibilityChange
         *
         * @memberof boombox
         * @name onVisibilityChange
         * @param {Event} e event
         */
        BoomBox.prototype.onVisibilityChange = function (e) {
            this.logger.trace('onVisibilityChange');
            if (document[this.visibility.hidden]) {
                this.pause();
            } else {
                this.resume();
            }
        };

        /**
         * Firing in the occurrence of events window.onfocus
         *
         * @memberof boombox
         * @name onFocus
         * @param {Event} e event
         */
        BoomBox.prototype.onFocus = function (e) {
            this.logger.trace('onFocus');
            this.resume();
        };

        /**
         * Firing in the occurrence of events window.onblur
         *
         * @memberof boombox
         * @name onBlur
         * @param {Event} e event
         */
        BoomBox.prototype.onBlur = function (e) {
            this.logger.trace('onBlur');
            this.pause();
        };

        /**
         * Firing in the occurrence of events window.onpageshow
         *
         * @memberof boombox
         * @name onPageShow
         * @param {Event} e event
         */
        BoomBox.prototype.onPageShow = function (e) {
            this.logger.trace('onPageShow');
            this.resume();
        };

        /**
         * Firing in the occurrence of events window.onpagehide
         *
         * @memberof boombox
         * @name onPageHide
         * @param {Event} e event
         */
        BoomBox.prototype.onPageHide = function (e) {
            this.logger.trace('onPageHide');
            this.pause();
        };

        /**
         * boombox で利用する機能のブラウザ差異をチェック
         *
         * @memberof boombox
         * @name _browserControl
         * @return {boombox}
         */
        BoomBox.prototype._browserControl = function () {
            var self = this;
            if (typeof document.hidden !== "undefined") {
                this.visibility.hidden = "hidden";
                this.visibility.visibilityChange = "visibilitychange";
            } else if (typeof document.webkitHidden !== "undefined") {
                this.visibility.hidden = "webkitHidden";
                this.visibility.visibilityChange = "webkitvisibilitychange";
            } else if (typeof document.mozHidden !== "undefined") {
                this.visibility.hidden = "mozHidden";
                this.visibility.visibilityChange = "mozvisibilitychange";
            } else if (typeof document.msHidden !== "undefined") {
                this.visibility.hidden = "msHidden";
                this.visibility.visibilityChange = "msvisibilitychange";
            }
            // Visibility.hidden
            if (this.visibility.hidden) {
                document.addEventListener(this.visibility.visibilityChange, function (e) {
                    self.onVisibilityChange(e);
                }, false);
            }

            // focus/blur
            if (typeof window.addEventListener !== "undefined") {
                window.addEventListener('focus', function (e) {
                    self.onFocus(e);
                }, false);
                window.addEventListener('blur', function (e) {
                    self.onBlur(e);
                }, false);
            } else {
                window.attachEvent('onfocusin', function (e) {
                    self.onFocus(e);
                }, false);
                window.attachEvent('onfocusout', function (e) {
                    self.onBlur(e);
                }, false);
            }

            // onpage show/hide
            window.onpageshow = function (e) {
                self.onPageShow(e);
            };

            window.onpagehide = function (e) {
                self.onPageHide(e);
            };

            //
            return this;
        };

        BoomBox.prototype.addFilter = function (name, fn) {
            this.filter[name] = fn;
        };

        BoomBox.prototype.dispose = function () {
            for (var name in this.pool) {
                var audio = this.pool[name];
                audio.dispose && audio.dispose();
            }

            delete this.VERSION;
            delete this.setuped;
            delete this.support.mimes;
            delete this.support.webaudio.use;
            this.WEB_AUDIO_CONTEXT && delete this.WEB_AUDIO_CONTEXT;

            delete this.support.webaudio;
            delete this.support.htmlaudio.use;
            delete this.support.htmlaudio;
            delete this.support.htmlvideo.use;
            delete this.support.htmlvideo;
            delete this.support;

            delete this.pool;

            delete this.waits;
            delete this.visibility;
            delete this.state.power;
            delete this.state;
            delete this._audio;
            delete this._video;
            delete this.filter;
        };

        return BoomBox;
    })();

    // New!!!!
    var boombox = new BoomBox();



    //////////////////////////////////
    // HTMLAudio Class

    var HTMLAudio = (function () {
        function HTMLAudio(name, parent) {
            this.logger = new Logger('HTMLAudio');
            this.name = name;
            this._timer = {}; // setTimeout#id

            // sprite store
            this.sprite = undefined;
            if (parent) {
                var sprite_n = getSpriteName(name);

                // change Sprite
                var current = parent.sprite.options[sprite_n.suffix];

                this.parent = parent; // ref
                this.state = this.parent.state; // ref
                this.$el = this.parent.$el; // ref
                //this.onEnded = this.parent.onEnded; // TODO: ref
                this.sprite = new Sprite(undefined, current); // new

            } else {
                this.state = {
                    time: {
                        playback: undefined, // Playback start time (unixtime)
                        pause: undefined // // Seek time paused
                    },
                    loop: boombox.LOOP_NOT, // Loop playback flags
                    power: boombox.POWER_ON, // Power flag
                    loaded: false, // Audio file is loaded
                    error: undefined // error state
                };
                this.$el = new w.Audio();
            }

        }

        ////

        /**
         * Loading html audio
         *
         * @memberof HTMLAudio
         * @name load
         * @method
         * @param {Object} options
         * @param {function} callback
         * @example
         * .load({
         *     src: '', // required
         *     type: '', // optional
         *     media: '', // optional
         *     preload: 'auto', // optional
         *     autoplay: false, // optional
         *     mediagroup: 'boombox', // optional
         *     loop: false, // optional
         *     muted: false, // optional
         *     crossorigin: "anonymous", // optional
         *     controls: false // optional
         *     timeout: 15 * 1000 // optional default) 15s
         * }, function callback() {});
         *
         */
        HTMLAudio.prototype.load = function (options, callback) {

            var cb = callback || none;

            if (this.parent) { // skip audiosprite children
                cb(null, this);
                return this;
            }

            options = options || {
                //src: '',
                //type: '',
                //media: '',
                preload: 'auto', // auto, metadata, none
                autoplay: false, // no-auto
                //mediagroup: 'boombox',
                loop: false,
                muted: false,
                //crossorigin: "anonymous",
                controls: false
            };
            var timeout = options.timeout || 15 * 1000;
            delete options.timeout;

            if (options.spritemap) { // Sprite ON
                this.sprite = new Sprite(options.spritemap);
                delete options.spritemap;
            }


            for (var k in options) {
                var v = options[k];
                this.logger.trace('HTMLAudioElement attribute:', k, v);
                this.$el[k] = v;
            }

            // Debug log
            /**
            ["loadstart",
             "progress",
             "suspend",
             "load",
             "abort",
             "error",
             "emptied",
             "stalled",
             "play",
             "pause",
             "loadedmetadata",
             "loadeddata",
             "waiting",
             "playing",
             "canplay",
             "canplaythrough",
             "seeking",
             "seeked",
             "timeupdate",
             "ended",
             "ratechange",
             "durationchange",
             "volumechange"].forEach(function(eventName) {
                 self.$el.addEventListener(eventName, function() {
                     console.log('audio: ' + eventName);
                 }, true);
             });
             */

            var hookEventName = 'canplay';
            var ua_ios = window.navigator.userAgent.match(/(iPhone\sOS)\s([\d_]+)/);
            if (ua_ios && 0 < ua_ios.length) { // IOS Safari
                hookEventName = 'suspend';
            }

            this.logger.trace('hook event name:', hookEventName);

            var self = this;

            this.$el.addEventListener(hookEventName, function (e) {
                self.logger.trace('processEvent ' + e.target.id + ' : ' + e.type, 'event');

                self.state.loaded = true;

                self.$el.removeEventListener(hookEventName, e, false);

                return cb(null, self);
            });

            this.$el.addEventListener(
                'ended',
                function (e) {
                    self._onEnded(e);
                },
                false);

            setTimeout(function () {
                if (self.$el.readyState !== 4) {
                    self.$el.src = '';
                    cb(new Error('load of html audio file has timed out. timeout:' + timeout), self);
                    cb = function () {};
                }
            }, timeout);

            this.$el.load();

            //setInterval(function () { console.error(self.name, 'playback', self.isPlayback(), 'stop:', self.isStop(), 'pause:', self.isPause(), 'power:', self.state.power     ); }, 100);

            return this;


        };

        /**
         HTMLAudio.prototype.addTextTrack = function () {
            this.$el.addTextTrack();
        };

        HTMLAudio.prototype.canPlayType = function () {
            this.$el.canPlayType();
        };

         */

        //////////

        /**
         * Is use.
         *
         * @memberof HTMLAudio
         * @method
         * @name isUse
         * @return {boolean}
         */
        HTMLAudio.prototype.isUse = function () {
            if (this.state.power === boombox.POWER_OFF || boombox.state.power === boombox.POWER_OFF) {
                return false;
            }

            if (!this.state.loaded || typeof this.state.error !== 'undefined') {
                return false;
            }

            return true;
        };

        /**
         * Is playing.
         *
         * @memberof HTMLAudio
         * @method
         * @name isPlayback
         * @return {boolean}
         */
        HTMLAudio.prototype.isPlayback = function () {
            return !!this.state.time.playback;
        };

        /**
         * Is stoped.
         *
         * @memberof HTMLAudio
         * @method
         * @name isStop
         * @return {boolean}
         */
        HTMLAudio.prototype.isStop = function () {
            return !this.state.time.playback;
        };

        /**
         * Is paused.
         *
         * @memberof HTMLAudio
         * @method
         * @name isPause
         * @return {boolean}
         */
        HTMLAudio.prototype.isPause = function () {
            return !!this.state.time.pause;
        };

        /**
         * Loop flag
         *
         * @memberof HTMLAudio
         * @method
         * @name isLoop
         * @return {int}
         */
        HTMLAudio.prototype.isLoop = function () {
            return (0 < this.state.loop);
        };

        HTMLAudio.prototype.isParentSprite = function () {
            return !!(!this.parent && this.sprite && !this.sprite.current);
        };

        HTMLAudio.prototype.isSprite = function () {
            return !!(this.parent && this.sprite && this.sprite.current);
        };


        HTMLAudio.prototype.clearTimerAll = function () {
            for (var k in this._timer) {
                var id = this._timer[k];
                this.clearTimer(k);
            }
        };
        HTMLAudio.prototype.clearTimer = function (name) {
            var id = this._timer[name];
            if (id) {
                this.logger.debug('remove setTimetout:', id);
                clearTimeout(id);
                delete this._timer[name];
            }
        };
        HTMLAudio.prototype.setTimer = function (name, id) {
            if (this._timer[name]) {
                this.logger.warn('Access that is not expected:', name, id);
            }
            this._timer[name] = id;
        };



        //////////

        /**
         * audio play.
         *
         * @memberof HTMLAudio
         * @method
         * @name play
         * @return {boombox.HTMLAudio}
         */
        HTMLAudio.prototype.play = function (resume) {
            if (!this.isUse()) {
                this.logger.debug('skip play:', this.name, 'state can not be used');
                return this;
            } // skip!!

            if (this.isPlayback()) {
                this.logger.debug('skip play:', this.name, 'is playing');
                return this;
            }

            var self = this;

            var type = 'play';
            var fn = none;

            this.state.time.playback = Date.now();

            if (resume && this.state.time.pause) {
                // resume
                this.setCurrentTime(this.state.time.pause);

                if (this.isSprite()) {
                    var _pause = this.state.time.pause;
                    fn = function () {
                        var interval = Math.ceil((self.sprite.current.end - _pause) * 1000); // (ms)

                        self.setTimer('play', setTimeout(function () {
                            self.stop();
                            self._onEnded(); // fire onended evnet
                        }, interval));
                    };
                }

                this.state.time.pause = undefined;

                type = 'resume:';

            } else {
                // zero-play
                this.setCurrentTime(0);

                if (this.isSprite()) {
                    var start = this.sprite.current.start;
                    this.setCurrentTime(start);

                    fn = function () {
                        var interval = Math.ceil(self.sprite.current.term * 1000); // (ms)
                        self.setTimer('play', setTimeout(function () {
                            self.stop();
                            self._onEnded(); // fire onended evnet
                        }, interval));
                    };
                }

            }

            this.logger.debug(type, this.name);
            fn();
            this.state.time.name = this.name;
            this.$el.play();

            return this;
        };

        /**
         * audio stop.
         *
         * @memberof HTMLAudio
         * @method
         * @name stop
         * @return {boombox.HTMLAudio}
         */
        HTMLAudio.prototype.stop = function () {
            if (!this.state.loaded || typeof this.state.error !== 'undefined') {
                this.logger.debug('skip stop:', this.name, 'state can not be used');
                return this;
            } // skip!!

            if (this.state.time.name && this.state.time.name !== this.name) {
                this.logger.debug('skip stop: It is used in other sources', this.name, this.state.time.name);
                return this;
            } // skip!!

            this.logger.debug('stop:', this.name);
            this.clearTimer('play');
            this.$el.pause();
            this.setCurrentTime(0);
            this.state.time.playback = undefined;
            this.state.time.name = undefined;
            return this;
        };

        /**
         * audio pause.
         *
         * @memberof HTMLAudio
         * @method
         * @name pause
         * @return {boombox.HTMLAudio}
         */
        HTMLAudio.prototype.pause = function () {
            if (!this.isUse()) {
                this.logger.debug('skip pause:', this.name, 'state can not be used');
                return this;
            } // skip!!

            if (this.state.time.name && this.state.time.name !== this.name) {
                this.logger.debug('skip pause: It is used in other sources', this.name, this.state.time.name);
                return this;
            } // skip!!


            this.logger.debug('pause:', this.name);
            this.clearTimer('play');
            this.$el.pause();
            this.state.time.pause = this.$el.currentTime;
            this.state.time.playback = undefined;
            //this.state.time.name = undefined;

            return this;
        };

        /**
         * audio resume.
         *
         * @memberof HTMLAudio
         * @method
         * @name resume
         * @return {boombox.HTMLAudio}
         */
        HTMLAudio.prototype.resume = function () {
            if (!this.isUse()) {
                this.logger.debug('skip resume:', this.name, 'state can not be used');
                return this;
            } // skip!!

            if (this.state.time.name && this.state.time.name !== this.name) {
                this.logger.debug('skip resume: It is used in other sources', this.name, this.state.time.name);
                return this;
            } // skip!!

            if (this.state.time.pause) {
                this.play(true);
            }
            return this;
        };

        /**
         * audio re-play.
         *
         * @memberof HTMLAudio
         * @method
         * @name replay
         * @return {boombox.HTMLAudio}
         */
        HTMLAudio.prototype.replay = function () {
            if (!this.isUse()) {
                this.logger.debug('skip replay:', this.name, 'state can not be used');
                return this;
            } // skip!!

            this.logger.debug('replay:', this.name);
            this.clearTimer('play');
            this.pause();
            this.setCurrentTime(0);
            this.play();
            return this;
        };


        /**
         * audio change volume.
         *
         * @memberof HTMLAudio
         * @method
         * @name volume
         * @return {boombox.HTMLAudio}
         */
        HTMLAudio.prototype.volume = function (v) {
            this.logger.trace('volume:', this.name, 'volume:', v);
            this.$el.volume = v;
        };

        //////////

        /**
         * Audio.ended イベントの発生に合わせて実行される
         *
         * @memberof HTMLAudio
         * @method
         * @name _onEnded
         * @param {Event} e event
         */
        HTMLAudio.prototype._onEnded = function (e) {
            this.logger.trace('onended fire! name:', this.name);
            this.state.time.playback = undefined;
            this.state.time.name = undefined;

            this.onEnded(e); // fire user ended event!!

            if (this.state.loop === boombox.LOOP_ORIGINAL && typeof this.state.time.pause === 'undefined') {
                this.logger.trace('onended original loop play.', this.name);
                this.play();
            }
        };

        /**
         * Audio.ended イベントハンドラが終了した後に実行される
         *
         * @OVERRIDE ME
         * @memberof HTMLVideo
         * @method
         * @name onEnded
         * @param {Event} e event
         */
        HTMLAudio.prototype.onEnded = none;

        /**
         * Set loop flag
         *
         * @memberof HTMLAudio
         * @method
         * @name setLoop
         * @param {int} loop loop flag (boombox.LOOP_XXX)
         * @return {boombox.HTMLAudio}
         */
        HTMLAudio.prototype.setLoop = function (loop) {
            if (!this.isUse()) { return this; } // skip!!

            this.state.loop = loop;
            if (loop === boombox.LOOP_NOT) {
                this.$el.loop = boombox.LOOP_NOT;

            } else if (loop === boombox.LOOP_ORIGINAL) {
                // pass
            } else if (loop === boombox.LOOP_NATIVE) {
                if (this.isSprite()) {
                    this.logger.warn('audiosprite does not support the native.');
                    return this;
                }
                if (this.$el) {
                    this.$el.loop = loop;
                }
            }

            return this;
        };

        /**
         * Change power on/off
         *
         * @memberof HTMLAudio
         * @method
         * @name power
         * @param {boolean} p power on/off. boombox.(POWER_ON|POWER_OFF)
         * @return {boombox.HTMLAudio}
         */
        HTMLAudio.prototype.power = function (p) {
            this.logger.trace('power:', this.name, 'flag:', p);
            if (p === boombox.POWER_OFF) {
                this.stop(); // force pause
            }
            this.state.power = p;

            return this;
        };

        /**
         * Set audio.currentTime
         *
         * @memberof HTMLAudio
         * @method
         * @name setCurrentTime
         * @param {int} t set value(Audio.currentTime)
         * @return {boombox.HTMLAudio}
         */
        HTMLAudio.prototype.setCurrentTime = function (t) {
            try {
                this.$el.currentTime = t;
            } catch (e) {
                this.logger.error('Set currentTime.', e.message);
            }
            return this;
        };

        //////////

        /**
         * Dispose
         *
         * @memberof HTMLAudio
         * @method
         * @name dispose
         */
        HTMLAudio.prototype.dispose = function () {

            delete this.name;
            delete this.state.time.playback;
            delete this.state.time.pause;
            delete this.state.time.name;
            delete this.state.time;
            delete this.state.loop;
            delete this.state.power;
            delete this.state.loaded;
            delete this.state.error;
            delete this.state;
            this.$el.src = undefined;
            delete this.$el;

            this.clearTimerAll();
            delete this._timer;

            delete this.parent;
            this.sprite.dispose && this.sprite.dispose();
            delete this.sprite;

        };

        return HTMLAudio;
    })();

    //////////////////////////////////
    // HTMLVideo Class

    var HTMLVideo = (function () {
        function HTMLVideo(name, parent) {

            this.logger = new Logger('HTMLVideo');
            this.name = name;
            this._timer = {}; // setTimeout#id

            // sprite store
            this.sprite = undefined;
            if (parent) {
                var sprite_n = getSpriteName(name);

                // change Sprite
                var current = parent.sprite.options[sprite_n.suffix];

                this.parent = parent; // ref
                this.state = this.parent.state; // ref
                this.$el = this.parent.$el; // ref
                //this.onEnded = this.parent.onEnded; // TODO: ref
                this.sprite = new Sprite(undefined, current); // new

            } else {
                this.state = {
                    time: {
                        playback: undefined, // Playback start time (unixtime)
                        pause: undefined // // Seek time paused
                    },
                    loop: boombox.LOOP_NOT, // Loop playback flags
                    power: boombox.POWER_ON, // Power flag
                    loaded: false, // Video file is loaded
                    error: undefined // error state
                };
                this.$el = document.createElement('video');

            }

        }

        ///////

        /**
         * Loading html video
         *
         * @memberof HTMLVideo
         * @name load
         * @method
         * @param {Object} options
         * @param {function} callback
         * @example
         * .load({
         *     src: '', // required
         *     type: '', // optional
         *     media: '', // optional
         *     preload: 'auto', // optional
         *     autoplay: false, // optional
         *     mediagroup: 'boombox', // optional
         *     loop: false, // optional
         *     muted: false, // optional
         *     crossorigin: "anonymous", // optional
         *     controls: false // optional
         *     timeout: 15 * 1000 // optional default) 15s
         * }, function callback() {});
         *
         */
        HTMLVideo.prototype.load = function (options, callback) {
            var self = this;

            var cb = callback || none;

            if (this.parent) { // skip audiosprite children
                cb(null, this);
                return this;
            }

            options = options || {
                //src: '',
                //type: '',
                //media: '',
                preload: 'auto', // auto, metadata, none
                autoplay: false, // no-auto
                //mediagroup: 'boombox',
                loop: false,
                muted: false,
                //crossorigin: "anonymous",
                controls: false
            };
            var timeout = options.timeout || 15 * 1000;
            delete options.timeout;

            if (options.spritemap) { // Sprite ON
                this.sprite = new Sprite(options.spritemap);
                delete options.spritemap;
            }

            for (var k in options) {
                var v = options[k];
                self.logger.trace('HTMLVideoElement attribute:', k, v);
                self.$el[k] = v;
            }

            /// Debug log
            /**
            ["loadstart",
             "progress",
             "suspend",
             "load",
             "abort",
             "error",
             "emptied",
             "stalled",
             "play",
             "pause",
             "loadedmetadata",
             "loadeddata",
             "waiting",
             "playing",
             "canplay",
             "canplaythrough",
             "seeking",
             "seeked",
             "timeupdate",
             "ended",
             "ratechange",
             "durationchange",
             "volumechange"].forEach(function(eventName) {
                 self.$el.addEventListener(eventName, function() {
                     console.log('audio: ' + eventName);
                 }, true);
             });
             */

            var hookEventName = 'canplay';
            var ua_ios = window.navigator.userAgent.match(/(iPhone\sOS)\s([\d_]+)/);
            if (ua_ios && 0 < ua_ios.length) { // IOS Safari
                hookEventName = 'suspend';
            } else if (!!window.navigator.userAgent.match(/(Android)\s+(4)([\d.]+)/)) { // Android 4 basic
                hookEventName = 'loadeddata';
            } else if (!!window.navigator.userAgent.match(/(Android)\s+(2)([\d.]+)/)) { // Android 2 basic
                hookEventName = 'stalled';
            }

            self.logger.trace('hook event name:', hookEventName);

            this.$el.addEventListener(hookEventName, function (e) {
                self.logger.trace('processEvent ' + e.target.id + ' : ' + e.type, 'event');

                self.state.loaded = true;

                self.$el.removeEventListener(hookEventName, e, false);

                return cb(null, self);
            });

            this.$el.addEventListener(
                'ended',
                function (e) {
                    self._onEnded(e);
                },
                false);

            setTimeout(function () {
                if (self.$el && self.$el.readyState !== 4) {
                    self.$el.src = '';
                    cb(new Error('load of html video file has timed out. timeout:' + timeout), self);
                    cb = function () {};
                }
            }, timeout);

            this.$el.load();

            //setInterval(function () { console.error(self.name, 'playback', self.isPlayback(), 'stop:', self.isStop(), 'pause:', self.isPause(), 'power:', self.state.power     ); }, 100);

            return this;


        };

        /**
        HTMLVideo.prototype.addTextTrack = function () {
            this.$el.addTextTrack();
        };
        HTMLVideo.prototype.canPlayType = function () {
            this.$el.canPlayType();
        };
         */

        //////////

        /**
         * Is use.
         *
         * @memberof HTMLVideo
         * @method
         * @name isUse
         * @return {boolean}
         */
        HTMLVideo.prototype.isUse = function () {
            if (this.state.power === boombox.POWER_OFF || boombox.state.power === boombox.POWER_OFF) {
                return false;
            }

            if (!this.state.loaded || typeof this.state.error !== 'undefined') {
                return false;
            }

            return true;
        };

        /**
         * Is playing.
         *
         * @memberof HTMLVideo
         * @method
         * @name isPlayback
         * @return {boolean}
         */
        HTMLVideo.prototype.isPlayback = function () {
            return !!this.state.time.playback;
        };

        /**
         * Is stoped.
         *
         * @memberof HTMLVideo
         * @method
         * @name isStop
         * @return {boolean}
         */
        HTMLVideo.prototype.isStop = function () {
            return !this.state.time.playback;
        };

        /**
         * Is paused.
         *
         * @memberof HTMLVideo
         * @method
         * @name isPause
         * @return {boolean}
         */
        HTMLVideo.prototype.isPause = function () {
            return !!this.state.time.pause;
        };

        /**
         * Loop flag
         *
         * @memberof HTMLVideo
         * @method
         * @name isLoop
         * @return {int}
         */
        HTMLVideo.prototype.isLoop = function () {
            return (0 < this.state.loop);
        };

        /**
         * Loop flag
         *
         * @memberof HTMLVideo
         * @method
         * @name isLoop
         * @return {int}
         */
        HTMLVideo.prototype.isLoop = function () {
            return (0 < this.state.loop);
        };

        HTMLVideo.prototype.isParentSprite = function () {
            return !!(!this.parent && this.sprite && !this.sprite.current);
        };

        HTMLVideo.prototype.isSprite = function () {
            return !!(this.parent && this.sprite && this.sprite.current);
        };


        HTMLVideo.prototype.clearTimerAll = function () {
            for (var k in this._timer) {
                var id = this._timer[k];
                this.clearTimer(k);
            }
        };
        HTMLVideo.prototype.clearTimer = function (name) {
            var id = this._timer[name];
            if (id) {
                this.logger.debug('remove setTimetout:', id);
                clearTimeout(id);
                delete this._timer[name];
            }
        };
        HTMLVideo.prototype.setTimer = function (name, id) {
            if (this._timer[name]) {
                this.logger.warn('Access that is not expected:', name, id);
            }
            this._timer[name] = id;
        };


        //////////

        /**
         * video play.
         *
         * @memberof HTMLVideo
         * @method
         * @name play
         * @return {boombox.HTMLVideo}
         */
        HTMLVideo.prototype.play = function (resume) {
            if (!this.isUse()) {
                this.logger.debug('skip play:', this.name, 'state can not be used');
                return this;
            } // skip!!

            if (this.isPlayback()) {
                this.logger.debug('skip play:', this.name, 'is playing');
                return this;
            }

            var self = this;

            var type = 'play';
            var fn = none;

            this.state.time.playback = Date.now();


            if (resume && this.state.time.pause) {
                // resume
                this.setCurrentTime(this.state.time.pause);

                if (this.isSprite()) {
                    var _pause = this.state.time.pause;
                    fn = function () {
                        var interval = Math.ceil((self.sprite.current.end - _pause) * 1000); // (ms)

                        self.setTimer('play', setTimeout(function () {
                            self.stop();
                            self._onEnded(); // fire onended evnet
                        }, interval));
                    };
                }

                this.state.time.pause = undefined;

                type = 'resume:';

            } else {
                // zero-play
                this.setCurrentTime(0);

                if (this.isSprite()) {
                    var start = this.sprite.current.start;
                    this.setCurrentTime(start);

                    fn = function () {
                        var interval = Math.ceil(self.sprite.current.term * 1000); // (ms)
                        self.setTimer('play', setTimeout(function () {
                            self.stop();
                            self._onEnded(); // fire onended evnet
                        }, interval));
                    };
                }

            }

            this.logger.debug(type, this.name);
            fn();
            this.state.time.name = this.name;
            this.$el.play();

            return this;

        };

        /**
         * video stop.
         *
         * @memberof HTMLVideo
         * @method
         * @name stop
         * @return {boombox.HTMLVideo}
         */
        HTMLVideo.prototype.stop = function () {
            if (!this.state.loaded || typeof this.state.error !== 'undefined') {
                this.logger.debug('skip stop:', this.name, 'state can not be used');
                return this;
            } // skip!!

            if (this.state.time.name && this.state.time.name !== this.name) {
                this.logger.debug('skip stop: It is used in other sources', this.name, this.state.time.name);
                return this;
            } // skip!!

            this.logger.debug('stop:', this.name);
            this.clearTimer('play');
            this.$el.pause();
            this.setCurrentTime(0);
            this.state.time.playback = undefined;
            this.state.time.name = undefined;
            return this;
        };

        /**
         * video pause.
         *
         * @memberof HTMLVideo
         * @method
         * @name pause
         * @return {boombox.HTMLVideo}
         */
        HTMLVideo.prototype.pause = function () {
            if (!this.isUse()) {
                this.logger.debug('skip pause:', this.name, 'state can not be used');
                return this;
            } // skip!!

            if (this.state.time.name && this.state.time.name !== this.name) {
                this.logger.debug('skip pause: It is used in other sources', this.name, this.state.time.name);
                return this;
            } // skip!!

            this.logger.debug('pause:', this.name);
            this.clearTimer('play');
            this.$el.pause();
            this.state.time.pause = this.$el.currentTime;
            this.state.time.playback = undefined;
            //this.state.time.name = undefined;

            return this;
        };

        /**
         * video resume.
         *
         * @memberof HTMLVideo
         * @method
         * @name resume
         * @return {boombox.HTMLVideo}
         */
        HTMLVideo.prototype.resume = function () {
            if (!this.isUse()) {
                this.logger.debug('skip resume:', this.name, 'state can not be used');
                return this;
            } // skip!!

            if (this.state.time.name && this.state.time.name !== this.name) {
                this.logger.debug('skip resume: It is used in other sources', this.name, this.state.time.name);
                return this;
            } // skip!!

            if (this.state.time.pause) {
                this.play(true);
            }
            return this;
        };

        /**
         * video re-play.
         *
         * @memberof HTMLVideo
         * @method
         * @name replay
         * @return {boombox.HTMLVideo}
         */
        HTMLVideo.prototype.replay = function () {
            if (!this.isUse()) {
                this.logger.debug('skip replay:', this.name, 'state can not be used');
                return this;
            } // skip!!

            this.logger.debug('replay:', this.name);
            this.clearTimer('play');
            this.pause();
            this.setCurrentTime(0);
            this.play();
            return this;
        };

        /**
         * audio change volume.
         *
         * @memberof HTMLVideo
         * @method
         * @name volume
         * @return {boombox.HTMLVideo}
         */
        HTMLVideo.prototype.volume = function (v) {
            this.logger.trace('volume:', this.name, 'volume:', v);
            this.$el.volume = v;
        };

        //////////

        /**
         * Video.ended イベントの発生に合わせて実行される
         *
         * @memberof HTMLVideo
         * @method
         * @name _onEnded
         * @param {Event} e event
         */
        HTMLVideo.prototype._onEnded = function (e) {
            this.logger.trace('onended fire! name:', this.name);
            this.state.time.playback = undefined;
            this.state.time.name = undefined;

            this.onEnded(e); // fire user ended event!!

            if (this.state.loop === boombox.LOOP_ORIGINAL && typeof this.state.time.pause === 'undefined') {
                this.logger.trace('onended loop play. name:', this.name);
                this.play();
            }
        };

        /**
         * Video.ended イベントハンドラが終了した後に実行される
         *
         * @OVERRIDE ME
         * @memberof HTMLVideo
         * @method
         * @name onEnded
         * @param {Event} e event
         */
        HTMLVideo.prototype.onEnded = none;

        /**
         * Set loop flag
         *
         * @memberof HTMLVideo
         * @method
         * @name setLoop
         * @param {int} loop loop flag (boombox.LOOP_XXX)
         * @return {boombox.HTMLVideo}
         */
        HTMLVideo.prototype.setLoop = function (loop) {
            if (!this.isUse()) { return this; } // skip!!

            this.state.loop = loop;
            if (loop === boombox.LOOP_NOT) {
                this.$el.loop = boombox.LOOP_NOT;

            } else if (loop === boombox.LOOP_ORIGINAL) {
                // pass
            } else if (loop === boombox.LOOP_NATIVE) {
                if (this.isSprite()) {
                    this.logger.warn('audiosprite does not support the native.');
                    return this;
                }
                if (this.$el) {
                    this.$el.loop = loop;
                }
            }
            return this;
        };

        /**
         * Change power on/off
         *
         * @memberof HTMLVideo
         * @method
         * @name power
         * @param {boolean} p power on/off. boombox.(POWER_ON|POWER_OFF)
         * @return {boombox.HTMLVideo}
         */
        HTMLVideo.prototype.power = function (p) {
            this.logger.trace('power:', this.name, 'flag:', p);
            if (p === boombox.POWER_OFF) {
                this.stop(); // force pause
            }
            this.state.power = p;
            return this;
        };

        /**
         * Set video.currentTime
         *
         * @memberof HTMLVideo
         * @method
         * @name setCurrentTime
         * @param {int} t set value(Video.currentTime)
         * @return {boombox.HTMLVideo}
         */
        HTMLVideo.prototype.setCurrentTime = function (t) {
            try {
                this.$el.currentTime = t;
            } catch (e) {
                this.logger.error('Set currentTime.', e.message);
            }
            return this;
        };

        //////////

        /**
         * Dispose
         *
         * @memberof HTMLVideo
         * @method
         * @name dispose
         */
        HTMLVideo.prototype.dispose = function () {

            delete this.name;
            delete this.state.time.playback;
            delete this.state.time.pause;
            delete this.state.time.name;
            delete this.state.time;
            delete this.state.loop;
            delete this.state.power;
            delete this.state.loaded;
            delete this.state.error;
            delete this.state;
            this.$el.src = undefined;
            delete this.$el;

            this.clearTimerAll();
            delete this._timer;

            delete this.parent;
            this.sprite.dispose && this.sprite.dispose();
            delete this.sprite;

        };

        return HTMLVideo;
    })();

    //////////////////////////////////
    // WebAudio Class

    var WebAudio = (function () {
        function WebAudio(name, parent) {
            this.logger = new Logger('WebAudio');

            /**
             * Audio name
             *
             * @memberof WebAudio
             * @name name
             * @type {String}
             */
            this.name = name;


            this._timer = {};


            this.sprite = undefined;


            /**
             * AudioBuffer in use
             *
             * @memberof WebAudio
             * @name buffer
             * @type {AudioBuffer}
             */
            this.buffer = undefined;

            /**
             * AudioBufferSourceNode in use
             *
             * @memberof WebAudio
             * @name source
             * @type {AudioBufferSourceNode}
             */
            this.source = undefined;




            /**
             * WebAudioContext in use
             *   shortcut: boombox.WEB_AUDIO_CONTEXT
             *
             * @memberof WebAudio
             * @name ctx
             * @type {AudioContext}
             */
            this.ctx = boombox.WEB_AUDIO_CONTEXT;

            this.gainNode = this.ctx.createGain();


            /**
             * State of Audio
             *
             * @memberof WebAudio
             * @name state
             * @type {Object}
             */
            this.state = {
                time: {
                    playback: undefined, // Playback start time (unixtime)
                    pause: undefined, // Seek time paused
                    progress: 0 // Sound progress time
                },
                loop: boombox.LOOP_NOT, // Loop playback flags
                power: boombox.POWER_ON, // power flag
                loaded: false, // Audio file is loaded
                error: undefined // error state
            };

            if (parent) {
                var sprite_n = getSpriteName(name);


                this.parent = parent; // ref
                //this.state = this.parent.state; // ref
                this.state.loaded = this.parent.state.loaded; // not ref copy
                this.state.error = this.parent.state.error; // not ref copy


                //this.$el = this.parent.$el; // ref
                //this.onEnded = this.parent.onEnded; // TODO: ref

                // change Sprite
                var current = parent.sprite.options[sprite_n.suffix];
                this.sprite = new Sprite(undefined, current); // new
            }
        }

        //////

        /**
         * Loading web audio
         *
         * @memberof WebAudio
         * @name load
         * @method
         * @param {Object} options
         * @param {function} callback
         * @example
         * .load({
         *     src: 'http://example.com/audio.m4a',
         *     timeout: 15 * 1000
         * }, function callback() {});
         *
         */
        WebAudio.prototype.load = function (options, callback) {
            var self = this;
            options = options || {};

            var cb = callback || none;

            if (this.parent) {
                //this.buffer = this.parent.buffer; // ref
                cb(null, this);
                return this;
            }

            if (options.spritemap) { // Sprite ON
                this.sprite = new Sprite(options.spritemap);
                delete options.spritemap;
            }


            var http = new XMLHttpRequest();
            http.onload = function (e) {
                if (e.target.status.toString().charAt(0) === '2') {
                    self.ctx.decodeAudioData(
                        http.response,
                        function (buffer) {
                            if (!buffer) {
                                self.logger.error('error decode file data: ', options.url);
                                return cb(new Error('error decode file data'), self);
                            }

                            self.buffer = buffer;

                            self.state.loaded = true;

                            /////
                            // audiosprite propagation
                            if (self.isParentSprite()) {
                                for (var k in boombox.pool) {
                                    if (!!~k.indexOf(self.name + SPRITE_SEPARATOR)) {
                                        boombox.pool[k].buffer = buffer; // ref buffer
                                        boombox.pool[k].state.loaded = self.state.loaded;  // not ref copy
                                    }
                                }
                            }


                            return cb(null, self);
                        },
                        function () {
                            return cb(new Error('fail to decode file data'), self);
                        }
                    );
                } else {
                    self.logger.error('fail to load resource: ', options.url);
                    return cb(new Error('fail to load resource'), self);
                }
            };

            //http.timeout = 1;
            var timeout = options.timeout || 15 * 1000;
            setTimeout(function () {
                if (http.readyState !== 4) {
                    http.abort();
                    cb(new Error('load of web audio file has timed out. timeout:' + timeout), self);
                    cb = none;
                }
            }, timeout);


            http.open('GET', options.src, true);

            http.responseType = 'arraybuffer';

            //setInterval(function () {console.error(self.name, 'playback', self.isPlayback(), 'stop:', self.isStop(), 'pause:', self.isPause(), 'power:', self.state.power   ); }, 100);
            http.send();

            return this;
        };

        //////////

        /**
         * Is use.
         *
         * @memberof WebAudio
         * @method
         * @name isUse
         * @return {boolean}
         */
        WebAudio.prototype.isUse = function () {
            if (this.state.power === boombox.POWER_OFF || boombox.state.power === boombox.POWER_OFF) {
                return false;
            }

            if (!this.state.loaded || typeof this.state.error !== 'undefined') {
                return false;
            }

            return true;
        };

        /**
         * Is playing.
         *
         * @memberof WebAudio
         * @method
         * @name isPlayback
         * @return {boolean}
         */
        WebAudio.prototype.isPlayback = function () {
            return !!this.source && !!this.state.time.playback && !this.state.time.pause && (this.source.playbackState === 1 || this.source.playbackState === 2);
        };

        /**
         * Is stoped.
         *
         * @memberof WebAudio
         * @method
         * @name isStop
         * @return {boolean}
         */
        WebAudio.prototype.isStop = function () {
            return !this.source;
        };

        /**
         * Is paused.
         *
         * @memberof WebAudio
         * @method
         * @name isPause
         * @return {boolean}
         */
        WebAudio.prototype.isPause = function () {
            return !!this.state.time.pause;
        };

        /**
         * Loop flag
         *
         * @memberof WebAudio
         * @method
         * @name isLoop
         * @return {int}
         */
        WebAudio.prototype.isLoop = function () {
            return (0 < this.state.loop);
        };

        WebAudio.prototype.isParentSprite = function () {
            return !!(!this.parent && this.sprite && !this.sprite.current);
        };


        WebAudio.prototype.isSprite = function () {
            return !!(this.parent && this.sprite && this.sprite.current);
        };


        WebAudio.prototype.clearTimerAll = function () {
            for (var k in this._timer) {
                var id = this._timer[k];
                this.clearTimer(k);
            }
        };
        WebAudio.prototype.clearTimer = function (name) {
            var id = this._timer[name];
            if (id) {
                this.logger.debug('remove setTimetout:', id);
                clearTimeout(id);
                delete this._timer[name];
            }
        };
        WebAudio.prototype.setTimer = function (name, id) {
            if (this._timer[name]) {
                this.logger.warn('Access that is not expected:', name, id);
            }
            this._timer[name] = id;
        };


        //////////

        /**
         * audio play.
         *
         * @memberof WebAudio
         * @method
         * @name play
         * @return {boombox.WebAudio}
         */
        WebAudio.prototype.play = function (resume) {
            var self = this;

            if (!this.isUse()) {
                this.logger.debug('skip play:', this.name, 'state can not be used');
                return this;
            } // skip!!

            if (this.isPlayback()) {
                this.logger.debug('skip play:', this.name, 'is playing');
                return this;
            }

            if (!resume) {
                this.sourceDispose();
            }

            this.source = this.ctx.createBufferSource();

            this.source.onended = function (e) {
                self._onEnded(e);
            };

            if (this.state.loop === boombox.LOOP_NATIVE) {
                this.source.loop = this.state.loop;
            }

            this.source.buffer = this.buffer;

            this.source.connect(this.gainNode);
            this.gainNode.connect(this.ctx.destination);

            var type = 'play';
            var fn = none;
            var start;

            this.state.time.playback = Date.now(); // Playback start time (ms)

            if (resume && this.state.time.pause) {
                // resume
                start = this.state.time.pause / 1000; // Start position (sec)
                //this.logger.trace('start:', start);
                //this.logger.warn('interval:', interval);

                if (this.isSprite()) {
                    var pause_sec = this.state.time.pause / 1000; // (sec)
                    start = this.sprite.current.start + pause_sec; // Start position (sec)
                    var interval = Math.ceil((self.sprite.current.term - pause_sec) * 1000); // (ms)
                    fn = function () {
                        self.setTimer('play', setTimeout(function () {
                            self.stop();
                            self._onEnded(); // fire onended evnet
                        }, interval));

                    };
                }


                this.state.time.pause = undefined;

            } else { // zero

                if (this.isSprite()) {
                    start = this.sprite.current.start;

                    fn = function () {
                        var interval = Math.ceil(self.sprite.current.term * 1000);

                        self.setTimer('play', setTimeout(function () {
                            self.stop();
                            self._onEnded(); // fire onended evnet
                        }, interval));
                    };

                }


            }

            this.logger.debug(type, this.name, 'offset:', start);

            fn();

            if (this.source.start) {
                this.logger.debug('use source.start()', this.name);
                this.source.start(0, start);
            } else {
                if (this.isSprite()) { // iOS 6 Safari support
                    this.logger.debug('use source.noteGrainOn()', this.name);
                    this.source.noteGrainOn(0, start, self.sprite.current.term);
                } else {
                    this.logger.debug('use source.noteOn()', this.name);
                    this.source.noteOn(0, start);
                }
            }

            return this;
        };

        /**
         * audio stop.
         *
         * @memberof WebAudio
         * @method
         * @name stop
         * @return {boombox.WebAudio}
         */
        WebAudio.prototype.stop = function () {

            if (!this.state.loaded || typeof this.state.error !== 'undefined') {
                this.logger.debug('skip stop:', this.name, 'state can not be used');
                return this;
            } // skip!!

            this.logger.debug('stop:', this.name);

            this.clearTimer('play');

            if (this.source) {
                if (this.source.stop) {
                    this.logger.debug('use source.stop()', this.name);
                    this.source.stop(0);
                } else {
                    this.logger.debug('use source.noteOff()', this.name);
                    this.source.noteOff(0);
                }
            }

            this.sourceDispose();

            return this;
        };

        /**
         * audio pause.
         *
         * @memberof WebAudio
         * @method
         * @name pause
         * @return {boombox.WebAudio}
         */
        WebAudio.prototype.pause = function () {
            if (!this.isUse()) {
                this.logger.debug('skip pause:', this.name, 'state can not be used');
                return this;
            } // skip!!

            if (!this.source) {
                this.logger.debug('skip pause, Not playing.');
                return this;
            }
            if (this.state.time.pause) {
                this.logger.debug('skip pause, It is already paused.');
                return this;
            }

            var now = Date.now();
            var offset = now - this.state.time.playback;
            this.state.time.pause = this.state.time.progress + offset; // Pause time(ms)
            this.state.time.progress += offset;
            this.logger.trace('state.time.pause:', this.state.time.pause, 'now:', now, 'state.time.playback', this.state.time.playback);

            this.logger.debug('pause:', this.name);
            this.clearTimer('play');

            this.source.noteOff(0);

            return this;
        };

        /**
         * audio resume.
         *
         * @memberof WebAudio
         * @method
         * @name resume
         * @return {boombox.WebAudio}
         */
        WebAudio.prototype.resume = function () {
            if (!this.isUse()) {
                this.logger.debug('skip resume:', this.name, 'state can not be used');
                return this;
            } // skip!!

            if (this.state.time.pause) {
                this.play(true);
            }
            return this;
        };

        /**
         * audio re-play.
         *
         * @memberof WebAudio
         * @method
         * @name replay
         * @return {boombox.WebAudio}
         */
        WebAudio.prototype.replay = function () {
            if (!this.isUse()) {
                this.logger.debug('skip replay:', this.name, 'state can not be used');
                return this;
            } // skip!!

            this.logger.debug('replay:', this.name);
            this.clearTimer('play');

            this.sourceDispose();
            this.play();
            return this;
        };

        /**
         * audio change volume.
         *
         * @memberof WebAudio
         * @method
         * @name volume
         * @return {boombox.WebAudio}
         */
        WebAudio.prototype.volume = function (v) {
            this.logger.trace('volume:', this.name, 'volume:', v);
            this.gainNode.gain.value = v;
        };

        //////////

        /**
         * AudioBufferSourceNode.onended イベントの発生に合わせて実行される
         *
         * @memberof WebAudio
         * @method
         * @name _onEnded
         * @param {Event} e event
         */
        WebAudio.prototype._onEnded = function (e) {
            this.logger.trace('onended fire!', this.name);

            var now = Date.now();
            // skip if sounds is not ended
            if (this.source && Math.abs(((now - this.state.time.playback + this.state.time.progress) / 1000) - this.source.buffer.duration) >= 0.01) {
                this.logger.debug('skip if sounds is not ended', this.name);
                return;
            }

            this.state.time.playback = undefined;

            this.onEnded(e); // fire user ended event!!

            if (this.state.loop && typeof this.state.time.pause === 'undefined') {
                this.logger.trace('onended loop play.');
                this.play();
            } else {
                this.sourceDispose();
            }
        };

        /**
         * AudioBufferSourceNode.ended イベントハンドラが終了した後に実行される
         *
         * @OVERRIDE ME
         * @memberof HTMLVideo
         * @method
         * @name onEnded
         * @param {Event} e event
         */
        WebAudio.prototype.onEnded = none;


        //////////

        /**
         * Set loop flag
         *
         * @memberof WebAudio
         * @method
         * @name setLoop
         * @param {int} loop loop flag (boombox.LOOP_XXX)
         * @return {boombox.WebAudio}
         */
        WebAudio.prototype.setLoop = function (loop) {
            if (!this.isUse()) { return this; } // skip!!

            this.state.loop = loop;
            if (loop === boombox.LOOP_NOT) {
                if (this.source) {
                    this.source.loop = boombox.LOOP_NOT;
                }

            } else if (loop === boombox.LOOP_ORIGINAL) {
                this.logger.warn('Please use the loop native.'); // pass
            } else if (loop === boombox.LOOP_NATIVE) {
                if (this.source) {
                    this.source.loop = loop;
                }
            }
            return this;

        };

        /**
         * Change power on/off
         *
         * @memberof WebAudio
         * @method
         * @name power
         * @param {boolean} p power on/off. boombox.(POWER_ON|POWER_OFF)
         * @return {boombox.WebAudio}
         */
        WebAudio.prototype.power = function (p) {
            this.logger.trace('power:', this.name, 'flag:', p);

            if (p === boombox.POWER_OFF) {
                this.stop(); // force pause
            }
            this.state.power = p;
            return this;
        };


        //////////

        /**
         * Dispose AudioBufferSourceNode
         *
         * @memberof WebAudio
         * @method
         * @name sourceDispose
         */
        WebAudio.prototype.sourceDispose = function () {
            this.logger.trace('source dispose', this.name);
            this.source && this.source.disconnect();
            this.source = undefined;
            this.state.time.playback = undefined;
            this.state.time.pause = undefined;
            this.state.time.progress = 0;
        };

        /**
         * Dispose
         *
         * @memberof WebAudio
         * @method
         * @name dispose
         */
        WebAudio.prototype.dispose = function () {
            this.logger.trace('WebAudio dispose', this.name);

            delete this.buffer;

            //delete this.state.time.playback;
            //delete this.state.time.pause;
            //delete this.source;

            this.sourceDispose();
            delete this.source;
            this.clearTimerAll();
            delete this._timer;

            delete this.state.time;
            delete this.state.loop;
            delete this.state.power;
            delete this.state.loaded;
            delete this.state.error;
            delete this.state;

            this.parent = null;
            delete this.parent;

            this.sprite.dispose && this.sprite.dispose();
            delete this.sprite;

            delete this.name;
            this.gainNode && this.gainNode.disconnect && delete this.gainNode;
            this.ctx = null;

        };


        return WebAudio;
    })();

    var Sprite = (function () {
        function Sprite(options, current) {
            this.logger = new Logger('Sprite   ');
            this.current = current; // target sprite
            this.options = options;
            if (!current) { // parent
                for (var k in this.options) {
                    this.options[k].term = this.options[k].end - this.options[k].start;
                }
            }
        }

        //////////

        /**
         * Dispose
         */
        Sprite.prototype.dispose = function () {
            this.options = null;
            delete this.options;
            delete this.current;
        };

        return Sprite;
    })();




    // Building
    boombox.HTMLAudio = HTMLAudio;
    boombox.HTMLVideo = HTMLVideo;
    boombox.WebAudio = WebAudio;

    if (isRequire) {
        define([], function () {
            return boombox;
        });
    } else {
        w.boombox = boombox;
    }

})(window);
