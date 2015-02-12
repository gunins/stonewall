/**
 * Created by guntars on 11/02/15.
 */
define([
    'widget/Constructor',
    'templating/parser!./_hierarchy.html',
    './HierarchyWebGL'
], function (Constructor, template, Hierarchy) {
    'use strict';
    return Constructor.extend({
        template: template,
        elReady: {
            container: function (el) {
                setTimeout(function () {
                    new Hierarchy(el.el);
                }, 50)
            }
        }
    });
});