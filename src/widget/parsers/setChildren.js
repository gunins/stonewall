/**
 * Created by guntars on 11/11/14.
 */
define([
    'templating/dom',
    '../utils',
    './applyEvents',
    './setBinders',
    './deepBindings'
], function (dom, utils, applyEvents, setBinders, deepBindings) {
    //Applying dom.Element to template elements.
    //
    //      @private applyElement
    //      @param {Object} elements
    function applyElement(elements, params) {
        Object.keys(elements).forEach((key)=> {
            let instance = elements[key];
            if (typeof instance !== 'string') {
                let element = instance.elGroup.getFirst();
                if (element) {
                    elements[key] = element;
                    if (element instanceof dom.Element === true &&
                        (['pl'].indexOf(element._node.data.type) !== -1)
                    ) {
                        let node = element._node,
                            bind = node.data.tplSet.bind;
                        if (bind) {
                        console.log(element, bind, params)
                            Object.keys(bind).forEach((attr)=> {
                                if (params[bind[attr]] !== undefined) {
                                    if (attr !== 'class') {
                                        element.setAttribute(attr, params[bind[attr]]);
                                    } else {
                                        element.addClass(params[bind[attr]]);
                                    }
                                }
                            });
                        }

                    }
                }
            }
        });
        return elements;
    }

    function setChildren(elements, parentChildren, data, params) {
        elements = (elements) ? applyElement.call(this, elements, params) : {};
        Object.keys(elements).forEach(function (key) {
            var children = elements[key].children;
            if (children !== undefined) {

                children = setChildren.call(this, children, parentChildren.children || {}, data, params);
                elements[key].bindings = setBinders(children);
            }

            var child = elements[key],
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
                        parentChild.run(child.el);
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