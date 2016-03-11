/**
 * Created by guntars on 11/11/14.
 */
define([
    'templating/dom',
    '../utils',
    'watch',
    './setBinders',
    './applyEvents',
    './applyAttribute',
    './elOnchange'
], function (dom, utils, WatchJS, setBinders, applyEvents, applyAttribute, elOnChange) {
    var watch = WatchJS.watch,
        unwatch = WatchJS.unwatch,
        callWatchers = WatchJS.callWatchers;
    //TODO: This is necessary for Safari and FF, but possible memory leak, need check later.

    function parseBinder(objKey, obj, binder) {
        var events = this.events[binder.data.name];
        if (binder !== undefined) {
            var data = obj[objKey];

            if (this.nodes[objKey]) {
                this.nodes[objKey].call(this, binder, data);
            } else {
                if (!utils.isArray(data) && !utils.isObject(data)) {
                    let element = binder.run(true);
                    element.text(data);
                    if (this.elReady[element.data.name] !== undefined) {
                        this.elReady[element.data.name].call(this, element, data);
                    }
                    elOnChange.call(this, element, data);
                    if (element.data.tplSet.update === 'true') {
                        watch(obj, objKey, () => {
                            element.text(obj[objKey]);
                            elOnChange.call(this, element, obj[objKey]);
                        });
                    }
                    applyEvents.call(this, element, events, data);
                } else if (utils.isArray(data)) {

                    var updateChildren = function () {
                        let bindedData = [],
                            addItem = (item, index)=> {
                                let isString = false;
                                if (!utils.isArray(item) && !utils.isObject(item)) {
                                    isString = true;
                                }
                                let element = binder.run(true, index);
                                if (isString) {
                                    element.text(item);
                                }

                                bindedData.push({
                                    binder: element,
                                    data:   item
                                });


                                applyAttribute.call(this, element, item);
                                if (element.children) {
                                    element.bindings = setBinders(element.children);
                                    applyBinders.call(this, item, element);
                                }


                                if (this.elReady[element.name]) {
                                    this.elReady[element.name].call(this, element, item);
                                }

                                elOnChange.call(this, element, item);
                                if (isString && element.data.tplSet.update === 'true') {
                                    watch(obj, objKey, function () {
                                        element.text(item);
                                        elOnChange.call(this, element, item);
                                    }.bind(this));
                                }
                                applyEvents.call(this, element, events, item);


                            };
                        data.forEach(addItem.bind(this));
                        let update = binder.data.tplSet.update;
                        if (update === 'true') {
                            let removeMethodNames = ['pop', 'shift', 'splice'],
                                insertMethodNames = ['push', 'unshift'],
                                sortingMethodNames = ['reverse', 'sort'];
                            watch(obj, objKey, (prop, action, newvalue, oldvalue)=> {
                                let clonedData = bindedData.slice(0);
                                if (oldvalue === undefined && insertMethodNames.indexOf(action) !== -1) {
                                    var filter = clonedData.filter((item)=> {
                                        return item.data === newvalue[0];
                                    });
                                    if (filter.length === 0) {
                                        addItem.call(this, newvalue[0], (action === 'unshift') ? 0 : clonedData.length);
                                    }
                                } else if (removeMethodNames.indexOf(action) !== -1) {
                                    clonedData.forEach((binder)=> {
                                        if (obj[objKey].indexOf(binder.data) === -1) {
                                            binder.binder.remove();
                                            bindedData.splice(bindedData.indexOf(binder), 1);
                                        }
                                    });

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

                            });
                        }
                    }
                    updateChildren.call(this);

                } else if (utils.isObject(data)) {
                    let element = binder.run(data);

                    if (element.data.type === 'cp') {

                        //binder = binder.run();
                        /*  if (binder.el === undefined) {
                         dom.add(binder, parent, false, data);
                         } else {
                         dom.replace(binder, binder, data);
                         }*/
                    }
                    else {
                        applyEvents.call(this, element, events, data);
                        applyAttribute.call(this, element, data);
                        if (element.children) {
                            element.bindings = setBinders(element.children);
                            applyBinders.call(this, data, element);
                        }

                    }

                    if (this.elReady[element.name]) {
                        this.elReady[element.name].call(this, element, data);
                    }
                    elOnChange.call(this, element, data);

                }
            }
        }

    };

    function applyBinders(obj, instance,root) {
        var binders = instance.bindings;
        if (obj && binders !== undefined) {
            Object.keys(obj).forEach((objKey) => {
                if (binders[objKey] !== undefined) {
                    //TODO: Investigate, why not always an Array
                    if (binders[objKey].forEach !== undefined) {
                        binders[objKey].forEach(parseBinder.bind(this, objKey, obj));
                    } else {
                        parseBinder.call(this, objKey, obj, binders[objKey]);
                    }
                }
            });
            if (binders) {
                Object.keys(binders).forEach((binderKey) => {
                    if (obj[binderKey] === undefined) {
                        var fn = (prop, action, newvalue, oldvalue) => {
                            if (newvalue !== undefined && oldvalue === undefined) {
                                binders[binderKey].forEach(parseBinder.bind(this, binderKey, obj));
                                unwatch(obj, binderKey, fn);
                            }
                        }
                        watch(obj, binderKey, fn, 0);
                    }
                });
            }
        }else if(!root) {
            instance.run(obj)
        }
    }

    return applyBinders;
});