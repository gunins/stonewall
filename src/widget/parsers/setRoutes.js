/**
 * Created by guntars on 11/11/14.
 */
define(function () {
    function setRoutes(children) {
        if (!this._match) {
            var parent = this.el;
            this._match = function (match) {
                matchRoute.call(this, children, match, parent);
                if (this.match) {
                    this.match.call(this, match);
                }
            }.bind(this)
        }
    };

    function matchRoute(children, match, parent) {
        var names = Object.keys(children);
        var currMatch = match;
        names.forEach(function (name) {
            var child = children[name];
            var route = child.data.route;
            if (route !== undefined) {
                var matches = match(route, function (match) {
                    currMatch = match;
                }.bind(this));
                matches.to(function () {
                    if (child.el === undefined) {
                        child.applyAttach();
                        var args = [].slice.call(arguments, 0);
                        var params = args.pop();
                        if (child.children !== undefined) {
                            Object.keys(child.children).forEach(function (name) {
                                var cp = child.children[name];
                                cp.data.dataset.params = params;
                                if(args.length>0){
                                    cp.data.dataset.link = args;
                                }
                            }.bind(this));
                        }
                        child.add(parent, false);
                         if (child.children !== undefined) {
                         Object.keys(child.children).forEach(function (name) {
                         var cp = child.children[name];
                         if (!cp.el && cp.data.instance && cp.data.instance._match) {
                         matches.setRoutes(function (routes) {
                         cp.data.instance._match.call(cp.data.instance, routes.match.bind(routes));
                         routes.run();
                         }.bind(this));

                         }
                         }.bind(this));
                         }
                    } else {
                        child.attach();
                    }

                }.bind(this));

                matches.leave(function () {
                    child.detach();
                }.bind(this))

            }
            if (child.children !== undefined) {
                matchRoute.call(this, child.children, currMatch, parent);
            }
        }.bind(this));
    }

    return setRoutes;
});