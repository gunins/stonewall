/**
 * Created by guntars on 29/10/14.
 */
define([
    'widget/Constructor',
    'templating/parser!./_item.html'
], function (Constructor, template) {
    return Constructor.extend({
        template: template,
        events:   {
            delete:    [
                {
                    name:   'click',
                    action: function () {
                        this.eventBus.publish('remove', this.data);
                    }
                }
            ],
            completed: [
                {
                    name:   'click',
                    action: function (e, el, data) {
                        data.checked = !data.checked;
                    }
                }
            ]
        }
    });
});