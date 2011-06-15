function(data) {
    //$.log(data)
    var items = [];
    for (var i = 0; i < data.rows.length; i++) {
        var found = false;
        if (items.length > 0) {
            for (var j = 0; j < items.length; j++) {
                if (items[j]['letter'] == data.rows[i].key) {
                    items[j]['terms'].push(data.rows[i].value);
                    found = true;
                    break;
                }
            }
        }
        if (!found) {
            items.push({
                letter: data.rows[i].key,
                terms: [data.rows[i].value]
            });
        }
    }
    return {items : items};
};