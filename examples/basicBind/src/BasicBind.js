/**
 * Created by guntars on 09/10/2014.
 */
define([
    'widget/App',
    'container/Container'
], function (App, Container) {
    var data = {
        val: {
            items: {
                value: 'Some Value'

            },
            list: [
                {
                    test: {
                        value: 'Test Value',
                        badge: 1
                    }
                },
                {
                    test: {
                        value: 'Test Inner',
                        badge: 2
                    }
                },
                {
                    test: {
                        value: 'Test Value1',
                        badge: 3
                    }
                }
            ]
        }
    };

    function changeValues() {
        setTimeout(function () {
            data.val.newitem = {
                value:'Delay Value'
            };
        }, 1000);
        setTimeout(function () {
            data.val.newitem.value = 'New Delay Value'
        }, 2000);

        setTimeout(function () {
            data.val.list.splice(0, 1);
        }, 2000);
        setTimeout(function () {
            data.val.items.value = 'test Value';
        }, 2000);

        setTimeout(function () {
            data.val.list.push({
                test: {
                    value: 'Test Value New',
                    badge: 4
                }
            });
        }, 3000);
        setTimeout(function () {
            data.val.list.push({
                test: {
                    value: 'Test Value New2',
                    badge: 5
                }
            });
        }, 4000);

        setTimeout(function () {
            data.val.list.splice(1, 1);
        }, 5000);
    }

    return App.extend({
        AppContainer: Container,
        init: function () {
            this.context.eventBus.subscribe('changeValues', changeValues);
        },
        setContext: function () {
            return {
                data: data
            }
        }
    });
});