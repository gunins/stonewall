/**
 * Created by guntars on 09/10/2014.
 */
define([
    'widget/App',
    'widget/parser!container/Container',
    'data',
    'watch'
], function (App, Container, data, WatchJS) {
    var watch = WatchJS.watch;


    return App.extend({

        init:         function () {
            this.context.eventBus.subscribe('itemShow', this.itemShow.bind(this));
            this.context.eventBus.subscribe('addRecord', this.addRecord.bind(this));
        },
        AppContainer: Container,
        setContext:   function () {
            return {
                data: data
            }
        },
        itemShow:     function (selection) {
            data.tasks.items.forEach(function (node) {
                var checked = node.completed.checked;
                switch (selection) {
                    case 'Active':
                        if (checked !== true) {
                            node.show = 'show';
                        } else {
                            node.show = 'hide';
                        }
                        break;
                    case 'Completed':
                        if (checked === true) {
                            node.show = 'show';
                        } else {
                            node.show = 'hide';
                        }
                        break;
                    default:
                        node.show = 'show';
                        break;

                }
            });
        },
        addRecord:    function (record) {
            var item = {
                value:     record,
                completed: {
                    checked: false
                },
                show:      'show'
            };
            data.tasks.items.unshift(item);
        }
    });
});