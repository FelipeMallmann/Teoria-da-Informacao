var methods = {

    encode: function (data) {
        var encoding = [];
        var prev, count, i;
        for (count = 1, prev = data[0], i = 1; i < data.length; i++) {
            if (data[i] != prev) {
                console.log(data[i])
                encoding.push([count, prev]);
                count = 1;
                prev = data[i];
            }
            else 
                count ++;
        }
        encoding.push([count, prev]);
        return encoding;
    },

    decode: function (data) {
        var output = "";
        data.forEach(function(pair){ output += new Array(1+pair[0]).join(pair[1]) })
        return output;
    }

};
exports.data = methods
