# This is BAsic Hello World App

###For Starting app you need setup index.html file.

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
          data-dev?: Define App is in development mode
      -->
      <script data-name="app" data-target="body" src="../../src/loader.js"></script>

    </head>
    <body>
    </body>
    </html>

###Configuration for requirejs will looks like

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
            'coders': '../../../node_modules/richtemplate/dev/coders',
            'templating': '../../../node_modules/richtemplate/dev/templating',
            'widget': '../../../src/widget',
            'watch':'../../../lib/watch/src/watch',
        }
    });

There is two significant sections `templateCoders` and `templateDecoders` these are coders/decoders for "Rich Template" engine. Ypu can also create your own coders.
paths look more [**requirejs**](http://requirejs.org/) documentation.

###Now App.js file.

    define([
        'widget/App',
        'widget/parser!container/Container',
    ], function (App, Container) {

        return App.extend({
            AppContainer: Container,
            setContext: function () {
                 return {data: {
                    cmp:{
                        item: 'Binded Item From App'
                    }
                 }
              }
            }
        });
    });

AppContainer is Template for App. Custom context defining for App is method `setContext` and `data` in context is shared data in app.


###Now Template file.

    <div class="container-fluid">
        <div class="col-xs-6 col-sm-3 ">
            <div class="panel panel-default">
                <div class="panel-heading">Data Binding Example</div>
                <div class="panel-body">
                    <cp-val data-bind="cmp" src="cmp/Cmp">
                        <pl-header>Header From Parent Container</pl-header>
                        <pl-body>
                            <p>Body From Parent Container</p>
                        </pl-body>
                    </cp-val>
                </div>
            </div>
        </div>
    </div>

This one looks like basic html file, except two tags `cp` and `pl`
`cp` - is requirejs component where `src` is location of component.
`data-bind` - attribute passing object for context
`pl` -  is placeholders for component (Header and Body). In placeholders you can add another components, or any html markup.

###Optionally you can add javascript file for widget, in case you need extra functionality.

    define([
        'templating/parser!./_container.html',
        'widget/Constructor'
    ], function (template, Constructor) {
        return Constructor.extend({
            template: template
        });
    });

In this case you just require particular Javascript file.

###Then code for Cmp

    define([
        'templating/parser!./_cmp.html',
        'widget/Constructor'
    ], function (template, Constructor) {
        return Constructor.extend({
            template: template
        });
    });

Is almost same like another ones, except path to html is different.

###But code for html looks like.

    <div class="container-fluid">
        <pl-header tp-tag="h2" ></pl-header>
        <pl-body></pl-body>
        <bd-item></bd-item>
    </div>

There is new tag.

`bd` - bind the values from app Object.

And there is a Placeholders for header and body.