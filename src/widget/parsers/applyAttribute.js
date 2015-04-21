/**
 * Created by guntars on 11/11/14.
 */
define([
    'watch'
], function (WatchJS) {
    var watch = WatchJS.watch,
        unwatch = WatchJS.unwatch,
        callWatchers = WatchJS.callWatchers;

    function applyAttribute(childBinder, data) {
        var bind = childBinder._node.data.tplSet.bind,
            update = childBinder._node.data.tplSet.update;
        if (bind) {
            Object.keys(bind).forEach(function (bindItem) {
                var key = bind[bindItem];
                var dataItem = data[key];
                if (bindItem === 'class') {
                    var currClass;

                    function addClass(className) {
                        if (className !== undefined && className !== '') {
                            childBinder.addClass(className);
                            return className;
                        } else {
                            return false;
                        }
                    }

                    currClass = addClass(dataItem)

                    if (update === 'true') {
                        watch(data, key, function () {
                            if (currClass) {
                                childBinder.removeClass(currClass);
                            }
                            currClass = addClass(data[key]);
                        }.bind(this));
                    }

                } else if (bindItem === 'checked') {
                    if (dataItem !== undefined) {
                        childBinder.el.checked = dataItem;
                    }
                    if (update === 'true') {
                        watch(data, key, function () {
                            childBinder.el.checked = data[key];
                        }.bind(this));
                    }
                } else if (bindItem === 'required') {
                    if (dataItem !== undefined) {
                        childBinder.el.required = dataItem;
                    }
                    if (update === 'true') {
                        watch(data, key, function () {
                            childBinder.el.required = data[key];
                        }.bind(this));
                    }
                } else {
                    if (dataItem !== undefined) {
                        childBinder.setAttribute(bindItem, dataItem);
                    }
                    if (update === 'true') {
                        watch(data, key, function () {
                            childBinder.setAttribute(bindItem, data[key]);
                        }.bind(this));
                    }
                }

                if (data.text !== undefined) {
                    childBinder.text(data.text);
                }
                if (update === 'true') {
                    watch(data, 'text', function () {
                        childBinder.text(data.text);
                    }.bind(this));
                }

            });
        }

    }

    return applyAttribute;
});