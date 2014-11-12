define(function () {
    'use strict';
    //Aplying Events to elements
    //
    //      @private applyEvents
    //      @param {dom.Element} element
    //      @param {Array} events
    //      @param {Object} data
    function applyEvents(element, events, data) {
        if (events !== undefined && element.el !== undefined) {
            events.forEach(function (event) {
                element.on(event.name, event.action, this, data);
            }.bind(this));
        }
    }

    return applyEvents;
});