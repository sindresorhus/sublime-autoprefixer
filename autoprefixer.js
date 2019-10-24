'use strict';
var getStdin = require('get-stdin');
var postcss = require('postcss');
var autoprefixer = require('autoprefixer');
var postcssSafeParser = require('postcss-safe-parser');
var postcssScssParser = require('postcss-scss');

getStdin().then(function (data) {
	var options = JSON.parse(process.argv[2]);

	if (options.browsers) {
		options.overrideBrowserslist = options.browsers;
		delete options.browsers;
	}

	var postcssParser = options.is_css ? postcssSafeParser : postcssScssParser;

	postcss(autoprefixer(options)).process(data, {
		parser: postcssParser,
		from: undefined
	})
	.then(function (result) {
		process.stdout.write(result.css);

		// TODO: log warnings in an non-error way somehow
		// var warnings = result.warnings();

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
