define([
    'templating/parser!./sidebar/_sideBar.html',
    'widget/Constructor'
], function (template, Constructor) {
    return Constructor.extend({
        template: template,
        init: function () {
        },
        bind: {
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