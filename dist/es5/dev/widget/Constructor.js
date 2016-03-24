'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * DEVELOPED BY
 * GIL LOPES BUENO
 * gilbueno.mail@gmail.com
 *
 * WORKS WITH:
 * IE 9+, FF 4+, SF 5+, WebKit, CH 7+, OP 12+, BESEN, Rhino 1.7+
 *
 * FORK:
 * https://github.com/melanke/Watch.JS
 */

(function (factory) {
    if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define('watch', factory);
    } else {
        // Browser globals
        window.WatchJS = factory();
        window.watch = window.WatchJS.watch;
        window.unwatch = window.WatchJS.unwatch;
        window.callWatchers = window.WatchJS.callWatchers;
    }
})(function () {

    var WatchJS = {
        noMore: false
    },
        lengthsubjects = [];

    var isFunction = function isFunction(functionToCheck) {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) == '[object Function]';
    };

    var isInt = function isInt(x) {
        return x % 1 === 0;
    };

    var isArray = function isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    };

    var getObjDiff = function getObjDiff(a, b) {
        var aplus = [],
            bplus = [];

        if (!(typeof a == "string") && !(typeof b == "string")) {

            if (isArray(a)) {
                for (var i = 0; i < a.length; i++) {
                    if (b[i] === undefined) aplus.push(i);
                }
            } else {
                for (var i in a) {
                    if (a.hasOwnProperty(i)) {
                        if (b[i] === undefined) {
                            aplus.push(i);
                        }
                    }
                }
            }

            if (isArray(b)) {
                for (var j = 0; j < b.length; j++) {
                    if (a[j] === undefined) bplus.push(j);
                }
            } else {
                for (var j in b) {
                    if (b.hasOwnProperty(j)) {
                        if (a[j] === undefined) {
                            bplus.push(j);
                        }
                    }
                }
            }
        }

        return {
            added: aplus,
            removed: bplus
        };
    };

    var clone = function clone(obj) {

        if (null == obj || "object" != (typeof obj === 'undefined' ? 'undefined' : _typeof(obj))) {
            return obj;
        }

        var copy = obj.constructor();

        for (var attr in obj) {
            copy[attr] = obj[attr];
        }

        return copy;
    };

    var defineGetAndSet = function defineGetAndSet(obj, propName, getter, setter) {
        /* try {
              Object.observe(obj, function (changes) {
                 changes.forEach(function (change) {
                     if (change.name === propName) {
                         setter(change.object[change.name]);
                     }
                 });
             });
          } catch (e) {*/

        try {
            Object.defineProperty(obj, propName, {
                get: getter,
                set: setter,
                enumerable: true,
                configurable: true
            });
        } catch (e2) {
            try {
                Object.prototype.__defineGetter__.call(obj, propName, getter);
                Object.prototype.__defineSetter__.call(obj, propName, setter);
            } catch (e3) {
                throw new Error("watchJS error: browser not supported :/");
            }
        }

        // }
    };

    var defineProp = function defineProp(obj, propName, value) {
        try {
            Object.defineProperty(obj, propName, {
                enumerable: false,
                configurable: true,
                writable: false,
                value: value
            });
        } catch (error) {
            obj[propName] = value;
        }
    };

    var watch = function watch() {

        if (isFunction(arguments[1])) {
            watchAll.apply(this, arguments);
        } else if (isArray(arguments[1])) {
            watchMany.apply(this, arguments);
        } else {
            watchOne.apply(this, arguments);
        }
    };

    var watchAll = function watchAll(obj, watcher, level, addNRemove) {

        if (typeof obj == "string" || !(obj instanceof Object) && !isArray(obj)) {
            //accepts only objects and array (not string)
            return;
        }

        var props = [];

        if (isArray(obj)) {
            for (var prop = 0; prop < obj.length; prop++) {
                //for each item if obj is an array
                props.push(prop); //put in the props
            }
        } else {
                for (var prop2 in obj) {
                    //for each attribute if obj is an object
                    if (prop2 == "$val") {
                        continue;
                    }

                    if (Object.prototype.hasOwnProperty.call(obj, prop2)) {
                        props.push(prop2); //put in the props
                    }
                }
            }

        watchMany(obj, props, watcher, level, addNRemove); //watch all items of the props

        if (addNRemove) {
            pushToLengthSubjects(obj, "$$watchlengthsubjectroot", watcher, level);
        }
    };

    var watchMany = function watchMany(obj, props, watcher, level, addNRemove) {

        if (typeof obj == "string" || !(obj instanceof Object) && !isArray(obj)) {
            //accepts only objects and array (not string)
            return;
        }

        for (var i = 0; i < props.length; i++) {
            //watch each property
            var prop = props[i];
            watchOne(obj, prop, watcher, level, addNRemove);
        }
    };

    var watchOne = function watchOne(obj, prop, watcher, level, addNRemove) {
        if (typeof obj == "string" || !(obj instanceof Object) && !isArray(obj)) {
            //accepts only objects and array (not string)
            return;
        }

        if (isFunction(obj[prop])) {
            //dont watch if it is a function
            return;
        }
        if (obj[prop] != null && (level === undefined || level > 0)) {
            watchAll(obj[prop], watcher, level !== undefined ? level - 1 : level); //recursively watch all attributes of this
        }

        defineWatcher(obj, prop, watcher, level);

        if (addNRemove && (level === undefined || level > 0)) {
            pushToLengthSubjects(obj, prop, watcher, level);
        }
    };

    var unwatch = function unwatch() {

        if (isFunction(arguments[1])) {
            unwatchAll.apply(this, arguments);
        } else if (isArray(arguments[1])) {
            unwatchMany.apply(this, arguments);
        } else {
            unwatchOne.apply(this, arguments);
        }
    };

    var unwatchAll = function unwatchAll(obj, watcher) {

        if (obj instanceof String || !(obj instanceof Object) && !isArray(obj)) {
            //accepts only objects and array (not string)
            return;
        }

        if (isArray(obj)) {
            var props = [];
            for (var prop = 0; prop < obj.length; prop++) {
                //for each item if obj is an array
                props.push(prop); //put in the props
            }
            unwatchMany(obj, props, watcher); //watch all itens of the props
        } else {
                var unwatchPropsInObject = function unwatchPropsInObject(obj2) {
                    var props = [];
                    for (var prop2 in obj2) {
                        //for each attribute if obj is an object
                        if (obj2.hasOwnProperty(prop2)) {
                            if (obj2[prop2] instanceof Object) {
                                unwatchPropsInObject(obj2[prop2]); //recurs into object props
                            } else {
                                    props.push(prop2); //put in the props
                                }
                        }
                    }
                    unwatchMany(obj2, props, watcher); //unwatch all of the props
                };
                unwatchPropsInObject(obj);
            }
    };

    var unwatchMany = function unwatchMany(obj, props, watcher) {

        for (var prop2 in props) {
            //watch each attribute of "props" if is an object
            if (props.hasOwnProperty(prop2)) {
                unwatchOne(obj, props[prop2], watcher);
            }
        }
    };

    var defineWatcher = function defineWatcher(obj, prop, watcher, level) {

        var val = obj[prop];

        watchFunctions(obj, prop);

        if (!obj.watchers) {
            defineProp(obj, "watchers", {});
        }

        var newWatcher = false;
        if (!obj.watchers[prop]) {
            obj.watchers[prop] = [];
            newWatcher = true;
        }

        for (var i = 0; i < obj.watchers[prop].length; i++) {
            if (obj.watchers[prop][i] === watcher) {
                return;
            }
        }

        obj.watchers[prop].push(watcher); //add the new watcher in the watchers array

        if (newWatcher) {
            var getter = function getter() {
                return val;
            };

            var setter = function setter(newval) {
                var oldval = val;
                val = newval;

                if (level !== 0 && obj[prop]) {
                    // watch sub properties
                    watchAll(obj[prop], watcher, level === undefined ? level : level - 1);
                }

                watchFunctions(obj, prop);

                if (!WatchJS.noMore) {
                    //if (JSON.stringify(oldval) !== JSON.stringify(newval)) {
                    if (oldval !== newval) {
                        callWatchers(obj, prop, "set", newval, oldval);
                        WatchJS.noMore = false;
                    }
                }
            };

            defineGetAndSet(obj, prop, getter, setter);
        }
    };

    var callWatchers = function callWatchers(obj, prop, action, newval, oldval) {
        if (prop !== undefined) {
            for (var wr = 0; wr < obj.watchers[prop].length; wr++) {
                obj.watchers[prop][wr].call(obj, prop, action, newval, oldval);
            }
        } else {
            for (var prop in obj) {
                //call all
                if (obj.hasOwnProperty(prop)) {
                    callWatchers(obj, prop, action, newval, oldval);
                }
            }
        }
    };

    // @todo code related to "watchFunctions" is certainly buggy
    var methodNames = ['pop', 'push', 'reverse', 'shift', 'sort', 'slice', 'unshift', 'splice'];
    var defineArrayMethodWatcher = function defineArrayMethodWatcher(obj, prop, original, methodName) {
        defineProp(obj[prop], methodName, function () {
            var response = original.apply(obj[prop], arguments);
            watchOne(obj, obj[prop]);
            if (methodName !== 'slice') {
                callWatchers(obj, prop, methodName, arguments);
            }
            return response;
        });
    };

    var watchFunctions = function watchFunctions(obj, prop) {

        if (!obj[prop] || obj[prop] instanceof String || !isArray(obj[prop])) {
            return;
        }

        for (var i = methodNames.length, methodName; i--;) {
            methodName = methodNames[i];
            defineArrayMethodWatcher(obj, prop, obj[prop][methodName], methodName);
        }
    };

    var unwatchOne = function unwatchOne(obj, prop, watcher) {

        for (var i = 0; i < obj.watchers[prop].length; i++) {
            var w = obj.watchers[prop][i];
            if (w == watcher) {
                obj.watchers[prop].splice(i, 1);
            }
        }

        removeFromLengthSubjects(obj, prop, watcher);
    };

    var loop = function loop() {

        for (var i = 0; i < lengthsubjects.length; i++) {

            var subj = lengthsubjects[i];

            if (subj.prop === "$$watchlengthsubjectroot") {

                var difference = getObjDiff(subj.obj, subj.actual);

                if (difference.added.length || difference.removed.length) {
                    if (difference.added.length) {
                        watchMany(subj.obj, difference.added, subj.watcher, subj.level - 1, true);
                    }

                    subj.watcher.call(subj.obj, "root", "differentattr", difference, subj.actual);
                }
                subj.actual = clone(subj.obj);
            } else {

                var difference = getObjDiff(subj.obj[subj.prop], subj.actual);

                if (difference.added.length || difference.removed.length) {
                    if (difference.added.length) {
                        for (var j = 0; j < subj.obj.watchers[subj.prop].length; j++) {
                            watchMany(subj.obj[subj.prop], difference.added, subj.obj.watchers[subj.prop][j], subj.level - 1, true);
                        }
                    }

                    callWatchers(subj.obj, subj.prop, "differentattr", difference, subj.actual);
                }

                subj.actual = clone(subj.obj[subj.prop]);
            }
        }
    };

    var pushToLengthSubjects = function pushToLengthSubjects(obj, prop, watcher, level) {

        var actual;

        if (prop === "$$watchlengthsubjectroot") {
            actual = clone(obj);
        } else {
            actual = clone(obj[prop]);
        }

        lengthsubjects.push({
            obj: obj,
            prop: prop,
            actual: actual,
            watcher: watcher,
            level: level
        });
    };

    var removeFromLengthSubjects = function removeFromLengthSubjects(obj, prop, watcher) {

        for (var i = 0; i < lengthsubjects.length; i++) {
            var subj = lengthsubjects[i];

            if (subj.obj == obj && subj.prop == prop && subj.watcher == watcher) {
                lengthsubjects.splice(i, 1);
            }
        }
    };

    setInterval(loop, 50);

    WatchJS.watch = watch;
    WatchJS.unwatch = unwatch;
    WatchJS.callWatchers = callWatchers;

    return WatchJS;
});
/**
 * Created by guntars on 11/11/14.
 */
define('widget/parsers/applyAttribute', ['watch'], function (WatchJS) {
    var watch = WatchJS.watch;

    function applyAttribute(childBinder, data) {
        var bind = childBinder.data.tplSet.bind,
            update = childBinder.data.tplSet.update === 'true';
        if (bind) {
            Object.keys(bind).forEach(function (bindItem) {
                var key = bind[bindItem],
                    dataItem = data[key];
                switch (bindItem) {
                    case 'class':
                        var addClass = function addClass(className) {
                            if (className !== undefined && className !== '') {
                                childBinder.addClass(className);
                                return className;
                            } else {
                                return false;
                            }
                        },
                            currClass = addClass(dataItem);

                        if (update === true) {
                            watch(data, key, function () {
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
                            watch(data, key, function () {
                                return childBinder.el.checked = data[key];
                            });
                        }
                        break;
                    case 'value':
                        if (dataItem !== undefined) {
                            childBinder.el.value = dataItem;
                        }
                        if (update === true) {
                            watch(data, key, function () {
                                return childBinder.el.value = data[key];
                            });
                        }
                        break;
                    case 'required':
                        if (dataItem !== undefined) {
                            childBinder.el.required = dataItem;
                        }
                        if (update === true) {
                            watch(data, key, function () {
                                return childBinder.el.required = data[key];
                            });
                        }
                        break;
                    case 'text':
                        if (dataItem !== undefined) {
                            childBinder.text(dataItem);
                        }
                        if (update === true) {
                            watch(data, key, function () {
                                return childBinder.text(dataItem);
                            });
                        }
                        break;
                    default:
                        if (dataItem !== undefined) {
                            childBinder.setAttribute(bindItem, dataItem);
                        }
                        if (update === true) {
                            watch(data, key, function () {
                                return childBinder.setAttribute(bindItem, data[key]);
                            });
                        }
                }

                if (data.text !== undefined) {
                    childBinder.text(data.text);
                }
                if (update === true) {
                    watch(data, 'text', function () {
                        return childBinder.text(data.text);
                    });
                }
            });
        }
    }

    return applyAttribute;
});
/**
 * Created by guntars on 15/03/2016.
 */
define('widget/parsers/addChildren', [], function () {
    'use strict';

    function addChildren(context, child, data) {
        if (child && child.name && context) {
            applyEvents(context, child, data);
            elReady(context, child, data);
            elOnChange(context, child, data);

            context.children[child.name] = child;
            return child;
        }
    };

    function elOnChange(context, child, data) {
        if (context.elOnChange[child.name] !== undefined) {
            context.elOnChange[child.name].call(context, child, data);
        }
    };

    function elReady(context, child, data) {
        if (context.elReady[child.name] !== undefined) {
            context.elReady[child.name].call(context, child, data);
        }
    };

    //Aplying Events to elements
    //
    //      @private applyEvents
    //      @param {dom.Element} element
    //      @param {Array} events
    //      @param {Object} data
    function applyEvents(context, child, data) {
        var events = context.events[child.name];
        if (events !== undefined && child.el !== undefined && child.data.type !== 'cp') {
            events.forEach(function (event) {
                context._events.push(child.on(event.name, event.action, context, data));
            });
        }
    };

    Object.assign(addChildren, { elOnChange: elOnChange, elReady: elReady, applyEvents: applyEvents });

    return addChildren;
});
/**
 * Created by guntars on 11/11/14.
 */
define('widget/parsers/applyParent', ['templating/dom', './addChildren'], function (dom, addChildren) {

    function setChildren(context) {
        var parentChildren = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
        var data = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

        if (context) {
            (function () {
                var elements = context.children;

                if (elements) {
                    Object.keys(elements).forEach(function (name) {
                        var add = true,
                            child = elements[name],
                            parentChild = parentChildren[name];
                        if (parentChild !== undefined) {
                            if (context.nodes[name] !== undefined) {
                                context.nodes[name].call(context, child, parentChild, data);
                            } else if (child !== undefined) {
                                if (typeof parentChild === 'string') {
                                    dom.text(child, parentChild);
                                } else {
                                    child = parentChild.run(child.el);
                                }
                            }
                        } else if (context.nodes[name] !== undefined && child.data.tplSet.noattach === 'true') {
                            context.nodes[name].call(context, child, data);
                            add = false;
                        }
                        if (add && child.elGroup.size > 0) {
                            addChildren(context, child, data);
                        }
                    });
                }
            })();
        }
    }

    return setChildren;
});
/**
 * Created by guntars on 10/10/2014.
 */
define('widget/utils', [], function () {
    function extend(obj) {
        var type = typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
        if (!(type === 'function' || type === 'object' && !!obj)) {
            return obj;
        }
        var source, prop;
        for (var i = 1, length = arguments.length; i < length; i++) {
            source = arguments[i];
            for (prop in source) {
                obj[prop] = source[prop];
            }
        }
        return obj;
    };

    function fnExtend(protoProps, staticProps) {
        var parent = this;
        var child;
        if (protoProps && protoProps != null && hasOwnProperty.call(protoProps, 'constructor')) {
            child = protoProps.constructor;
        } else {
            child = function child() {
                return parent.apply(this, arguments);
            };
        }

        extend(child, parent, staticProps);

        var Surrogate = function Surrogate() {
            this.constructor = child;
        };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate();
        if (protoProps) {
            extend(child.prototype, protoProps);
        }

        child.__super__ = parent.prototype;
        return child;
    };

    function isString(obj) {
        return toString.call(obj) === '[object String]';
    }

    function isObject(obj) {
        return obj === Object(obj);
    }

    function isArray(obj) {
        return Array.isArray ? Array.isArray(obj) : toString.call(obj) === '[object Array]';
    }

    return {
        fnExtend: fnExtend,
        // Extend a given object with all the properties in passed-in object(s).
        extend: extend,
        // Check if it's String
        isString: isString,
        // Check if I't Object
        isObject: isObject,
        // Check if it's Array
        isArray: isArray
    };
});
/**
 * Created by guntars on 11/11/14.
 */
define('widget/parsers/setBinders', [], function () {

    function setBinders(children, ignoreCP) {
        var bindings = {};
        Object.defineProperty(bindings, '__cp__', {
            enumerable: false,
            value: []
        });
        Object.keys(children).forEach(function (key) {
            var el = children[key];
            if (el && el.data && el.data.bind !== undefined && el.data.type !== 'cp') {
                bindings[el.data.bind] = bindings[el.data.bind] || [];
                bindings[el.data.bind].push(el);
            } else if (!ignoreCP && el.data.type === 'cp') {
                bindings['__cp__'].push(el);
            }
        });
        return bindings;
    }

    return setBinders;
});
/**
 * Created by guntars on 11/11/14.
 */
define('widget/parsers/applyBinders', ['templating/dom', '../utils', 'watch', './setBinders', './addChildren', './applyAttribute'], function (dom, utils, WatchJS, setBinders, addChildren, applyAttribute) {
    var watch = WatchJS.watch,
        unwatch = WatchJS.unwatch;

    function parseBinder(context, objKey, obj, binder) {
        if (binder !== undefined) {
            var data = obj[objKey];

            if (context.nodes[objKey]) {
                context.nodes[objKey].call(context, binder, data);
            } else {
                if (!utils.isArray(data) && !utils.isObject(data)) {
                    (function () {
                        var element = binder.run(true);
                        element.text(data);
                        addChildren.applyEvents(context, element, data);
                        addChildren.elReady(context, element, data);
                        addChildren.elOnChange(context, element, data);

                        if (element.data.tplSet.update === 'true') {
                            watch(obj, objKey, function () {
                                element.text(obj[objKey]);
                                addChildren.elOnChange(context, element, obj[objKey]);
                            });
                        }
                    })();
                } else if (utils.isArray(data)) {
                    (function () {

                        var bindedData = [],
                            addItem = function addItem(item, index) {
                            var isString = false;
                            if (!utils.isArray(item) && !utils.isObject(item)) {
                                isString = true;
                            }
                            var element = binder.run(true, index);
                            if (isString) {
                                element.text(item);
                                if (element.data.tplSet.update === 'true') {
                                    watch(obj, objKey, function () {
                                        element.text(item);
                                        addChildren.elOnChange(context, element, item);
                                    });
                                }
                            }

                            bindedData.push({
                                binder: element,
                                data: item
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

                        var update = binder.data.tplSet.update;
                        if (update === 'true') {
                            (function () {
                                var removeMethodNames = ['pop', 'shift', 'splice'],
                                    insertMethodNames = ['push', 'unshift'],
                                    sortingMethodNames = ['reverse', 'sort'];
                                watch(obj, objKey, function (prop, action, newValue, oldValue) {
                                    var clonedData = bindedData.slice(0);
                                    if (oldValue === undefined && insertMethodNames.indexOf(action) !== -1) {
                                        var filter = clonedData.filter(function (item) {
                                            return item.data === newValue[0];
                                        });

                                        if (filter.length === 0) {
                                            addItem(newValue[0], action === 'unshift' ? 0 : clonedData.length);
                                        }
                                    } else if (removeMethodNames.indexOf(action) !== -1) {
                                        clonedData.forEach(function (binder) {
                                            if (obj[objKey].indexOf(binder.data) === -1) {
                                                binder.binder.remove();
                                                bindedData.splice(bindedData.indexOf(binder), 1);
                                            }
                                        });

                                        if (action === 'splice') {
                                            var vals = Array.prototype.slice.call(newValue, 2);
                                            if (vals && vals.length > 0) {
                                                vals.forEach(function (val) {
                                                    var index = obj[objKey].indexOf(val);
                                                    if (index !== -1) {
                                                        addItem(val, index);
                                                    }
                                                });
                                            }
                                        }
                                    } else if (sortingMethodNames.indexOf(action) !== -1) {
                                        data.forEach(function (value, index) {
                                            var element = clonedData.filter(function (item) {
                                                return item.data === value;
                                            })[0];
                                            bindedData.splice(index, 0, bindedData.splice(bindedData.indexOf(element), 1)[0]);
                                            element.binder.changePosition(index);
                                        });
                                    }
                                });
                            })();
                        }
                    })();
                } else if (utils.isObject(data)) {
                    var _element = binder.run(data);
                    if (_element.data.type !== 'cp') {
                        applyAttribute(_element, data);
                        addChildren.applyEvents(context, _element, data);
                        addChildren.elReady(context, _element, data);
                        addChildren.elOnChange(context, _element, data);
                        if (_element.children) {
                            _element.bindings = setBinders(_element.children);
                            applyBinders(context, data, _element);
                        }
                    }
                }
            }
        }
    };

    function applyBinders(context, obj, instance) {
        var binders = instance.bindings;
        if (binders) {
            if (binders['__cp__'].length > 0) {
                binders['__cp__'].forEach(function (binder) {
                    var component = binder.run(obj);
                    addChildren.elReady(context, component, obj);
                    addChildren.elOnChange(context, component, obj);
                });
            }
            var keys = Object.keys(binders);
            if (obj && keys.length > 0) {
                keys.forEach(function (binderKey) {
                    if (obj[binderKey] !== undefined) {
                        binders[binderKey].forEach(function (binder) {
                            return parseBinder(context, binderKey, obj, binder);
                        });
                    } else {
                        (function () {
                            var fn = function fn(prop, action, newValue, oldValue) {
                                if (newValue !== undefined && oldValue === undefined) {
                                    binders[binderKey].forEach(function (binder) {
                                        return parseBinder(context, binderKey, obj, binder);
                                    });
                                    unwatch(obj, binderKey, fn);
                                }
                            };
                            watch(obj, binderKey, fn, 0);
                        })();
                    }
                });
            }
        }
    }

    return applyBinders;
});
/**
 * Created by guntars on 11/11/14.
 */
define('widget/parsers/setRoutes', ['templating/dom'], function (dom) {

    function destroyComponent(cp) {
        if (cp.remove !== undefined) {
            cp.remove();
        }
    }

    function applyToChildren(children, cb) {
        if (children !== undefined) {
            Object.keys(children).forEach(function (name) {
                var cp = children[name];
                if (cp.elGroup && cp.elGroup.size > 0) {
                    cp.elGroup.forEach(function (item) {
                        return cb(item);
                    });
                } else {
                    cb(cp);
                }
            });
        }
    }

    function matchRoute(child, match) {
        var route = child.data !== undefined ? child.data.route : undefined;

        if (route !== undefined && child.data.type !== 'cp' && child.name !== 'root') {
            (function () {
                var id = void 0,
                    childMatch = void 0,

                //Need add return match in router, for better readability
                matches = match(route, function (match) {
                    childMatch = match;
                });
                matches.to(function () {
                    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                        args[_key] = arguments[_key];
                    }

                    var params = args.pop();
                    id = args.length > 0 ? params.getLocation() + '_' + args.join('_') : undefined;
                    if (child.elGroup && child.elGroup.size === 0) {
                        child = child.run(true);
                        applyToChildren(child.children, function (instance) {
                            if (instance && instance.to) {
                                instance.to.apply(instance, _toConsumableArray(args.concat(params)));
                            }

                            if (instance && !instance._match) {
                                matchRoute(instance, childMatch);
                            } else if (instance && instance._match) {
                                matches.setRoutes(function (routes) {
                                    instance._match(function () {
                                        var match = routes.match.apply(routes, arguments);
                                        instance._appliedRoutes.push(match);
                                        return match;
                                    });
                                    routes.run();
                                });

                                instance._reRoute = function () {
                                    instance._applyRoutes(matches);
                                };
                            }
                        });
                    } else {
                        applyToChildren(child.children, function (instance) {
                            if (instance && instance.to) {
                                instance.to.apply(instance, args.concat(params));
                            }
                        });
                        dom.attach(child);
                    }
                });

                matches.leave(function () {
                    applyToChildren(child.children, function (instance) {
                        if (instance && instance.leave !== undefined) {
                            instance.leave();
                        }
                    });
                    if (!id) {
                        dom.detach(child);
                    } else {
                        destroyComponent(child);
                    }
                });

                matches.query(function (params) {
                    applyToChildren(child.children, function (instance) {
                        if (instance && instance.query !== undefined) {
                            instance.query(params);
                        }
                    });
                });
            })();
        } else if (child.children !== undefined && child.data.type !== 'cp') {
            applyToChildren(child.children, function (child) {
                return matchRoute(child, match);
            });
        } else if (child.elGroup && child.elGroup.size > 0) {
            child.elGroup.forEach(function (instance) {
                if (child.data.type === 'cp' && instance._match) {
                    instance._match(match);
                }
            });
        }
    }

    function setRoutes(context, children) {
        if (!context._match) {
            context._match = function (match) {
                applyToChildren(children, function (child) {
                    return matchRoute(child, match);
                });
                if (context.match) {
                    context.match(match);
                }
            };
        }
    };

    return setRoutes;
});
/**
 * Created by guntars on 15/03/2016.
 */
define('widget/parsers/applyElement', ['templating/dom'], function (dom) {
    //Applying dom.Element to template elements.
    //
    //      @private applyElement
    //      @param {Object} elements
    function applyElement() {
        var elements = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
        var params = arguments[1];

        var instances = {};
        Object.keys(elements).forEach(function (key) {
            var instance = elements[key];
            if (typeof instance !== 'string') {
                (function () {
                    var element = instance.elGroup.first;
                    if (element) {
                        instances[key] = element;
                        if (element instanceof dom.Element === true && ['pl'].indexOf(element.data.type) !== -1) {
                            (function () {
                                var bind = element.data.tplSet.bind;
                                if (bind) {
                                    Object.keys(bind).forEach(function (attr) {
                                        if (params[bind[attr]] !== undefined) {
                                            if (attr !== 'class') {
                                                element.setAttribute(attr, params[bind[attr]]);
                                            } else {
                                                element.addClass(params[bind[attr]]);
                                            }
                                        }
                                    });
                                }
                            })();
                        }
                    } else {
                        instances[key] = instance;
                    }
                })();
            }
        });

        return instances;
    }

    return applyElement;
});
/**
 * Created by guntars on 10/10/2014.
 */
/*globals define*/
//## widget/Constructor Class
// This is App Presenter class parse data, and apply to template. Also binding events to Element.
// Basic Usage example
//
//      define([
//          'templating/parser!widget.html',
//          'widget/Constructor'
//      ], function (template, Constructor) {
//          var Widget = Constructor.extend({
//              template: template
//          });
//          return Widget;
//      });
define('widget/Constructor', ['require', 'templating/Decoder', 'templating/dom', './Mediator', './parsers/applyAttribute', './parsers/applyParent', './parsers/applyBinders', './parsers/setBinders', './parsers/setRoutes', './parsers/applyElement', './parsers/addChildren'], function (require, Decoder, dom, Mediator, applyAttribute, applyParent, _applyBinders, setBinders, setRoutes, applyElement, addChildren) {
    'use strict';

    //TODO: need better Solution later. Context is too global;

    var context = {};

    function _destroy(instance) {
        var keys = Object.keys(instance);
        if (keys.length > 0) {
            keys.forEach(function (key) {
                if (key !== 'root') {
                    var children = instance[key];
                    if (children.elGroup !== undefined && children.elGroup.size > 0) {
                        children.elGroup.forEach(function (child) {
                            if (child !== undefined && child.remove !== undefined) {
                                child.remove(true);
                            }
                        });
                    }
                }
            });
        }
    }

    // Constructor Class
    //
    //      @Constructor
    //      @param {Object} data
    //      @param {Object} children
    //      @param {Object} dataSet

    var Constructor = function () {
        _createClass(Constructor, null, [{
            key: 'extend',
            value: function extend() {
                var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

                var Surrogate = function (_Constructor) {
                    _inherits(Surrogate, _Constructor);

                    function Surrogate() {
                        _classCallCheck(this, Surrogate);

                        return _possibleConstructorReturn(this, Object.getPrototypeOf(Surrogate).apply(this, arguments));
                    }

                    return Surrogate;
                }(Constructor);

                Object.assign(Surrogate.prototype, options);
                return Surrogate;
            }
        }]);

        function Constructor(data, parentChildren, dataSet, node) {
            _classCallCheck(this, Constructor);

            //TODO: for Backwards compatability later need to remove
            this.instance = this;
            this._routes = [];
            this._appliedRoutes = [];
            this._events = [];
            this._globalEvents = [];

            this.eventBus = new Mediator(this);

            this.context = context;

            if (data.appContext !== undefined) {
                Object.assign(this.context, data.appContext);
            }

            if (node !== undefined && node.name !== undefined) {
                this.name = node.name;
            }

            this.beforeInit.apply(this, arguments);

            if (this.template) {
                var keys = dataSet ? Object.keys(dataSet) : [],
                    contextData = keys.length > 0 ? dataSet : this.context.data;

                if (!this.data && contextData) {
                    this.data = contextData[data.bind] || contextData;
                }

                var decoder = new Decoder(this.template),
                    template = decoder.render(this.data);

                this.el = template.fragment;

                this.root = new dom.Element(this.el, {
                    name: 'root'
                });

                this.children = applyElement(template.children, data);
                setRoutes(this, this.children);
                applyParent(this, parentChildren, this.data);
                this.bindings = setBinders(this.children, true);

                if (this.data) {
                    this.applyBinders(this.data, this);
                }

                addChildren(this, this.root);
            } else {
                this.el = document.createElement('div');
            }
            this.init.apply(this, arguments);
        }

        _createClass(Constructor, [{
            key: 'init',
            value: function init(data, children, dataSet) {}
        }, {
            key: 'beforeInit',


            // Running before Constructor is initialised
            //
            //      @method beforeInit
            //      @param {Object} data (comes from template data attributes)
            //      @param {Object} children (comes placeholder content
            //      from template)
            //      @param {Object} datatSet (data passing if component is
            //      in template binders)
            value: function beforeInit(data, children, dataSet) {}
        }, {
            key: 'loadCss',


            // Load external css style for third party modules.
            //
            //      @method loadCss
            //      @param {string} url
            value: function loadCss(url) {
                this.context._cssReady = this.context._cssReady || [];
                if (this.context._cssReady.indexOf(url) === -1) {
                    this.context._cssReady.push(url);
                    var linkRef = document.createElement("link");
                    linkRef.setAttribute("rel", "stylesheet");
                    linkRef.setAttribute("type", "text/css");
                    linkRef.setAttribute("href", url);
                    if (typeof linkRef != "undefined") {
                        document.getElementsByTagName("head")[0].appendChild(linkRef);
                    }
                }
            }
        }, {
            key: 'detach',


            // Remove from parentNode
            //
            //      @method detach
            value: function detach() {
                if (!this._placeholder) {
                    this._placeholder = document.createElement(this.el.tagName);
                }
                if (!this._parent) {
                    this._parent = this.el.parentNode;
                }

                if (this.el && this._parent) {
                    this._parent.replaceChild(this._placeholder, this.el);
                }
            }
        }, {
            key: 'attach',


            // Add to parentNode
            //
            //      @method attach
            value: function attach() {
                if (this._placeholder && this._parent) {
                    this._parent.replaceChild(this.el, this._placeholder);
                }
            }
        }, {
            key: 'onDestroy',


            // Executes when Component is destroyed
            //
            //      @method applyBinders
            value: function onDestroy() {}
        }, {
            key: 'destroy',


            //Removing widget from Dom
            //
            //      @method destroy
            value: function destroy(force) {
                this.onDestroy();
                this.eventBus.clear();
                while (this._events.length > 0) {
                    this._events.shift().remove();
                }

                while (this._appliedRoutes.length > 0) {
                    this._appliedRoutes.shift().remove();
                }

                while (this._globalEvents.length > 0) {
                    this._globalEvents.shift().remove();
                }

                _destroy(this.children);
                if (force && this._matches) {
                    this._matches.remove();
                }

                if (this.elGroup !== undefined && this.el !== undefined) {
                    this.elGroup.delete(this.el);
                }
                this.root.remove();

                delete this.el;
            }
        }, {
            key: 'remove',
            value: function remove() {
                this.destroy.apply(this, arguments);
            }
        }, {
            key: 'setRoutes',
            value: function setRoutes(instance) {
                if (instance !== undefined) {
                    this._routes.push(instance);
                }
            }
        }, {
            key: '_applyRoutes',
            value: function _applyRoutes(matches) {
                var _this2 = this;

                var _loop = function _loop() {
                    var instance = _this2._routes.shift();
                    if (instance && instance._match) {
                        matches.setRoutes(function (routes) {
                            instance._match(function () {
                                var match = routes.match.apply(routes, arguments);
                                _this2._appliedRoutes.push(match);
                                return match;
                            });
                            routes.run();
                        });
                    }
                };

                while (this._routes.length > 0) {
                    _loop();
                }
                matches.rebind();
            }
        }, {
            key: '_reRoute',
            value: function _reRoute() {
                this._routes.splice(0, this._routes.length);
            }
        }, {
            key: 'rebind',
            value: function rebind() {
                this._reRoute();
            }
        }, {
            key: 'setChildren',


            // Adding Childrens manually after initialization.
            //  @method setChildren
            //  @param {Element} el
            //  @param {Object} data
            value: function setChildren(el, data) {
                var name = el.data.name,
                    instance = this.children[name];
                if (instance !== undefined && instance.el !== undefined) {
                    instance.remove();
                }

                instance = el.run(data || true);
                addChildren(this, instance, data);

                this.setRoutes(instance);
                this.rebind();
            }
        }, {
            key: 'addComponent',


            // Adding Dynamic components
            // @method addComponent
            // @param {String} name
            // @param {Constructor} Component
            // @param {Element} container
            // @param {Object} data (data attributes)
            // @param {Object} children
            // @param {Object} dataSet (Model for bindings)
            value: function addComponent(Component, options) {
                var name = options.name,
                    container = options.container;

                if (name === undefined) {
                    throw 'you have to define data.name for component.';
                } else if (container === undefined) {
                    throw 'You have to define container for component.';
                } else if (this.children[name] !== undefined) {
                    throw 'Component using name:' + name + '! already defined.';
                }
                var component = this.setComponent(Component, options),
                    instance = component.run(options.container);
                this.children[name] = instance;
                this.setRoutes(instance);
                this.rebind();
                return instance;
            }
        }, {
            key: 'setComponent',
            value: function setComponent(Component, options) {
                var _this3 = this;

                var instance = {
                    name: options.name,
                    data: {
                        tag: 'div',
                        type: 'cp'
                    },
                    run: function run(container) {
                        options.appContext = _this3.context;
                        var cp = new Component(options, options.children, options.data);
                        if (container instanceof HTMLElement === true) {
                            container.parentNode.replaceChild(cp.el, container);
                        } else if (container.el !== undefined && options.pos !== undefined) {
                            dom.insertBefore(container, cp, options.pos);
                        } else if (container.el !== undefined) {
                            dom.append(container, cp);
                        }
                        return cp;
                    }
                };
                return instance;
            }

            // Running when Constructor is initialised
            //
            //      @method applyBinders
            //      @param {Object} data (comes from template data attributes)
            //      @param {Object} children (comes placeholder content
            //      from template)
            //      @param {Object} datatSet (data passing if component is
            //      in template binders)
            // Applying Binders manually, if use nodes function
            //
            //      @method applyBinders

        }, {
            key: 'applyBinders',
            value: function applyBinders() {
                for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    args[_key2] = arguments[_key2];
                }

                return _applyBinders.apply(undefined, [this].concat(args));
            }
        }]);

        return Constructor;
    }();

    Object.assign(Constructor.prototype, {
        // `nodes` Object override default methods to Elements.
        // Usage Example
        //
        //      nodes: {
        //          listItem: function (el, parent, data) {
        //              el.add(parent);
        //              el.text(data);
        //          }
        //      }
        nodes: {},

        // `events` Object applying events to elements
        // You can apply more than one event on element
        // Usage Example
        //
        //      events: {
        //          delete: [
        //              {
        //                  name: 'click',
        //                  action: function () {
        //                      this.data.remove = true
        //                      this.destroy();
        //                  }
        //              }
        //          ]
        events: {},
        // Applying extra methods to Element
        // Usage Example
        //
        //      elReady: {
        //          links: function (el, data) {
        //              if(data.class==='active'){
        //                  el.addClass('active');
        //              }
        //          }
        //      },
        elReady: {},
        // Applying methods to element when data is changed to Element
        // Usage Example
        //
        //      elOnChange: {
        //          links: function (el, data) {
        //              if(data.class==='active'){
        //                  el.addClass('active');
        //              }
        //          }
        //      },
        elOnChange: {}
    });

    return Constructor;
});
//# sourceMappingURL=Constructor.js.map
