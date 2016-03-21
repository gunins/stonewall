/**
 * Created by guntars on 29/10/14.
 */
define([
    'widget/Constructor',
    'templating/parser!./_list.html',
], function (Constructor, template) {
    return Constructor.extend({
        template: template,
        elReady:  {
            item: function (el, data) {
                var items = this.data.items;
                el.eventBus.subscribe('remove', function () {
                    var index = items.indexOf(data);
                    items.splice(index, 1);
                });
            }
        }
    });
});