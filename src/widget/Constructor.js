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
define([
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

        constructor(options = {}, parentChildren, dataSet = {}, node) {
            //TODO: for Backwards compatability later need to remove
            this.instance = this;
            this._appliedRoutes = [];
            this._events = [];
            this._globalEvents = [];
            this._parentChildren = parentChildren;
            this._options = options;
            this._rendered = false;
            this._arguments = arguments;
            this._dataSet = dataSet;

            this.eventBus = new Mediator(this);

            if (node !== undefined && node.name !== undefined) {
                this.name = node.name;
            }

            this.beforeInit(...this._arguments);


        };

        ready(el) {
            this.el = el;

        }

        setContext(context) {
            this.context = context;

            if (!this.async) {
                this.render();
            }
            this.init(...this._arguments);
        };

        set context(context) {
            if (!this.data) {
                let keys = (this._dataSet) ? Object.keys(this._dataSet) : [],
                    contextData = (keys.length > 0) ? this._dataSet : context.data;
                if (contextData) {
                    this.data = contextData[this._options.bind] || contextData;
                }
            }
            context.match((match)=> {
                if (this.match) {
                    this.match(match);
                }

                this._context = Object.assign({
                    match: match
                }, context);
            });
        }

        get context() {
            return this._context;
        };

        // method render called manually if flag async is true;
        //
        //      @method render
        render(data) {
            if (!this._rendered) {
                if (this.template) {
                    if (data) {
                        this.data = data;
                    }
                    let options = this._options,
                        parentChildren = this._parentChildren,
                        decoder = new Decoder(this.template),
                        template = decoder.render(this.data);
                    if (this.el) {
                        let parent = this.el.parentNode;
                        if (parent) {
                            parent.replaceChild(template.fragment, this.el);
                        }
                        if (this.elGroup && this.elGroup.get(this.el)) {
                            this.elGroup.delete(this.el);
                            this.el = template.fragment;
                            this.elGroup.set(template.fragment, this);
                        }
                    } else {
                        this.el = template.fragment;
                    }


                    this.root = new dom.Element(template.fragment, {
                        name: 'root',
                        data: {}
                    });

                    this.children = applyElement(template.children, options);
                    applyParent(this, parentChildren, this.data);
                    this.bindings = setBinders(this.children, true);

                    if (this.data) {
                        this.applyBinders(this.data, this);
                    }

                    setRoutes(this.children, this.context);
                    addChildren(this, this.root);
                    this.rendered(...this._arguments);
                    this._rendered = true;
                }
            }
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

        // Running when Constructor is initialised
        //
        //      @method beforeInit
        //      @param {Object} data (comes from template data attributes)
        //      @param {Object} children (comes placeholder content
        //      from template)
        //      @param {Object} datatSet (data passing if component is
        //      in template binders)
        init(data, children, dataSet) {
        };

        // Running when widget is rendered
        //
        //      @method beforeInit
        //      @param {Object} data (comes from template data attributes)
        //      @param {Object} children (comes placeholder content
        //      from template)
        //      @param {Object} datatSet (data passing if component is
        //      in template binders)
        rendered(data, children, dataSet) {
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
        destroy() {
            this.onDestroy();
            this.eventBus.clear();
            while (this._events.length > 0) {
                this._events.shift().remove();
            }

            while (this._globalEvents.length > 0) {
                this._globalEvents.shift().remove();
            }

            destroy(this.children);

            if (this.elGroup !== undefined && this.el !== undefined) {
                this.elGroup.delete(this.el);
            }
            if (this.root && this.root.remove) {
                this.root.remove();
            }

            delete this.el;

        };

        remove(...args) {
            this.destroy(...args);
        }

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
            instance.setContext(this.context);
            this.children[name] = instance;
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
                    let cp = new Component(options, options.children, options.data),
                        el = document.createElement('div');
                    el.setAttribute('style', 'display:none;');
                    cp.ready(el);

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