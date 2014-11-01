/**
 * Created by guntars on 09/10/2014.
 */
define([
    'widget/App',
    'widget/parser!container/Container',
], function (App, Container) {

    return App.extend({
        AppContainer: Container,
        setContext: function () {
            return {
                data: {
                    val: {
                        items: {
                            value: 'Some Value'

                        },
                        list: [
                            {
                                test: {
                                    value: 'Test Value',
                                    badge:15
                                }
                            },
                            {
                                test: {
                                    value: 'Test Value1',
                                    badge:17
                                }
                            }
                        ]
                    }
                }
            }
        }
    });
});