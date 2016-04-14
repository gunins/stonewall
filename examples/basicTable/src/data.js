/**
 * Created by guntars on 28/10/14.
 */
define(()=> {
    return (count)=> {
        let rows = (count)=> {
                let out = [];
                for (let id = 0; id <= count; id++) {
                    let items = {
                        value: [{
                            name:    'value :' + id,
                            tooltip: {
                                value: id
                            }
                        }, {
                            name:    'set :' + id,
                            tooltip: {
                                value: id
                            }
                        }, {
                            name:    'element :' + id,
                            tooltip: {
                                value: id
                            }
                        }, {
                            name:    'test :' + id,
                            tooltip: {
                                value: id
                            }
                        }, {
                            name:    'other :' + id,
                            tooltip: {
                                value: id
                            }
                        }, {
                            name:    'class :' + id,
                            tooltip: {
                                value: id
                            }
                        }]
                    };
                    out.push(items);
                }
                return out;
            },
            result = rows(count);

        let data = {
            table: {
                thead: {
                    headvalue:   '#',
                    headset:     'Set',
                    headelement: 'Element',
                    headtest:    'test',
                    headother:   'Other'
                },
                tbody: result
            }
        }
        let id = count,
            interval = false,
            start = ()=> {
                if (!interval) {
                    interval = setInterval(()=> {
                        result.forEach((items)=> {
                            items.value.forEach(item=> {
                                item.name = item.name.split(':')[0] + ':' + id;
                                item.tooltip.value = id;
                            })
                        });
                        id++;
                    }, 50)
                }
            }, stop = ()=> {
                if (interval) {
                    clearInterval(interval);
                    interval = false;
                }
            }


        return {data, start, stop};
    }
});