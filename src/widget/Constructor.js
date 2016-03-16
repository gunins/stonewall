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
], function (require,
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
                                if (child.children !== undefined) {
                                    destroy(child.children);
                                }
                                child.remove();
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
            //for Backwards compatability
            this.instance = this;
            this._routes = [];
            this._appliedRoutes = [];
            this._events = [];
            this._globalEvents = [];

            //this._node = node;
            this.eventBus = new Mediator(this);
            this.context = (data.appContext !== undefined) ? data.appContext : {};

            if (node !== undefined && node.name !== undefined) {
                this.name = node.name;
            }

            this.beforeInit.apply(this, arguments);


            /*   // Remeber remove this
             if (node && node.getInstance) {
             var instance = node.getInstance();
             instance.instance = this;
             instance.eventBus = this.eventBus;
             }*/

            if (this.template) {
                var keys = (dataSet) ? Object.keys(dataSet) : [],
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

                this.children = applyElement.call(this, template.children, data);
                applyParent.call(this, parentChildren, this.data);
                this.bindings = setBinders.call(this, this.children, true);

                if (this.data) {
                    this.applyBinders(this.data, this);
                }

                setRoutes.call(this, this.children);
                addChildren.call(this, 'root', this.root);

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
                var linkRef = document.createElement("link");
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
                this._events[0].remove();
                this._events.shift();
            }

            while (this._appliedRoutes.length > 0) {
                this._appliedRoutes[0].remove();
                this._appliedRoutes.shift();
            }
            while (this._globalEvents.length > 0) {
                this._globalEvents[0].remove();
                this._globalEvents.shift();
            }

            destroy(this.children);
            this.root.remove();
            if (force && this._matches) {
                this.matches.remove();
            }
            delete this.el;
            if (this.elGroup !== undefined && this.el !== undefined) {
                this.elGroup.delete(this.el);
            }
        };

        remove() {
            this.destroy()
        }

        setRoutes(instance) {
            if (instance !== undefined) {
                this._routes.push(instance);
            }
        };

        _applyRoutes(matches) {
            while (this._routes.length > 0) {
                let instance = this._routes[0];
                if (instance && instance._match) {
                    matches.setRoutes(function (routes) {
                        instance._match.call(instance, (...args)=> {
                            let match = routes.match.apply(routes, args);
                            this._appliedRoutes.push(match)
                            return match;
                        });
                        routes.run();
                    }.bind(this));
                }
                this._routes.shift();
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
            let name = el.data.name;
            let instance = this.children[name];
            if (instance !== undefined && instance.el !== undefined) {
                instance.remove();
            }

            instance = el.run(data || true);
            addChildren.call(this, name, instance, data);

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
            var name = options.name;
            var container = options.container;

            if (name === undefined) {
                throw ('you have to define data.name for component.')
            } else if (container === undefined) {
                throw ('You have to define container for component.')
            } else if (this.children[name] !== undefined) {
                throw ('Component using name:' + name + '! already defined.')
            }
            var component = this.setComponent(Component, options);

            component.run(options.container);
            this.children[name] = component;
            this.setRoutes(component.instance);
            this.rebind();
            return component;
        };

        setComponent(Component, options) {
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
                    var cp = new Component(options, options.children, options.data);
                    instance.instance = cp;
                    instance.eventBus = cp.eventBus;
                    instance.children = instance._node.children = cp.children;
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
    }
    ;
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
        elOnChange:   {},
        // Running when Constructor is initialised
        //
        //      @method init
        //      @param {Object} data (comes from template data attributes)
        //      @param {Object} children (comes placeholder content
        //      from template)
        //      @param {Object} datatSet (data passing if component is
        //      in template binders)
        // Applying Binders manually, if use nodes function
        //
        //      @method applyBinders
        applyBinders: applyBinders
    });


    return Constructor;
});