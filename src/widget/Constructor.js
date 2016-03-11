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
    'templating/dom',
    './utils',
    './Mediator',
    'templating/Decoder',
    './parsers/applyAttribute',
    './parsers/setChildren',
    './parsers/applyBinders',
    './parsers/setBinders',
    './parsers/setRoutes',
    './parsers/applyEvents'
], function (require, dom, utils, Mediator, Decoder, applyAttribute, setChildren, applyBinders, setBinders, setRoutes, applyEvents) {
    'use strict';

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

        constructor(data, children, dataSet, node) {
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


            // Remeber remove this
            if (node && node.getInstance) {
                var instance = node.getInstance();
                instance.instance = this;
                instance.eventBus = this.eventBus;
            }

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

                this.children = setChildren.call(this, template.children, children, this.data, data);

                this.bindings = setBinders.call(this, this.children, true);
                //setRoutes.call(this, this.children);

                if (this.data) {
                    this.applyBinders(this.data, this, true);
                }

            }

            else {

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
        destroy() {
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
            while (this._appliedRoutes.length > 0) {
                this._appliedRoutes[0].remove();
                this._appliedRoutes.shift();
            }
            while (this._globalEvents.length > 0) {
                this._globalEvents[0].remove();
                this._globalEvents.shift();
            }

            var destroy = function (instance) {
                var keys = Object.keys(instance);
                if (keys.length > 0) {
                    keys.forEach(function (key) {
                        var child = instance[key];
                        if (child.instance !== undefined && child.instance.destroy !== undefined) {
                            child.instance.destroy();
                        } else if (child.remove !== undefined) {
                            if (child.children) {
                                destroy(child.children);
                            }
                            child.remove();
                        }
                    });
                }
            }
            destroy(this.children);
            this.root.remove();
        };

        setRoutes(instance) {
            if (instance !== undefined) {
                this._routes.push(instance);
            }
        };

        _applyRoutes(matches) {
            while (this._routes.length > 0) {
                var instance = this._routes[0];
                if (instance && instance._match) {
                    matches.setRoutes(function (routes) {
                        instance._match.call(instance, function () {
                            var match = routes.match.apply(routes, arguments);
                            this._appliedRoutes.push(match)
                            return match;
                        }.bind(this));
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
            var name = el._node.name;
            if (this.children[name] !== undefined && this.children[name].el !== undefined) {
                dom.detach(this.children[name]); //.detach();
            }
            el.applyAttach();

            if (el._node.data.type !== 'cp') {
                this.children[name] = new dom.Element(el);
            }

            this.children[name].placeholder = this.el.querySelector('#' + el._node.id);
            this.children[name].el = el.run(this.el, false, false, data);

            if (this.elReady[name] !== undefined && this.children[name].el !== undefined) {
                this.elReady[name].call(this, this.children[name], data);
            }

            var events = this.events[name];
            applyEvents.call(this, this.children[name], events);

            var instance = this.children[name]._node.data.instance;
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