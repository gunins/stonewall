define([
    'templating/parser!./search/_search.html',
    'widget/Constructor'
], function (template, Constructor) {
    return Constructor.extend({
        template: template,
        init: function (data, children) {
        },
        events: {
            input: [
                {
                    name: 'change',
                    action: function (e, el) {
                        this.context.eventBus.publish('searchvValue', el.val());
                    }
                }
            ]
        }
    })

});