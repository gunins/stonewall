/**
 * Created by guntars on 15/01/15.
 */
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

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                      || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

if(!Node.prototype.remove){
    Node.prototype.remove = function( removeChildren ){
        this.parentNode && this.parentNode.removeChild( this );
    };
}
function simulatedEvent(target, options) {

    var event = target.ownerDocument.createEvent('MouseEvents'),
        options = options || {};

    //Set your default options to the right of ||
    var opts = {
        type: options.type                   || 'click',
        canBubble:options.canBubble          || true,
        cancelable:options.cancelable        || true,
        view:options.view                    || target.ownerDocument.defaultView,
        detail:options.detail                || 1,
        screenX:options.screenX              || 0, //The coordinates within the entire page
        screenY:options.screenY              || 0,
        clientX:options.clientX              || 0, //The coordinates within the viewport
        clientY:options.clientY              || 0,
        ctrlKey:options.ctrlKey              || false,
        altKey:options.altKey                || false,
        shiftKey:options.shiftKey            || false,
        metaKey:options.metaKey              || false, //I *think* 'meta' is 'Cmd/Apple' on Mac, and 'Windows key' on Win. Not sure, though!
        button:options.button                || 0, //0 = left, 1 = middle, 2 = right
        relatedTarget:options.relatedTarget  || null,
    }

    //Pass in the options
    event.initMouseEvent(
        opts.type,
        opts.canBubble,
        opts.cancelable,
        opts.view,
        opts.detail,
        opts.screenX,
        opts.screenY,
        opts.clientX,
        opts.clientY,
        opts.ctrlKey,
        opts.altKey,
        opts.shiftKey,
        opts.metaKey,
        opts.button,
        opts.relatedTarget
    );

    //Fire the event
    target.dispatchEvent(event);
}