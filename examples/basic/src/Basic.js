/**
 * Created by guntars on 09/10/2014.
 */
define([
    'widget/App',
    'widget/parser!./container/Container'
], function (App, Container) {
    'use strict';

    return App.extend({
        AppContainer: Container,
        init: function () {
        },
        setContext:   function () {
            return {
                data: {
                    cmp: {
                        item: 'Binded Item From App'
                    }
                }
            }
        }
    });
});