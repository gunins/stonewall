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

    function parseBinder(objKey, obj, parent, binder) {
        var events = this.events[binder._node.name];
        if (binder !== undefined) {
            var data = obj[objKey];
            binder.applyAttach();

            if (this.nodes[objKey]) {
                var childBinder = utils.extend({}, binder);
                this.nodes[objKey].call(this, childBinder, parent, data);
            } else {
                if (!utils.isArray(data) && !utils.isObject(data)) {
                    var childBinder = binder; //.clone();
                    childBinder.add(parent);
                    childBinder.text(data);
                    if (this.elReady[childBinder._node.name] !== undefined) {
                        this.elReady[childBinder._node.name].call(this, childBinder, data);
                    }
                    if (childBinder._node.data.tplSet.update === 'true') {
                        watch(obj, objKey, function () {
                            childBinder.text(obj[objKey]);
                        }.bind(this));
                    }
                    applyEvents.call(this, childBinder, events, data);
                } else if (utils.isArray(data)) {
                    binder.applyAttach();

                    var updateChildren = function () {
                        var hasParent = false,
                            bindedData = [],
                            addItem = function (item) {

                                var childBinder = utils.extend({}, binder);//.clone();

                                if (!hasParent) {
                                    childBinder.add(parent);
                                    hasParent = binder.getParent();
                                } else {
                                    childBinder.add(parent, hasParent);
                                }

                                applyAttribute.call(this, childBinder, item);
                                applyBinders.call(this, item, childBinder);
                                applyEvents.call(this, childBinder, events, item);
                                bindedData.push({binder: childBinder, data: item});

                                if (this.elReady[childBinder._node.name]) {
                                    this.elReady[childBinder._node.name].call(this, childBinder, item);
                                }
                            };
                        data.forEach(addItem.bind(this));
                        var update = binder._node.data.tplSet.update;
                        if (update === 'true') {
                            var methodNames = ['pop', 'shift', 'splice'];
                            watch(obj, objKey, function (prop, action, newvalue, oldvalue) {
                                if (oldvalue === undefined && action === 'push') {
                                    addItem.call(this, newvalue[0]);
                                } else if (methodNames.indexOf(action) !== -1) {
                                    bindedData.forEach(function (binder, index) {
                                        if (obj[objKey].indexOf(binder.data) === -1) {
                                            binder.binder.remove();
                                            bindedData.splice(index, 1);
                                        }
                                    }.bind(this));
                                }
                            }.bind(this));
                        }
                    }

                    updateChildren.call(this);

                } else if (utils.isObject(data)) {
                    var childBinder = utils.extend({}, binder); //.clone();
                    dom.add(childBinder, parent);
                    //childBinder.add(parent);

                    applyEvents.call(this, childBinder, events, data);
                    if (binder._node.data.type === 'cp') {
                        dom.replace(childBinder, binder, data);
                        //childBinder.replace(binder, data);
                    }
                    else if (!childBinder._node.data.tplSet.bind) {
                        applyBinders.call(this, data, childBinder);
                    } else {
                        applyAttribute.call(this, childBinder, data);
                    }
                    if (this.elReady[childBinder._node.name]) {
                        this.elReady[childBinder._node.name].call(this, childBinder, data);
                    }
                }
            }
        }

    };

    function applyBinders(obj, instance) {
        var binders = instance.bindings,
            parent = instance.el;

        if (obj && binders !== undefined) {

            Object.keys(obj).forEach(function (objKey) {
                if (binders[objKey] !== undefined) {
                    //TODO: Investigate, why not always an Array
                    if (binders[objKey].forEach !== undefined) {
                        binders[objKey].forEach(parseBinder.bind(this, objKey, obj, parent));
                    } else {
                        parseBinder.call(this, objKey, obj, parent, binders[objKey]);
                    }
                }
            }.bind(this));
            Object.keys(binders).forEach(function (binderKey) {
                if (obj[binderKey] === undefined) {
                    var fn = function (prop, action, newvalue, oldvalue) {
                        if (newvalue !== undefined && oldvalue === undefined) {
                            binders[binderKey].forEach(parseBinder.bind(this, binderKey, obj, parent));
                            unwatch(obj, binderKey, fn);
                        }
                    }.bind(this);
                    watch(obj, binderKey, fn, 0);
                }
            }.bind(this));
        }
    }

    return applyBinders;
});