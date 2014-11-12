module.exports = function (grunt) {
    var coders = {
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
        coders: '../../../node_modules/richtemplate/dev/coders',
        templating: '../../../node_modules/richtemplate/dev/templating',
        htmlparser2: '../../../node_modules/richtemplate/dev/htmlparser2',
        'widget': '../../../src/widget',
        'watch': '../../../bower_components/watch/src/watch',
        'd3': '../../../bower_components/d3/d3',
        'router': '../../../bower_components/urlmanager/dist/prod/router'
    };
    var stubModules = ['templating/parser', 'widget/parser'];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ['target', 'dist'],
        exec: {
            npmpack: 'npm pack dist',
            publish: 'npm publish dist'
        },
        requirejs: {
            prod: {
                options: {
                    baseUrl: 'src',
                    optimize: 'uglify2',
                    removeCombined: true,
                    paths: {
                        'watch': '../bower_components/watch/src/watch',
                        'templating': '../node_modules/richtemplate/dev/templating',
                        'router': '../bower_components/urlmanager/dist/prod/router'
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
            dev: {
                options: {
                    baseUrl: 'src',
                    optimize: 'uglify2',
                    removeCombined: true,
                    paths: {
                        'watch': '../bower_components/watch/src/watch',
                        'templating': '../node_modules/richtemplate/dev/templating',
                        'router': '../bower_components/urlmanager/dist/prod/router'
                    },
                    dir: 'target/dev',
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
                        },
                        {
                            name: 'widget/parser',
                            exclude: [
                                'widget/Constructor'
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
            routes: {
                options: {
                    baseUrl: 'examples/routes/src',
                    removeCombined: true,
                    optimize: 'none',
                    templateCoders: coders.templateCoders,
                    templateDecoders: coders.templateDecoders,
                    stubModules: stubModules,
                    exclude: coders.exclude,
                    dir: "examples/routes/target",
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
                    'node_modules/richtemplate/prod/templating/Decoder.js',
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
                    {expand: true, cwd: './', src: ['package.json', 'bower.json', 'README.md'], dest: 'dist'}
                ]
            },
            dev: {
                files: [
                    {expand: true, cwd: './target/dev', src: ['widget/**', 'loader.js'], dest: 'dist/dev'}
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
        },
        bump: {
            options: {
                files: ['package.json', 'bower.json', 'dist/package.json', 'dist/bower.json'],
                commit: true,
                createTag: true,
                tagName: '%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: true,
                pushTo: 'origin'
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-docco');
    grunt.loadNpmTasks('grunt-bump');

    grunt.registerTask('default', ['clean', 'requirejs', 'concat', 'copy', 'docco']);
    grunt.registerTask('publish', ['default', 'bump', 'exec:publish']);

};