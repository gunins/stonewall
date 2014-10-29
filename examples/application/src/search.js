/*globals console*/
define([
    'templating/parser!./search/_search.html',
    'widget/Constructor'
], function (template, Constructor) {
    return Constructor.extend({
        template: template,
        init: function (data, children) {
        },
        events: {
            form: [
                {
                    name: 'submit',
                    action: function (e) {
                        e.preventDefault();
                    }
                }
            ],
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