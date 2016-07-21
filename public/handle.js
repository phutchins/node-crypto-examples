'use strict'

var crypto = require('crypto-browserify');
var stream = require('stream');
var through = require('through');

function Handle(options) {
  if (!(this instanceof Handle)) {
    return new Handle(options);
  }
}

Handle.prototype.binStream = function binStream(data, callback) {
  var fileStream = data.fileStream;
  var metadata = data.metadata
  var sessionKey = new Buffer('93d1d1541a976333673935683f49b5e8', 'hex');
  var iv = new Buffer('27c3465f041e046a61a6f8dc01f0db3d', 'hex');
  // Create a writable stream so pipe the incoming data through
  //var writable = new Writable();
  console.log('Got stream from server for file %s', metadata.name);

  debugger;

  var logStream1 = through(function(data) {
    console.log('logStream1: ', data);
    // Have to convert the data to a buffer from ArrayBuffer so that it can be decrypted
    // Need to find a better way to do this than inside of through ?
    //
    debugger;

    this.queue(new Buffer(data));
    //this.queue(data);
  });

  var logStream2 = through(function(data) {
    console.log('logStream2: ', data); this.queue(data)
  });

  //var fileWriteStream = streamSaver.createWriteStream(meta.name);
  //var fileWriteStream = streamSaver.createWriteStream("test.file");

  console.log('sessionKey: %s', sessionKey.toString('hex'));
  console.log('iv: %s', iv.toString('hex'));

  // Should use authentication: http://lollyrock.com/articles/nodejs-encryption/
  // Init the cyper bits
  var decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv);
  var fileBuffer = new Buffer([], 'binary');
  // Also should ZIP this before encrypt

  console.log('Receiving file, piping through decipher, then saving');

  var passthrough = stream.PassThrough();

  debugger;

  //stream.pipe(logStream1).pipe(decipher).pipe(logStream2).on('data', function(chunk) {

  fileStream.pipe(logStream1).pipe(passthrough).pipe(decipher).pipe(logStream2).on('data', function(chunk) {
  //fileStream.pipe(decipher).pipe(logStream2).on('data', function(chunk) {
    console.log('Pushing chunk to fileBuffer for saving to disk');
    debugger;
    var chunkString = chunk.toString('binary');
    debugger;
    fileBuffer = Buffer.concat([fileBuffer, Buffer(chunkString, 'binary')]);
  }).on('end', function() {
    var blob = new Blob([fileBuffer], { type: 'octet/stream' });
    var url = URL.createObjectURL(blob);
    window.open(url);
  });

  passthrough.on('end', function() {
    console.log('File download completed.');
  });
};

window.Handle = Handle;
