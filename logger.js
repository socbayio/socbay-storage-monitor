var fs = require("fs");
const path = require("path");

var Logger = (exports.Logger = {});

// createWriteStream takes in options as a second, optional parameter
// if you wanted to set the file encoding of your output file you could
// do so by setting it like so: ('logs/debug.txt' , { encoding : 'utf-8' });
var infoStream = fs.createWriteStream(path.join(__dirname,"logs","info.txt"), {'flags': 'a'});
var errorStream = fs.createWriteStream(path.join(__dirname,"logs","error.txt"), {'flags': 'a'});
var crustSocbayPinnerStream = fs.createWriteStream(path.join(__dirname,"logs","crustSocbayPinnerLog.txt"), {'flags': 'a'});
var debugStream = fs.createWriteStream(path.join(__dirname,"logs","debug.txt"), {'flags': 'a'});

Logger.info = function(msg) {
  var message = new Date().toUTCString() + " : " + msg + "\n";
  infoStream.write(message);
};

Logger.debug = function(msg) {
  var message = new Date().toUTCString() + " : " + msg + "\n";
  debugStream.write(message);
};

Logger.error = function(msg) {
  var message = new Date().toUTCString() + " : " + msg + "\n";
  errorStream.write(message);
};

Logger.crustSocbayPinner = function(msg) {
    var message = new Date().toUTCString() + " : " + msg + "\n";
    crustSocbayPinnerStream.write(message);
};