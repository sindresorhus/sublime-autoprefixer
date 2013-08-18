'use strict';
var autoprefixer = require('autoprefixer');
var cssbeautify = require('cssbeautify');
var detectIndent = require('detect-indent');
var str = '';

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (data) {
	str += data;
});

process.stdin.on('end', function () {
	var browsers = process.argv[2].split(',');
	var prefixed = autoprefixer.apply(this, browsers).compile(str);
	var beautified = cssbeautify(prefixed, {
		indent: detectIndent(str) || '  ',
		autosemicolon: true
	});

	process.stdout.write(beautified);
});
