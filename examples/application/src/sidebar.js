define([
    'templating/parser!./sidebar/_sidebar.html',
    'widget/Constructor'
], function (template, Constructor) {
    return Constructor.extend({
        template: template,
        init: function () {
        },
        match:function(match){
            var links = this.data.group.links;
            match('/:link').to(function (link, param) {
                links.forEach(function (item) {
                    if (item.link.href.replace('#/', '')===param.getLocation('/' + link)) {
                        item.class = 'active';
                    } else {
                        item.class = 'inactive';
                    }
                }.bind(this));
            }.bind(this)).leave(function(){
                links.forEach(function (item) {
                    item.class = 'inactive';
                }.bind(this));
            }.bind(this));
        }
    });

});