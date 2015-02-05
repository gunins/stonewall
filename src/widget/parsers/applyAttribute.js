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
                if (data[key] !== undefined) {
                    if (bindItem === 'class') {
                        childBinder.addClass(data[key]);
                        var currClass = data[key];
                        if (update === 'true') {
                            watch(data, key, function () {
                                childBinder.removeClass(currClass);
                                childBinder.addClass(data[key]);
                                currClass = data[key];
                            }.bind(this));
                        }
                    } else if (bindItem === 'checked') {
                        childBinder.el.checked = data[key];
                        if (update === 'true') {
                            watch(data, key, function () {
                                childBinder.el.checked = data[key];
                            }.bind(this));
                        }
                    } else {
                        childBinder.setAttribute(bindItem, data[key]);
                        if (update === 'true') {
                            watch(data, key, function () {
                                childBinder.setAttribute(bindItem, data[key]);
                            }.bind(this));
                        }
                    }
                }
                if (data.text !== undefined) {
                    childBinder.text(data.text);
                    if (update === 'true') {
                        watch(data, 'text', function () {
                            childBinder.text(data.text);
                        }.bind(this));
                    }
                }
            });
        }

    }

    return applyAttribute;
});