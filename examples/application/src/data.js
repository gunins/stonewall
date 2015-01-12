/**
 * Created by guntars on 10/10/2014.
 */
define([
    'resultData'
], function (resultData) {
    return {
        sidebar: {
            group: {
                links: [
                    {link: {text: 'Table', href: '#/dashboard/table'}, class: 'inactive'},
                    {link: {text: 'Chart', href: '#/dashboard/chart'}, class: 'inactive'},
                    {link: {text: 'Export', href: '#/dashboard/link3'}, class: 'inactive'},
                    {link: {text: 'Nav item', href: '#/dashboard/link4'}, class: 'inactive'}
                ]
            }
        },
        body: {
            tabs: [
                {
                    class: 'idle',
                    link: {
                        href: '#/dashboard/table',
                        text: 'Table'
                    }
                },
                {
                    class: 'idle',
                    link: {
                        href: '#/dashboard/chart',
                        text: 'Chart'
                    }
                }
            ],
            pie1: {
                chartcontent: {
                    data: [
                        {age: '<5', population: 2704659},
                        {age: '5-13', population: 4499890},
                        {age: '14-17', population: 2159981},
                        {age: '18-24', population: 3853788},
                        {age: '25-44', population: 14106543},
                        {age: '45-64', population: 8819342},
                        {age: '≥65', population: 612463}
                    ]
                }
            },
            pie2: {
                chartcontent: {
                    data: [
                        {age: '<5', population: 2704659},
                        {age: '5-13', population: 4499890},
                        {age: '14-17', population: 2159981},
                        {age: '18-24', population: 3853788},
                        {age: '25-44', population: 14106543},
                        {age: '45-64', population: 8819342},
                        {age: '≥65', population: 612463}
                    ]
                }
            },
            pie3: {
                chartcontent: {
                    data: [
                        {age: '<5', population: 2704659},
                        {age: '5-13', population: 4499890},
                        {age: '14-17', population: 2159981},
                        {age: '18-24', population: 3853788},
                        {age: '25-44', population: 14106543},
                        {age: '45-64', population: 8819342},
                        {age: '≥65', population: 612463}
                    ]
                }
            },
            pie4: {
                chartcontent: {
                    data: [
                        {age: '<5', population: 2704659},
                        {age: '5-13', population: 4499890},
                        {age: '14-17', population: 2159981},
                        {age: '18-24', population: 3853788},
                        {age: '25-44', population: 14106543},
                        {age: '45-64', population: 8819342},
                        {age: '≥65', population: 612463}
                    ]
                }
            },
            results:resultData

        }
    }

});