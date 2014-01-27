(function(global) {
    var require = global.require;

    // Configure RequireJS
    require.config({
        "baseUrl": "../",
        "urlArgs": "v=" + Date.now(),
        "paths": {
            "underscore": "http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min",
            "zepto": "http://cdnjs.cloudflare.com/ajax/libs/zepto/1.1.2/zepto.min",
            "mocha": "./node_modules/mocha/mocha",
            "chai": "./node_modules/chai/chai",
            "boombox": "./boombox",
            "spec": './spec'
        },
        "shim": {
            "zepto": {
                "exports": "$"
            },
            "underscore": {
                "exports": "_"
            }
        },
        "config": {
        }
    });

    // Require libraries
    require(['require', 'chai', 'mocha', 'underscore', 'zepto'], function(require, chai, mocha, _, $){
        // Chai
        global.assert = chai.assert;
        global.expect = chai.expect;

        // Mocha
        global.mocha.setup({
            ui: 'bdd',
            timeout: 3 * 10 * 1000 // 30s
        });

        var spec = global.spec;
        spec.rerun = function rerun() {
            if (!spec.TestCaseName) {
                return;
            }
            //var suite = require(['spec/' + el.getAttribute("data-name")]);
            // Require base tests before starting
            require(['spec/' + spec.TestCaseName], function(suite){
                // Start runner
                global.mocha.suite.suites = []; // clear
                suite();
                var runner = global.mocha.run();
                runner.globals([
                        '_zid' // Backbone.history
                ]);
            });
        };

    });
})(this);
