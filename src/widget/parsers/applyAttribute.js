/**
 * Created by guntars on 11/11/14.
 */
define([
    'watch',
    './addChildren'
], function(WatchJS, addChildren) {
    var watch = WatchJS.watch;

    function applyAttribute(context, childBinder, data) {
        var bind = childBinder.data.tplSet.bind,
            update = childBinder.data.tplSet.update;
        if (bind) {
            Object.keys(bind).forEach((bindItem)=> {
                let key = bind[bindItem],
                    dataItem = data[key];
                switch (bindItem) {
                    case 'class':
                        let addClass = (className)=> {
                                if (className !== undefined && className !== '') {
                                    childBinder.addClass(className);
                                    return className;
                                } else {
                                    return false;
                                }
                            },
                            currClass = addClass(dataItem);

                        if (update === true) {
                            watch(data, key, ()=> {
                                if (currClass) {
                                    childBinder.removeClass(currClass);
                                }
                                currClass = addClass(data[key]);
                            });
                        }

                        break;
                    case 'checked':
                        if (dataItem !== undefined) {
                            childBinder.el.checked = dataItem;
                        }
                        if (update === true) {
                            watch(data, key, ()=> childBinder.el.checked = data[key]);
                        }
                        break;
                    case 'value':
                        if (dataItem !== undefined) {
                            childBinder.el.value = dataItem;
                        }
                        if (update === true) {
                            watch(data, key, ()=> childBinder.el.value = data[key]);
                        }
                        break;
                    case 'required':
                        if (dataItem !== undefined) {
                            childBinder.el.required = dataItem;
                        }
                        if (update === true) {
                            watch(data, key, ()=> childBinder.el.required = data[key]);
                        }
                        break;
                    case 'text':
                        if (dataItem !== undefined) {
                            childBinder.text(dataItem);
                        }
                        if (update === true) {
                            watch(data, key, ()=> childBinder.text(data[key]));
                        }
                        break;
                    default:
                        if (dataItem !== undefined) {
                            childBinder.setAttribute(bindItem, dataItem);
                        }
                        if (update === true) {
                            watch(data, key, ()=> childBinder.setAttribute(bindItem, data[key]));
                        }
                }

                if (data.text !== undefined && bindItem !== 'text') {
                    childBinder.text(data.text);
                    if (update === true) {
                        if (bindItem !== 'text') {
                            watch(data, 'text', ()=> childBinder.text(data.text));
                        }
                    }
                }
                if (update === true) {
                    let handler = addChildren.elOnChange(context, childBinder);
                    if (handler) {
                        watch(data, key, ()=> handler(data));
                    }
                }

            });
        }

    }

    return applyAttribute;
});