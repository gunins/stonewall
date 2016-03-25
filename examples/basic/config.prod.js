require.config({
    baseUrl: './target',
    templateDecoders: [
        'coders/component/cpDecoder',
        'coders/placeholders/plDecoder',
        'coders/databind/bdDecoder',
        'coders/style/styleCoder'
    ]
});