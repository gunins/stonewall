/**
 * Created by guntars on 29/10/14.
 */
define([
    'templating/parser!./_input.html',
    'widget/Constructor'
],function (template, Constructor) {
    return Constructor.extend({
        template:template
    });
});