/**
 * Created by guntars on 28/10/14.
 */
define({
    tasks:     {
        items: [
            {
                value:     'task1',
                completed: {
                    checked: false
                },

                show: 'show'
            },
            {
                value:     'task2',
                completed: {
                    checked: true
                },
                show:      'show'
            },
            {
                value:     'task3',
                completed: {
                    checked: false
                },
                show:      'show'
            }
        ]
    },
    selection: {
        buttons: [
            {
                text:  'All',
                class: 'active'
            },
            {
                text:  'Active',
                class: 'none'
            },
            {
                text:  'Completed',
                class: 'none'
            },

        ]
    }
});