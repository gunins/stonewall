define([
    'templating/parser!./_table.html',
    'widget/Constructor',
    'watch'
], function (template, Constructor, WatchJS) {
    var watch = WatchJS.watch;

    return Constructor.extend({
        template: template,
        init: function () {
        },
        events: {
            tbody: [
                {
                    name: 'click',
                    action: function (e, data) {
                        data.warning = data.warning || false;
                        if (!data.warning) {
                            data.warning = true;
                            data.addClass('warning');
                        } else {
                            data.warning = false;
                            data.removeClass('warning');

                        }
                    }
                }
            ]

        },
        elReady: {

            value: function (el, data) {
                el.text(data.text);
                el.setStyle('color', data.color);
                watch(data, "text", function () {
                    el.text(data.text);
                });
            },
            tbody: function (el, data) {
                el.addClass(data.class);
            }
        }

    });

});