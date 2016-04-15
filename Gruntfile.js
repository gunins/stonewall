module.exports = function(grunt) {
    'use strict';

    var coders = {
            templateCoders:   [
                'coders/component/cpCoder',
                'coders/placeholders/plCoder',
                'coders/databind/bdCoder',
                'coders/router/routerCoder',
                'coders/style/styleCoder'
            ],
            templateDecoders: [
                'coders/component/cpDecoder',
                'coders/placeholders/plDecoder',
                'coders/databind/bdDecoder',
                'coders/router/routerDecoder',
                'coders/style/styleDecoder'
            ],
            exclude:          [
                'coders/component/cpCoder',
                'coders/component/cpDecoder',
                'coders/placeholders/plCoder',
                'coders/placeholders/plDecoder',
                'coders/databind/bdDecoder',
                'coders/databind/bdCoder',
                'coders/router/routerDecoder',
                'coders/router/routerCoder',
                'coders/style/styleCoder',
                'coders/style/styleDecoder',
                'widget/Constructor',
                'widget/App',
                'templating/Decoder',
                'templating/dom'

            ]
        },
        appPaths = {
            'coders':         '../../../node_modules/richtemplate/es5/dev/coders',
            'templating':     '../../../node_modules/richtemplate/es5/dev/templating',
            'widget':         '../../../src/widget',
            'watch':          '../../../lib/watch/src/watch',
            'd3':             '../../../bower_components/d3/d3',
            'router':         '../../../bower_components/urlmanager/dist/es6/dev/router',
            'three':          '../../../bower_components/three.js/three',
            'babel/polyfill': '../../../node_modules/babel-polyfill/dist/polyfill'


        },
        stubModules = ['templating/parser', 'widget/parser'],
        rootPaths = {
            'watch':          '../lib/watch/src/watch',
            'templating':     '../node_modules/richtemplate/es6/dev/templating',
            'coders':         '../node_modules/richtemplate/es6/dev/coders',
            'router':         '../bower_components/urlmanager/dist/es6/dev/router',
            'babel/polyfill': '../node_modules/babel-polyfill/dist/polyfill'
        },
        appExclude = [
            'coders/component/cpCoder',
            'coders/component/cpDecoder',
            'coders/placeholders/plCoder',
            'coders/placeholders/plDecoder',
            'coders/databind/bdDecoder',
            'coders/databind/bdCoder',
            'coders/router/routerDecoder',
            'coders/router/routerCoder',
            'coders/style/styleCoder',
            'coders/style/styleDecoder',
            'templating/Decoder',
            'templating/dom'

        ];

    grunt.initConfig({
        pkg:       grunt.file.readJSON('package.json'),
        clean:     ['target', 'dist', 'examples/**/target'],
        exec:      {
            npmpack: 'npm pack dist',
            publish: 'npm publish dist'
        },
        requirejs: {
            prod:        {
                options: {
                    baseUrl:        'src',
                    optimize:       'none',
                    removeCombined: true,
                    paths:          rootPaths,
                    dir:            'target/es6/prod',
                    modules:        [
                        {
                            name:    'widget/App',
                            exclude: appExclude
                        },
                        {
                            name:    'widget/Constructor',
                            exclude: [
                                         'widget/Mediator'
                                     ].concat(appExclude)
                        },
                        {
                            name: 'babel/polyfill'

                        }
                    ]
                }
            },
            dev:         {
                options: {
                    baseUrl:        'src',
                    optimize:       'none',
                    removeCombined: true,
                    paths:          rootPaths,
                    dir:            'target/es6/dev',
                    modules:        [
                        {
                            name:    'widget/App',
                            exclude: appExclude
                        },
                        {
                            name:    'widget/Constructor',
                            exclude: [
                                         'widget/Mediator'
                                     ].concat(appExclude)
                        },
                        {
                            name:    'widget/parser',
                            exclude: [
                                'widget/Constructor'
                            ]
                        },
                        {
                            name: 'babel/polyfill'

                        }
                    ]
                }
            },
            element:     {
                options: {
                    baseUrl:          'examples/element/src',
                    removeCombined:   true,
                    optimize:         'none',
                    templateCoders:   coders.templateCoders,
                    templateDecoders: coders.templateDecoders,
                    stubModules:      stubModules,
                    exclude:          coders.exclude,
                    dir:              "examples/element/target/es6",
                    paths:            appPaths,
                    name:             'Element'

                }
            },
            basic:       {
                options: {
                    baseUrl:          'examples/basic/src',
                    removeCombined:   true,
                    optimize:         'none',
                    templateCoders:   coders.templateCoders,
                    templateDecoders: coders.templateDecoders,
                    stubModules:      stubModules,
                    dir:              "examples/basic/target/es6",
                    paths:            appPaths,
                    modules:          [
                        {
                            name:    'Basic',
                            exclude: coders.exclude

                        },
                        {
                            name: 'babel/polyfill'
                        }
                    ]
                }
            },
            basicBind:   {
                options: {
                    baseUrl:          'examples/basicBind/src',
                    removeCombined:   true,
                    optimize:         'none',
                    templateCoders:   coders.templateCoders,
                    templateDecoders: coders.templateDecoders,
                    stubModules:      stubModules,
                    exclude:          coders.exclude,
                    dir:              "examples/basicBind/target/es6",
                    paths:            appPaths,
                    modules:          [
                        {
                            name:    'BasicBind',
                            exclude: coders.exclude

                        },
                        {
                            name: 'babel/polyfill'
                        }
                    ]

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
             dir: "examples/webgl/target/es6",
             paths: appPaths,
             name: 'WebGL'

             }
             },*/
            routes:      {
                options: {
                    baseUrl:          'examples/routes/src',
                    removeCombined:   true,
                    optimize:         'none',
                    templateCoders:   coders.templateCoders,
                    templateDecoders: coders.templateDecoders,
                    stubModules:      stubModules,
                    exclude:          coders.exclude,
                    dir:              "examples/routes/target/es6",
                    paths:            appPaths,
                    modules:          [
                        {
                            name:    'Routes',
                            exclude: coders.exclude

                        },
                        {
                            name: 'babel/polyfill'
                        }
                    ]

                }
            },
            basicTable:  {
                options: {
                    baseUrl:          'examples/basicTable/src',
                    removeCombined:   true,
                    optimize:         'none',
                    templateCoders:   coders.templateCoders,
                    templateDecoders: coders.templateDecoders,
                    stubModules:      stubModules,
                    exclude:          coders.exclude,
                    dir:              "examples/basicTable/target/es6",
                    paths:            appPaths,
                    modules:          [
                        {
                            name:    'App',
                            exclude: coders.exclude

                        },
                        {
                            name: 'babel/polyfill'
                        }
                    ]

                }
            },
            todo:        {
                options: {
                    baseUrl:          'examples/todo/src',
                    removeCombined:   true,
                    optimize:         'none',
                    templateCoders:   coders.templateCoders,
                    templateDecoders: coders.templateDecoders,
                    stubModules:      stubModules,
                    exclude:          coders.exclude,
                    dir:              "examples/todo/target/es6",
                    paths:            appPaths,
                    modules:          [
                        {
                            name:    'App',
                            exclude: coders.exclude

                        },
                        {
                            name: 'babel/polyfill'
                        }
                    ]

                }
            },
            application: {
                options: {
                    baseUrl:          'examples/application/src',
                    removeCombined:   true,
                    optimize:         'none',
                    templateCoders:   coders.templateCoders,
                    templateDecoders: coders.templateDecoders,
                    stubModules:      stubModules,
                    exclude:          coders.exclude,
                    dir:              "examples/application/target/es6",
                    paths:            appPaths,
                    modules:          [
                        {
                            name:    'App',
                            exclude: coders.exclude

                        },
                        {
                            name: 'babel/polyfill'
                        }
                    ]

                }
            }
        },
        concat:    {
            options: {
                separator: ';'
            },
            Widget:  {
                src:  [
                    'node_modules/richtemplate/es6/prod/templating/Decoder.js',
                    'target/es6/prod/widget/App.js',
                    'target/es6/prod/widget/Constructor.js'
                ],
                dest: 'target/es6/prod/widget/App.js'
            }
        },
        copy:      {
            es6:              {
                files: [
                    {expand: true, cwd: 'target/es6/dev', src: ['widget/**'], dest: 'dist/es6/dev'},
                    {expand: true, cwd: 'target/es6/prod', src: ['widget/App.js'], dest: 'dist/es6/prod'},
                    {expand: true, cwd: './', src: ['package.json', 'bower.json', 'README.md'], dest: 'dist'}
                ]
            },
            es5:              {
                files: [
                    {
                        expand: true,
                        cwd:    'target/es5/dev',
                        src:    ['babel/**', 'widget/**'],
                        dest:   'dist/es5/dev'
                    },
                    {expand: true, cwd: 'target/es5/prod', src: ['babel/**', 'widget/App.js'], dest: 'dist/es5/prod'}
                ]
            },
            loader:           {
                files: [
                    {
                        expand: true,
                        cwd:    'target/',
                        src:    ['loader.js'],
                        dest:   'dist/'
                    },
                    {expand: true, cwd: 'target/es5/prod', src: ['babel/**', 'widget/**'], dest: 'dist/es5/prod'}
                ]
            },
            examplesES6:      {
                files: ['application', 'basic', 'basicBind', 'basicTable', 'element', 'routes', 'todo'].map(function(name) {
                    return {
                        expand: true,
                        cwd:    'target/es6/prod',
                        src:    ['widget/App.js'],
                        dest:   'examples/' + name + '/target/es6/'
                    }

                })
            },
            examplesES5:      {
                files: ['application', 'basic', 'basicBind', 'basicTable', 'element', 'routes', 'todo'].map(function(name) {
                    return {
                        expand: true,
                        cwd:    'target/es5/prod',
                        src:    ['widget/App.js', 'babel/polyfill.js'],
                        dest:   'examples/' + name + '/target/es5/'
                    }

                })
            },
            examplesToLoader: {
                files: ['application', 'basic', 'basicBind', 'basicTable', 'element', 'routes', 'todo'].map(function(name) {
                    return {
                        expand: true,
                        cwd:    'target/',
                        src:    ['loader.js'],
                        dest:   'examples/' + name + '/target/'
                    }

                })
            }
        },
        babel:     {
            options:     {
                presets: ['es2015'],
                compact: false
            },
            dev:         {
                options: {
                    sourceMap: true
                },
                files:   [{
                    expand: true,
                    cwd:    'target/es6/dev',
                    src:    '**/*.js',
                    dest:   'target/es5/dev'
                }]
            },
            prod:        {
                options: {
                    sourceMap: false
                },
                files:   [{
                    expand: true,
                    cwd:    'target/es6/prod',
                    src:    ['babel/polyfill.js', 'widget/App.js'],
                    dest:   'target/es5/prod'
                }]
            },
            basic:       {
                options: {
                    sourceMap: false
                },
                files:   [
                    {
                        expand: true,
                        cwd:    'examples/basic/target/es6',
                        src:    'Basic.js',
                        dest:   'examples/basic/target/es5'
                    }
                ]
            },
            basicBind:   {
                options: {
                    sourceMap: false
                },
                files:   [
                    {
                        expand: true,
                        cwd:    'examples/basicBind/target/es6',
                        src:    'BasicBind.js',
                        dest:   'examples/basicBind/target/es5'
                    }
                ]
            },
            routes:      {
                options: {
                    sourceMap: false
                },
                files:   [
                    {
                        expand: true,
                        cwd:    'examples/routes/target/es6',
                        src:    'Routes.js',
                        dest:   'examples/routes/target/es5'
                    }
                ]
            },
            basicTable:  {
                options: {
                    sourceMap: false
                },
                files:   [
                    {
                        expand: true,
                        cwd:    'examples/basicTable/target/es6',
                        src:    'App.js',
                        dest:   'examples/basicTable/target/es5'
                    }
                ]
            },  
            element:  {
                options: {
                    sourceMap: false
                },
                files:   [
                    {
                        expand: true,
                        cwd:    'examples/element/target/es6',
                        src:    'Element.js',
                        dest:   'examples/element/target/es5'
                    }
                ]
            },
            todo:        {
                options: {
                    sourceMap: false
                },
                files:   [
                    {
                        expand: true,
                        cwd:    'examples/todo/target/es6',
                        src:    'App.js',
                        dest:   'examples/todo/target/es5'
                    }
                ]
            },
            application: {
                options: {
                    sourceMap: false
                },
                files:   [
                    {
                        expand: true,
                        cwd:    'examples/application/target/es6',
                        src:    'App.js',
                        dest:   'examples/application/target/es5'
                    }
                ]
            }
        },
        uglify:    {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            prod:    {
                files: [{
                    expand: true,
                    cwd:    'target/es5/prod',
                    src:    '**/*.js',
                    dest:   'target/es5/prod'
                }]
            },
            loader:  {
                files: [{
                    expand: true,
                    cwd:    'src/',
                    src:    'loader.js',
                    dest:   'target/'
                }]
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
            /*  prod: {
             options: {
             urls: [
             'http://localhost:8000/test/prod/index.html'
             ]
             }
             }*/
        },
        connect:         {
            server: {
                options: {
                    port: 8000,
                    base: '.'
                }
            }
        },
        docco:           {
            debug: {
                src:     ['src/**/*.js'],
                options: {
                    output: 'dist/docs/'
                }
            }
        },
        bump:            {
            options: {
                files:       ['package.json', 'bower.json', 'dist/package.json', 'dist/bower.json'],
                commit:      true,
                commitFiles: ['package.json', 'bower.json', 'dist/*'],
                createTag:   true,
                tagName:     '%VERSION%',
                tagMessage:  'Version %VERSION%',
                push:        true,
                pushTo:      'origin'
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-uglify');


    grunt.loadNpmTasks('grunt-mocha-phantomjs');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.loadNpmTasks('grunt-docco');
    grunt.loadNpmTasks('grunt-bump');

    grunt.registerTask('test', ['connect', 'mocha_phantomjs']);
    grunt.registerTask('default', ['clean', 'requirejs', 'concat', 'babel', 'uglify', 'copy', 'test', 'docco']);
    grunt.registerTask('publish', ['default', 'bump', 'exec:publish']);

};