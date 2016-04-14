/**
 * Created by guntars on 14/04/2016.
 */
define([
    'widget/Constructor',
    'templating/parser!./_start.html'
], function(Constructor, template) {
    'use strict';

    return Constructor.extend({
        template: template,
        events:   {
            start: [{
                name:   'click',
                action: function() {
                    this.context.eventBus.publish('startStop', true);
                }
            }],
            stop: [{
                name:   'click',
                action: function() {
                    this.context.eventBus.publish('startStop', false);
                }
            }]
        }
    });
});