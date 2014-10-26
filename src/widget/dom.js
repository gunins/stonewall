/**
 * Created by guntars on 10/10/2014.
 */
define([
    './utils'
], function (utils) {
    var dom = {
        append: function (parent, child) {
            child.el = child.run(parent.el, true);
        },
        replace: function (parent, child) {
            parent.el.innerHTML = '';
            dom.append.apply(this, arguments);
        },
        add: function (el, fragment, parent) {
            el.el = el.run(fragment, false, parent);
        },
        text: function (node, text) {
            node.el.innerHTML = text;
        },
        setAttribute: function (node, prop, value) {
            if (utils.isObject(prop)) {
                Object.keys(prop).forEach(function (key) {
                    node.el.setAttribute(key, prop[key]);
                }.bind(this));
            } else {
                node.el.setAttribute(prop, value);
            }
        },
        removeAttribute: function (node, prop) {
            node.el.removeAttribute(prop);
        },
        setStyle: function (node, prop, value) {
            if (utils.isObject(prop)) {
                Object.keys(prop).forEach(function (key) {
                    node.el.style[key] = prop[key];
                }.bind(this));
            } else {
                node.el.style[prop] = value;
            }
        },
        removeStyle: function (node, prop) {
            delete node.el.style[prop];

        },
        addClass: function (node, className) {
            node.el.classList.add(className);
        },
        removeClass: function (node, className) {
            node.el.classList.remove(className);
        },
        val: function (node, val) {
            var el = node.el;
            if (val !== undefined) {
                el.value = val;
            } else {
                return el.value;
            }
        },
        on: function (element, ev, cb, context) {
            var args = Array.prototype.slice.call(arguments, 4, arguments.length),
                el = element.el,
                events = ev.split(' '),
                fn = function (e) {
                    cb.apply(context || this, [e, element].concat(args));
                };

            events.forEach(function (event) {
                el.addEventListener(event, fn);
            });
            return {
                remove: function () {
                    events.forEach(function (event) {
                        el.removeEventListener(event, fn);
                    });
                }
            }
        },
        Element: Element
    }

    function Element(node) {
        var obj = utils.extend({}, node);
        utils.extend(this, obj);

    }

    utils.extend(Element.prototype, {
        append: function (child) {
            dom.append(this, child)
        },
        replace: function (child) {
            dom.replace(this, child);
        },
        text: function (text) {
            dom.text(this, text);
        },
        add: function (fragment, parent) {
            dom.add(this, fragment, parent);
        },
        setAttribute: function (prop, value) {
            dom.setAttribute(this, prop, value);
        },
        removeAttribute: function (prop) {
            dom.removeAttribute(this, prop);
        },
        setStyle: function (prop, value) {
            dom.setStyle(this, prop, value);
        },
        removeStyle: function (prop) {
            dom.removeStyle(this, prop);
        },
        addClass: function (className) {
            dom.addClass(this, className);
        },
        removeClass: function (className) {
            dom.removeClass(this, className);
        },
        val: function (val) {
           return dom.val(this, val);
        },
        on: function (event, cb, context) {
            var args = Array.prototype.slice.call(arguments, 0);
            return dom.on.apply(false, [this].concat(args));
        }

    });
    Element.extend = utils.fnExtend;
    return dom;
});