var crypto = require('crypto-browserify');
var myModule = require('../public/js/myModule.js');
var client = new BinaryClient('ws://localhost:9000');
var stream = require('stream');
var WritableStream = stream.Writable();
var FlipStream = require('flip-stream-js');
var through = require('through');
var Handle = require('./handle');

// Hardcoding sessionKey and iv for testing
var sessionKey = new Buffer('93d1d1541a976333673935683f49b5e8', 'hex');
var iv = new Buffer('27c3465f041e046a61a6f8dc01f0db3d', 'hex');


client.on('open', function(){
  var self = this;
  var box = $('#box');

	// Send the blob through the encrypter
  /* Commenting this out while testing with hard coded key and iv
	var sessionKeyString = crypto.randomBytes(16);
	var ivString = crypto.randomBytes(16);

  var sessionKeyBuff = new Buffer(sessionKeyString, 'hex');
  var ivBuff = new Buffer(ivString, 'hex');
  */

	window.nodeCrypto = crypto;
	window.myModule = myModule;

	document.getElementById('fileinput').addEventListener('change', function(){
		//for(var i = 0; i<this.files.length; i++){
			//var file =  this.files[i];
			var file =  this.files[0];
      var logStream = through(function(data) {
        console.log('logStream decrypted: ', data);
        this.queue();
      });

			//console.group("File "+i);
      console.group("File 1");
      console.log("name : " + file.name);
      console.log("size : " + file.size);
      console.log("type : " + file.type);
      console.log("date : " + file.lastModified);
      console.groupEnd();

      var reader = new FlipStream.Readable(file);

      // Init the cipher bits
      var cipher = crypto.createCipheriv('aes-128-cbc', sessionKey, iv);

      console.log('Creating fileReader stream from the file: %s', file.name);
      var stream = self.createStream({name: file.name, size: file.size});

      console.log("Piping fileBuffer through cipher then stream");

      reader.pipe(cipher).pipe(stream);

      reader.on('end', function() {
        console.log('Reader is done...');
      });

      var oldReaderEmit = reader.emit;

      // Lets us know what events are being emitted
      reader.emit = function() {
        var emitArgs = arguments;
        console.log('emitting: ', emitArgs);
        oldReaderEmit.apply(reader, arguments);
      };
	}, false);
});


client.on('stream', function(fileStream, meta) {
  var handle = new window.Handle();

  var streamData = {
    fileStream: fileStream,
    metadata: meta
  };

  handle.binStream(streamData, function(err) {
    if (err) {
      return console.log("Error handling stream");
    }

    console.log("Handled strema without error");
  });
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

