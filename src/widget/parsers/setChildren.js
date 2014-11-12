/**
 * Created by guntars on 11/11/14.
 */
define([
    '../dom',
    './applyEvents',
    './setBinders',
    './deepBindings'
], function (dom, applyEvents, setBinders, deepBindings) {
    //Applying dom.Element to template elements.
    //
    //      @private applyElement
    //      @param {Object} elements
    function applyElement(elements) {
        Object.keys(elements).forEach(function (key) {
            if (elements[key] instanceof  dom.Element !== true) {
                elements[key] = new dom.Element(elements[key]);
            }
            if (elements[key].children) {
                elements[key].children = applyElement(elements[key].children);
            }
        }.bind(this));
        return elements;
    }

    function setChildren(elements, parentChildren) {
        parentChildren = (parentChildren) ? applyElement(parentChildren) : {};
        elements = (elements) ? applyElement(elements) : {};
        Object.keys(elements).forEach(function (key) {
            var children = elements[key].children;
            if (children !== undefined) {
                children = setChildren.call(this, children, parentChildren.children);
                elements[key].bindings = setBinders(children);
            }

            var child = elements[key],
                parentChild = parentChildren[key];

            if (parentChild !== undefined) {
                if (parentChild.children !== undefined) {
                    parentChild.bindings = deepBindings(parentChild.children);
                }

                if (this.nodes[key] !== undefined) {
                    this.nodes[key].call(this, child, parentChild);
                } else if (child !== undefined) {
                    child.replace(parentChild);
                    if (parentChild.children !== undefined) {
                        child.children = parentChild.children
                    }
                }

            }

            if (this.elReady[key] !== undefined && child.el !== undefined) {
                this.elReady[key].call(this, child);
            }

            var events = this.events[key];
            applyEvents.call(this, child, events)

        }.bind(this));
        return elements
    }

    return setChildren;
});