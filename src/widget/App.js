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
    './Mediator',
    'router/Router'
], function(Mediator, Router) {
    'use strict';
    function triggerRoute(router) {
        router.start();
        router.setListener((location)=> {
            let match = window.location.href.match(/#(.*)$/);
            if (match[1] !== location) {
                window.location.hash = location;
            }
        });

        function onHashChange() {
            let match = window.location.href.match(/#(.*)$/),
                route = match ? match[1] : ''
                router.trigger(route);
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

        constructor(options = {}) {
            this.options = options;

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
                this.el = container;
                let el = document.createElement('div');
                container.appendChild(el);
                this.appContainer.ready(el);

                let router = new Router(this.options.rootRoute);
                router.match((match)=> this.appContainer._match(match));

                triggerRoute(router);

                setTimeout(() => {
                    container.classList.add('show');
                }, 100);
            } else {
                throw Error('Contaner should be a HTML element');
            }
        }
    }
    ;
    return App;
});