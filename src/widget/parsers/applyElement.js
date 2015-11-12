define([
    '../dom'
], function (dom) {
    //Applying dom.Element to template elements.
    //
    //      @private applyElement
    //      @param {Object} elements
    function applyElement(elements, params) {
        Object.keys(elements).forEach(function (key) {
            var element = elements[key],
                node    = element._node;
            if (typeof element == 'string') {
            } else if (['cp'].indexOf(node.data.type) !== -1) {
                if (node.children && !element.children) {
                    //element.children = node.children;
                }
            } else if (element instanceof  dom.Element !== true &&
                       (['pl', 'bd', 'rt'].indexOf(node.data.type) !== -1 || node.data.type === undefined)) {
                elements[key] = new dom.Element(element);
                if (node.data.type === 'pl' && node.data.tplSet.bind !== undefined) {
                    var bind = node.data.tplSet.bind;
                    Object.keys(bind).forEach(function (attr) {
                        if (params[bind[attr]] !== undefined) {
                            if (attr !== 'class') {
                                elements[key].setAttribute(attr, params[bind[attr]]);
                            } else {
                                elements[key].addClass(params[bind[attr]]);
                            }
                        }
                    }.bind(this));
                }

            }
        }.bind(this));
        return elements;
    }

    return applyElement
})