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
                        item: {
                            inner:'Binded Item From App',
                            class:'binded'

                        },
                        list:['a','b','c'],
                        lista:[
                            {
                                innera:'Binded Item From App1',
                                class:'listIn'

                            },
                            {
                                innera:'Binded Item From App2',
                                class:'listIn2'

                            }
                        ]
                    }
                }
            }
        }
    });
});