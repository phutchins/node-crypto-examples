'use strict'

module.exports = Readable
// Streams implemented in pure JavaScript
//
// Using NodeJS ReadableStream for reference
// https://github.com/nodejs/readable-stream/blob/master/lib/_stream_readable.js


function Readable(file, options) {
  if (!(this instanceof Readable)) return new Readable(file, options);

  this.options = options;
  this.file = file;

  console.log('Created new instances of Readable with file %s', file.name);

  this._readableState = new ReadableState(options, this);

  // Start the reading?
  Readable.read(0);
}

Readable.prototype = {

};

Readable.prototype.read = function(n) {
  console.log('Reading %s', n);
  var state = this._readableState;
  var nOrig = n;

  // Start reading the file
  // If we dont' have any data in the buffer, read up to the limit then stop
  // If the buffer is full, emit ready?
};

// Example for chunking
function parseFile(file, callback) {
    var fileSize   = file.size;
    var chunkSize  = 64 * 1024; // bytes
    var offset     = 0;
    var self       = this; // we need a reference to the current object
    var chunkReaderBlock = null;

    var readEventHandler = function(evt) {
        if (evt.target.error == null) {
            offset += evt.target.result.length;
            callback(evt.target.result); // callback for handling read chunk
        } else {
            console.log("Read error: " + evt.target.error);
            return;
        }
        if (offset >= fileSize) {
            console.log("Done reading file");
            return;
        }

        // of to the next chunk
        chunkReaderBlock(offset, chunkSize, file);
    }

    chunkReaderBlock = function(_offset, length, _file) {
        var r = new FileReader();
        var blob = _file.slice(_offset, length + _offset);
        r.onload = readEventHandler;
        r.readAsText(blob);
    }

    // now let's start the read with the first block
    chunkReaderBlock(offset, chunkSize, file);
}


function ReadableState(options, stream) {
  options = options || {};

  this.objectMode = !!options.objectMode;

  // Could implement duples (readable & writable) here

  var hwm = options.highWaterMark;
  var defaultHWM = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm ===0 ? hwm : defaultHWM;

  this.buffer = [];
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  this.sync = true;

  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;

  this.defaultEncoding = options.defaultEncoding || 'utf8';

  this.ranOut = false;

  this.awaitDrain = 0;

  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;

  /*
  if (options.encoding) {
    if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.enoding;
  }
  */
}

Readable.prototype.pipe = function (dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }

  state.pipes.Count += 1;
};
