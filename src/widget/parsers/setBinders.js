/**
 * Created by guntars on 11/11/14.
 */
define(function () {

    function setBinders(children, ignoreCP) {
        let bindings = {};
        Object.keys(children).forEach((key) => {
            let el = children[key];
            console.log(ignoreCP, el.data.type === 'cp')
            if (el && el.data && el.data.bind !== undefined && el.data.type !== 'cp') {
                bindings[el.data.bind] = bindings[el.data.bind] || []
                bindings[el.data.bind].push(el);
            } else if (!ignoreCP && el.data.type === 'cp') {
                console.log(el)
                bindings['__cp__'] = bindings['__cp__'] || []
                bindings['__cp__'].push(el);
            }
        });
        return bindings;
    }

    return setBinders;
});