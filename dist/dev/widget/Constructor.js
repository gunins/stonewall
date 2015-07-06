/**
 * Created by guntars on 10/10/2014.
 */
    //## widget/dom Class for dom manipulation
define('widget/dom',[
    './utils'
], function (utils) {
    'use strict';
    function createPlaceholder(tag) {
        var placeholder = document.createElement(tag || 'div');
        placeholder.setAttribute('style', 'display:none;');
        return placeholder;
    }

    var dom = {
        // Method to attach to DOM
        //
        //      @method append
        //      @param {dom.Element} parent
        //      @param {dom.Element} child
        //      @param {Object} data
        _after:          function (parent, child, data) {
            if (child._node !== undefined) {
                child.placeholder = parent.el.querySelector('#' + child._node.id) ||
                                    createPlaceholder(child._node.data.tag || child.el.tagName);
            } else {
                child.placeholder = createPlaceholder(child.el.tagName);
            }

            if (child.run !== undefined) {
                child.el = child.run.call(child, parent.el, true, false, data);
            }

            if (child._node && child._node.data && child._node.data.instance) {
                utils.extend(child, child._node.data.instance);
            }
        },
        // Replacing element in to DOM
        //
        //      @method replace
        //      @param {dom.Element} parent
        //      @param {dom.Element} child
        //      @param {Object} data
        replace:         function (parent, child, data) {
            parent.el.innerHTML = '';
            dom._after.apply(this, arguments);
        },
        // Insert element to the end of parent childs
        //
        //      @method append
        //      @param {dom.Element} parent
        //      @param {dom.Element} child
        append:          function (parent, child) {
            if (parent.el !== undefined && child.el !== undefined) {
                parent.el.appendChild(child.el);
            }

        },
        // Insert element to the beginning of parent childs
        //
        //      @method prepend
        //      @param {dom.Element} parent
        //      @param {dom.Element} child
        prepend:         function (parent, child) {
            dom.insertBefore(parent, child, 0);
        },
        // Insert element to the before of specific, child by index
        //
        //      @method insertBefore
        //      @param {dom.Element} parent
        //      @param {dom.Element} child
        insertBefore:    function (parent, child, index) {
            var parentEl = parent.el;
            var childEl  = child.el;
            if (parentEl !== undefined && childEl !== undefined) {
                if (parentEl.childNodes[index] !== undefined) {
                    parentEl.insertBefore(childEl, parentEl.childNodes[index]);
                } else {
                    parentEl.appendChild(childEl);
                }
            }
        },
        detach:          function (el) {
            if (el.placeholder instanceof HTMLElement === false) {
                el.placeholder = createPlaceholder(el._node.data.tag || el.el.tagName);
            }

            if (el && el.el && el.el.parentNode) {
                el.el.parentNode.replaceChild(el.placeholder, el.el)
            }
        },
        attach:          function (el) {
            if (el && el.el && el.placeholder && el.placeholder.parentNode) {
                el.placeholder.parentNode.replaceChild(el.el, el.placeholder)
            }
        },
        add:             function (el, fragment, parent, data, index) {
            el.placeholder = fragment.querySelector('#' + el._node.id) ||
                             createPlaceholder(el._node.data.tag || el.el.tagName);

            el.el = el.run.call(el, fragment, false, parent, data, index);

            if (el._node && el._node.data && el._node.data.instance) {
                utils.extend(el, el._node.data.instance);
            }

        },
        // Adding text in to node
        //
        //      @method text
        //      @param {dom.Element}
        //      @param {String} text
        text:            function (node, text) {
            if (node && node.el) {
                node.el.innerHTML = text;
            }
        },
        // Setting Attribute in to node
        //
        //      @method setAttribute
        //      @prop {dom.Element} node
        //      @prop {String||Object} prop
        //      @prop {String} value
        setAttribute:    function (node, prop, value) {
            if (node && node.el) {
                if (utils.isObject(prop)) {
                    Object.keys(prop).forEach(function (key) {
                        node.el.setAttribute(key, prop[key]);
                    }.bind(this));
                } else {
                    node.el.setAttribute(prop, value);
                }
            }
        },
        // Getting Attribute in to node
        //
        //      @method getAttribute
        //      @prop {dom.Element} node
        //      @prop {String||Object} prop
        //      @return {String} value
        getAttribute:    function (node, prop) {
            if (node && node.el) {
                return node.el.getAttribute(prop);
            } else {
                return undefined;
            }
        },
        // Removing Attribute from node
        //
        //      @method removeAttribute
        //      @prop {dom.Element} node
        //      @prop {String} prop
        removeAttribute: function (node, prop) {
            if (node && node.el) {
                node.el.removeAttribute(prop);
            }
        },
        // Setting css style in to node
        //
        //      @method setStyle
        //      @prop {dom.Element} node
        //      @prop {String||Object} prop
        //      @prop {String} value
        setStyle:        function (node, prop, value) {
            if (node && node.el) {
                if (utils.isObject(prop)) {
                    Object.keys(prop).forEach(function (key) {
                        node.el.style[key] = prop[key];
                    }.bind(this));
                } else {
                    node.el.style[prop] = value;
                }
            }
        },
        // Getting css style from node
        //
        //      @method getStyle
        //      @prop {dom.Element} node
        //      @prop {String} prop
        //      @return {String} value
        getStyle:        function (node, prop) {
            if (node && node.el) {
                if (node.el !== undefined && node.el.style !== undefined) {
                    return node.el.style[prop];
                } else {
                    return undefined;
                }
            }
        },
        // Removing css style from node
        //
        //      @method removeAttribute
        //      @prop {dom.Element} node
        //      @prop {String} prop
        removeStyle:     function (node, prop) {
            if (node && node.el) {
                node.el.style[prop] = '';
            }
        },
        // Adding class in to node
        //
        //      @method addClass
        //      @param {dom.Element} node
        //      @param {String} className
        addClass:        function (node, className) {
            if (node && node.el) {
                node.el.classList.add(className);
            }
        },
        // checking if className exists in node
        //
        //      @method hasClass
        //      @param {dom.Element} node
        //      @param {String} className
        //      @return boolean
        hasClass:        function (node, className) {
            if (node && node.el) {
                return node.el.classList.contains(className);
            } else {
                return false;
            }
        },
        // Remove class from node
        //
        //      @method removeClass
        //      @param {dom.Element} node
        //      @param {string} className
        removeClass:     function (node, className) {
            if (node && node.el) {
                node.el.classList.remove(className);
            }
        },
        // Setting, Getting value to input element
        //
        //      @method val
        //      @param {dom.Element} node
        //      @param? {String} val
        //      @return {String}
        val:             function (node, val) {
            if (node && node.el) {
                var el = node.el;
                if (val !== undefined) {
                    el.value = val;
                } else {
                    return el.value;
                }
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
        on:              function (element, ev, cb, context) {
            var args   = Array.prototype.slice.call(arguments, 4, arguments.length),
                el     = element.el,
                events = ev.split(' '),
                fn     = function (e) {
                    cb.apply(context || this, [e, element].concat(args));
                };

            events.forEach(function (event) {
                el.addEventListener(event, fn);
            });
            var evt    = {
                remove: function () {
                    events.forEach(function (event) {
                        el.removeEventListener(event, fn);
                    });
                }
            };
            element._events.push(evt);
            return evt
        },
        // Remove Dom Element from Dom
        //
        //      @method remove
        //      @param {dom.Element}
        remove:          function (el) {
            while (el._events.length > 0) {
                el._events[0].remove();
                el._events.shift();
            }
            if (el.el !== undefined) {
                el.el.remove();
            }
        },
        // executes when element attached to Dom
        //
        //      @method onDOMAttached
        //      @param {dom.Element}
        //      @param {function} cb
        //      @param {function} context
        onDOMAttached:   function (el) {
            var handlers = [];
            if (el.el !== undefined) {
                var attached = false,
                    handler;
                var step     = function () {
                    if (attached) {
                        while (handlers.length > 0) {
                            handler = handlers[0];
                            handler();
                            handlers.shift()
                        }
                    } else {
                        window.requestAnimationFrame(step);
                        if (document.body.contains(el.el)) {
                            attached = true;
                        }
                    }
                }.bind(this);
            }
            return {
                then: function (cb, context) {
                    handlers.push(cb.bind(context || this));
                    window.requestAnimationFrame(step);
                }.bind(this)
            }
        },
        // Element
        Element:         Element
    }

    // ## widget/dom.Element
    //     @method Element
    //     @param {Object} node
    function Element(node) {
        var root     = node._node;
        this._events = [];
        this._node   = root;
        if (!this.el) {
            if (root && root.el) {
                this.el = root.el;
            } else if (node.el) {
                this.el = node.el
            }
        }
        if (!this.name) {
            this.name = node.name || root.name;
        }
        if (root && root.bind && !this.bind) {
            this.bind = root.bind;
        }
        if (root && !this.dataset && root.data && root.data.dataset) {
            this.dataset = root.data.dataset;
        }
        if (root && root.children && !this.children) {
            this.children = root.children;
        }
        if (root) {
            this.run         = root.run;
            this.applyAttach = root.applyAttach;
            this.getParent   = root.getParent;
            this.setParent   = root.setParent;
        }

    }

    utils.extend(Element.prototype, {
        clone:           function () {
            var extend     = utils.extend({}, this);
            extend._events = [];
            return extend;
        },
        // Shortcut to - `dom.append`
        _after:          function (child) {
            dom._after(this, child)
        },
        // Shortcut to - `dom.replace`
        replace:         function (child, data) {
            dom.replace(this, child, data);
        },
        // Shortcut to - `dom.prepend`
        prepend:         function (child) {
            dom.prepend(this, child);
        },
        // Shortcut to - `dom.insertBefore`
        insertBefore:    function (child, index) {
            dom.insertBefore(this, child, index);
        },
        // Shortcut to - `dom.append`
        append:          function (child) {
            dom.append(this, child);
        },
        // Shortcut to - `dom.text`
        text:            function (text) {
            dom.text(this, text);
        },
        // Shortcut to - `dom.add`
        add:             function (fragment, parent, data, index) {
            dom.add(this, fragment, parent, data, index);
        },
        detach:          function () {
            dom.detach(this);
        },
        attach:          function () {
            dom.attach(this);
        },
        // Shortcut to - `dom.setAttribute`
        setAttribute:    function (prop, value) {
            dom.setAttribute(this, prop, value);
        },
        // Shortcut to - `dom.getAttribute`
        getAttribute:    function (prop) {
            return dom.getAttribute(this, prop);
        },
        // Shortcut to - `dom.removeAttribute`
        removeAttribute: function (prop) {
            dom.removeAttribute(this, prop);
        },
        // Shortcut to - `dom.setStyle`
        setStyle:        function (prop, value) {
            dom.setStyle(this, prop, value);
        },
        // Shortcut to - `dom.getStyle`
        getStyle:        function (prop) {
            return dom.getStyle(this, prop);
        },
        // Shortcut to - `dom.removeStyle`
        removeStyle:     function (prop) {
            dom.removeStyle(this, prop);
        },
        // Shortcut to - `dom.addClass`
        addClass:        function (className) {
            dom.addClass(this, className);
        },
        // Shortcut to - `dom.hasClass`
        hasClass:        function (className) {
            return dom.hasClass(this, className);
        },
        // Shortcut to - `dom.removeClass`
        removeClass:     function (className) {
            dom.removeClass(this, className);
        },
        // Shortcut to - `dom.val`
        val:             function (val) {
            return dom.val(this, val);
        },
        // Shortcut to - `dom.on`
        on:              function (event, cb, context) {
            var args = Array.prototype.slice.call(arguments, 0);
            return dom.on.apply(false, [this].concat(args));
        },
        // Shortcut to - `dom.onDOMAttached`
        onDOMAttached:   function () {
            return dom.onDOMAttached(this);
        },
        // Shortcut to - `dom.remove`
        remove:          function () {
            dom.remove(this);
        }
    });

    Element.extend = utils.fnExtend;
    return dom;
});
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define('templating/utils',[], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.Templating = root.Templating || {};
        root.Templating.utils = factory();
    }
}(this, function () {
    return {
        merge: function (obj, dest) {
            Object.keys(dest).forEach(function (key) {
                obj[key] = dest[key];
            });
        }
    }

}));
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        // AMD. Register as an anonymous module.
        define('templating/Decoder',[
            'templating/utils'
        ], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('./utils'));
    } else {
        // Browser globals (root is window)
        root.Templating         = root.Templating || {};
        root.Templating.Decoder = factory(root.Templating.utils);
    }
}(this, function (utils) {
    var _decoders = {};

    function applyFragment(template, tag) {
        var elTag;
        if (tag === 'li') {
            elTag = 'ul'

        } else if (tag === 'td' || tag === 'th') {
            elTag = 'tr'

        } else if (tag === 'tr') {
            elTag = 'tbody'

        } else {
            elTag = 'div'
        }
        var el       = document.createElement(elTag),
            fragment = document.createDocumentFragment();
        el.innerHTML = template;
        fragment.appendChild(el.firstChild);
        return fragment.firstChild;
    }

    function setElement(placeholder, keep, parent, data, beforeEl) {
        var params     = this._node,
            el         = params.tmpEl((keep) ? placeholder : false, data, this),
            attributes = params.data.attribs,
            plFragment = applyFragment(params.template, params.data.tag);

        if (!keep) {
            Object.keys(attributes).forEach(function (key) {
                el.setAttribute(key, attributes[key]);
            });
        }

        if (plFragment !== undefined) {
            while (plFragment.childNodes.length > 0) {
                el.appendChild(plFragment.childNodes[0]);
            }
        }

        if (!parent) {
            var parentNode = placeholder.parentNode;
            params.setParent(parentNode);
            if (params.parent !== null || params.parent !== undefined) {
                params.parent.replaceChild(el, placeholder);
            }
        } else if (parent !== undefined && beforeEl !== undefined) {
            params.setParent(parent);
            if (params.parent !== null) {
                params.parent.insertBefore(el, beforeEl);
            }
        } else if (parent) {
            params.setParent(parent);
            if (params.parent !== null) {
                params.parent.appendChild(el);
            }
        }

        this._node.el = el;
        if (params.parse !== undefined) {
            params.parse(el, data);
        }
        return el;

    }

    function setParams(node, children, obj) {
        var tagName = node.tagName,
            self    = this;
        var params  = {
            id:          node.id,
            template:    node.template,
            noAttach:    _decoders[tagName].noAttach || node.data.tplSet.noattach,
            applyAttach: function () {
                delete this._node.noAttach;
            },
            setParent:   function (parent) {
                this._node.parent = parent;
            }.bind(self),
            getParent:   function () {
                return this._node.parent;
            }.bind(self),
            getInstance: function () {
                return this;
            }.bind(self),
            run:         function (fragment, keep, parent, data, beforeEl) {
                if (data) {
                    obj = data;
                }
                if (this._node.noAttach === undefined) {
                    var placeholder = fragment.querySelector('#' + this._node.id) || fragment;
                    if (placeholder) {
                        return setElement.call(self, placeholder, keep, parent, obj, beforeEl);
                    }
                }
            }
        };
        if (children) {
            params.children = children;
        }
        self._node = self._node || {};
        utils.merge(self._node, params);
        self.data  = self._node.data;

        self.getInstance = function () {
            return this._node.getInstance.apply(this, arguments)
        }.bind(this);

        self.run = function () {
            return this._node.run.apply(this, arguments)
        }.bind(this);

        self.applyAttach = function () {
            return this._node.applyAttach.apply(this, arguments)
        }.bind(this);

    }

    function parseElements(root, obj) {
        if (!obj) {
            obj = {};
        }
        var context  = false,
            children = false;
        root.children.forEach(function (node) {
            var name        = node.data.name,
                contextData = (obj[name]) ? obj[name] : obj,
                scope       = {};

            if (node.children &&
                node.children.length > 0) {
                children = parseElements.call(this, node, contextData);
            }
            var tagName = node.tagName;

            if (tagName) {
                var data = _decoders[tagName].decode(node, children);
                if (data) {
                    scope._node = data;
                    setParams.call(scope, node, children, contextData);

                }
                if (name !== undefined) {
                    context       = context || {};
                    context[name] = scope;
                }

            } else if (name) {
                context       = context || {};
                scope._node   = {
                    id:   node.id,
                    data: node.data
                }
                context[name] = scope;
            }
            children = false;
        }.bind(this));
        return context;
    };
    function runEls(children, fragment, data) {
        if (children) {
            Object.keys(children).forEach(function (key) {
                if (children[key]._node.run !== undefined) {
                    children[key]._node.run.call(children[key], fragment, false, false, data);
                }
                if (children[key]._node.el === undefined && children[key]._node.template === undefined) {
                    children[key]._node.el = fragment.querySelector('#' + children[key]._node.id);
                    children[key]._node.el.removeAttribute('id');
                }
            });
        }
    }

    /**
     *
     * @constructor
     * @param root
     */
    function Decoder(root) {
        this._root = (typeof root === 'string') ? JSON.parse(root) : root;
    }

    utils.merge(Decoder, {
        addDecoder: function (decoder) {
            if (_decoders[decoder.tagName] === undefined) {
                _decoders[decoder.tagName] = decoder;
            }
        }
    });

    utils.merge(Decoder.prototype, {
        addDecoder:      Decoder.addDecoder,
        _renderFragment: function (root, data) {
            data         = data || {}
            var children = {},
                fragment = applyFragment(root.template);

            if (root.children && root.children.length > 0) {
                children = parseElements.call(this, root, data);

            }
            runEls(children, fragment, data);

            return {
                fragment:   fragment,
                children:   children,
                templateId: root.templateId
            };
        },

        render: function (data) {
            var fragment = this._renderFragment(this._root, data);

            return fragment;
        }
    });

    return Decoder;

}));
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
    if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define('watch',factory);
    } else {
        // Browser globals
        window.WatchJS = factory();
        window.watch = window.WatchJS.watch;
        window.unwatch = window.WatchJS.unwatch;
        window.callWatchers = window.WatchJS.callWatchers;
    }
}(function () {

    var WatchJS = {
            noMore: false
        },
        lengthsubjects = [];

    var isFunction = function (functionToCheck) {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) == '[object Function]';
    };

    var isInt = function (x) {
        return x % 1 === 0;
    };

    var isArray = function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    };

    var getObjDiff = function (a, b) {
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
        }
    };

    var clone = function (obj) {

        if (null == obj || "object" != typeof obj) {
            return obj;
        }

        var copy = obj.constructor();

        for (var attr in obj) {
            copy[attr] = obj[attr];
        }

        return copy;

    }

    var defineGetAndSet = function (obj, propName, getter, setter) {
        try {

            Object.observe(obj, function (changes) {
                changes.forEach(function (change) {
                    if (change.name === propName) {
                        setter(change.object[change.name]);
                    }
                });
            });

        } catch (e) {

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
                    throw new Error("watchJS error: browser not supported :/")
                }
            }

        }
    };

    var defineProp = function (obj, propName, value) {
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

    var watch = function () {

        if (isFunction(arguments[1])) {
            watchAll.apply(this, arguments);
        } else if (isArray(arguments[1])) {
            watchMany.apply(this, arguments);
        } else {
            watchOne.apply(this, arguments);
        }

    };

    var watchAll = function (obj, watcher, level, addNRemove) {

        if ((typeof obj == "string") || (!(obj instanceof Object) && !isArray(obj))) { //accepts only objects and array (not string)
            return;
        }

        var props = [];

        if (isArray(obj)) {
            for (var prop = 0; prop < obj.length; prop++) { //for each item if obj is an array
                props.push(prop); //put in the props
            }
        } else {
            for (var prop2 in obj) { //for each attribute if obj is an object
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

    var watchMany = function (obj, props, watcher, level, addNRemove) {

        if ((typeof obj == "string") || (!(obj instanceof Object) && !isArray(obj))) { //accepts only objects and array (not string)
            return;
        }

        for (var i = 0; i < props.length; i++) { //watch each property
            var prop = props[i];
            watchOne(obj, prop, watcher, level, addNRemove);
        }

    };

    var watchOne = function (obj, prop, watcher, level, addNRemove) {
        if ((typeof obj == "string") || (!(obj instanceof Object) && !isArray(obj))) { //accepts only objects and array (not string)
            return;
        }

        if (isFunction(obj[prop])) { //dont watch if it is a function
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

    var unwatch = function () {

        if (isFunction(arguments[1])) {
            unwatchAll.apply(this, arguments);
        } else if (isArray(arguments[1])) {
            unwatchMany.apply(this, arguments);
        } else {
            unwatchOne.apply(this, arguments);
        }

    };

    var unwatchAll = function (obj, watcher) {

        if (obj instanceof String || (!(obj instanceof Object) && !isArray(obj))) { //accepts only objects and array (not string)
            return;
        }

        if (isArray(obj)) {
            var props = [];
            for (var prop = 0; prop < obj.length; prop++) { //for each item if obj is an array
                props.push(prop); //put in the props
            }
            unwatchMany(obj, props, watcher); //watch all itens of the props
        } else {
            var unwatchPropsInObject = function (obj2) {
                var props = [];
                for (var prop2 in obj2) { //for each attribute if obj is an object
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

    var unwatchMany = function (obj, props, watcher) {

        for (var prop2 in props) { //watch each attribute of "props" if is an object
            if (props.hasOwnProperty(prop2)) {
                unwatchOne(obj, props[prop2], watcher);
            }
        }
    };

    var defineWatcher = function (obj, prop, watcher, level) {

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
            var getter = function () {
                return val;
            };

            var setter = function (newval) {
                var oldval = val;
                val = newval;

                if (level !== 0 && obj[prop]) {
                    // watch sub properties
                    watchAll(obj[prop], watcher, (level === undefined) ? level : level - 1);
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

    var callWatchers = function (obj, prop, action, newval, oldval) {
        if (prop !== undefined) {
            for (var wr = 0; wr < obj.watchers[prop].length; wr++) {
                obj.watchers[prop][wr].call(obj, prop, action, newval, oldval);
            }
        } else {
            for (var prop in obj) {//call all
                if (obj.hasOwnProperty(prop)) {
                    callWatchers(obj, prop, action, newval, oldval);
                }
            }
        }
    };

    // @todo code related to "watchFunctions" is certainly buggy
    var methodNames = ['pop', 'push', 'reverse', 'shift', 'sort', 'slice', 'unshift', 'splice'];
    var defineArrayMethodWatcher = function (obj, prop, original, methodName) {
        defineProp(obj[prop], methodName, function () {
            var response = original.apply(obj[prop], arguments);
            watchOne(obj, obj[prop]);
            if (methodName !== 'slice') {
                callWatchers(obj, prop, methodName, arguments);
            }
            return response;
        });
    };

    var watchFunctions = function (obj, prop) {

        if ((!obj[prop]) || (obj[prop] instanceof String) || (!isArray(obj[prop]))) {
            return;
        }

        for (var i = methodNames.length, methodName; i--;) {
            methodName = methodNames[i];
            defineArrayMethodWatcher(obj, prop, obj[prop][methodName], methodName);
        }

    };

    var unwatchOne = function (obj, prop, watcher) {

        for (var i = 0; i < obj.watchers[prop].length; i++) {
            var w = obj.watchers[prop][i];
            if (w == watcher) {
                obj.watchers[prop].splice(i, 1);
            }
        }

        removeFromLengthSubjects(obj, prop, watcher);
    };

    var loop = function () {

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
                            watchMany(subj.obj[subj.prop], difference.added, subj.obj.watchers[subj.prop][j], subj.level -
                                                                                                              1, true);
                        }
                    }

                    callWatchers(subj.obj, subj.prop, "differentattr", difference, subj.actual);
                }

                subj.actual = clone(subj.obj[subj.prop]);

            }

        }

    };

    var pushToLengthSubjects = function (obj, prop, watcher, level) {

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

    var removeFromLengthSubjects = function (obj, prop, watcher) {

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

}));
/**
 * Created by guntars on 11/11/14.
 */
define('widget/parsers/applyAttribute',[
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
define('widget/parsers/applyEvents',[],function () {
    'use strict';
    //Aplying Events to elements
    //
    //      @private applyEvents
    //      @param {dom.Element} element
    //      @param {Array} events
    //      @param {Object} data
    function applyEvents(element, events, data) {
        if (events !== undefined && element.el !== undefined) {
            events.forEach(function (event) {
                this._events.push(element.on(event.name, event.action, this, data));
            }.bind(this));
        }
    }

    return applyEvents;
});
/**
 * Created by guntars on 11/11/14.
 */
define('widget/parsers/setBinders',[],function () {

    function setBinders(children, ignoreCP) {
        var bindings = false;
        Object.keys(children).forEach(function (key) {
            bindings   = bindings || {};
            var el     = children[key],
                ignore = (ignoreCP === true && el._node.data.type === 'cp');

            if (el._node && el._node.bind !== undefined && !ignore) {
                bindings[el._node.bind] = bindings[el._node.bind] || []
                bindings[el._node.bind].push(el);
            }
        }.bind(this));
        return bindings;
    }

    return setBinders;
});
/**
 * Created by guntars on 11/11/14.
 */
define('widget/parsers/deepBindings',[
    './setBinders'
],function (setBinders) {
    function deepBindings(elements) {
        Object.keys(elements).forEach(function (key) {
            var element = elements[key];
            if (element.children) {
                elements[key].children = deepBindings(element.children);
                elements[key].bindings = setBinders(element.children);
            }
        });
        return elements;
    }
    return deepBindings;
});
/**
 * Created by guntars on 11/11/14.
 */
define('widget/parsers/setChildren',[
    '../dom',
    '../utils',
    './applyEvents',
    './setBinders',
    './deepBindings'
], function (dom, utils, applyEvents, setBinders, deepBindings) {
    //Applying dom.Element to template elements.
    //
    //      @private applyElement
    //      @param {Object} elements
    function applyElement(elements, params) {
        Object.keys(elements).forEach(function (key) {

            var element = elements[key],
                node    = element._node;
            if (typeof element == 'string') {
            } else if (['cp'].indexOf(node.data.type) !== -1) {
                if (node.children && !element.children) {
                    element.children = node.children;
                }
            } else if (element instanceof  dom.Element !== true &&
                       (['pl', 'bd', 'rt'].indexOf(node.data.type) !== -1 || node.data.type === undefined)) {
                elements[key] = new dom.Element(element);
                if (node.data.type === 'pl' && node.data.tplSet.bind !== undefined) {
                    var bind = node.data.tplSet.bind;
                    Object.keys(bind).forEach(function (attr) {
                        if (params[bind[attr]] !== undefined) {
                            if (attr !== 'class') {
                                elements[key].setAttribute(attr, params[bind[attr]]);
                            } else {
                                elements[key].addClass(params[bind[attr]]);
                            }
                        }
                    }.bind(this));
                }

            }
        }.bind(this));
        return elements;
    }

    function setChildren(elements, parentChildren, data, params) {
        if (Object.keys(data).length === 0) {
            data = this.data;
        }
        parentChildren = (parentChildren) ? applyElement.call(this, parentChildren, params) : {};
        elements       = (elements) ? applyElement.call(this, elements, params) : {};
        Object.keys(elements).forEach(function (key) {
            var children = elements[key].children;
            if (children !== undefined) {
                children               = setChildren.call(this, children, parentChildren.children, data, params);
                elements[key].bindings = setBinders(children);
            }

            var child       = elements[key],
                parentChild = parentChildren[key];

            if (parentChild !== undefined) {
                if (parentChild.children !== undefined) {
                    parentChild.bindings = deepBindings(parentChild.children);
                }

                if (this.nodes[key] !== undefined) {
                    this.nodes[key].call(this, child, parentChild, data);
                } else if (child !== undefined) {
                    if (typeof parentChild == 'string') {
                        dom.text(child, parentChild);
                    }
                    else {
                        dom.replace(child, parentChild, data);
                    }
                    if (parentChild.children !== undefined) {
                        child.children = parentChild.children
                    }
                }

            } else if (this.nodes[key] !== undefined &&
                       child._node.data.tplSet.noattach === 'true' &&
                       child._node.data.dataset.bind === undefined) {
                this.nodes[key].call(this, child, data);
            }

            if (this.elReady[key] !== undefined && (child.el !== undefined || child.instance !== undefined)) {
                this.elReady[key].call(this, child, data);
            }

            var events = this.events[key];
            applyEvents.call(this, child, events);

        }.bind(this));
        return elements
    }

    return setChildren;
});
/**
 * Created by guntars on 11/11/14.
 */
define('widget/parsers/applyBinders',[
    '../dom',
    '../utils',
    'watch',
    './applyEvents',
    './applyAttribute'
], function (dom, utils, WatchJS, applyEvents, applyAttribute) {
    var watch        = WatchJS.watch,
        unwatch      = WatchJS.unwatch,
        callWatchers = WatchJS.callWatchers;
    //TODO: This is necessary for Safari and FF, but possible memory leak, need check later.

    function parseBinder(objKey, obj, parent, binder) {
        var events = this.events[binder._node.name];
        if (binder !== undefined) {
            var data = obj[objKey];
            binder.applyAttach();

            if (this.nodes[objKey]) {
                var childBinder = binder;
                this.nodes[objKey].call(this, childBinder, parent, data);
            } else {
                if (!utils.isArray(data) && !utils.isObject(data)) {
                    var childBinder = binder; //.clone();
                    childBinder.add(parent);
                    childBinder.text(data);
                    if (this.elReady[childBinder._node.name] !== undefined) {
                        this.elReady[childBinder._node.name].call(this, childBinder, data);
                    }
                    if (childBinder._node.data.tplSet.update === 'true') {
                        watch(obj, objKey, function () {
                            childBinder.text(obj[objKey]);
                        }.bind(this));
                    }
                    applyEvents.call(this, childBinder, events, data);
                } else if (utils.isArray(data)) {
                    binder.applyAttach();

                    var updateChildren = function () {
                        var hasParent  = false,
                            bindedData = [],
                            addItem    = function (item, index) {

                                var childBinder = utils.extend({}, binder);//.clone();
                                childBinder._events = [];
                                if (!hasParent) {
                                    childBinder.add(parent);
                                    hasParent = binder.getParent();
                                    bindedData.push({
                                        binder: childBinder,
                                        data:   item
                                    });
                                } else if (index !== undefined && index <= bindedData.length - 1) {
                                    childBinder.add(parent, hasParent, false, bindedData[index].binder.el);
                                    bindedData.splice(index, 0, {
                                        binder: childBinder,
                                        data:   item
                                    });

                                } else {
                                    childBinder.add(parent, hasParent);
                                    bindedData.push({
                                        binder: childBinder,
                                        data:   item
                                    });

                                }

                                applyAttribute.call(this, childBinder, item);
                                applyBinders.call(this, item, childBinder);
                                applyEvents.call(this, childBinder, events, item);

                                if (this.elReady[childBinder._node.name]) {
                                    this.elReady[childBinder._node.name].call(this, childBinder, item);
                                }
                            };
                        data.forEach(addItem.bind(this));
                        var update     = binder._node.data.tplSet.update;
                        if (update === 'true') {
                            var removeMethodNames  = ['pop', 'shift', 'splice'],
                                insertMethodNames  = ['push', 'unshift'],
                                sortingMethodNames = ['reverse', 'sort'];
                            watch(obj, objKey, function (prop, action, newvalue, oldvalue) {
                                var clonedData = bindedData.slice(0);
                                if (oldvalue === undefined && insertMethodNames.indexOf(action) !== -1) {
                                    var filter = clonedData.filter(function (item) {
                                        return item.data === newvalue[0];
                                    });
                                    if (filter.length === 0) {
                                        addItem.call(this, newvalue[0], (action === 'unshift') ? 0 : clonedData.length);
                                    }
                                } else if (removeMethodNames.indexOf(action) !== -1) {
                                    clonedData.forEach(function (binder) {
                                        if (obj[objKey].indexOf(binder.data) === -1) {
                                            binder.binder.remove();
                                            bindedData.splice(bindedData.indexOf(binder), 1);
                                        }
                                    }.bind(this));

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
                            }.bind(this));
                        }
                    }
                    updateChildren.call(this);

                } else if (utils.isObject(data)) {
                    var childBinder = utils.extend({}, binder);
                    if (childBinder._node.data.type === 'cp') {
                        if (childBinder.el === undefined) {
                            dom.add(childBinder, parent, false, data);
                        } else {
                            dom.replace(childBinder, binder, data);
                        }
                    }
                    else {
                        dom.add(childBinder, parent);
                        applyEvents.call(this, childBinder, events, data);
                        applyAttribute.call(this, childBinder, data);
                        applyBinders.call(this, data, childBinder);
                    }

                    if (this.elReady[childBinder._node.name]) {
                        this.elReady[childBinder._node.name].call(this, childBinder, data);
                    }
                }
            }
        }

    };

    function applyBinders(obj, instance) {
        var binders = instance.bindings,
            parent  = instance.el;

        if (obj && binders !== undefined) {
            Object.keys(obj).forEach(function (objKey) {
                if (binders[objKey] !== undefined) {
                    //TODO: Investigate, why not always an Array
                    if (binders[objKey].forEach !== undefined) {
                        binders[objKey].forEach(parseBinder.bind(this, objKey, obj, parent));
                    } else {
                        parseBinder.call(this, objKey, obj, parent, binders[objKey]);
                    }
                }
            }.bind(this));
            if (binders) {
                Object.keys(binders).forEach(function (binderKey) {
                    if (obj[binderKey] === undefined) {
                        var fn = function (prop, action, newvalue, oldvalue) {
                            if (newvalue !== undefined && oldvalue === undefined) {
                                binders[binderKey].forEach(parseBinder.bind(this, binderKey, obj, parent));
                                unwatch(obj, binderKey, fn);
                            }
                        }.bind(this);
                        watch(obj, binderKey, fn, 0);
                    }
                }.bind(this));
            }
        }
    }

    return applyBinders;
});
/**
 * Created by guntars on 11/11/14.
 */
define('widget/parsers/setRoutes',[
    '../dom',
], function (dom) {

    function destroyComponent(cp, force) {
        var children = cp.children;
        if (children !== undefined) {
            Object.keys(children).forEach(function (key) {
                destroyComponent(children[key], true);
            });
        }
        var instance = cp.instance;
        if (instance) {
            instance.destroy();
        } else if (cp.remove !== undefined) {
            cp.remove();
        }

        if (cp.el) {
            cp.el.remove();
            delete cp.el;
        }

        if (force) {
            if (cp._matches) {
                cp._matches.remove();
            }
        }
    }

    function applyToChildren(children, cb) {
        if (children !== undefined) {
            Object.keys(children).forEach(function (name) {
                var cp = children[name];
                cb.call(this, cp, cp.instance);
            }.bind(this));
        }
    }

    function matchRoute(children, match, parent) {
        var names = Object.keys(children);
        names.forEach(function (name) {
            var child = children[name];
            var route = (child._node !== undefined) ? child._node.data.route : undefined;
            if (route !== undefined && child._node.data.type !== 'cp') {
                var matches    = match(route, function (match) {
                    if (child.children !== undefined) {
                        matchRoute.call(this, child.children, match, parent);
                    }
                }.bind(this));
                child._matches = matches;
                matches.to(function () {
                    var args   = [].slice.call(arguments, 0);
                    var params = args.pop();
                    if (args.length > 0) {
                        var id = args.join('_');
                    }

                    if (child.el !== undefined && child.sessId !== id && id !== undefined) {
                        /*  applyToChildren.call(this, child.children, function (deepChild) {
                         destroyComponent(deepChild, true);
                         }.bind(this));*/
                        destroyComponent(child);
                    } else {
                        applyToChildren.call(this, child.children, function (cp, instance) {
                            var data    = cp._node.data,
                                dataSet = data.dataset;

                            dataSet.params = params;

                            if (args.length > 0) {
                                dataSet.link = args;
                            }

                            if (instance && instance.to) {
                                instance.to.apply(instance, args.concat(params));

                            }

                        });
                    }

                    if (child.el === undefined) {
                        child.applyAttach();

                        dom.add(child, parent, false);

                        applyToChildren.call(this, child.children, function (cp, instance) {
                            if (instance && instance.to) {
                                instance.to.apply(instance, args.concat(params));
                            }

                            if (!cp.el && instance && instance._match) {
                                if (cp._routeHandlers !== undefined && cp._routeHandlers.length > 0) {
                                    cp._routeHandlers.forEach(function (handler) {
                                        handler.remove();
                                    });
                                    delete cp._routeHandlers;
                                }
                                matches.setRoutes(function (routes) {
                                    instance._match.call(instance, function (route) {
                                        var match         = routes.match.call(routes, route);
                                        cp._routeHandlers = cp._routeHandlers || [];
                                        cp._routeHandlers.push(match);
                                        return match
                                    });
                                    routes.run();
                                }.bind(this));
                                instance._reRoute = function () {
                                    instance._applyRoutes(matches);
                                };
                            }
                        });
                        if (id) {
                            child.sessId = id;
                        }

                    } else {
                        dom.attach(child);
                    }
                }.bind(this));
                matches.leave(function () {
                    applyToChildren.call(this, child.children, function (cp, instance) {
                        if (instance && instance.leave !== undefined) {
                            instance.leave();
                        }
                    }.bind(this));
                    dom.detach(child);
                }.bind(this));

                matches.query(function (params) {
                    applyToChildren.call(this, child.children, function (cp, instance) {
                        if (instance && instance.query !== undefined) {
                            instance.query(params);
                        }
                    }.bind(this));
                }.bind(this));

            } else if (child.children !== undefined && child._node.data.type !== 'cp') {
                matchRoute.call(this, child.children, match, parent);
            } else if (child.instance !== undefined) {
                var instance = child.instance;
                instance._match.call(instance, match);
            }
        }.bind(this));
    }

    function setRoutes(children) {
        if (!this._match) {
            var parent  = this.el;
            this._match = function (match) {
                matchRoute.call(this, children, match, parent);
                if (this.match) {
                    this.match.call(this, match);
                }
            }.bind(this)
        }
    };

    return setRoutes;
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
define('widget/Constructor',[
    'require',
    './dom',
    './utils',
    './mediator',
    'templating/Decoder',
    './parsers/applyAttribute',
    './parsers/setChildren',
    './parsers/applyBinders',
    './parsers/setBinders',
    './parsers/setRoutes',
    './parsers/applyEvents'
], function (require, dom, utils, Mediator, Decoder, applyAttribute, setChildren, applyBinders, setBinders, setRoutes, applyEvents) {
    'use strict';
    var context = {};

    // Constructor Class
    //
    //      @Constructor
    //      @param {Object} data
    //      @param {Object} children
    //      @param {Object} dataSet
    function Constructor(data, children, dataSet, node) {
        this._routes  = [];
        this._events  = [];
        this.children = {};
        //this._node = node;
        this.eventBus = new Mediator();
        this.context  = context;
        if (data.appContext !== undefined) {
            utils.extend(this.context, data.appContext);
        }
        if (data.name !== undefined) {
            this.name = data.name;
        }
        this.beforeInit.apply(this, arguments);

        if (node && node.getInstance) {
            var instance      = node.getInstance();
            instance.instance = this;
            instance.eventBus = this.eventBus;
        }

        if (this.template) {
            var keys        = (dataSet) ? Object.keys(dataSet) : [],
                contextData = (keys.length > 0) ? dataSet : this.context.data;

            if (!this.data && contextData) {
                this.data = contextData[data.bind] || contextData;
            }

            var decoder   = new Decoder(this.template),
                template  = decoder.render(this.data);
            this.el       = template.fragment;
            this.root     = new dom.Element({
                el:   this.el,
                name: 'root'
            });
            this.children = utils.extend(setChildren.call(this, template.children, children, this.data, data), this.children);
            this.bindings = setBinders.call(this, this.children, true);
            setRoutes.call(this, this.children);

            if (this.data) {
                this.applyBinders(this.data, this);
            }

        }

        else {

            this.el = document.createElement('div');
        }

        this.init.apply(this, arguments);
    }

    utils.extend(Constructor.prototype, {
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
        events:       {},
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
        elReady:      {},
        // Running when Constructor is initialised
        //
        //      @method init
        //      @param {Object} data (comes from template data attributes)
        //      @param {Object} children (comes placeholder content
        //      from template)
        //      @param {Object} datatSet (data passing if component is
        //      in template binders)
        init:         function (data, children, dataSet) {
        },
        // Running before Constructor is initialised
        //
        //      @method beforeInit
        //      @param {Object} data (comes from template data attributes)
        //      @param {Object} children (comes placeholder content
        //      from template)
        //      @param {Object} datatSet (data passing if component is
        //      in template binders)
        beforeInit:   function (data, children, dataSet) {
        },
        // Load external css style for third party modules.
        //
        //      @method loadCss
        //      @param {string} url
        loadCss:      function (url) {
            this.context._cssReady = this.context._cssReady || [];
            if (this.context._cssReady.indexOf(url) === -1) {
                this.context._cssReady.push(url);
                var linkRef = document.createElement("link");
                linkRef.setAttribute("rel", "stylesheet")
                linkRef.setAttribute("type", "text/css")
                linkRef.setAttribute("href", url)
                if (typeof linkRef != "undefined") {
                    document.getElementsByTagName("head")[0].appendChild(linkRef);
                }
            }

        },
        // Applying Binders manually, if use nodes function
        //
        //      @method applyBinders
        applyBinders: applyBinders,
        // Remove from parentNode
        //
        //      @method detach
        detach:       function () {
            if (!this._placeholder) {
                this._placeholder = document.createElement(this.el.tagName);
            }
            if (!this._parent) {
                this._parent = this.el.parentNode;
            }

            if (this.el && this._parent) {
                this._parent.replaceChild(this._placeholder, this.el)
            }

        },
        // Add to parentNode
        //
        //      @method attach
        attach:       function () {
            if (this._placeholder && this._parent) {
                this._parent.replaceChild(this.el, this._placeholder)
            }
        },
        // Executes when Component is destroyed
        //
        //      @method applyBinders
        onDestroy:    function () {

        },
        //Removing widget from Dom
        //
        //      @method destroy
        destroy:      function () {
            this.onDestroy();
            this.eventBus.remove();
            while (this._events.length > 0) {
                this._events[0].remove();
                this._events.shift();
            }
            while (this.root._events.length > 0) {
                this.root._events[0].remove();
                this.root._events.shift();
            }
         /*   if(this.to!==undefined){
                delete this.to;
            }*/
            this.root.remove();
        },
        setRoutes:    function (instance) {
            if (instance !== undefined) {
                this._routes.push(instance);
            }
        },
        _applyRoutes: function (matches) {
            while (this._routes.length > 0) {
                var instance = this._routes[0];
                if (instance && instance._match) {
                    matches.setRoutes(function (routes) {
                        instance._match.call(instance, routes.match.bind(routes));
                        routes.run();
                    }.bind(this));
                }
                this._routes.shift();
            }
            matches.rebind();
        },
        _reRoute:     function () {
            this._routes.splice(0, this._routes.length);
        },
        rebind:       function () {
            this._reRoute();
        },
        // Adding Childrens manually after initialization.
        //  @method setChildren
        //  @param {Element} el
        //  @param {Object} data
        setChildren:  function (el, data) {
            var name = el._node.name;
            if (this.children[name] !== undefined && this.children[name].el !== undefined) {
                dom.detach(this.children[name]); //.detach();
            }
            el.applyAttach();

            if (el._node.data.type !== 'cp') {
                this.children[name] = new dom.Element(el);
            }

            this.children[name].placeholder = this.el.querySelector('#' + el._node.id);
            this.children[name].el          = el.run(this.el, false, false, data);

            if (this.elReady[name] !== undefined && this.children[name].el !== undefined) {
                this.elReady[name].call(this, this.children[name], data);
            }

            var events = this.events[name];
            applyEvents.call(this, this.children[name], events);

            var instance = this.children[name]._node.data.instance;
            this.setRoutes(instance);
            this.rebind();
        },
        // Adding Dynamic components
        // @method addComponent
        // @param {String} name
        // @param {Constructor} Component
        // @param {Element} container
        // @param {Object} data (data attributes)
        // @param {Object} children
        // @param {Object} dataSet (Model for bindings)
        addComponent: function (Component, options) {
            var name      = options.name;
            var container = options.container;

            if (name === undefined) {
                throw ('you have to define data.name for component.')
            } else if (container === undefined) {
                throw ('You have to define container for component.')
            } else if (this.children[name] !== undefined) {
                throw ('Component using name:' + name + '! already defined.')
            }
            var component       = this.setComponent(Component, options);

            component.run(options.container);
            this.children[name] = component;
            this.setRoutes(component.instance);
            this.rebind();
            return component;
        },
        setComponent: function (Component, options) {
            var instance = {
                name:  options.name,
                _node: {
                    data: {
                        tag:  'div',
                        type: 'cp'
                    }
                },
                run:   function (container) {
                    options.appContext = this.context;
                    var cp             = new Component(options, options.children, options.data);
                    instance.instance  = cp;
                    instance.eventBus  = cp.eventBus;
                    instance.children  = instance._node.children = cp.children;
                    if (container instanceof HTMLElement === true) {
                        container.parentNode.replaceChild(cp.el, container);
                    } else if (container.el !== undefined && options.pos !== undefined) {
                        dom.insertBefore(container, cp, options.pos);
                    } else if (container.el !== undefined) {
                        dom.append(container, cp);
                    }
                    return cp.el;
                }.bind(this)
            }
            return instance;
        }
    });

    Constructor.extend = utils.fnExtend;

    return Constructor;
});
