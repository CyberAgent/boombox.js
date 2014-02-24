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
        describe('boombox sprite htmlaudio', function(){
            before(function () {
                // DOM
                $("#w").children().each(function (idx, el) {
                    $(el).remove();
                });
                // sound
                _.each(options.spritemap, function (data, suffix) {
                    var name = bgm[0] + '-' + suffix;
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
                // sound
                _.each(options1.spritemap, function (data, suffix) {
                    var name = bgm1[0] + '-' + suffix;
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
                        use: false // force override
                    },
                    htmlaudio: {
                        //use: true // force override
                    },
                    htmlvideo: {
                        //use: true // force override
                    },
                    loglevel: 1 // trace
                });
            });

            it('load()', function(done) {
                boombox.load(bgm[0], options, function (err, htmlaudio) {
                    $("#info").append(htmlaudio.$el);
                    expect(err).not.be.ok;

                    boombox.load(bgm1[0], options1, function (err1, htmlaudio1) {
                        debugger;
                        $("#info").append(htmlaudio1.$el);
                        expect(err1).not.be.ok;
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


    //global.mocha.suite.suites = []; // clear
    suite();

    var runner = global.mocha.run();

    runner.globals([
        '_zid' // Backbone.history
    ]);


    // index.js
    var bgm = ["bgma", "./media/sprite/a/spritea.m4a"];
    var options = {
        src: [
            {
                media: 'audio/mp4',
                path: bgm[1]
            }
        ],
        "spritemap": {
            "c2a": {
                "start": 0,
                "end": 5.990770975056689,
                "loop": false
            },
            "c3a": {
                "start": 7,
                "end": 12.990770975056689,
                "loop": false
            },
            "c4a": {
                "start": 14,
                "end": 19.99077097505669,
                "loop": false
            },
            "c5a": {
                "start": 21,
                "end": 26.99077097505669,
                "loop": false
            },
            "c6a": {
                "start": 28,
                "end": 33.99077097505669,
                "loop": false
            },
            "c7a": {
                "start": 35,
                "end": 40.99077097505669,
                "loop": false
            }
        }
    };


    var bgm1 = ["bgmb", "./media/sprite/b/spriteb.m4a"];
    var options1 = {
        src: [
            {
                media: 'audio/mp4',
                path: bgm1[1]
            }
        ],

        "spritemap": {
            "c2b": {
                "start": 0,
                "end": 5.990770975056689,
                "loop": false
            },
            "c3b": {
                "start": 7,
                "end": 12.990770975056689,
                "loop": false
            },
            "c4b": {
                "start": 14,
                "end": 19.99077097505669,
                "loop": false
            },
            "c5b": {
                "start": 21,
                "end": 26.99077097505669,
                "loop": false
            },
            "c6b": {
                "start": 28,
                "end": 33.99077097505669,
                "loop": false
            },
            "c7b": {
                "start": 35,
                "end": 40.99077097505669,
                "loop": false
            }
        }
    };

})(this);
