function(data) {
    var getRandom = function (min, max) {
        var last_random = (arguments[2] >= 0) ? arguments[2] : -1;
        var random = Math.floor(Math.random() * (max - min + 1)) + min;
        if (last_random == random) {
            return getRandom(min, max, last_random);
        }
        return random;
    }
    var max = data.rows.length - 1;
    var item_right_number = getRandom(0, max);
    var item_left_number = getRandom(0, max, item_right_number);
    return {
        featured_right: data.rows[item_right_number],
        featured_left: data.rows[item_left_number]
    };
}