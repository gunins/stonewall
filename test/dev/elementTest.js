define([
    'widget/dom',
    'Element'
], function (dom, element) {
    'use strict';

    var expect, container, el, input, child, childContainer, instance;
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
                childContainer = new dom.Element(instance.children.childcontainer);
                child = new dom.Element(instance.children.child);
                child.applyAttach();
                input = new dom.Element(instance.children.input);

            });
            it('Testing method "add"', function () {
                child.add(container);
                var $child = $(child.el);
                $child.children().removeAttr('class');
                expect($(instance.fragment).find('.childElement')).to.have.$class('childElement');
                expect($(instance.fragment).find('.childElement')).to.have.$html('<span>Child Content</span>');
            });

            it('Testing method "_append"', function () {
                childContainer._append(child);
                var $child = $(childContainer.el).children();
                $child.removeAttr('class');
                expect($(childContainer.el)).to.have.$html('<span>Child Content</span>');
            });
            it('Testing method "replace"', function () {
                childContainer.replace(child);
                var $child = $(childContainer.el).children();
                $child.removeAttr('class');
                expect($(childContainer.el)).to.have.$html('<span>Child Content</span>');
            });
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
            it('Testing method "detach" and "attach"', function () {
                expect($container.find('.testElement').length).to.equal(1);
                el.detach();
                expect($container.find('.testElement').length).to.equal(0);
                el.attach();
                expect($container.find('.testElement').length).to.equal(1);
            });
            it('Testing method "setAttribute"', function () {
                el.setAttribute('data-test', 'test');
                el.setAttribute({'data-testa': 'testa'});
                expect($(el.el)).to.have.$attr('data-test', 'test');
                expect($(el.el)).to.have.$attr('data-testa', 'testa');
            });
            it('Testing method "getAttribute"', function () {
                $(el.el).attr('title', 'test');
                el.setAttribute('data-test', 'testa');
                expect(el.getAttribute('title')).to.equal('test');
                expect(el.getAttribute('data-test')).to.equal('testa');
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
            it('Testing method "getStyle"', function () {
                $(el.el).css('margin-left', '10px');
                el.setStyle({'margin-right': '15px'});
                expect(el.getStyle('margin-left')).to.equal('10px');
                expect(el.getStyle('margin-right')).to.equal('15px');

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
            it('Testing method "hasClass"', function () {
                $(el.el).addClass('testClass');
                expect(el.hasClass('testClass')).to.be.true;
                expect(el.hasClass('testClassB')).to.be.false;
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
                }, 200);

            });
            it('Testing method "remove"', function () {
                expect($container.find('.testElement').length).to.equal(1);
                el.remove();
                expect($container.find('.testElement').length).to.equal(0);

            });
            it('Testing method "onDOMAttached"', function (done) {

                el.onDOMAttached().then(function () {
                    expect(document.body.contains(el.el)).to.be.true;
                    done();
                });
                expect(document.body.contains(el.el)).to.be.false;

                setTimeout(function () {
                    $(el.el).appendTo('body');
                }, 200);

            });
        });
    });
});