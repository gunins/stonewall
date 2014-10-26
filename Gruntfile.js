module.exports = function (grunt) {
    var coders = {
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
        exclude: [
            'coders/component/CpCoder',
            'coders/component/CpDecoder',
            'coders/placeholders/plCoder',
            'coders/placeholders/plDecoder',
            'coders/databind/bdDecoder',
            'coders/databind/bdCoder',
            'widget/Constructor',
            'widget/App',
            'templating/Decoder',

        ]
    }
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ['target'],
        exec: {
            browserify: 'browserify -o lib/htmlparser2.js -r htmlparser2 -s htmlparser'
        },
        requirejs: {
            dev: {
                options: {
                    baseUrl: 'src',
                    optimize: 'none',
                    dir: "target/dev",
                    paths: {
                        'htmlparser2': '../lib/htmlparser2'
                    },
                    name: 'templating/parser',
                    include: [
                        'templating/utils',
                        'templating/DOMParser',
                        'templating/Coder',
                        'templating/Decoder'
                    ],
                    shim: {
                        templating: {
                            deps: [
                                'templating/utils',
                                'templating/DOMParser',
                                'templating/Coder',
                                'templating/Decoder'
                            ]
                        }
                    }
                }
            },
            prod: {
                options: {
                    baseUrl: 'src',
                    optimize: 'uglify2',
                    removeCombined: true,
                    paths: {
                        'htmlparser2': '../lib/htmlparser2',
                        'watch': '../bower_components/watch/src/watch'
                    },
                    dir: 'target/prod',
                    modules: [
                        {
                            name: 'templating/Decoder',
                            exclude: [
                                'templating/utils'
                            ]
                        },
                        {
                            name: 'coders/component/CpDecoder'
                        },
                        {
                            name: 'coders/placeholders/plDecoder',
                            exclude: [
                                'templating/utils'
                            ]
                        },
                        {
                            name: 'coders/databind/bdDecoder',
                            exclude: [
                                'templating/utils'
                            ]
                        },
                        {
                            name: 'widget/App'
                        },
                        {
                            name: 'widget/Constructor',
                            exclude: [
                                'widget/mediator',
                                'widget/utils'
                            ]
                        }
                    ]
                }
            },
            basic: {
                options: {
                    baseUrl: 'examples/basic',
                    removeCombined: true,
                    optimize: 'none',
                    templateCoders: coders.templateCoders,
                    templateDecoders: coders.templateDecoders,
                    stubModules: ['templating/parser'],
                    exclude: coders.exclude,
                    dir: "examples/basic/target",
                    paths: {
                        coders: '../../src/coders',
                        buttona: 'buttonA/buttonA',
                        templating: '../../target/dev/templating',
                        htmlparser2: '../../target/dev/htmlparser2',
                        'widget': '../../src/widget',
                        'watch': '../../bower_components/watch/src/watch',
                        'd3': '../../bower_components/d3/d3'
                    },
                    name: 'test'

                }
            },
            application: {
                options: {
                    baseUrl: 'examples/application/src',
                    removeCombined: true,
                    optimize: 'none',
                    templateCoders: coders.templateCoders,
                    templateDecoders: coders.templateDecoders,
                    stubModules: ['templating/parser'],
                    exclude: coders.exclude,
                    dir: "examples/application/target",
                    paths: {
                        coders: '../../../src/coders',
                        templating: '../../../target/dev/templating',
                        htmlparser2: '../../../target/dev/htmlparser2',
                        'widget': '../../../src/widget',
                        'watch': '../../../bower_components/watch/src/watch',
                        'd3': '../../../bower_components/d3/d3'
                    },
                    name: 'app'

                }
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            Decoder: {

                src: [
                    'target/prod/coders/component/CpDecoder.js',
                    'target/prod/coders/placeholders/plDecoder.js',
                    'target/prod/coders/databind/bdDecoder.js',
                    'target/prod/templating/Decoder.js'
                ],
                dest: 'target/prod/Decoder.js'
            },
            Widget: {
                src: [
                    'target/prod/widget/App.js',
                    'target/prod/widget/Constructor.js',
                    'target/prod/loader.js'
                ],
                dest: 'target/prod/loader.js'
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-exec');

    grunt.registerTask('default', ['clean', 'exec', 'requirejs', 'concat']);

};