/**
 * @name index.js<spec>
 * @author Kei Funagayama <funagayama_kei@cyberagent.co.jp>
 * copyright (c) Cyberagent Inc.
 * @overview TestCase
 */

define(['boombox'], function(boombox) {

    if (!window.boombox) {
        window.boombox = boombox;
    }

    var bgm = ["bgm", "./media/sound.m4a","./media/sound.ogg"];

    return function() {
        describe('boombox', function(){
            before(function () {
                // DOM
                $("#w").children().each(function (idx, el) {
                    $(el).remove();
                });
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
                    $("#info").append(htmlaudio.$el);
                    expect(err).not.be.ok;
                    done();
                });
            });

            it('dispose()', function() {
                var bgm = boombox.get('bgm');
                boombox.dispose();


                expect(bgm.state).not.be.ok

                expect(boombox.VERSION).not.be.ok
                expect(boombox.setuped).not.be.ok
                expect(boombox.support).not.be.ok
                expect(boombox.WEB_AUDIO_CONTEXT).not.be.ok
                expect(boombox.pool).not.be.ok
                expect(boombox.waits).not.be.ok
                expect(boombox.visibility).not.be.ok
                expect(boombox.state).not.be.ok
                expect(boombox._audio).not.be.ok
                expect(boombox._video).not.be.ok
                expect(boombox.filter).not.be.ok
            });
            //

        });
    };

});
