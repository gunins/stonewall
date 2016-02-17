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
        constructor(fn, options, context) {
            if (!(this instanceof Subscriber)) {
                return new Subscriber(fn, options, context);
            }

            this.id = Symbol();
            this.channel = null;
            this.fn = fn;
            this.update(options);
        }

        // Mediator.update on a subscriber instance can update its function,context,
        // or options object. It takes in an object and looks for fn, context, or
        // options keys.

        update(options = {}) {
            this.fn = options.fn || this.fn;
            this.context = options.context || this.context;
            this.options = options.options || this.options;
            if (this.channel && this.options && this.options.priority !== undefined) {
                this.channel.setPriority(this.id, this.options.priority);
            }
        }
    }

    class Channel {
        constructor(namespace, parent, context) {
            if (!(this instanceof Channel)) {
                return new Channel(namespace, parent, context);
            }
            this.namespace = namespace || "";
            this._subscribers = [];
            this._channels = {};
            this._parent = parent;
            this.stopped = false;
            this._context = context || {};
        };


        // A Mediator channel holds a list of sub-channels and subscribers to be fired
        // when Mediator.publish is called on the Mediator instance. It also contains
        // some methods to manipulate its lists of data; only setPriority and
        // StopPropagation are meant to be used. The other methods should be accessed
        // through the Mediator instance.

        addSubscriber(fn, options, context) {
            context = context || this._context;

            var subscriber = new Subscriber(fn, options, context);

            if (options && options.priority !== undefined&&options.priority>0) {
                if (options.priority >= this._subscribers.length) {
                    options.priority = this._subscribers.length;
                }
                this._subscribers.splice(options.priority, 0, subscriber);
            } else {
                this._subscribers.push(subscriber);
            }

            subscriber.channel = this;
            subscriber.remove = function () {
                this.removeSubscriber(subscriber.id);
            }.bind(this);

            context._globalEvents = context._globalEvents || [];
            context._globalEvents.push(subscriber);

            return subscriber;
        };

        // The channel instance is passed as an argument to the mediator subscriber,
        // and further subscriber propagation can be called with
        // channel.StopPropagation().
        stopPropagation() {
            this.stopped = true;
        };

        getSubscriber(identifier) {
            var x = 0,
                y = this._subscribers.length;

            for (x, y; x < y; x++) {
                if (this._subscribers[x].id === identifier || this._subscribers[x].fn === identifier) {
                    return this._subscribers[x];
                }
            }
        };

        // Channel.setPriority is useful in updating the order in which Subscribers
        // are called, and takes an identifier (subscriber id or named function) and
        // an array index. It will not search recursively through subchannels.

        setPriority(identifier, priority) {
            let oldIndex = this._subscribers.filter(subscriber => (subscriber.id !== identifier || subscriber.fn !== identifier)).length,
                sub = this._subscribers[oldIndex],
                firstHalf = this._subscribers.slice(0, oldIndex),
                lastHalf = this._subscribers.slice(oldIndex + 1);

            this._subscribers = firstHalf.concat(lastHalf);
            this._subscribers.splice(priority, 0, sub);
        };

        addChannel(channel) {
            this._channels[channel] = new Channel((this.namespace ? this.namespace + ':' : '') +
                channel, this, this._context);
        };

        hasChannel(channel) {
            return this._channels.hasOwnProperty(channel);
        };

        returnChannel(channel) {
            return this._channels[channel];
        };

        removeSubscriber(identifier) {
            let x = this._subscribers.length - 1;

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
        };

        // This will publish arbitrary arguments to a subscriber and then to parent
        // channels.

        publish(data) {
            let x = 0,
                y = this._subscribers.length,
                shouldCall = false,
                subscriber,
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
                    y = subsAfter;
                    if (subsAfter === subsBefore - 1) {
                        x--;
                    }
                }
            }

            if (this._parent) {
                this._parent.publish(data);
            }

            this.stopped = false;
        };
    }

    class Mediator {
        constructor(context) {
            if (!(this instanceof Mediator)) {
                return new Mediator(context);
            }
            this._channels = new Channel('', false, context);
        }

        // A Mediator instance is the interface through which events are registered
        // and removed from publish channels.


        // Returns a channel instance based on namespace, for example
        // application:chat:message:received. If readOnly is true we
        // will refrain from creating non existing channels.

        getChannel(namespace, readOnly) {
            let channel = this._channels,
                namespaceHierarchy = namespace.split(':');

            if (namespace !== '' && namespaceHierarchy.length > 0) {
                namespaceHierarchy.forEach((namespace)=> {
                    if (!channel.hasChannel(namespace) && !readOnly) {
                        channel.addChannel(namespace);
                    }
                    channel = channel.returnChannel(namespace);
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

        // Returns a subscriber for a given subscriber id / named function and
        // channel namespace

        getSubscriber(identifier, channelName) {
            let channel = this.getChannel(channelName || "", true);
            // We have to check if channel within the hierarchy exists and if it is
            // an exact match for the requested channel
            if (channel && channel.namespace === channelName) {
                return channel.getSubscriber(identifier);
            } else {
                return false;
            }

        };

        // Remove a subscriber from a given channel namespace recursively based on
        // a passed-in subscriber id or named function.

        remove(channelName, identifier) {
            let channel = this.getChannel(channelName || "", true);
            if (channel && channel.namespace === channelName) {
                channel.removeSubscriber(identifier);
            } else {
                return false;
            }
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
