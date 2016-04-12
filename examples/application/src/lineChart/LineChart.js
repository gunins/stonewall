define([
    'templating/parser!./_lineChart.html',
    './LineChartD3',
    'widget/Constructor',
    'watch'
], function(template, Chart, Constructor, WartchJs) {
    var watch = WartchJs.watch;
    return Constructor.extend({
        template: template,
        init:     function(data, children) {
        },
        elReady:  {
            content: function(el, data) {
                el.onDOMAttached().then(function() {
                    var chart = new Chart();
                    chart.start(el, data);
                });
            }
        }
    })

});