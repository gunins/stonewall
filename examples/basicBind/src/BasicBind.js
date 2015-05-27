/**
 * Created by guntars on 09/10/2014.
 */
define([
    'widget/App',
    'container/Container'
], function (App, Container) {
    var badge = 1;
    var data  = {
        val: {
            items: {
                value: 'Some Value'

            },
            list:  [
                {
                    test: {
                        value: 'Test Value',
                        badge: badge++
                    }
                },
                {
                    test: {
                        value: 'Test Inner',
                        badge: badge++
                    }
                },
                {
                    test: {
                        value: 'Test Value1',
                        badge: badge++
                    }
                }
            ]
        }
    };

    function changeValues() {
        setTimeout(function () {
            data.val.newitem = {
                value: 'Delay Value'
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
                    badge: badge++
                }
            });
        }, 3000);
        setTimeout(function () {
            data.val.list.unshift({
                test: {
                    value: 'Test Value v',
                    badge: badge++
                }
            });
        }, 4000);

        setTimeout(function () {
            data.val.list.splice(2, 1, {
                test: {
                    value: 'Test Value Third',
                    badge: badge++
                }
            }, {
                test: {
                    value: 'Test Value Fourth',
                    badge: badge++
                }
            });
        }, 5000);
        setTimeout(function () {
            data.val.list.concat([
                {
                    test: {
                        value: 'Test Value Third',
                        badge: badge++
                    }
                }, {
                    test: {
                        value: 'Test Value Fourth',
                        badge: badge++
                    }
                }
            ], [
                {
                    test: {
                        value: 'Test Value Third',
                        badge: badge++
                    }
                }, {
                    test: {
                        value: 'Test Value Fourth',
                        badge: badge++
                    }
                }
            ]);
        }, 6000);
    }

    return App.extend({
        AppContainer: Container,
        init:         function () {
            this.context.eventBus.subscribe('changeValues', changeValues);
        },
        setContext:   function () {
            return {
                data: data
            }
        }
    });
});