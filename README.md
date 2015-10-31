#pattern-renamer: A file renaming program which uses patterns to find the new name

- ##usage:
	```
	pattern-renamer [folder] -p [pattern] -o [output]
	```

- ##options:
	```
	-p or --pattern [pattern] #The pattern which is used to find the numbers
	-o or --output [output] #The output pattern of the new file
	-c or --copy #Instead of renaming copy the files
	-i or --increment #Just incremental renaming instead of patterns
	```

- ##patterns:
	   patterns are used in the -p and -o options, they are fundamentally regular expression abstractions,   
	   basically the syntax of the patterns are as follows,   
	1. ([identifier]:[type]:[length])
	2. ([identifier]:[type]:[min]:[max])
	  *identifier (optional): This is the name which, is used in the -o parameter to give the output pattern