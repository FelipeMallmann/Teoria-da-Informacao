var fs = require("fs"); // Open, read and close files
var readlineSync = require('readline-sync'); // Read console lines

/*
var rle = require('./algorithms/rle.js'); // rle.data.encode(data)
var mtf = require('./algorithms/mtf.js'); // mtf.data.encode(data, charList)
var bwt = require('./algorithms/bwt.js'); // bwt.data.encode(data, maxLength, escapeChar)
var lzw = require('./algorithms/lzw.js'); // lzw.data.encode(data)
*/

var ppm = require('compressjs').PPM; // ppm
var bwtc = require('compressjs').BWTC // bwtc
var compressjs = require("js-string-compression"); // huffman
var hm = new compressjs.Hauffman(); // huffman

var originalFile = process.cwd() + "\\Desktop\\trab Felipe Mallmann\\alice29.txt";
var compressedFile = process.cwd() + "\\Desktop\\trab Felipe Mallmann\\c_alice29.txt";

var option = readlineSync.question("Options:\n1 - Encode alice29.txt\n2 - Decode alice29.txt\n\n");
while (option != "1" && option != "2") 
    option = readlineSync.question("Options:\n1 - Encode alice29.txt\n2 - Decode alice29.txt\n\n");

if ( option == "1" ){
    fs.stat(originalFile, function(err, stat) {
        if (err)
            return console.log("Arquivo original não encontrado")
        compress(1,0)
    })
}else{
    fs.stat(compressedFile, function(err, stat) {
        if (err)
            return console.log("Arquivo original não encontrado")
        decompress(2,0)
    })
}



// ======================== [ COMPRESSING : PPM > BWT > LZW > Huffman ] ===============================================
function compress(step, previousStep){

    fs.stat(originalFile, function(err, stat) {
        if (err){
            return console.log("Arquivo original não encontrado")
            process.exit(1);
        }
    })

    var lastStep = 3;
    var readFile = ( previousStep == 0 && originalFile ) || process.cwd() + "\\Desktop\\trab Felipe Mallmann\\steps\\e_step" + previousStep + ".txt"
    var saveFile = ( step == lastStep && compressedFile ) || process.cwd() + "\\Desktop\\trab Felipe Mallmann\\steps\\e_step" + step + ".txt"

    // PPM
    if (step == 1){ 
        fs.readFile(readFile, 'utf8', function (err,data) {           
            var buffer = new Buffer(data, 'utf8');
            var compressed = ppm.compressFile(buffer);
            fs.writeFile(saveFile, compressed, function (err) {
                var nextStep = 2; compress(nextStep, step)
            });
        })
    }

    // BWT + rle
    else if ( step == 2 ){         
        fs.readFile(readFile, 'utf8', function (err,data) {           
            var buffer = new Buffer(data, 'utf8');
            var compressed = bwtc.compressFile(buffer);
            fs.writeFile(saveFile, compressed, function (err) {
                var nextStep = 3; compress(nextStep, step)
            });
        })    

        /* Com esse BWT modificado o resultado fica um pouco melhor porem para decodificar isso demora MUITO tempo.
        var escapeChar = "e"; // Simbolo E como escape pois não é um simbolo usado nessa etapa ( ,1234567890 )
        var maxLength = 200;

        fs.readFile(readFile, 'utf8', function (err,data) {
            var array = data.split(",").map(Number);
            var txt = ""
            for ( var i = 0; i < array.length; i++){
                txt = txt + parseInt(parseInt(array[i]), 10).toString(2) + ","
            }

            var tempStr = ""
            var i = 0;
            while (maxLength * i < txt.length){
                var temp = txt.substring(maxLength * i, maxLength * (i + 1))
                tempStr = tempStr + bwt(1, temp) + escapeChar;
                i++;
            }
            tempStr = tempStr.replace(/,/g, '%');
            fs.writeFile(saveFile, tempStr, function (err) {
                var nextStep = 3;
                compress(nextStep, step)
            });
        })
        */
    }

    /* LZW
    else if ( step == 3 ){
        fs.readFile(readFile, 'utf8', function (err,data) {
            fs.writeFile(saveFile, lzw.data.encode(data), function (err) {
                var nextStep = 4; compress(nextStep, step)
            });
        })
    }*/

    // Huffman (END)
    else if ( step == 3 ){
        fs.readFile(readFile, 'utf8', function (err,data) {
            fs.writeFile(saveFile, hm.compress(data), function (err) {});
            fs.unlink(originalFile,function(err){});             
        })
    }
}


// ======================== [ DECOMPRESSING : Huffman > LZW > BWT > PPM ] ===============================================
function decompress(step, previousStep){

    var lastStep = 0;
    var readFile = ( previousStep == 0 && compressedFile ) || process.cwd() + "\\Desktop\\trab Felipe Mallmann\\steps\\d_step" + previousStep + ".txt"
    var saveFile = ( step == lastStep && originalFile ) || process.cwd() + "\\Desktop\\trab Felipe Mallmann\\steps\\d_step" + step + ".txt"

    // Huffman > LZW
    if ( step == 2 ){
        fs.readFile(readFile, 'utf8', function (err,data) {
            fs.writeFile(saveFile, hm.decompress(data), function (err) {
                var nextStep = 1; decompress(nextStep, step)
            })
        })
    }

    /* LWZ > BWT
    else if ( step == 1 ){
        fs.readFile(readFile, 'utf8', function (err,data) {
            data = data.substring(0, data.length-3)         
            var array = data.split(",").map(Number);
            fs.writeFile(saveFile, lzw.data.decode(array), function (err) {
                var nextStep = 0; decompress(nextStep, step)
            });
        })
    }*/

    // BWT > PPM
    else if ( step == 1 ){
        fs.readFile(readFile, 'utf8', function (err,data) {
            var array = data.split(",").map(Number);
            var decompressed = BWTC.decompressFile(array);
            var data = new Buffer(decompressed).toString('utf8');
            fs.writeFile(saveFile, data, function (err) {
                var nextStep = 0; decompress(nextStep, step)
            });
        })
    }

    // PPM > Original File
    else if ( step == 0 ){
        fs.readFile(readFile, 'utf8', function (err,data) {
            var array = data.split(",").map(Number);
            var decompressed = ppm.decompressFile(array);
            var data = new Buffer(decompressed).toString('utf8');
            fs.writeFile(saveFile, data, function (err) {});
            fs.unlink(compressedFile,function(err){}); 
        })
    }
}