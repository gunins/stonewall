define([
    'templating/parser!./_table.html',
    'widget/Constructor',
], function (template, Constructor) {

    return Constructor.extend({
        template: template

    });

});