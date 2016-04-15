/* globals describe, it, expect, beforeEach */
define([
    'templating/Decoder',
    'Basic'
], function (Decoder, App) {
    var expect, container, app;

    expect = chai.expect;

    container = document.createElement('div');
    var $container = $(container);

    $container.css('opacity', 0).appendTo('body');

    app = new App();
    app.start(container);

    var $template = $container.children();
    describe('Basic App Tests Dev environment', function () {
        describe('Testing app rendered structure', function () {
            it('data in context defined and available', function () {
                var data = app.context.data;
                expect(data).to.deep.equal({
                    cmp: {
                        item: {
                            inner:'Binded Item From App',
                            class:'binded'

                        },
                        list:['a','b','c'],
                        lista:[
                            {
                                innera:'Binded Item From App1',
                                class:'listIn'

                            },
                            {
                                innera:'Binded Item From App2',
                                class:'listIn2'

                            }
                        ]
                    }
                });
                expect(app.appContainer.context.data).to.equal(data);
                expect(app.el).to.equal(container);
            });
        });
        describe('Test HTML and css structure rendered as expected', function () {
            describe('Test How Container is rendered', function () {

                it('Check if Root Element Items are rendered correctly', function () {
                    expect($template).to.have.$class('container-fluid');
                });
                it('Check if panel-heading are rendered correctly and css are applied', function () {
                    var el = $template.find('.panel-heading');
                    expect(el).to.have.$html('Basic Example');
                    expect(el).to.have.$css('color', 'rgb(0, 119, 0)');
                });
                it('Check if HTML for other component are rendered correctly and css are applied', function () {
                    var el = $template.find('.testCustom');
                    expect(el).to.have.$html('Body From Parent Container');
                    expect(el).to.have.$css('color', 'rgb(198, 0, 0)');
                });
            });
            describe('Check if Component ir rendered', function () {

                it('Check if paragraph are rendered correctly and css are applied', function () {
                    var el = $template.find('.cmpP');
                    expect(el).to.have.$html('sample text');
                    expect(el).to.have.$css('color', 'rgb(45, 85, 246)');
                });

                it('Check if image are rendered correctly and attribute', function () {
                    var el = $template.find('img');
                    expect(el).to.have.$attr('src', 'images/board.png');
                });

                it('Check if Header are rendered correctly, css are applied, and content taked from Container', function () {
                    var el = $template.find('h4');
                    expect(el).to.have.$html('Header From Parent Container');
                    expect(el).to.have.$css('color', 'rgb(255, 255, 255)');
                });

                it('Check if Binder are rendered correctly, css are applied, and content taked from App data', function () {
                    var el = $template.find('.binded');
                    expect(el.find('div')).to.have.$html('Binded Item From App');
                    expect(el).to.have.$css('color', 'rgb(200, 200, 200)');
                });
            });
        });

    });
});