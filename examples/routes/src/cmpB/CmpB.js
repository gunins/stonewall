/**
 * Created by guntars on 10/11/14.
 */
define([
    'widget/Constructor',
    'templating/parser!./_cmpB.html'
], function (Constructor, template) {
    'use strict';
    return Constructor.extend({
        template: template
    });
});