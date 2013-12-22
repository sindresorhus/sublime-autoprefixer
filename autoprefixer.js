'use strict';
var autoprefixer = require('autoprefixer');
var str = '';

process.stdin.setEncoding('utf8');
process.stdin.resume();

process.stdin.on('data', function (data) {
	str += data;
});

process.stdin.on('end', function () {
	var result;
	var browsers = process.argv[2].split(',');

	try {
		result = autoprefixer.apply(this, browsers).process(str);
	} catch (err) {
		if (/Unclosed block/.test(err.message)) {
			return console.error('Couldn\'t find any valid CSS rules. You can\'t select properties. Select a whole rule and try again.');
		}

		if (err.name === 'TypeError') {
			return console.error('Invalid CSS.');
		}

		throw err;
	}

	process.stdout.write(result.css);
});
