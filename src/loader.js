// ## Loader Loads the Application main script
// Following Attributes Supported
//
//      data-name: location of main script for Application
//      data-target?: location to container if not set,
//      use document.body
//
// There below is Example of usage in `index.html`
//
//      `<script data-name="App" data-target="body"
//          src="../../src/loader.js"></script>`
(function(global) {
    var es6Samples = [
            'class Foo {}',
            'const bar = (x) => x+1',
            'function Bar(a="a"){};',
            'function Foo(...a){return [...a]}',
            'let [a,b,c]=[1,2,3]'
        ],
        checkEs6 = function() {
            'use strict';
            try {
                es6Samples.forEach(eval);
            } catch (e) {
                return 'es5';
            }

            return 'es6';
        }();
    define('es6Features', ['require'], function(require) {
        var methods = ['Map', 'Set', 'Symbol'];

        function testGlobal(method) {
            return global[method] === undefined;
        }

        return function(done) {
            if (methods.filter(testGlobal).length > 0) {
                require(['babel/polyfill'], function() {
                    done();
                });
            } else {
                done();
            }
        }.bind(this);
    });

    function getData(script, dataset) {
        var data = script.dataset,
            keys = Object.keys(data);
        if (keys.length > 0) {
            keys.forEach(function(key) {
                dataset[key] = data[key];
            })
        }
    }

    function getDataSet() {
        var dataset = {},
            scripts = document.getElementsByTagName('script');
        if (scripts.length > 0) {
            for (var a = 0; a < scripts.length; a++) {
                getData(scripts[a], dataset);
            }
        }

        return dataset;
    }

    function containerStart(dataset) {
        if (dataset.name !== undefined) {
            var config = [['es6Features'], function(cb) {
                cb(function run() {
                    require(['widget/App'], function() {
                        require({}, [dataset.name], function(App) {
                            var container = (dataset.target) ? document.querySelector(dataset.target) : document.body,
                                app = new App();
                            app.start(container);
                        });
                    });
                });

            }];
            if (dataset.dev !== 'true') {
                config.unshift({
                    baseUrl:          (dataset.baseurl ? dataset.baseurl : './target/') + checkEs6,
                    templateDecoders: [
                        'coders/component/cpDecoder',
                        'coders/placeholders/plDecoder',
                        'coders/databind/bdDecoder',
                        'coders/style/styleCoder',
                        'coders/router/routerDecoder'
                    ]
                })
            }
            require.apply(global, config);

        }
    }

    document.addEventListener("DOMContentLoaded", function() {
        containerStart(getDataSet());
    }, false);

}(this));