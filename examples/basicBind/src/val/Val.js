define(['widget/Constructor',
    'templating/parser!./_val.html'
],function(Widget, template){
    return Widget.extend({
        template:template,
        init:function(){
            console.log(this.data.items)
        },
        events:{
            input:[
                {
                    name:'keyup change',
                    action:function(e, el, data){
                        data.value = el.val();
                    }
                }
            ]
        }
    });

})
