/**
 * Created by guntars on 11/11/14.
 */
define([
    'templating/dom'
], function(dom) {

    const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,
        ARGUMENT_NAMES = /(?:^|,)\s*([^\s,=]+)/g;

    function getArgs(func) {
        let fnStr = func.toString().replace(STRIP_COMMENTS, ''),
            argsList = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')),
            result = argsList.match(ARGUMENT_NAMES);
        return (result === null) ? [] : result.map(item => item.replace(/[\s,]/g, ''));
    }

    function destroyComponent(cp) {
        if (cp.remove !== undefined) {
            cp.remove();
        }

    }

    function applyToChildren(children, cb) {
        if (children !== undefined) {
            Object.keys(children).forEach((name) => {
                let instance = children[name];
                if (!applyToGroup(instance, cb)) {
                    cb(instance);
                }
            });
        }
    }

    function applyToGroup(child, cb) {
        if (child.elGroup && child.elGroup.size > 0) {
            child.elGroup.forEach((childInstance) => {
                cb(childInstance);
            });
            return true;
        }
        return false;
    }


    function matchRoute(child, context) {
        if (child.setContext) {
            child.setContext(context);
        } else {
            let route = (child.data !== undefined) ? child.data.route : undefined;
            if (route !== undefined && child.data.type === 'rt') {
                let id,
                    match = context.match,
                    active = context.active,
                    matches = match(route),
                    oldParams = context.oldParams = context.oldParams || false,
                    routesQueried = context.routesQueried = context.routesQueried || [],
                    childMatch = new Map();

                matches.to((...args) => {
                    let params = args.pop();
                    id = (args.length > 0) ? params.getLocation() + '_' + args.join('_') : undefined;

                    if (!applyToGroup(child, instance => dom.attach(instance))) {
                        let childInstance = child.run(true);
                        applyToChildren(childInstance.children, instance => {
                            if (instance) {
                                //TODO: maybe not need Object.assign
                                childMatch.set(instance, match(route, match => matchRoute(instance, Object.assign({}, context, {
                                    match,
                                    active
                                }))));
                            }
                        });
                    }
                    applyToGroup(child, (childInstance) => {
                        applyToChildren(childInstance.children, instance => {
                            if (instance && instance.to) {
                                instance.to(...args.concat(params));
                            }
                        });
                    });
                });

                matches.leave(done => {
                    routesQueried = [];
                    let items = 0,
                        stopped = false;
                    applyToGroup(child, (childInstance) => {
                        let finish = () => {
                                if (!id) {
                                    dom.detach(childInstance);
                                } else {
                                    applyToChildren(childInstance.children, instance => {
                                        const childRoute = childMatch.get(instance);
                                        if (childRoute) {
                                            childRoute.remove();
                                            childMatch.delete(instance);
                                        }
                                    });
                                    destroyComponent(childInstance);
                                }
                            },
                            close = (close = true) => {
                                if (close) {
                                    items--;
                                } else {
                                    stopped = true;
                                    done(false);
                                }

                                if (items === 0 && !stopped) {
                                    active.set(childInstance, finish);
                                    done(true);
                                }

                            };

                        applyToChildren(childInstance.children, instance => {
                            if (instance && instance.leave !== undefined) {
                                let args = getArgs(instance.leave);
                                if (args.length > 0) {
                                    items++
                                }
                                instance.leave(close);
                            }
                        });

                        if (items === 0) {
                            active.set(childInstance, finish);
                            done(true);
                        }
                    });
                });

                matches.query(params => {
                    //TODO: currently is a hack, later need better solution;
                    let query = JSON.stringify(params.getQuery());
                    if (oldParams !== query) {
                        oldParams = query;
                        routesQueried = [];
                    }
                    applyToGroup(child, (childInstance) => {
                        applyToChildren(childInstance.children, (instance) => {
                            if (instance && instance.query !== undefined && routesQueried.indexOf(instance) === -1) {
                                instance.query(params);
                                routesQueried.push(instance);
                            }
                        });
                    });
                });
                applyToGroup(child, instance => instance._activeRoute = matches);

            } else if (child.children !== undefined && ['cp'].indexOf(child.data.type) === -1) {
                applyToChildren(child.children, instance => matchRoute(instance, context));
            }
        }
    }

    function setRoutes(children, context) {
        applyToChildren(children, child => matchRoute(child, context));

    };

    return setRoutes;
})
;