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
    './elOnchange',
    './elReady'
], function (dom, utils, WatchJS, setBinders, applyEvents, applyAttribute, elOnChange, elReady) {
    var watch = WatchJS.watch,
        unwatch = WatchJS.unwatch,
        callWatchers = WatchJS.callWatchers;
    //TODO: This is necessary for Safari and FF, but possible memory leak, need check later.

    function parseBinder(objKey, obj, binder) {
        if (binder !== undefined) {
            var data = obj[objKey];

            if (this.nodes[objKey]) {
                this.nodes[objKey].call(this, binder, data);
            } else {
                if (!utils.isArray(data) && !utils.isObject(data)) {
                    let element = binder.run(true);
                    element.text(data);
                    applyEvents.call(this, element, data);
                    elReady.call(this, element, data);
                    elOnChange.call(this, element, data);
                    if (element.data.tplSet.update === 'true') {
                        watch(obj, objKey, () => {
                            element.text(obj[objKey]);
                            elOnChange.call(this, element, obj[objKey]);
                        });
                    }
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


                                applyEvents.call(this, element, item);
                                elReady.call(this, element, data);
                                elOnChange.call(this, element, item);

                                if (isString && element.data.tplSet.update === 'true') {
                                    watch(obj, objKey, ()=> {
                                        element.text(item);
                                        elOnChange.call(this, element, item);
                                    });
                                }


                            };
                        data.forEach(addItem.bind(this));
                        let update = binder.data.tplSet.update;
                        if (update === 'true') {
                            let removeMethodNames = ['pop', 'shift', 'splice'],
                                insertMethodNames = ['push', 'unshift'],
                                sortingMethodNames = ['reverse', 'sort'];
                            watch(obj, objKey, (prop, action, newValue, oldValue)=> {
                                let clonedData = bindedData.slice(0);
                                if (oldValue === undefined && insertMethodNames.indexOf(action) !== -1) {
                                    let filter = clonedData.filter((item)=> {
                                        return item.data === newValue[0];
                                    });
                                    if (filter.length === 0) {
                                        addItem.call(this, newValue[0], (action === 'unshift') ? 0 : clonedData.length);
                                    }
                                } else if (removeMethodNames.indexOf(action) !== -1) {
                                    clonedData.forEach((binder)=> {
                                        if (obj[objKey].indexOf(binder.data) === -1) {
                                            binder.binder.remove();
                                            bindedData.splice(bindedData.indexOf(binder), 1);
                                        }
                                    });

                                    if (action === 'splice') {
                                        let vals = Array.prototype.slice.call(newValue, 2);
                                        if (vals && vals.length > 0) {
                                            vals.forEach((val)=> {
                                                let index = obj[objKey].indexOf(val);
                                                if (index !== -1) {
                                                    addItem.call(this, val, index);
                                                }
                                            });
                                        }
                                    }
                                } else if (sortingMethodNames.indexOf(action) !== -1) {
                                    data.forEach((value, index)=> {
                                        let element = clonedData.filter(item=>item.data === value)[0];
                                        bindedData.splice(index, 0, bindedData.splice(bindedData.indexOf(element), 1)[0]);
                                        element.binder.changePosition(index);

                                    });


                                }

                            });
                        }
                    }
                    updateChildren.call(this);

                } else if (utils.isObject(data)) {
                    let element = binder.run(data);
                    if (element.data.type !== 'cp') {
                        applyAttribute.call(this, element, data);
                        applyEvents.call(this, element, data);
                        elReady.call(this, element, data);
                        elOnChange.call(this, element, data);
                        if (element.children) {
                            element.bindings = setBinders(element.children);
                            applyBinders.call(this, data, element);
                        }
                    }


                }
            }
        }

    };

    function applyBinders(obj, instance) {
        let binders = instance.bindings;
        if (binders) {
            if (binders['__cp__'].length > 0) {
                binders['__cp__'].forEach(binder=>{
                    let component = binder.run(obj);
                    elReady.call(this, component, obj);
                    elOnChange.call(this, component, obj);
                });
            }
            let keys = Object.keys(binders);
            if (obj && keys.length > 0) {
                keys.forEach((binderKey) => {
                    if (obj[binderKey] !== undefined) {
                        binders[binderKey].forEach(parseBinder.bind(this, binderKey, obj));
                    } else {
                        let fn = (prop, action, newValue, oldValue) => {
                            if (newValue !== undefined && oldValue === undefined) {
                                binders[binderKey].forEach(parseBinder.bind(this, binderKey, obj));
                                unwatch(obj, binderKey, fn);
                            }
                        }
                        watch(obj, binderKey, fn, 0);
                    }
                });
            }
        }
    }

    return applyBinders;
});