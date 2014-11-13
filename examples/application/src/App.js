/**
 * Created by guntars on 09/10/2014.
 */
define([
    'widget/App',
    'widget/parser!container/Container',
    'data',
    './Model'
], function (App, Container, data, model) {

    return App.extend({
        beforeInit: function (data, children) {
            this.context.eventBus.subscribe('searchvValue', function (value) {

            }.bind(this));

        },
        init: function () {
            model(data);
        },
        AppContainer: Container,
        setContext: function () {
            return {data: data}
        }
    });
});