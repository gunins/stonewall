/**
 * Created by guntars on 09/10/2014.
 */
define([
    'widget/App',
    'container',
    'data',
    './Model'
], function (App, Container, data, model) {

    return App.extend({
        beforeInit: function (data, children) {
            this.context.eventBus.subscribe('searchvValue', function (value) {
                this.context.data.table.firstname = value;
            }.bind(this));

            var active = false;
            this.context.eventBus.subscribe('setActive', function (data) {
                active = data;
            }.bind(this));

            this.context.eventBus.subscribe('removeActive', function (data) {
                if (active) {
                    active.class = 'inactive';
                }
                data.class = 'active';
                active = data;
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