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
define([
    './mediator',
    'router/Router',
    './utils'
], function (Mediator, Router, utils) {
    'use strict';
    function triggerRoute(router) {
        router.start();
        function onHashChange() {
            var match = window.location.href.match(/#(.*)$/);
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
    function App(options) {
        options    = options || {};
        var router = new Router(),
            mapHandler;

        this.beforeInit.apply(this, arguments);
        this.context = utils.extend(this.setContext.apply(this, arguments), {
            // Creating `EventBus` More info look in `Mediator` Section
            eventBus: new Mediator()
        });
        if (this.AppContainer !== undefined) {
            this.appContainer = new this.AppContainer({
                appContext: this.context
            });
            if (this.appContainer._match !== undefined) {
                mapHandler = this.appContainer._match.bind(this.appContainer);
            } else {
                mapHandler = function () {

                }
            }

            if (options.rootRoute !== undefined) {
                router.match(function (match) {
                    match(options.rootRoute, mapHandler);
                });
            } else {
                router.match(mapHandler);
            }

            this.setContext();
            this.el           = this.appContainer.el;
            setTimeout(function () {
                this.el.classList.add('show');
            }.bind(this), 100);
            triggerRoute(router);

        }
        this.init.apply(this, arguments);
    }

    // Extending the `App` Class
    //
    //      @Static method extend
    App.extend = utils.fnExtend;

    utils.extend(App.prototype, {
        // Running 'AppContainer' is initialised.
        //
        //      @method beforeInit
        beforeInit: function () {
        },
        // Running after 'AppContainer' is initialised.
        //
        //      @method init
        init:       function () {
        },
        // SettingContext for the `App`
        //
        //      @method setContext
        setContext: function () {
            return {};
        },
        // Starting `App` in provided `Container`
        //
        //      @method start
        //      @param {HTMLElement} container
        start:      function (container) {
            if (container instanceof HTMLElement === true) {
                container.appendChild(this.el);
            }
        }
    });
    return App;
});