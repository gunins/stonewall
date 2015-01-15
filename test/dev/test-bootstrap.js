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
        test: '../../../test/dev',
        templating: '../../../node_modules/richtemplate/dev/templating',
        coders: '../../../node_modules/richtemplate/dev/coders',
        widget: '../../../dist/dev/widget',
        'watch': '../../../lib/watch/src/watch',
        'router': '../../../bower_components/urlmanager/dist/prod/router'
    }

    require.config({
        baseUrl: '../../node_modules/richtemplate/dev/',
        templateCoders: coders.templateCoders,
        templateDecoders: coders.templateDecoders
    });

    mocha.ui('bdd');

    var tests = [
        {
            path: ['test/basicTest'],
            name: 'Basic',
            baseUrl: '../../examples/basic/src'
        },
        {
            path: ['test/bindTest'],
            name: 'BasicBind',
            baseUrl: '../../examples/basicBind/src'
        }
    ];

    tests.forEach(function (test, index) {

        var config = {
            context: test.name,
            baseUrl: test.baseUrl,
            paths: paths,
            templateCoders: coders.templateCoders,
            templateDecoders: coders.templateDecoders
        };

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