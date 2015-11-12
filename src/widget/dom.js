/**
 * Created by guntars on 10/10/2014.
 */
    //## widget/dom Class for dom manipulation
define([
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
            if (child._node !== undefined && parent && parent.el) {
                child.placeholder = parent.el.querySelector('#' + child._node.id) ||
                                    createPlaceholder(child._node.data.tag || child.el.tagName);
            } else {
                child.placeholder = createPlaceholder(child.el.tagName);
            }

            if (child.run !== undefined) {
                child.el = child.run.call(child, parent.el, true, false, data);
            }

            if (child._node && child._node.data && child._node.data.instance) {
                //utils.extend(child, child._node.data.instance);
            }
        },
        // Replacing element in to DOM
        //
        //      @method replace
        //      @param {dom.Element} parent
        //      @param {dom.Element} child
        //      @param {Object} data
        replace:         function (parent, child, data) {
            if (parent && parent.el) {
                parent.el.innerHTML = '';
            }
            //console.log(parent, child)

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
                //utils.extend(el, el._node.data.instance);
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
        var _node    = node._node;
        this._events = [];
        this._node   = _node;
        if (!this.el) {
            if (node.el) {
                //console.log('root', node.el);
                this.el = node.el
            }
            else if (_node && _node.el !== undefined) {
                //console.log('isnode', _node.el, _node.id);
                //console.log('_node', node);
                this.el = _node.el;
            }
        }else{
            console.log('nonode', this.el, _node.id);

        }
        if (!this.name) {
            this.name = node.name || _node.name;
        }
        if (_node && _node.bind && !this.bind) {
            this.bind = _node.bind;
        }
        if (_node && !this.dataset && _node.data && _node.data.dataset) {
            this.dataset = _node.data.dataset;
        }
        if (node && node.children && !this.children) {
            this.children = node.children;
        }
        if (node.run) {
            this.run = node.run.bind(node);
        }
        if (node.applyAttach) {
            this.applyAttach = node.applyAttach.bind(node);
        }
        if (node.getParent) {
            this.getParent = node.getParent.bind(node);
        }
        if (node.setParent) {
            this.setParent = node.setParent.bind(node);
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