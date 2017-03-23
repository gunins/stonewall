(function(window) {

    function assign(source, target) {
        var keys = Object.keys(target);
        keys.forEach(function(key) {
            source[key] = target[key];
        });
        return source;
    }

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
            eval('function Bar(a="a"){};');
            eval('function Foo(...a){return [...a]}');
            eval('var [a,b,c]=[1,2,3]');
        } catch (e) {
            return false;
        }

        return true;
    }();


    var target = check ? 'es6' : 'es5'
    console.log('This browser version supporting: ' + target);

    var coders = {
        templateCoders:   [
            'coders/component/CpCoder',
            'coders/placeholders/plCoder',
            'coders/databind/bdCoder',
            'coders/router/routerCoder',
            'coders/style/styleCoder'
        ],
        templateDecoders: [
            'coders/component/CpDecoder',
            'coders/placeholders/plDecoder',
            'coders/databind/bdDecoder',
            'coders/router/routerDecoder',
            'coders/style/styleDecoder'
        ]
    };

    var tests = [
        {
            path:    ['test/basicTest'],
            name:    'Basic',
            appRoot: '../../../../examples/basic/target/'
        },
        {
            path:    ['test/bindTest'],
            name:    'BasicBind',
            appRoot: '../../../../examples/basicBind/target/'
        },
        {
            path:    ['test/routesTest'],
            name:    'Routes',
            appRoot: '../../../../examples/routes/target/'
        },
        {
            path:    ['test/elementTest'],
            name:    'Element',
            appRoot: '../../../../examples/element/target/'
        },
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
        'test':            '../../../../test/dev',
        'sinon':           '../../../../node_modules/sinon/lib/sinon',
        'templating':      '../../../../node_modules/richtemplate/' + target + '/dev/templating',
        'coders':          '../../../../node_modules/richtemplate/' + target + '/dev/coders',
        'widget':          '../../../../dist/' + target + '/dev/widget',
        'babel/polyfill':  '../../../../dist/' + target + '/dev/babel/polyfill',
        'router/Router':   '../../../../dist/' + target + '/dev/widget/App',
        'widget/Mediator': '../../../../dist/' + target + '/dev/widget/App'

    }
    require.config({
        baseUrl:          '../../dist/' + target + '/dev/',
        templateCoders:   coders.templateCoders,
        templateDecoders: coders.templateDecoders
    });

    mocha.ui('bdd');

    testEs6(function run() {

            tests.forEach(function(test, index) {
                var localPaths = {};
                if (test.appRoot) {
                    localPaths[test.name] = test.appRoot + target + '/' + test.name;
                }
                assign(localPaths, paths);

                var config = {
                    context:          test.name,
                    baseUrl:          test.baseUrl,
                    paths:            localPaths,
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