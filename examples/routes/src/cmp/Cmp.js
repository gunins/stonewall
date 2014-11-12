/**
 * Created by guntars on 10/11/14.
 */
define([
    'widget/Constructor',
    'templating/parser!./_cmp.html'
], function (Constructor, template) {
    'use strict';
    return Constructor.extend({
        match:function(match){
            match('(/)').query(function(id){
                console.log('id:', id.getQuery())
            }.bind(this))
        },
        template: template
    });
});