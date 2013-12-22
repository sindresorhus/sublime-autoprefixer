'use strict';
var autoprefixer = require('autoprefixer');
var str = '';

process.stdin.setEncoding('utf8');
process.stdin.resume();

process.stdin.on('data', function (data) {
	str += data;
});

process.stdin.on('end', function () {
	var browsers = process.argv[2].split(',');
	var result = autoprefixer.apply(this, browsers).process(str);
	process.stdout.write(result.css);
});
