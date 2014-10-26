define([
    'templating/parser!./charts/_charts.html',
    'widget/Constructor'
], function (template, Constructor) {
    return Constructor.extend({
        template: template
    })

});