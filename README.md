#pattern-renamer

##A file renaming program which uses patterns to find the new name

- ##Usage:
	```
	pattern-renamer [folder] -p [pattern] -o [output]
	```

- ##Options:
	```
	-p or --pattern [pattern] #The pattern which is used to find the numbers
	-o or --output [output] #The output pattern of the new file
	-c or --copy #Instead of renaming copy the files
	```

- ##Pattern variable:
	   pattern variables are used in the -p and -o options, they are fundamentally regular expression abstractions. These can be combined with regular strings and other patterns to create complex patterns   
	   basically the syntax of the patterns are as follows,   
	1. [:identifier:type:length]
	2. [:identifier:type:min:max]

	+ The above pattern keywords are described below
	  * **identifier** (optional): This is the name which, is used in the -o parameter to give the output pattern. If the pattern has a identifier
	  * **type** (required): This is the type of the regex to be matched. The types allowed are, "str", "any", "num"
	  * **length** (optional): This is exact size of the string matched
	  * **min** (optional): This is the min size of the string matched
	  * **max** (optional): This is the max size of the string matched

- ##Examples
	```
	pattern-renamer ./ -p [:any]S[:s:num:2]E[:e:num:2][:any] -o S[:s]E[:e] #This will match a file like "showS02E20.mp4" to "S02E20.mp4"
	```