/**
 * Created by guntars on 10/11/14.
 */
define([
    'widget/Constructor',
    'templating/parser!./_cmp.html'
], function(Constructor, template) {
    'use strict';
    var action = [
        {
            name:   'change',
            action: function(e, el, data) {
                data.value = el.val();
                this.setLocation({id: el.val()})
            }
        }
    ];
    var serialize = function(obj) {
        var str = [];
        for (var p in obj)
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        return str.join("&");
    };
    return Constructor.extend({
        template:    template,
        async:       true,
        init:        function(data) {
            this.data = {
                input: {
                    value: ''
                }
            };

        },
        match:       function(match) {
            this.custom = match('/:id').to(function(id) {
                console.log('custom', id);
            })
        },
        to:          function(id) {
            this.id = (typeof id !== 'object') ? id : 'Link id not dynamic';

            console.log('to', id); //, this.el, id);
            // this.render();

        },
        leave:       function(done) {
            var close = confirm('Are You Sure?');
            done(close);
            if (close) {
                if (this.id !== 'Link id not dynamic') {
                    this.custom.remove();
                }
                console.log('leave'); //, this.el)
            }
        },
        query:       function(params) {
            // console.log('query')
            this.queryId = params.getQuery().id;
            if (this.queryId) {
                this.data.input.value = this.queryId;
            }
            this.render();


        },
        onDestroy:   function() {
            // console.log('cpm', this);
        },
        getLocation: function() {

        },
        setLocation: function(query) {
            var location = window.location.hash.split('?', 2)[0]
            window.location.hash = location + '?' + serialize(query);
        },
        events:      {
            input:  action,
            inputA: action
        },
        elReady:     {
            showid: function(el) {
                el.text(this.id);
            }
        },
        nodes:       {
            footer: function(el) {
                setTimeout(()=> {
                    this.setChildren(el);
                }, 2000)
            }
        }
    });
});