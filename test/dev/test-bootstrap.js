(function(window) {
    function testGlobal(method) {
        return this[method] === undefined;
    }

    function testEs6(done, methods) {
        var global = this;
        if (methods.filter(testGlobal.bind(global)).length > 0) {
            require(['babel/polyfill'], function() {
                done();
            });
        } else {
            done();
        }
    };

    var check = function() {
        'use strict';

        if (typeof Symbol == 'undefined') return false;
        try {
            eval('class Foo {}');
            eval('var bar = (x) => x+1');
        } catch (e) {
            return false;
        }

        return true;
    }();


    var target = check ? 'es6' : 'es5'

    var coders = {
        templateCoders:   [
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

    var tests = [
        /*  {
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
         },*/
        {
            path: ['test/mediatorTest'],
            name: 'Mediator'
        },
        {
            path: ['test/appTest'],
            name: 'App'
        }
    ];
    var paths = {
        'test':           '../../../../test/dev',
        'sinon':          '../../../../node_modules/sinon/lib/sinon',
        'templating':     '../../../../node_modules/richtemplate/dist/' + target + '/dev/templating',
        'coders':         '../../../../node_modules/richtemplate/dist/' + target + '/dev/coders',
        'widget':         '../../../../dist/' + target + '/dev/widget',
        'babel/polyfill': '../../../../dist/' + target + '/basic/babel/polyfill',
        'router/Router':  '../../../../dist/' + target + '/dev/widget/App',
        'widget/Mediator':  '../../../../dist/' + target + '/dev/widget/App'

    }

    require.config({
        baseUrl:          '../../dist/' + target + '/dev/',
        templateCoders:   coders.templateCoders,
        templateDecoders: coders.templateDecoders
    });

    mocha.ui('bdd');
    testEs6(function run() {
            tests.forEach(function(test, index) {

                var config = {
                    context:          test.name,
                    baseUrl:          test.baseUrl,
                    paths:            paths,
                    templateCoders:   coders.templateCoders,
                    templateDecoders: coders.templateDecoders
                };

                var req = require.config(config);

                req(test.path, function() {
                    if (index == tests.length - 1) {

                        if (window.mochaPhantomJS) {
                            setTimeout(function() {
                                window.mochaPhantomJS.run();
                            }, 200);
                        }
                        else {
                            setTimeout(function() {
                                mocha.run();
                            }, 200)
                        }
                    }
                });
            })
        },
        //Add there list of es6 feature you yse, for checking if need polyfill.
        ['Map', 'Set', 'Symbol']);

})(window)