module.exports = function (grunt) {
    var coders = {
        templateCoders: [
            'coders/component/CpCoder',
            'coders/placeholders/plCoder',
            'coders/databind/bdCoder',
            'coders/router/RouterCoder',
            'coders/style/styleCoder'
        ],
        templateDecoders: [
            'coders/component/CpDecoder',
            'coders/placeholders/plDecoder',
            'coders/databind/bdDecoder',
            'coders/router/RouterDecoder',
            'coders/style/styleDecoder'
        ],
        exclude: [
            'coders/component/CpCoder',
            'coders/component/CpDecoder',
            'coders/placeholders/plCoder',
            'coders/placeholders/plDecoder',
            'coders/databind/bdDecoder',
            'coders/databind/bdCoder',
            'coders/router/RouterDecoder',
            'coders/router/RouterCoder',
            'coders/style/styleCoder',
            'coders/style/styleDecoder',
            'widget/Constructor',
            'widget/App',
            'templating/Decoder'

        ]
    }
    var appPaths = {
        coders: '../../../node_modules/richtemplate/dev/coders',
        templating: '../../../node_modules/richtemplate/dev/templating',
        'widget': '../../../src/widget',
        'watch': '../../../lib/watch/src/watch',
        'd3': '../../../bower_components/d3/d3',
        'router': '../../../bower_components/urlmanager/dist/prod/router',
        'three':'../../../bower_components/three.js/three'

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
                        'watch': '../lib/watch/src/watch',
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
                    optimize: 'none',
                    removeCombined: true,
                    paths: {
                        'watch': '../lib/watch/src/watch',
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
            element: {
                options: {
                    baseUrl: 'examples/element/src',
                    removeCombined: true,
                    optimize: 'none',
                    templateCoders: coders.templateCoders,
                    templateDecoders: coders.templateDecoders,
                    stubModules: stubModules,
                    exclude: coders.exclude,
                    dir: "examples/element/target",
                    paths: appPaths,
                    name: 'Element'

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
                    name: 'Basic'

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
                    name: 'BasicBind'

                }
            },
   /*         webGL: {
                options: {
                    baseUrl: 'examples/webgl/src',
                    removeCombined: true,
                    optimize: 'none',
                    templateCoders: coders.templateCoders,
                    templateDecoders: coders.templateDecoders,
                    stubModules: stubModules,
                    exclude: coders.exclude,
                    dir: "examples/webgl/target",
                    paths: appPaths,
                    name: 'WebGL'

                }
            },*/
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
                    name: 'Routes'

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
        mocha_phantomjs: {
            dev: {
                options: {
                    urls: [
                        'http://localhost:8000/test/dev/index.html'
                    ]
                }
            },
            prod: {
                options: {
                    urls: [
                        'http://localhost:8000/test/prod/index.html'
                    ]
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: 8000,
                    base: '.'
                }
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
                commitFiles: ['package.json', 'bower.json', 'dist/*'],
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

    grunt.loadNpmTasks('grunt-mocha-phantomjs');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.loadNpmTasks('grunt-docco');
    grunt.loadNpmTasks('grunt-bump');

    grunt.registerTask('test', ['connect', 'mocha_phantomjs']);
    grunt.registerTask('default', ['clean', 'requirejs', 'concat', 'copy', 'test', 'docco']);
    grunt.registerTask('publish', ['default', 'bump', 'exec:publish']);

};