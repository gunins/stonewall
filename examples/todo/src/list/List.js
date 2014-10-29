/**
 * Created by guntars on 29/10/14.
 */
define([
    'widget/Constructor',
    'templating/parser!./_list.html',
    'watch'
], function (Constructor, template, WatchJS) {
    var watch = WatchJS.watch;
    return Constructor.extend({
        template: template,
        init: function () {
        },
        elReady: {
            items: function (el, data) {
                watch(data.item, 'remove', function () {
                    el.remove();
                    var index = this.data.items.indexOf(data);
                    this.data.items.splice(index, 1);
                }.bind(this));
            }
        }
    });
});