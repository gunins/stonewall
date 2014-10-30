/**
 * Created by guntars on 29/10/14.
 */
define([
    'templating/parser!./_input.html',
    'widget/Constructor'
], function (template, Constructor) {
    return Constructor.extend({
        template: template,
        events: {
            input: [
                {
                    name: 'change',
                    action: function (e, el) {
                        var val = el.val();
                        if(val.trim()!==''){
                            this.context.eventBus.publish('addRecord', val);
                            el.val('');
                        }
                    }
                }
            ]
        }
    });
});