/**
 * Created by guntars on 11/07/15.
 */
define(function () {
    return function (childBinder, data) {
        if (this.elOnChange[childBinder._node.name] !== undefined) {
            this.elOnChange[childBinder._node.name].call(this, childBinder, data);
        }
    };
});