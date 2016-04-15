/**
 * Created by guntars on 09/10/2014.
 */
define([
    'templating/parser!_element.html',
    'templating/Decoder'
], function(Element, Decoder) {
    'use strict';
    function App() {
        this.element = new Decoder(Element);
    }

    App.prototype.start = function() {
        var el = this.element.render();
        console.log(el);
        return el
    }
    return App
});