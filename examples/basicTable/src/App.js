/**
 * Created by guntars on 09/10/2014.
 */
define([
    'widget/App',
    'widget/parser!container/Container',
    'data'
], function (App, Container, data) {

    return App.extend({

        init: function () {

        },
        AppContainer: Container,
        setContext: function () {
            return {
                data: data
            }
        }
    });
});