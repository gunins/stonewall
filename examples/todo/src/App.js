/**
 * Created by guntars on 09/10/2014.
 */
define([
    'widget/App',
    'widget/parser!container/Container',
    'data',
    'watch'
], function(App, Container, data, WatchJS) {
    var watch = WatchJS.watch;


    return App.extend({
        beforeInit:   function() {
            this.selection = '';
        },
        init:         function() {
            this.context.eventBus.subscribe('itemShow', this.itemShow.bind(this));
            this.context.eventBus.subscribe('addRecord', this.addRecord.bind(this));
        },
        AppContainer: Container,
        setContext:   function() {
            return {
                data: data
            }
        },
        itemShow:     function(selection) {
            if (selection) {
                this.selection = selection;
            }
            data.tasks.items.forEach(function(node) {
                var checked = node.completed.checked;
                switch (this.selection) {
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
            }.bind(this));
        },
        addRecord:    function(record) {
            var item = {
                value:     record,
                completed: {
                    checked: false
                },
                show:      this.selection !== 'Completed' ? 'show' : 'hide'
            };
            data.tasks.items.unshift(item);
        }
    });
});