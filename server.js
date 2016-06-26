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

    file.on('finish', function() {
      console.log('All writes done!');

      console.log('Reading file test_file.txt to send to user');
      var fileStream = fs.createReadStream(__dirname + '/test_file.txt');
      console.log('Streaming file to user as test_file_returned.txt');
      client.send(fileStream, { name: 'test_file_returned.txt' });
    });

    console.log('Saving file to disk');

    binStream.pipe(file).on('finish', function() {
      console.log('got finish');
    });
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
