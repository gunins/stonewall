/**
 * Created by guntars on 11/11/14.
 */
define([
    'templating/dom'
], function (dom) {

    function destroyComponent(cp, force) {
        let children = cp.children;
        if (children !== undefined) {
            Object.keys(children).forEach(function (key) {
                let instance =children[key];
                if (instance.elGroup && instance.elGroup.size > 0) {
                    instance.elGroup.forEach((item)=> {
                        destroyComponent(item, true);
                    });
                }
            });
        }
        if (cp.remove !== undefined) {
            cp.remove(force);
        }

    }

    function applyToChildren(children, cb) {
        if (children !== undefined) {
            Object.keys(children).forEach((name)=> {
                let cp = children[name];
                if (cp.elGroup && cp.elGroup.size > 0) {
                    cp.elGroup.forEach((item)=> {
                        cb.call(this, item);
                    })
                }
            });
        }
    }

    function matchRoute(children, match) {
        var names = Object.keys(children);
        names.forEach((name)=> {
            let child = children[name],
                route = (child.data !== undefined) ? child.data.route : undefined;
            if (route !== undefined && child.data.type !== 'cp') {

                let matches = match(route, (match)=> {
                    if (child.children !== undefined) {
                        matchRoute.call(this, child.children, match);
                    }
                });
                matches.to((...args)=> {
                    let params = args.pop();
                    let id = (args.length > 0) ? params.getLocation() + '_' + args.join('_') : undefined;
                    console.log(id, child.sessId);
                    if (child.sessId !== id && id !== undefined) {
                        /*  applyToChildren.call(this, child.children, function (deepChild) {
                         destroyComponent(deepChild, true);
                         }.bind(this));*/
                        console.log('destroy')
                        destroyComponent(child);
                    } else {

                        applyToChildren.call(this, child.children, function (instance) {
                            /*  let data = cp.data,
                             dataSet = data.dataset;

                             //dataSet.params = params;

                             if (args.length > 0) {
                             dataSet.link = args;
                             }*/
                            //console.log(instance);
                            if (instance && instance.to) {
                                instance.to.apply(instance, args.concat(params));

                            }

                        });
                    }
                    if (child.elGroup && child.elGroup.size === 0) {
                        child = children[name] = child.run(true);
                        child._matches = matches;


                        applyToChildren.call(this, child.children, function (instance) {
                            if (instance && instance.to) {
                                instance.to.apply(instance, args.concat(params));
                            }

                            if (instance && instance._match) {

                                if (instance._routeHandlers !== undefined && instance._routeHandlers.length > 0) {
                                    instance._routeHandlers.forEach(function (handler) {
                                        handler.remove();
                                    });
                                    delete instance._routeHandlers;
                                }
                                matches.setRoutes(function (routes) {
                                    instance._match.call(instance, function (route) {
                                        var match = routes.match.call(routes, route);
                                        instance._routeHandlers = instance._routeHandlers || [];
                                        instance._routeHandlers.push(match);
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

                });

                matches.leave(()=> {
                    applyToChildren.call(this, child.children, (instance)=> {
                        if (instance && instance.leave !== undefined) {
                            instance.leave();
                        }
                    });
                    dom.detach(child);
                });

                matches.query((params)=> {
                    applyToChildren.call(this, child.children, (instance)=> {
                        if (instance && instance.query !== undefined) {
                            instance.query(params);
                        }
                    });
                });

            } else if (child.children !== undefined && child.data.type !== 'cp') {
                matchRoute.call(this, child.children, match);
            } else if (child.elGroup&&child.elGroup.size>0){
                child.elGroup.forEach((cp)=>{
                let instance = cp.instance;
                    if(instance){
                        instance._match.call(instance, match);
                    }
            })
            }
        });
    }

    function setRoutes(children) {
        if (!this._match) {
            this._match = (match)=> {
                matchRoute.call(this, children, match);
                if (this.match) {
                    this.match.call(this, match);
                }
            }
        }
    };

    return setRoutes;
});