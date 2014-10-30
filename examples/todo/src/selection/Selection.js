/**
 * Created by guntars on 30/10/14.
 */
define([
    'widget/Constructor',
    'templating/parser!./_selection.html'
], function (Constructor, template) {
    return Constructor.extend({
        template: template,
        init: function () {
            this._active = this.data.buttons[0]
        },
        events: {
            buttons: [
                {
                    name: 'click',
                    action: function (e, el, data) {
                        this._active.class = 'none'
                        data.class = 'active'
                        this._active = data;
                        this.context.eventBus.publish('itemShow', data.text);
                    }
                }
            ]
        }
    });
});