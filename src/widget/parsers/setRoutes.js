/**
 * Created by guntars on 11/11/14.
 */
define([
    'templating/dom',
], function (dom) {

    function destroyComponent(cp, force) {
        var children = cp.children;
        if (children !== undefined) {
            Object.keys(children).forEach(function (key) {
                destroyComponent(children[key], true);
            });
        }
        var instance = cp.instance;
        if (instance) {
            instance.destroy();
        } else if (cp.remove !== undefined) {
            cp.remove();
        }
        if (cp.el) {
            if (cp.el.remove) {
                cp.el.remove();
            } else if (cp.el.parentNode) {
                cp.el.parentNode.removeChild(cp.el);
            }
            delete cp.el;
        }

        if (force) {
            if (cp._matches) {
                cp._matches.remove();
            }
        }
    }

    function applyToChildren(children, cb) {
        if (children !== undefined) {
            Object.keys(children).forEach(function (name) {
                var cp = children[name];
                cb.call(this, cp, cp.instance);
            }.bind(this));
        }
    }

    function matchRoute(children, match, parent) {
        var names = Object.keys(children);
        names.forEach(function (name) {
            var child = children[name];
            var route = (child.data !== undefined) ? child.data.route : undefined;
            if (route !== undefined && child.data.type !== 'cp') {
                var matches    = match(route, function (match) {
                    if (child.children !== undefined) {
                        matchRoute.call(this, child.children, match, parent);
                    }
                }.bind(this));
                child._matches = matches;
                matches.to(function () {
                    var args   = [].slice.call(arguments, 0);
                    var params = args.pop();
                    if (args.length > 0) {
                        var id = params.getLocation() + '_' + args.join('_');
                    }

                    if (child.el !== undefined && child.sessId !== id && id !== undefined) {
                        /*  applyToChildren.call(this, child.children, function (deepChild) {
                         destroyComponent(deepChild, true);
                         }.bind(this));*/
                        destroyComponent(child);
                    } else {
                        applyToChildren.call(this, child.children, function (cp, instance) {
                            var data    = cp.data,
                                dataSet = data.dataset;

                            dataSet.params = params;

                            if (args.length > 0) {
                                dataSet.link = args;
                            }

                            if (instance && instance.to) {
                                instance.to.apply(instance, args.concat(params));

                            }

                        });
                    }

                    if (child.el === undefined) {
                        child.run(true);

                        applyToChildren.call(this, child.children, function (cp, instance) {
                            if (instance && instance.to) {
                                instance.to.apply(instance, args.concat(params));
                            }

                            if (!cp.el && instance && instance._match) {

                                if (cp._routeHandlers !== undefined && cp._routeHandlers.length > 0) {
                                    cp._routeHandlers.forEach(function (handler) {
                                        handler.remove();
                                    });
                                    delete cp._routeHandlers;
                                }
                                matches.setRoutes(function (routes) {
                                    instance._match.call(instance, function (route) {
                                        var match         = routes.match.call(routes, route);
                                        cp._routeHandlers = cp._routeHandlers || [];
                                        cp._routeHandlers.push(match);
                                        return match
                                    });
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

            } else if (child.children !== undefined && child.data.type !== 'cp') {
                matchRoute.call(this, child.children, match, parent);
            } else if (child.instance !== undefined) {
                var instance = child.instance;
                instance._match.call(instance, match);
            }
        }.bind(this));
    }

    function setRoutes(children) {
        if (!this._match) {
            var parent  = this.el;
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