(function() {
  var PreviousMap, base64js, fs, mozilla, path;

  base64js = require('base64-js');

  mozilla = require('source-map');

  path = require('path');

  fs = require('fs');

  PreviousMap = (function() {
    function PreviousMap(root, opts) {
      var text, _ref;
      this.file = opts.from;
      this.loadAnnotation(root);
      this.inline = this.startWith(this.annotation, '# sourceMappingURL=data:');
      text = this.loadMap((_ref = opts.map) != null ? _ref.prev : void 0);
      if (text) {
        this.text = text;
      }
    }

    PreviousMap.prototype.consumer = function() {
      return this.consumerCache || (this.consumerCache = new mozilla.SourceMapConsumer(this.text));
    };

    PreviousMap.prototype.withContent = function() {
      var _ref;
      return ((_ref = this.consumer().sourcesContent) != null ? _ref.length : void 0) > 0;
    };

    PreviousMap.prototype.startWith = function(string, start) {
      if (!string) {
        return false;
      }
      return string.slice(0, +(start.length - 1) + 1 || 9e9) === start;
    };

    PreviousMap.prototype.loadAnnotation = function(root) {
      var last;
      last = root.last;
      if (!last) {
        return;
      }
      if (last.type === 'comment' && this.startWith(last.text, '# sourceMappingURL=')) {
        return this.annotation = last.text;
      }
    };

    PreviousMap.prototype.decodeInline = function(text) {
      var base64, byte, bytes, encoding, uri, _ref;
      uri = '# sourceMappingURL=data:application/json,';
      base64 = '# sourceMappingURL=data:application/json;base64,';
      if (this.startWith(text, uri)) {
        return decodeURIComponent(text.slice(uri.length));
      } else if (this.startWith(text, base64)) {
        text = text.slice(base64.length);
        bytes = base64js.toByteArray(text);
        return ((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = bytes.length; _i < _len; _i++) {
            byte = bytes[_i];
            _results.push(String.fromCharCode(byte));
          }
          return _results;
        })()).join('');
      } else {
        encoding = (_ref = text.match(/ata:application\/json;([^,]+),/)) != null ? _ref[1] : void 0;
        throw new Error("Unsupported source map encoding " + encoding);
      }
    };

    PreviousMap.prototype.loadMap = function(prev) {
      var map;
      if (prev === false) {
        return;
      }
      if (prev) {
        if (typeof prev === 'string') {
          return prev;
        } else if (prev instanceof mozilla.SourceMapConsumer) {
          return mozilla.SourceMapGenerator.fromSourceMap(prev).toString();
        } else if (prev instanceof mozilla.SourceMapGenerator) {
          return prev.toString();
        } else if (typeof prev === 'object' && (prev.mappings != null)) {
          return JSON.stringify(prev);
        } else {
          throw new Error("Unsupported previous source map format: " + prev);
        }
      } else if (this.inline) {
        return this.decodeInline(this.annotation);
      } else if (this.annotation) {
        map = this.annotation.replace('# sourceMappingURL=', '');
        if (this.file) {
          map = path.join(path.dirname(this.file), map);
        }
        this.root = path.dirname(map);
        if (typeof fs.existsSync === "function" ? fs.existsSync(map) : void 0) {
          return fs.readFileSync(map).toString();
        }
      }
    };

    return PreviousMap;

  })();

  module.exports = PreviousMap;

}).call(this);
