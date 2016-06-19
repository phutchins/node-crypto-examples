var crypto = require('crypto-browserify');
var myModule = require('../public/js/myModule.js');
var client = new BinaryClient('ws://localhost:9000');
var stream = require('stream');
var WritableStream = stream.Writable();
var FileStream = require('file-stream');
//var Writable = require('stream').Writable;

client.on('stream', function(stream, meta) {
  // Create a writable stream so pipe the incoming data through
  //var writable = new Writable();
  debugger;
  var fileWriteStream = streamSaver.createWriteStream(meta.name);

  // Send the blob through the encrypter
  var sessionKey = crypto.randomBytes(16);
  var iv = crypto.randomBytes(16);

  console.log('sessionKey: %s', sessionKey);
  console.log('iv: %s', iv);

  // Should use authentication: http://lollyrock.com/articles/nodejs-encryption/
  // Init the cyper bits
  var decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv);
  //cipher.pipe(fileWriteStream);
  //stream.pipe(cipher).pipe(fileWriteStream);;

  // Also should ZIP this before encrypt
  stream.pipe(decipher).pipe(fileWriteStream);

  // Create something that the cipher pushes data out to (will be a file eventually)

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

	window.nodeCrypto = crypto;
	window.myModule = myModule;

	document.getElementById('fileinput').addEventListener('change', function(){
		//for(var i = 0; i<this.files.length; i++){
			//var file =  this.files[i];
			var file =  this.files[0];
			// This code is only for demo ...
			//console.group("File "+i);
			console.group("File 1");
			console.log("name : " + file.name);
			console.log("size : " + file.size);
			console.log("type : " + file.type);
			console.log("date : " + file.lastModified);
			console.groupEnd();

      var reader = new FileStream(file);

			// Send the blob through the encrypter
			var sessionKey = crypto.randomBytes(16);
			var iv = crypto.randomBytes(16);

			// Init the cyper bits
			var cipher = crypto.createCipheriv('aes-128-cbc', sessionKey, iv);

      console.log("Creating fileReader stream from the file");

      console.log("Creating stream with file data");
      var stream = self.createStream({name: file.name, size: file.size});

      console.log("Piping fileBuffer through cipher then stream");
      reader.pipe(cipher).pipe(stream);

      var tx = 0;
      stream.on('data', function(data) {
        $('#progress').text(Math.round(tx+=data.rx*100) + '% complete');
      });
		//}
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

