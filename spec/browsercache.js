/**
 * @name browsercache.js<spec>
 * @author Kei Funagayama <funagayama_kei@cyberagent.co.jp>
 * copyright (c) Cyberagent Inc.
 * @overview TestCase
 */

define(['boombox'], function(boombox) {

    if (!window.boombox) {
        window.boombox = boombox;
    }

    var bgm = ["bgm0", "bgm1", "bgm2", "./media/sound.m4a", "./media/sound.ogg"];
    var _ = window._;

    return function() {
        describe('boombox#browsercache', function(){
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
                    webaudio: {
                        //use: false // force override
                    },
                    htmlaudio: {
                        //use: true // force override
                    },
                    htmlvideo: {
                        //use: true // force override
                    },
                    loglevel: 1
                });
            });

            it('load()', function(done) {
                var options = {
                        src: [
                            {
                                media: 'audio/mp4',
                                path: bgm[3]
                            }
                        ]
                    },
                    options2 = _.clone(options)
                ;
                boombox.load(bgm[0], options, function (err, htmlaudio) {
                    expect(err).not.be.ok;

                    boombox.load(bgm[1], options2, function (err, htmlaudio) {
                        expect(err).not.be.ok;
                        done();
                    });
                });
            });

            ////////////////////
            // Open your browser, please try to test manually.
            ////////////////////

            //

        });
    };

});
