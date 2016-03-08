/* globals describe, it, expect, beforeEach */
define([
    'sinon',
    'App',
    'Mediator'
], function (sinon, App, Mediator) {
    'use strict';
    var expect = chai.expect;


    describe('App Tests Dev environment', function () {
        beforeEach(function () {
            // runs before each test in this block


        });

        afterEach(function () {

        });
        describe('Testing App class', function () {
            it('Checking Extend function', function () {
                var Surogate = App.extend({
                    init: function () {
                        return 'bar';
                    },
                    test: function () {
                        return 'foo'
                    }
                });

                var surogate = new Surogate(),
                    appInner = new App();


                expect(surogate.init()).to.equal('bar');
                expect(surogate.test()).to.equal('foo');

                expect(appInner.init()).to.be.undefined;
                expect(appInner.test).to.be.undefined;

            });

            it('Checking if init and before init are called and beforeInit called before init', function () {

                var Surogate = App.extend({
                    init: function () {
                        return 'bar';
                    },
                    test: function () {
                        return 'foo'
                    }
                });

                var beforeInit = sinon.spy(Surogate.prototype, "beforeInit");
                var init = sinon.spy(Surogate.prototype, "init");
                var app = new Surogate();
                expect(beforeInit.calledOnce).to.be.true;
                expect(init.calledOnce).to.be.true;
                expect(beforeInit.calledBefore(init)).to.be.true;

            });

            it('Checking if AppContainer is created', function () {
                function AppContainer(options) {
                    Object.assign(this, options);
                    this.el = document.createElement('div');
                };

                AppContainer.prototype._match = function () {
                };

                var Surogate = App.extend({
                    init:         function () {
                        return 'bar';
                    },
                    test:         function () {
                        return 'foo'
                    },
                    AppContainer: AppContainer
                });

                var app = new Surogate();
                expect(app.el).to.equal(app.appContainer.el);
                expect(app.context).to.equal(app.appContainer.appContext);
                expect(app.context.eventBus).to.equal(app.appContainer.appContext.eventBus);
                expect(app.context.eventBus).to.be.instanceof(Mediator);
            });

            it('Checking  App.start() method', function (done) {
                function AppContainer(options) {
                    Object.assign(this, options);
                    this.el = document.createElement('div');
                };

                AppContainer.prototype._match = function () {
                };

                var Surogate = App.extend({
                    init:         function () {
                        return 'bar';
                    },
                    test:         function () {
                        return 'foo'
                    },
                    AppContainer: AppContainer
                });
                var container = document.createElement('div');
                var app = new Surogate();
                app.start(container);
                expect(container.contains(app.el)).to.be.true;
                setTimeout(function () {
                    expect(app.el.classList.contains('show')).to.be.true;
                    done();
                }, 150)
            });
        });
    });
});