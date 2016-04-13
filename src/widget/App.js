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
    function triggerRoute(router, active) {
        var activeLocation = '';

        router.setListener((location, move)=> {
            activeLocation = location;
            if (!move) {
                window.location.hash = location;
            }
        });

        router.onRouteChange(()=>{
            if (active.size > 0) {
                active.forEach(handler=>handler());
                active.clear();
            }
        });

        function onHashChange() {
            let match = window.location.href.match(/#(.*)$/),
                route = match ? match[1] : ''
            if (activeLocation !== route) {
                router.trigger(route);
            }
        };
        router.start();
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
                if (this.AppContainer !== undefined) {
                    this.appContainer = new this.AppContainer({
                        appContext: this.context
                    });
                }
                
                this.init.call(this, this.options);

                this.el = container;
                let el = document.createElement('div');
                container.appendChild(el);
                this.appContainer.ready(el);

                let router = new Router(this.options.rootRoute),
                    active = new Map();
                router.match((match)=> this.appContainer._match({match, active}));

                triggerRoute(router, active);

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