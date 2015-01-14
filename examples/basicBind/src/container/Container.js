/**
 * Created by guntars on 14/01/15.
 */
define([
    'widget/Constructor',
    'templating/parser!./_container.html'
], function (Constructor, template) {
    'use strict';

    return Constructor.extend({
        template: template,
        events: {
            btn: [
                {
                    name: 'click',
                    action: function () {
                        this.context.eventBus.publish('changeValues')
                    }
                }
            ]
        }
    });
});