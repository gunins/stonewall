/**
 * Created by guntars on 11/11/14.
 */
define([
    './setBinders'
],function (setBinders) {
    function deepBindings(elements) {
        Object.keys(elements).forEach(function (key) {
            var element = elements[key];
            if (element.children) {
                elements[key].children = deepBindings(element.children);
                elements[key].bindings = setBinders(element.children);
            }
        });
        return elements;
    }
    return deepBindings;
});