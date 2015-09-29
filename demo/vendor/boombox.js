/**
 * Browser sound library which blended HTMLVideo and HTMLAudio and WebAudio
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2015 CyberAgent, Inc.
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
     * trace: 1
     * debug: 2
     * info:  3
     * warn:  4
     * error: 5
     *
     */
    var LOG_LEVEL = 3; // default: info

    var Logger = (function () {
        var ArrayProto = Array.prototype;
        var slice = ArrayProto.slice;

        function Logger(prefix) {
            this.prefix = prefix || LOGGER_DEFAULT_SEPARATOR;
            this.prefix = '[' + this.prefix + ']';
        }

        /**
         * Log output (trace)
         * @memberof Logger
         * @name trace
         */
        Logger.prototype.trace = function () {
            if (LOG_LEVEL <= 1) {
                if (!w.console) {
                } else if (w.console.trace) {
                    w.console.trace('[TRACE]', this.prefix, slice.call(arguments).join(' '));
                } else if (w.console.debug) {
                    w.console.debug('[TRACE]', this.prefix, slice.call(arguments).join(' '));
                } else {
                    w.console.log('[TRACE]', this.prefix, slice.call(arguments).join(' '));
                }
            }
        };

        /**
         * Log output (debug)
         * @memberof Logger
         * @name debug
         */
        Logger.prototype.debug = function () {
            if (LOG_LEVEL <= 2) {
                if (!w.console) {
                } else if (w.console.debug) {
                    w.console.debug('[DEBUG]', this.prefix, slice.call(arguments).join(' '));
                } else {
                    w.console.log('[DEBUG]', this.prefix, slice.call(arguments).join(' '));
                }
            }
        };

        /**
         * Log output (info)
         * @memberof Logger
         * @name info
         */
        Logger.prototype.info = function () {
            if (LOG_LEVEL <= 3) {
                w.console && w.console.info('[INFO]', this.prefix, slice.call(arguments).join(' '));
            }
        };

        /**
         * Log output (warn)
         * @memberof Logger
         * @name warn
         */
        Logger.prototype.warn = function () {
            if (LOG_LEVEL <= 4) {
                w.console && w.console.warn('[WARN]', this.prefix, slice.call(arguments).join(' '));
            }
        };

        /**
         * Log output (error)
         * @memberof Logger
         * @name error
         */
        Logger.prototype.error = function () {
            if (LOG_LEVEL <= 5) {
                w.console && w.console.error('[ERROR]', this.prefix, slice.call(arguments).join(' '));
            }
        };

        return Logger;

    })();


    //////////////////////////////////
    // Boombox Class

    var Boombox = (function () {
        function Boombox() {

            /**
             * Version
             * @memberof Boombox
             * @name VERSION
             */
            this.VERSION = '1.0.9';


            /**
             * Loop off
             *
             * @memberof Boombox
             * @name LOOP_NOT
             * @constant
             * @type {Interger}
             */
            this.LOOP_NOT = 0;


            /**
             * orignal loop
             *
             * @memberof Boombox
             * @name LOOP_ORIGINAL
             * @constant
             * @type {Interger}
             */
            this.LOOP_ORIGINAL = 1;


            /**
             * Native loop
             *
             * @memberof Boombox
             * @name LOOP_NATIVE
             * @constant
             * @type {Interger}
             */
            this.LOOP_NATIVE = 2;

            /**
             * Turn off the power.
             *
             * @memberof Boombox
             * @name POWER_OFF
             * @constant
             * @type {Boolean}
             */
            this.POWER_OFF = false;

            /**
             * Turn on the power.
             *
             * @memberof Boombox
             * @name POWER_ON
             * @constant
             * @type {Boolean}
             */
            this.POWER_ON = true;

            /**
             * It does not support the media type.
             *
             * @memberof Boombox
             * @name ERROR_MEDIA_TYPE
             * @constant
             * @type {Interger}
             */
            this.ERROR_MEDIA_TYPE = 0;

            /**
             * Hit the filter
             *
             * @memberof Boombox
             * @name ERROR_HIT_FILTER
             * @constant
             * @type {Interger}
             */
            this.ERROR_HIT_FILTER = 1;

            /**
             * Threshold to determine whether sound source is finished or not
             *
             * @memberof Boombox
             * @name THRESHOLD
             * @type {Interger}
             */
            this.THRESHOLD = 0.2;

            /**
             * flag setup
             * @memberof Boombox
             * @name setuped
             * @type {Boolean}
             */
            this.setuped = false;

            /**
             * AudioContext
             * @memberof Boombox
             * @name AudioContext
             * @type {AudioContext}
             */
            this.AudioContext = w.AudioContext || w.webkitAudioContext;

            /**
             * Environmental support information
             *
             * @memberof Boombox
             * @name support
             * @type {Object}
             */
            this.support = {
                mimes: [],
                webaudio: {
                    use: !!this.AudioContext
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
                 * @memberof Boombox
                 * @name WEB_AUDIO_CONTEXT
                 * @type {AudioContext}
                 */
                this.WEB_AUDIO_CONTEXT = new this.AudioContext();
                if (!this.WEB_AUDIO_CONTEXT.createGain) {
                    this.WEB_AUDIO_CONTEXT.createGain = this.WEB_AUDIO_CONTEXT.createGainNode;
                }
            }

            // Check HTML Audio support.
            try {
                /**
                 * Test local HTMLAudio
                 * @memberof Boombox
                 * @name _audio
                 * @type {HTMLAudioElement}
                 */
                if (new w.Audio().canPlayType) {
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
                 * @memberof Boombox
                 * @name _video
                 * @type {HTMLVideoElement}
                 */
                if (document.createElement('video').canPlayType) {
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
             * @memberof Boombox
             * @name pool
             */
            this.pool = {};

            /**
             * Audio instance of waiting
             *
             * @memberof Boombox
             * @name waits
             */
            this.waits = [];

            /**
             * Visibility of browser
             *
             * @memberof Boombox
             * @name visibility
             */
            this.visibility = {
                hidden: undefined,
                visibilityChange: undefined
            };

            /**
             * State of boombox
             *
             * @memberof Boombox
             * @name state
             * @type {Object}
             */
            this.state = {
                power: this.POWER_ON
            };

            /**
             * Filtering function
             *
             * @memberof Boombox
             * @name filter
             * @type {Object}
             */
            this.filter = {};

        }

        //// prototype

        /**
         * The availability of the WebLAudio
         *
         * @memberof Boombox
         * @name isWebAudio
         * @return {Boolean}
         */
        Boombox.prototype.isWebAudio = function () {
            return this.support.webaudio.use;
        };

        /**
         * The availability of the HTMLAudio
         *
         * @memberof Boombox
         * @name isHTMLAudio
         * @return {Boolean}
         */
        Boombox.prototype.isHTMLAudio = function () {
            return this.support.htmlaudio.use;
        };

        /**
         * The availability of the HTMLVideo
         *
         * @memberof Boombox
         * @name isHTMLVideo
         * @return {Boolean}
         */
        Boombox.prototype.isHTMLVideo = function () {
            return this.support.htmlvideo.use;
        };

        /**
         * boombox to manage, Audio is playing
         *
         * @memberof Boombox
         * @name isPlayback
         * @return {Boolean}
         */
        Boombox.prototype.isPlayback = function () {
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
         * @memberof Boombox
         * @name setup
         * @param {Object} options
         * @return {Boombox}
         * @example
         * var options = {
         *     webaudio: {use: Boolean},
         *     htmlaudio: {use: Boolean},
         *     htmlvideo: {use: Boolean},
         *     loglevel: Number, ) trace:1, debug:2, info:3, warn:4, error:5
         * }
         *
         */
        Boombox.prototype.setup = function setup(options) {
            var self = this;

            options = options || {};

            if (typeof options.threshold !== 'undefined') {
                this.THRESHOLD = options.threshold;
            }

            if (typeof options.loglevel !== 'undefined') {
                LOG_LEVEL = options.loglevel;
            }

            this.logger = new Logger('Boombox '); // log

            if (this.setuped) {
                this.logger.warn('"setup" already, are running.');
                return this;
            }

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

            // scan browser
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
         * @memberof Boombox
         * @name get
         * @param {String} name audio name
         * @return {WebAudio|HTMLAudio|HTMLVideo}
         */
        Boombox.prototype.get = function (name) {
            return this.pool[name];
        };

        /**
         * Loading audio
         *
         * @memberof Boombox
         * @name load
         * @param {String} name audio name
         * @param {Object} options Audio options
         * @param {Boolean} useHTMLVideo forced use HTMLVideo
         * @param {Function} callback
         * @return {Boombox}
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
        Boombox.prototype.load = function (name, options, useHTMLVideo, callback) {
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
                } else {
                    return callback && callback(new Error(htmlvideo.state.error), htmlvideo);
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
                } else {
                    return callback && callback(new Error(webaudio.state.error), webaudio);
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
                } else {
                    return callback && callback(new Error(htmlaudio.state.error), htmlaudio);
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
         * @memberof Boombox
         * @name remove
         * @param {String} name
         * @return {Boombox}
         */
        Boombox.prototype.remove = function (name) {
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
         * @memberof Boombox
         * @name setPool
         * @param {String} name
         * @param {AudioContext|HTMLAudioElement|HTMLVideoElement} obj Browser audio instance
         * @param {WebAudio|HTMLAudio|HTMLVideo} Obj Boombox audio class
         * @return {Boombox}
         */
        Boombox.prototype.setPool = function (name, obj, Obj) {
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
         * @memberof Boombox
         * @name runfilter
         * @param {WebAudio|HTMLAudio|HTMLVideo} audio Boombox audio instance
         * @param {Object} options
         * @return {Boolean}
         */
        Boombox.prototype.runfilter = function (audio, options) {
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
            }

            return false;

        };

        /**
         * check support media type
         *
         * @memberof Boombox
         * @name useMediaType
         * @param {Array} src audio file data
         * @return {Object|undefined}
         */
        Boombox.prototype.useMediaType = function (src) {
            for (var i = 0; i < src.length; i++) {
                var t = src[i];
                if (new w.Audio().canPlayType(t.media)) {
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
         * @memberof Boombox
         * @name pause
         * @return {boombox}
         */
        Boombox.prototype.pause = function () {
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
         * @memberof Boombox
         * @name resume
         * @return {Boombox}
         */
        Boombox.prototype.resume = function () {
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
         * @memberof Boombox
         * @name power
         * @param {Boolean} p power on/off. boombox.(POWER_ON|POWER_OFF)
         * @return {Boombox}
         */
        Boombox.prototype.power = function (p) {
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
         * @memberof Boombox
         * @method
         * @name volume
         * @param {Interger} v volume
         * @return {Boombox}
         */
        Boombox.prototype.volume = function (v) {
            var self = this;
            this.logger.trace('volume:', this.name, 'volume:', v);

            for (var name in this.pool) {
                var audio = this.pool[name];
                audio.volume(v);
            }

            return this;
        };

        /**
         * Firing in the occurrence of events VisibilityChange
         *
         * @memberof Boombox
         * @name onVisibilityChange
         * @param {Event} e event
         */
        Boombox.prototype.onVisibilityChange = function (e) {
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
         * @memberof Boombox
         * @name onFocus
         * @param {Event} e event
         */
        Boombox.prototype.onFocus = function (e) {
            this.logger.trace('onFocus');
            this.resume();
        };

        /**
         * Firing in the occurrence of events window.onblur
         *
         * @memberof Boombox
         * @name onBlur
         * @param {Event} e event
         */
        Boombox.prototype.onBlur = function (e) {
            this.logger.trace('onBlur');
            this.pause();
        };

        /**
         * Firing in the occurrence of events window.onpageshow
         *
         * @memberof Boombox
         * @name onPageShow
         * @param {Event} e event
         */
        Boombox.prototype.onPageShow = function (e) {
            this.logger.trace('onPageShow');
            this.resume();
        };

        /**
         * Firing in the occurrence of events window.onpagehide
         *
         * @memberof Boombox
         * @name onPageHide
         * @param {Event} e event
         */
        Boombox.prototype.onPageHide = function (e) {
            this.logger.trace('onPageHide');
            this.pause();
        };

        /**
         * Scan browser differences
         *
         * @memberof Boombox
         * @name _browserControl
         * @return {Boombox}
         */
        Boombox.prototype._browserControl = function () {
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

        /**
         * Adding filtering
         *
         * @memberof Boombox
         * @name addFilter
         * @param {String} filter name
         * @param {Function} filter function
         * @return {Boombox}
         */
        Boombox.prototype.addFilter = function (name, fn) {
            this.filter[name] = fn;
            return this;
        };

        /**
         * dispose
         *
         * @memberof Boombox
         * @name dispose
         */
        Boombox.prototype.dispose = function () {
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
            delete this.filter;
        };

        return Boombox;
    })();


    //////////////////////////////////
    // New!!!!
    var boombox = new Boombox();


    //////////////////////////////////
    // HTMLAudio Class

    var HTMLAudio = (function () {
        function HTMLAudio(name, parent) {
            /**
             * logger
             * @memberof HTMLAudio
             * @name logger
             */
            this.logger = new Logger('HTMLAudio');

            /**
             * unique name
             * @memberof HTMLAudio
             * @name name
             */
            this.name = name;

            /**
             * SetTimeout#id pool running
             * @memberof HTMLAudio
             * @name _timer
             */
            this._timer = {}; // setTimeout#id

            /**
             * AudioSprite option data
             * @memberof HTMLAudio
             * @name sprite
             */
            this.sprite = undefined;
            if (parent) {
                var sprite_n = getSpriteName(name);

                // change Sprite
                var current = parent.sprite.options[sprite_n.suffix];

                /**
                 * Reference of the parent instance HTMLAudio
                 * @memberof HTMLAudio
                 * @name parent
                 */
                this.parent = parent; // ref

                /**
                 * Reference of the parent state instance HTMLAudio
                 * @memberof HTMLAudio
                 * @name state
                 */
                this.state = this.parent.state; // ref
                /**
                 * Reference of the parent HTMLAudioElement instance HTMLAudio
                 * @memberof HTMLAudio
                 * @name state
                 */
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
         * @param {Function} callback
         * @return {HTMLAudio}
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

            var self = this;

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
             "volumechange"].forEach(function (eventName) {
                 self.$el.addEventListener(eventName, function () {
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


            this.$el.addEventListener(hookEventName, function _canplay(e) {
                self.logger.trace('processEvent ' + e.target.id + ' : ' + e.type, 'event');

                self.state.loaded = true;

                self.$el.removeEventListener(hookEventName, _canplay, false);

                return cb(null, self);
            });

            this.$el.addEventListener(
                'ended',
                function (e) {
                    self._onEnded(e);
                },
                false);

            // communication time-out
            setTimeout(function () {
                if (self.$el && self.$el.readyState !== 4) {
                    self.$el.src = '';
                    cb(new Error('load of html audio file has timed out. timeout:' + timeout), self);
                    cb = function () {};
                }
            }, timeout);

            this.$el.load();

//            setInterval(function () {
//                console.error(self.name,
//                              'playback:', self.isPlayback(),
//                              'stop:', self.isStop(),
//                              'pause:', self.isPause(),
//                              'power:', self.state.power
//                             );
//            }, 100);

            return this;

        };

        //HTMLAudio.prototype.addTextTrack = function () { /**...*/ };
        //HTMLAudio.prototype.canPlayType = function () { /**...*/ };

        //////////

        /**
         * Is use.
         *
         * @memberof HTMLAudio
         * @method
         * @name isUse
         * @return {Boolean}
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
         * @return {Boolean}
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
         * @return {Boolean}
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
         * @return {Interger}
         */
        HTMLAudio.prototype.isLoop = function () {
            return (0 < this.state.loop);
        };

        /**
         * Is sprite of the parent
         *
         * @memberof HTMLAudio
         * @method
         * @name isParentSprite
         * @return {Boolean}
         */
        HTMLAudio.prototype.isParentSprite = function () {
            return !!(!this.parent && this.sprite && !this.sprite.current);
        };

        /**
         * Is sprite
         *
         * @memberof HTMLAudio
         * @method
         * @name isSprite
         * @return {Boolean}
         */
        HTMLAudio.prototype.isSprite = function () {
            return !!(this.parent && this.sprite && this.sprite.current);
        };


        /**
         * Clear all the setTimeout
         *
         * @memberof HTMLAudio
         * @method
         * @name clearTimerAll
         * @return {HTMLAudio}
         */
        HTMLAudio.prototype.clearTimerAll = function () {
            for (var k in this._timer) {
                var id = this._timer[k];
                this.clearTimer(k);
            }
            return this;
        };

        /**
         * Clear specified setTimeout
         *
         * @memberof HTMLAudio
         * @method
         * @name clearTimer
         * @param {String} name
         * @return {Interger}
         */
        HTMLAudio.prototype.clearTimer = function (name) {
            var id = this._timer[name];
            if (id) {
                this.logger.debug('remove setTimetout:', id);
                clearTimeout(id);
                delete this._timer[name];
            }

            return id;
        };

        /**
         * Save the specified setTimeout
         *
         * @memberof HTMLAudio
         * @method
         * @name setTimer
         * @param {String} name
         * @param {Interger} id setTimeout#id
         * @return {Interger}
         */
        HTMLAudio.prototype.setTimer = function (name, id) {
            if (this._timer[name]) {
                this.logger.warn('Access that is not expected:', name, id);
            }
            this._timer[name] = id;

            return this._timer[name];
        };

        //////////

        /**
         * audio play.
         *
         * @memberof HTMLAudio
         * @method
         * @name play
         * @param {Boolean} resume resume flag
         * @return {HTMLAudio}
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
         * @return {HTMLAudio}
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
         * @return {HTMLAudio}
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
         * @return {HTMLAudio}
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
         * @return {HTMLAudio}
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
         * @param {Interger} v volume
         * @return {HTMLAudio}
         */
        HTMLAudio.prototype.volume = function (v) {
            this.logger.trace('volume:', this.name, 'volume:', v);
            this.$el.volume = Math.max(0, Math.min(1, v));
        };

        //////////

        /**
         * Audio.ended events
         *
         * @memberof HTMLAudio
         * @method
         * @name _onEnded
         * @param {Event} e event
         */
        HTMLAudio.prototype._onEnded = function (e) {
            if (this.isDisposed()) { // check dispose
                return;
            }
            this.logger.trace('onended fire! name:', this.name);
            this.state.time.playback = undefined;
            this.state.time.name = undefined;

            this.onEnded(e); // fire user ended event!!

            if (this.isDisposed()) { // check dispose
                return;
            }
            if (this.state.loop === boombox.LOOP_ORIGINAL && typeof this.state.time.pause === 'undefined') {
                this.logger.trace('onended original loop play.', this.name);
                this.play();
            }
        };

        /**
         * Override Audio.ended events
         *
         * @memberof HTMLAudio
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
         * @param {Interger} loop loop flag (Boombox.LOOP_XXX)
         * @return {HTMLAudio}
         */
        HTMLAudio.prototype.setLoop = function (loop) {
            if (!this.isUse()) { return this; } // skip!!

            this.state.loop = loop;
            if (loop === boombox.LOOP_NOT) {
                this.$el.loop = boombox.LOOP_NOT;

            //} else if (loop === boombox.LOOP_ORIGINAL) {
            } else if (loop === boombox.LOOP_NATIVE) {
                if (this.isSprite()) {
                    this.logger.warn('audiosprite does not support the native. please use the original loop.');
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
         * @param {Boolean} p power on/off. Boombox.(POWER_ON|POWER_OFF)
         * @return {HTMLAudio}
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
         * @param {Interger} t set value(HTMLAudioElement.currentTime)
         * @return {HTMLAudio}
         */
        HTMLAudio.prototype.setCurrentTime = function (t) {
            try {
                this.$el.currentTime = t;
            } catch (e) {
                this.logger.error('Set currentTime.', e.message);
            }
            return this;
        };

        /**
         * Check disposed
         *
         * @memberof HTMLAudio
         * @method
         * @name isDisposed
         */
        HTMLAudio.prototype.isDisposed = function () {
            return WebAudio.prototype.isDisposed.apply(this, arguments);
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
            if (this.sprite && this.sprite.dispose) {
                this.sprite.dispose();
            }
            delete this.sprite;

        };

        return HTMLAudio;
    })();

    //////////////////////////////////
    // HTMLVideo Class

    var HTMLVideo = (function () {
        function HTMLVideo(name, parent) {

            /**
             * logger
             * @memberof HTMLVideo
             * @name logger
             */
            this.logger = new Logger('HTMLVideo');

            /**
             * unique name
             * @memberof HTMLVideo
             * @name name
             */
            this.name = name;

            /**
             * SetTimeout#id pool running
             * @memberof HTMLVideo
             * @name _timer
             */
            this._timer = {}; // setTimeout#id

            /**
             * AudioSprite option data
             * @memberof HTMLVideo
             * @name sprite
             */
            this.sprite = undefined;
            if (parent) {
                var sprite_n = getSpriteName(name);

                // change Sprite
                var current = parent.sprite.options[sprite_n.suffix];

                /**
                 * Reference of the parent instance HTMLVideo
                 * @memberof HTMLVideo
                 * @name parent
                 */
                this.parent = parent; // ref

                /**
                 * Reference of the parent state instance HTMLVideo
                 * @memberof HTMLVideo
                 * @name state
                 */
                this.state = this.parent.state; // ref

                /**
                 * Reference of the parent HTMLVideoElement instance HTMLVideo
                 * @memberof HTMLAudio
                 * @name state
                 */
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
         * @param {Function} callback
         * @return {HTMLVideo}
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
             "volumechange"].forEach(function (eventName) {
                 self.$el.addEventListener(eventName, function () {
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

            this.$el.addEventListener(hookEventName, function _canplay(e) {
                self.logger.trace('processEvent ' + e.target.id + ' : ' + e.type, 'event');

                self.state.loaded = true;

                self.$el.removeEventListener(hookEventName, _canplay, false);

                return cb(null, self);
            });

            this.$el.addEventListener(
                'ended',
                function (e) {
                    self._onEnded(e);
                },
                false);

            // communication time-out
            setTimeout(function () {
                if (self.$el && self.$el.readyState !== 4) {
                    self.$el.src = '';
                    cb(new Error('load of html video file has timed out. timeout:' + timeout), self);
                    cb = function () {};
                }
            }, timeout);

            this.$el.load();

//            setInterval(function () {
//                console.error(self.name,
//                              'playback:', self.isPlayback(),
//                              'stop:', self.isStop(),
//                              'pause:', self.isPause(),
//                              'power:', self.state.power
//                             );
//            }, 100);

            return this;

        };

        //HTMLVideo.prototype.addTextTrack = function () { /**...*/ };
        //HTMLVideo.prototype.canPlayType = function () { /**...*/ };

        //////////

        /**
         * Is use. (apply HTMLAudio)
         *
         * @memberof HTMLVideo
         * @method
         * @name isUse
         * @return {Boolean}
         */
        HTMLVideo.prototype.isUse = function () {
            return boombox.HTMLAudio.prototype.isUse.apply(this, arguments);
        };

        /**
         * Is playing. (apply HTMLAudio)
         *
         * @memberof HTMLVideo
         * @method
         * @name isPlayback
         * @return {Boolean}
         */
        HTMLVideo.prototype.isPlayback = function () {
            return boombox.HTMLAudio.prototype.isPlayback.apply(this, arguments);
        };

        /**
         * Is stoped.
         *
         * @memberof HTMLVideo (apply HTMLAudio)
         * @method
         * @name isStop
         * @return {Boolean}
         */
        HTMLVideo.prototype.isStop = function () {
            return boombox.HTMLAudio.prototype.isStop.apply(this, arguments);
        };

        /**
         * Is paused.
         *
         * @memberof HTMLVideo (apply HTMLAudio)
         * @method
         * @name isPause
         * @return {Boolean}
         */
        HTMLVideo.prototype.isPause = function () {
            return boombox.HTMLAudio.prototype.isPause.apply(this, arguments);
        };

        /**
         * Loop flag (apply HTMLAudio)
         *
         * @memberof HTMLVideo
         * @method
         * @name isLoop
         * @return {Interger}
         */
        HTMLVideo.prototype.isLoop = function () {
            return boombox.HTMLAudio.prototype.isLoop.apply(this, arguments);
        };

        /**
         * Is sprite of the parent (apply HTMLAudio)
         *
         * @memberof HTMLVideo
         * @method
         * @name isParentSprite
         * @return {Boolean}
         */
        HTMLVideo.prototype.isParentSprite = function () {
            return boombox.HTMLAudio.prototype.isParentSprite.apply(this, arguments);
        };

        /**
         * Is sprite (apply HTMLAudio)
         *
         * @memberof HTMLVideo
         * @method
         * @name isSprite
         * @return {Boolean}
         */
        HTMLVideo.prototype.isSprite = function () {
            return boombox.HTMLAudio.prototype.isSprite.apply(this, arguments);
        };

        /**
         * Clear all the setTimeout (apply HTMLAudio)
         *
         * @memberof HTMLVideo
         * @method
         * @name clearTimerAll
         * @return {HTMLAudio}
         */
        HTMLVideo.prototype.clearTimerAll = function () {
            return boombox.HTMLAudio.prototype.clearTimerAll.apply(this, arguments);
        };

        /**
         * Clear specified setTimeout (apply HTMLAudio)
         *
         * @memberof HTMLVideo
         * @method
         * @name clearTimer
         * @param {String} name
         * @return {Interger}
         */
        HTMLVideo.prototype.clearTimer = function (name) {
            return boombox.HTMLAudio.prototype.clearTimer.apply(this, arguments);
        };

        /**
         * Save the specified setTimeout (apply HTMLAudio)
         *
         * @memberof HTMLVideo
         * @method
         * @name setTimer
         * @param {String} name
         * @param {Interger} id setTimeout#id
         * @return {Interger}
         */
        HTMLVideo.prototype.setTimer = function (name, id) {
            return boombox.HTMLAudio.prototype.setTimer.apply(this, arguments);
        };


        //////////

        /**
         * video play.
         *
         * @memberof HTMLVideo
         * @method
         * @name play
         * @param {Boolean} resume resume flag
         * @return {HTMLVideo}
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
         * video stop. (apply HTMLAudio)
         *
         * @memberof HTMLVideo
         * @method
         * @name stop
         * @return {HTMLVideo}
         */
        HTMLVideo.prototype.stop = function () {
            return boombox.HTMLAudio.prototype.stop.apply(this, arguments);
        };

        /**
         * video pause. (apply HTMLAudio)
         *
         * @memberof HTMLVideo
         * @method
         * @name pause
         * @return {HTMLVideo}
         */
        HTMLVideo.prototype.pause = function () {
            return boombox.HTMLAudio.prototype.pause.apply(this, arguments);
        };

        /**
         * video resume. (apply HTMLAudio)
         *
         * @memberof HTMLVideo
         * @method
         * @name resume
         * @return {HTMLVideo}
         */
        HTMLVideo.prototype.resume = function () {
            return boombox.HTMLAudio.prototype.resume.apply(this, arguments);
        };

        /**
         * video re-play. (apply HTMLAudio)
         *
         * @memberof HTMLVideo
         * @method
         * @name replay
         * @return {HTMLVideo}
         */
        HTMLVideo.prototype.replay = function () {
            return boombox.HTMLAudio.prototype.replay.apply(this, arguments);
        };

        /**
         * audio change volume. (apply HTMLAudio)
         *
         * @memberof HTMLVideo
         * @method
         * @name volume
         * @return {HTMLVideo}
         */
        HTMLVideo.prototype.volume = function (v) {
            return boombox.HTMLAudio.prototype.volume.apply(this, arguments);
        };

        //////////

        /**
         * Video.ended events (apply HTMLAudio)
         *
         * @memberof HTMLVideo
         * @method
         * @name _onEnded
         * @param {Event} e event
         */
        HTMLVideo.prototype._onEnded = function (e) {
            return boombox.HTMLAudio.prototype._onEnded.apply(this, arguments);
        };

        /**
         * Override Video.ended events (apply HTMLAudio)
         *
         * @OVERRIDE ME
         * @memberof HTMLVideo
         * @method
         * @name onEnded
         * @param {Event} e event
         */
        HTMLVideo.prototype.onEnded = none;

        /**
         * Set loop flag (apply HTMLAudio)
         *
         * @memberof HTMLVideo
         * @method
         * @name setLoop
         * @param {Interger} loop loop flag (Boombox.LOOP_XXX)
         * @return {HTMLVideo}
         */
        HTMLVideo.prototype.setLoop = function (loop) {
            return boombox.HTMLAudio.prototype.setLoop.apply(this, arguments);
        };

        /**
         * Change power on/off (apply HTMLAudio)
         *
         * @memberof HTMLVideo
         * @method
         * @name power
         * @param {Boolean} p power on/off. boombox.(POWER_ON|POWER_OFF)
         * @return {HTMLVideo}
         */
        HTMLVideo.prototype.power = function (p) {
            return boombox.HTMLAudio.prototype.power.apply(this, arguments);
        };

        /**
         * Set video.currentTime (apply HTMLAudio)
         *
         * @memberof HTMLVideo
         * @method
         * @name setCurrentTime
         * @param {Interger} t set value(Video.currentTime)
         * @return {HTMLVideo}
         */
        HTMLVideo.prototype.setCurrentTime = function (t) {
            return boombox.HTMLAudio.prototype.setCurrentTime.apply(this, arguments);
        };

        /**
         * Check disposed
         *
         * @memberof HTMLVideo
         * @method
         * @name isDisposed
         */
        HTMLVideo.prototype.isDisposed = function () {
            return boombox.HTMLAudio.prototype.isDisposed.apply(this, arguments);
        };

        //////////

        /**
         * Dispose (apply HTMLAudio)
         *
         * @memberof HTMLVideo
         * @method
         * @name dispose
         */
        HTMLVideo.prototype.dispose = function () {
            return boombox.HTMLAudio.prototype.dispose.apply(this, arguments);
        };

        return HTMLVideo;
    })();

    //////////////////////////////////
    // WebAudio Class

    var WebAudio = (function () {
        function WebAudio(name, parent) {
            /**
             * logger
             * @memberof WebAudio
             * @name logger
             */
            this.logger = new Logger('WebAudio');

            /**
             * Audio name
             *
             * @memberof WebAudio
             * @name name
             * @type {String}
             */
            this.name = name;

            /**
             * SetTimeout#id pool running
             * @memberof WebAudio
             * @name _timer
             */
            this._timer = {};

            /**
             * AudioSprite option data
             * @memberof WebAudio
             * @name sprite
             */
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

            /**
             * WebAudioContext.GainNode instance
             * @memberof WebAudio
             * @name gainNode
             * @type {GainNode}
             */
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
         * @param {Function} callback
         * @return {WebAudio}
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

            for (var k in options) {
                var v = options[k];
                this.logger.trace('WebAudio attribute:', k, v);
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

            // communication time-out
            setTimeout(function () {
                if (http.readyState !== 4) {
                    http.abort();
                    cb(new Error('load of web audio file has timed out. timeout:' + timeout), self);
                    cb = none;
                }
            }, timeout);


            http.open('GET', options.src, true);

            http.responseType = 'arraybuffer';

//            setInterval(function () {
//                console.error(self.name,
//                              'playback', self.isPlayback(),
//                              'stop:', self.isStop(),
//                              'pause:', self.isPause(),
//                              'power:', self.state.power
//                             );
//            }, 100);


            /////////////////////
            /// XHR send!!
            http.send();

            return this;
        };

        //////////

        /**
         * Is use. (apply HTMLAudio)
         *
         * @memberof WebAudio
         * @method
         * @name isUse
         * @return {Boolean}
         */
        WebAudio.prototype.isUse = function () {
            return boombox.HTMLAudio.prototype.isUse.apply(this, arguments);
        };

        /**
         * Is playing. (apply HTMLAudio)
         *
         * @memberof WebAudio
         * @method
         * @name isPlayback
         * @return {Boolean}
         */
        WebAudio.prototype.isPlayback = function () {
            return !!this.source && !!this.state.time.playback && !this.state.time.pause && (this.source.playbackState === 1 || this.source.playbackState === 2);
        };

        /**
         * Is stoped. (apply HTMLAudio)
         *
         * @memberof WebAudio
         * @method
         * @name isStop
         * @return {Boolean}
         */
        WebAudio.prototype.isStop = function () {
            return !this.source;
        };

        /**
         * Is paused. (apply HTMLAudio)
         *
         * @memberof WebAudio
         * @method
         * @name isPause
         * @return {Boolean}
         */
        WebAudio.prototype.isPause = function () {
            return boombox.HTMLAudio.prototype.isPause.apply(this, arguments);
        };

        /**
         * Loop flag (apply HTMLAudio)
         *
         * @memberof WebAudio
         * @method
         * @name isLoop
         * @return {Interger}
         */
        WebAudio.prototype.isLoop = function () {
            return boombox.HTMLAudio.prototype.isLoop.apply(this, arguments);
        };

        /**
         * Is sprite of the parent (apply HTMLAudio)
         *
         * @memberof WebAudio
         * @method
         * @name isParentSprite
         * @return {Boolean}
         */
        WebAudio.prototype.isParentSprite = function () {
            return boombox.HTMLAudio.prototype.isParentSprite.apply(this, arguments);
        };


        /**
         * Is sprite (apply HTMLAudio)
         *
         * @memberof WebAudio
         * @method
         * @name isSprite
         * @return {Boolean}
         */
        WebAudio.prototype.isSprite = function () {
            return boombox.HTMLAudio.prototype.isSprite.apply(this, arguments);
        };

        /**
         * Clear all the setTimeout (apply HTMLAudio)
         *
         * @memberof WebAudio
         * @method
         * @name clearTimerAll
         * @return {WebAudio}
         */
        WebAudio.prototype.clearTimerAll = function () {
            return boombox.HTMLAudio.prototype.clearTimerAll.apply(this, arguments);
        };

        /**
         * Clear specified setTimeout (apply HTMLAudio)
         *
         * @memberof WebAudio
         * @method
         * @name clearTimer
         * @param {String} name
         * @return {Interger}
         */
        WebAudio.prototype.clearTimer = function (name) {
            return boombox.HTMLAudio.prototype.clearTimer.apply(this, arguments);
        };

        /**
         * Save the specified setTimeout (apply HTMLAudio)
         *
         * @memberof WebAudio
         * @method
         * @name setTimer
         * @param {String} name
         * @param {Interger} id setTimeout#id
         * @return {Interger}
         */
        WebAudio.prototype.setTimer = function (name, id) {
            return boombox.HTMLAudio.prototype.setTimer.apply(this, arguments);
        };


        //////////

        /**
         * audio play.
         *
         * @memberof WebAudio
         * @method
         * @name play
         * @return {WebAudio}
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

            if (this.state.loop === boombox.LOOP_NATIVE) {
                this.source.loop = this.state.loop;
            }

            this.source.buffer = this.buffer;

            this.source.connect(this.gainNode);
            this.gainNode.connect(this.ctx.destination);

            var type = 'play';
            var fn = none;
            var start = 0;

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

            var duration = this.buffer.duration - start;
            if (!this.isSprite()) {
                if (this.source.hasOwnProperty('onended')) {
                    this.source.onended = function (e) {
                        self._onEnded(e);
                    };
                } else {
                    var interval = Math.ceil(duration * 1000);
                    this.setTimer('play', setTimeout(function () {
                        self.stop();
                        self._onEnded();
                    }, interval));
                }
            }

            if (this.source.start) {
                this.logger.debug('use source.start()', this.name, start, duration);
                this.source.start(0, start, this.buffer.duration);
            } else {
                if (this.isSprite()) {
                    duration = self.sprite.current.term;
                }
                this.logger.debug('use source.noteGrainOn()', this.name, start, duration);
                this.source.noteGrainOn(0, start, duration);
            }

            return this;
        };

        /**
         * audio stop.
         *
         * @memberof WebAudio
         * @method
         * @name stop
         * @return {WebAudio}
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
                    this.logger.debug('stop: use source.stop()', this.name);
                    this.source.stop(0);
                } else {
                    this.logger.debug('stop: use source.noteOff()', this.name);
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
         * @return {WebAudio}
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

            if (this.source) {
                if (this.source.stop) {
                    this.logger.debug('pause: use source.stop()', this.name);
                    this.source.stop(0);
                } else {
                    this.logger.debug('pause: use source.noteOff()', this.name);
                    this.source.noteOff(0);
                }
            }

            return this;
        };

        /**
         * audio resume.
         *
         * @memberof WebAudio
         * @method
         * @name resume
         * @return {WebAudio}
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
         * @return {WebAudio}
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
         * @return {WebAudio}
         */
        WebAudio.prototype.volume = function (v) {
            this.logger.trace('volume:', this.name, 'volume:', v);
            this.gainNode.gain.value = v;
        };

        //////////

        /**
         * Audio.ended events
         *
         * @memberof WebAudio
         * @method
         * @name _onEnded
         * @param {Event} e event
         */
        WebAudio.prototype._onEnded = function (e) {
            // check dispose
            if (this.isDisposed()) {
                return;
            }

            var self = this;
            var now = Date.now();

            // skip if sounds is not ended
            if (self.source && Math.abs((now - self.state.time.playback + self.state.time.progress) / 1000 - self.source.buffer.duration) >= boombox.THRESHOLD) {
                self.logger.debug('skip if sounds is not ended', self.name);
                return;
            }

            this.logger.trace('onended fire!', this.name);
            this.state.time.playback = undefined;
            this.onEnded(e); // fire user ended event!!

            // check dispose
            if (this.isDisposed()) {
                return;
            }

            if (this.state.loop && typeof this.state.time.pause === 'undefined') {
                this.logger.trace('onended loop play.');
                this.play();
            } else {
                this.sourceDispose();
            }
        };

        /**
         * Override Audio.ended events
         *
         * @memberof WebAudio
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
         * @param {Interger} loop loop flag (boombox.LOOP_XXX)
         * @return {WebAudio}
         */
        WebAudio.prototype.setLoop = function (loop) {
            if (!this.isUse()) { return this; } // skip!!

            this.state.loop = loop;
            if (loop === boombox.LOOP_NOT) {
                if (this.source) {
                    this.source.loop = boombox.LOOP_NOT;
                }

            //} else if (loop === boombox.LOOP_ORIGINAL) {
            } else if (loop === boombox.LOOP_NATIVE) {
                if (this.source) {
                    this.source.loop = loop;
                }
            }
            return this;

        };

        /**
         * Change power on/off (apply HTMLAudio)
         *
         * @memberof WebAudio
         * @method
         * @name power
         * @param {Boolean} p power on/off. boombox.(POWER_ON|POWER_OFF)
         * @return {WebAudio}
         */
        WebAudio.prototype.power = function (p) {
            return boombox.HTMLAudio.prototype.power.apply(this, arguments);
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
         * Check disposed
         * @memberof WebAudio
         * @method
         * @name isDisposed
         */
        WebAudio.prototype.isDisposed = function () {
            this.logger.trace('check dispose flag', !!this.state);
            return !this.state;
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

            if (this.sprite && this.sprite.dispose) {
                this.sprite.dispose();
            }
            delete this.sprite;

            delete this.name;
            this.gainNode && this.gainNode.disconnect && delete this.gainNode;
            this.ctx = null;

        };


        return WebAudio;
    })();

    var Sprite = (function () {
        function Sprite(options, current) {
            /**
             * logger
             * @memberof Sprite
             * @type {Logger}
             * @name logger
             */
            this.logger = new Logger('Sprite   ');
            /**
             * current options
             * @memberof Sprite
             * @type {Object}
             * @name current
             */
            this.current = current; // target sprite
            /**
             * options
             * @memberof Sprite
             * @name options
             * @type {Object}
             */
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
         * @memberof Sprite
         * @method
         * @name dispose
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
