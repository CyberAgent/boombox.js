(function(global) {
    onload = function() {
        // Display Browser Infomation
        var info = document.getElementById('info');
        var infodata = [
            'useragent:' + window.navigator.userAgent,
            'webaudio:' + !!(window.webkitAudioContext || window.AudioContext),
            'audio:' +  !!window.Audio,
            'video:' +  !!document.createElement('video')
        ];

        for (var i = 0; i < infodata.length; i++) {
            var el = document.createElement("div");
            var str = document.createTextNode(infodata[i]);
            el.appendChild(str);
            info.appendChild(el);
        }
    };

    global.assert = global.chai.assert;
    global.expect = global.chai.expect;

    // Mocha
    global.mocha.setup({
        ui: 'bdd',
        timeout: 3 * 10 * 1000 // 30s
    });

    var suite = function () {
        describe('boombox', function(){
            before(function () {
                // DOM
                $("#w").children().each(function (idx, el) {
                    $(el).remove();
                });
                // sound
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
                $("#w").append($('<button onclick="boombox.get(\'' + bgm[0] + '\').' + 'volume(0);">volume 0</button>'));
                $("#w").append($('<button onclick="boombox.get(\'' + bgm[0] + '\').' + 'volume(1);">volume 1</button>'));

                $("#w").append($('<button onclick="boombox.remove(\'' + bgm[0] + '\')">remove</button>'));
                $("#w").append($('<button onclick="boombox.dispose()">dispose</button>'));
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
                            path: bgm[1]
                        },
                        {
                            media: 'audio/ogg',
                            path: bgm[2]
                        }
                    ]
                };
                boombox.load(bgm[0], options, function (err, htmlaudio) {
                    $("#info").append(htmlaudio.$el);
                    expect(err).not.be.ok;
                    done();
                });
            });

            ////////////////////
            // Open your browser, please try to test manually.
            ////////////////////

            //

        });
    };


    //global.mocha.suite.suites = []; // clear
    suite();

    var runner = global.mocha.run();

    runner.globals([
        '_zid' // Backbone.history
    ]);


    // index.js
    var bgm = ["bgm", "./media/sound.m4a", "./media/sound.ogg"];


})(this);
