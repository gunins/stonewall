/**
 * Created by guntars on 11/07/15.
 */
define(function () {
    return function (childBinder, data) {
        if (this.elReady[childBinder.name] !== undefined) {
            this.elReady[childBinder.name].call(this, childBinder, data);
        }
    };
});