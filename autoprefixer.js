'use strict';
var autoprefixer = require('autoprefixer');
var css = require('css');
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
	var beautified = css.stringify(css.parse(prefixed), {
		indent: detectIndent(str) || '    '
	});

	process.stdout.write(beautified);
});
