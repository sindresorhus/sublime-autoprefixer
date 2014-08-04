'use strict';
var stdin = require('get-stdin');
var autoprefixer = require('autoprefixer');

stdin(function (data) {
	var opts = JSON.parse(process.argv[2]);

	try {
		var css = autoprefixer(opts.browsers, opts).process(data, {safe: true}).css;
		process.stdout.write(css);
	} catch (err) {
		if (/Unclosed block/.test(err.message)) {
			return console.error('Couldn\'t find any valid CSS rules. You can\'t select properties. Select a whole rule and try again.');
		}

		if (err.name === 'TypeError') {
			return console.error('Invalid CSS.');
		}

		throw err;
	}
});
