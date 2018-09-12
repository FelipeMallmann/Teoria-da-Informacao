var methods = {

    encode: function (data) {
        "use strict";
        var i, dictionary = {}, c, wc, w = "", result = [], dictSize = 256;
        for (i = 0; i < 256; i += 1) {
            dictionary[String.fromCharCode(i)] = i;
        }
 
        for (i = 0; i < data.length; i += 1) {
            c = data.charAt(i);
            wc = w + c;
            if (dictionary.hasOwnProperty(wc)) {
                w = wc;
            } else {
                result.push(dictionary[w]);
                dictionary[wc] = dictSize++;
                w = String(c);
            }
        }

        if (w !== "") {
            result.push(dictionary[w]);
        }
        return result;
    },

    decode: function (data) {
        "use strict";
        var i, dictionary = [], w, result, k, entry = "", dictSize = 256;
        for (i = 0; i < 256; i += 1) {
            dictionary[i] = String.fromCharCode(i);
        }
 
        w = String.fromCharCode(data[0]);
        result = w;
        for (i = 1; i < data.length; i += 1) {
            k = data[i];
            if (dictionary[k]) {
                entry = dictionary[k];
            } else {
                if (k === dictSize) {
                    entry = w + w.charAt(0);
                } else {
                    return null;
                }
            }
 
            result += entry;
            dictionary[dictSize++] = w + entry.charAt(0);
            w = entry;
        }
        return result;
    }

};
exports.data = methods