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
        'test': '../../../test/dev',
        'templating': '../../../node_modules/richtemplate/dev/templating',
        'coders': '../../../node_modules/richtemplate/dev/coders',
        'widget': '../../../dist/dev/widget',
        'widget/dom': '../../../dist/dev/widget/Constructor',
        'widget/utils': '../../../dist/dev/widget/App',
        'watch': '../../../lib/watch/src/watch',
        'router': '../../../bower_components/urlmanager/dist/prod/router'
    }

    require.config({
        baseUrl: '../../node_modules/richtemplate/dev/',
        templateCoders: coders.templateCoders,
        templateDecoders: coders.templateDecoders
    });

    mocha.setup('bdd');

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
        },
        {
            path: ['test/routesTest'],
            name: 'Routes',
            baseUrl: '../../examples/routes/src'
        },
        {
            path: ['test/elementTest'],
            name: 'Element',
            baseUrl: '../../examples/element/src'
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
                    setTimeout(function () {
                        window.mochaPhantomJS.run();
                    },200);
                }
                else {
                    setTimeout(function () {
                        mocha.run();
                    }, 200)
                }
            }
        });
    });
})(window)