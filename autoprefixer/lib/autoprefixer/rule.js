(function() {
  var Declaration, Rule;

  Declaration = require('./declaration');

  Declaration.register(require('./hacks/filter'));

  Declaration.register(require('./hacks/border-radius'));

  Declaration.register(require('./hacks/flex'));

  Declaration.register(require('./hacks/order'));

  Declaration.register(require('./hacks/flex-grow'));

  Declaration.register(require('./hacks/flex-wrap'));

  Declaration.register(require('./hacks/flex-flow'));

  Declaration.register(require('./hacks/align-self'));

  Declaration.register(require('./hacks/flex-basis'));

  Declaration.register(require('./hacks/flex-shrink'));

  Declaration.register(require('./hacks/align-items'));

  Declaration.register(require('./hacks/display-flex'));

  Declaration.register(require('./hacks/align-content'));

  Declaration.register(require('./hacks/flex-direction'));

  Declaration.register(require('./hacks/justify-content'));

  Rule = (function() {
    function Rule(declarations, prefix) {
      this.declarations = declarations;
      this.prefix = prefix;
    }

    Rule.prototype.each = function(callback) {
      var decl, _results;
      this.number = 0;
      _results = [];
      while (this.number < this.declarations.length) {
        if (this.declarations[this.number].property) {
          decl = Declaration.load(this, this.number, this.declarations[this.number]);
          callback(decl, decl.prefix || this.prefix);
        }
        _results.push(this.number += 1);
      }
      return _results;
    };

    Rule.prototype.contain = function(prop, value) {
      if (value != null) {
        return this.declarations.some(function(i) {
          return i.property === prop && i.value === value;
        });
      } else {
        return this.declarations.some(function(i) {
          return i.property === prop;
        });
      }
    };

    Rule.prototype.add = function(position, decl) {
      this.declarations.splice(position, 0, decl);
      return this.number += 1;
    };

    Rule.prototype.byProp = function(prop) {
      var decl, i, _i, _len, _ref;
      _ref = this.declarations;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        decl = _ref[i];
        if (decl.property === prop) {
          return Declaration.load(this, i, decl);
        }
      }
      return null;
    };

    Rule.prototype.remove = function(position) {
      this.declarations.splice(this.number, 1);
      return this.number -= 1;
    };

    return Rule;

  })();

  module.exports = Rule;

}).call(this);
