/**
 * Created by guntars on 11/11/14.
 */
define([
    '../dom',
    '../utils',
    './applyEvents',
    './setBinders',
    './deepBindings',
    './applyElement'
], function (dom, utils, applyEvents, setBinders, deepBindings, applyElement) {

    function setChildren(elements, parentChildren, data, params) {
        if (Object.keys(data).length === 0) {
            data = this.data;
        }
        parentChildren = (parentChildren) ? applyElement.call(this, parentChildren, params) : {};
        elements       = (elements) ? applyElement.call(this, elements, params) : {};
        Object.keys(elements).forEach(function (key) {
            var children = elements[key].children;
            if (children !== undefined) {
                children               = setChildren.call(this, children, parentChildren.children, data, params);
                elements[key].bindings = setBinders(children);
            }

            var child       = elements[key],
                parentChild = parentChildren[key];

            if (parentChild !== undefined) {
                if (parentChild.children !== undefined) {
                    parentChild.bindings = deepBindings(parentChild.children);
                }

                if (this.nodes[key] !== undefined) {
                    this.nodes[key].call(this, child, parentChild, data);
                } else if (child !== undefined) {
                    if (typeof parentChild == 'string') {
                        dom.text(child, parentChild);
                    }
                    else {
                        dom.replace(child, parentChild, data);
                    }

                    if (parentChild.children !== undefined) {
                        child.children = parentChild.children
                    }
                }

            } else if (this.nodes[key] !== undefined &&
                       child._node.data.tplSet.noattach === 'true' &&
                       child._node.data.dataset.bind === undefined) {
                this.nodes[key].call(this, child, data);
            }
            if (this.elReady[key] !== undefined && (child.el !== undefined || child.instance !== undefined)) {
                this.elReady[key].call(this, child, data);
            }

            var events = this.events[key];
            applyEvents.call(this, child, events);

        }.bind(this));
        return elements
    }

    return setChildren;
});