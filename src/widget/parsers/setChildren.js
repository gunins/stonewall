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
                        (['pl'].indexOf(element.data.type) !== -1)) {

                        let bind = element.data.tplSet.bind;
                        if (bind) {
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

    function setChildren(els, parentChildren = {}, data = {}, params) {
        if (els) {
            let elements = applyElement.call(this, els, params);
            Object.keys(elements).forEach((key)=> {
                let children = elements[key].children;
                if (children !== undefined) {
                    //children = setChildren.call(this, children, parentChildren.children, data, params);
                    //elements[key].bindings = setBinders(children);
                }

                let child = elements[key],
                    parentChild = parentChildren[key];

                if (parentChild !== undefined) {
                 /*   if (parentChild.children !== undefined) {
                        //parentChild.bindings = deepBindings(parentChild.children);
                    }*/

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
                    child.data.tplSet.noattach === 'true' &&
                    child.data.dataset.bind === undefined) {
                    this.nodes[key].call(this, child, data);
                }

                if (this.elReady[key] !== undefined && (child.el !== undefined)) {
                    this.elReady[key].call(this, child, data);
                }

                applyEvents.call(this, child);

            });
            return elements
        }
    }

    return setChildren;
});