(function() {
  var Processor;

  Processor = (function() {
    function Processor(prefixes) {
      this.prefixes = prefixes;
    }

    Processor.prototype.add = function(css) {
      var _this = this;
      css.eachKeyframes(function(keyframes) {
        if (keyframes.prefix) {
          return;
        }
        return _this.prefixes.each('@keyframes', function(prefix) {
          return keyframes.cloneWithPrefix(prefix);
        });
      });
      css.eachDeclaration(function(decl, vendor) {
        return _this.prefixes.each(decl.prop, function(prefix) {
          if (vendor && vendor !== prefix) {
            return;
          }
          if (decl.valueContain(_this.prefixes.other(prefix))) {
            return;
          }
          return decl.prefixProp(prefix);
        });
      });
      return css.eachDeclaration(function(decl, vendor) {
        var prefix, value, _i, _j, _len, _len1, _ref, _ref1;
        _ref = _this.prefixes.values('add', decl.unprefixed);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          value = _ref[_i];
          if (!value.check(decl)) {
            continue;
          }
          _ref1 = value.prefixes;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            prefix = _ref1[_j];
            if (vendor && vendor !== prefix) {
              continue;
            }
            decl.prefixValue(prefix, value);
          }
        }
        return decl.saveValues();
      });
    };

    Processor.prototype.remove = function(css) {
      var _this = this;
      css.eachKeyframes(function(keyframes) {
        if (_this.prefixes.toRemove(keyframes.prefix + '@keyframes')) {
          return keyframes.remove();
        }
      });
      return css.eachDeclaration(function(decl, vendor) {
        var value, _i, _len, _ref;
        if (_this.prefixes.toRemove(decl.prop)) {
          decl.remove();
          return;
        }
        _ref = _this.prefixes.values('remove', decl.unprefixed);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          value = _ref[_i];
          if (decl.value.match(value)) {
            decl.remove();
            return;
          }
        }
      });
    };

    return Processor;

  })();

  module.exports = Processor;

}).call(this);
