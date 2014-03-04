/**
 * @name single.js<spec>
 * @author Kei Funagayama <funagayama_kei@cyberagent.co.jp>
 * copyright (c) Cyberagent Inc.
 * @overview TestCase
 */

define(['boombox'], function(boombox) {

    if (!window.boombox) {
        window.boombox = boombox;
    }

    var bgm = ["bgm", "./media/sound.m4a", "./media/sound.ogg"];
    var _ = window._;

    return function() {
        describe('boombox#single', function(){
            before(function () {
                // DOM
                $("#w").children().each(function (idx, el) {
                    $(el).remove();
                });
                _.each(['play', 'stop', 'pause', 'resume', 'replay', 'loop', 'power'], function (type) {
                    if (type === 'loop') {
                        $("#w").append('<br>');
                        $("#w").append($('<button onclick="boombox.get(\'' + bgm[0] + '\').' + 'setLoop(2); $(\'#loop\').attr(\'value\', \'native\')">' + 'loop on(native)' + '</button>'));
                        $("#w").append($('<button onclick="boombox.get(\'' + bgm[0] + '\').' + 'setLoop(1); $(\'#loop\').attr(\'value\', \'original\')">' + 'loop on(original)' + '</button>'));
                        $("#w").append($('<button onclick="boombox.get(\'' + bgm[0] + '\').' + 'setLoop(0); $(\'#loop\').attr(\'value\', \'off\')">' + 'loop off' + '</button>'));
                        $("#w").append($('<input id="loop" type=text disable value="off">'));
                        return;
                    }
                    if (type === 'power') {
                        $("#w").append($('<button onclick="boombox.power(boombox.POWER_ON)">Power ON</button>'));
                        $("#w").append($('<button onclick="boombox.power(boombox.POWER_OFF)">Power OFF</button>'));
                        return;
                    }

                    $("#w").append($('<button onclick="boombox.get(\'' + bgm[0] + '\').' + type + '()">' + type + '</button>'));

                });
                $("#w").append($('<input id="bgmrange" type="range" min="0" max="1" step="0.1" onchange="boombox.get(\'' + bgm[0] + '\').volume($(this).val())"></button>'));
            });

            it('setup()', function() {
                boombox.setup({
                    loglevel: 1
                });
                $("#info").append('<hr /State of boombox.js<br />');
                $("#info").append('[boombox] webaudio  :' + boombox.isWebAudio() + '<br />');
                $("#info").append('[boombox] audio     :' + boombox.isHTMLAudio() + '<br />');
                $("#info").append('[boombox] video     :' + boombox.isHTMLVideo() + '<br />');
            });

            it('load()', function(done) {
                var options = {
                    src: [
                        {
                            media: 'audio/mp4',
                            path: bgm[1]
                        },
                        {
                            media: 'audio/ogg',
                            path: bgm[2]
                        }

                    ]
                };
                boombox.load(bgm[0], options, function (err, htmlaudio) {
                    expect(err).not.be.ok;
                    done();
                });
            });

            /**
            it('play()', function(done) {
                console.log("play");
                boombox.get(bgm[0]).play();
                setTimeout(function () { done(); }, 3 * 1000);
            });

            it('pause()', function(done) {
                console.log("pause");
                boombox.get(bgm[0]).pause();
                setTimeout(function () { done(); }, 3 * 1000);
            });
            it('resume()', function(done) {
                console.log("resume");
                boombox.get(bgm[0]).resume();
                setTimeout(function () { done(); }, 3 * 1000);
            });
            it('stop()', function(done) {
                console.log("stop");
                boombox.get(bgm[0]).stop();
                setTimeout(function () { done(); }, 3 * 1000);
            });
            it('replay()', function(done) {
                console.log("replay");
                boombox.get(bgm[0]).replay();
                setTimeout(function () {
                    boombox.get(bgm[0]).stop();
                    done();
                }, 3 * 1000);
            });
             */

            ////////////////////
            // Open your browser, please try to test manually.
            ////////////////////

            //

        });
    };

});
