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
            names: [
                "email",
                "truthy",
                "imsi"
            ],
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
            data.val.names.splice(1, 1);
        }, 1000);
        setTimeout(function () {
            data.val.names.push('one', 'two');
        }, 2000);
        setTimeout(function () {
            data.val.names.unshift('onTop');
        }, 3000);

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
            data.val.list.reverse();
        }, 6000);

        setTimeout(function () {
            data.val.list.sort(function (prev, next) {
                if (prev.test.badge > next.test.badge) {
                    return 1;
                }
                if (prev.test.badge < next.test.badge) {
                    return -1;
                }
                // a must be equal to b
                return 0;
            });
            console.log(data.val.list)
        }, 7000);

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