'use strict';
var stdin = require('get-stdin');
var autoprefixer = require('autoprefixer-core');

stdin(function (data) {
	var opts = JSON.parse(process.argv[2]);

	try {
		var css = autoprefixer(opts).process(data, {safe: true}).css;
		process.stdout.write(css);
	} catch (err) {
		if (/Unclosed block/.test(err.message)) {
			console.error('Couldn\'t find any valid CSS rules. You can\'t select properties. Select a whole rule and try again.');
			return;
		}

		if (err.name === 'TypeError') {
			console.error('Invalid CSS');
			return;
		}

		throw err;
	}
});
