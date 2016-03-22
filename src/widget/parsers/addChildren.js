/**
 * Created by guntars on 15/03/2016.
 */
define([
    './applyEvents',
    './elReady',
    './elOnchange'
], function (applyEvents, elReady, elOnchange) {
    function addChildren(context, name, child, data) {
        applyEvents(context, child);
        elReady(context, child, data);
        elOnchange(context, child, data);

        context.children[name] = child;
        return child;
    }

    return addChildren;
});