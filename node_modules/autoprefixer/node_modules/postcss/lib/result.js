(function() {
  var MapGenerator, Result;

  MapGenerator = require('./map-generator');

  Result = (function() {
    function Result(root, opts) {
      this.root = root;
      this.opts = opts != null ? opts : {};
    }

    Result.prototype.stringify = function() {
      var map, _ref;
      map = new MapGenerator(this.root, this.opts);
      return _ref = map.generate(), this.cssCached = _ref[0], this.mapCached = _ref[1], _ref;
    };

    Result.prototype.toString = function() {
      return this.css;
    };

    return Result;

  })();

  Object.defineProperty(Result.prototype, 'map', {
    get: function() {
      if (!this.cssCached) {
        this.stringify();
      }
      return this.mapCached;
    }
  });

  Object.defineProperty(Result.prototype, 'css', {
    get: function() {
      if (!this.cssCached) {
        this.stringify();
      }
      return this.cssCached;
    }
  });

  module.exports = Result;

}).call(this);
