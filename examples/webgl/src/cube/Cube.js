/**
 * Created by guntars on 11/02/15.
 */
define([
    'widget/Constructor',
    'templating/parser!./_cube.html',
    './CubeWebGL'
], function (Constructor, template, Cube) {
    'use strict';
    return Constructor.extend({
        template: template,
        elReady: {
            cube: function (el) {
                setTimeout(function () {
                    new Cube(el.el);
                }, 200)
            }
        }
    });
});