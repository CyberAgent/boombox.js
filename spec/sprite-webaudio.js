(function(global) {
    onload = function() {
        // Display Browser Infomation
        var info = document.getElementById('info');
        var infodata = [
            'useragent:' + window.navigator.userAgent,
            'webaudio:' + !!window.webkitAudioContext,
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
        describe('boombox sprite webaudio', function(){
            before(function () {
                // DOM
                $("#w").children().each(function (idx, el) {
                    $(el).remove();
                });
                // sound
                _.each(options.spritemap, function (data, suffix) {
                    var name = prefix + '-' + suffix;
                    $("#w").append('<h1>' + name + '</h1>');

                    _.each(['play', 'stop', 'pause', 'resume', 'replay', 'loop', 'power'], function (type) {
                        if (type === 'loop') {
                            $("#w").append($('<button onclick="boombox.get(\'' + name + '\').' + 'setLoop(2); $(\'#loop-' + name + '\').attr(\'value\', \'native\')">' + 'loop native' + '</button>'));
                            $("#w").append($('<button onclick="boombox.get(\'' + name + '\').' + 'setLoop(1); $(\'#loop-' + name + '\').attr(\'value\', \'original\')">' + 'loop original' + '</button>'));
                            $("#w").append($('<button onclick="boombox.get(\'' + name + '\').' + 'setLoop(0); $(\'#loop-' + name + '\').attr(\'value\', \'off\')">' + 'loop off' + '</button>'));
                            $("#w").append($('<input id="loop-' + name + '" size="5" type=text disable value="off">'));
                            return;
                        }
                        if (type === 'power') {
                            $("#w").append($('<button onclick="boombox.get(\'' + name + '\').' + 'power(boombox.POWER_ON)">Power ON</button>'));
                            $("#w").append($('<button onclick="boombox.get(\'' + name + '\').' + 'power(boombox.POWER_OFF)">Power OFF</button>'));
                            return;
                        }

                        $("#w").append($('<button onclick="boombox.get(\'' + name + '\').' + type + '()">' + type + '</button>'));
                    });
                    $("#w").append($('<button onclick="boombox.get(\'' + name + '\').' + 'volume(0);">volume 0</button>'));
                    $("#w").append($('<button onclick="boombox.get(\'' + name + '\').' + 'volume(1);">volume 1</button>'));

                    $("#w").append($('<button onclick="boombox.remove(\'' + name + '\')">remove</button>'));

                });

                $("#w").append($('<button onclick="boombox.dispose()">dispose</button>'));
            });

            it('setup()', function() {
                boombox.setup({
                    webaudio: {
                        use: true // force override
                    },
                    htmlaudio: {
                        use: false // force override
                    },
                    htmlvideo: {
                        use: false // force override
                    },
                    loglevel: 1 // trace
                });
            });

            it('load()', function(done) {
                boombox.load(prefix, options, function (err, htmlaudio) {
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
    var prefix = "bgma";

    var options = {
        "spritemap": {
            "c5a": {
                "start": 0,
                "end": 5.990770975056689
            },
            "c6a": {
                "start": 7,
                "end": 12.990770975056689
            },
            "c7a": {
                "start": 14,
                "end": 19.99077097505669
            }
        },
        "src": [
            {
                "media": "audio/mp4",
                "path": "./media/sprite/a/sprite.m4a"
            },
            {
                "media": "audio/ac3",
                "path": "./media/sprite/a/sprite.ac3"
            },
            {
                "media": "audio/mpeg",
                "path": "./media/sprite/a/sprite.mp3"
            },
            {
                media: 'audio/ogg',
                "path": "./media/sprite/a/sprite.ogg"
            }
        ]
    };

})(this);
