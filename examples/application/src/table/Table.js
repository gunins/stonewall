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
                    action: function (e, node) {
                        node.warning = node.warning || false;
                        if (!node.warning) {
                            node.warning = true;
                            node.addClass('warning');
                        } else {
                            node.warning = false;
                            node.removeClass('warning');

                        }
                    }
                }
            ]

        },
        nodes: {
            header: function (el, parent) {
                el.replace(parent);
                this.applyBinders(this.data, parent);
            },
            value: function (el, parent, data) {
                el.add(parent);
                el.text(data.text);
                el.setStyle('color', data.color);
                watch(data, "text", function () {
                    el.text(data.text);
                });
            }
        },
        elReady: {
            tbody: function (el, data) {
                el.addClass(data.class);
            }
        }

    });

});