/**
 * Created by guntars on 14/04/2016.
 */
define([
    'widget/Constructor',
    'templating/parser!./_table.html'
], function(Constructor, template) {
    'use strict';

    return Constructor.extend({
        template: template,
        elReady:  {
            tooltip: function(el, data) {
                this.eventBus.subscribe('over', function(over, obj) {
                    if (obj.tooltip === data) {
                        if (over) {
                            el.addClass('fadein');
                        } else {
                            el.removeClass('fadein');

                        }
                    }
                });
                this.eventBus.subscribe('move', function(over, obj) {
                    if (obj.tooltip === data) {
                        if (over) {
                            el.setStyle({
                                top:  over.offsetY + 'px',
                                left: over.offsetX + 'px'
                            });
                        }
                    }
                });
            }
        },
        events:   {
            value: [{
                name:   'mouseenter',
                action: function(e, el, data) {
                    this.eventBus.publish('over', true, data);
                }
            }, {
                name:   'mouseleave',
                action: function(e, el, data) {
                    this.eventBus.publish('over', false, data);
                }
            }, /*{
                name:   'mousemove',
                action: function(e, el, data) {
                    this.eventBus.publish('move', {
                        offsetX: e.offsetX,
                        offsetY: e.offsetY
                    }, data);
                }
            }*/]
        }
    });
});