/**
 * Created by guntars on 11/11/14.
 */
define([
    'templating/dom'
], function (dom) {

    function destroyComponent(cp) {
        if (cp.remove !== undefined) {
            cp.remove();
        }

    }

    function applyToChildren(children, cb) {
        if (children !== undefined) {
            Object.keys(children).forEach((name)=> {
                let cp = children[name];
                if (cp.elGroup && cp.elGroup.size > 0) {
                    cp.elGroup.forEach((item)=> cb(item));
                } else {
                    cb(cp);
                }
            });
        }
    }

    function matchRoute(child, match) {
        let route = (child.data !== undefined) ? child.data.route : undefined;

        if (route !== undefined && child.data.type !== 'cp' && child.name !== 'root') {
            let id, childMatch,
            //Need add return match in router, for better readability
                matches = match(route, match=> {
                    childMatch = match;
                });
            matches.to((...args)=> {
                let params = args.pop();
                id = (args.length > 0) ? params.getLocation() + '_' + args.join('_') : undefined;
                if (child.elGroup && child.elGroup.size === 0) {
                    child = child.run(true);
                    applyToChildren(child.children, (instance)=> {
                        if (instance && instance.to) {
                            instance.to(...args.concat(params));
                        }

                        if (instance && !instance._match) {
                            matchRoute(instance, childMatch);
                        } else if (instance && instance._match) {
                            matches.setRoutes((routes)=> {
                                instance._match((...args)=> {
                                    let match = routes.match(...args);
                                    instance._appliedRoutes.push(match);
                                    return match;
                                });
                                routes.run();
                            });

                            instance._reRoute = ()=> {
                                instance._applyRoutes(matches);
                            };
                        }

                    });

                } else {
                    applyToChildren(child.children, (instance)=> {
                        if (instance && instance.to) {
                            instance.to.apply(instance, args.concat(params));
                        }
                    });
                    dom.attach(child);
                }

            });

            matches.leave(()=> {
                applyToChildren(child.children, (instance)=> {
                    if (instance && instance.leave !== undefined) {
                        instance.leave();
                    }
                });
                if (!id) {
                    dom.detach(child);
                } else {
                    destroyComponent(child);
                }
            });

            matches.query((params)=> {
                applyToChildren(child.children, (instance)=> {
                    if (instance && instance.query !== undefined) {
                        instance.query(params);
                    }
                });
            });

        } else if (child.children !== undefined && child.data.type !== 'cp') {
            applyToChildren(child.children, child=> matchRoute(child, match));
        } else if (child.elGroup && child.elGroup.size > 0) {
            child.elGroup.forEach((instance)=> {
                if (child.data.type === 'cp' && instance._match) {
                    instance._match(match);
                }
            })
        }
    }

    function setRoutes(children) {
        if (!this._match) {
            this._match = (match)=> {
                applyToChildren.call(this, children, child=> matchRoute(child, match));
                if (this.match) {
                    this.match(match);
                }
            }
        }
    };

    return setRoutes;
});