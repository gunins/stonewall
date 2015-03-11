define([
    'templating/parser!./_body.html',
    'widget/Constructor',
    '../resultData'
], function (template, Constructor, data) {
    return Constructor.extend({
        template: template,
        init: function () {
        },
        match: function (match) {
            match('/:tab').to(function (tab, param) {
                this.data.tabs.forEach(function (item) {
                    if (item.link.href.replace('#/', '') === param.getLocation('/' + tab)) {
                        item.class = 'active';
                    } else {
                        item.class = 'idle';
                    }
                }.bind(this));
            }.bind(this)).leave(function () {
                this.data.tabs.forEach(function (item) {
                    item.class = 'idle';
                }.bind(this));
            }.bind(this));

        },
        nodes: {
            results: function (el, parent, data) {
                this.setChildren(el, data);
            }
        }
    });

});