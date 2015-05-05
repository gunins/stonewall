define([
    'templating/parser!./_lineChart.html',
    './LineChartD3',
    'widget/Constructor',
    'watch'
], function (template, Chart, Constructor, WartchJs) {
    var watch = WartchJs.watch;
    return Constructor.extend({
        template: template,
        init:     function (data, children) {
        },
        nodes:    {
            content: function (el, parent, data) {
                el.add(parent);
                el.onDOMAttached().then(function () {
                    var chart = new Chart();
                    chart.start(el, data);
                });
            }
        }
    })

});