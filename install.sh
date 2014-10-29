#!/bin/sh
DIRECTORY="../domtemplate";
if [ ! -d "$DIRECTORY" ]; then
    echo "please clone DOMTemplate from https://bitbucket.org/gunsim/domtemplate"
else
    cd ${DIRECTORY}
    npm install
    grunt
    cd "../widget"
    npm install
    npm install ${DIRECTORY}/domtemplate*
    bower install
    grunt
fi
