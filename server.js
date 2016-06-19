var express = require('express');
var app = express();
var BinaryServer = require('binaryjs').BinaryServer;
var fs = require('fs');

app.use(express.static('public'));

var server = BinaryServer({port: 9000});

server.on('connection', function(client){
  client.on('stream', function(binStream, meta){
    console.log("Got stream for file %s", meta.name);

    var file = fs.createWriteStream(meta.name);

    binStream.pipe(file);

    binStream.on('data', function(data) {
      // Do progress stuff here
    });
  });

  var fileStream = fs.createReadStream(__dirname + '/test_file.txt');
  client.send(fileStream, { name: 'test_file_returned.txt' });
});

app.listen(4000, function() {
  console.log('Crypto-test Listening on port 4000');
});
