define([
    'templating/parser!./piechart/_piechart.html',
    './piechart/pied3',
    'widget/Constructor',
    'watch'
], function (template, Pie, Constructor, WartchJs) {
    var watch = WartchJs.watch;
    return Constructor.extend({
        template: template,
        init: function (data, children) {
        },
        nodes: {
            chartcontent: function (el, parent, data) {
                el.add(parent);
                var pie = new Pie();
                pie.start(el, data);
            }
        }
    })

});