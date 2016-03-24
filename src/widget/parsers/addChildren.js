/**
 * Created by guntars on 15/03/2016.
 */
define([], function() {
    'use strict';
    function addChildren(context, child, data) {
        if (child && child.name && context) {
            applyEvents(context, child, data);
            elReady(context, child, data);
            elOnChange(context, child, data);

            context.children[child.name] = child;
            return child;
        }
    };

    function elOnChange(context, child, data) {
        if (context.elOnChange[child.name] !== undefined) {
            context.elOnChange[child.name].call(context, child, data);
        }
    };

    function elReady(context, child, data) {
        if (context.elReady[child.name] !== undefined) {
            context.elReady[child.name].call(context, child, data);
        }
    };

    //Aplying Events to elements
    //
    //      @private applyEvents
    //      @param {dom.Element} element
    //      @param {Array} events
    //      @param {Object} data
    function applyEvents(context, child, data) {
        var events = context.events[child.name];
        if (events !== undefined && child.el !== undefined && child.data.type !== 'cp') {
            events.forEach((event)=> {
                context._events.push(child.on(event.name, event.action, context, data));
            });
        }
    };


    Object.assign(addChildren, {elOnChange, elReady, applyEvents});

    return addChildren;
});