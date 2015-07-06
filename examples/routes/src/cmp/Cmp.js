/**
 * Created by guntars on 10/11/14.
 */
define([
    'widget/Constructor',
    'templating/parser!./_cmp.html'
], function (Constructor, template) {
    'use strict';
    var action    = [
        {
            name:   'change',
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
        template:    template,
        init:        function (data) {
            console.log('init'); //, this.el, data);
        },
        match:       function (match) {
            //console.log(match, 'match');
            match('/:id').to(function (id) {
                console.log('custom', id);
            })
        },
        to:          function (id) {
            this.children.showid.text((typeof id !== 'object') ? id : 'Link id not dynamic');
            console.log('to', id); //, this.el, id);
        },
        leave:       function () {
            console.log('leave'); //, this.el)
        },
        query:       function (params) {
            this.children.input.val(params.getQuery().id || '');
            this.children.inputA.val(params.getQuery().id || '');
        },
        getLocation: function () {

        },
        setLocation: function (query) {
            var location         = window.location.hash.split('?', 2)[0]
            window.location.hash = location + '?' + serialize(query);
        },
        events:      {
            input:  action,
            inputA: action
        },
        nodes:       {
            footer: function (el) {
                setTimeout(function () {
                    this.setChildren(el);
                }.bind(this), 2000)
            }
        }
    });
});