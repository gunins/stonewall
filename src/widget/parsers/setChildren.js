/**
 * Created by guntars on 11/11/14.
 */
define([
    'templating/dom',
    './addChildren'
], function (dom, addChildren) {


    function setChildren(parentChildren = {}, data = {}) {
        let elements = this.children;
        if (elements) {
            Object.keys(elements).forEach((name)=> {
                let child = elements[name],
                    parentChild = parentChildren[name];

                if (parentChild !== undefined) {
                    if (this.nodes[name] !== undefined) {
                        this.nodes[name].call(this, child, parentChild, data);
                    } else if (child !== undefined) {
                        if (typeof parentChild == 'string') {
                            dom.text(child, parentChild);
                        }
                        else {
                            child = parentChild.run(child.el);
                        }
                    }
                } else if (this.nodes[name] !== undefined &&
                    child.data.tplSet.noattach === 'true') {

                    this.nodes[name].call(this, child, data);
                }
                addChildren.call(this, name, child, data);
            });
        }
    }

    return setChildren;
});