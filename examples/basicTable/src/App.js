/**
 * Created by guntars on 09/10/2014.
 */
define([
    'widget/App',
    'container/Container',
    'data'
], function(App, Container, data) {
    let rows = data(100);
    return App.extend({

        init:         function() {
            this.context.eventBus.subscribe('startStop', (start)=> {
                if (start) {
                    rows.start();
                } else {
                    rows.stop();
                }
            })
        },
        AppContainer: Container,
        setContext:   function() {
            return {
                data: rows.data
            }
        }
    });
});