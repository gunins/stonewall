/**
 * Created by guntars on 11/11/14.
 */
define([
    'watch'
], function (WatchJS) {
    var watch = WatchJS.watch;

    function applyAttribute(childBinder, data) {
        var bind = childBinder.data.tplSet.bind,
            update = childBinder.data.tplSet.update;
        if (bind) {
            Object.keys(bind).forEach((bindItem)=> {
                let key = bind[bindItem],
                    dataItem = data[key];
                if (bindItem === 'class') {
                    let addClass = (className)=> {
                            if (className !== undefined && className !== '') {
                                childBinder.addClass(className);
                                return className;
                            } else {
                                return false;
                            }
                        },
                        currClass = addClass(dataItem);

                    if (update === 'true') {
                        watch(data, key, ()=> {
                            if (currClass) {
                                childBinder.removeClass(currClass);
                            }
                            currClass = addClass(data[key]);
                        });
                    }

                } else if (bindItem === 'checked') {
                    if (dataItem !== undefined) {
                        childBinder.el.checked = dataItem;
                    }
                    if (update === 'true') {
                        watch(data, key, ()=> {
                            childBinder.el.checked = data[key];
                        });
                    }
                } else if (bindItem === 'value') {
                    if (dataItem !== undefined) {
                        childBinder.el.value = dataItem;
                    }
                    if (update === 'true') {
                        watch(data, key, ()=> {
                            childBinder.el.value = data[key];
                        });
                    }
                } else if (bindItem === 'required') {
                    if (dataItem !== undefined) {
                        childBinder.el.required = dataItem;
                    }
                    if (update === 'true') {
                        watch(data, key, ()=> {
                            childBinder.el.required = data[key];
                        });
                    }
                } else {
                    if (dataItem !== undefined) {
                        childBinder.setAttribute(bindItem, dataItem);
                    }
                    if (update === 'true') {
                        watch(data, key, ()=> {
                            childBinder.setAttribute(bindItem, data[key]);
                        });
                    }
                }

                if (data.text !== undefined) {
                    childBinder.text(data.text);
                }
                if (update === 'true') {
                    watch(data, 'text', ()=> {
                        childBinder.text(data.text);
                    });
                }

            });
        }

    }

    return applyAttribute;
});