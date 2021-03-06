/**
 * Created by guntars on 11/11/14.
 */
define([
    'templating/dom',
    './addChildren'
], function(dom, addChildren) {


    function setChildren(context, parentChildren = {}, data = {}) {
        if (context) {
            let elements = context.children;

            if (elements) {
                Object.keys(elements).forEach((name)=> {
                    let add = true,
                        child = elements[name],
                        parentChild = parentChildren[name];
                    if (parentChild !== undefined) {
                        if (context.nodes[name] !== undefined) {
                            context.nodes[name].call(context, child, parentChild, data);
                        } else if (child !== undefined) {
                            if (typeof parentChild === 'string') {
                                dom.text(child, parentChild);
                            }
                            else {
                                child = parentChild.run(child.el);
                            }
                        }

                    } else if (context.nodes[name] !== undefined &&
                        child.data.tplSet.noattach) {
                        context.nodes[name].call(context, child, data);
                        add = false;
                    }
                    if (add && child.elGroup.size > 0) {
                        addChildren(context, child, data);
                    }

                });
            }
        }
    }

    return setChildren;
});