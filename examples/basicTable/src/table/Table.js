/**
 * Created by guntars on 14/04/2016.
 */
define([
    'widget/Constructor',
    'templating/parser!./_table.html'
], function(Constructor, template) {
    'use strict';
    function getCoords(elem, body) {
        let box = elem.el.getBoundingClientRect(),
            scrollTop = body.scrollTop,
            scrollLeft = body.scrollLeft,
            clientTop = body.clientTop || 0,
            clientLeft = body.clientLeft || 0,
            top = box.top + scrollTop - clientTop,
            left = box.left + scrollLeft - clientLeft;

        return {top: Math.round(top), left: Math.round(left)};
    }

    return Constructor.extend({
        template:   template,
        elReady:    {
            tooltip:         function(el) {
                this.eventBus.subscribe('over', function(over) {
                    if (over) {
                        el.addClass('fadein');
                    } else {
                        el.removeClass('fadein');

                    }
                });
                this.eventBus.subscribe('move', function(over) {
                    el.setStyle({
                        left: over.pageX + 'px',
                        top:  over.pageY + 'px'
                    });
                });
            },
            tooltip_content: function(el) {
                this.eventBus.subscribe('change', function(data) {
                    if (el._data !== data) {
                        el.text(data);
                        el._data = data;
                    }
                });
            }
        },
        elOnChange: {
            value: function(el, data) {
                if (this._active == el) {
                    this.eventBus.publish('change', data.tooltip)
                }

            }
        },
        events:     {
            value: [{
                name:   'mouseenter',
                action: function(e, el, data) {
                    this._active = el;
                    this.eventBus.publish('over', true, data.tooltip);
                    this.eventBus.publish('change', data.tooltip)
                }
            }, {
                name:   'mouseleave',
                action: function(el) {
                    this.eventBus.publish('over', false);
                }
            }],
            root:  [{
                name:   'mousemove',
                action: function(e, el) {
                    var offset = getCoords(el, this.context.container);
                    this.eventBus.publish('move', {
                        pageX: e.pageX - offset.left + 10,
                        pageY: e.pageY - offset.top - 10
                    });
                }
            }]
        }
    });
});