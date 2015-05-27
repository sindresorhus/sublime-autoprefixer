'use strict';
var stdin = require('get-stdin');
var postcss = require('postcss');
var autoprefixer = require('autoprefixer-core');

stdin(function (data) {
	var opts = JSON.parse(process.argv[2]);

	postcss()
	.use(autoprefixer(opts))
	.process(data, {safe: true})
	.then(function (res) {
		process.stdout.write(res.css);

		// TODO: log warnings in an non-error way somehow
		// var warnings = res.warnings();

		// if (warnings.length > 0) {
		// 	console.error(warnings.join('\n  '));
		// }
	}).catch(function (err) {
		if (err.name === 'CssSyntaxError') {
			err.message += '\n' + err.showSourceCode();
		}

		console.error(err.message.replace('<css input>:', ''));
	});
});
