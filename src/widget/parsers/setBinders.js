/**
 * Created by guntars on 11/11/14.
 */
define(function () {

    function setBinders(children) {
        var bindings = false
        Object.keys(children).forEach(function (key) {
            bindings = bindings || {};
            var el = children[key];
            if (el.bind !== undefined) {
                bindings[el.bind] = bindings[el.bind] || []
                bindings[el.bind].push(el);
            }
        }.bind(this));
        return bindings;
    }

    return setBinders;
});