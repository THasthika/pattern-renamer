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

Usage:
	pattern-renamer [folder] -p [pattern] -o [output] [options]

Options:
	-p or --pattern [pattern] - The pattern which is used to find the numbers
	-o or --output [output] - The output pattern of the new file
	-c or --copy - Instead of renaming, copy the files
**/

var fs = require("fs");
var path = require("path");
var colors = require("colors");
var argumentor = require("cli-argumentor");

var TYPES = {
	"num": "\\d",
	"any": ".*",
	"str": "\\w"
};
var NL = "\n";
var TAB = "\t";
var HELP = NL+"pattern-renamer: A file renaming program which uses patterns to find the new name".underline+NL+NL+
	"usage:".underline+NL+
		TAB+"pattern-renamer [folder] -p [pattern] -o [output] [options]"+NL+NL+
	"options:".underline+NL+
		TAB+"-p or --pattern [pattern] - The pattern which is used to find the numbers"+NL+
		TAB+"-o or --output [output] - The output pattern of the new file"+NL+
		TAB+"-c or --copy - Instead of renaming, copy the files";

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

function getNewFilePath(original, name) {
	var arr = path.basename(original).split(".");
	var directory = path.dirname(original);
	var ext = "";
	if(arr.length > 1)
		ext = "." + arr[arr.length - 1];
	var name = path.join(directory, name + ext);
	return name;
}

function renameFile(original, name, cb) {
	(function(file, name) {
		fs.rename(file, name, cb);
	})(original, name);
}

function copyFile(original, name, cb) {
	(function(file, name) {
		var wstream = fs.createWriteStream(name);
		var rstream = fs.createReadStream(original);
		rstream.pipe(wstream);
	})(original, name);
}

function isType(type) {
	return (type in TYPES);
}

function patternToRegexObject(pattern) {
	var reg = new RegExp("\\[:([^\\]]+)\\]", "gmi");
	var m;
	var o = {};
	o.params = {};
	var regex = pattern;
	while(m = reg.exec(pattern)) {
		if(!m)
			continue;
		var type = null, id = null, l1 = null, l2 = null;
		var p = m[1];
		p = p.split(":");

		for(var i = 0; i < p.length; i++) {
			if(isType(p[i])) {
				type = p[i];
			} else if(isNaN(p[i])) {
				id = p[i];
			} else {
				if(l1 == null)
					l1 = p[i];
				else
					l2 = p[i];
			}
		}

		if(type == null)
			continue;

		if(id != null)
			o.params[id] = null;

		var r = "";
		if(id != null)
			r += "(";

		r += TYPES[type];

		if(type != "any") {
			if(l1 != null || l2 != null) {
				r += "{";
				if(l1 != null)
					r += l1;
				if(l2 != null)
					r += "," + l2;
				r += "}";
			} else {
				r += "+"
			}
		}

		if(id != null)
			r += ")";

		regex = regex.replace(m[0], r);
	}
	o.regex = new RegExp(regex, "i");
	return o;
}

function getOutputName(output, params) {
	for(var k in params) {
		output = output.replace("[:"+k+"]", params[k]);
	}
	return output;
}

function patternRename(vars) {
	if(vars.folder == null)
		throw new Error("Folder was not found!");

	var robj = patternToRegexObject(vars.pattern);
	var files = getFiles(vars.folder);

	while(files.length > 0) {
		var file = files.shift();

		var basename = path.basename(file);

		var m = robj.regex.exec(basename);
		if(m == null)
			continue;

		var i = 1;
		for(var k in robj.params) {
			robj.params[k] = m[i];
			i++;
		}

		var name = getOutputName(vars.output, robj.params);
		name = getNewFilePath(file, name);

		if(vars.copy)
			copyFile(file, name);
		else
			renameFile(file, name);
	}
}

function main() {
	var args = new argumentor(process.argv.slice());

	args.init(function(vars, args) {
		vars.copy = false;
		vars.pattern = null;
		vars.output = null;
		vars.folder = args.shift();
	})
	.add(["--help", "-h"], function() {
		console.log(HELP);
		process.exit(0);
	})
	.add(["--pattern", "-p"], function(pattern) {
		if(pattern == undefined)
			throw new Error("The pattern must not be empty");
		this.vars.pattern = pattern;
	})
	.add(["--copy", "-c"], function() {
		this.vars.copy = true;
	})
	.add(["--output", "-o"], function(output) {
		if(output == undefined)
			throw new Error("The output must not be empty");
		this.vars.output = output;
	});

	args.exec(function(vars) {
		patternRename(vars);
	});
}

main();