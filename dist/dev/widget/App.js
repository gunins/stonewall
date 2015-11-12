/*jslint bitwise: true, nomen: true, plusplus: true, white: true */

/*!
 * Mediator.js Library v0.9.8
 * https://github.com/ajacksified/Mediator.js
 *
 * Copyright 2013, Jack Lawson
 * MIT Licensed (http://www.opensource.org/licenses/mit-license.php)
 *
 * For more information: http://thejacklawson.com/2011/06/mediators-for-modularized-asynchronous-programming-in-javascript/index.html
 * Project on GitHub: https://github.com/ajacksified/Mediator.js
 *
 * Last update: October 19 2013
 */

(function (global, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD
        define('widget/mediator',[],function () {
            return factory();
        });
    } else if (typeof exports !== 'undefined') {
        // Node/CommonJS
        exports.Mediator = factory();
    } else {
        // Browser global
        global.Mediator = factory();
    }
}(this, function () {
    'use strict';

    // We'll generate guids for class instances for easy referencing later on.
    // Subscriber instances will have an id that can be refernced for quick
    // lookups.

    function guidGenerator() {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };

        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }

    // Subscribers are instances of Mediator Channel registrations. We generate
    // an object instance so that it can be updated later on without having to
    // unregister and re-register. Subscribers are constructed with a function
    // to be called, options object, and context.

    function Subscriber(fn, options, context) {
        if (!(this instanceof Subscriber)) {
            return new Subscriber(fn, options, context);
        }

        this.id      = guidGenerator();
        this.fn      = fn;
        this.options = options;
        this.context = context;
        this.channel = null;
    }

    Subscriber.prototype = {
        // Mediator.update on a subscriber instance can update its function,context,
        // or options object. It takes in an object and looks for fn, context, or
        // options keys.

        update: function (options) {
            if (options) {
                this.fn      = options.fn || this.fn;
                this.context = options.context || this.context;
                this.options = options.options || this.options;
                if (this.channel && this.options && this.options.priority !== undefined) {
                    this.channel.setPriority(this.id, this.options.priority);
                }
            }
        }
    };

    function Channel(namespace, parent, context) {
        if (!(this instanceof Channel)) {
            return new Channel(namespace, parent, context);
        }
        this.namespace    = namespace || "";
        this._subscribers = [];
        this._channels    = {};
        this._parent      = parent;
        this.stopped      = false;
        this._context     = context||{};
    }

    // A Mediator channel holds a list of sub-channels and subscribers to be fired
    // when Mediator.publish is called on the Mediator instance. It also contains
    // some methods to manipulate its lists of data; only setPriority and
    // StopPropagation are meant to be used. The other methods should be accessed
    // through the Mediator instance.

    Channel.prototype = {
        addSubscriber: function (fn, options, context) {
            context = context || this._context;

            var subscriber = new Subscriber(fn, options, context);

            if (options && options.priority !== undefined) {
                // Cheap hack to either parse as an int or turn it into 0. Runs faster
                // in many browsers than parseInt with the benefit that it won't
                // return a NaN.
                options.priority = options.priority >> 0;

                if (options.priority < 0) {
                    options.priority = 0;
                }
                if (options.priority >= this._subscribers.length) {
                    options.priority = this._subscribers.length - 1;
                }

                this._subscribers.splice(options.priority, 0, subscriber);
            } else {
                this._subscribers.push(subscriber);
            }

            subscriber.channel = this;
            subscriber.remove  = function () {
                this.removeSubscriber(subscriber.id);
            }.bind(this);

            context._globalEvents = context._globalEvents || [];
            context._globalEvents.push(subscriber);

            return subscriber;
        },

        // The channel instance is passed as an argument to the mediator subscriber,
        // and further subscriber propagation can be called with
        // channel.StopPropagation().
        stopPropagation: function () {
            this.stopped = true;
        },

        getSubscriber: function (identifier) {
            var x = 0,
                y = this._subscribers.length;

            for (x, y; x < y; x++) {
                if (this._subscribers[x].id === identifier || this._subscribers[x].fn === identifier) {
                    return this._subscribers[x];
                }
            }
        },

        // Channel.setPriority is useful in updating the order in which Subscribers
        // are called, and takes an identifier (subscriber id or named function) and
        // an array index. It will not search recursively through subchannels.

        setPriority: function (identifier, priority) {
            var oldIndex = 0,
                x        = 0,
                sub, firstHalf, lastHalf, y;

            for (x = 0, y = this._subscribers.length; x < y; x++) {
                if (this._subscribers[x].id === identifier || this._subscribers[x].fn === identifier) {
                    break;
                }
                oldIndex++;
            }

            sub       = this._subscribers[oldIndex];
            firstHalf = this._subscribers.slice(0, oldIndex);
            lastHalf  = this._subscribers.slice(oldIndex + 1);

            this._subscribers = firstHalf.concat(lastHalf);
            this._subscribers.splice(priority, 0, sub);
        },

        addChannel: function (channel) {
            this._channels[channel] = new Channel((this.namespace ? this.namespace + ':' : '') +
                                                  channel, this, this._context);
        },

        hasChannel: function (channel) {
            return this._channels.hasOwnProperty(channel);
        },

        returnChannel: function (channel) {
            return this._channels[channel];
        },

        removeSubscriber: function (identifier) {
            var x = this._subscribers.length - 1;

            // If we don't pass in an id, we're clearing all
            if (!identifier) {
                this._subscribers = [];
                return;
            }

            // Going backwards makes splicing a whole lot easier.
            for (x; x >= 0; x--) {
                if (this._subscribers[x].fn === identifier || this._subscribers[x].id === identifier) {
                    this._subscribers[x].channel = null;
                    this._subscribers.splice(x, 1);
                }
            }
        },

        // This will publish arbitrary arguments to a subscriber and then to parent
        // channels.

        publish: function (data) {
            var x          = 0,
                y          = this._subscribers.length,
                shouldCall = false,
                subscriber, l,
                subsBefore, subsAfter;

            // Priority is preserved in the _subscribers index.
            for (x, y; x < y; x++) {
                // By default set the flag to false
                shouldCall = false;
                subscriber = this._subscribers[x];

                if (!this.stopped) {
                    subsBefore = this._subscribers.length;
                    if (subscriber.options !== undefined && typeof subscriber.options.predicate === "function") {
                        if (subscriber.options.predicate.apply(subscriber.context, data)) {
                            // The predicate matches, the callback function should be called
                            shouldCall = true;
                        }
                    } else {
                        // There is no predicate to match, the callback should always be called
                        shouldCall = true;
                    }
                }

                // Check if the callback should be called
                if (shouldCall) {
                    // Check if the subscriber has options and if this include the calls options
                    if (subscriber.options && subscriber.options.calls !== undefined) {
                        // Decrease the number of calls left by one
                        subscriber.options.calls--;
                        // Once the number of calls left reaches zero or less we need to remove the subscriber
                        if (subscriber.options.calls < 1) {
                            this.removeSubscriber(subscriber.id);
                        }
                    }
                    // Now we call the callback, if this in turns publishes to the same channel it will no longer
                    // cause the callback to be called as we just removed it as a subscriber
                    subscriber.fn.apply(subscriber.context, data);

                    subsAfter = this._subscribers.length;
                    y         = subsAfter;
                    if (subsAfter === subsBefore - 1) {
                        x--;
                    }
                }
            }

            if (this._parent) {
                this._parent.publish(data);
            }

            this.stopped = false;
        }
    };

    function Mediator(context) {
        if (!(this instanceof Mediator)) {
            return new Mediator(context);
        }

        this._channels = new Channel('', false, context);
    }

    // A Mediator instance is the interface through which events are registered
    // and removed from publish channels.

    Mediator.prototype = {

        // Returns a channel instance based on namespace, for example
        // application:chat:message:received. If readOnly is true we
        // will refrain from creating non existing channels.

        getChannel: function (namespace, readOnly) {
            var channel            = this._channels,
                namespaceHierarchy = namespace.split(':'),
                x                  = 0,
                y                  = namespaceHierarchy.length;

            if (namespace === '') {
                return channel;
            }

            if (namespaceHierarchy.length > 0) {
                for (x, y; x < y; x++) {

                    if (!channel.hasChannel(namespaceHierarchy[x])) {
                        if (readOnly) {
                            break;
                        } else {
                            channel.addChannel(namespaceHierarchy[x]);
                        }
                    }

                    channel = channel.returnChannel(namespaceHierarchy[x]);
                }
            }

            return channel;
        },

        // Pass in a channel namespace, function to be called, options, and context
        // to call the function in to Subscribe. It will create a channel if one
        // does not exist. Options can include a predicate to determine if it
        // should be called (based on the data published to it) and a priority
        // index.

        subscribe: function (channelName, fn, options, context) {
            var channel = this.getChannel(channelName || "", false);

            options = options || {};

            return channel.addSubscriber(fn, options, context);
        },

        // Pass in a channel namespace, function to be called, options, and context
        // to call the function in to Subscribe. It will create a channel if one
        // does not exist. Options can include a predicate to determine if it
        // should be called (based on the data published to it) and a priority
        // index.

        once: function (channelName, fn, options, context) {
            options       = options || {};
            options.calls = 1;

            return this.subscribe(channelName, fn, options, context);
        },

        // Returns a subscriber for a given subscriber id / named function and
        // channel namespace

        getSubscriber: function (identifier, channelName) {
            var channel = this.getChannel(channelName || "", true);
            // We have to check if channel within the hierarchy exists and if it is
            // an exact match for the requested channel
            if (channel.namespace !== channelName) {
                return null;
            }

            return channel.getSubscriber(identifier);
        },

        // Remove a subscriber from a given channel namespace recursively based on
        // a passed-in subscriber id or named function.

        remove: function (channelName, identifier) {
            var channel = this.getChannel(channelName || "", true);
            if (channel.namespace !== channelName) {
                return false;
            }

            channel.removeSubscriber(identifier);
        },

        // Publishes arbitrary data to a given channel namespace. Channels are
        // called recursively downwards; a post to application:chat will post to
        // application:chat:receive and application:chat:derp:test:beta:bananas.
        // Called using Mediator.publish("application:chat", [ args ]);

        publish: function (channelName) {
            var channel = this.getChannel(channelName || "", true);
            if (channel.namespace !== channelName) {
                return null;
            }

            var args = Array.prototype.slice.call(arguments, 1);

            args.push(channel);

            channel.publish(args);
        }
    };

    // Alias some common names for easy interop
    Mediator.prototype.on      = Mediator.prototype.subscribe;
    Mediator.prototype.bind    = Mediator.prototype.subscribe;
    Mediator.prototype.emit    = Mediator.prototype.publish;
    Mediator.prototype.trigger = Mediator.prototype.publish;
    Mediator.prototype.off     = Mediator.prototype.remove;

    // Finally, expose it all.

    Mediator.Channel    = Channel;
    Mediator.Subscriber = Subscriber;
    Mediator.version    = "0.9.8";

    return Mediator;
}));

!function(t,n){"function"==typeof define&&define.amd?define("router/MatchBinding",n):"object"==typeof exports?module.exports=n():(t.UrlManager=t.UrlManager||{},t.UrlManager.MatchBinding=n())}(this,function(){function t(n,e){""===e?this.pattern=e=n.replace(/^\(\/\)/g,"").replace(/^\/|$/g,""):(this.pattern=n,e+=n),this.location=e.replace(/\((.*?)\)/g,"$1").replace(/^\/|$/g,"");var r=this.pattern.replace(t.ESCAPE_PARAM,"\\$&").replace(t.OPTIONAL_PARAM,"(?:$1)?").replace(t.NAMED_PARAM,function(t,n){return n?t:"([^/]+)"}).replace(t.SPLAT_PARAM,"(.*?)");this.patternRegExp=new RegExp("^"+r),this.routeHandler=[],this.leaveHandler=[],this.queryHandler=[],this.routes=[]}return t.prototype.onBind=function(){},t.prototype.setOnBind=function(t){this.onBind=t},t.prototype.rebind=function(){void 0!==this.onBind&&this.onBind()},t.prototype.setRoutes=function(t){return this.routes.push(t),this},t.prototype.getRoutes=function(){return this.routes},t.prototype.to=function(t){return this.routeHandler.push(t),this},t.prototype.leave=function(t){return this.leaveHandler.push(t),this},t.prototype.query=function(t){return this.queryHandler.push(t),this},t.prototype.remove=function(){return this.routes.splice(0,this.routes.length),this.routeHandler.splice(0,this.routeHandler.length),this.leaveHandler.splice(0,this.leaveHandler.length),this.queryHandler.splice(0,this.queryHandler.length),this},t.prototype.test=function(t){return this.patternRegExp.test(t)},t.prototype.getFragment=function(t){var n=this.applyParams(t);return t.replace(n,"")},t.prototype.applyParams=function(t){var n=this.pattern.replace(/\((.*?)\)/g,"$1").split("/"),e=t.split("/");return e.splice(0,n.length).join("/")},t.prototype.extractParams=function(t){var n=this.patternRegExp.exec(t).slice(1);return n.map(function(t){return t?decodeURIComponent(t):null})},t.prototype.setSubBinder=function(t){return this.subBinder=t,t},t.prototype.getSubBinder=function(){return this.subBinder},t.prototype.getHandler=function(){return this.routeHandler},t.prototype.getLeaveHandler=function(){return this.leaveHandler},t.prototype.getQueryHandler=function(){return this.queryHandler},t.OPTIONAL_PARAM=/\((.*?)\)/g,t.NAMED_PARAM=/(\(\?)?:\w+/g,t.SPLAT_PARAM=/\*\w+/g,t.ESCAPE_PARAM=/[\-{}\[\]+?.,\\\^$|#\s]/g,t}),function(t,n){"function"==typeof define&&define.amd?define("router/MatchBinder",["./MatchBinding"],n):"object"==typeof exports?module.exports=n(require("./MatchBinding")):(t.UrlManager=t.UrlManager||{},t.UrlManager.MatchBinder=n(t.UrlManager.MatchBinding))}(this,function(t){function n(t,n,e,r){this.bindings=[],this.location=r||t||"",this.command=e,this.params=n}return n.prototype.match=function(t,n){var e=this.getMatchBinding(t,this.location);this.bindings.push(e);var r=this.getSubBinder(this.location+t);return e.setSubBinder(r),n&&n(r.match.bind(r)),e},n.prototype.getSubBinder=function(t){return new n(t)},n.prototype.getMatchBinding=function(n,e){return new t(n,e)},n.prototype.filter=function(t){return this.bindings.filter(function(n){return n.test(t)})},n.prototype.run=function(){this.command(this)},n}),function(t,n){"function"==typeof define&&define.amd?define("router/Router",["./MatchBinder"],n):"object"==typeof exports?module.exports=n(require("./MatchBinder")):(t.UrlManager=t.UrlManager||{},t.UrlManager.Router=n(t.UrlManager.MatchBinder))}(this,function(t){function n(t){try{return decodeURIComponent(t.replace(/\+/g," "))}catch(n){return t}}function e(t,n){var e=t.split("&");e.forEach(function(t){var e=t.split("=");n(e.shift(),e.join("="))})}function r(t,n,e,r){var i,o=e.root.substring(0,e.root.length-r.length);return t=t||"",i=n===!0?this.serialize(e.query):n===!1?"":this.serialize(n),o+t+(0===i.length?"":"?"+i)}function i(){this.root=this.getBinder(),this.bindings=[]}return Array.prototype.equals=function(t){if(!t)return!1;if(this.length!=t.length)return!1;for(var n=0,e=this.length;e>n;n++)if(this[n]instanceof Array&&t[n]instanceof Array){if(!this[n].equals(t[n]))return!1}else if(this[n]!=t[n])return!1;return!0},i.prototype.getBinder=function(){return new t},i.prototype.match=function(t){t(this.root.match.bind(this.root))},i.prototype.trigger=function(t){if(this.started){var r=t.split("?",2),i={};r[1]&&e(r[1],function(t,e){e=n(e),i[t]?"string"==typeof i[t]?i[t]=[i[t],e]:i[t].push(e):i[t]=e});var o=r[0].replace(/^\/|$/g,""),s={root:o,query:i},a=[],p=!1;this.bindings.forEach(function(n){var e,r=n.pattern.replace(/\((.*?)\)/g,"$1").replace(/^\//,"").split("/"),i=n.location.split("/"),u=n.prevLoc.replace(/^\//,"").split("/"),h=function(t){var n=t.splice(i.length-r.length,r.length),e=u.splice(0,r.length);return!n.equals(e)};if(e=h(p||o.split("/"))){p=o.split("/").splice(0,i.length-r.length);var c=n.getLeaveHandler(),l=[];n.setOnBind(),this.applyHandler(c,l,s,t),a.push(n)}}.bind(this)),a.forEach(function(t){this.bindings.splice(this.bindings.indexOf(t),1)}.bind(this)),this.find(this.root,o,s)}},i.prototype.find=function(t,n,e){var r=t.filter(n);r.forEach(this.onBinding.bind(this,n,e))},i.prototype.execute=function(t){var n=t.location.split("/"),e=t.params.root.split("/"),r="/"+e.splice(n.length,e.length-n.length).join("/");this.find(t,r,t.params)},i.prototype.onBinding=function(n,e,r){r.setOnBind(this.onBinding.bind(this,n,e,r)),this.runHandler(n,e,r);var i=r.getFragment(n),o=r.getSubBinder();o&&o.bindings&&o.bindings.length>0&&this.find(o,i,e);var s=r.getRoutes();if(s&&s.length>0)for(;s.length>0;){var a=s[0],p=new t(r.getFragment(n),e,this.execute.bind(this),r.location);a(p),o.bindings=o.bindings.concat(p.bindings),s.shift()}},i.prototype.serialize=function(t){var n=[];for(var e in t)t.hasOwnProperty(e)&&n.push(encodeURIComponent(e)+"="+encodeURIComponent(t[e]));return n.join("&")},i.prototype.runHandler=function(t,n,e){if(-1===this.bindings.indexOf(e)){var r=e.getHandler(),i=e.extractParams(t);e.prevLoc=t,this.applyHandler(r,i,n,t),this.bindings.push(e)}var r=e.getQueryHandler();if(r){var i=[];this.applyHandler(r,i,n,t)}},i.prototype.applyHandler=function(t,n,e,i){t&&t.length>0&&t.forEach(function(t){t.apply(this,n.concat({getQuery:function(){return e.query},getLocation:function(t,n){return r.call(this,t,n,e,i)}.bind(this)}))}.bind(this))},i.prototype.start=function(){this.started=!0},i.prototype.stop=function(){this.started=!1},i});
/**
 * Created by guntars on 10/10/2014.
 */
define('widget/utils',[],function () {
    function extend(obj) {
        var type = typeof obj;
        if (!(type === 'function' || type === 'object' && !!obj)) {
            return obj;
        }
        var source, prop;
        for (var i = 1, length = arguments.length; i < length; i++) {
            source = arguments[i];
            for (prop in source) {
                obj[prop] = source[prop];
            }
        }
        return obj;
    };

    function fnExtend(protoProps, staticProps) {
        var parent = this;
        var child;
        if (protoProps && protoProps != null &&
            hasOwnProperty.call(protoProps, 'constructor')) {
            child = protoProps.constructor;
        } else {
            child = function () {
                return parent.apply(this, arguments);
            };
        }

        extend(child, parent, staticProps);

        var Surrogate = function () {
            this.constructor = child;
        };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate;
        if (protoProps) {
            extend(child.prototype, protoProps);
        }

        child.__super__ = parent.prototype;
        return child;
    };
    function isString(obj) {
        return toString.call(obj) === '[object String]';

    }

    function isObject(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    }

    function isArray(obj) {
        return (Array.isArray) ? Array.isArray(obj) : toString.call(obj) === '[object Array]';
    }

    return {
        fnExtend: fnExtend,
        // Extend a given object with all the properties in passed-in object(s).
        extend: extend,
        // Check if it's String
        isString: isString,
        // Check if I't Object
        isObject: isObject,
        // Check if it's Array
        isArray: isArray
    };
});
/**
 * Created by guntars on 11/10/2014.
 */
/*globals setTimeout, define*/
// ## widget/App Class
// Usage Example
//
//      define([
//          'widget/App',
//          'widget/parser!container/Container',
//      ], function (App, Container) {
//          'use strict';
//          return App.extend({
//              AppContainer: Container
//          });
//      });
define('widget/App',[
    './mediator',
    'router/Router',
    './utils'
], function (Mediator, Router, utils) {
    'use strict';
    function triggerRoute(router) {
        router.start();
        function onHashChange() {
            var match = window.location.href.match(/#(.*)$/);
            router.trigger(match ? match[1] : '');
        };
        window.addEventListener('hashchange', onHashChange, false);
        onHashChange();
    }

    // ### App Class
    // Creater App, EventBus and context for App.
    // Usage Example
    //
    //      var app= new App();
    //      app.start(document.body);
    function App(options) {
        options    = options || {};
        var router = new Router(),
            mapHandler;

        this.beforeInit.apply(this, arguments);
        this.context = utils.extend(this.setContext.apply(this, arguments), {
            // Creating `EventBus` More info look in `Mediator` Section
            eventBus: new Mediator()
        });
        if (this.AppContainer !== undefined) {
            this.appContainer = new this.AppContainer({
                appContext: this.context
            });
            if (this.appContainer._match !== undefined) {
                mapHandler = this.appContainer._match.bind(this.appContainer);
            } else {
                mapHandler = function () {

                }
            }

            if (options.rootRoute !== undefined) {
                router.match(function (match) {
                    match(options.rootRoute, mapHandler);
                });
            } else {
                router.match(mapHandler);
            }

            this.el           = this.appContainer.el;
            setTimeout(function () {
                this.el.classList.add('show');
            }.bind(this), 100);
            triggerRoute(router);

        }
        this.init.apply(this, arguments);
    }

    // Extending the `App` Class
    //
    //      @Static method extend
    App.extend = utils.fnExtend;

    utils.extend(App.prototype, {
        // Running 'AppContainer' is initialised.
        //
        //      @method beforeInit
        beforeInit: function () {
        },
        // Running after 'AppContainer' is initialised.
        //
        //      @method init
        init:       function () {
        },
        // SettingContext for the `App`
        //
        //      @method setContext
        setContext: function () {
            return {};
        },
        // Starting `App` in provided `Container`
        //
        //      @method start
        //      @param {HTMLElement} container
        start:      function (container) {
            if (container instanceof HTMLElement === true) {
                container.appendChild(this.el);
            }
        }
    });
    return App;
});
