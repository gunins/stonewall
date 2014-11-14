/**
 * Created by guntars on 10/11/14.
 */
define([
    'widget/Constructor',
    'templating/parser!./_cmp.html'
], function (Constructor, template) {
    'use strict';
    var action = [
        {
            name: 'change',
            action: function (e, el) {
                this.setLocation({id: el.val()})
            }
        }
    ];
    var serialize = function (obj) {
        var str = [];
        for (var p in obj)
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        return str.join("&");
    };
    return Constructor.extend({
        template: template,
        init:function(data){
            console.log(this.el);
        },
        reset:function(){
            //console.log(this);
        },
        match: function (match) {
            match('(/)').query(function (params) {
                this.children.input.val(params.getQuery().id || '');
                this.children.inputA.val(params.getQuery().id || '');
            }.bind(this));
        },
        getLocation: function () {

        },
        setLocation: function (query) {
            var location = window.location.hash.split('?', 2)[0]
            window.location.hash = location + '?' + serialize(query);
        },
        events: {
            input: action,
            inputA: action
        }
    });
});