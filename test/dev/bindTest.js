/* globals describe, it, expect, beforeEach */
define([
    'templating/Decoder',
    'BasicBind'
], function (Decoder, App) {
    var expect, container, app;

    expect = chai.expect;

    container = document.createElement('div');
    app = new App();

    app.start(container);

    describe('Basic Data Binding test Tests', function () {
        describe('Testing app rendered structure', function () {
            it('data in context defined and available', function () {
                expect(app.context.data).to.deep.equal({
                    val: {
                        items: {
                            value: 'Some Value'

                        },
                        list: [
                            {
                                test: {
                                    value: 'Test Value',
                                    badge: 15
                                }
                            },
                            {
                                test: {
                                    value: 'Test Value1',
                                    badge: 17
                                }
                            }
                        ]
                    }
                });
            });
        });

    });
});