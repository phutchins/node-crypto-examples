var express = require('express');
var app = express();
var BinaryServer = require('binaryjs').BinaryServer;
var fs = require('fs');

app.use(express.static('public'));

var server = BinaryServer({port: 9000});

server.on('connection', function(client){
  client.on('stream', function(binStream, meta){
    console.log("Got stream for file %s", meta.name);

    var file = fs.createWriteStream(meta.name, { autoClose: true });

    file.on('finish', function() {
      console.log('All writes done!');

      console.log('Reading file test_file.txt to send to user');
      var fileStream = fs.createReadStream(__dirname + '/file_to_upload_yeah');
      console.log('Streaming file to user as test_file_returned.txt');
      client.send(fileStream, { name: 'test_file_returned.txt' });
    });

    binStream.pipe(file);

		var oldEmit = binStream.emit;

		binStream.emit = function() {
				var emitArgs = arguments;
				console.log('emitting: ', emitArgs);
				oldEmit.apply(binStream, arguments);
		};

    binStream.on('end', function() {
      console.log('Got stream end');
      file.end();
    });

    console.log('Saving file to disk');

  });



 /*
  var s = new stream.Readable();
  s._read = function noop() {}; // redundant? see update below
  s.push('this is some text to send');
  s.push(null);

  client.send(s, { name: 'test_file1.txt' });
  */
});

app.listen(4000, function() {
  console.log('Crypto-test Listening on port 4000');
});
