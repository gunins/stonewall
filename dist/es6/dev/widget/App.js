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

/*globals define*/
(function(root, factory) {

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define('router/utils',[], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    }
}(this, function() {
    'use strict';

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
        let keyValues = queryString.split('&');
        keyValues.forEach((keyValue)=> {
            let arr = keyValue.split('=');
            callback(arr.shift(), arr.join('='));
        });
    }

    function setQuery(parts) {
        let query = {};
        if (parts) {
            iterateQueryString(parts, (name, value)=> {
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
        return query;
    }

    function serialize(obj) {
        let str = [];
        for (let p in obj)
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        return str.join("&");
    };

    function getLocation(params, pattern) {

        return {
            getQuery() {
                return params.query;
            },
            getLocation(fragment = '', isQuery) {
                let current = params.root.substring(0, params.root.length - pattern.length),
                    newQuery;

                if (isQuery === true) {
                    newQuery = serialize(params.query);
                }
                else if (isQuery === false) {
                    newQuery = '';
                }
                else {
                    newQuery = serialize(isQuery);
                }
                return current + fragment + (newQuery.length === 0 ? '' : '?' + newQuery);
            }
        }
    };

    // attach the .equals method to Array's prototype to call it on any array
    function equals(arr1, arr2) {
        // if the other arr2 is a falsy value, return
        if (!arr2)
            return false;
        // compare lengths - can save a lot of time
        if (arr1.length !== arr2.length)
            return false;

        for (let i = 0, l = arr1.length; i < l; i++) {
            // Check if we have nested arrays
            if (arr1[i] instanceof Array && arr2[i] instanceof Array) {
                // recurse into the nested arrays
                if (!equals(arr1[i], arr2[i]))
                    return false;
            }
            else if (arr1[i] !== arr2[i]) {
                // Warning - two different object instances will never be equal: {x:20} != {x:20}
                return false;
            }
        }
        return true;
    };
    const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,
        ARGUMENT_NAMES = /(?:^|,)\s*([^\s,=]+)/g;

    function getArgs(func) {
        let fnStr = func.toString().replace(STRIP_COMMENTS, ''),
            argsList = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')),
            result = argsList.match(ARGUMENT_NAMES);
        return (result === null) ? [] : result.map(item=>item.replace(/[\s,]/g, ''));
    }

    return {
        serialize, getLocation, equals, setQuery, getArgs
    }

}));
(function(root, factory) {

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define('router/MatchBinding',[
            './utils'
        ], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('./utils'));
    }
}(this, function(utils) {
    'use strict';


    class MatchBinding {
        constructor(pattern, location, binder) {
            if (binder) {
                this.binder = binder;
            }
            if (location === '') {
                this.pattern = pattern.replace(/^\(\/\)/g, '').replace(/^\/|$/g, '');
            } else {
                let match = pattern.match(/^(\/|\(\/)/g);
                if (match === null) {
                    pattern = pattern[0] === '(' ? '(/' + pattern.substring(1) : '/' + pattern;
                }
                this.pattern = pattern;
            }

            let route = this.pattern.replace(MatchBinding.ESCAPE_PARAM, '\\$&')
                .replace(MatchBinding.OPTIONAL_PARAM, '(?:$1)?')
                .replace(MatchBinding.NAMED_PARAM, function(match, optional) {
                    return optional ? match : '([^\/]+)';
                }).replace(MatchBinding.SPLAT_PARAM, '(.*)');

            this.patternRegExp = new RegExp('^' + route);

            this.routeHandler = new Set();
            this.leaveHandler = new Set();
            this.queryHandler = new Set();
            this._active = false;
        }

        setRoutes(mapHandler) {
            var subBinder = this.subBinder;
            mapHandler({
                match: subBinder.match.bind(subBinder)
            });
            return this;
        };

        reTrigger() {
            this.binder.reTrigger();
        }

        match(match) {
            var subBinder = this.subBinder;
            match(subBinder.match.bind(subBinder));
            return this;
        };

        to(routeHandler) {
            this.routeHandler.add({handler: routeHandler, done: false});
            this.reTrigger();
            return this;
        };

        leave(leaveHandler) {
            var args = utils.getArgs(leaveHandler);
            this.leaveHandler.add({handler: leaveHandler, done: (args.length > 0 && args[0] === 'done')});
            return this;
        };

        query(queryHandler) {
            this.queryHandler.add({handler: queryHandler, done: false});
            return this;
        };

        remove() {
            this.routeHandler.clear();
            this.leaveHandler.clear();
            this.queryHandler.clear();
            this.subBinder.remove();
            return this;
        };

        test(location) {
            return this.patternRegExp.test(location);
        };

        getFragment(location) {
            let matches = location.match(this.patternRegExp);
            return matches === null ? '' : location.substring(matches[0].length);
        };

        extractParams(fragment) {
            let params = this.patternRegExp.exec(fragment)
            if (params && params.length > 0) {
                return params.slice(1).map(function(param) {
                    return param ? decodeURIComponent(param) : null;
                });
            } else {
                return [];
            }
        };

        setSubBinder(MatchBinder, pattern, mapHandler) {
            let subBinder = new MatchBinder(pattern, this);
            this.subBinder = subBinder;
            if (typeof mapHandler === 'function') {
                mapHandler(subBinder.match.bind(subBinder));
            }
            return subBinder;
        };


        checkSegment(matched, params) {
            let status = [];
            if (this._active) {
                let pattern = this.pattern.replace(/\((.*?)\)/g, '$1').replace(/^\//, '').split('/'),
                    prevLoc = this.prevLoc.replace(/^\//, '').split('/'),
                    currSegment = matched.slice(0, pattern.length),
                    prevSegment = prevLoc.slice(0, pattern.length),
                    equals = (utils.equals(currSegment, prevSegment));

                if (!equals) {
                    status = this.clearActive(params);
                } else if (matched.length > 1) {
                    status = this.subBinder.checkStatus(matched.slice(pattern.length), params);
                } else if (equals) {
                    status = this.subBinder.clearActive(params);
                }
            }
            return status;
        }

        clearActive(params) {
            let active = [];
            if (this._active) {
                active.push({
                    handler: this.triggerLeave(params),
                    disable: this.disable.bind(this)
                });
            }

            return active.concat(this.subBinder.clearActive());
        }

        disable() {
            this._active = false;
        }

        triggerTo(location, params) {
            if (this.test(location)) {
                // check if to is triggered
                if (!this._active) {
                    this.prevLoc = location;
                    let args = this.extractParams(location).concat(utils.getLocation(params, location));
                    this.applyHandlers(this.routeHandler, args)
                    this._active = true;
                }

                // trigger query handler
                this.applyHandlers(this.queryHandler, [utils.getLocation(params, location)]);

                let fragment = this.getFragment(location);
                if (fragment.trim() !== '') {
                    let subBinder = this.subBinder;
                    if (subBinder) {
                        subBinder.triggerRoutes(fragment, params);
                    }
                }
            }
        };

        applyHandlers(handlers, args = []) {
            if (handlers && handlers.size > 0) {
                handlers.forEach((item)=> {
                    item.handler.apply(this, args);
                });
            }
        };

        triggerLeave(params) {
            return new Promise((resolve)=> {
                let handlers = this.leaveHandler,
                    location = utils.getLocation(params, this.prevLoc),
                    items = 0,
                    stopped = false;
                if (handlers && handlers.size > 0) {
                    handlers.forEach((item)=> {
                        if (item.done) {
                            items++;
                        }
                        item.handler((done = true)=> {
                            if (done) {
                                items--;
                                if (items === 0 && !stopped) {
                                    resolve(true);
                                }
                            } else if (!done && !stopped) {
                                stopped = true;
                                resolve(false);
                            }
                        }, location);
                    });
                }
                if (items === 0) {
                    resolve(true);
                }
            });
        };


    }

    Object.assign(MatchBinding, {
        OPTIONAL_PARAM: /\((.*?)\)/g,
        NAMED_PARAM:    /(\(\?)?:\w+/g,
        SPLAT_PARAM:    /\*\w+/g,
        ESCAPE_PARAM:   /[\-{}\[\]+?.,\\\^$|#\s]/g
    });

    return MatchBinding;
}));
(function(root, factory) {

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
}(this, function(MatchBinding) {
    'use strict';

    class MatchBinder {
        constructor(location, parent) {
            this._parent = parent;
            this.bindings = new Set();
            this.location = location || '';
            this._active = false;

        }

        reTrigger() {
            this._parent.reTrigger();
        };

        match(pattern, mapHandler) {
            if (typeof pattern === 'function') {
                mapHandler = pattern;
                pattern = false;
            }
            if (pattern === '') {
                pattern = false;
            }
            return this.getMatchBinding(pattern, mapHandler);
        };

        getMatchBinding(pattern, mapHandler) {
            if (pattern) {
                let binding = new MatchBinding(pattern, this.location, this);
                binding.setSubBinder(MatchBinder, this.location + (pattern || ''), mapHandler);
                this.bindings.add(binding);
                return binding;
            } else {
                if (typeof mapHandler === 'function') {
                    mapHandler(this.match.bind(this));
                }
                return {
                    match: this.match.bind(this)
                }
            }
        };

        clearActive(params, location) {
            let active = [];
            if (this.bindings.size > 0) {
                this.bindings.forEach((binding)=> {
                    active = active.concat(binding.clearActive(params, location));
                });
            }
            return active;
        };

        checkStatus(matched, params) {
            let active = []
            if (this.bindings.size > 0) {
                this.bindings.forEach((binding)=> {
                    active = active.concat(binding.checkSegment(matched, params));
                });
            }
            return active;
        };

        remove() {
            if (this.bindings.size > 0) {
                this.bindings.forEach((binding)=> binding.remove());
            }
        };

     

        triggerRoutes(location, params) {
            if (this.bindings.size > 0) {
                this.bindings.forEach(binding=>binding.triggerTo(location, params))
            }
        }
    }

    return MatchBinder;
}));

/*globals define*/
(function(root, factory) {

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define('router/Router',[
            './MatchBinder',
            './utils'
        ], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('./MatchBinder'), require('./utils'));
    }
}(this, function(MatchBinder, utils) {
        'use strict';

        class Router {
            constructor(location) {
                if (location !== undefined && location !== '') {
                    this._location = location.replace(/^\/|\/$/g, '') + '/';
                }
                this.root = this.getBinder();
                this._listeners = new Set();
                this._handlers = new Set();
            };

            getBinder() {
                return new MatchBinder('', this);
            };

            test(loc) {
                return new RegExp('^' + this._location, 'g').test(loc);
            }

            getLocation(loc) {
                let location = loc.replace(/^\/|$/g, '');
                if (this._location !== undefined) {
                    if (this.test(location)) {
                        return location.replace(this._location, '');
                    } else {
                        return false;
                    }
                }
                return location;
            };

            reTrigger() {
                if (this.currLocation) {
                    this.trigger(this.currLocation);
                }
            };


            trigger(location) {
                if (this.started) {
                    // this.started = false;
                    this.currLocation = location;
                    let parts = location.split('?', 2),
                        segments = this.getLocation(parts[0]);
                    if (segments || segments === '') {
                        let query = utils.setQuery(parts[1]),
                            params = {
                                root:  segments,
                                query: query
                            };
                        this.execute(segments, params)
                            .then(move=>this.setRoutes(move, segments, params))
                            .then(move=> this.setLocation(move));
                    }
                }
            };

            execute(location, params) {
                return new Promise((resolve)=> {
                    let matched = location.replace(/^\/|$/g, '').split('/'),
                        binder = this.root,
                        active = binder.checkStatus(matched, params);
                    if (active.length > 0) {
                        active.forEach((item)=> {
                            item.handler.then((applied)=> {
                                if (!item.triggered) {
                                    item.triggered = true;
                                    item.applied = applied;
                                    if (active.filter(item=>item.applied).length === active.length) {
                                        active.forEach(item=>item.disable());
                                        resolve(true);
                                    } else if (active.filter(item=>item.triggered).length === active.length) {
                                        resolve(false);
                                    }
                                }
                            });
                        });
                    } else {
                        resolve(true);
                    }
                });
            };

            setRoutes(move, location, params) {
                if (move) {
                    this._handlers.forEach(handler=>handler());
                    this.root.triggerRoutes(location, params);
                }
                return move;
            };

            setListener(listener) {
                let listeners = this._listeners;
                listeners.add(listener);
                return {
                    remove(){
                        listeners.delete(listener);
                    }
                }
            };

            onRouteChange(handler) {
                let handlers = this._handlers;
                handlers.add(handler);
                return {
                    remove(){
                        handlers.delete(handler);
                    }
                }
            };


            setLocation(move) {
                let location = move ? this.currLocation : this.prevLocation;
                this.prevLocation = location;
                // this.started = true;
                this._listeners.forEach(listener=>listener(location, move));
            };

            match(mapHandler) {
                mapHandler(this.root.match.bind(this.root));
            };

            start() {
                this.started = true;
            };

            stop() {
                this.started = false;
            };
        }
        return Router;
    }
));

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
], function(Mediator, Router) {
    'use strict';
    function triggerRoute(router, active) {
        var activeLocation = '';

        router.setListener((location, move)=> {
            activeLocation = location;
            if (!move) {
                window.location.hash = location;
            }
        });

        router.onRouteChange(()=> {
            if (active.size > 0) {
                active.forEach(handler=>handler());
                active.clear();
            }
        });

        function onHashChange() {
            let match = window.location.href.match(/#(.*)$/),
                route = match ? match[1] : ''
            if (activeLocation !== route) {
                router.trigger(route);
            }
        };
        router.start();
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

        constructor(options = {}) {
            this.options = options;

            this.beforeInit.apply(this, arguments);


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
        };

        set context(context) {
            let router = new Router(this.options.rootRoute);
            router.match((match)=> {
                Object.assign(context, {
                    // Creating `EventBus` More info look in `Mediator` Section
                    eventBus: new Mediator(this.context, (channel, scope)=> {
                        scope._globalEvents = scope._globalEvents || [];
                        if (scope._globalEvents.indexOf(channel) === -1) {
                            scope._globalEvents.push(channel);
                        }
                    }),
                    active:   new Map(),
                    match:    match

                });

                triggerRoute(router, context.active);
                this._context = context;
            })
        }

        get context() {
            return this._context;
        }

        // Starting `App` in provided `Container`
        //
        //      @method start
        //      @param {HTMLElement} container
        start(container) {
            if (container instanceof HTMLElement === true) {

                this.context = this.setContext.apply(this, arguments);


                if (this.AppContainer !== undefined) {
                    this.appContainer = new this.AppContainer();
                }

                this.init.call(this, this.options);

                this.el = container;
                let el = document.createElement('div');
                container.appendChild(el);
                this.appContainer.ready(el);
                this.appContainer.setContext(this.context);


                setTimeout(() => {
                    container.classList.add('show');
                }, 100);
            } else {
                throw Error('Contaner should be a HTML element');
            }
        }
    }
    ;
    return App;
});
