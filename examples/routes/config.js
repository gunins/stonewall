require.config({
    baseUrl: './src',
    templateCoders: [
        'coders/component/CpCoder',
        'coders/placeholders/plCoder',
        'coders/databind/bdCoder',
        'coders/router/RouterCoder'

    ],
    templateDecoders: [
        'coders/component/CpDecoder',
        'coders/placeholders/plDecoder',
        'coders/databind/bdDecoder',
        'coders/router/RouterDecoder'

    ],
    paths: {
        'coders': '../../../node_modules/richtemplate/dev/coders',
        'templating': '../../../node_modules/richtemplate/dev/templating',
        'widget': '../../../src/widget',
        'routerCoders': '../../../src/routerCoders',
        'watch':'../../../lib/watch/src/watch',
        'router':'../../../bower_components/urlmanager/dist/router'
    }
});
