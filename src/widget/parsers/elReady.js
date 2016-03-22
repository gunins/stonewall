/**
 * Created by guntars on 11/07/15.
 */
define(function() {
    return function(context, childBinder, data) {
        if (context.elReady[childBinder.name] !== undefined) {
            context.elReady[childBinder.name].call(context, childBinder, data);
        }
    };
});