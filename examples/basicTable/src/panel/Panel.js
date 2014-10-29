/**
 * Created by guntars on 12/10/2014.
 */
define([
    'templating/parser!./_panel.html',
    'widget/Constructor'
], function (template, Constructor) {
    return Constructor.extend({
        template: template
    });
});