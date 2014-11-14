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
    './utils',
    './mediator',
    'templating/Decoder',
    './parsers/applyAttribute',
    './parsers/setChildren',
    './parsers/applyBinders',
    './parsers/setBinders',
    './parsers/setRoutes'
], function (utils, Mediator, Decoder, applyAttribute, setChildren, applyBinders, setBinders, setRoutes) {
    'use strict';
    var context = {};

    // Constructor Class
    //
    //      @Constructor
    //      @param {Object} data
    //      @param {Object} children
    //      @param {Object} dataSet
    function Constructor(data, children, dataSet) {
        this.eventBus = new Mediator();
        this.context = context;
        if (data.appContext !== undefined) {
            utils.extend(this.context, data.appContext);
        }
        this.beforeInit.apply(this, arguments);

        if (this.template) {
            var decoder = new Decoder(this.template),
                template = decoder.render();
            this.el = template.fragment;
            this.data = (dataSet) ? dataSet : this.context.data[data.bind];
            this.children = setChildren.call(this, template.children, children);
            this.bindings = setBinders.call(this, this.children);
            this.routes = setRoutes.call(this, this.children);

            if (this.data) {
                this.applyBinders(this.data, this);
            }

        } else {

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
        // Running when Constructor is initialised
        //
        //      @method init
        //      @param {Object} data (comes from template data attributes)
        //      @param {Object} children (comes placeholder content
        //      from template)
        //      @param {Object} datatSet (data passing if component is
        //      in template binders)
        init: function (data, children, dataSet) {
        },
        // Running before Constructor is initialised
        //
        //      @method beforeInit
        //      @param {Object} data (comes from template data attributes)
        //      @param {Object} children (comes placeholder content
        //      from template)
        //      @param {Object} datatSet (data passing if component is
        //      in template binders)
        beforeInit: function (data, children, dataSet) {
        },
        // Applying Binders manually, if use nodes function
        //
        //      @method applyBinders
        applyBinders: applyBinders,
        //Removing widget from Dom
        //
        //      @method destroy
        destroy: function () {
            this.el.remove();
        }
    });

    Constructor.extend = utils.fnExtend;

    return Constructor;
});