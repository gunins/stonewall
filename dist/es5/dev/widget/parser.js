'use strict';

/**
 * Created by guntars on 11/10/2014.
 */
/*globals setTimeout, define*/
// ### Requirejs plugin
// For to simplify `widget/Constructor` Class
// Usage Example
//
//      `<cp-widget src="widget/parser!widget.html"></cp-widget>`
//
//  This savining to create extra unnecessary javascript file.
//
//      define([
//          'templating/parser!widget.html',
//          'widget/Constructor'
//      ], function (template, Constructor) {
//          var Widget = Constructor.extend({
//              template: template
//          });
//          return Widget;
//      });

define('widget/parser', [], function () {
    function getName(fileName) {
        return (/[.]/.exec(fileName) ? /[^.]+$/.exec(fileName) : undefined
        );
    }

    return {
        version: "0.1.0",
        load: function load(moduleName, req, onLoad, config) {
            moduleName = getName(moduleName) !== undefined ? moduleName : moduleName + '.html';
            define(moduleName, ['templating/parser!' + moduleName, 'widget/Constructor'], function (template, Constructor) {
                var Widget = Constructor.extend({
                    template: template
                });
                return Widget;
            });
            req([moduleName], function (Widget) {
                onLoad(Widget);
            });
        },
        write: function write(pluginName, moduleName, _write) {
            var Name = getName(moduleName) !== undefined ? moduleName : moduleName + '.html';
            _write('define("' + pluginName + '!' + moduleName + '", ' + '[' + '"templating/parser!' + Name + '",' + '"widget/Constructor"' + '], function(template, Constructor){ return Constructor.extend({' + 'template: template' + '});' + '});\n');
        }
    };
});
//# sourceMappingURL=parser.js.map
