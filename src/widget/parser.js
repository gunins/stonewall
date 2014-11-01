define(function () {
    function getName(fileName) {
        return (/[.]/.exec(fileName)) ? /[^.]+$/.exec(fileName) : undefined;
    }

    return {
        version: "0.1.0",
        load: function (moduleName, req, onLoad, config) {
            moduleName = (getName(moduleName) !== undefined) ? moduleName : moduleName + '.html';
            if (config.isBuild) {
                //don't do anything if this is a build, can't inline a web worker
                req([
                    'templating/parser!' + moduleName,
                ], function (template) {
                    template;
                    onLoad();
                })
                return;
            }
            req([
                'templating/parser!' + moduleName,
                'widget/Constructor'
            ], function (template, Constructor) {
                var Widget = Constructor.extend({
                    template: template
                });
                onLoad(Widget);
            });
        },
        write: function (pluginName, moduleName, write) {
            var Name = (getName(moduleName) !== undefined) ? moduleName : moduleName + '.html';
            write('define("' + pluginName + '!' + moduleName + '", ' +
                  '[' +
                  '"templating/parser!' + Name + '",' +
                  '"widget/Constructor"' +
                  '], function(template, Constructor){ return Constructor.extend({' +
                  'template: template' +
                  '});' +
                  '});\n');
        }
    }
});