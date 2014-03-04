/**
 * @name htmlvideo.js<spec>
 * @author Kei Funagayama <funagayama_kei@cyberagent.co.jp>
 * copyright (c) Cyberagent Inc.
 * @overview TestCase
 */

define(['boombox'], function(boombox) {

    if (!window.boombox) {
        window.boombox = boombox;
    }

    var bgm = ["bgm", "./media/sound.m4a", "./media/sound.ogg"];
    var bgm1 = ["bgm1", "./media/sound.wav"];

    var _ = window._;

    return function() {
        describe('boombox', function(){
            before(function () {
                // DOM
                $("#w").children().each(function (idx, el) {
                    $(el).remove();
                });

                // bgm
                $("#w").append('<h2>bgm</h2>');
                _.each(['play', 'stop', 'pause', 'resume', 'replay', 'loop', 'power'], function (type) {
                    if (type === 'loop') {
                        $("#w").append('<br>');
                        $("#w").append($('<button onclick="boombox.get(\'' + bgm[0] + '\').' + 'setLoop(2); $(\'#loop1\').attr(\'value\', \'native\')">' + 'loop on(native)' + '</button>'));
                        $("#w").append($('<button onclick="boombox.get(\'' + bgm[0] + '\').' + 'setLoop(1); $(\'#loop1\').attr(\'value\', \'original\')">' + 'loop on(original)' + '</button>'));
                        $("#w").append($('<button onclick="boombox.get(\'' + bgm[0] + '\').' + 'setLoop(0); $(\'#loop1\').attr(\'value\', \'off\')">' + 'loop off' + '</button>'));
                        $("#w").append($('<input id="loop1" type=text disable value="off">'));
                        return;
                    }
                    if (type === 'power') {
                        $("#w").append($('<button onclick="boombox.get(\'' + bgm[0] + '\').' + 'power(boombox.POWER_ON);">' + 'Power ON' + '</button>'));
                        $("#w").append($('<button onclick="boombox.get(\'' + bgm[0] + '\').' + 'power(boombox.POWER_OFF);">' + 'Power OFF' + '</button>'));
                        return;
                    }
                    $("#w").append($('<button onclick="boombox.get(\'' + bgm[0] + '\').' + type + '()">' + type + '</button>'));
                });
                $("#w").append($('<input id="bgmrange" type="range" min="0" max="1" step="0.1" onchange="boombox.get(\'' + bgm[0] + '\').volume($(this).val())"></button>'));

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
                $("#w").append($('<input id="bgmrange" type="range" min="0" max="1" step="0.1" onchange="boombox.get(\'' + bgm1[0] + '\').volume($(this).val())"></button>'));
                $("#w").append($('<hr />'));

                $("#w").append($('<button onclick="boombox.power(boombox.POWER_ON)">ALL Power ON</button>'));
                $("#w").append($('<button onclick="boombox.power(boombox.POWER_OFF)">ALL Power OFF</button>'));


            });

            it('setup()', function() {
                boombox.setup({
                    webaudio: {
                        use: false // force override
                    },
                    htmlaudio: {
                        //use: true // force override
                    },
                    htmlvideo: {
                        //use: true // force override
                    },
                    loglevel: 1
                });
                $("#info").append('<hr /State of boombox.js<br />');
                $("#info").append('[boombox] webaudio  :' + boombox.isWebAudio() + '<br />');
                $("#info").append('[boombox] audio     :' + boombox.isHTMLAudio() + '<br />');
                $("#info").append('[boombox] video     :' + boombox.isHTMLVideo() + '<br />');
            });

            it('load() bgm', function(done) {
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
                    ],
                    //controls: true
                };

                boombox.load(bgm[0], options, function (err, htmlaudio) {
                    expect(htmlaudio).be.ok;
                    expect(err).not.be.ok;
                    $("#w").append(htmlaudio.$el);
                    done();
                });

            });
            it('load() bgm1', function(done) {
                var options = {
                    src: [
                        {
                            media: 'audio/wav',
                            path: bgm1[1]
                        }
                    ],
                    //controls: true
                };

                boombox.load(bgm1[0], options, true, function (err, htmlaudio) {
                    expect(htmlaudio).be.ok;
                    expect(err).not.be.ok;
                    $("#w").append(htmlaudio.$el);
                    done();
                });

            });

            ////////////////////
            // Open your browser, please try to test manually.
            ////////////////////

            //

        });
    };

});
