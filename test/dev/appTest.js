/* globals describe, it, expect, beforeEach */
define([
    'App'
], function (App) {
    'use strict';
    var expect = chai.expect;


    describe('App Tests Dev environment', function () {
        var app;
        beforeEach(function () {
            // runs before each test in this block
            app = new App();

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

            })
        });
    });
});