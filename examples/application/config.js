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
        'coders': '../../../src/coders',
        'templating': '../../../src/templating',
        'htmlparser2': '../../../lib/htmlparser2',
        'widget': '../../../src/widget',
        'watch':'../../../bower_components/watch/src/watch',
        'd3':'../../../bower_components/d3/d3'
    }
});
