require.config({
    baseUrl: './target',
    waitSeconds: 60,
    templateDecoders: [
        'coders/component/CpDecoder',
        'coders/placeholders/plDecoder',
        'coders/databind/bdDecoder',
        'coders/router/routerDecoder',
        'coders/style/styleDecoder'
    ]
});