(function (window) {
    var coders = {
        templateCoders: [
            'coders/component/CpCoder',
            'coders/placeholders/plCoder',
            'coders/databind/bdCoder',
            'coders/router/RouterCoder',
            'coders/style/styleCoder'
        ],
        templateDecoders: [
            'coders/component/CpDecoder',
            'coders/placeholders/plDecoder',
            'coders/databind/bdDecoder',
            'coders/router/RouterDecoder',
            'coders/style/styleDecoder'
        ]
    };
    var paths = {
        test: '../../test/prod',
        'templating/Decoder': '../../dist/prod/loader',
        'widget/App': '../../dist/prod/loader',
        'coders/component/CpDecoder': '../../dist/prod/loader',
        'coders/placeholders/plDecoder': '../../dist/prod/loader'
    };

    var tests = [
        {
            path: ['test/basicTest'],
            name: 'Basic',
            baseUrl: '../../examples/basic/'
        },
        {
            path: ['test/bindTest'],
            name: 'BasicBind',
            baseUrl: '../../examples/basicBind/'
        }
    ];

    mocha.ui('bdd');

    tests.forEach(function (test, index) {
        var config = {
            context: test.name,
            baseUrl: test.baseUrl,
            paths: paths,
            templateDecoders: coders.templateDecoders
        };
        config.paths[test.name] = 'target/' + test.name;

        var req = require.config(config);
        req(test.path, function () {
            if (index == tests.length - 1) {
                if (window.mochaPhantomJS) {
                    window.mochaPhantomJS.run();
                }
                else {
                    mocha.run();
                }
            }
        });
    });
})(window)
