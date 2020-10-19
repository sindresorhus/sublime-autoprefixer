'use strict';
const childProcess = require('child_process');
const getStdin = require('get-stdin');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const postcssSafeParser = require('postcss-safe-parser');
const postcssScssParser = require('postcss-scss');

const subprocess = childProcess.spawn('npx', ['browserslist@latest', '--update-db'], {cwd: __dirname, stdio: 'ignore'});
subprocess.unref();
subprocess.on('error', () => {});

(async () => {
	const data = await getStdin();
	const options = JSON.parse(process.argv[2]);

	if (options.browsers) {
		options.overrideBrowserslist = options.browsers;
		delete options.browsers;
	}

	const postcssParser = options.is_css ? postcssSafeParser : postcssScssParser;

	try {
		const {css} = await postcss(autoprefixer(options)).process(data, {
			parser: postcssParser,
			from: undefined
		});

		process.stdout.write(css);

		// TODO: Log warnings in an non-error way somehow.
		// const warnings = result.warnings();

		// if (warnings.length > 0) {
		// 	console.error(warnings.join('\n  '));
		// }
	} catch (error) {
		if (error.name === 'CssSyntaxError') {
			error.message += `\n${error.showSourceCode()}`;
		}

		console.error(error.message.replace('<css input>:', ''));
	}
})();
