(function() {
  var MapGenerator, Result, base64js, mozilla, path;

  Result = require('./result');

  base64js = require('base64-js');

  mozilla = require('source-map');

  path = require('path');

  MapGenerator = (function() {
    function MapGenerator(root, opts) {
      this.root = root;
      this.opts = opts;
      this.mapOpts = this.opts.map || {};
    }

    MapGenerator.prototype.isMap = function() {
      if (this.opts.map != null) {
        return !!this.opts.map;
      } else {
        return this.previous().length > 0;
      }
    };

    MapGenerator.prototype.previous = function() {
      if (!this.previousMaps) {
        this.previousMaps = [];
        this.root.eachInside((function(_this) {
          return function(node) {
            var _ref;
            if (((_ref = node.source) != null ? _ref.map : void 0) != null) {
              if (_this.previousMaps.indexOf(node.source.map) === -1) {
                return _this.previousMaps.push(node.source.map);
              }
            }
          };
        })(this));
      }
      return this.previousMaps;
    };

    MapGenerator.prototype.isInline = function() {
      if (this.mapOpts.inline != null) {
        return this.mapOpts.inline;
      }
      return this.previous().some(function(i) {
        return i.inline;
      });
    };

    MapGenerator.prototype.isSourcesContent = function() {
      if (this.mapOpts.sourcesContent != null) {
        return this.mapOpts.sourcesContent;
      }
      return this.previous().some(function(i) {
        return i.withContent();
      });
    };

    MapGenerator.prototype.clearAnnotation = function() {
      var last;
      last = this.root.last;
      if (!last) {
        return null;
      }
      if (last.type === 'comment' && last.text.match(/^# sourceMappingURL=/)) {
        return last.removeSelf();
      }
    };

    MapGenerator.prototype.setSourcesContent = function() {
      var already;
      already = {};
      return this.root.eachInside((function(_this) {
        return function(node) {
          if (node.source && !already[node.source.file]) {
            already[node.source.file] = true;
            return _this.map.setSourceContent(_this.relative(node.source.file), node.source.content);
          }
        };
      })(this));
    };

    MapGenerator.prototype.applyPrevMaps = function() {
      var from, i, map, prev, root, _i, _len, _ref, _results;
      _ref = this.previous();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        prev = _ref[_i];
        from = prev.file;
        root = prev.root || path.dirname(from);
        if (this.mapOpts.sourcesContent === false) {
          map = new mozilla.SourceMapConsumer(prev.text);
          map.sourcesContent = (function() {
            var _j, _len1, _ref1, _results1;
            _ref1 = map.sourcesContent;
            _results1 = [];
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              i = _ref1[_j];
              _results1.push(null);
            }
            return _results1;
          })();
        } else {
          map = prev.consumer();
        }
        _results.push(this.map.applySourceMap(map, this.relative(from), this.relative(root)));
      }
      return _results;
    };

    MapGenerator.prototype.isAnnotation = function() {
      if (this.isInline()) {
        return true;
      }
      if (this.mapOpts.annotation != null) {
        return this.mapOpts.annotation;
      }
      if (this.previous().length) {
        return this.previous().some(function(i) {
          return i.annotation;
        });
      } else {
        return true;
      }
    };

    MapGenerator.prototype.addAnnotation = function() {
      var bytes, char, content;
      content = this.isInline() ? (bytes = (function() {
        var _i, _len, _ref, _results;
        _ref = this.map.toString();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          char = _ref[_i];
          _results.push(char.charCodeAt(0));
        }
        return _results;
      }).call(this), "data:application/json;base64," + base64js.fromByteArray(bytes)) : typeof this.mapOpts.annotation === 'string' ? this.mapOpts.annotation : this.outputFile() + '.map';
      return this.css += "\n/*# sourceMappingURL=" + content + " */";
    };

    MapGenerator.prototype.outputFile = function() {
      if (this.opts.to) {
        return this.relative(this.opts.to);
      } else {
        return 'to.css';
      }
    };

    MapGenerator.prototype.generateMap = function() {
      this.stringify();
      if (this.isSourcesContent()) {
        this.setSourcesContent();
      }
      if (this.previous().length > 0) {
        this.applyPrevMaps();
      }
      if (this.isAnnotation()) {
        this.addAnnotation();
      }
      if (this.isInline()) {
        return [this.css];
      } else {
        return [this.css, this.map];
      }
    };

    MapGenerator.prototype.relative = function(file) {
      var from;
      from = this.opts.to ? path.dirname(this.opts.to) : '.';
      if (typeof this.mapOpts.annotation === 'string') {
        from = path.dirname(path.resolve(from, this.mapOpts.annotation));
      }
      file = path.relative(from, file);
      if (path.sep === '\\') {
        file = file.replace('\\', '/');
      }
      return file;
    };

    MapGenerator.prototype.sourcePath = function(node) {
      return this.relative(node.source.file || 'from.css');
    };

    MapGenerator.prototype.stringify = function() {
      var builder, column, line;
      this.css = '';
      this.map = new mozilla.SourceMapGenerator({
        file: this.outputFile()
      });
      line = 1;
      column = 1;
      builder = (function(_this) {
        return function(str, node, type) {
          var last, lines, _ref, _ref1;
          _this.css += str;
          if ((node != null ? (_ref = node.source) != null ? _ref.start : void 0 : void 0) && type !== 'end') {
            _this.map.addMapping({
              source: _this.sourcePath(node),
              original: {
                line: node.source.start.line,
                column: node.source.start.column - 1
              },
              generated: {
                line: line,
                column: column - 1
              }
            });
          }
          lines = str.match(/\n/g);
          if (lines) {
            line += lines.length;
            last = str.lastIndexOf("\n");
            column = str.length - last;
          } else {
            column = column + str.length;
          }
          if ((node != null ? (_ref1 = node.source) != null ? _ref1.end : void 0 : void 0) && type !== 'start') {
            return _this.map.addMapping({
              source: _this.sourcePath(node),
              original: {
                line: node.source.end.line,
                column: node.source.end.column
              },
              generated: {
                line: line,
                column: column
              }
            });
          }
        };
      })(this);
      return this.root.stringify(builder);
    };

    MapGenerator.prototype.generate = function() {
      this.clearAnnotation();
      if (this.isMap()) {
        return this.generateMap();
      } else {
        return [this.root.toString()];
      }
    };

    return MapGenerator;

  })();

  module.exports = MapGenerator;

}).call(this);
