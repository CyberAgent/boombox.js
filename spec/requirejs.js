(function(global) {
    onload = function() {
        global.spec = {};

        // Display Browser Infomation
        var info = document.getElementById('info');
        var infodata = [
            '[browser] useragent :' + window.navigator.userAgent,
            '[browser] webaudio  :' + !!window.webkitAudioContext,
            '[browser] audio     :' + !!window.Audio,
            '[browser] video     :' + !!document.createElement('video')
        ];

        for (var i = 0; i < infodata.length; i++) {
            var el = document.createElement("div");
            var str = document.createTextNode(infodata[i]);
            el.appendChild(str);
            info.appendChild(el);
        }

        var spec = global.spec;
        spec.run = function run(name) {
            var script = document.createElement("script");
            spec.now = Date.now();
            script.src = "http://cdnjs.cloudflare.com/ajax/libs/require.js/2.1.10/require.min.js?v=" + spec.now;
            script.setAttribute("data-main", "./requirejs-config.js?v=" + spec.now);
            document.head.appendChild(script);

            if (!name) {
                console.warn("test skip!!");
                return;
            }
            spec.TestCaseName = name;

            var intervalId = setInterval(function() {
                if (spec.rerun) {
                    document.getElementById('mocha').innerHTML = '';
                    spec.rerun();
                    clearInterval(intervalId);
                }
            }, 100);
        };

        spec.parseQuery = function parseQuery(qs){
            var ret = {};
            var querystr = qs.replace('?', '').split('&');
            for (var i = 0; i < querystr.length; i++) {
                var pair = querystr[i];
                var i = pair.indexOf('=')
                , key = pair.slice(0, i)
                , val = pair.slice(++i);
                ret[key] = decodeURIComponent(val);
            }
            return ret;
        };

        var query = spec.parseQuery(window.location.search || '');
        query['name'] && spec.run(query['name']);
    };

})(this);
