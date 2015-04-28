/**
 * Created by guntars on 11/11/14.
 */
define(function () {

    function setBinders(children, ignoreCP) {
        var bindings = false;
        Object.keys(children).forEach(function (key) {
            bindings   = bindings || {};
            var el     = children[key],
                ignore = (ignoreCP === true && el._node.data.type === 'cp');

            if (el._node && el._node.bind !== undefined && !ignore) {
                bindings[el._node.bind] = bindings[el._node.bind] || []
                bindings[el._node.bind].push(el);
            }
        }.bind(this));
        return bindings;
    }

    return setBinders;
});