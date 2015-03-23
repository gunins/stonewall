/**
 * Created by guntars on 11/11/14.
 */
define(function () {

    function setBinders(children) {
        var bindings = false
        Object.keys(children).forEach(function (key) {
            bindings = bindings || {};
            var el = children[key];
            if (el._node && el._node.bind !== undefined) {
                bindings[el._node.bind] = bindings[el._node.bind] || []
                bindings[el._node.bind].push(el);
            }
        }.bind(this));
        return bindings;
    }

    return setBinders;
});