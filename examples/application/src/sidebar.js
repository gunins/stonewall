define([
    'templating/parser!./sidebar/_sidebar.html',
    'widget/Constructor'
], function (template, Constructor) {
    return Constructor.extend({
        template: template,
        init: function () {
        },
        elReady: {
            links: function (el, data) {
                if(data.class==='active'){
                    this.context.eventBus.publish('setActive', data);
                }
            }
        },
        events: {
            links: [
                {
                    name: 'click',
                    action: function (e, el, data) {
                        this.context.eventBus.publish('removeActive', data);
                    }
                }
            ]
        }
    });

});