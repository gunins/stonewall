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
    function applyToChildren(children, cb) {
        if (children !== undefined) {
            Object.keys(children).forEach(function (name) {
                var cp = children[name];
                cb.call(this, cp)
            }.bind(this));
        }
    }

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
                    var args = [].slice.call(arguments, 0);
                    var params = args.pop();
                    if (args.length > 0) {
                        var id = args.join('_');
                    }
                    applyToChildren.call(this, child.children, function (cp) {
                        var data = cp.data,
                            dataSet = data.dataset,
                            instance = data.instance;

                        dataSet.params = params;

                        if (args.length > 0) {
                            dataSet.link = args;
                            if (instance && instance.reset) {
                                instance.reset.apply(instance, args.concat(params));

                            }
                        }

                    });

                    if (child.el !== undefined && child.sessId !== id && id !== undefined) {
                        child.detach();
                        child.el.remove();
                        delete child.el;
                    }

                    if (child.el === undefined) {
                        child.applyAttach();
                        child.add(parent, false);
                        applyToChildren.call(this, child.children, function (cp) {
                            if (!cp.el && cp.data.instance && cp.data.instance._match) {
                                matches.setRoutes(function (routes) {
                                    cp.data.instance._match.call(cp.data.instance, routes.match.bind(routes));
                                    routes.run();
                                }.bind(this));

                            }
                        });
                        if (id) {
                            child.sessId = id;
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