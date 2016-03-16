/**
 * Created by guntars on 15/03/2016.
 */
define([
    './applyEvents',
    './elReady',
    './elOnchange'
], function (applyEvents, elReady, elOnchange) {
    function addChildren(name, child, data) {
        applyEvents.call(this, child);
        elReady.call(this, child, data);
        elOnchange.call(this, child, data);

        this.children[name] = child;
        return child;
    }

    return addChildren;
});