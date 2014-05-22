/**
 * @name misc.js<spec>
 * @author Masaki Sueda <sueda_masaki@cyberagent.co.jp>
 * copyright (c) Cyberagent Inc.
 * @overview TestCase
 */

define(['boombox'], function(boombox) {

    if (!window.boombox) {
        window.boombox = boombox;
    }

    var bgm1 = ['bgm1', './media/sound.m4a', './media/sound.ogg'],
        bgm2 = ['bgm2', './media/short.wav'];

    var _ = window._;
    var expect = window.expect;
    var describe = window.describe;
    var before = window.before;
    var it = window.it;

    var bgm1, bgm2;

    return function() {

        describe('boombox#misc', function(){
            before(function () {
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
                var bgm1_options = {
                    src: [
                        {
                            media: 'audio/mp4',
                            path: bgm1[1]
                        },
                        {
                            media: 'audio/ogg',
                            path: bgm1[2]
                        }
                    ]
                };
                var bgm2_options = {
                    src: [
                        {
                            media: 'audio/wav',
                            path: bgm2[1]
                        }

                    ]
                };

                boombox.load(bgm1[0], bgm1_options, function (err, audio) {
                    bgm1 = audio;
                    expect(err).not.be.ok;
                    boombox.load(bgm2[0], bgm2_options, function (err, audio) {
                        bgm2 = audio;
                        expect(err).not.be.ok;
                        done();
                    });
                });

            });

            it('isDisposed()', function (done) {
                boombox.remove('bgm1');
                expect(bgm1.isDisposed()).eq(true);
                bgm2.onEnded = function () {
                    boombox.remove('bgm2');
                    done();
                };
                bgm2.play();
            });

            ////////////////////
            // Open your browser, please try to test manually.
            ////////////////////

        });
    };

});
