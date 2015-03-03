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
        'coders/placeholders/plDecoder': '../../dist/prod/loader',
        'coders/databind/bdDecoder': '../../dist/prod/loader',
        'coders/router/RouterDecoder': '../../dist/prod/loader',
        'coders/style/styleDecoder': '../../dist/prod/loader',
        'widget/Constructor': '../../dist/prod/loader',
        'widget/dom': '../../dist/prod/loader'
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
        },
        {
            path: ['test/routesTest'],
            name: 'Routes',
            baseUrl: '../../examples/routes/'
        },
        {
            path: ['test/elementTest'],
            name: 'Element',
            baseUrl: '../../examples/element/'
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
                    setTimeout(function () {
                    mocha.run();
                    }, 200);
                }
            }
        });
    });
})(window)
