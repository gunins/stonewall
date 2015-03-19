/**
 * Created by guntars on 11/11/14.
 */
define([
    '../dom',
], function (dom) {

    function destroyComponent(cp) {
        var children = cp.children;
        if (children !== undefined) {
            Object.keys(children).forEach(function (key) {
                destroyComponent(children[key]);
            });
        }
        var instance = cp._node.data.instance;
        if (instance) {
            instance.destroy();
        } else if (cp.remove !== undefined) {
            cp.remove();
        }

        if (cp.el) {
            cp.el.remove();
            delete cp.el;
        }
    }

    function applyToChildren(children, cb) {
        if (children !== undefined) {
            Object.keys(children).forEach(function (name) {
                var cp = children[name];
                cb.call(this, cp, cp._node.data.instance);
            }.bind(this));
        }
    }

    function matchRoute(children, match, parent) {
        var names = Object.keys(children);
        names.forEach(function (name) {
            var child = children[name];
            var route = child._node.data.route;
            if (route !== undefined && child._node.data.type !== 'cp') {
                var matches = match(route, function (match) {
                    if (child.children !== undefined) {
                        matchRoute.call(this, child.children, match, parent);
                    }
                }.bind(this));
                matches.to(function () {
                    var args = [].slice.call(arguments, 0);
                    var params = args.pop();
                    if (args.length > 0) {
                        var id = args.join('_');
                    }

                    if (child.el !== undefined && child.sessId !== id && id !== undefined) {
                        applyToChildren.call(this, child.children, destroyComponent);
                        destroyComponent(child);
                    }

                    applyToChildren.call(this, child.children, function (cp, instance) {
                        var data = cp._node.data,
                            dataSet = data.dataset;

                        dataSet.params = params;

                        if (args.length > 0) {
                            dataSet.link = args;
                        }

                        if (instance && instance.to) {
                            instance.to.apply(instance, args.concat(params));

                        }

                    });

                    if (child.el === undefined) {
                        child.applyAttach();

                        dom.add(child, parent, false);

                        applyToChildren.call(this, child.children, function (cp, instance) {
                            if (instance && instance.to) {
                                instance.to.apply(instance, args.concat(params));
                            }

                            if (!cp.el && instance && instance._match) {
                                matches.setRoutes(function (routes) {
                                    instance._match.call(instance, routes.match.bind(routes));
                                    routes.run();
                                }.bind(this));

                                instance._reRoute = function () {
                                    instance._applyRoutes(matches);
                                };
                            }
                        });
                        if (id) {
                            child.sessId = id;
                        }

                    } else {
                        dom.attach(child);
                    }
                }.bind(this));
                matches.leave(function () {
                    applyToChildren.call(this, child.children, function (cp, instance) {
                        if (instance && instance.leave !== undefined) {
                            instance.leave();
                        }
                    }.bind(this));
                    dom.detach(child);
                }.bind(this));

                matches.query(function (params) {
                    applyToChildren.call(this, child.children, function (cp, instance) {
                        if (instance && instance.query !== undefined) {
                            instance.query(params);
                        }
                    }.bind(this));
                }.bind(this));

            } else if (child.children !== undefined && child._node.data.type !== 'cp') {
                matchRoute.call(this, child.children, match, parent);
            } else if (child._node.data.type === 'cp' && child._node.data.instance) {
                var instance = child._node.data.instance;
                instance._match.call(instance, match);
            }

        }.bind(this));
    }

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

    return setRoutes;
});