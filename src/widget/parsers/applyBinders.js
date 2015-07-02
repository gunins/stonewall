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
    var watch        = WatchJS.watch,
        unwatch      = WatchJS.unwatch,
        callWatchers = WatchJS.callWatchers;
    //TODO: This is necessary for Safari and FF, but possible memory leak, need check later.

    function parseBinder(objKey, obj, parent, binder) {
        var events = this.events[binder._node.name];
        if (binder !== undefined) {
            var data = obj[objKey];
            binder.applyAttach();

            if (this.nodes[objKey]) {
                var childBinder = binder;
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
                        var hasParent  = false,
                            bindedData = [],
                            addItem    = function (item, index) {

                                var childBinder = utils.extend({}, binder);//.clone();
                                childBinder._events = [];
                                if (!hasParent) {
                                    childBinder.add(parent);
                                    hasParent = binder.getParent();
                                    bindedData.push({
                                        binder: childBinder,
                                        data:   item
                                    });
                                } else if (index !== undefined && index <= bindedData.length - 1) {
                                    childBinder.add(parent, hasParent, false, bindedData[index].binder.el);
                                    bindedData.splice(index, 0, {
                                        binder: childBinder,
                                        data:   item
                                    });

                                } else {
                                    childBinder.add(parent, hasParent);
                                    bindedData.push({
                                        binder: childBinder,
                                        data:   item
                                    });

                                }

                                applyAttribute.call(this, childBinder, item);
                                applyBinders.call(this, item, childBinder);
                                applyEvents.call(this, childBinder, events, item);

                                if (this.elReady[childBinder._node.name]) {
                                    this.elReady[childBinder._node.name].call(this, childBinder, item);
                                }
                            };
                        data.forEach(addItem.bind(this));
                        var update     = binder._node.data.tplSet.update;
                        if (update === 'true') {
                            var removeMethodNames  = ['pop', 'shift', 'splice'],
                                insertMethodNames  = ['push', 'unshift'],
                                sortingMethodNames = ['reverse', 'sort'];
                            watch(obj, objKey, function (prop, action, newvalue, oldvalue) {
                                var clonedData = bindedData.slice(0);
                                if (oldvalue === undefined && insertMethodNames.indexOf(action) !== -1) {
                                    var filter = clonedData.filter(function (item) {
                                        return item.data === newvalue[0];
                                    });
                                    if (filter.length === 0) {
                                        addItem.call(this, newvalue[0], (action === 'unshift') ? 0 : clonedData.length);
                                    }
                                } else if (removeMethodNames.indexOf(action) !== -1) {
                                    clonedData.forEach(function (binder) {
                                        if (obj[objKey].indexOf(binder.data) === -1) {
                                            binder.binder.remove();
                                            bindedData.splice(bindedData.indexOf(binder), 1);
                                        }
                                    }.bind(this));

                                    if (action === 'splice') {
                                        var vals = Array.prototype.slice.call(newvalue, 2);
                                        if (vals && vals.length > 0) {
                                            vals.forEach(function (val) {
                                                var index = obj[objKey].indexOf(val);
                                                if (index !== -1) {
                                                    addItem.call(this, val, index);
                                                }
                                            }.bind(this));
                                        }
                                    }
                                } else if (sortingMethodNames.indexOf(action) !== -1) {

                                }
                            }.bind(this));
                        }
                    }
                    updateChildren.call(this);

                } else if (utils.isObject(data)) {
                    var childBinder = utils.extend({}, binder);
                    if (childBinder._node.data.type === 'cp') {
                        if (childBinder.el === undefined) {
                            dom.add(childBinder, parent, false, data);
                        } else {
                            dom.replace(childBinder, binder, data);
                        }
                    }
                    else {
                        dom.add(childBinder, parent);
                        applyEvents.call(this, childBinder, events, data);
                        applyAttribute.call(this, childBinder, data);
                        applyBinders.call(this, data, childBinder);
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
            parent  = instance.el;

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
            if (binders) {
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
    }

    return applyBinders;
});