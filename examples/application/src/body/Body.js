define([
    'templating/parser!./_body.html',
    'widget/Constructor',
    'results/Results'
], function (template, Constructor, Results) {
    return Constructor.extend({
        template: template,
        init: function () {
            console.log(this.data);
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
        elReady: {
            resultsholder: function (container) {
                console.log(container.el);
                this.addComponent(Results, {
                        name: 'results',
                        bind: 'results',
                        data: this.data,
                        container: container
                    });

            }
        }
    });

});