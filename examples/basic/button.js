define([
    'templating/parser!./button/_button.html',
    'templating/Decoder'
], function (template, Decoder) {
    function append(parent, child){
        while (child.el.childNodes.length > 0) {
            parent.el.appendChild(child.el.childNodes[0]);
        }
    }
    return function(data, children){
        console.log(children)
        var decoder = new Decoder(template);
        var context = decoder.render();
        var els = context.children;
        append(els.header, children.header);
        append(els.footer, children.footer);

        return{
            el: context.fragment.firstChild
        }
    };

});