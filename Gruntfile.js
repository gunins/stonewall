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
    var stubModules = ['templating/parser', 'widget/parser'];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ['target', 'dist'],
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
            basic: {
                options: {
                    baseUrl: 'examples/basic/src',
                    removeCombined: true,
                    optimize: 'none',
                    templateCoders: coders.templateCoders,
                    templateDecoders: coders.templateDecoders,
                    stubModules: stubModules,
                    exclude: coders.exclude,
                    dir: "examples/basic/target",
                    paths: appPaths,
                    name: 'App'

                }
            },
            basicBind: {
                options: {
                    baseUrl: 'examples/basicBind/src',
                    removeCombined: true,
                    optimize: 'none',
                    templateCoders: coders.templateCoders,
                    templateDecoders: coders.templateDecoders,
                    stubModules: stubModules,
                    exclude: coders.exclude,
                    dir: "examples/basicBind/target",
                    paths: appPaths,
                    name: 'App'

                }
            },
            basicTable: {
                options: {
                    baseUrl: 'examples/basicTable/src',
                    removeCombined: true,
                    optimize: 'none',
                    templateCoders: coders.templateCoders,
                    templateDecoders: coders.templateDecoders,
                    stubModules: stubModules,
                    exclude: coders.exclude,
                    dir: "examples/basicTable/target",
                    paths: appPaths,
                    name: 'App'

                }
            },
            todo: {
                options: {
                    baseUrl: 'examples/todo/src',
                    removeCombined: true,
                    optimize: 'none',
                    templateCoders: coders.templateCoders,
                    templateDecoders: coders.templateDecoders,
                    stubModules: stubModules,
                    exclude: coders.exclude,
                    dir: "examples/todo/target",
                    paths: appPaths,
                    name: 'App'

                }
            },
            application: {
                options: {
                    baseUrl: 'examples/application/src',
                    removeCombined: true,
                    optimize: 'none',
                    templateCoders: coders.templateCoders,
                    templateDecoders: coders.templateDecoders,
                    stubModules: stubModules,
                    exclude: coders.exclude,
                    dir: "examples/application/target",
                    paths: appPaths,
                    name: 'App'

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
                dest: 'dist/prod/loader.js'
            }
        },
        copy: {
            prod: {
                files: [
                    {expand: true, cwd: './', src: ['package.json', 'bower.json'], dest: 'dist'}
                ]
            }
        },
        docco: {
            debug: {
                src: ['src/**/*.js'],
                options: {
                    output: 'dist/docs/'
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-docco');

    grunt.registerTask('default', ['clean', 'requirejs', 'concat', 'copy', 'docco']);

};