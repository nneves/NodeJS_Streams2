var fs = require('fs');
var stream = require('stream');
var	path = process.argv[2];
var	readableStream;
var readableSize = 1*256;


// readable stream
function read() {
  var wflag = false;
  var buf;
  while (buf = readableStream.read(readableSize)) {

  	console.log('\r\n');
  	console.log('--------------------------------------');
    console.log('Read from the file');
  	console.log('--------------------------------------');
  	console.log('%s', buf);	
  }
}

// main
function main () {
	console.log("Launching Main();");
	
	// check if .gcode file is inserted via command line arguments
	if (path !==undefined ) {
		readableStream = fs.createReadStream(path, {encoding: 'utf8'});

		//readableStream.setEncoding('utf8');
		//process.stdout.setEncoding('utf8');
		//readableStream.pipe(process.stdout);

		readableStream.on('readable', read);

		readableStream.once('end', function() {
  			console.log('Readable Stream Ended');
		});
	}
	else {
		console.log("Get stream from STDIN pipe...");

		//process.stdin.setEncoding('utf8');
		//process.stdin.pipe(writableStream { end: false });
		//printercore.oStreamPrinter.pipe(process.stdout);
	}
}


main();