/* globals describe, it, expect, beforeEach */
define([
    'templating/Decoder',
    'Basic'
], function (Decoder, App) {
    var expect, container, app;

    expect = chai.expect;

    container = document.createElement('div');
    app = new App();

    app.start(container);
    var $container = $(container),
        $template = $container.children();
    describe('Basic App Tests', function () {
        describe('Testing app rendered structure', function () {
            it('data in context defined and available', function () {
                var data = app.context.data;
                expect(data).to.deep.equal({
                    cmp: {
                        item: 'Binded Item From App'
                    }
                });
                expect(app.appContainer.context.data).to.equal(data);
                expect(app.el).to.equal(app.appContainer.el);
            });
            it('Check if all Items are rendered correctly', function () {
                expect($template).to.have.class('container-fluid');
            });
        });

    });
});

/*
 *

 <div>
     <div class="tid_14212355870340 container-fluid show">
        <div class="tid_14212355870340 col-xs-6 col-sm-3">
            <div class="tid_14212355870340 panel panel-default">
                <div class="tid_14212355870340 panel-heading">Basic Example</div>
                <div class="tid_14212355870340 panel-body">
                    <div class="tid_14212355870722 container-fluid cmp">
                       <h2 class="tid_14212355870722">Header From Parent Container</h2>
                       <p class="tid_14212355870722">sample text</p>
                      <div class="tid_14212355870722">
                           <p class="tid_14212355870340">Body From Parent Container</p>
                        </div>
                        <div class="tid_14212355870722">Binded Item From App</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
 </div>
 * */