/**
 * Created by guntars on 28/10/14.
 */
define(()=> {
    return (count, timeout)=> {
        let rows = (count)=> {
                let out = [];
                for (let id = 0; id <= count; id++) {
                    let items = {
                        value: [{
                            name:    'value:' + id,
                            tooltip: 'value tooltip:' + id
                        }, {
                            name:    'set:' + id,
                            tooltip: 'set tooltip:' + id
                        }, {
                            name:    'element:' + id,
                            tooltip: 'element tooltip:' + id
                        }, {
                            name:    'test:' + id,
                            tooltip: 'test tooltip:' + id
                        }, {
                            name:    'other:' + id,
                            tooltip: 'other tooltip:' + id
                        }, {
                            name:    'class:' + id,
                            tooltip: 'class tooltip:' + id
                        }],
                        id:    id
                    };
                    out.push(items);
                }
                return out;
            },
            result = rows(count);

        let data = {
            table: {
                thead: [
                    '#',
                    'Set',
                    'Element',
                    'test',
                    'Other',
                    'Class'
                ],
                tbody: result
            },
        }
        let interval = false,
            start = ()=> {
                if (!interval) {
                    interval = setInterval(()=> {
                        result.forEach((items)=> {
                            let id = items.id + 1;
                            items.value.forEach(item=> {
                                item.name = item.name.split(':')[0] + ':' + id;
                                item.tooltip = item.tooltip.split(':')[0] + ':' + id;
                            });
                            items.id = id;
                        });
                    }, timeout);
                }
            }, stop = ()=> {
                if (interval) {
                    clearInterval(interval);
                    interval = false;
                }
            }


        return {data, start, stop};
    }
})
;