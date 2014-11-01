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
            return {data: {
                cmp:{
                    item: 'Binded Item From App'
                }
            }
            }
        }
    });
});