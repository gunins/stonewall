define([
    'templating/parser!./piechart/_piechart.html',
    './piechart/pied3',
    'widget/Constructor'
], function (template, Pie, Constructor) {
    return Constructor.extend({
        template: template,
        init: function (data, children) {
        },
        elReady: {
            chartcontent: function (el, data) {
                var pie = new Pie();
                pie.start(el, data);
            }
        }
    })

});