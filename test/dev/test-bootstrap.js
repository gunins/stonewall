// PhantomJS doesn't support bind yet
if (Function.prototype.bind === undefined) {
    (function () {
        var Ap = Array.prototype;
        var slice = Ap.slice;
        var Fp = Function.prototype;

        if (!Fp.bind) {
            // PhantomJS doesn't support Function.prototype.bind natively, so
            // polyfill it whenever this module is required.
            Fp.bind = function (context) {
                var func = this;
                var args = slice.call(arguments, 1);

                function bound() {
                    var invokedAsConstructor = func.prototype && (this instanceof func);
                    return func.apply(
                        // Ignore the context parameter when invoking the bound function
                        // as a constructor. Note that this includes not only constructor
                        // invocations using the new keyword but also calls to base class
                        // constructors such as BaseClass.call(this, ...) or super(...).
                        !invokedAsConstructor && context || this,
                        args.concat(slice.call(arguments))
                    );
                }

                // The bound function must share the .prototype of the unbound
                // function so that any object created by one constructor will count
                // as an instance of both constructors.
                bound.prototype = func.prototype;

                return bound;
            };
        }
    })();
}
var coders = {
    templateCoders: [
        'coders/component/CpCoder',
        'coders/placeholders/plCoder',
        'coders/router/RouterCoder',
        'coders/style/styleCoder'

    ],
    templateDecoders: [
        'coders/component/CpDecoder',
        'coders/placeholders/plDecoder',
        'coders/router/RouterDecoder',
        'coders/style/styleDecoder'
    ]
};
var paths = {
    test: '../../../test/dev',
    chai: '../../../node_modules/chai/chai',
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
        paths: paths
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

