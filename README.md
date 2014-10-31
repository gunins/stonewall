# "Stone Wall" is framework for creating "Rich Single Page Applications".

Application framework based on "Rich Template" and requirejs.

## Why "Stone Wall"

Most javascript frameworks not supporting large scale apps. And not allow to inject another frameworks. Also different versions of same frameworks. There is only one limitation, has to be require module.

Also most frameworks has same code on production and development, except minifying. "Stone Wall" all code compile, and in production performing much faster.

## How it works

"Rich Template" compile the html templates prepare for Application. App has two main classes. App and Constructor. App create context, and manage events, constructor, compiling modules and prepare for app.

## Prerequisites

You need to install [**nodejs**](http://nodejs.org/) and **grunt CLI** globally `npm -g install grunt-cli`

## How to install

Yo need run

    npm install

and

    bower install

then you have to run grunt

    grunt

Code is located in dist/prod/loader.js

## How to start

Live examples you can see in examples section.

For Starting app you need setup index.html file.

    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Data Binding Example</title>

      <!-- Bootstrap core CSS -->
      <link href="../../bower_components/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
      <!-- Custom styles for this template -->
      <link href="css/dashboard.css" rel="stylesheet">
      <!-- Requirejs file -->
      <script src="../../bower_components/requirejs/require.js"></script>
      <!-- Configuration for requirejs -->
      <script src="config.js"></script>
      <!--
          location of framework
          data-name: location of main script for Application
          data-target?: location to container if not set, use document.body
      -->
      <script data-name="app" data-target="body" src="../../src/loader.js"></script>

    </head>
    <body>
    </body>
    </html>

Configuration for requirejs will looks like

    require.config({
        baseUrl: './src',
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
        paths: {
            'coders': '../../../node_modules/domtemplate/dev/coders',
            'templating': '../../../node_modules/domtemplate/dev/templating',
            'widget': '../../../src/widget',
            'watch':'../../../bower_components/watch/src/watch',
        }
    });

There is two significant sections `templateCoders` and `templateDecoders` these are coders/decoders for "Rich Template" engine. Ypu can also create your own coders.
paths look more [**requirejs**](http://requirejs.org/) documentation.

Now App.js file.

    define([
        'widget/App',
        'Container',
    ], function (App, Container) {

        return App.extend({
            AppContainer: Container
        });
    });

Container is Your base file for app.

    define([
        'templating/parser!./_container.html',
        'widget/Constructor'
    ], function (template, Constructor) {
        return Constructor.extend({
            template: template
        });
    });

And Last one is Template file.

    <div class="container-fluid">
        <div class="col-xs-6 col-sm-3 ">
            <div class="panel panel-default">
                <div class="panel-heading">Data Binding Example</div>
                <div class="panel-body">
                    <cp-val src="Cmp">
                        <pl-header>Header Text</pl-header>
                        <pl-body><p>Body Text</p><pl-body>
                    </cp-val>
                </div>
            </div>
        </div>
    </div>

This one looks like basic html file, except two tags `cp` and `pl`
`cp` - is requirejs component where `src` is location of component.
`pl` -  is placeholders for component (Header and Body). In placeholders you can add another components, or any html markup.

Then code for Cmp

    define([
        'templating/parser!./_cmp.html',
        'widget/Constructor'
    ], function (template, Constructor) {
        return Constructor.extend({
            template: template
        });
    });

Is almost same like another ones, except path to html is different.

But code for html looks like.

    <div class="container-fluid">
        <pl-header tp-tag="h2" ></pl-header>
        <pl-body><pl-body>
    </div>

And there is a Placeholders for header and body.
