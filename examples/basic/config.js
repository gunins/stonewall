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
        'coders': '../../../node_modules/domtemplate/dev/coders',
        'templating': '../../../node_modules/domtemplate/dev/templating',
        'widget': '../../../src/widget',
        'watch':'../../../bower_components/watch/src/watch'
    }
});
