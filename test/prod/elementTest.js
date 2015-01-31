define([
    'widget/dom',
    'Element'
], function (dom, element) {
    'use strict';

    var expect, container, el, input, target, instance;
    expect = chai.expect;

    instance = element.render();

    container = document.createElement('div');
    var $container = $(container);

    describe('Element Dev Tests', function () {

        describe('Testing Element Methods', function () {
            beforeEach(function () {
                $container.html('');
                container.appendChild(instance.fragment);

                el = new dom.Element(instance.children.element);
                input = new dom.Element(instance.children.input);

            });
            it('Testing method "append"');
            it('Testing method "replace"');
            it('Testing method "text"', function () {
                var str = 'Some crazy Text';
                var str2 = 'Some other Crazy';
                el.text(str);
                expect($container).to.contain.$text(str);
                expect($container).not.to.contain.$text(str2);
                el.text(str2);
                expect($container).to.contain.$text(str2);
                expect($container).not.to.contain.$text(str);

            });
            it('Testing method "add"');
            it('Testing method "detach"');
            it('Testing method "attach"');
            it('Testing method "setAttribute"', function () {
                el.setAttribute('data-test', 'test');
                el.setAttribute({'data-testa': 'testa'});
                expect($(el.el)).to.have.$attr('data-test', 'test');
                expect($(el.el)).to.have.$attr('data-testa', 'testa');
            });
            it('Testing method "removeAttribute"', function () {
                el.setAttribute('data-test', 'test');
                el.setAttribute('data-testa', 'testa');
                expect($(el.el)).to.have.$attr('data-test', 'test');
                expect($(el.el)).to.have.$attr('data-testa', 'testa');

                el.removeAttribute('data-test');
                expect($(el.el)).not.to.have.$attr('data-test', 'test');
                expect($(el.el)).to.have.$attr('data-testa', 'testa');
                el.removeAttribute('data-testa');
                expect($(el.el)).not.to.have.$attr('data-test', 'test');
                expect($(el.el)).not.to.have.$attr('data-testa', 'testa');

            });
            it('Testing method "setStyle"', function () {

                el.setStyle('margin-left', '10px');
                el.setStyle({'margin-right': '15px'});
                expect($(el.el)).to.have.$css('margin-left', '10px');
                expect($(el.el)).to.have.$css('margin-right', '15px');

            });
            it('Testing method "removeStyle"', function () {

                el.setStyle({'margin-right': '15px'});
                el.setStyle('margin-left', '10px');
                expect($(el.el)).to.have.$css('margin-left', '10px');
                expect($(el.el)).to.have.$css('margin-right', '15px');

                el.removeStyle('margin-left');
                expect($(el.el)).not.to.have.$css('margin-left', '10px');
                expect($(el.el)).to.have.$css('margin-right', '15px');

                el.removeStyle('margin-right');
                expect($(el.el)).not.to.have.$css('margin-left', '10px');
                expect($(el.el)).not.to.have.$css('margin-right', '15px');

            });
            it('Testing method "addClass"', function () {
                el.addClass('testClass');
                expect($(el.el)).to.have.$class('testClass');
            });
            it('Testing method "removeClass"', function () {
                el.addClass('testClass');
                expect($(el.el)).to.have.$class('testClass');
                el.removeClass('testClass');
                expect($(el.el)).not.to.have.$class('testClass');

            });
            it('Testing method "val"', function () {
                expect(input.val()).to.equal('test');

                input.val('vasja');

                expect(input.val()).to.equal('vasja');
            });
            it('Testing method "on"', function (done) {
                var a = 5;
                var evt = el.on('click', function (e) {
                    a = 10
                    expect(a).to.equal(10);
                    evt.remove();
                    done()
                });
                simulatedEvent(el.el, {type: 'click'});
            });

            it('Testing method "on" remove()', function (done) {
                var a = 5;
                var evt = el.on('click', function (e) {
                    a += 5;
                    expect(a).to.equal(10);
                });
                simulatedEvent(el.el, {type: 'click'});
                evt.remove();
                simulatedEvent(el.el, {type: 'click'});
                setTimeout(function () {
                    expect(a).to.equal(10);
                    done();
                }, 50);

            });
            it('Testing method "remove"', function () {
                expect($container.find('.testElement').length).to.equal(1);
                el.remove();
                expect($container.find('.testElement').length).to.equal(0);

            });
        });
    });
});