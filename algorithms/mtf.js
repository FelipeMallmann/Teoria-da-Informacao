var methods = {

    encode: function (data, charList) {
        var init = {wordAsNumbers: [], charList: charList};
        return data.split('').reduce(function (acc, char) {
            var charNum = acc.charList.indexOf(char); //get index of char
            acc.wordAsNumbers.push(charNum); //add original index to acc
            acc.charList.unshift(acc.charList.splice(charNum, 1)[0]); //put at beginning of list
            return acc;
        }, init).wordAsNumbers;
    },

    decode: function (data, charList) {
        var init = {word: '', charList: charList};
        
        return data.reduce(function (acc, num) {
            acc.word += acc.charList[num] || " ";
            acc.charList.unshift(acc.charList.splice(num, 1)[0]); //put at beginning of list
            return acc;
        }, init).word;
    }

};
exports.data = methods