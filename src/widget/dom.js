/**
 * Created by guntars on 10/10/2014.
 */
//## widget/dom Class for dom manipulation
define([
    './utils'
], function (utils) {
    var dom = {
        // Method to attach to DOM
        //
        //      @method append
        //      @param {dom.Element} parent
        //      @param {dom.Element} child
        //      @param {Object} data
        append: function (parent, child, data) {
            child.placeholder = parent.el.querySelector('#' + child.id);
            child.el = child.run(parent.el, true, false, data);
        },
        // Replacing element in to DOM
        //
        //      @method replace
        //      @param {dom.Element} parent
        //      @param {dom.Element} child
        //      @param {Object} data
        replace: function (parent, child, data) {
            parent.el.innerHTML = '';
            dom.append.apply(this, arguments);
        },
        detach: function (el) {
            if(el.el.parentNode) {
                el.el.parentNode.replaceChild(el.placeholder, el.el)
            }
        },
        attach: function (el) {
            if(el.placeholder.parentNode){
                el.placeholder.parentNode.replaceChild(el.el, el.placeholder)
            }
        },
        add: function (el, fragment, parent, data) {
            el.placeholder = fragment.querySelector('#' + el.id);
            el.el = el.run(fragment, false, parent, data);
        },
        // Adding text in to node
        //
        //      @method text
        //      @param {dom.Element}
        //      @param {String} text
        text: function (node, text) {
            node.el.innerHTML = text;
        },
        // Setting Attribute in to node
        //
        //      @method setAttribute
        //      @prop {dom.Element} node
        //      @prop {String||Object} prop
        //      @prop {String} value
        setAttribute: function (node, prop, value) {
            if (utils.isObject(prop)) {
                Object.keys(prop).forEach(function (key) {
                    node.el.setAttribute(key, prop[key]);
                }.bind(this));
            } else {
                node.el.setAttribute(prop, value);
            }
        },
        // Removing Attribute from node
        //
        //      @method removeAttribute
        //      @prop {dom.Element} node
        //      @prop {String} prop
        removeAttribute: function (node, prop) {
            node.el.removeAttribute(prop);
        },
        // Setting css style in to node
        //
        //      @method setStyle
        //      @prop {dom.Element} node
        //      @prop {String||Object} prop
        //      @prop {String} value
        setStyle: function (node, prop, value) {
            if (utils.isObject(prop)) {
                Object.keys(prop).forEach(function (key) {
                    node.el.style[key] = prop[key];
                }.bind(this));
            } else {
                node.el.style[prop] = value;
            }
        },
        // Removing css style from node
        //
        //      @method removeAttribute
        //      @prop {dom.Element} node
        //      @prop {String} prop
        removeStyle: function (node, prop) {
            delete node.el.style[prop];

        },
        // Adding class in to node
        //
        //      @method addClass
        //      @param {dom.Element} node
        //      @param {String} className
        addClass: function (node, className) {
            node.el.classList.add(className);
        },
        // Remove class from node
        //
        //      @method removeClass
        //      @param {dom.Element} node
        //      @param {string} className
        removeClass: function (node, className) {
            node.el.classList.remove(className);
        },
        // Setting, Getting value to input element
        //
        //      @method val
        //      @param {dom.Element} node
        //      @param? {String} val
        //      @return {String}
        val: function (node, val) {
            var el = node.el;
            if (val !== undefined) {
                el.value = val;
            } else {
                return el.value;
            }
        },
        // Adding DOM Event in to Element
        //
        //      @method on
        //      @param {dom.Element} element
        //      @param {String} ev
        //      @param {Function} cb
        //      @param {Object} context
        //      @return {Object} { remove() }
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
        // Remove Dom Element from Dom
        //
        //      @method remove
        //      @param {dom.Element}
        remove: function (el) {
            el.el.remove();
        },
        // Element
        Element: Element
    }
    // ## widget/dom.Element
    //     @method Element
    //     @param {Object} node
    function Element(node) {
        var obj = utils.extend({}, node);
        utils.extend(this, obj);

    }

    utils.extend(Element.prototype, {
        // Shortcut to - `dom.append`
        append: function (child) {
            dom.append(this, child)
        },
        // Shortcut to - `dom.replace`
        replace: function (child, data) {
            dom.replace(this, child, data);
        },
        // Shortcut to - `dom.text`
        text: function (text) {
            dom.text(this, text);
        },
        // Shortcut to - `dom.add`
        add: function (fragment, parent, data) {
            dom.add(this, fragment, parent, data);
        },
        detach: function () {
            dom.detach(this);
        },
        attach: function () {
            dom.attach(this);
        },
        // Shortcut to - `dom.setAttribute`
        setAttribute: function (prop, value) {
            dom.setAttribute(this, prop, value);
        },
        // Shortcut to - `dom.removeAttribute`
        removeAttribute: function (prop) {
            dom.removeAttribute(this, prop);
        },
        // Shortcut to - `dom.setStyle`
        setStyle: function (prop, value) {
            dom.setStyle(this, prop, value);
        },
        // Shortcut to - `dom.removeStyle`
        removeStyle: function (prop) {
            dom.removeStyle(this, prop);
        },
        // Shortcut to - `dom.addClass`
        addClass: function (className) {
            dom.addClass(this, className);
        },
        // Shortcut to - `dom.removeClass`
        removeClass: function (className) {
            dom.removeClass(this, className);
        },
        // Shortcut to - `dom.val`
        val: function (val) {
            return dom.val(this, val);
        },
        // Shortcut to - `dom.on`
        on: function (event, cb, context) {
            var args = Array.prototype.slice.call(arguments, 0);
            return dom.on.apply(false, [this].concat(args));
        },
        // Shortcut to - `dom.remove`
        remove: function () {
            dom.remove(this);
        }

    });
    Element.extend = utils.fnExtend;
    return dom;
});