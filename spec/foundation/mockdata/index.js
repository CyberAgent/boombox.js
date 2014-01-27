(function () {

    var list = [];
    for (var i = 0; i <= 10; i++) {
        var one = {
            title: '見出し ' + i,
            details: []
        };

        for (var j = 0; j <= 10; j++) {
                one.details.push({
                code: ['accordion', i, j].join('-'),
                title: ['小見出し', i, j].join(' ')
            });
        }
        list.push(one);
    }

    return {
        "/accordions": {
            get: list
        }
    };
}());
