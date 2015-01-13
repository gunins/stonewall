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

var paths = {
    test: '../../test/prod',
    chai: '../../node_modules/chai/chai',
    'templating/Decoder': '../../dist/prod/loader'
};

var tests = [
    {
        path: ['test/basicTest'],
        name: 'Basic',
        config: {
            baseUrl: '../../examples/basic/'
        }
    },
    {
        path: ['test/bindTest'],
        name: 'BasicBind',
        config: {
            baseUrl: '../../examples/basicBind/'
        }
    }
];

require.config({
    baseUrl: '../../',
    paths: {
        test: './test/prod',
        chai: "./node_modules/chai/chai",
        Basic: 'target/Basic',
        BasicBind: 'target/BasicBind'
    }
});

mocha.ui('bdd');

tests.forEach(function (test, index) {
    test.config.context = test.name;
    test.config.paths = paths;
    test.config.paths[test.name] = 'target/' + test.name;

    var req = require.config(test.config);

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