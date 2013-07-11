(function() {
  var CSS, Declaration, Keyframes, Rule;

  Rule = require('./rule');

  Keyframes = require('./keyframes');

  Declaration = require('./declaration');

  CSS = (function() {
    function CSS(stylesheet) {
      this.stylesheet = stylesheet;
    }

    CSS.prototype.eachKeyframes = function(callback) {
      var rule, _results;
      this.number = 0;
      _results = [];
      while (this.number < this.stylesheet.rules.length) {
        rule = this.stylesheet.rules[this.number];
        if (rule.keyframes) {
          callback(new Keyframes(this, this.number, rule));
        }
        _results.push(this.number += 1);
      }
      return _results;
    };

    CSS.prototype.containKeyframes = function(rule) {
      return this.stylesheet.rules.some(function(i) {
        return i.keyframes && i.name === rule.name && i.vendor === rule.vendor;
      });
    };

    CSS.prototype.addKeyframes = function(position, rule) {
      if (this.containKeyframes(rule)) {
        return;
      }
      this.stylesheet.rules.splice(position, 0, rule);
      return this.number += 1;
    };

    CSS.prototype.removeKeyframes = function(position) {
      this.stylesheet.rules.splice(position, 1);
      return this.number -= 1;
    };

    CSS.prototype.eachDeclaration = function(callback, node) {
      var i, keyframe, rule, _i, _j, _len, _len1, _ref, _ref1, _results;
      if (node == null) {
        node = this.stylesheet;
      }
      _ref = node.rules;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        if (i.rules) {
          this.eachDeclaration(callback, i);
        }
        if (i.keyframes) {
          _ref1 = i.keyframes;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            keyframe = _ref1[_j];
            rule = new Rule(keyframe.declarations, i.vendor);
            rule.each(callback);
          }
        }
        if (i.declarations) {
          rule = new Rule(i.declarations, i.vendor);
          _results.push(rule.each(callback));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return CSS;

  })();

  module.exports = CSS;

}).call(this);
