require.config({
    baseUrl: './',
    templateCoders: [
        'coders/component/CpCoder',
        'coders/placeholders/plCoder'

    ],
    templateDecoders: [
        'coders/component/CpDecoder',
        'coders/placeholders/plDecoder'
    ],
    paths: {
        'coders': '../../src/coders',
        'buttona':'buttonA/buttonA',
        'templating': '../../src/templating',
        'htmlparser2':'../../lib/htmlparser2',
        'test':'./test'
    }
});