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

/*globals define*/
(function (root, factory) {

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define('router/utils', [], factory);
    } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    }
})(undefined, function () {
    'use strict';

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

    function setQuery(parts) {
        var query = {};
        if (parts) {
            iterateQueryString(parts, function (name, value) {
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
        return query;
    }

    function serialize(obj) {
        var str = [];
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        }return str.join("&");
    };

    function getLocation(params, pattern) {

        return {
            getQuery: function getQuery() {
                return params.query;
            },
            getLocation: function getLocation() {
                var fragment = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
                var isQuery = arguments[1];

                var current = params.root.substring(0, params.root.length - pattern.length),
                    newQuery = void 0;

                if (isQuery === true) {
                    newQuery = serialize(params.query);
                } else if (isQuery === false) {
                    newQuery = '';
                } else {
                    newQuery = serialize(isQuery);
                }
                return current + fragment + (newQuery.length === 0 ? '' : '?' + newQuery);
            }
        };
    };

    // attach the .equals method to Array's prototype to call it on any array
    function equals(arr1, arr2) {
        // if the other arr2 is a falsy value, return
        if (!arr2) return false;
        // compare lengths - can save a lot of time
        if (arr1.length !== arr2.length) return false;

        for (var i = 0, l = arr1.length; i < l; i++) {
            // Check if we have nested arrays
            if (arr1[i] instanceof Array && arr2[i] instanceof Array) {
                // recurse into the nested arrays
                if (!equals(arr1[i], arr2[i])) return false;
            } else if (arr1[i] !== arr2[i]) {
                // Warning - two different object instances will never be equal: {x:20} != {x:20}
                return false;
            }
        }
        return true;
    };
    var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,
        ARGUMENT_NAMES = /(?:^|,)\s*([^\s,=]+)/g;

    function getArgs(func) {
        var oneOf = function oneOf() {
            for (var _len2 = arguments.length, patterns = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                patterns[_key2] = arguments[_key2];
            }

            return function (string, pos) {
                return patterns.map(function (pattern) {
                    return string.indexOf(pattern);
                }).filter(function (index) {
                    return index === pos;
                }).length > 0;
            };
        },
            fnStr = func.toString().replace(STRIP_COMMENTS, ''),
            first = oneOf('(', 'function (', 'function(')(fnStr, 0) ? fnStr.indexOf('(') + 1 : 0,
            last = !oneOf('=>')(fnStr, -1) ? fnStr.indexOf('=>') : fnStr.indexOf(')'),
            argsList = fnStr.slice(first, last).trim(),
            result = argsList.match(ARGUMENT_NAMES);
        return result === null ? [] : result.map(function (item) {
            return item.replace(/[\s,]/g, '');
        });
    }

    return {
        serialize: serialize, getLocation: getLocation, equals: equals, setQuery: setQuery, getArgs: getArgs
    };
});
(function (root, factory) {

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define('router/MatchBinding', ['./utils'], factory);
    } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('./utils'));
    }
})(undefined, function (utils) {
    'use strict';

    var MatchBinding = function () {
        function MatchBinding(pattern, location, binder) {
            _classCallCheck(this, MatchBinding);

            if (binder) {
                this.binder = binder;
            }
            if (location === '') {
                this.pattern = pattern.replace(/^\(\/\)/g, '').replace(/^\/|$/g, '');
            } else {
                var match = pattern.match(/^(\/|\(\/)/g);
                if (match === null) {
                    pattern = pattern[0] === '(' ? '(/' + pattern.substring(1) : '/' + pattern;
                }
                this.pattern = pattern;
            }

            var route = this.pattern.replace(MatchBinding.ESCAPE_PARAM, '\\$&').replace(MatchBinding.OPTIONAL_PARAM, '(?:$1)?').replace(MatchBinding.NAMED_PARAM, function (match, optional) {
                return optional ? match : '([^\/]+)';
            }).replace(MatchBinding.SPLAT_PARAM, '(.*)');

            this.patternRegExp = new RegExp('^' + route);

            this.routeHandler = new Set();
            this.leaveHandler = new Set();
            this.queryHandler = new Set();
            this._active = false;
        }

        _createClass(MatchBinding, [{
            key: 'setRoutes',
            value: function setRoutes(mapHandler) {
                var subBinder = this.subBinder;
                mapHandler({
                    match: subBinder.match.bind(subBinder)
                });
                return this;
            }
        }, {
            key: 'reTrigger',
            value: function reTrigger() {
                this.binder.reTrigger();
            }
        }, {
            key: 'match',
            value: function match(_match) {
                var subBinder = this.subBinder;
                _match(subBinder.match.bind(subBinder));
                return this;
            }
        }, {
            key: 'to',
            value: function to(routeHandler) {
                this.routeHandler.add({ handler: routeHandler, done: false });
                this.reTrigger();
                return this;
            }
        }, {
            key: 'leave',
            value: function leave(leaveHandler) {
                var args = utils.getArgs(leaveHandler);
                this.leaveHandler.add({ handler: leaveHandler, done: args.length > 0 && args[0] === 'done' });
                return this;
            }
        }, {
            key: 'query',
            value: function query(queryHandler) {
                this.queryHandler.add({ handler: queryHandler, done: false });
                return this;
            }
        }, {
            key: 'remove',
            value: function remove() {
                this.routeHandler.clear();
                this.leaveHandler.clear();
                this.queryHandler.clear();
                this.subBinder.remove();
                return this;
            }
        }, {
            key: 'test',
            value: function test(location) {
                return this.patternRegExp.test(location);
            }
        }, {
            key: 'getFragment',
            value: function getFragment(location) {
                var matches = location.match(this.patternRegExp);
                return matches === null ? '' : location.substring(matches[0].length);
            }
        }, {
            key: 'extractParams',
            value: function extractParams(fragment) {
                var params = this.patternRegExp.exec(fragment);
                if (params && params.length > 0) {
                    return params.slice(1).map(function (param) {
                        return param ? decodeURIComponent(param) : null;
                    });
                } else {
                    return [];
                }
            }
        }, {
            key: 'setSubBinder',
            value: function setSubBinder(MatchBinder, pattern, mapHandler) {
                var subBinder = new MatchBinder(pattern, this);
                this.subBinder = subBinder;
                if (typeof mapHandler === 'function') {
                    mapHandler(subBinder.match.bind(subBinder));
                }
                return subBinder;
            }
        }, {
            key: 'checkSegment',
            value: function checkSegment(matched, params) {
                var status = [];
                if (this._active) {
                    var pattern = this.pattern.replace(/\((.*?)\)/g, '$1').replace(/^\//, '').split('/'),
                        prevLoc = this.prevLoc.replace(/^\//, '').split('/'),
                        currSegment = matched.slice(0, pattern.length),
                        prevSegment = prevLoc.slice(0, pattern.length),
                        equals = utils.equals(currSegment, prevSegment);

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
        }, {
            key: 'clearActive',
            value: function clearActive(params) {
                var active = [];
                if (this._active) {
                    active.push({
                        handler: this.triggerLeave(params),
                        disable: this.disable.bind(this)
                    });
                }

                return active.concat(this.subBinder.clearActive());
            }
        }, {
            key: 'disable',
            value: function disable() {
                this._active = false;
            }
        }, {
            key: 'triggerTo',
            value: function triggerTo(location, params) {
                if (this.test(location)) {
                    // check if to is triggered
                    if (!this._active) {
                        this.prevLoc = location;
                        var args = this.extractParams(location).concat(utils.getLocation(params, location));
                        this.applyHandlers(this.routeHandler, args);
                        this._active = true;
                    }

                    // trigger query handler
                    this.applyHandlers(this.queryHandler, [utils.getLocation(params, location)]);

                    var fragment = this.getFragment(location);
                    if (fragment.trim() !== '') {
                        var subBinder = this.subBinder;
                        if (subBinder) {
                            subBinder.triggerRoutes(fragment, params);
                        }
                    }
                }
            }
        }, {
            key: 'applyHandlers',
            value: function applyHandlers(handlers) {
                var _this = this;

                var args = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

                if (handlers && handlers.size > 0) {
                    handlers.forEach(function (item) {
                        item.handler.apply(_this, args);
                    });
                }
            }
        }, {
            key: 'triggerLeave',
            value: function triggerLeave(params) {
                var _this2 = this;

                return new Promise(function (resolve) {
                    var handlers = _this2.leaveHandler,
                        location = utils.getLocation(params, _this2.prevLoc),
                        items = 0,
                        stopped = false;
                    if (handlers && handlers.size > 0) {
                        handlers.forEach(function (item) {
                            if (item.done) {
                                items++;
                            }
                            item.handler(function () {
                                var done = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

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
            }
        }]);

        return MatchBinding;
    }();

    Object.assign(MatchBinding, {
        OPTIONAL_PARAM: /\((.*?)\)/g,
        NAMED_PARAM: /(\(\?)?:\w+/g,
        SPLAT_PARAM: /\*\w+/g,
        ESCAPE_PARAM: /[\-{}\[\]+?.,\\\^$|#\s]/g
    });

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
    'use strict';

    var MatchBinder = function () {
        function MatchBinder(location, parent) {
            _classCallCheck(this, MatchBinder);

            this._parent = parent;
            this.bindings = new Set();
            this.location = location || '';
            this._active = false;
        }

        _createClass(MatchBinder, [{
            key: 'reTrigger',
            value: function reTrigger() {
                this._parent.reTrigger();
            }
        }, {
            key: 'match',
            value: function match(pattern, mapHandler) {
                if (typeof pattern === 'function') {
                    mapHandler = pattern;
                    pattern = false;
                }
                if (pattern === '') {
                    pattern = false;
                }
                return this.getMatchBinding(pattern, mapHandler);
            }
        }, {
            key: 'getMatchBinding',
            value: function getMatchBinding(pattern, mapHandler) {
                if (pattern) {
                    var binding = new MatchBinding(pattern, this.location, this);
                    binding.setSubBinder(MatchBinder, this.location + (pattern || ''), mapHandler);
                    this.bindings.add(binding);
                    return binding;
                } else {
                    if (typeof mapHandler === 'function') {
                        mapHandler(this.match.bind(this));
                    }
                    return {
                        match: this.match.bind(this)
                    };
                }
            }
        }, {
            key: 'clearActive',
            value: function clearActive(params, location) {
                var active = [];
                if (this.bindings.size > 0) {
                    this.bindings.forEach(function (binding) {
                        active = active.concat(binding.clearActive(params, location));
                    });
                }
                return active;
            }
        }, {
            key: 'checkStatus',
            value: function checkStatus(matched, params) {
                var active = [];
                if (this.bindings.size > 0) {
                    this.bindings.forEach(function (binding) {
                        active = active.concat(binding.checkSegment(matched, params));
                    });
                }
                return active;
            }
        }, {
            key: 'remove',
            value: function remove() {
                if (this.bindings.size > 0) {
                    this.bindings.forEach(function (binding) {
                        return binding.remove();
                    });
                }
            }
        }, {
            key: 'triggerRoutes',
            value: function triggerRoutes(location, params) {
                if (this.bindings.size > 0) {
                    this.bindings.forEach(function (binding) {
                        return binding.triggerTo(location, params);
                    });
                }
            }
        }]);

        return MatchBinder;
    }();

    return MatchBinder;
});

/*globals define*/
(function (root, factory) {

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define('router/Router', ['./MatchBinder', './utils'], factory);
    } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('./MatchBinder'), require('./utils'));
    }
})(undefined, function (MatchBinder, utils) {
    'use strict';

    var Router = function () {
        function Router(location) {
            _classCallCheck(this, Router);

            if (location !== undefined && location !== '') {
                this._location = location.replace(/^\/|\/$/g, '') + '/';
            }
            this.root = this.getBinder();
            this._listeners = new Set();
            this._handlers = new Set();
        }

        _createClass(Router, [{
            key: 'getBinder',
            value: function getBinder() {
                return new MatchBinder('', this);
            }
        }, {
            key: 'test',
            value: function test(loc) {
                return new RegExp('^' + this._location, 'g').test(loc);
            }
        }, {
            key: 'getLocation',
            value: function getLocation(loc) {
                var location = loc.replace(/^\/|$/g, '');
                if (this._location !== undefined) {
                    if (this.test(location)) {
                        return location.replace(this._location, '');
                    } else {
                        return false;
                    }
                }
                return location;
            }
        }, {
            key: 'reTrigger',
            value: function reTrigger() {
                if (this.currLocation) {
                    this.trigger(this.currLocation);
                }
            }
        }, {
            key: 'trigger',
            value: function trigger(location) {
                var _this3 = this;

                if (this.started) {
                    (function () {
                        // this.started = false;
                        _this3.currLocation = location;
                        var parts = location.split('?', 2),
                            segments = _this3.getLocation(parts[0]);
                        if (segments || segments === '') {
                            (function () {
                                var query = utils.setQuery(parts[1]),
                                    params = {
                                    root: segments,
                                    query: query
                                };
                                _this3.execute(segments, params).then(function (move) {
                                    return _this3.setRoutes(move, segments, params);
                                }).then(function (move) {
                                    return _this3.setLocation(move);
                                });
                            })();
                        }
                    })();
                }
            }
        }, {
            key: 'execute',
            value: function execute(location, params) {
                var _this4 = this;

                return new Promise(function (resolve) {
                    var matched = location.replace(/^\/|$/g, '').split('/'),
                        binder = _this4.root,
                        active = binder.checkStatus(matched, params);
                    if (active.length > 0) {
                        active.forEach(function (item) {
                            item.handler.then(function (applied) {
                                if (!item.triggered) {
                                    item.triggered = true;
                                    item.applied = applied;
                                    if (active.filter(function (item) {
                                        return item.applied;
                                    }).length === active.length) {
                                        active.forEach(function (item) {
                                            return item.disable();
                                        });
                                        resolve(true);
                                    } else if (active.filter(function (item) {
                                        return item.triggered;
                                    }).length === active.length) {
                                        resolve(false);
                                    }
                                }
                            });
                        });
                    } else {
                        resolve(true);
                    }
                });
            }
        }, {
            key: 'setRoutes',
            value: function setRoutes(move, location, params) {
                if (move) {
                    this._handlers.forEach(function (handler) {
                        return handler();
                    });
                    this.root.triggerRoutes(location, params);
                }
                return move;
            }
        }, {
            key: 'setListener',
            value: function setListener(listener) {
                var listeners = this._listeners;
                listeners.add(listener);
                return {
                    remove: function remove() {
                        listeners.delete(listener);
                    }
                };
            }
        }, {
            key: 'onRouteChange',
            value: function onRouteChange(handler) {
                var handlers = this._handlers;
                handlers.add(handler);
                return {
                    remove: function remove() {
                        handlers.delete(handler);
                    }
                };
            }
        }, {
            key: 'setLocation',
            value: function setLocation(move) {
                var location = move ? this.currLocation : this.prevLocation;
                this.prevLocation = location;
                // this.started = true;
                this._listeners.forEach(function (listener) {
                    return listener(location, move);
                });
            }
        }, {
            key: 'match',
            value: function match(mapHandler) {
                mapHandler(this.root.match.bind(this.root));
            }
        }, {
            key: 'start',
            value: function start() {
                this.started = true;
            }
        }, {
            key: 'stop',
            value: function stop() {
                this.started = false;
            }
        }]);

        return Router;
    }();

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

    function triggerRoute(router, active) {
        var activeLocation = '';

        router.setListener(function (location, move) {
            activeLocation = location;
            if (!move) {
                window.location.hash = location;
            }
        });

        router.onRouteChange(function () {
            if (active.size > 0) {
                active.forEach(function (handler) {
                    return handler();
                });
                active.clear();
            }
        });

        function onHashChange() {
            var match = window.location.href.match(/#(.*)$/),
                route = match ? match[1] : '';
            if (activeLocation !== route) {
                router.trigger(route);
            }
        };
        router.start();
        window.addEventListener('hashchange', onHashChange, false);
        onHashChange();
    }

    // ### App Class
    // Create App, EventBus and context for App.
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

        function App() {
            var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            _classCallCheck(this, App);

            this.options = options;
            this.beforeInit.apply(this, arguments);
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
        }, {
            key: 'start',


            // Starting `App` in provided `Container`
            //
            //      @method start
            //      @param {HTMLElement} container
            value: function start(container) {
                if (container instanceof HTMLElement === true) {
                    this.el = container;
                    this.context = this.setContext.apply(this, arguments);

                    if (this.AppContainer !== undefined) {
                        this.appContainer = new this.AppContainer();
                    }

                    this.init.call(this, this.options);

                    var el = document.createElement('div');
                    this.el.appendChild(el);
                    this.appContainer.ready(el);
                    this.appContainer.setContext(this.context);

                    setTimeout(function () {
                        container.classList.add('show');
                    }, 100);
                } else {
                    throw Error('Contaner should be a HTML element');
                }
            }
        }, {
            key: 'context',
            set: function set(context) {
                var _this6 = this;

                var router = new Router(this.options.rootRoute);
                router.match(function (match) {
                    Object.assign(context, {
                        // Creating `EventBus` More info look in `Mediator` Section
                        eventBus: new Mediator(_this6.context, function (channel, scope) {
                            scope._globalEvents = scope._globalEvents || [];
                            if (scope._globalEvents.indexOf(channel) === -1) {
                                scope._globalEvents.push(channel);
                            }
                        }),
                        active: new Map(),
                        match: match,
                        container: _this6.el

                    });

                    triggerRoute(router, context.active);
                    _this6._context = context;
                });
            },
            get: function get() {
                return this._context;
            }
        }]);

        return App;
    }();

    ;
    return App;
});
//# sourceMappingURL=App.js.map
