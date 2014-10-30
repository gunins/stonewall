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
    var appPaths = {
        coders: '../../../node_modules/domtemplate/dev/coders',
        templating: '../../../node_modules/domtemplate/dev/templating',
        htmlparser2: '../../../node_modules/domtemplate/dev/htmlparser2',
        'widget': '../../../src/widget',
        'watch': '../../../bower_components/watch/src/watch',
        'd3': '../../../bower_components/d3/d3'
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ['target'],
        exec: {
            npmpack: 'npm pack dist'
        },
        requirejs: {
            prod: {
                options: {
                    baseUrl: 'src',
                    optimize: 'uglify2',
                    removeCombined: true,
                    paths: {
                        'watch': '../bower_components/watch/src/watch',
                        templating: '../node_modules/domtemplate/dev/templating'
                    },
                    dir: 'target/prod',
                    modules: [
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
            basicBind: {
                options: {
                    baseUrl: 'examples/basicBind/src',
                    removeCombined: true,
                    optimize: 'none',
                    templateCoders: coders.templateCoders,
                    templateDecoders: coders.templateDecoders,
                    stubModules: ['templating/parser'],
                    exclude: coders.exclude,
                    dir: "examples/basicBind/target",
                    paths: appPaths,
                    name: 'app'

                }
            },
            basicTable: {
                options: {
                    baseUrl: 'examples/basicTable/src',
                    removeCombined: true,
                    optimize: 'none',
                    templateCoders: coders.templateCoders,
                    templateDecoders: coders.templateDecoders,
                    stubModules: ['templating/parser'],
                    exclude: coders.exclude,
                    dir: "examples/basicTable/target",
                    paths: appPaths,
                    name: 'app'

                }
            },
            todo: {
                options: {
                    baseUrl: 'examples/todo/src',
                    removeCombined: true,
                    optimize: 'none',
                    templateCoders: coders.templateCoders,
                    templateDecoders: coders.templateDecoders,
                    stubModules: ['templating/parser'],
                    exclude: coders.exclude,
                    dir: "examples/todo/target",
                    paths: appPaths,
                    name: 'app'

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
                    paths: appPaths,
                    name: 'app'

                }
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            Widget: {
                src: [
                    'node_modules/domtemplate/prod/templating/Decoder.js',
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

    grunt.registerTask('default', ['clean', 'requirejs', 'concat']);

};