/**
 * Created by guntars on 18/11/14.
 */
define([
    'widget/Constructor',
    'templating/parser!./_results.html'
], function (Constructor, template) {
    return Constructor.extend({
        template: template,
    });
});