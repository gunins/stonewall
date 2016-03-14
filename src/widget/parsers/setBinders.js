/**
 * Created by guntars on 11/11/14.
 */
define(function () {

    function setBinders(children, ignoreCP) {
        let bindings = {};
        Object.defineProperty(bindings, '__cp__', {
            enumerable: false,
            value:      []
        });
        Object.keys(children).forEach((key) => {
            let el = children[key];
            if (el && el.data && el.data.bind !== undefined && el.data.type !== 'cp') {
                bindings[el.data.bind] = bindings[el.data.bind] || []
                bindings[el.data.bind].push(el);
            } else if (!ignoreCP && el.data.type === 'cp') {
                bindings['__cp__'].push(el);
            }
        });
        return bindings;
    }

    return setBinders;
});