/**
 * Created by guntars on 15/03/2016.
 */
define([], function() {
    'use strict';
    function addChildren(context, name, child, data) {
        applyEvents(context, child);
        elReady(context, child, data);
        elOnChange(context, child, data);

        context.children[name] = child;
        return child;
    };

    function elOnChange(context, childBinder, data) {
        if (context.elOnChange[childBinder.name] !== undefined) {
            context.elOnChange[childBinder.name].call(context, childBinder, data);
        }
    };

    function elReady(context, childBinder, data) {
        if (context.elReady[childBinder.name] !== undefined) {
            context.elReady[childBinder.name].call(context, childBinder, data);
        }
    };

    //Aplying Events to elements
    //
    //      @private applyEvents
    //      @param {dom.Element} element
    //      @param {Array} events
    //      @param {Object} data
    function applyEvents(context, element, data) {
        var events = context.events[element.name];
        if (events !== undefined && element.el !== undefined && element.data.type !== 'cp') {
            events.forEach((event)=> {
                context._events.push(element.on(event.name, event.action, context, data));
            });
        }
    };



    Object.assign(addChildren, {elOnChange, elReady, applyEvents});

    return addChildren;
});