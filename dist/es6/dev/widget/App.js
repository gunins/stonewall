/*jslint bitwise: true, nomen: true, plusplus: true, white: true */

/*!
 * Mediator Library v0.9.9
 *
 */

(function (global, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD
        define('widget/Mediator',[],function () {
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

    // Subscribers are instances of Mediator Channel registrations. We generate
    // an object instance so that it can be updated later on without having to
    // unregister and re-register. Subscribers are constructed with a function
    // to be called, options object, and context.

    class Subscriber {
        constructor(fn, options, context = {}, channel = null) {
            this.fn = fn;
            this.channel = channel;
            this.context = context;
            this.options = options;
        };

        // Mediator.update on a subscriber instance can update its function,context,
        // or options object. It takes in an object and looks for fn, context, or
        // options keys.
        update(options = {}) {
            Object.assign(this, options);
            if (this.channel) {
                this.setPriority(this.priority);
            }
        };

        set options(options) {
            this.update(options);
        };

        set context(context) {
            this.setHook(context);
            this._context = context;
        };

        get context() {
            return this._context;
        };

        setHook(context) {
            let channel = this.channel;
            if (channel) {
                channel.hook(this, context);
            }
        }

        _reduceCalls() {
            // Check if the subscriber has options and if this include the calls options
            if (this.calls !== undefined) {
                // Decrease the number of calls left by one
                this.calls--;
                // Once the number of calls left reaches zero or less we need to remove the subscriber
                if (this.calls < 1) {
                    this.remove();
                }
            }
        };

        //return event remove method
        remove() {
            let channel = this.channel;
            if (channel) {
                channel.removeSubscriber(this);
            }
        };

        //Dynamic setPriority method
        setPriority(priority) {
            let channel = this.channel;
            if (channel) {
                channel.setPriority(this, priority);
            }
        };

        run(data) {
            if (!this.channel.stopped
                && !(typeof this.predicate === "function"
                && !this.predicate.apply(this.context, data))) {
                // Check if the callback should be called
                this._reduceCalls();
                //Execute function.
                this.fn.apply(this.context, data)
            }
        };

    }

    class Channel {
        constructor(namespace, parent, context, hook) {
            this.namespace = namespace || "";
            this._subscribers = [];
            this._channels = new Map();
            this._parent = parent;
            this.stopped = false;
            this.context = context;
            this.hook = hook;
        };


        // A Mediator channel holds a list of sub-channels and subscribers to be fired
        // when Mediator.publish is called on the Mediator instance. It also contains
        // some methods to manipulate its lists of data; only setPriority and
        // StopPropagation are meant to be used. The other methods should be accessed
        // through the Mediator instance.

        addSubscriber(fn, options, context = this.context) {
            return new Subscriber(fn, options, context, this);
        };


        // The channel instance is passed as an argument to the mediator subscriber,
        // and further subscriber propagation can be called with
        // channel.StopPropagation().
        stopPropagation() {
            this.stopped = true;
        };

        // Channel.setPriority is useful in updating the order in which Subscribers
        // are called, and takes an identifier (subscriber id or named function) and
        // an array index. It will not search recursively through subchannels.

        setPriority(subscriber, priority) {
            let subscribers = this._subscribers,
                index = subscribers.indexOf(subscriber);

            if (index !== -1) {
                subscribers.splice(subscribers.indexOf(subscriber), 1);
            }

            if (priority !== undefined && priority < this._subscribers.length) {
                subscribers.splice(priority, 0, subscriber);
            } else {
                subscribers.push(subscriber);
            }
        };

        hasChannel(channel) {
            return this._channels.has(channel);
        };

        getChannel(channel) {
            return this._channels.get(channel);
        };

        setChannel(namespace, readOnly) {
            if (!this.hasChannel(namespace) && !readOnly) {
                let channel = new Channel((this.namespace ? this.namespace + ':' : '') + namespace, this, this.context, this.hook);
                this._channels.set(namespace, channel);
                return channel;
            } else {
                return this.getChannel(namespace)
            }
        };

        returnChannel(channels, readOnly) {
            if (channels && channels.length > 0) {
                let channel = channels.shift(),
                    returnChannel = this.setChannel(channel, readOnly);
                if (returnChannel && channels.length > 0) {
                    return returnChannel.returnChannel(channels, readOnly);
                } else {
                    return returnChannel;
                }
            }
        };


        removeSubscriber(subscriber) {
            let subscribers = this._subscribers,
                index = subscribers.indexOf(subscriber);
            // If we don't pass in an value, we're clearing all
            if (!subscriber) {
                subscribers.splice(0, subscribers.length);
            } else if (index !== -1) {
                subscribers.splice(index, 1);
            }

            if (this._subscribers.length === 0 && this._parent) {
                this._parent.removeChannel(this);
            }
        };

        removeChannel(channel) {
            if (channel === this.getChannel(channel.namespace)) {
                this._channels.delete(channel.namespace);
            }
        };

        clear() {
            this._channels.forEach(channel=>channel.clear());
            this.removeSubscriber();
        };

        // This will publish arbitrary arguments to a subscriber and then to parent
        // channels.

        publish(data) {
            //slice method are cloning array, means default array can remove handlers
            this._subscribers.slice().forEach(subscriber=>subscriber.run(data));

            if (this._parent) {
                this._parent.publish(data);
            }

            this.stopped = false;
        };
    }

    class Mediator {
        constructor(context = {}, hook = ()=> {
        }) {
            if (!(this instanceof Mediator)) {
                return new Mediator(context, hook);
            }
            this.channel = new Channel('', false, context, hook);
        }

        // A Mediator instance is the interface through which events are registered
        // and removed from publish channels.


        // Returns a channel instance based on namespace, for example
        // application:chat:message:received. If readOnly is true we
        // will refrain from creating non existing channels.

        getChannel(namespace, readOnly) {
            let namespaceHierarchy = namespace.split(':');
            if (namespaceHierarchy.length > 0) {
                return this.channel.returnChannel(namespaceHierarchy, readOnly);
            }
        };

        // Pass in a channel namespace, function to be called, options, and context
        // to call the function in to Subscribe. It will create a channel if one
        // does not exist. Options can include a predicate to determine if it
        // should be called (based on the data published to it) and a priority
        // index.

        subscribe(channelName, fn, options = {}, context) {
            if (channelName && channelName !== '') {
                let channel = this.getChannel(channelName, false);
                return channel.addSubscriber(fn, options, context);
            } else {
                throw Error('Namespace should be provided!');
            }
        };

        // Pass in a channel namespace, function to be called, options, and context
        // to call the function in to Subscribe. It will create a channel if one
        // does not exist. Options can include a predicate to determine if it
        // should be called (based on the data published to it) and a priority
        // index.

        once(channelName, fn, options = {}, context) {
            options.calls = 1;
            return this.subscribe(channelName, fn, options, context);
        };

        // Publishes arbitrary data to a given channel namespace. Channels are
        // called recursively downwards; a post to application:chat will post to
        // application:chat:receive and application:chat:derp:test:beta:bananas.
        // Called using Mediator.publish("application:chat", [ args ]);

        publish(channelName, ...args) {
            if (channelName && channelName !== '') {
                let channel = this.getChannel(channelName, true);
                if (channel && channel.namespace === channelName) {
                    args.push(channel)
                    channel.publish(args);
                }
            }
        };

        clear() {
            this.channel.clear();
        };
    }

    // Alias some common names for easy interop
    Mediator.prototype.on = Mediator.prototype.subscribe;
    Mediator.prototype.trigger = Mediator.prototype.publish;

    // Finally, expose it all.

    Mediator.version = "0.9.9";

    return Mediator;
}));

(function (root, factory) {

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define('router/MatchBinding',factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.UrlManager              = root.UrlManager || {};
        root.UrlManager.MatchBinding = factory();
    }
}(this, function () {
    function MatchBinding(pattern, location) {
        if (location === '') {
            this.pattern = location = pattern.replace(/^\(\/\)/g, '').replace(/^\/|$/g, '');
        } else {
            this.pattern = pattern;
            location     = (location + pattern);
        }
        this.location = location.replace(/\((.*?)\)/g, '$1').replace(/^\/|$/g, '');

        var route = this.pattern.replace(MatchBinding.ESCAPE_PARAM, '\\$&')
            .replace(MatchBinding.OPTIONAL_PARAM, '(?:$1)?')
            .replace(MatchBinding.NAMED_PARAM, function (match, optional) {
                         return optional ? match : '([^\/]+)';
                     }).replace(MatchBinding.SPLAT_PARAM, '(.*?)');

        this.patternRegExp = new RegExp('^' + route);
        this.routeHandler  = [];
        this.leaveHandler  = [];
        this.queryHandler  = [];
        this.routes        = [];
    }

    MatchBinding.prototype.onBind    = function () {
    };
    MatchBinding.prototype.setOnBind = function (onBinding) {
        this.onBind = onBinding
    };
    MatchBinding.prototype.rebind    = function () {
        if (this.onBind !== undefined) {
            this.onBind();
        }
    };

    MatchBinding.prototype.setRoutes = function (routes) {
        this.routes.push(routes);
        return this;
    };

    MatchBinding.prototype.getRoutes = function () {
        return this.routes;
    };

    MatchBinding.prototype.to              = function (routeHandler) {
        this.routeHandler.push(routeHandler);
        return this;
    };
    MatchBinding.prototype.leave           = function (leaveHandler) {
        this.leaveHandler.push(leaveHandler);
        return this;
    };
    MatchBinding.prototype.query           = function (queryHandler) {
        this.queryHandler.push(queryHandler);
        return this;
    };
    MatchBinding.prototype.remove          = function () {
        this.routes.splice(0, this.routes.length);
        this.routeHandler.splice(0, this.routeHandler.length);
        this.leaveHandler.splice(0, this.leaveHandler.length);
        this.queryHandler.splice(0, this.queryHandler.length);
        return this;
    };
    MatchBinding.prototype.test            = function (location) {
        return this.patternRegExp.test(location);
    };
    MatchBinding.prototype.getFragment     = function (location) {
        var subLocation = this.applyParams(location);
        return location.replace(subLocation, '');
    };
    MatchBinding.prototype.applyParams     = function (location) {
        var matches  = this.pattern.replace(/\((.*?)\)/g, '$1').split('/');
        var matches2 = location.split('/');
        return matches2.splice(0, matches.length).join('/');
    };
    MatchBinding.prototype.extractParams   = function (fragment) {
        var params = this.patternRegExp.exec(fragment).slice(1);
        return params.map(function (param) {
            return param ? decodeURIComponent(param) : null;
        });
    };
    MatchBinding.prototype.setSubBinder    = function (subBinder) {
        this.subBinder = subBinder;
        return subBinder;
    };
    MatchBinding.prototype.getSubBinder    = function () {
        return this.subBinder;
    };
    MatchBinding.prototype.getHandler      = function () {
        return this.routeHandler;
    };
    MatchBinding.prototype.getLeaveHandler = function () {
        return this.leaveHandler;
    };
    MatchBinding.prototype.getQueryHandler = function () {
        return this.queryHandler;
    };

    MatchBinding.OPTIONAL_PARAM = /\((.*?)\)/g;
    MatchBinding.NAMED_PARAM    = /(\(\?)?:\w+/g;
    MatchBinding.SPLAT_PARAM    = /\*\w+/g;
    MatchBinding.ESCAPE_PARAM   = /[\-{}\[\]+?.,\\\^$|#\s]/g;

    return MatchBinding;
}));
(function (root, factory) {

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define('router/MatchBinder',[
            './MatchBinding'
        ], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('./MatchBinding'));
    } else {
        // Browser globals (root is window)
        root.UrlManager = root.UrlManager || {};
        root.UrlManager.MatchBinder = factory(root.UrlManager.MatchBinding);
    }
}(this, function (MatchBinding) {
    function MatchBinder(location, params, command, root) {
        this.bindings = [];
        this.location = root || location || '';
        this.command = command;
        this.params = params;

    }

    MatchBinder.prototype.match = function (pattern, mapHandler) {
        var binding = this.getMatchBinding(pattern, this.location);
        this.bindings.push(binding);
            var subBinder = this.getSubBinder(this.location + pattern);
            binding.setSubBinder(subBinder);
        if (mapHandler) {
            mapHandler(subBinder.match.bind(subBinder));
        }
        return binding;
    };
    MatchBinder.prototype.getSubBinder = function (pattern) {
        return new MatchBinder(pattern);
    };
    MatchBinder.prototype.getMatchBinding = function (pattern, root) {
        return new MatchBinding(pattern, root);
    };
    MatchBinder.prototype.filter = function (location) {
        return this.bindings.filter(function (binding) {
            return binding.test(location);
        });
    };
    MatchBinder.prototype.run = function () {
        this.command(this);
    };
    return MatchBinder;
}));

/*globals define*/
(function (root, factory) {

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define('router/Router',[
            './MatchBinder'
        ], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('./MatchBinder'));
    } else {
        // Browser globals (root is window)
        root.UrlManager = root.UrlManager || {};
        root.UrlManager.Router = factory(root.UrlManager.MatchBinder);
    }
}(this, function (MatchBinder) {
    'use strict';

    // attach the .equals method to Array's prototype to call it on any array
    Array.prototype.equals = function (array) {
        // if the other array is a falsy value, return
        if (!array)
            return false;
        // compare lengths - can save a lot of time
        if (this.length != array.length)
            return false;

        for (var i = 0, l = this.length; i < l; i++) {
            // Check if we have nested arrays
            if (this[i] instanceof Array && array[i] instanceof Array) {
                // recurse into the nested arrays
                if (!this[i].equals(array[i]))
                    return false;
            }
            else if (this[i] != array[i]) {
                // Warning - two different object instances will never be equal: {x:20} != {x:20}
                return false;
            }
        }
        return true;
    };

    function parseParams(value) {
        try {
            return decodeURIComponent(value.replace(/\+/g, ' '));
        }
        catch (err) {
            // Failover to whatever was passed if we get junk data
            return value;
        }
    }

    function iterateQueryString(queryString, callback) {
        var keyValues = queryString.split('&');
        keyValues.forEach(function (keyValue) {
            var arr = keyValue.split('=');
            callback(arr.shift(), arr.join('='));
        });
    }

    function getLocation(fragment, isQuery, params, location) {
        var current = params.root.substring(0, params.root.length - location.length), newQuery;
        fragment = fragment || '';
        if (isQuery === true) {
            newQuery = this.serialize(params.query);
        }
        else if (isQuery === false) {
            newQuery = '';
        }
        else {
            newQuery = this.serialize(isQuery);
        }
        return current + fragment + (newQuery.length === 0 ? '' : '?' + newQuery);
    }

    function Router() {
        this.root = this.getBinder();
        this.bindings = [];
    }

    Router.prototype.getBinder = function () {
        return new MatchBinder();
    };
    Router.prototype.match = function (mapHandler) {
        mapHandler(this.root.match.bind(this.root));
    };
    Router.prototype.trigger = function (location) {
        if (this.started) {
            var parts = location.split('?', 2);
            var query = {};
            if (parts[1]) {
                iterateQueryString(parts[1], function (name, value) {
                    value = parseParams(value);
                    if (!query[name]) {
                        query[name] = value;
                    }
                    else if (typeof query[name] === 'string') {
                        query[name] = [query[name], value];
                    }
                    else {
                        query[name].push(value);
                    }
                });
            }
            var loc = parts[0].replace(/^\/|$/g, ''),
                params = {
                    root: loc,
                    query: query
                },
                notValid = [],
                matched = false;

            this.bindings.forEach(function (binder) {
                var fragment,
                    pattern = binder.pattern.replace(/\((.*?)\)/g, '$1').replace(/^\//, '').split('/'),
                    binderLocation = binder.location.split('/'),
                    prevLoc = binder.prevLoc.replace(/^\//, '').split('/'),
                    checkSegment = function (link) {
                        var currSegment = link.splice(binderLocation.length - pattern.length, pattern.length),
                            prevSegment = prevLoc.splice(0, pattern.length);
                        return (!currSegment.equals(prevSegment));
                    };
                fragment = checkSegment(matched || loc.split('/'));
                if (fragment) {
                    matched = loc.split('/').splice(0, binderLocation.length - pattern.length);
                    var handler = binder.getLeaveHandler(),
                        args = [];
                    binder.setOnBind();

                    this.applyHandler(handler, args, params, location);
                    notValid.push(binder);
                }
            }.bind(this));

            notValid.forEach(function (binder) {
                this.bindings.splice(this.bindings.indexOf(binder), 1);
            }.bind(this));

            this.find(this.root, loc, params);
        }
    };
    Router.prototype.find = function (binder, location, params) {
        var bindings = binder.filter(location);
        bindings.forEach(this.onBinding.bind(this, location, params));
    };

    Router.prototype.execute = function (binder) {
        var binderlocation = binder.location.split('/'),
            rootLocation = binder.params.root.split('/'),
            location = '/' + rootLocation.splice(binderlocation.length, rootLocation.length -
                                                                        binderlocation.length).join('/');
        this.find(binder, location, binder.params);
    };

    Router.prototype.onBinding = function (location, params, binding) {
        binding.setOnBind(this.onBinding.bind(this, location, params, binding))
        this.runHandler(location, params, binding);
        var fragment = binding.getFragment(location);
        var subBinder = binding.getSubBinder();
        if (subBinder && subBinder.bindings && subBinder.bindings.length > 0) {
            this.find(subBinder, fragment, params);
        }
        var subRoutes = binding.getRoutes();
        if (subRoutes && subRoutes.length > 0) {
            while (subRoutes.length > 0) {
                var Route = subRoutes[0],
                    binder = new MatchBinder(binding.getFragment(location), params, this.execute.bind(this), binding.location);
                Route(binder);
                subBinder.bindings = subBinder.bindings.concat(binder.bindings);
                subRoutes.shift();
            }
        }

    };

    Router.prototype.serialize = function (obj) {
        var str = [];
        for (var p in obj)
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        return str.join("&");
    };
    Router.prototype.runHandler = function (location, params, binding) {

        if (this.bindings.indexOf(binding) === -1) {
            var handler = binding.getHandler();
            var args = binding.extractParams(location);

            binding.prevLoc = location;

            this.applyHandler(handler, args, params, location);
            this.bindings.push(binding);
        }

        var handler = binding.getQueryHandler();
        if (handler) {
            var args = [];
            this.applyHandler(handler, args, params, location);
        }

    };
    Router.prototype.applyHandler = function (handlers, args, params, location) {
        if (handlers && handlers.length > 0) {
            handlers.forEach(function (handler) {
                handler.apply(this, args.concat({
                    getQuery: function () {
                        return params.query;
                    },
                    getLocation: function (fragment, isQuery) {
                        return getLocation.call(this, fragment, isQuery, params, location)
                    }.bind(this)
                }));
            }.bind(this));
        }
    };
    Router.prototype.start = function () {
        this.started = true;
    };
    Router.prototype.stop = function () {
        this.started = false;
    };

    return Router;
}));

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
    './Mediator',
    'router/Router'
], function (Mediator, Router) {
    'use strict';
    function triggerRoute(router) {
        router.start();
        function onHashChange() {
            let match = window.location.href.match(/#(.*)$/);
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
    class App {
        static extend(options = {}) {
            class Surrogate extends App {
            }
            Object.assign(Surrogate.prototype, options);
            return Surrogate;
        };

        constructor(options) {
            options = options || {};
            let router = new Router();

            this.beforeInit.apply(this, arguments);
            this.context = Object.assign(this.setContext.apply(this, arguments), {
                // Creating `EventBus` More info look in `Mediator` Section
                eventBus: new Mediator(this.context, (channel, scope)=> {
                    scope._globalEvents = scope._globalEvents || [];
                    if (scope._globalEvents.indexOf(channel) === -1) {
                        scope._globalEvents.push(channel);
                    }
                })
            });

            if (this.AppContainer !== undefined) {
                this.appContainer = new this.AppContainer({
                    appContext: this.context
                });

                let mapHandler = (this.appContainer._match !== undefined) ? this.appContainer._match : ()=> {
                };

                if (options.rootRoute !== undefined) {
                    router.match((match)=> {
                        match(options.rootRoute, mapHandler);
                    });
                } else {
                    router.match(mapHandler);
                }

                this.el = this.appContainer.el;

                triggerRoute(router);

            }
            this.init.apply(this, arguments);
        }


        // Running 'AppContainer' is initialised.
        //
        //      @method beforeInit
        beforeInit() {
        };

        // Running after 'AppContainer' is initialised.
        //
        //      @method init
        init() {
        };

        // SettingContext for the `App`
        //
        //      @method setContext
        setContext() {
            return {};
        }

        // Starting `App` in provided `Container`
        //
        //      @method start
        //      @param {HTMLElement} container
        start(container) {
            if (container instanceof HTMLElement === true) {
                container.appendChild(this.el);
                setTimeout(() => {
                    this.el.classList.add('show');
                }, 100);
            } else {
                throw Error('Contaner should be a HTML element');
            }
        }
    }
    ;
    return App;
});
