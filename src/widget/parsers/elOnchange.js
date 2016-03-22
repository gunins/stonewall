/**
 * Created by guntars on 11/07/15.
 */
define(function() {
    return function(context, childBinder, data) {
        if (context.elOnChange[childBinder.name] !== undefined) {
            context.elOnChange[childBinder.name].call(context, childBinder, data);
        }
    };
});