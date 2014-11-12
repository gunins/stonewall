/**
 * Created by guntars on 09/10/2014.
 */
define([
    'widget/App',
    'widget/parser!container/Container'
], function (App, Container) {

    return App.extend({
        AppContainer: Container,
        setContext: function () {
            return {
                data: {
                    cmp: {
                        item: 'Binded Item From AppA'
                    },
                    cmpB: {
                        item: 'Binded Item From AppB'
                    },
                    links: {
                        items: [
                            {
                                link: {
                                    href: '#/levela',
                                    text: 'LevelA'
                                },
                                children: [
                                    {
                                        link: {
                                            href: '#/levela/levelb',
                                            text: 'Level A / Level B'
                                        },
                                        children: [
                                            {
                                                link: {
                                                    href: '#/levela/levelb/levelf',
                                                    text: 'level A / Level B / Level F'
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                link: {
                                    href: '#/levelb',
                                    text: 'LevelB'
                                },
                                children: [
                                    {
                                        link: {

                                            href: '#/levelb/levelf',
                                            text: 'Level B / Level F'
                                        }
                                    }
                                ]
                            },
                            {
                                link: {
                                    href: '#/levelc',
                                    text: 'LevelC'
                                },
                                children: [
                                    {
                                        link: {
                                            href: '#/levelc/leveld',
                                            text: 'level C / level D'
                                        },
                                        children: [
                                            {
                                                link: {
                                                    href: '#/levelc/leveld/levelf',
                                                    text: 'level C / level D /level F'
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                }
            }
        },
        init: function () {

        }
    });

});