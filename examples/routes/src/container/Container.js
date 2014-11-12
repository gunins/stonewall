/**
 * Created by guntars on 10/11/14.
 */
define([
    'widget/Constructor',
    'templating/parser!./_container.html'
], function (Constructor, template) {
    'use strict';
    return Constructor.extend({
        init: function () {

        },
        /* match: function (match) {

       /*     //Another Route
            match('/levelA').to(function () {
                console.log(this.el, this._pl)
                this._parent.replaceChild(this.el, this._pl);
            }.bind(this)).leave(function () {
                console.log(this.el, this._pl)
                this._parent.replaceChild(this._pl, this.el);
            }.bind(this));
        }
       parse: function (match) {
            this.match(function (route) {
                return match(route, function (match) {
                    var keys = Object.keys(this.children);
                    if (keys.length > 0) {
                        keys.forEach(function (key) {
                            var child = this.children[key].data.instance;
                            if (child && child.match) {
                                child.match.call(child, match);
                            }
                        }.bind(this));
                    }
                }.bind(this))
            }.bind(this));
        }*/
        template: template
    });
});