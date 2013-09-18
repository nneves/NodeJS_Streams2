var fs = require('fs');
var stream = require('stream');
var	path = process.argv[2];
var	readableStream;
var readableSize = 1*256;
var	writableStream;

// writable stream
function write(chunk, encoding, callback) {
 
  console.log('\r\n');
  console.log('--------------------------------------');
  console.log('Write to Printer');
  console.log('--------------------------------------');
  process.stdout.write('\u001b[32m' + chunk + '\u001b[39m'); 

  setTimeout( 
  	function () { 
		console.log('\r\n');
  		console.log('--------------------------------------');
  		console.log('Requesting more data from readableStream!');
  		console.log('--------------------------------------');

  		//readableStream.emit('drain');
      writableStream.emit('drain');
  	}, 250);
  

  return false; // will pause the stream flow
};

// main
function main () {
	console.log("Launching Main();");
	
	// check if .gcode file is inserted via command line arguments
	if (path !==undefined ) {
		readableStream = fs.createReadStream(path, {encoding: 'utf8', highWaterMark : 1});
		writableStream = stream.Writable();


		//readableStream.setEncoding('utf8');
		//process.stdout.setEncoding('utf8');
		//readableStream.pipe(process.stdout);

		// Pipe readableStream -> writableStream
		readableStream.pipe(writableStream, {end: false});

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