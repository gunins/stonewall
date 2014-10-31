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


