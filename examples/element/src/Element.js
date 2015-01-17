/**
 * Created by guntars on 09/10/2014.
 */
define([
    'templating/parser!_element.html',
    'templating/Decoder'
], function (Element, Decoder) {
    'use strict';
    return new Decoder(Element);
});