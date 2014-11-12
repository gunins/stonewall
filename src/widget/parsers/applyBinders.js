/**
 * Created by guntars on 11/11/14.
 */
define([
    '../dom',
    '../utils',
    'watch',
    './applyEvents',
    './applyAttribute'
], function (dom, utils, WatchJS, applyEvents, applyAttribute) {
    var watch = WatchJS.watch,
        unwatch = WatchJS.unwatch,
        callWatchers = WatchJS.callWatchers;

    function applyBinders(obj, instance) {
        var binders = instance.bindings,
            parent = instance.el;
        if (obj) {
            Object.keys(obj).forEach(function (key) {
                if (binders !== undefined && binders[key] !== undefined) {

                    var parseBinder = function (binder) {
                        var events = this.events[binder.name];
                        if (binder !== undefined) {
                            var data = obj[key];
                            binder.applyAttach();

                            if (this.nodes[key]) {
                                var childBinder = new dom.Element(binder);
                                this.nodes[key].call(this, childBinder, parent, data);
                            } else {
                                if (!utils.isArray(data) && !utils.isObject(data)) {
                                    var childBinder = new dom.Element(binder);
                                    childBinder.add(parent);
                                    childBinder.text(data);
                                    if (this.elReady[key] !== undefined) {
                                        this.elReady[key].call(this, childBinder, data);
                                    }
                                    if (childBinder.data.tplSet.update === 'true') {
                                        watch(obj, key, function () {
                                            childBinder.text(obj[key]);
                                        }.bind(this));
                                    }
                                    applyEvents.call(this, childBinder, events, data);
                                } else if (utils.isArray(data)) {
                                    binder.applyAttach();

                                    var updateChildren = function () {
                                        var hasParent = false,
                                            addItem = function (item) {
                                                var childBinder = new dom.Element(binder);

                                                if (!hasParent) {
                                                    childBinder.add(parent);
                                                    hasParent = binder.getParent();
                                                } else {
                                                    childBinder.add(parent, hasParent);
                                                }

                                                if (this.elReady[key]) {
                                                    this.elReady[key].call(this, childBinder, item);
                                                }

                                                applyAttribute.call(this, childBinder, item);
                                                applyBinders.call(this, item, childBinder);
                                                applyEvents.call(this, childBinder, events, item);
                                            };
                                        data.forEach(addItem.bind(this));
                                        var update = binder.data.tplSet.update;
                                        if (update === 'true') {
                                            watch(obj, key, function (prop, action, newvalue, oldvalue) {
                                                if (oldvalue === undefined && action == 'push') {
                                                    addItem.call(this, newvalue[0]);
                                                }
                                            }.bind(this));
                                        }
                                    }

                                    updateChildren.call(this);

                                } else if (utils.isObject(data)) {
                                    var childBinder = new dom.Element(binder);
                                    childBinder.add(parent);
                                    if (this.elReady[key]) {
                                        this.elReady[key].call(this, childBinder, data);
                                    }
                                    applyEvents.call(this, childBinder, events, data);
                                    if (binder.data.type === 'cp') {
                                        childBinder.replace(binder, data);
                                    }
                                    else if (!childBinder.data.tplSet.bind) {
                                        applyBinders.call(this, data, childBinder);
                                    } else {
                                        applyAttribute.call(this, childBinder, data);
                                    }
                                }
                            }
                        }

                    };
                    //TODO: Investigate, why not allways an Array
                    if (binders[key].forEach !== undefined) {
                        binders[key].forEach(parseBinder.bind(this));
                    } else {
                        parseBinder.call(this, binders[key])
                    }
                }
            }.bind(this));
        }
    }

    return applyBinders;
});