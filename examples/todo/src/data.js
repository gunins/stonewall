/**
 * Created by guntars on 28/10/14.
 */
define({
    tasks: {
        items: [
            {
                item: {
                    value: 'task1',
                    completed: {
                        checked: false
                    }
                },
                show: 'show'
            },
            {
                item: {
                    value: 'task2',
                    completed: {
                        checked: true
                    }
                },
                show: 'show'
            },
            {
                item: {
                    value: 'task3',
                    completed: {
                        checked: false
                    }
                },
                show: 'show'
            }
        ]
    },
    selection: {
        buttons: [
            {
                text: 'All',
                class: 'active'
            },
            {
                text: 'Active',
                class: 'none'
            },
            {
                text: 'Completed',
                class: 'none'
            },

        ]
    }
});