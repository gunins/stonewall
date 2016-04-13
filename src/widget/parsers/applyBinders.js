/**
 * Created by guntars on 11/11/14.
 */
define([
    'templating/dom',
    '../utils',
    'watch',
    './setBinders',
    './addChildren',
    './applyAttribute'
], function(dom, utils, WatchJS, setBinders, addChildren, applyAttribute) {
    var watch = WatchJS.watch,
        unwatch = WatchJS.unwatch;

    function parseBinder(context, objKey, obj, binder) {
        if (binder !== undefined) {
            var data = obj[objKey];

            if (context.nodes[objKey]) {
                context.nodes[objKey].call(context, binder, data);
            } else {
                if (!utils.isArray(data) && !utils.isObject(data)) {
                    let element = binder.run(true);
                    element.text(data);
                    addChildren.applyEvents(context, element, data);
                    addChildren.elReady(context, element, data);
                    addChildren.elOnChange(context, element, data);

                    if (element.data.tplSet.update === 'true') {
                        watch(obj, objKey, () => {
                            element.text(obj[objKey]);
                            addChildren.elOnChange(context, element, obj[objKey]);
                        });
                    }
                } else if (utils.isArray(data)) {

                    let bindedData = [],
                        addItem = (item, index)=> {
                            let isString = false;
                            if (!utils.isArray(item) && !utils.isObject(item)) {
                                isString = true;
                            }
                            let element = binder.run(true, index);
                            if (isString) {
                                element.text(item);
                                if (element.data.tplSet.update === 'true') {
                                    watch(obj, objKey, ()=> {
                                        element.text(item);
                                        addChildren.elOnChange(context, element, item);
                                    });
                                }
                            }

                            bindedData.push({
                                binder: element,
                                data:   item
                            });


                            applyAttribute(element, item);
                            addChildren.applyEvents(context, element, item);
                            addChildren.elReady(context, element, item);
                            addChildren.elOnChange(context, element, item);

                            if (element.children) {
                                element.bindings = setBinders(element.children);
                                applyBinders(context, item, element);
                            }


                        };

                    data.forEach(addItem);

                    let update = binder.data.tplSet.update;
                    if (update === 'true') {
                        let removeMethodNames = ['pop', 'shift', 'splice'],
                            insertMethodNames = ['push', 'unshift'],
                            sortingMethodNames = ['reverse', 'sort'];
                        watch(obj, objKey, (prop, action, newValue, oldValue)=> {
                            let clonedData = bindedData.slice(0);
                            if (oldValue === undefined && insertMethodNames.indexOf(action) !== -1) {
                                let filter = clonedData.filter((item)=> item.data === newValue[0]);

                                if (filter.length === 0) {
                                    addItem(newValue[0], (action === 'unshift') ? 0 : clonedData.length);
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
                                                addItem(val, index);
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


                } else if (utils.isObject(data)) {
                    let element = binder.run(data);
                    if (element.data.type !== 'cp') {
                        applyAttribute(element, data);
                        addChildren.applyEvents(context, element, data);
                        addChildren.elReady(context, element, data);
                        addChildren.elOnChange(context, element, data);
                        if (element.children) {
                            element.bindings = setBinders(element.children);
                            applyBinders(context, data, element);
                        }
                    }


                }
            }
        }

    };

    function applyBinders(context, obj, instance) {
        let binders = instance.bindings;
        if (binders) {
            if (binders['__cp__'].length > 0) {
                binders['__cp__'].forEach(binder=> {
                    let component = binder.run(obj);
                    component._match(context.router);
                    addChildren.elReady(context, component, obj);
                    addChildren.elOnChange(context, component, obj);
                });
            }
            let keys = Object.keys(binders);
            if (obj && keys.length > 0) {
                keys.forEach((binderKey) => {
                    if (obj[binderKey] !== undefined) {
                        binders[binderKey].forEach(binder=>parseBinder(context, binderKey, obj, binder));
                    } else {
                        let fn = (prop, action, newValue, oldValue) => {
                            if (newValue !== undefined && oldValue === undefined) {
                                binders[binderKey].forEach(binder=>parseBinder(context, binderKey, obj, binder));
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