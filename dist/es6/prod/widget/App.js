/**
 * Created by guntars on 02/02/2016.
 */
define('templating/utils/List',[],function () {
    'use strict';
    class List {
        constructor(items) {
            this._map = new Map(items);
            this._indexes = [...this._map.keys()];
            this._onDelete = [];
        };

        keys() {
            return this._indexes;
        };

        values() {
            return this.entries().map((entry)=> {
                return entry[1];
            })
        };

        entries() {
            return this._indexes.map((key)=> {
                return [key, this._map.get(key)]
            })
        };

        get(key) {
            return this._map.get(key);
        };

        forEach(fn) {
            return this.values().forEach((value, index, ...args)=> {
                return fn.apply(null, [value, index, ...args]);
            })
        };

        getIndex(key) {
            return this._indexes.indexOf(key);
        };

        changeIndex(key, index) {
            if (key) {
                let indexes = this._indexes,
                    indexOf = indexes.indexOf(key);

                if (indexOf !== -1 && index !== indexOf) {
                    this._indexes.splice(index, 0, this._indexes.splice(indexOf, 1)[0]);
                }
            }
        };

        getValueByIndex(index) {
            return this._map.get(this._indexes[index]);
        };

        get first() {
            return this.getValueByIndex(0);
        };

        get last() {
            return this.getValueByIndex(this._indexes.length - 1);
        };

        getKeyByIndex(index) {
            return this._indexes[index];
        };

        set(key, value, index) {
            this._map.set(key, value);
            if (index !== undefined) {
                this._indexes.splice(index, 0, key);
            } else {
                this._indexes.push(key);
            }
        };

        has(key) {
            return this._map.has(key);
        };

        clear() {
            this._map.clear();
            this._indexes.splice(0, this._indexes.length);
        };

        onDelete(cb) {
            let chunk = (...args)=>cb(...args);
            this._onDelete.push(chunk);
            return {
                remove(){
                    this._onDelete.splice(this._onDelete.indexOf(chunk, 1));
                }
            }
        };

        delete(key) {
            if (this.has(key)) {
                let item = this._map.get(key);
                this._map.delete(key);
                this._indexes.splice(this._indexes.indexOf(key), 1);
                this._onDelete.forEach(chunk=>chunk(key, this.size, item));
            }
        };

        deleteByIndex(index) {
            this.delete(this._indexes[index]);
        };

        get size() {
            return this._map.size
        };

    }
    return List;
});
/**
 * Created by guntars on 10/10/2014.
 */
//## templating/dom Class for dom manipulation
define('templating/dom',[],function () {
    'use strict';

    function isObject(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    }

    function createPlaceholder(tag) {
        var placeholder = document.createElement(tag || 'div');
        placeholder.setAttribute('style', 'display:none;');
        return placeholder;
    }

    function destroy(instance) {
        let keys = Object.keys(instance);
        if (keys.length > 0) {
            keys.forEach((key)=> {
                if (key !== 'root') {
                    let children = instance[key];
                    if (children.elGroup !== undefined && children.elGroup.size > 0) {
                        children.elGroup.forEach(child=> {
                            if (child !== undefined && child.remove !== undefined) {
                                child.remove(true);
                            }
                        })
                    }
                }
            });
        }
    }

    // ## widget/dom.Element
    //     @method Element
    //     @param {Object} node
    class Element {
        constructor(el, node) {
            this.el = el;
            this._events = [];
            //this._node = node;
            this.name = node.name || node.data.name;
            let data = this.data = node.data;
            if (data) {
                if (data.bind) {
                    this.bind = data.bind;
                }
                /* if (data.dataset) {
                 this.dataset = data.dataset;
                 }*/
            }
        };

        clone(...args) {
            return this.run(...args);
        };

        // Shortcut to - `dom.text`
        text(text) {
            dom.text(this, text);
        };

        detach() {
            dom.detach(this);
        };

        attach() {
            dom.attach(this);
        };

        // Shortcut to - `dom.changePosition`
        changePosition(index) {
            dom.changePosition(this, index);
        }

        // Shortcut to - `dom.setAttribute`
        setAttribute(prop, value) {
            dom.setAttribute(this, prop, value);
        };

        // Shortcut to - `dom.getAttribute`
        getAttribute(prop) {
            return dom.getAttribute(this, prop);
        };

        // Shortcut to - `dom.removeAttribute`
        removeAttribute(prop) {
            dom.removeAttribute(this, prop);
        };

        // Shortcut to - `dom.setStyle`
        setStyle(prop, value) {
            dom.setStyle(this, prop, value);
        };

        // Shortcut to - `dom.getStyle`
        getStyle(prop) {
            return dom.getStyle(this, prop);
        }

        // Shortcut to - `dom.removeStyle`
        removeStyle(prop) {
            dom.removeStyle(this, prop);
        };

        // Shortcut to - `dom.addClass`
        addClass(className) {
            dom.addClass(this, className);
        };

        // Shortcut to - `dom.hasClass`
        hasClass(className) {
            return dom.hasClass(this, className);
        };

        // Shortcut to - `dom.removeClass`
        removeClass(className) {
            dom.removeClass(this, className);
        };

        // Shortcut to - `dom.val`
        val(val) {
            return dom.val(this, val);
        };

        // Shortcut to - `dom.on`
        on(event, cb, context) {
            var args = Array.prototype.slice.call(arguments, 0);
            return dom.on.apply(false, [this].concat(args));
        };

        // Shortcut to - `dom.onDOMAttached`
        onDOMAttached() {
            return dom.onDOMAttached(this);
        };

        // Shortcut to - `dom.remove`
        remove(force) {
            dom.remove(this, force);
        };
    }

    var dom = {
        //Removing element from DOM
        //
        //      @method detach
        //      @param {dom.Element}

        detach (node) {
            if (node.placeholder instanceof HTMLElement === false) {
                node.placeholder = createPlaceholder(node.data.tag || node.el.tagName);
            }
            if (node && node.el && node.el.parentNode) {
                node.el.parentNode.replaceChild(node.placeholder, node.el)
            }
        },
        //Adding element back to DOM
        //
        //      @method attach
        //      @param {dom.Element}
        attach (node) {
            if (node && node.el && node.placeholder && node.placeholder.parentNode) {
                node.placeholder.parentNode.replaceChild(node.el, node.placeholder)
            }
        },
        // Insert element to the end of parent childs
        //
        //      @method append
        //      @param {dom.Element} parent
        //      @param {dom.Element} child
        append(parent, child) {
            if (parent.el !== undefined && child.el !== undefined) {
                parent.el.appendChild(child.el);
            }

        },
        // Insert element to the beginning of parent childs
        //
        //      @method prepend
        //      @param {dom.Element} parent
        //      @param {dom.Element} child
        prepend(parent, child) {
            dom.insertBefore(parent, child, 0);
        },
        // Insert element to the before of specific, child by index
        //
        //      @method insertBefore
        //      @param {dom.Element} parent
        //      @param {dom.Element} child
        insertBefore(parent, child, index) {
            let parentEl = parent.el,
                childEl = child.el;
            if (parentEl !== undefined && childEl !== undefined) {
                if (parentEl.childNodes[index] !== undefined) {
                    parentEl.insertBefore(childEl, parentEl.childNodes[index]);
                } else {
                    parentEl.appendChild(childEl);
                }
            }
        },

        // Changing position in nodeList
        //
        //      @method changePosition
        //      @param {dom.Element}
        //      @param {Int} index
        changePosition(el, index){

            let HTMLElement = el.el;
            if (HTMLElement && HTMLElement.parentNode) {

                let parentNode = HTMLElement.parentNode,
                    elGroup = el.elGroup,
                    size = elGroup.size,
                    target = elGroup.getKeyByIndex(index) || elGroup.getLast();


                if (target !== HTMLElement) {
                    if (size - 1 >= index) {
                        parentNode.insertBefore(HTMLElement, target);
                    } else if (target.nextSibling !== null) {
                        parentNode.insertBefore(HTMLElement, target.nextSibling);
                    } else {
                        parentNode.appendChild(HTMLElement);
                    }

                    el.elGroup.changeIndex(HTMLElement, index);
                }
            }
        },
        // Adding text in to node
        //
        //      @method text
        //      @param {dom.Element}
        //      @param {String} text
        text (node, text) {
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
        setAttribute (node, prop, value) {
            if (node && node.el) {
                if (isObject(prop)) {
                    Object.keys(prop).forEach((key)=> {
                        node.el.setAttribute(key, prop[key]);
                    });
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
        getAttribute (node, prop) {
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
        removeAttribute (node, prop) {
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
        setStyle(node, prop, value) {
            if (node && node.el) {
                if (isObject(prop)) {
                    Object.keys(prop).forEach((key)=> {
                        node.el.style[key] = prop[key];
                    });
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
        getStyle(node, prop) {
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
        removeStyle(node, prop) {
            if (node && node.el) {
                node.el.style[prop] = '';
            }
        },
        // Adding class in to node
        //
        //      @method addClass
        //      @param {dom.Element} node
        //      @param {String} className
        addClass(node, className) {
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
        hasClass(node, className) {
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
        removeClass(node, className) {
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
        val(node, val) {
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
        on(element, ev, cb, context, ...args) {
            var el = element.el,
                events = ev.split(' '),
                fn = (e) => {
                    cb.apply(context || this, [e, element].concat(args));
                };

            events.forEach((event)=> {
                el.addEventListener(event, fn);
            });
            var evt = {
                remove: () => {
                    events.forEach(event => el.removeEventListener(event, fn));
                    let evts = element._events;
                    evts.splice(evts.indexOf(evt), 1);
                }
            };
            element._events.push(evt);
            return evt
        },
        // Remove Dom Element from Dom
        //
        //      @method remove
        //      @param {dom.Element}
        remove (el) {
            while (el._events.length > 0) {
                el._events.shift().remove();
            }
            if (el.children) {
                destroy(el.children);
            }

            if (el.elGroup !== undefined) {
                el.elGroup.delete(el.el);
            }

            if (el.el !== undefined) {
                if (el.el.remove) {
                    el.el.remove();
                } else if (el.el.parentNode) {
                    el.el.parentNode.removeChild(el.el);
                }
                delete el.el;
            }
        },
        // executes when element attached to Dom
        //
        //      @method onDOMAttached
        //      @param {dom.Element}
        //      @param {function} cb
        //      @param {function} context
        onDOMAttached(el) {
            let handlers = [],
                attached = false,
                step;

            if (el.el !== undefined) {
                step = () => {
                    if (attached) {
                        while (handlers.length > 0) {
                            handlers.shift()();
                        }
                    } else {
                        window.requestAnimationFrame(step);
                        if (document.body.contains(el.el)) {
                            attached = true;
                        }
                    }
                };
            }
            return {
                then: (cb, context) => {
                    handlers.push(cb.bind(context || this));
                    window.requestAnimationFrame(step);
                }
            }
        },
        // Element
        Element: Element
    };


    return dom;
});
/**
 * Created by guntars on 22/01/2016.
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define('templating/DomFragment',factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    }
}(this, function () {
    'use strict';
    class DomFragment {
        constructor(_node, placeholder, childNodes, elGroup, index, obj) {
            Object.assign(this, {
                _node,
                placeholder,
                childNodes,
                elGroup,
                index,
                obj
            });
            return this.render();
        };

        applyAttributes(el) {
            let attributes = this._node.data.attribs;
            Object.keys(attributes).forEach(function (key) {
                el.setAttribute(key, attributes[key]);
            });
        };

        applyFragment(el) {
            let node = this._node;
            let plFragment = node.template();
            if (plFragment !== undefined) {
                while (plFragment.childNodes.length > 0) {
                    el.appendChild(plFragment.childNodes[0]);
                }
            }
        };

        appendToBody(el) {
            let elGroup = this.elGroup,
                placeholder = this.placeholder,
                size = elGroup.size;

            if (size > 0) {
                let index = (this.index === undefined || this.index > size - 1) ? size - 1 : this.index - 1,
                    target = elGroup.keys()[index !== -1 ? index : 0],
                    parentNode = target.parentNode;

                if (index === -1) {
                    parentNode.insertBefore(el, target);
                }
                else if (target.nextSibling !== null) {
                    parentNode.insertBefore(el, target.nextSibling);
                } else {
                    parentNode.appendChild(el);
                }

            } else {
                let parentNode = placeholder.parentNode;
                if (parentNode) {
                    parentNode.replaceChild(el, placeholder);
                }
            }
        };


        render() {
            let placeholder = this.placeholder,
                node = this._node,
                keep = (!placeholder.id && this.elGroup.size === 0),
                instance = node.tmpEl((keep) ? placeholder : false, this.obj, this.childNodes, node),
                el = instance.el;

            if (!keep && !node.replace) {
                this.applyAttributes(el);
            } else if (!node.replace) {
                el.innerHTML = '';
            }

            if (!node.replace) {
                this.applyFragment(el);
            }

            this.appendToBody(el);

            return instance;

        }
    }
    return DomFragment;
}));
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        // AMD. Register as an anonymous module.
        define('templating/Decoder',['./utils/List', './dom', './DomFragment'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('./utils/List'), require('./dom'), require('./DomFragment'));
    }
}(this, function (List, dom, DomFragment) {
    'use strict';
    var _decoders = {};

    function isObject(obj) {
        return obj === Object(obj);
    }

    function isArray(obj) {
        return (Array.isArray) ? Array.isArray(obj) : toString.call(obj) === '[object Array]';
    }


    /**
     *
     * @constructor
     * @param root
     */
    class Decoder {
        static   addDecoder(decoder) {
            if (_decoders[decoder.tagName] === undefined) {
                _decoders[decoder.tagName] = decoder;
            }
        }

        constructor(root) {
            this._root = (typeof root === 'string') ? JSON.parse(root) : root;
            if (root.children && root.children.length > 0) {
                this.children = this._parseElements(root.children);
            }
        }

        renderFragment(template) {
            var el = document.createElement('template');
            el.innerHTML = template;
            return (el.content !== undefined) ? el.content.firstChild : el.firstChild;
        };

        _parseElements(nodeList) {
            var context = {};
            nodeList.forEach((node) => {
                let name = node.data.name;
                var tagName = node.tagName;
                if (tagName) {
                    let decodedData = _decoders[tagName].decode(node);
                    if (decodedData) {
                        let nodeParams = {
                            name:     decodedData.name,
                            data:     decodedData.data,
                            tmpEl:    decodedData.tmpEl,
                            parse:    decodedData.parse,
                            replace:  decodedData.replace,
                            id:       node.id,
                            template: ()=> {
                                return this.renderFragment(node.template, node.data.tag)
                            },
                            noAttach: _decoders[tagName].noAttach || node.data.tplSet.noattach
                        };
                        if (node.children &&
                            node.children.length > 0) {
                            nodeParams.children = this._parseElements(node.children);
                        }
                        context[name] = nodeParams;
                    }
                } else if (name) {
                    context[name] = {
                        id:   node.id,
                        data: node.data,
                              name
                    };
                }
            });
            return context;
        };

        renderTemplate(childNodes = {}, obj = {}, fragment) {
            let resp = {},
                _runAll = [];
            Object.keys(childNodes).forEach((name) => {
                let child = childNodes[name],
                    children = child.children,
                    elGroup = new List(),
                    placeholder = document.createElement(child.data.tplSet.tag || 'div');
                placeholder.setAttribute('style', 'display:none;');
                placeholder.id = child.id;
                elGroup.onDelete((key, size)=> {
                    if (size === 0 && key.parentNode) {
                        key.parentNode.replaceChild(placeholder, key);
                        fragment = ()=>placeholder;
                    }
                })
                if (child.template) {
                    let run = (force, index)=> {
                        let template = fragment();
                        if (force instanceof HTMLElement === true) {
                            template = force;
                        }

                        let childNodes,
                            data = (template !== force) && (isObject(force) || isArray(force)) ? force : obj;
                        if (!child.noAttach || force) {
                            let placeholder = template.querySelector('#' + child.id) || template;

                            if (children) {
                                childNodes = this.renderTemplate(children, data, ()=> {
                                    return template;
                                });
                            }
                            let element = new DomFragment(child, placeholder, childNodes, elGroup, index, data);

                            template = element.el;


                            if (childNodes && childNodes.runAll && child.parse) {
                                childNodes.runAll();
                            }

                            if (childNodes && !element.children) {
                                element.children = childNodes;
                            }
                            element.elGroup = elGroup;
                            element.run = run;
                            elGroup.set(element.el, element, index);
                            return element;
                        }

                    }
                    _runAll.push(run);
                    resp[name] = {
                        data: child.data,
                              run,
                              elGroup
                    };

                } else {
                    let element = new dom.Element(fragment().querySelector('#' + child.id), child);
                    element.removeAttribute('id');
                    element.elGroup = elGroup;
                    elGroup.set(element.el, element);
                    resp[name] = element;
                }
            });
            let setProp = (obj, name, fn) => {
                Object.defineProperty(obj, name, {
                    enumerable: false,
                    value:      fn
                });
            };

            let runAll = (el)=> {
                _runAll.forEach(run=> run(el));
                return resp;
            };

            setProp(resp, 'runAll', runAll);

            return resp;
        };

        render(obj) {
            var fragment = this.renderFragment(this._root.template);
            return {
                fragment:   fragment,
                children:   this.renderTemplate(this.children, obj, ()=> fragment).runAll(),
                templateId: this._root.templateId
            };
        };
    }


    return Decoder;

}));
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        // AMD. Register as an anonymous module.
        define('coders/component/cpDecoder',[
            'templating/Decoder'
        ], factory)
        ;
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('./Decoder'));
    }
}(this, function (Decoder) {
    'use strict';
    var componentDecoder = {
        tagName: 'cp',
        decode:  function (node) {
            var data = node.data;
            var response = {
                name:    data.name,
                replace: true,
                tmpEl:   function (placeholder, obj, children, node) {
                    var instance = new data.src(data.dataset, children, obj, node);
                    return instance;
                },
                data:    data || {}
            };
            if (data.dataset.bind !== undefined) {
                response.bind = data.dataset.bind;
            }
            return response;
        }
    };

    if (Decoder) {
        Decoder.addDecoder(componentDecoder);
    }

    return componentDecoder;

}));
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        // AMD. Register as an anonymous module.
        define('coders/placeholders/plDecoder',[
            'templating/Decoder',
            'templating/dom'
        ], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('./Decoder'), require('./dom'));
    }
}(this, function (Decoder, dom) {
    'use strict';
    var componentDecoder = {
        tagName: 'pl',
        decode:  function (node) {

            var data = node.data;
            return {
                name:  data.name,
                tmpEl: function (el, obj, children, node) {
                    return new dom.Element(el || document.createElement(data.tag), node);
                },
                parse: true,
                data:  data
            };
        }
    };

    if (Decoder) {
        Decoder.addDecoder(componentDecoder);
    }

    return componentDecoder;

}));
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        // AMD. Register as an anonymous module.
        define('coders/databind/bdDecoder',[
            'templating/Decoder',
            'templating/dom'
        ], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('./Decoder'), require('./dom'));
    }
}(this, function (Decoder, dom) {
    'use strict';

    var bindingsDecoder = {
        tagName:  'bd',
        noAttach: true,
        decode:   function (node) {
            var data = this.data = node.data;
            var response = {
                name:  data.name,
                tmpEl: function (el, obj, children, node) {
                    return new dom.Element(el || document.createElement(data.tag), node);
                },
                data:  data
            };

            return response;
        }
    };

    if (Decoder) {
        Decoder.addDecoder(bindingsDecoder);
    }

    return bindingsDecoder;

}));
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        // AMD. Register as an anonymous module.
        define('coders/router/routerDecoder',[
            'templating/Decoder',
            'templating/dom'
        ], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('./Decoder'), require('./dom'));
    }
}(this, function (Decoder, dom) {
    'use strict';
    var componentDecoder = {
        tagName:  'rt',
        noAttach: true,
        decode:   function (node) {
            var data = node.data;
            var response = {
                name:  data.name,
                tmpEl: function (el, obj, children, node) {
                    return new dom.Element(el || document.createElement(data.tag), node);
                },
                parse: true,
                data:  data || {},
            };
            return response;
        }
    };

    if (Decoder) {
        Decoder.addDecoder(componentDecoder);
    }

    return componentDecoder;

}));
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        // AMD. Register as an anonymous module.
        define('coders/style/styleDecoder',[
            'templating/Decoder'
        ], factory)
        ;
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('./Decoder'));
    }
}(this, function (Decoder) {
    'use strict';
    var styleDecoder = {
        tagName: 'style',
        decode:  function (node) {
            if (node.data.styleAttached === undefined) {
                node.data.styleAttached = true;
                var style = document.createElement('style');
                style.innerHTML = node.data.style;
                document.head.appendChild(style);
            }

        }
    };

    if (Decoder) {
        Decoder.addDecoder(styleDecoder);
    }

    return styleDecoder;

}));
;/*jslint bitwise: true, nomen: true, plusplus: true, white: true */

/*!
 * Mediator Library v0.9.9
 *
 */

(function (global, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD
        define('widget/Mediator',[],function () {
            return factory();
        });
    } else if (typeof exports !== 'undefined') {
        // Node/CommonJS
        exports.Mediator = factory();
    } else {
        // Browser global
        global.Mediator = factory();
    }
}(this, function () {
    'use strict';

    // Subscribers are instances of Mediator Channel registrations. We generate
    // an object instance so that it can be updated later on without having to
    // unregister and re-register. Subscribers are constructed with a function
    // to be called, options object, and context.

    class Subscriber {
        constructor(fn, options, context = {}, channel = null) {
            this.fn = fn;
            this.channel = channel;
            this.context = context;
            this.options = options;
        };

        // Mediator.update on a subscriber instance can update its function,context,
        // or options object. It takes in an object and looks for fn, context, or
        // options keys.
        update(options = {}) {
            Object.assign(this, options);
            if (this.channel) {
                this.setPriority(this.priority);
            }
        };

        set options(options) {
            this.update(options);
        };

        set context(context) {
            this.setHook(context);
            this._context = context;
        };

        get context() {
            return this._context;
        };

        setHook(context) {
            let channel = this.channel;
            if (channel) {
                channel.hook(this, context);
            }
        }

        _reduceCalls() {
            // Check if the subscriber has options and if this include the calls options
            if (this.calls !== undefined) {
                // Decrease the number of calls left by one
                this.calls--;
                // Once the number of calls left reaches zero or less we need to remove the subscriber
                if (this.calls < 1) {
                    this.remove();
                }
            }
        };

        //return event remove method
        remove() {
            let channel = this.channel;
            if (channel) {
                channel.removeSubscriber(this);
            }
        };

        //Dynamic setPriority method
        setPriority(priority) {
            let channel = this.channel;
            if (channel) {
                channel.setPriority(this, priority);
            }
        };

        run(data) {
            if (!this.channel.stopped
                && !(typeof this.predicate === "function"
                && !this.predicate.apply(this.context, data))) {
                // Check if the callback should be called
                this._reduceCalls();
                //Execute function.
                this.fn.apply(this.context, data)
            }
        };

    }

    class Channel {
        constructor(namespace, parent, context, hook) {
            this.namespace = namespace || "";
            this._subscribers = [];
            this._channels = new Map();
            this._parent = parent;
            this.stopped = false;
            this.context = context;
            this.hook = hook;
        };


        // A Mediator channel holds a list of sub-channels and subscribers to be fired
        // when Mediator.publish is called on the Mediator instance. It also contains
        // some methods to manipulate its lists of data; only setPriority and
        // StopPropagation are meant to be used. The other methods should be accessed
        // through the Mediator instance.

        addSubscriber(fn, options, context = this.context) {
            return new Subscriber(fn, options, context, this);
        };


        // The channel instance is passed as an argument to the mediator subscriber,
        // and further subscriber propagation can be called with
        // channel.StopPropagation().
        stopPropagation() {
            this.stopped = true;
        };

        // Channel.setPriority is useful in updating the order in which Subscribers
        // are called, and takes an identifier (subscriber id or named function) and
        // an array index. It will not search recursively through subchannels.

        setPriority(subscriber, priority) {
            let subscribers = this._subscribers,
                index = subscribers.indexOf(subscriber);

            if (index !== -1) {
                subscribers.splice(subscribers.indexOf(subscriber), 1);
            }

            if (priority !== undefined && priority < this._subscribers.length) {
                subscribers.splice(priority, 0, subscriber);
            } else {
                subscribers.push(subscriber);
            }
        };

        hasChannel(channel) {
            return this._channels.has(channel);
        };

        getChannel(channel) {
            return this._channels.get(channel);
        };

        setChannel(namespace, readOnly) {
            if (!this.hasChannel(namespace) && !readOnly) {
                let channel = new Channel((this.namespace ? this.namespace + ':' : '') + namespace, this, this.context, this.hook);
                this._channels.set(namespace, channel);
                return channel;
            } else {
                return this.getChannel(namespace)
            }
        };

        returnChannel(channels, readOnly) {
            if (channels && channels.length > 0) {
                let channel = channels.shift(),
                    returnChannel = this.setChannel(channel, readOnly);
                if (returnChannel && channels.length > 0) {
                    return returnChannel.returnChannel(channels, readOnly);
                } else {
                    return returnChannel;
                }
            }
        };


        removeSubscriber(subscriber) {
            let subscribers = this._subscribers,
                index = subscribers.indexOf(subscriber);
            // If we don't pass in an value, we're clearing all
            if (!subscriber) {
                subscribers.splice(0, subscribers.length);
            } else if (index !== -1) {
                subscribers.splice(index, 1);
            }

            if (this._subscribers.length === 0 && this._parent) {
                this._parent.removeChannel(this);
            }
        };

        removeChannel(channel) {
            if (channel === this.getChannel(channel.namespace)) {
                this._channels.delete(channel.namespace);
            }
        };

        clear() {
            this._channels.forEach(channel=>channel.clear());
            this.removeSubscriber();
        };

        // This will publish arbitrary arguments to a subscriber and then to parent
        // channels.

        publish(data) {
            //slice method are cloning array, means default array can remove handlers
            this._subscribers.slice().forEach(subscriber=>subscriber.run(data));

            if (this._parent) {
                this._parent.publish(data);
            }

            this.stopped = false;
        };
    }

    class Mediator {
        constructor(context = {}, hook = ()=> {
        }) {
            if (!(this instanceof Mediator)) {
                return new Mediator(context, hook);
            }
            this.channel = new Channel('', false, context, hook);
        }

        // A Mediator instance is the interface through which events are registered
        // and removed from publish channels.


        // Returns a channel instance based on namespace, for example
        // application:chat:message:received. If readOnly is true we
        // will refrain from creating non existing channels.

        getChannel(namespace, readOnly) {
            let namespaceHierarchy = namespace.split(':');
            if (namespaceHierarchy.length > 0) {
                return this.channel.returnChannel(namespaceHierarchy, readOnly);
            }
        };

        // Pass in a channel namespace, function to be called, options, and context
        // to call the function in to Subscribe. It will create a channel if one
        // does not exist. Options can include a predicate to determine if it
        // should be called (based on the data published to it) and a priority
        // index.

        subscribe(channelName, fn, options = {}, context) {
            if (channelName && channelName !== '') {
                let channel = this.getChannel(channelName, false);
                return channel.addSubscriber(fn, options, context);
            } else {
                throw Error('Namespace should be provided!');
            }
        };

        // Pass in a channel namespace, function to be called, options, and context
        // to call the function in to Subscribe. It will create a channel if one
        // does not exist. Options can include a predicate to determine if it
        // should be called (based on the data published to it) and a priority
        // index.

        once(channelName, fn, options = {}, context) {
            options.calls = 1;
            return this.subscribe(channelName, fn, options, context);
        };

        // Publishes arbitrary data to a given channel namespace. Channels are
        // called recursively downwards; a post to application:chat will post to
        // application:chat:receive and application:chat:derp:test:beta:bananas.
        // Called using Mediator.publish("application:chat", [ args ]);

        publish(channelName, ...args) {
            if (channelName && channelName !== '') {
                let channel = this.getChannel(channelName, true);
                if (channel && channel.namespace === channelName) {
                    args.push(channel)
                    channel.publish(args);
                }
            }
        };

        clear() {
            this.channel.clear();
        };
    }

    // Alias some common names for easy interop
    Mediator.prototype.on = Mediator.prototype.subscribe;
    Mediator.prototype.trigger = Mediator.prototype.publish;

    // Finally, expose it all.

    Mediator.version = "0.9.9";

    return Mediator;
}));

(function (root, factory) {

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define('router/MatchBinding',factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.UrlManager              = root.UrlManager || {};
        root.UrlManager.MatchBinding = factory();
    }
}(this, function () {
    function MatchBinding(pattern, location) {
        if (location === '') {
            this.pattern = location = pattern.replace(/^\(\/\)/g, '').replace(/^\/|$/g, '');
        } else {
            this.pattern = pattern;
            location     = (location + pattern);
        }
        this.location = location.replace(/\((.*?)\)/g, '$1').replace(/^\/|$/g, '');

        var route = this.pattern.replace(MatchBinding.ESCAPE_PARAM, '\\$&')
            .replace(MatchBinding.OPTIONAL_PARAM, '(?:$1)?')
            .replace(MatchBinding.NAMED_PARAM, function (match, optional) {
                         return optional ? match : '([^\/]+)';
                     }).replace(MatchBinding.SPLAT_PARAM, '(.*?)');

        this.patternRegExp = new RegExp('^' + route);
        this.routeHandler  = [];
        this.leaveHandler  = [];
        this.queryHandler  = [];
        this.routes        = [];
    }

    MatchBinding.prototype.onBind    = function () {
    };
    MatchBinding.prototype.setOnBind = function (onBinding) {
        this.onBind = onBinding
    };
    MatchBinding.prototype.rebind    = function () {
        if (this.onBind !== undefined) {
            this.onBind();
        }
    };

    MatchBinding.prototype.setRoutes = function (routes) {
        this.routes.push(routes);
        return this;
    };

    MatchBinding.prototype.getRoutes = function () {
        return this.routes;
    };

    MatchBinding.prototype.to              = function (routeHandler) {
        this.routeHandler.push(routeHandler);
        return this;
    };
    MatchBinding.prototype.leave           = function (leaveHandler) {
        this.leaveHandler.push(leaveHandler);
        return this;
    };
    MatchBinding.prototype.query           = function (queryHandler) {
        this.queryHandler.push(queryHandler);
        return this;
    };
    MatchBinding.prototype.remove          = function () {
        this.routes.splice(0, this.routes.length);
        this.routeHandler.splice(0, this.routeHandler.length);
        this.leaveHandler.splice(0, this.leaveHandler.length);
        this.queryHandler.splice(0, this.queryHandler.length);
        return this;
    };
    MatchBinding.prototype.test            = function (location) {
        return this.patternRegExp.test(location);
    };
    MatchBinding.prototype.getFragment     = function (location) {
        var subLocation = this.applyParams(location);
        return location.replace(subLocation, '');
    };
    MatchBinding.prototype.applyParams     = function (location) {
        var matches  = this.pattern.replace(/\((.*?)\)/g, '$1').split('/');
        var matches2 = location.split('/');
        return matches2.splice(0, matches.length).join('/');
    };
    MatchBinding.prototype.extractParams   = function (fragment) {
        var params = this.patternRegExp.exec(fragment).slice(1);
        return params.map(function (param) {
            return param ? decodeURIComponent(param) : null;
        });
    };
    MatchBinding.prototype.setSubBinder    = function (subBinder) {
        this.subBinder = subBinder;
        return subBinder;
    };
    MatchBinding.prototype.getSubBinder    = function () {
        return this.subBinder;
    };
    MatchBinding.prototype.getHandler      = function () {
        return this.routeHandler;
    };
    MatchBinding.prototype.getLeaveHandler = function () {
        return this.leaveHandler;
    };
    MatchBinding.prototype.getQueryHandler = function () {
        return this.queryHandler;
    };

    MatchBinding.OPTIONAL_PARAM = /\((.*?)\)/g;
    MatchBinding.NAMED_PARAM    = /(\(\?)?:\w+/g;
    MatchBinding.SPLAT_PARAM    = /\*\w+/g;
    MatchBinding.ESCAPE_PARAM   = /[\-{}\[\]+?.,\\\^$|#\s]/g;

    return MatchBinding;
}));
(function (root, factory) {

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define('router/MatchBinder',[
            './MatchBinding'
        ], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('./MatchBinding'));
    } else {
        // Browser globals (root is window)
        root.UrlManager = root.UrlManager || {};
        root.UrlManager.MatchBinder = factory(root.UrlManager.MatchBinding);
    }
}(this, function (MatchBinding) {
    function MatchBinder(location, params, command, root) {
        this.bindings = [];
        this.location = root || location || '';
        this.command = command;
        this.params = params;

    }

    MatchBinder.prototype.match = function (pattern, mapHandler) {
        var binding = this.getMatchBinding(pattern, this.location);
        this.bindings.push(binding);
            var subBinder = this.getSubBinder(this.location + pattern);
            binding.setSubBinder(subBinder);
        if (mapHandler) {
            mapHandler(subBinder.match.bind(subBinder));
        }
        return binding;
    };
    MatchBinder.prototype.getSubBinder = function (pattern) {
        return new MatchBinder(pattern);
    };
    MatchBinder.prototype.getMatchBinding = function (pattern, root) {
        return new MatchBinding(pattern, root);
    };
    MatchBinder.prototype.filter = function (location) {
        return this.bindings.filter(function (binding) {
            return binding.test(location);
        });
    };
    MatchBinder.prototype.run = function () {
        this.command(this);
    };
    return MatchBinder;
}));

/*globals define*/
(function (root, factory) {

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define('router/Router',[
            './MatchBinder'
        ], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('./MatchBinder'));
    } else {
        // Browser globals (root is window)
        root.UrlManager = root.UrlManager || {};
        root.UrlManager.Router = factory(root.UrlManager.MatchBinder);
    }
}(this, function (MatchBinder) {
    'use strict';

    // attach the .equals method to Array's prototype to call it on any array
    Array.prototype.equals = function (array) {
        // if the other array is a falsy value, return
        if (!array)
            return false;
        // compare lengths - can save a lot of time
        if (this.length != array.length)
            return false;

        for (var i = 0, l = this.length; i < l; i++) {
            // Check if we have nested arrays
            if (this[i] instanceof Array && array[i] instanceof Array) {
                // recurse into the nested arrays
                if (!this[i].equals(array[i]))
                    return false;
            }
            else if (this[i] != array[i]) {
                // Warning - two different object instances will never be equal: {x:20} != {x:20}
                return false;
            }
        }
        return true;
    };

    function parseParams(value) {
        try {
            return decodeURIComponent(value.replace(/\+/g, ' '));
        }
        catch (err) {
            // Failover to whatever was passed if we get junk data
            return value;
        }
    }

    function iterateQueryString(queryString, callback) {
        var keyValues = queryString.split('&');
        keyValues.forEach(function (keyValue) {
            var arr = keyValue.split('=');
            callback(arr.shift(), arr.join('='));
        });
    }

    function getLocation(fragment, isQuery, params, location) {
        var current = params.root.substring(0, params.root.length - location.length), newQuery;
        fragment = fragment || '';
        if (isQuery === true) {
            newQuery = this.serialize(params.query);
        }
        else if (isQuery === false) {
            newQuery = '';
        }
        else {
            newQuery = this.serialize(isQuery);
        }
        return current + fragment + (newQuery.length === 0 ? '' : '?' + newQuery);
    }

    function Router() {
        this.root = this.getBinder();
        this.bindings = [];
    }

    Router.prototype.getBinder = function () {
        return new MatchBinder();
    };
    Router.prototype.match = function (mapHandler) {
        mapHandler(this.root.match.bind(this.root));
    };
    Router.prototype.trigger = function (location) {
        if (this.started) {
            var parts = location.split('?', 2);
            var query = {};
            if (parts[1]) {
                iterateQueryString(parts[1], function (name, value) {
                    value = parseParams(value);
                    if (!query[name]) {
                        query[name] = value;
                    }
                    else if (typeof query[name] === 'string') {
                        query[name] = [query[name], value];
                    }
                    else {
                        query[name].push(value);
                    }
                });
            }
            var loc = parts[0].replace(/^\/|$/g, ''),
                params = {
                    root: loc,
                    query: query
                },
                notValid = [],
                matched = false;

            this.bindings.forEach(function (binder) {
                var fragment,
                    pattern = binder.pattern.replace(/\((.*?)\)/g, '$1').replace(/^\//, '').split('/'),
                    binderLocation = binder.location.split('/'),
                    prevLoc = binder.prevLoc.replace(/^\//, '').split('/'),
                    checkSegment = function (link) {
                        var currSegment = link.splice(binderLocation.length - pattern.length, pattern.length),
                            prevSegment = prevLoc.splice(0, pattern.length);
                        return (!currSegment.equals(prevSegment));
                    };
                fragment = checkSegment(matched || loc.split('/'));
                if (fragment) {
                    matched = loc.split('/').splice(0, binderLocation.length - pattern.length);
                    var handler = binder.getLeaveHandler(),
                        args = [];
                    binder.setOnBind();

                    this.applyHandler(handler, args, params, location);
                    notValid.push(binder);
                }
            }.bind(this));

            notValid.forEach(function (binder) {
                this.bindings.splice(this.bindings.indexOf(binder), 1);
            }.bind(this));

            this.find(this.root, loc, params);
        }
    };
    Router.prototype.find = function (binder, location, params) {
        var bindings = binder.filter(location);
        bindings.forEach(this.onBinding.bind(this, location, params));
    };

    Router.prototype.execute = function (binder) {
        var binderlocation = binder.location.split('/'),
            rootLocation = binder.params.root.split('/'),
            location = '/' + rootLocation.splice(binderlocation.length, rootLocation.length -
                                                                        binderlocation.length).join('/');
        this.find(binder, location, binder.params);
    };

    Router.prototype.onBinding = function (location, params, binding) {
        binding.setOnBind(this.onBinding.bind(this, location, params, binding))
        this.runHandler(location, params, binding);
        var fragment = binding.getFragment(location);
        var subBinder = binding.getSubBinder();
        if (subBinder && subBinder.bindings && subBinder.bindings.length > 0) {
            this.find(subBinder, fragment, params);
        }
        var subRoutes = binding.getRoutes();
        if (subRoutes && subRoutes.length > 0) {
            while (subRoutes.length > 0) {
                var Route = subRoutes[0],
                    binder = new MatchBinder(binding.getFragment(location), params, this.execute.bind(this), binding.location);
                Route(binder);
                subBinder.bindings = subBinder.bindings.concat(binder.bindings);
                subRoutes.shift();
            }
        }

    };

    Router.prototype.serialize = function (obj) {
        var str = [];
        for (var p in obj)
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        return str.join("&");
    };
    Router.prototype.runHandler = function (location, params, binding) {

        if (this.bindings.indexOf(binding) === -1) {
            var handler = binding.getHandler();
            var args = binding.extractParams(location);

            binding.prevLoc = location;

            this.applyHandler(handler, args, params, location);
            this.bindings.push(binding);
        }

        var handler = binding.getQueryHandler();
        if (handler) {
            var args = [];
            this.applyHandler(handler, args, params, location);
        }

    };
    Router.prototype.applyHandler = function (handlers, args, params, location) {
        if (handlers && handlers.length > 0) {
            handlers.forEach(function (handler) {
                handler.apply(this, args.concat({
                    getQuery: function () {
                        return params.query;
                    },
                    getLocation: function (fragment, isQuery) {
                        return getLocation.call(this, fragment, isQuery, params, location)
                    }.bind(this)
                }));
            }.bind(this));
        }
    };
    Router.prototype.start = function () {
        this.started = true;
    };
    Router.prototype.stop = function () {
        this.started = false;
    };

    return Router;
}));

/**
 * Created by guntars on 11/10/2014.
 */
/*globals setTimeout, define*/
// ## widget/App Class
// Usage Example
//
//      define([
//          'widget/App',
//          'widget/parser!container/Container',
//      ], function (App, Container) {
//          'use strict';
//          return App.extend({
//              AppContainer: Container
//          });
//      });
define('widget/App',[
    './Mediator',
    'router/Router'
], function (Mediator, Router) {
    'use strict';
    function triggerRoute(router) {
        router.start();
        function onHashChange() {
            let match = window.location.href.match(/#(.*)$/);
            router.trigger(match ? match[1] : '');
        };
        window.addEventListener('hashchange', onHashChange, false);
        onHashChange();
    }

    // ### App Class
    // Creater App, EventBus and context for App.
    // Usage Example
    //
    //      var app= new App();
    //      app.start(document.body);
    class App {
        static extend(options = {}) {
            class Surrogate extends App {
            }
            Object.assign(Surrogate.prototype, options);
            return Surrogate;
        };

        constructor(options) {
            options = options || {};
            let router = new Router();

            this.beforeInit.apply(this, arguments);
            this.context = Object.assign(this.setContext.apply(this, arguments), {
                // Creating `EventBus` More info look in `Mediator` Section
                eventBus: new Mediator(this.context, (channel, scope)=> {
                    scope._globalEvents = scope._globalEvents || [];
                    if (scope._globalEvents.indexOf(channel) === -1) {
                        scope._globalEvents.push(channel);
                    }
                })
            });

            if (this.AppContainer !== undefined) {
                this.appContainer = new this.AppContainer({
                    appContext: this.context
                });

                let mapHandler = (this.appContainer._match !== undefined) ? this.appContainer._match : ()=> {
                };

                if (options.rootRoute !== undefined) {
                    router.match((match)=> {
                        match(options.rootRoute, mapHandler);
                    });
                } else {
                    router.match(mapHandler);
                }

                this.el = this.appContainer.el;

                triggerRoute(router);

            }
            this.init.apply(this, arguments);
        }


        // Running 'AppContainer' is initialised.
        //
        //      @method beforeInit
        beforeInit() {
        };

        // Running after 'AppContainer' is initialised.
        //
        //      @method init
        init() {
        };

        // SettingContext for the `App`
        //
        //      @method setContext
        setContext() {
            return {};
        }

        // Starting `App` in provided `Container`
        //
        //      @method start
        //      @param {HTMLElement} container
        start(container) {
            if (container instanceof HTMLElement === true) {
                container.appendChild(this.el);
                setTimeout(() => {
                    this.el.classList.add('show');
                }, 100);
            } else {
                throw Error('Contaner should be a HTML element');
            }
        }
    }
    ;
    return App;
});
;/**
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
                    throw new Error("watchJS error: browser not supported :/")
                }
            }

        // }
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
], function(WatchJS) {
    var watch = WatchJS.watch;

    function applyAttribute(childBinder, data) {
        var bind = childBinder.data.tplSet.bind,
            update = childBinder.data.tplSet.update === 'true';
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
                            watch(data, key, ()=> childBinder.text(dataItem));
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

                if (data.text !== undefined) {
                    childBinder.text(data.text);
                }
                if (update === true) {
                    watch(data, 'text', ()=> childBinder.text(data.text));
                }

            });
        }

    }

    return applyAttribute;
});
/**
 * Created by guntars on 15/03/2016.
 */
define('widget/parsers/addChildren',[], function() {
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
            events.forEach((event)=> {
                context._events.push(child.on(event.name, event.action, context, data));
            });
        }
    };


    Object.assign(addChildren, {elOnChange, elReady, applyEvents});

    return addChildren;
});
/**
 * Created by guntars on 11/11/14.
 */
define('widget/parsers/applyParent',[
    'templating/dom',
    './addChildren'
], function(dom, addChildren) {


    function setChildren(context, parentChildren = {}, data = {}) {
        if (context) {
            let elements = context.children;

            if (elements) {
                Object.keys(elements).forEach((name)=> {
                    let add = true,
                        child = elements[name],
                        parentChild = parentChildren[name];
                    if (parentChild !== undefined) {
                        if (context.nodes[name] !== undefined) {
                            context.nodes[name].call(context, child, parentChild, data);
                        } else if (child !== undefined) {
                            if (typeof parentChild === 'string') {
                                dom.text(child, parentChild);
                            }
                            else {
                                child = parentChild.run(child.el);
                            }
                        }

                    } else if (context.nodes[name] !== undefined &&
                        child.data.tplSet.noattach === 'true') {
                        context.nodes[name].call(context, child, data);
                        add = false;
                    }
                    if (add && child.elGroup.size > 0) {
                        addChildren(context, child, data);
                    }

                });
            }
        }
    }

    return setChildren;
});
/**
 * Created by guntars on 10/10/2014.
 */
define('widget/utils',[],function () {
    function extend(obj) {
        var type = typeof obj;
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
        if (protoProps && protoProps != null &&
            hasOwnProperty.call(protoProps, 'constructor')) {
            child = protoProps.constructor;
        } else {
            child = function () {
                return parent.apply(this, arguments);
            };
        }

        extend(child, parent, staticProps);

        var Surrogate = function () {
            this.constructor = child;
        };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate;
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
        return (Array.isArray) ? Array.isArray(obj) : toString.call(obj) === '[object Array]';
    }


    return {
        fnExtend: fnExtend,
        // Extend a given object with all the properties in passed-in object(s).
        extend:   extend,
        // Check if it's String
        isString: isString,
        // Check if I't Object
        isObject: isObject,
        // Check if it's Array
        isArray:  isArray
    };
});
/**
 * Created by guntars on 11/11/14.
 */
define('widget/parsers/setBinders',[],function () {

    function setBinders(children, ignoreCP) {
        let bindings = {};
        Object.defineProperty(bindings, '__cp__', {
            enumerable: false,
            value:      []
        });
        Object.keys(children).forEach((key) => {
            let el = children[key];
            if (el && el.data && el.data.bind !== undefined && el.data.type !== 'cp') {
                bindings[el.data.bind] = bindings[el.data.bind] || []
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
define('widget/parsers/applyBinders',[
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
/**
 * Created by guntars on 11/11/14.
 */
define('widget/parsers/setRoutes',[
    'templating/dom'
], function (dom) {

    function destroyComponent(cp) {
        if (cp.remove !== undefined) {
            cp.remove();
        }

    }

    function applyToChildren(children, cb) {
        if (children !== undefined) {
            Object.keys(children).forEach((name)=> {
                let cp = children[name];
                if (cp.elGroup && cp.elGroup.size > 0) {
                    cp.elGroup.forEach((item)=> cb(item));
                } else {
                    cb(cp);
                }
            });
        }
    }

    function matchRoute(child, match) {
        let route = (child.data !== undefined) ? child.data.route : undefined;

        if (route !== undefined && child.data.type !== 'cp' && child.name !== 'root') {
            let id, childMatch,
            //Need add return match in router, for better readability
                matches = match(route, match=> {
                    childMatch = match;
                });
            matches.to((...args)=> {
                let params = args.pop();
                id = (args.length > 0) ? params.getLocation() + '_' + args.join('_') : undefined;
                if (child.elGroup && child.elGroup.size === 0) {
                    child = child.run(true);
                    applyToChildren(child.children, (instance)=> {
                        if (instance && instance.to) {
                            instance.to(...args.concat(params));
                        }

                        if (instance && !instance._match) {
                            matchRoute(instance, childMatch);
                        } else if (instance && instance._match) {
                            matches.setRoutes((routes)=> {
                                instance._match((...args)=> {
                                    let match = routes.match(...args);
                                    instance._appliedRoutes.push(match);
                                    return match;
                                });
                                routes.run();
                            });

                            instance._reRoute = ()=> {
                                instance._applyRoutes(matches);
                            };
                        }

                    });

                } else {
                    applyToChildren(child.children, (instance)=> {
                        if (instance && instance.to) {
                            instance.to.apply(instance, args.concat(params));
                        }
                    });
                    dom.attach(child);
                }

            });

            matches.leave(()=> {
                applyToChildren(child.children, (instance)=> {
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

            matches.query((params)=> {
                applyToChildren(child.children, (instance)=> {
                    if (instance && instance.query !== undefined) {
                        instance.query(params);
                    }
                });
            });

        } else if (child.children !== undefined && child.data.type !== 'cp') {
            applyToChildren(child.children, child=> matchRoute(child, match));
        } else if (child.elGroup && child.elGroup.size > 0) {
            child.elGroup.forEach((instance)=> {
                if (child.data.type === 'cp' && instance._match) {
                    instance._match(match);
                }
            })
        }
    }

    function setRoutes(context, children) {
        if (!context._match) {
            context._match = (match)=> {
                applyToChildren(children, child=> matchRoute(child, match));
                if (context.match) {
                    context.match(match);
                }
            }
        }
    };

    return setRoutes;
});
/**
 * Created by guntars on 15/03/2016.
 */
define('widget/parsers/applyElement',[
    'templating/dom'
], function (dom) {
    //Applying dom.Element to template elements.
    //
    //      @private applyElement
    //      @param {Object} elements
    function applyElement(elements = {}, params) {
        let instances = {};
        Object.keys(elements).forEach((key)=> {
            let instance = elements[key];
            if (typeof instance !== 'string') {
                let element = instance.elGroup.first;
                if (element) {
                    instances[key] = element;
                    if (element instanceof dom.Element === true &&
                        (['pl'].indexOf(element.data.type) !== -1)) {
                        let bind = element.data.tplSet.bind;
                        if (bind) {
                            Object.keys(bind).forEach((attr)=> {
                                if (params[bind[attr]] !== undefined) {
                                    if (attr !== 'class') {
                                        element.setAttribute(attr, params[bind[attr]]);
                                    } else {
                                        element.addClass(params[bind[attr]]);
                                    }
                                }
                            });
                        }

                    }
                } else {
                    instances[key] = instance;
                }
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
define('widget/Constructor',[
    'require',
    'templating/Decoder',
    'templating/dom',
    './Mediator',
    './parsers/applyAttribute',
    './parsers/applyParent',
    './parsers/applyBinders',
    './parsers/setBinders',
    './parsers/setRoutes',
    './parsers/applyElement',
    './parsers/addChildren'
], function(require,
            Decoder,
            dom,
            Mediator,
            applyAttribute,
            applyParent,
            applyBinders,
            setBinders,
            setRoutes,
            applyElement,
            addChildren) {
    'use strict';

    //TODO: need better Solution later. Context is too global;
    var context = {};

    function destroy(instance) {
        let keys = Object.keys(instance);
        if (keys.length > 0) {
            keys.forEach((key)=> {
                if (key !== 'root') {
                    let children = instance[key];
                    if (children.elGroup !== undefined && children.elGroup.size > 0) {
                        children.elGroup.forEach(child=> {
                            if (child !== undefined && child.remove !== undefined) {
                                child.remove(true);
                            }
                        })
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
    class Constructor {
        static extend(options = {}) {
            class Surrogate extends Constructor {
            }
            Object.assign(Surrogate.prototype, options);
            return Surrogate;
        };

        constructor(data, parentChildren, dataSet, node) {
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
                let keys = (dataSet) ? Object.keys(dataSet) : [],
                    contextData = (keys.length > 0) ? dataSet : this.context.data;

                if (!this.data && contextData) {
                    this.data = contextData[data.bind] || contextData;
                }

                let decoder = new Decoder(this.template),
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

        init(data, children, dataSet) {
        };

        // Running before Constructor is initialised
        //
        //      @method beforeInit
        //      @param {Object} data (comes from template data attributes)
        //      @param {Object} children (comes placeholder content
        //      from template)
        //      @param {Object} datatSet (data passing if component is
        //      in template binders)
        beforeInit(data, children, dataSet) {
        };

        // Load external css style for third party modules.
        //
        //      @method loadCss
        //      @param {string} url
        loadCss(url) {
            this.context._cssReady = this.context._cssReady || [];
            if (this.context._cssReady.indexOf(url) === -1) {
                this.context._cssReady.push(url);
                let linkRef = document.createElement("link");
                linkRef.setAttribute("rel", "stylesheet")
                linkRef.setAttribute("type", "text/css")
                linkRef.setAttribute("href", url)
                if (typeof linkRef != "undefined") {
                    document.getElementsByTagName("head")[0].appendChild(linkRef);
                }
            }

        };

        // Remove from parentNode
        //
        //      @method detach
        detach() {
            if (!this._placeholder) {
                this._placeholder = document.createElement(this.el.tagName);
            }
            if (!this._parent) {
                this._parent = this.el.parentNode;
            }

            if (this.el && this._parent) {
                this._parent.replaceChild(this._placeholder, this.el)
            }

        };

        // Add to parentNode
        //
        //      @method attach
        attach() {
            if (this._placeholder && this._parent) {
                this._parent.replaceChild(this.el, this._placeholder)
            }
        };

        // Executes when Component is destroyed
        //
        //      @method applyBinders
        onDestroy() {

        };

        //Removing widget from Dom
        //
        //      @method destroy
        destroy(force) {
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

            destroy(this.children);
            if (force && this._matches) {
                this._matches.remove();
            }

            if (this.elGroup !== undefined && this.el !== undefined) {
                this.elGroup.delete(this.el);
            }
            this.root.remove();

            delete this.el;

        };

        remove(...args) {
            this.destroy(...args);
        }

        setRoutes(instance) {
            if (instance !== undefined) {
                this._routes.push(instance);
            }
        };

        _applyRoutes(matches) {
            while (this._routes.length > 0) {
                let instance = this._routes.shift();
                if (instance && instance._match) {
                    matches.setRoutes((routes)=> {
                        instance._match((...args)=> {
                            let match = routes.match(...args);
                            this._appliedRoutes.push(match);
                            return match;
                        });
                        routes.run();
                    });
                }
            }
            matches.rebind();
        };

        _reRoute() {
            this._routes.splice(0, this._routes.length);
        };

        rebind() {
            this._reRoute();
        };

        // Adding Childrens manually after initialization.
        //  @method setChildren
        //  @param {Element} el
        //  @param {Object} data
        setChildren(el, data) {
            let name = el.data.name,
                instance = this.children[name];
            if (instance !== undefined && instance.el !== undefined) {
                instance.remove();
            }

            instance = el.run(data || true);
            addChildren(this, instance, data);

            this.setRoutes(instance);
            this.rebind();
        };

        // Adding Dynamic components
        // @method addComponent
        // @param {String} name
        // @param {Constructor} Component
        // @param {Element} container
        // @param {Object} data (data attributes)
        // @param {Object} children
        // @param {Object} dataSet (Model for bindings)
        addComponent(Component, options) {
            let name = options.name,
                container = options.container;

            if (name === undefined) {
                throw ('you have to define data.name for component.')
            } else if (container === undefined) {
                throw ('You have to define container for component.')
            } else if (this.children[name] !== undefined) {
                throw ('Component using name:' + name + '! already defined.')
            }
            let component = this.setComponent(Component, options),
                instance = component.run(options.container);
            this.children[name] = instance;
            this.setRoutes(instance);
            this.rebind();
            return instance;
        };

        setComponent(Component, options) {
            let instance = {
                name: options.name,
                data: {
                    tag:  'div',
                    type: 'cp'
                },
                run:  (container)=> {
                    options.appContext = this.context;
                    let cp = new Component(options, options.children, options.data);
                    if (container instanceof HTMLElement === true) {
                        container.parentNode.replaceChild(cp.el, container);
                    } else if (container.el !== undefined && options.pos !== undefined) {
                        dom.insertBefore(container, cp, options.pos);
                    } else if (container.el !== undefined) {
                        dom.append(container, cp);
                    }
                    return cp;
                }
            }
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
        applyBinders(...args) {
           return applyBinders(this, ...args);
        }
    }
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
        events:     {},
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
        elReady:    {},
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
