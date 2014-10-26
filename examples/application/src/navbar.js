define([
    'templating/parser!./navbar/_navBar.html',
    'widget/Constructor'
], function (template, Constructor) {
    return Constructor.extend({
        template: template
    });

});