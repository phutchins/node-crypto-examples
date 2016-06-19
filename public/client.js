var crypto = require('crypto-browserify');
var myModule = require('../public/js/myModule.js');
var client = new BinaryClient('ws://localhost:9000');
var stream = require('stream');
var WritableStream = stream.Writable();
var FileStream = require('file-stream');
var buffer = require('buffer');
//var Writable = require('stream').Writable;

client.on('stream', function(stream, meta) {
  // Create a writable stream so pipe the incoming data through
  //var writable = new Writable();
  var fileWriteStream = streamSaver.createWriteStream(meta.name);

  // Send the blob through the encrypter
  var sessionKey = crypto.randomBytes(16);
  var iv = crypto.randomBytes(16);

  // Hardcoding sessionKey and iv for testing
  var sessionKeyTest = new Buffer.from('9Ur3xaienoZ2ZbgCjKAtcw==', 'base64');
  //var sessionKeyTest = new Buffer.from('a4f5bad1b6e6175a900d5f37f532ff14', 'base64');
  var ivTest = new Buffer.from('PYY8oOJL7wN6OSqKjUBZzA==', 'base64');
  //var ivTest = '2e123bb5cc238a276689fc42dca65643';

  console.log('sessionKey: %s', sessionKey.toString('hex'));
  console.log('iv: %s', iv.toString('hex'));

  // Should use authentication: http://lollyrock.com/articles/nodejs-encryption/
  // Init the cyper bits
  var decipher = crypto.createDecipheriv('aes-128-cbc', sessionKeyTest, ivTest);
  //cipher.pipe(fileWriteStream);
  //stream.pipe(cipher).pipe(fileWriteStream);;

  // Also should ZIP this before encrypt
  stream.pipe(decipher);
  //stream.pipe(decipher).pipe(fileWriteStream);

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

	// Send the blob through the encrypter
	var sessionKey = crypto.randomBytes(16);
	var iv = crypto.randomBytes(16);

  function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
  }

  function str2uint8ab(str) {
    var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
    var bufView = new Uint8Array(buf);
    for (var i=0, strLen=str.length; i<strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return bufView;
  }

	// Hard coding sessionKey and iv for testing
	//var sessionKeyTest = 'a4f5bad1b6e6175a900d5f37f532ff14';
	//var ivTest = '2e123bb5cc238a276689fc42dca65643';
  var sessionKeyTest = '9Ur3xaienoZ2ZbgCjKAtcw==';
  var ivTest = 'PYY8oOJL7wN6OSqKjUBZzA==';

  var sessionKeyTestBuff = str2uint8ab(sessionKeyTest);
  var ivTestBuff = str2uint8ab(ivTest);

  debugger;

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

      // Init the cyper bits
      var cipher = crypto.createCipheriv('aes-128-cbc', sessionKeyTestBuff, ivTestBuff);

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

