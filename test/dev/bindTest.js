/* globals describe, it, expect, beforeEach */
define([
    'templating/Decoder',
    'BasicBind'
], function (Decoder, App) {
    var expect, container, app;
    var testData = {
        val: {
            items: {
                value: 'Some Value'

            },
            names: [
                "email",
                "truthy",
                "imsi"
            ],
            list:  [
                {
                    test: {
                        value: 'Test Value',
                        badge: 1
                    }
                },
                {
                    test: {
                        value: 'Test Inner',
                        badge: 2
                    }
                },
                {
                    test: {
                        value: 'Test Value1',
                        badge: 3
                    }
                }
            ]
        }
    };

    expect = chai.expect;

    container      = document.createElement('div');
    var $container = $(container);

    $container.css('opacity', 0).appendTo('body');

    app = new App();
    app.start(container);

    var $template = $container.children(),
        data      = app.context.data;

    function testRender(list, data) {
        list.each(function (index) {
            var item  = $(this),
                value = item.find('.value'),
                badge = item.find('.badge'),
                obj   = data[index].test;
            expect(value).to.have.$text(obj.value);
            expect(badge).to.have.$text(obj.badge.toString());

        });
    }

    function testArray(list, data) {
        list.each(function (index) {
            var item = $(this),
                obj  = data[index];
            expect(item).to.have.$text(obj);

        });
    }

    function removeFirstArray() {
        app.context.data.val.names.splice(1, 1);
    };
    function addOneArray() {
        data.val.names.push('TestValue');
    };

    function removeFirst() {
        app.context.data.val.list.splice(1, 1);
    };

    function addOne() {
        data.val.list.push({
            test: {
                value: 'Test Value New',
                badge: 4
            }
        });
    };
    function addOther() {
        data.val.list.unshift({
            test: {
                value: 'Test Value First',
                badge: 5
            }
        });
    };

    function removeAndAdd() {
        data.val.list.splice(1, 1);
    }

    describe('Basic Data Binding Dev Tests', function () {
        describe('Checking if DOM Elements are binded to plain array', function () {
            it('array data correctly when Initialised', function () {
                var list = $template.find('.array');
                testArray(list, testData.val.names);
            });
            it('Remove First array  data correctly when Initialised', function () {
                removeFirstArray();
                var list = $template.find('.array');
                testArray(list, [testData.val.names[0], testData.val.names[2]]);
            });
            it('Add last record in array  data correctly when Initialised', function () {
                addOneArray();
                var list = $template.find('.array');
                testArray(list, [testData.val.names[0], testData.val.names[2], 'TestValue']);
            });
        });
        describe('Checking if DOM Elements are binded to list, and update correctly', function () {
            it('List data are rendered correctly when Initialised', function () {
                var list = $template.find('.bindedlist');
                testRender(list, testData.val.list);
            });
            it('Remove second Item from data, and check if it applied to DOM', function (done) {
                removeFirst();
                var list = $template.find('.bindedlist');
                testRender(list, [testData.val.list[0], testData.val.list[2]]);
                done();
            });
            it('Adding new Item in Array, and check if it applied to DOM', function (done) {
                addOne();
                var list = $template.find('.bindedlist');
                testRender(list, [
                    testData.val.list[0],
                    testData.val.list[2], {
                        test: {
                            value: 'Test Value New',
                            badge: 4
                        }
                    }
                ]);
                done();
            });
            it('Adding extra new Item in Array, and check if it applied to DOM', function (done) {
                addOther();
                var list = $template.find('.bindedlist');
                testRender(list, [
                    {
                        test: {
                            value: 'Test Value First',
                            badge: 5
                        }
                    },
                    testData.val.list[0],
                    testData.val.list[2], {
                        test: {
                            value: 'Test Value New',
                            badge: 4
                        }
                    }
                ]);
                done();
            });
            it('Remove middle Item from Array, and check if it applied to DOM', function (done) {
                removeAndAdd();
                var list = $template.find('.bindedlist');
                testRender(list, [
                    {
                        test: {
                            value: 'Test Value First',
                            badge: 5
                        }
                    }, {
                        test: {
                            value: 'Test Value1',
                            badge: 3
                        }
                    },
                    {
                        test: {
                            value: 'Test Value New',
                            badge: 4
                        }
                    }

                ]);
                done();
            });
        });
        describe('Checking Both way binding for item, when Input is typed, value also are changed', function () {
            var input     = $template.find('input'),
                valueBind = $template.find('.valueBind');
            it('Value should be binded from AppData', function () {
                expect(input).to.have.$val('Some Value');
                expect(valueBind).to.have.$text('Some Value');
            });
            it('Value should changed in input, and also changed in bided element', function (done) {
                input.val('test');
                simulatedEvent(input[0], {type: 'change'});
                setTimeout(function () {
                    expect(valueBind).to.have.$text('test');
                    done();
                }, 100);
            });
            it('Value should be changed, from data changed', function (done) {
                data.val.items.value = 'test Value';
                setTimeout(function () {
                    //expect(input).to.have.$val('test Value'); Need to investigate, how to test this
                    expect(valueBind).to.have.$text('test Value');
                    done();
                }, 100);
            });
        })
    });
});