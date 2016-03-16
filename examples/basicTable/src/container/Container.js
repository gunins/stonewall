/**
 * Created by guntars on 15/03/2016.
 */
define([
    'widget/Constructor',
    'templating/parser!./_container.html'
], function (Constructor, template) {
    'use strict';

    return Constructor.extend({
        template: template,
        init(){

        },
        nodes:    {
            panel(el, data){
                this.setChildren(el, data);
            }
        }
    });
});