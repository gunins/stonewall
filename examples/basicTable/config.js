require.config({
    baseUrl: './src',
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
        'coders': '../../../node_modules/richtemplate/dev/coders',
        'templating': '../../../node_modules/richtemplate/dev/templating',
        'htmlparser2': '../../../node_modules/richtemplate/dev/htmlparser2',
        'widget': '../../../src/widget',
        'watch':'../../../lib/watch/src/watch',
        'd3':'../../../bower_components/d3/d3',
        'router':'../../../bower_components/urlmanager/dist/prod/router'
    }
});
