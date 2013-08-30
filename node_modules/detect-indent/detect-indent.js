(function () {
	'use strict';
	var RE_MULTILINE_COMMENTS = /\*(.|[\r\n])*?\*/;
	var RE_EMPTY_LINE = /^\s+$/;
	var RE_LEADING_WHITESPACE = /^[ \t]+/;

	function gcd(a, b) {
		return b ? gcd(b, a % b) : a;
	}

	function detectIndent(str) {
		var lines = str.replace(RE_MULTILINE_COMMENTS, '').split(/\n|\r\n?/);
		var tabs = 0;
		var spaces = [];

		for (var i = 0; i < lines.length; i++) {
			var line = lines[i];

			if (RE_EMPTY_LINE.test(line)) {
				continue;
			}

			var matches = line.match(RE_LEADING_WHITESPACE);

			if (matches) {
				var whitespace = matches[0];
				var len = whitespace.length;

				if (whitespace.indexOf('\t') !== -1) {
					tabs++;
				}

				// convert odd numbers to even numbers
				if (len % 2 === 1) {
					len += 1;
				}

				if (whitespace.indexOf(' ') !== -1) {
					spaces.push(len);
				}
			}
		}

		if (tabs > spaces.length) {
			return '\t';
		}

		// greatest common divisor is most likely the indent size
		var indentSize = spaces.reduce(gcd);

		if (indentSize > 0) {
			return new Array(indentSize + 1).join(' ');
		}

		return null;
	};

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = detectIndent;
	} else {
		window.detectIndent = detectIndent;
	}
})();
