(function() {
  var Browsers, CSS, Prefixes, autoprefixer, parse, stringify;

  parse = require('css-parse');

  stringify = require('css-stringify');

  Browsers = require('./autoprefixer/browsers');

  Prefixes = require('./autoprefixer/prefixes');

  CSS = require('./autoprefixer/css');

  autoprefixer = {
    compile: function(str, requirements) {
      var nodes,
        _this = this;
      nodes = this.catchParseErrors(function() {
        return parse(_this.removeBadComments(str));
      });
      this.rework(requirements)(nodes.stylesheet);
      return this.catchParseErrors(function() {
        return stringify(nodes);
      });
    },
    rework: function(requirements) {
      var browsers, prefixes;
      browsers = new Browsers(this.data.browsers, requirements);
      prefixes = new Prefixes(this.data.prefixes, browsers);
      return function(stylesheet) {
        var css;
        css = new CSS(stylesheet);
        prefixes.processor.add(css);
        return prefixes.processor.remove(css);
      };
    },
    data: {
      browsers: require('../data/browsers'),
      prefixes: require('../data/prefixes')
    },
    removeBadComments: function(css) {
      return css.replace(/\/\*[^\*]*\*\/\s*:/g, ':').replace(/\/\*[^\*]*\{[^\*]*\*\//g, '');
    },
    inspect: function(requirements) {
      var browsers, prefixes;
      browsers = new Browsers(this.data.browsers, requirements);
      prefixes = new Prefixes(this.data.prefixes, browsers);
      this.inspectFunc || (this.inspectFunc = require('./autoprefixer/inspect'));
      return this.inspectFunc(prefixes);
    },
    catchParseErrors: function(callback) {
      var e, error;
      try {
        return callback();
      } catch (_error) {
        e = _error;
        error = new Error("Can't parse CSS");
        error.stack = e.stack;
        error.css = true;
        throw error;
      }
    }
  };

  module.exports = autoprefixer;

}).call(this);
