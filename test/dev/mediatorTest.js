/* globals describe, it, expect, beforeEach */
define([
    'Mediator'
], function (Mediator) {
    'use strict';
    var expect = chai.expect;


    describe('Mediator Tests Dev environment', function () {
        var eventBus, eventBusA, evts;
        beforeEach(function () {
            // runs before each test in this block
            eventBus = new Mediator();
            eventBusA = new Mediator();
        });

        afterEach(function () {
            // runs after each test in this block
            evts.forEach(function (evt) {
                evt.remove();
            });
        });
        describe('Testing Mediator if events are triggered in proper order', function () {
            it('two eventBuses are subscribe to same events, and triggered only required ones', function () {
                var a = 0;
                var test1 = 'eventBus Two';
                var test2 = 'eventBus One';
                var evt1 = eventBus.subscribe('test', function (data) {
                    a++;
                    expect(data).to.equal(test1);
                    expect(a).to.equal(2);

                });
                var evt2 = eventBusA.subscribe('test', function (data) {
                    a++;
                    expect(data).to.equal(test2);
                    expect(a).to.equal(1);
                });
                eventBusA.publish('test', test2);
                eventBus.publish('test', test1);
                evts = [evt1, evt2]

            });
            it('Multiple arguments sent to eventBus', function () {
                var test1 = 'eventBus Two';
                var test2 = 'eventBus One';
                var evt1 = eventBus.subscribe('test', function (a, b, c, d) {
                    expect(a).to.equal(test1);
                    expect(b).to.equal(test2);
                    expect(c).to.equal(test1);
                    expect(d).to.equal(test2);

                });

                eventBus.publish('test', test1, test2, test1, test2);
                evts = [evt1]

            });
            it('Update options', function () {
                var test1 = 'eventBus Two';
                var test2 = 'eventBus One';

                var evt1 = eventBus.subscribe('test', function (a, b, c, d) {
                    expect(a).to.equal(test1);
                    expect(b).to.equal(test2);
                    expect(c).to.equal(test1);
                    expect(d).to.equal(test2);

                });

                eventBus.publish('test', test1, test2, test1, test2);
                evt1.update({
                    fn: function (a, b, c, d) {
                        expect(a).to.equal(test2);
                        expect(b).to.equal(test1);
                        expect(c).to.equal(test2);
                        expect(d).to.equal(test1);
                        expect(this).to.undefined;
                    }
                });

                eventBus.publish('test', test2, test1, test2, test1);
                evt1.update({
                    fn:      function (a, b, c, d) {
                        expect(a).to.equal(test2);
                        expect(b).to.equal(test1);
                        expect(c).to.equal(test2);
                        expect(d).to.equal(test1);

                        expect(this.a).to.equal(1);
                        expect(this.b).to.equal(2);
                        expect(this.c).to.equal(3);

                    },
                    context: {
                        a: 1,
                        b: 2,
                        c: 3
                    }
                });

                eventBus.publish('test', test2, test1, test2, test1);

                evts = [evt1]

            });
            it('Multiple arguments sent to eventBus', function () {
                var test1 = 'eventBus Two';
                var test2 = 'eventBus One';
                var evt1 = eventBus.subscribe('test', function (a, b, c, d) {
                    expect(a).to.equal(test1);
                    expect(b).to.equal(test2);
                    expect(c).to.equal(test1);
                    expect(d).to.equal(test2);

                });

                eventBus.publish('test', test1, test2, test1, test2);
                evts = [evt1]

            });
            it('Check priority', function (done) {
                var a = 0;
                var test1 = 'eventBus Two';

                var evt1 = eventBus.subscribe('test', function (data) {
                    a++;
                    expect(data).to.equal(test1);
                    expect(a).to.equal(2);
                }, {priority: 1});

                var evt2 = eventBus.subscribe('test', function (data) {
                    a++;
                    expect(data).to.equal(test1);
                    expect(a).to.equal(3);
                    done();
                }, {priority: 2});

                var evt3 = eventBus.subscribe('test', function (data) {
                    a++;
                    expect(data).to.equal(test1);
                    expect(a).to.equal(1);

                }, {priority: 0});

                eventBus.publish('test', test1);

                evts = [evt1, evt2, evt3]

            });

            it('Dynamic priority', function (done) {
                var a = 0;
                var test1 = 'eventBus Two';

                var evt1 = eventBus.subscribe('test', function (data) {
                    a++;
                    expect(data).to.equal(test1);
                    expect(a).to.equal(3);
                }, {priority: 1});

                var evt2 = eventBus.subscribe('test', function (data) {
                    a++;
                    expect(data).to.equal(test1);
                    expect(a).to.equal(1);
                    done();
                }, {priority: 2});

                var evt3 = eventBus.subscribe('test', function (data) {
                    a++;
                    expect(data).to.equal(test1);
                    expect(a).to.equal(2);

                }, {priority: 0});

                evt2.setPriority(0);

                eventBus.publish('test', test1);

                evts = [evt1, evt2, evt3]

            });

            it('Check if evt is removed', function () {
                var a = 0;

                var evt1 = eventBus.subscribe('test', function (data) {
                    a++;
                });


                eventBus.publish('test');
                eventBus.publish('test');
                evt1.remove();

                eventBus.publish('test');
                eventBus.publish('test');
                eventBus.publish('test');

                expect(a).to.equal(2);

                evts = [];

            });
            it('Check if once working only once', function () {
                var a = 0;

                var evt1 = eventBus.once('test', function () {
                    a++;
                });


                eventBus.publish('test');
                eventBus.publish('test');

                eventBus.publish('test');
                eventBus.publish('test');
                eventBus.publish('test');

                expect(a).to.equal(1);

                evts = [evt1];

            });
            it('Check if options.calls working', function () {
                var a = 0;

                var evt1 = eventBus.subscribe('test', function () {
                    a++;
                }, {calls: 2});


                eventBus.publish('test');
                eventBus.publish('test');

                eventBus.publish('test');
                eventBus.publish('test');
                eventBus.publish('test');

                expect(a).to.equal(2);

                evts = [evt1];

            });

            it('Check if ":" separator triggering event properly', function () {
                var a = 0, b = 0;
                var evt1 = eventBusA.subscribe('test', function () {
                    a++;
                });

                var evt2 = eventBusA.subscribe('test:extra', function () {
                    b++
                });

                eventBusA.publish('test');
                eventBusA.publish('test:extra');

                expect(a).to.equal(2);
                expect(b).to.equal(1);
                evts = [evt1, evt2];
            });

            it('Check if predictate prevents calling events', function () {
                var a = 0, b = 0;


                var evt2 = eventBusA.subscribe("test:extra", function (data, channel) {
                    b++;
                    //channel.stopPropagation();
                }, {
                    predicate: function (data) {
                        return data.From !== data.To;
                    }
                });

                var evt1 = eventBusA.subscribe('test:extra', function () {
                    a++;
                });

                eventBusA.publish('test:extra', {From: 'a', To: 'b'});
                eventBusA.publish('test:extra', {From: 'a', To: 'a'});

                expect(a).to.equal(2);
                expect(b).to.equal(1);

                evts = [evt1, evt2];
            });
            it('Check if stopPropogation works.', function () {
                var a = 0, b = 0;

                var evt1 = eventBusA.subscribe('test:extra', function () {
                    console.log('a')
                    a++;
                });

                var evt2 = eventBusA.subscribe("test:extra", function (data, channel) {
                    b++;
                    console.log('b')
                    channel.stopPropagation();
                }, {
                    predicate: function (data) {
                        return data.From !== data.To;
                    },
                    priority:0
                });

                eventBusA.publish('test:extra', {From: 'a', To: 'b'});
                eventBusA.publish('test:extra', {From: 'a', To: 'a'});
                eventBusA.publish('test:extra', {From: 'a', To: 'b'});
                eventBusA.publish('test:extra', {From: 'a', To: 'b'});

                expect(a).to.equal(1);
                expect(b).to.equal(3);

                evts = [evt1, evt2];
            });
        });
    });
});