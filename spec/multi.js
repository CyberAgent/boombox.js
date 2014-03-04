/**
 * @name multi.js<spec>
 * @author Kei Funagayama <funagayama_kei@cyberagent.co.jp>
 * copyright (c) Cyberagent Inc.
 * @overview TestCase
 */

define(['boombox'], function(boombox) {

    if (!window.boombox) {
        window.boombox = boombox;
    }

    var sound = ["sound", "./media/sound.m4a"];
    var bgm1 = ["bgm1", "./media/sound.wav"];
    var bgm2 = ["bgm2", "./media/sound.m4a"];

    var _ = window._;

    return function() {
        describe('boombox#multi', function(){
            before(function () {
                // DOM
                $("#w").children().each(function (idx, el) {
                    $(el).remove();
                });
                // sound
                $("#w").append('<h2>sound</h2>');
                _.each(['play', 'stop', 'pause', 'resume', 'replay', 'loop', 'power'], function (type) {
                    if (type === 'loop') {
                        $("#w").append('<br>');
                        $("#w").append($('<button onclick="boombox.get(\'' + sound[0] + '\').' + 'setLoop(2); $(\'#loop1\').attr(\'value\', \'native\')">' + 'loop on(native)' + '</button>'));
                        $("#w").append($('<button onclick="boombox.get(\'' + sound[0] + '\').' + 'setLoop(1); $(\'#loop1\').attr(\'value\', \'original\')">' + 'loop on(original)' + '</button>'));
                        $("#w").append($('<button onclick="boombox.get(\'' + sound[0] + '\').' + 'setLoop(0); $(\'#loop1\').attr(\'value\', \'off\')">' + 'loop off' + '</button>'));
                        $("#w").append($('<input id="loop1" type=text disable value="off">'));
                        return;
                    }
                    if (type === 'power') {
                        $("#w").append($('<button onclick="boombox.get(\'' + sound[0] + '\').' + 'power(boombox.POWER_ON);">' + 'Power ON' + '</button>'));
                        $("#w").append($('<button onclick="boombox.get(\'' + sound[0] + '\').' + 'power(boombox.POWER_OFF);">' + 'Power OFF' + '</button>'));
                        return;
                    }
                    $("#w").append($('<button onclick="boombox.get(\'' + sound[0] + '\').' + type + '()">' + type + '</button>'));
                });
                $("#w").append($('<input id="soundrange" type="range" min="0" max="1" step="0.1" onchange="boombox.get(\'' + sound[0] + '\').volume($(this).val())"></button>'));
                $("#w").append($('<hr />'));

                // bgm1
                $("#w").append('<h2>bgm1</h2>');
                _.each(['play', 'stop', 'pause', 'resume', 'replay', 'loop', 'power'], function (type) {
                    if (type === 'loop') {
                        $("#w").append('<br>');
                        $("#w").append($('<button onclick="boombox.get(\'' + bgm1[0] + '\').' + 'setLoop(2); $(\'#loop2\').attr(\'value\', \'native\')">' + 'loop on(native)' + '</button>'));
                        $("#w").append($('<button onclick="boombox.get(\'' + bgm1[0] + '\').' + 'setLoop(1); $(\'#loop2\').attr(\'value\', \'original\')">' + 'loop on(original)' + '</button>'));
                        $("#w").append($('<button onclick="boombox.get(\'' + bgm1[0] + '\').' + 'setLoop(0); $(\'#loop2\').attr(\'value\', \'off\')">' + 'loop off' + '</button>'));
                        $("#w").append($('<input id="loop2" type=text disable value="off">'));
                        return;
                    }

                    if (type === 'power') {
                        $("#w").append($('<button onclick="boombox.get(\'' + bgm1[0] + '\').' + 'power(boombox.POWER_ON);">' + 'Power ON' + '</button>'));
                        $("#w").append($('<button onclick="boombox.get(\'' + bgm1[0] + '\').' + 'power(boombox.POWER_OFF);">' + 'Power OFF' + '</button>'));
                        return;
                    }

                    $("#w").append($('<button onclick="boombox.get(\'' + bgm1[0] + '\').' + type + '()">' + type + '</button>'));


                });
                $("#w").append($('<input id="bgm1sange" type="range" min="0" max="1" step="0.1" onchange="boombox.get(\'' + bgm1[0] + '\').volume($(this).val())"></button>'));
                $("#w").append($('<hr />'));

                // bgm2
                $("#w").append('<h2>bgm2</h2>');
                _.each(['play', 'stop', 'pause', 'resume', 'replay', 'loop', 'power'], function (type) {
                    if (type === 'loop') {
                        $("#w").append('<br>');
                        $("#w").append($('<button onclick="boombox.get(\'' + bgm2[0] + '\').' + 'setLoop(2); $(\'#loop3\').attr(\'value\', \'native\')">' + 'loop on(native)' + '</button>'));
                        $("#w").append($('<button onclick="boombox.get(\'' + bgm2[0] + '\').' + 'setLoop(1); $(\'#loop3\').attr(\'value\', \'original\')">' + 'loop on(original)' + '</button>'));
                        $("#w").append($('<button onclick="boombox.get(\'' + bgm2[0] + '\').' + 'setLoop(0); $(\'#loop3\').attr(\'value\', \'off\')">' + 'loop off' + '</button>'));
                        $("#w").append($('<input id="loop3" type=text disable value="off">'));
                        return;
                    }

                    if (type === 'power') {
                        $("#w").append($('<button onclick="boombox.get(\'' + bgm2[0] + '\').' + 'power(boombox.POWER_ON);">' + 'Power ON' + '</button>'));
                        $("#w").append($('<button onclick="boombox.get(\'' + bgm2[0] + '\').' + 'power(boombox.POWER_OFF);">' + 'Power OFF' + '</button>'));
                        return;
                    }

                    $("#w").append($('<button onclick="boombox.get(\'' + bgm2[0] + '\').' + type + '()">' + type + '</button>'));


                });
                $("#w").append($('<input id="bgm2range" type="range" min="0" max="1" step="0.1" onchange="boombox.get(\'' + bgm2[0] + '\').volume($(this).val())"></button>'));
                $("#w").append($('<hr />'));

                $("#w").append($('<button onclick="boombox.power(boombox.POWER_ON)">ALL Power ON</button>'));
                $("#w").append($('<button onclick="boombox.power(boombox.POWER_OFF)">ALL Power OFF</button>'));

                $("#w").append($('<input id="allsoundrange" type="range" min="0" max="1" step="0.1" onchange="boombox.volume($(this).val())"></button>'));

            });

            it('setup()', function() {
                boombox.setup({
                    webaudio: {
                        //use: false // force override
                    },
                    htmlaudio: {
                        //use: true // force override
                    },
                    htmlvideo: {
                        //use: true // force override
                    }
                });
                $("#info").append('<hr /State of boombox.js<br />');
                $("#info").append('[boombox] webaudio  :' + boombox.isWebAudio() + '<br />');
                $("#info").append('[boombox] audio     :' + boombox.isHTMLAudio() + '<br />');
                $("#info").append('[boombox] video     :' + boombox.isHTMLVideo() + '<br />');
            });

            it('load()', function(done) {
                var bgm1_options = {
                    src: [
                        {
                            media: 'audio/mp4',
                            path: bgm1[1]
                        }
                    ]
                };
                var sound_options = {
                    src: [
                        {
                            media: 'audio/mp4',
                            path: sound[1]
                        }
                    ]
                };
                var bgm2_options = {
                    src: [
                        {
                            media: 'audio/mp4',
                            path: bgm2[1]
                        }
                    ]
                };
                boombox.load(bgm1[0], bgm1_options, function (err, htmlaudio) {
                    expect(err).not.be.ok;
                    boombox.load(sound[0], sound_options, function (err, htmlaudio) {
                        expect(err).not.be.ok;
                        boombox.load(bgm2[0], bgm2_options, function (err, htmlaudio) {
                            expect(err).not.be.ok;
                            done();
                        });
                    });
                });

            });
            /**
            it('play()', function(done) {
                console.log("play");
                boombox.get(bgm[0]).play();
                var interval = 2000;
                boombox.get(sound[0]).play();
                setTimeout(function () {
                    boombox.get(sound[0]).play();
                    setTimeout(function () {
                        boombox.get(sound[0]).play();
                        setTimeout(function () {
                            boombox.get(sound[0]).play();
                            setTimeout(function () {
                                boombox.get(sound[0]).play();
                                done();
                            }, interval);
                        }, interval);
                    }, interval);
                }, interval);
            });
             */
            /**
             it('pause()', function(done) {
             console.log("pause");
                boombox.get(action[0]).pause();
                setTimeout(function () { done(); }, 3 * 1000);
            });
            it('resume()', function(done) {
                console.log("resume");
                boombox.get(action[0]).resume();
                setTimeout(function () { done(); }, 3 * 1000);
            });
            it('stop()', function(done) {
                console.log("stop");
                boombox.get(action[0]).stop();
                setTimeout(function () { done(); }, 3 * 1000);
            });
            it('replay()', function(done) {
                console.log("replay");
                boombox.get(action[0]).replay();
                setTimeout(function () { done(); }, 3 * 1000);
            });
             **/

            ////////////////////
            // Open your browser, please try to test manually.
            ////////////////////

            //
        });
    };

});
