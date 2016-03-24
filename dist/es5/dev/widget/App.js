'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*jslint bitwise: true, nomen: true, plusplus: true, white: true */

/*!
 * Mediator Library v0.9.9
 *
 */

(function (global, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD
        define('widget/Mediator', [], function () {
            return factory();
        });
    } else if (typeof exports !== 'undefined') {
        // Node/CommonJS
        exports.Mediator = factory();
    } else {
        // Browser global
        global.Mediator = factory();
    }
})(undefined, function () {
    'use strict';

    // Subscribers are instances of Mediator Channel registrations. We generate
    // an object instance so that it can be updated later on without having to
    // unregister and re-register. Subscribers are constructed with a function
    // to be called, options object, and context.

    var Subscriber = function () {
        function Subscriber(fn, options) {
            var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
            var channel = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

            _classCallCheck(this, Subscriber);

            this.fn = fn;
            this.channel = channel;
            this.context = context;
            this.options = options;
        }

        _createClass(Subscriber, [{
            key: 'update',


            // Mediator.update on a subscriber instance can update its function,context,
            // or options object. It takes in an object and looks for fn, context, or
            // options keys.
            value: function update() {
                var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

                Object.assign(this, options);
                if (this.channel) {
                    this.setPriority(this.priority);
                }
            }
        }, {
            key: 'setHook',
            value: function setHook(context) {
                var channel = this.channel;
                if (channel) {
                    channel.hook(this, context);
                }
            }
        }, {
            key: '_reduceCalls',
            value: function _reduceCalls() {
                // Check if the subscriber has options and if this include the calls options
                if (this.calls !== undefined) {
                    // Decrease the number of calls left by one
                    this.calls--;
                    // Once the number of calls left reaches zero or less we need to remove the subscriber
                    if (this.calls < 1) {
                        this.remove();
                    }
                }
            }
        }, {
            key: 'remove',


            //return event remove method
            value: function remove() {
                var channel = this.channel;
                if (channel) {
                    channel.removeSubscriber(this);
                }
            }
        }, {
            key: 'setPriority',


            //Dynamic setPriority method
            value: function setPriority(priority) {
                var channel = this.channel;
                if (channel) {
                    channel.setPriority(this, priority);
                }
            }
        }, {
            key: 'run',
            value: function run(data) {
                if (!this.channel.stopped && !(typeof this.predicate === "function" && !this.predicate.apply(this.context, data))) {
                    // Check if the callback should be called
                    this._reduceCalls();
                    //Execute function.
                    this.fn.apply(this.context, data);
                }
            }
        }, {
            key: 'options',
            set: function set(options) {
                this.update(options);
            }
        }, {
            key: 'context',
            set: function set(context) {
                this.setHook(context);
                this._context = context;
            },
            get: function get() {
                return this._context;
            }
        }]);

        return Subscriber;
    }();

    var Channel = function () {
        function Channel(namespace, parent, context, hook) {
            _classCallCheck(this, Channel);

            this.namespace = namespace || "";
            this._subscribers = [];
            this._channels = new Map();
            this._parent = parent;
            this.stopped = false;
            this.context = context;
            this.hook = hook;
        }

        _createClass(Channel, [{
            key: 'addSubscriber',


            // A Mediator channel holds a list of sub-channels and subscribers to be fired
            // when Mediator.publish is called on the Mediator instance. It also contains
            // some methods to manipulate its lists of data; only setPriority and
            // StopPropagation are meant to be used. The other methods should be accessed
            // through the Mediator instance.

            value: function addSubscriber(fn, options) {
                var context = arguments.length <= 2 || arguments[2] === undefined ? this.context : arguments[2];

                return new Subscriber(fn, options, context, this);
            }
        }, {
            key: 'stopPropagation',


            // The channel instance is passed as an argument to the mediator subscriber,
            // and further subscriber propagation can be called with
            // channel.StopPropagation().
            value: function stopPropagation() {
                this.stopped = true;
            }
        }, {
            key: 'setPriority',


            // Channel.setPriority is useful in updating the order in which Subscribers
            // are called, and takes an identifier (subscriber id or named function) and
            // an array index. It will not search recursively through subchannels.

            value: function setPriority(subscriber, priority) {
                var subscribers = this._subscribers,
                    index = subscribers.indexOf(subscriber);

                if (index !== -1) {
                    subscribers.splice(subscribers.indexOf(subscriber), 1);
                }

                if (priority !== undefined && priority < this._subscribers.length) {
                    subscribers.splice(priority, 0, subscriber);
                } else {
                    subscribers.push(subscriber);
                }
            }
        }, {
            key: 'hasChannel',
            value: function hasChannel(channel) {
                return this._channels.has(channel);
            }
        }, {
            key: 'getChannel',
            value: function getChannel(channel) {
                return this._channels.get(channel);
            }
        }, {
            key: 'setChannel',
            value: function setChannel(namespace, readOnly) {
                if (!this.hasChannel(namespace) && !readOnly) {
                    var channel = new Channel((this.namespace ? this.namespace + ':' : '') + namespace, this, this.context, this.hook);
                    this._channels.set(namespace, channel);
                    return channel;
                } else {
                    return this.getChannel(namespace);
                }
            }
        }, {
            key: 'returnChannel',
            value: function returnChannel(channels, readOnly) {
                if (channels && channels.length > 0) {
                    var channel = channels.shift(),
                        returnChannel = this.setChannel(channel, readOnly);
                    if (returnChannel && channels.length > 0) {
                        return returnChannel.returnChannel(channels, readOnly);
                    } else {
                        return returnChannel;
                    }
                }
            }
        }, {
            key: 'removeSubscriber',
            value: function removeSubscriber(subscriber) {
                var subscribers = this._subscribers,
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
            }
        }, {
            key: 'removeChannel',
            value: function removeChannel(channel) {
                if (channel === this.getChannel(channel.namespace)) {
                    this._channels.delete(channel.namespace);
                }
            }
        }, {
            key: 'clear',
            value: function clear() {
                this._channels.forEach(function (channel) {
                    return channel.clear();
                });
                this.removeSubscriber();
            }
        }, {
            key: 'publish',


            // This will publish arbitrary arguments to a subscriber and then to parent
            // channels.

            value: function publish(data) {
                //slice method are cloning array, means default array can remove handlers
                this._subscribers.slice().forEach(function (subscriber) {
                    return subscriber.run(data);
                });

                if (this._parent) {
                    this._parent.publish(data);
                }

                this.stopped = false;
            }
        }]);

        return Channel;
    }();

    var Mediator = function () {
        function Mediator() {
            var context = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
            var hook = arguments.length <= 1 || arguments[1] === undefined ? function () {} : arguments[1];

            _classCallCheck(this, Mediator);

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

        _createClass(Mediator, [{
            key: 'getChannel',
            value: function getChannel(namespace, readOnly) {
                var namespaceHierarchy = namespace.split(':');
                if (namespaceHierarchy.length > 0) {
                    return this.channel.returnChannel(namespaceHierarchy, readOnly);
                }
            }
        }, {
            key: 'subscribe',


            // Pass in a channel namespace, function to be called, options, and context
            // to call the function in to Subscribe. It will create a channel if one
            // does not exist. Options can include a predicate to determine if it
            // should be called (based on the data published to it) and a priority
            // index.

            value: function subscribe(channelName, fn) {
                var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
                var context = arguments[3];

                if (channelName && channelName !== '') {
                    var channel = this.getChannel(channelName, false);
                    return channel.addSubscriber(fn, options, context);
                } else {
                    throw Error('Namespace should be provided!');
                }
            }
        }, {
            key: 'once',


            // Pass in a channel namespace, function to be called, options, and context
            // to call the function in to Subscribe. It will create a channel if one
            // does not exist. Options can include a predicate to determine if it
            // should be called (based on the data published to it) and a priority
            // index.

            value: function once(channelName, fn) {
                var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
                var context = arguments[3];

                options.calls = 1;
                return this.subscribe(channelName, fn, options, context);
            }
        }, {
            key: 'publish',


            // Publishes arbitrary data to a given channel namespace. Channels are
            // called recursively downwards; a post to application:chat will post to
            // application:chat:receive and application:chat:derp:test:beta:bananas.
            // Called using Mediator.publish("application:chat", [ args ]);

            value: function publish(channelName) {
                if (channelName && channelName !== '') {
                    var channel = this.getChannel(channelName, true);
                    if (channel && channel.namespace === channelName) {
                        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                            args[_key - 1] = arguments[_key];
                        }

                        args.push(channel);
                        channel.publish(args);
                    }
                }
            }
        }, {
            key: 'clear',
            value: function clear() {
                this.channel.clear();
            }
        }]);

        return Mediator;
    }();

    // Alias some common names for easy interop


    Mediator.prototype.on = Mediator.prototype.subscribe;
    Mediator.prototype.trigger = Mediator.prototype.publish;

    // Finally, expose it all.

    Mediator.version = "0.9.9";

    return Mediator;
});

(function (root, factory) {

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define('router/MatchBinding', factory);
    } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.UrlManager = root.UrlManager || {};
        root.UrlManager.MatchBinding = factory();
    }
})(undefined, function () {
    function MatchBinding(pattern, location) {
        if (location === '') {
            this.pattern = location = pattern.replace(/^\(\/\)/g, '').replace(/^\/|$/g, '');
        } else {
            this.pattern = pattern;
            location = location + pattern;
        }
        this.location = location.replace(/\((.*?)\)/g, '$1').replace(/^\/|$/g, '');

        var route = this.pattern.replace(MatchBinding.ESCAPE_PARAM, '\\$&').replace(MatchBinding.OPTIONAL_PARAM, '(?:$1)?').replace(MatchBinding.NAMED_PARAM, function (match, optional) {
            return optional ? match : '([^\/]+)';
        }).replace(MatchBinding.SPLAT_PARAM, '(.*?)');

        this.patternRegExp = new RegExp('^' + route);
        this.routeHandler = [];
        this.leaveHandler = [];
        this.queryHandler = [];
        this.routes = [];
    }

    MatchBinding.prototype.onBind = function () {};
    MatchBinding.prototype.setOnBind = function (onBinding) {
        this.onBind = onBinding;
    };
    MatchBinding.prototype.rebind = function () {
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

    MatchBinding.prototype.to = function (routeHandler) {
        this.routeHandler.push(routeHandler);
        return this;
    };
    MatchBinding.prototype.leave = function (leaveHandler) {
        this.leaveHandler.push(leaveHandler);
        return this;
    };
    MatchBinding.prototype.query = function (queryHandler) {
        this.queryHandler.push(queryHandler);
        return this;
    };
    MatchBinding.prototype.remove = function () {
        this.routes.splice(0, this.routes.length);
        this.routeHandler.splice(0, this.routeHandler.length);
        this.leaveHandler.splice(0, this.leaveHandler.length);
        this.queryHandler.splice(0, this.queryHandler.length);
        return this;
    };
    MatchBinding.prototype.test = function (location) {
        return this.patternRegExp.test(location);
    };
    MatchBinding.prototype.getFragment = function (location) {
        var subLocation = this.applyParams(location);
        return location.replace(subLocation, '');
    };
    MatchBinding.prototype.applyParams = function (location) {
        var matches = this.pattern.replace(/\((.*?)\)/g, '$1').split('/');
        var matches2 = location.split('/');
        return matches2.splice(0, matches.length).join('/');
    };
    MatchBinding.prototype.extractParams = function (fragment) {
        var params = this.patternRegExp.exec(fragment).slice(1);
        return params.map(function (param) {
            return param ? decodeURIComponent(param) : null;
        });
    };
    MatchBinding.prototype.setSubBinder = function (subBinder) {
        this.subBinder = subBinder;
        return subBinder;
    };
    MatchBinding.prototype.getSubBinder = function () {
        return this.subBinder;
    };
    MatchBinding.prototype.getHandler = function () {
        return this.routeHandler;
    };
    MatchBinding.prototype.getLeaveHandler = function () {
        return this.leaveHandler;
    };
    MatchBinding.prototype.getQueryHandler = function () {
        return this.queryHandler;
    };

    MatchBinding.OPTIONAL_PARAM = /\((.*?)\)/g;
    MatchBinding.NAMED_PARAM = /(\(\?)?:\w+/g;
    MatchBinding.SPLAT_PARAM = /\*\w+/g;
    MatchBinding.ESCAPE_PARAM = /[\-{}\[\]+?.,\\\^$|#\s]/g;

    return MatchBinding;
});
(function (root, factory) {

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define('router/MatchBinder', ['./MatchBinding'], factory);
    } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('./MatchBinding'));
    } else {
        // Browser globals (root is window)
        root.UrlManager = root.UrlManager || {};
        root.UrlManager.MatchBinder = factory(root.UrlManager.MatchBinding);
    }
})(undefined, function (MatchBinding) {
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
});

/*globals define*/
(function (root, factory) {

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define('router/Router', ['./MatchBinder'], factory);
    } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('./MatchBinder'));
    } else {
        // Browser globals (root is window)
        root.UrlManager = root.UrlManager || {};
        root.UrlManager.Router = factory(root.UrlManager.MatchBinder);
    }
})(undefined, function (MatchBinder) {
    'use strict';

    // attach the .equals method to Array's prototype to call it on any array

    Array.prototype.equals = function (array) {
        // if the other array is a falsy value, return
        if (!array) return false;
        // compare lengths - can save a lot of time
        if (this.length != array.length) return false;

        for (var i = 0, l = this.length; i < l; i++) {
            // Check if we have nested arrays
            if (this[i] instanceof Array && array[i] instanceof Array) {
                // recurse into the nested arrays
                if (!this[i].equals(array[i])) return false;
            } else if (this[i] != array[i]) {
                // Warning - two different object instances will never be equal: {x:20} != {x:20}
                return false;
            }
        }
        return true;
    };

    function parseParams(value) {
        try {
            return decodeURIComponent(value.replace(/\+/g, ' '));
        } catch (err) {
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
        var current = params.root.substring(0, params.root.length - location.length),
            newQuery;
        fragment = fragment || '';
        if (isQuery === true) {
            newQuery = this.serialize(params.query);
        } else if (isQuery === false) {
            newQuery = '';
        } else {
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
                    } else if (typeof query[name] === 'string') {
                        query[name] = [query[name], value];
                    } else {
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
                    checkSegment = function checkSegment(link) {
                    var currSegment = link.splice(binderLocation.length - pattern.length, pattern.length),
                        prevSegment = prevLoc.splice(0, pattern.length);
                    return !currSegment.equals(prevSegment);
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
            location = '/' + rootLocation.splice(binderlocation.length, rootLocation.length - binderlocation.length).join('/');
        this.find(binder, location, binder.params);
    };

    Router.prototype.onBinding = function (location, params, binding) {
        binding.setOnBind(this.onBinding.bind(this, location, params, binding));
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
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        }return str.join("&");
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
                    getQuery: function getQuery() {
                        return params.query;
                    },
                    getLocation: function (fragment, isQuery) {
                        return getLocation.call(this, fragment, isQuery, params, location);
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
define('widget/App', ['./Mediator', 'router/Router'], function (Mediator, Router) {
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

    var App = function () {
        _createClass(App, null, [{
            key: 'extend',
            value: function extend() {
                var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

                var Surrogate = function (_App) {
                    _inherits(Surrogate, _App);

                    function Surrogate() {
                        _classCallCheck(this, Surrogate);

                        return _possibleConstructorReturn(this, Object.getPrototypeOf(Surrogate).apply(this, arguments));
                    }

                    return Surrogate;
                }(App);

                Object.assign(Surrogate.prototype, options);
                return Surrogate;
            }
        }]);

        function App(options) {
            var _this2 = this;

            _classCallCheck(this, App);

            options = options || {};
            var router = new Router();

            this.beforeInit.apply(this, arguments);
            this.context = Object.assign(this.setContext.apply(this, arguments), {
                // Creating `EventBus` More info look in `Mediator` Section
                eventBus: new Mediator(this.context, function (channel, scope) {
                    scope._globalEvents = scope._globalEvents || [];
                    if (scope._globalEvents.indexOf(channel) === -1) {
                        scope._globalEvents.push(channel);
                    }
                })
            });

            if (this.AppContainer !== undefined) {
                (function () {
                    _this2.appContainer = new _this2.AppContainer({
                        appContext: _this2.context
                    });

                    var mapHandler = _this2.appContainer._match !== undefined ? _this2.appContainer._match : function () {};

                    if (options.rootRoute !== undefined) {
                        router.match(function (match) {
                            match(options.rootRoute, mapHandler);
                        });
                    } else {
                        router.match(mapHandler);
                    }

                    _this2.el = _this2.appContainer.el;

                    triggerRoute(router);
                })();
            }
            this.init.apply(this, arguments);
        }

        // Running 'AppContainer' is initialised.
        //
        //      @method beforeInit


        _createClass(App, [{
            key: 'beforeInit',
            value: function beforeInit() {}
        }, {
            key: 'init',


            // Running after 'AppContainer' is initialised.
            //
            //      @method init
            value: function init() {}
        }, {
            key: 'setContext',


            // SettingContext for the `App`
            //
            //      @method setContext
            value: function setContext() {
                return {};
            }

            // Starting `App` in provided `Container`
            //
            //      @method start
            //      @param {HTMLElement} container

        }, {
            key: 'start',
            value: function start(container) {
                var _this3 = this;

                if (container instanceof HTMLElement === true) {
                    container.appendChild(this.el);
                    setTimeout(function () {
                        _this3.el.classList.add('show');
                    }, 100);
                } else {
                    throw Error('Contaner should be a HTML element');
                }
            }
        }]);

        return App;
    }();

    ;
    return App;
});
//# sourceMappingURL=App.js.map
