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
        define(function () {
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
            this.id = Symbol();
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
            this._context = context;
            this.setGlobalEvents();
        };

        get context() {
            return this._context;
        };

        setGlobalEvents() {
            let context = this.context;
            context._globalEvents = context._globalEvents || [];
            if (context._globalEvents.indexOf(this) === -1) {
                context._globalEvents.push(this);
            }
        }

        remove() {
            let channel = this.channel;
            if (channel) {
                channel.removeSubscriber(this);
            }
        };

        run(data) {
            if (!this.channel.stopped) {
                let shouldCall = !(typeof this.predicate === "function");

                if (!shouldCall) {
                    shouldCall = this.predicate.apply(this.context, data);
                }

                // Check if the callback should be called
                if (shouldCall) {
                    this._reduceCalls();
                    //Execute function.
                    this.fn.apply(this.context, data)
                }
            }
        };

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

        setPriority(priority) {
            let channel = this.channel;
            if (channel) {
                channel.setPriority(this, priority);
            }
        };

    }

    class Channel {
        constructor(namespace, parent, context) {
            this.namespace = namespace || "";
            this._subscribers = [];
            this._channels = new Map();
            this._parent = parent;
            this.stopped = false;
            this.context = context;
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

        addChannel(channel) {
            this._channels.set(channel, new Channel((this.namespace ? this.namespace + ':' : '') + channel, this, this.context));
        };

        hasChannel(channel) {
            return this._channels.has(channel);
        };

        returnChannel(channel) {
            return this._channels.get(channel);
        };

        removeSubscriber(subscriber) {
            let subscribers = this._subscribers;
            // If we don't pass in an value, we're clearing all
            if (!subscriber) {
                this._subscribers.splice(0, subscribers.length);
            } else {
                subscribers.splice(subscribers.indexOf(subscriber), 1);
            }

            if (this._subscribers.length === 0 && this._parent) {
                this._parent.removeChannel(this);
            }

            return this._subscribers.length === 0;
        };

        removeChannel(channel) {
            if (channel === this._channels.get(channel.namespace)) {
                this._channels.delete(channel.namespace);
            }
        };

        clear() {
            this._channels.forEach(channel=> {
                channel.clear();
            });
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
        constructor(context = {}) {
            if (!(this instanceof Mediator)) {
                return new Mediator(context);
            }
            this.channel = new Channel('', false, context);
        }

        // A Mediator instance is the interface through which events are registered
        // and removed from publish channels.


        // Returns a channel instance based on namespace, for example
        // application:chat:message:received. If readOnly is true we
        // will refrain from creating non existing channels.

        getChannel(namespace, readOnly) {
            let channel = this.channel,
                namespaceHierarchy = namespace.split(':');

            if (namespace !== '' && namespaceHierarchy.length > 0) {
                namespaceHierarchy.forEach((namespace)=> {
                    if (channel) {
                        if (!channel.hasChannel(namespace) && !readOnly) {
                            channel.addChannel(namespace);
                        }
                        channel = channel.returnChannel(namespace);
                    }
                });
            }

            return channel;
        };

        // Pass in a channel namespace, function to be called, options, and context
        // to call the function in to Subscribe. It will create a channel if one
        // does not exist. Options can include a predicate to determine if it
        // should be called (based on the data published to it) and a priority
        // index.

        subscribe(channelName, fn, options = {}, context) {
            let channel = this.getChannel(channelName || "", false);
            return channel.addSubscriber(fn, options, context);
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
            let channel = this.getChannel(channelName || "", true);
            if (channel && channel.namespace === channelName) {
                args.push(channel)
                channel.publish(args);
            } else {
                return false;
            }
        };

        clear() {
            this.channel.clear();
        };
    }

    // Alias some common names for easy interop
    Mediator.prototype.on = Mediator.prototype.subscribe;
    Mediator.prototype.bind = Mediator.prototype.subscribe;
    Mediator.prototype.emit = Mediator.prototype.publish;
    Mediator.prototype.trigger = Mediator.prototype.publish;
    Mediator.prototype.off = Mediator.prototype.remove;

    // Finally, expose it all.

    Mediator.Channel = Channel;
    Mediator.Subscriber = Subscriber;
    Mediator.version = "0.9.8";

    return Mediator;
}));
