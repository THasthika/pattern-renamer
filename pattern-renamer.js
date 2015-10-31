#!/usr/bin/env node

/**
THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE 
INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR 
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, 
DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR 
IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
**/

/**
pattern-renamer: A file renaming program which uses patterns to find the new name

usage:
	pattern-renamer [folder] -p [pattern] -o [output] [options]

options:
	-p or --pattern [pattern] - The pattern which is used to find the numbers
	-o or --output [output] - The output pattern of the new file
	-c or --copy - Instead of renaming, copy the files
	-i or --increment - Just incremental renaming instead of patterns
**/

var fs = require("fs");
var path = require("path");
var colors = require("colors");

var NL = "\n";
var TAB = "\t";
var HELP = NL+"pattern-renamer: A file renaming program which uses patterns to find the new name".underline+NL+NL+
	"usage:".underline+NL+
		TAB+"pattern-renamer [folder] -p [pattern] -o [output] [options]"+NL+NL+
	"options:".underline+NL+
		TAB+"-p or --pattern [pattern] - The pattern which is used to find the numbers"+NL+
		TAB+"-o or --output [output] - The output pattern of the new file"+NL+
		TAB+"-c or --copy - Instead of renaming, copy the files"+NL+
		TAB+"-i or --increment - Just incremental renaming instead of patterns";

function getFiles(directory) {
	var ret = [];
	var files = fs.readdirSync(directory);
	for(i in files) {
		var file = directory + files[i];
		var stat = fs.statSync(file);
		if(stat != null && stat.isFile()) {
			ret.push(file);
		}
	}
	return ret;
}

function saveFile(original, name) {
	var arr = path.basename(original).split(".");
	var directory = path.dirname(original);
	var ext = "";
	if(arr.length > 1)
		ext = "." + arr[arr.length - 1];
	var name = path.join(directory, name + ext);
	(function(file, name) {
		fs.rename(file, name, function(err) {
			console.log(file + " ---> " + name);
		});
	})(original, name);
}

function main() {
	var args = process.argv;
	args.shift();
	args.shift();

	var files = [];
	var directory = "";

	for(var i = 0; i < args.length; i++)
	{
		switch(args[i])
		{
			case "-h":
			case "--help":
				console.log(HELP);
				process.exit(0);
				break;
			case "-d":
			case "--directory":
				if(!args[i+1])
				{
					console.log("invalid directory!");
					process.exit(-1);
				}
				directory = args[i+1];
				files = getFiles(args[i+1]);
				break;
			case "-s":
			case "--season":
				IS_SEASON = true;
				break;
		}
	}
}

main();