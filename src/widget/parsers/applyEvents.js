define(function () {
    'use strict';
    //Aplying Events to elements
    //
    //      @private applyEvents
    //      @param {dom.Element} element
    //      @param {Array} events
    //      @param {Object} data
    function applyEvents(context, element, data) {
        var events = context.events[element.name];
        if (events !== undefined && element.el !== undefined&&element.data.type !== 'cp') {
            events.forEach((event)=> {
                context._events.push(element.on(event.name, event.action, context, data));
            });
        }
    }

    return applyEvents;
});