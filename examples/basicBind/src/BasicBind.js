/**
 * Created by guntars on 09/10/2014.
 */
define([
    'widget/App',
    'widget/parser!container/Container',
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
                        badge: 15
                    }
                },
                {
                    test: {
                        value: 'Test Value1',
                        badge: 17
                    }
                }
            ]
        }
    };
    setTimeout(function () {
        data.val.list.splice(0, 1);
    }, 2000);

    setTimeout(function () {
        data.val.list.push({
            test: {
                value: 'Test Value New',
                badge: 16
            }
        });
    }, 3000);
    setTimeout(function () {
        data.val.list.push({
            test: {
                value: 'Test Value New2',
                badge: 18
            }
        });
    }, 4000);

    setTimeout(function () {
        data.val.list.splice(1, 1);
    }, 5000);

    return App.extend({
        AppContainer: Container,
        setContext: function () {
            return {
                data: data
            }
        }
    });
});