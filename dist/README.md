## "Stone Wall" is framework for creating "Rich Single Page Applications". [![Build Status](https://api.travis-ci.org/gunins/stonewall.svg?branch=master)](https://travis-ci.org/gunins/stonewall)

Application framework based on "Rich Template" and requirejs. To start using need knowledge about [**requirejs**](http://requirejs.org/)

## Why "Stone Wall"

Most javascript frameworks not supporting large scale apps. And not allow to inject another frameworks. Also different versions of same frameworks. There is only one limitation, has to be require module.

Also most frameworks has same code on production and development, except minifying. "Stone Wall" all code compile, and in production performing much faster.
## installation

Using npm

    npm install stonewalljs

Using bower

    bower install stonewall

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

Live examples you can see in examples section. To start go in ***examples/basic*** section.

