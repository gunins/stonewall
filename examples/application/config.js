require.config({
    baseUrl: './target',
    templateCoders: [
        'coders/component/CpCoder',
        'coders/placeholders/plCoder',
        'coders/databind/bdCoder'

    ],
    templateDecoders: [
        'coders/component/CpDecoder',
        'coders/placeholders/plDecoder',
        'coders/databind/bdDecoder'
    ],
    paths: {
        'coders': '../../../node_modules/domtemplate/dev/coders',
        'templating': '../../../node_modules/domtemplate/dev/templating',
        'htmlparser2': '../../../node_modules/domtemplate/dev/htmlparser2',
        'widget': '../../../src/widget',
        'watch':'../../../bower_components/watch/src/watch',
        'd3':'../../../bower_components/d3/d3'
    }
});
