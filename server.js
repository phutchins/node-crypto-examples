var express = require('express');
var app = express();
var BinaryServer = require('binaryjs').BinaryServer;
var fs = require('fs');

app.use(express.static('public'));

var server = BinaryServer({port: 9000});

server.on('connection', function(client){
  client.on('stream', function(binStream, meta){
    var self = this;
    self.fileName = meta.name;

    console.log("Got stream for file %s", meta.name);

    var file = fs.createWriteStream(meta.name, { autoClose: true });

    file.on('finish', function() {
      console.log('All writes done!');

      console.log('Reading file %s to send to user', self.fileName);
      var fileStream = fs.createReadStream(__dirname + '/' + self.fileName);
      console.log('Streaming file to user as %s', self.fileName);
      client.send(fileStream, { name: self.fileName});
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
});

app.listen(4000, function() {
  console.log('Crypto-test Listening on port 4000');
});
