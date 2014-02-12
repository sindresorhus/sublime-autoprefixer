(function() {
  var Declaration, FlexBasis, flexSpec,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  flexSpec = require('./flex-spec');

  Declaration = require('../declaration');

  FlexBasis = (function(_super) {
    __extends(FlexBasis, _super);

    function FlexBasis() {
      return FlexBasis.__super__.constructor.apply(this, arguments);
    }

    FlexBasis.names = ['flex-basis'];

    FlexBasis.prototype.normalize = function() {
      return 'flex';
    };

    FlexBasis.prototype.prefixed = function(prop, prefix) {
      var spec, _ref;
      _ref = flexSpec(prefix), spec = _ref[0], prefix = _ref[1];
      if (spec === 2012) {
        return prefix + 'flex';
      } else {
        return FlexBasis.__super__.prefixed.apply(this, arguments);
      }
    };

    FlexBasis.prototype.set = function(decl, prefix) {
      var spec, _ref;
      _ref = flexSpec(prefix), spec = _ref[0], prefix = _ref[1];
      if (spec === 2012) {
        decl.prop = prefix + 'flex';
        decl.value = '0 1 ' + decl.value;
        return decl;
      } else if (spec === 'final') {
        return FlexBasis.__super__.set.apply(this, arguments);
      }
    };

    return FlexBasis;

  })(Declaration);

  module.exports = FlexBasis;

}).call(this);
