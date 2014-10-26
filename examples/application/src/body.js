define([
    'templating/parser!./body/_body.html',
    'widget/Constructor',
    'widget/dom'
], function (template, Constructor, dom) {

    return Constructor.extend({
        template: template,
        nodes: {
            'page-header': function (element, fragment) {
                element.append(fragment);
            }
        },
        init: function (data, children) {
        }
    });

});