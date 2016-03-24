// ## Loader Loads the Application main script
// Following Attributes Supported
//
//      data-name: location of main script for Application
//      data-target?: location to container if not set,
//      use document.body
//
// There below is Example of usage in `index.html`
//
//      `<script data-name="App" data-target="body"
//          src="../../src/loader.js"></script>`
(function () {

    function getData(attributes, dataset) {
        for (var a = 0; a < attributes.length; a++) {
            var attribs = attributes[a];
            if (attribs.name.indexOf('data-') == 0 && attribs.name.length > 5) {
                dataset[attribs.name.substr(5)] = attribs.value;
            }
        }
        return dataset;
    }

    function getDataSet() {
        var dataset = {},
            scripts = document.getElementsByTagName('script');
        if (scripts.length > 0) {
            for (var a = 0; a < scripts.length; a++) {
                var script = scripts[a];
                var attributes = script.attributes;
                getData(attributes, dataset);
            }
        }

        return dataset;
    }

    function containerStart(dataset) {
        if (dataset.name !== undefined) {
            require([dataset.name], function (App) {
                var container = (dataset.target) ? document.querySelector(dataset.target) : document.body;
                var app = new App();
                app.start(container);
            });
        }
    }
    document.addEventListener("DOMContentLoaded", function(){
        containerStart(getDataSet());
    }, false);

}());