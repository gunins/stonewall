#!/bin/sh
DIRECTORY="../DOMTemplate";
if [ ! -d "$DIRECTORY" ]; then
    echo "please clone DOMTemplate from https://bitbucket.org/gunsim/domtemplate"
else
    cd ${DIRECTORY}
    npm install
    grunt
    cd "../widget"
    npm instal ${DIRECTORY}/domtemplate*
    grunt
fi
