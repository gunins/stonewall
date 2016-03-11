/**
 * Created by guntars on 11/07/15.
 */
define(function () {
    return function (childBinder, data) {
        if (this.elOnChange[childBinder.name] !== undefined) {
            this.elOnChange[childBinder.name].call(this, childBinder, data);
        }
    };
});