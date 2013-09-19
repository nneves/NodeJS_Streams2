var fs = require('fs');
var stream = require('stream');
var	path = process.argv[2];
var	readableStream;
var readableSize = 4*256;
var	writableStream;
var transformStream;

var util = require('util');
var Transform = require('stream').Transform;
util.inherits(SimpleProtocol, Transform);

function SimpleProtocol(options) {
  if (!(this instanceof SimpleProtocol))
    return new SimpleProtocol(options);

  Transform.call(this, options);

  this.array_block = [];
  this.array_strbuffer = "";
  //this.lines_counter = 0;
}

SimpleProtocol.prototype._transform = function(chunk, encoding, done) {

  /*
  console.log("\r\n");
  console.log("-----------------------------------------------------");
  console.log("[Transform]: Print chunck data:");
  console.log("-----------------------------------------------------");
  console.log("%s", chunk); */

  // count number of lines present in the data block
  var internalcounter = (chunk.match(/\n/g)||[]).length;
  /*
  console.log("-----------------------------------------------------");
  console.log("[Transform]: Found %d lines", internalcounter);
  console.log("-----------------------------------------------------");
  */

  // split stream data into lines of strings (array)
  this.array_block = chunk.split("\n");
  
  // pre-adds previous partial line to the new data
  if (this.array_block.length > 0)
    this.array_block[0] = this.array_strbuffer + this.array_block[0];
//--> missing else code ???

  // test if the last line is an incomplete line, if so 
  // buffers it to be pre-added into the next data block
  this.array_strbuffer = "";
  if (this.array_block.length > 1) {
    this.array_strbuffer = this.array_block[this.array_block.length - 1];
    this.array_block.splice(this.array_block.length - 1);
  }

  //console.log("[core.js]:iStream: Preparing to print Block Data:");
  var jsonData;
  for (var i=0; i<this.array_block.length; i++) {
    //console.log("[ %s ]",this.array_block[i]);
    jsonData = {'CMD': this.array_block[i]};
    //this.array_block[i] = '['+this.array_block[i]+']';
    this.array_block[i] = JSON.stringify(jsonData);
  }

  this.push(this.array_block.join('\n'));  

  // now, because we got some extra data, emit this first.
  /*
  if(this.array_strbuffer.length !== 0) {
    console.log("Found incomplete line data (pushing into next chunk): %s", this.array_strbuffer);
    this.push(this.array_strbuffer);
  } */

  done();
};


// writable stream
function write(chunk, encoding, callback) {
 
  /*
  console.log('\r\n');
  console.log('--------------------------------------');
  console.log('Write to Printer');
  console.log('--------------------------------------');
  */
  console.log("%s", chunk);
  //process.stdout.write('\u001b[32m' + chunk + '\u001b[39m'); 

  setTimeout( 
  	function () { 
  		/*
		console.log('\r\n');
  		console.log('--------------------------------------');
  		console.log('Requesting more data from readableStream!');
  		console.log('--------------------------------------');
  		*/

  		//readableStream.emit('drain');
      	writableStream.emit('drain');
  	}, 5);
  

  return false; // will pause the stream flow
};

// main
function main () {
	console.log("Launching Main();");
	
	// check if .gcode file is inserted via command line arguments
	if (path !==undefined ) {
		readableStream = fs.createReadStream(path, {encoding: 'utf8', highWaterMark : 8});
		writableStream = stream.Writable({highWaterMark : 8});
		transformStream = new SimpleProtocol({decodeStrings: false, size: 8, highWaterMark: 8});

		//readableStream.setEncoding('utf8');
		//process.stdout.setEncoding('utf8');
		//readableStream.pipe(process.stdout);

		// Pipe readableStream -> writableStream
		readableStream.pipe(transformStream, {end: false}).pipe(writableStream, {end: false});

		readableStream.once('end', function() {
  			console.log('Readable Stream Ended');
		});

		writableStream.write = write;

		writableStream.once('finish', function() {
  			console.log('Writable Stream Ended');
		});		
	}
	else {
		console.log("Get stream from STDIN pipe...");

		//process.stdin.setEncoding('utf8');
		//process.stdin.pipe(writableStream { end: false });
		//printercore.oStreamPrinter.pipe(process.stdout);
	}

  readableStream.read(readableSize);
}


main();
