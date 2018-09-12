var bwt = require("burrows-wheeler")

var methods = {

    encode: function (data, maxLength, escapeChar){
        var tempStr = ""
        var i = 0;
        while (maxLength * i < data.length){
            var temp = data.substring(maxLength * i, maxLength * (i + 1))
            tempStr = tempStr + bwt(1, temp) + escapeChar;
            i++;
        }
        return ( tempStr != "" ) ||  false;
    },

    decode: function (data, escapeChar){
        var data = data.split(escapeChar) 
        var tempStr = ""
        for (var i = 0; i < data.length - 1; i++){ // -1 because last position has no length
            tempStr = tempStr + bwt(-1, data[i]);          
        }
        return ( tempStr != "" ) ||  false;
    }

};
exports.data = methods