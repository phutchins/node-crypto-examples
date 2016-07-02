var crypto = require('crypto-browserify');
var myModule = require('../public/js/myModule.js');
var client = new BinaryClient('ws://localhost:9000');
var stream = require('stream');
var WritableStream = stream.Writable();
var FileStream = require('file-stream');
var through = require('through');
//var Buffer = require('buffer');
//var Writable = require('stream').Writable;

client.on('stream', function(stream, meta) {
  // Create a writable stream so pipe the incoming data through
  //var writable = new Writable();
  console.log('Got stream from server for file %s', meta.name);

  var logStream = through(function(data) { console.log('logStream1: ', data); this.queue(data) })
  //var logStream2 = through(function(data) { console.log('logStream2: ', data); this.queue(data) })

  //var fileWriteStream = streamSaver.createWriteStream(meta.name);
  //var fileWriteStream = streamSaver.createWriteStream("test.file");

  // Send the blob through the encrypter
  var sessionKey = crypto.randomBytes(16);
  var iv = crypto.randomBytes(16);

  console.log('sessionKey: %s', sessionKey.toString('hex'));
  console.log('iv: %s', iv.toString('hex'));

  // Hardcoding sessionKey and iv for testing
  var sessionKeyTest = new Buffer('93d1d1541a976333673935683f49b5e8', 'hex');
  var ivTest = new Buffer('27c3465f041e046a61a6f8dc01f0db3d', 'hex');

  // Should use authentication: http://lollyrock.com/articles/nodejs-encryption/
  // Init the cyper bits
  var decipher = crypto.createDecipheriv('aes-128-cbc', sessionKeyTest, ivTest);
  var fileBuffer = new Buffer([], 'binary');
  // Also should ZIP this before encrypt
  //stream.pipe(logStream).pipe(decipher).pipe(logStream2).on('data', function(chunk) {

  //stream.pipe(logStream).pipe(decipher).on('data', function(chunk) {
  stream.pipe(logStream).on('data', function(chunk) {
    fileBuffer = Buffer.concat([fileBuffer, Buffer(chunk, 'binary')]);
  }).on('end', function() {
    var blob = new Blob([fileBuffer], { type: 'octet/stream' });
    var url = URL.createObjectURL(blob);
    window.open(url);
  });
  //stream.pipe(decipher).pipe(fileWriteStream);
  //stream.pipe(decipher);
  //stream.pipe(logStream).pipe(fileWriteStream);
  //logStream.write('this is a test').pipe(fileWriteStream);
  //fileWriteStrea.write(null);
  //stream.pipe(decipher);

  /*
  decipher.on('readable', function() {
    var data = decipher.read();
    if (data) {
      fileWriteStream.push(data.toString('binary'));
    }
  });
  */

  //decipher.on('data', function(e) {
  //  debugger;
  //});

  /*
  stream.on('data', function(data) {
    // pipe the data to a writable stream
    cipher.push(data);
  });
  */

  stream.on('end', function() {
    console.log('File download completed.');
  });
});

client.on('open', function(){
  var self = this;
  var box = $('#box');

	// Send the blob through the encrypter
	var sessionKey = crypto.randomBytes(16);
	var iv = crypto.randomBytes(16);

	// Hard coding sessionKey and iv for testing
  var sessionKeyTest = '93d1d1541a976333673935683f49b5e8';
  var ivTest = '27c3465f041e046a61a6f8dc01f0db3d';

  var sessionKeyTestBuff = new Buffer(sessionKeyTest, 'hex');
  var ivTestBuff = new Buffer(ivTest, 'hex');

	window.nodeCrypto = crypto;
	window.myModule = myModule;

	document.getElementById('fileinput').addEventListener('change', function(){
		//for(var i = 0; i<this.files.length; i++){
			//var file =  this.files[i];
			var file =  this.files[0];
      var logStream = through(function(data) {
        console.log('logStream decrypted: ', data);
        debugger;
        this.queue();
      });

			// This code is only for demo ...
			//console.group("File "+i);
      console.group("File 1");
      console.log("name : " + file.name);
      console.log("size : " + file.size);
      console.log("type : " + file.type);
      console.log("date : " + file.lastModified);
      console.groupEnd();

      var reader = new FileStream(file);

      reader.on('readable', function() {
        console.log('Reader is readable');

        // Init the cyper bits
        var cipher = crypto.createCipheriv('aes-128-cbc', sessionKeyTestBuff, ivTestBuff);
        console.log("Creating fileReader stream from the file");
        console.log("Creating stream with file data");
        var stream = self.createStream({name: file.name, size: file.size});

        console.log("Piping fileBuffer through cipher then stream");

        //reader.pipe(cipher).pipe(logStream).pipe(stream);
        //reader.pipe(logStream).pipe(stream);
        reader.pipe(stream);
      });

      reader.on('end', function() {
        console.log('Reader is done...');
      });

      var oldReaderEmit = reader.emit;

      reader.emit = function() {
        var emitArgs = arguments;
        console.log('emitting: ', emitArgs);
        oldReaderEmit.apply(reader, arguments);
      };
	}, false);

});

  /*
  box.on('dragenter', doNothing);
    box.on('dragover', doNothing);
    box.text('Drag files here');
    box.on('drop', function(e){
      e.originalEvent.preventDefault();
      var file = e.originalEvent.dataTransfer.files[0];

       // Add to list of uploaded files
       $('<div align="center"></div>').append($('<a></a>').text(file.name).prop('href', '/'+file.name)).appendTo('body');

      // `client.send` is a helper function that creates a stream with the
      // given metadata, and then chunks up and streams the data.
      var stream = client.send(file, {name: file.name, size: file.size});

      // Print progress
      var tx = 0;
      stream.on('data', function(data){
        $('#progress').text(Math.round(tx+=data.rx*100) + '% complete');
      });
    });
  });
  */

