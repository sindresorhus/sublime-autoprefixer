(function() {
  var Container, Declaration, Node,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Node = require('./node');

  Declaration = require('./declaration');

  Container = (function(_super) {
    __extends(Container, _super);

    function Container() {
      return Container.__super__.constructor.apply(this, arguments);
    }

    Container.prototype.stringifyContent = function(builder) {
      var last;
      if (!this.rules && !this.decls) {
        return;
      }
      if (this.rules) {
        last = this.rules.length - 1;
        return this.rules.map(function(rule, i) {
          return rule.stringify(builder, last === i);
        });
      } else if (this.decls) {
        last = this.decls.length - 1;
        return this.decls.map((function(_this) {
          return function(decl, i) {
            return decl.stringify(builder, last !== i || _this.semicolon);
          };
        })(this));
      }
    };

    Container.prototype.defaultAfter = function() {
      var _ref;
      if (this.list.length === 0) {
        return '';
      } else if (((_ref = this.list[0].before) != null ? _ref.indexOf("\n") : void 0) === -1) {
        return this.list[0].before;
      } else {
        return "\n";
      }
    };

    Container.prototype.stringifyBlock = function(builder, start) {
      var style;
      style = this.style();
      if (this.before) {
        builder(this.before);
      }
      builder(start, this, 'start');
      this.stringifyContent(builder);
      if (style.after) {
        builder(style.after);
      }
      return builder('}', this, 'end');
    };

    Container.prototype.push = function(child) {
      child.parent = this;
      this.list.push(child);
      return this;
    };

    Container.prototype.each = function(callback) {
      var id, index, list, result;
      this.lastEach || (this.lastEach = 0);
      this.indexes || (this.indexes = {});
      this.lastEach += 1;
      id = this.lastEach;
      this.indexes[id] = 0;
      list = this.list;
      if (!list) {
        return;
      }
      while (this.indexes[id] < list.length) {
        index = this.indexes[id];
        result = callback(list[index], index);
        if (result === false) {
          break;
        }
        this.indexes[id] += 1;
      }
      delete this.indexes[id];
      if (result === false) {
        return false;
      }
    };

    Container.prototype.eachInside = function(callback) {
      return this.each((function(_this) {
        return function(child, i) {
          var result;
          result = callback(child, i);
          if (result !== false && child.eachInside) {
            result = child.eachInside(callback);
          }
          if (result === false) {
            return result;
          }
        };
      })(this));
    };

    Container.prototype.eachDecl = function(callback) {};

    Container.prototype.eachComment = function(callback) {
      return this.eachInside((function(_this) {
        return function(child, i) {
          var result;
          result = child.type === 'comment' ? callback(child, i) : void 0;
          if (result === false) {
            return result;
          }
        };
      })(this));
    };

    Container.prototype.append = function(child) {
      var _i, _len, _ref;
      _ref = this.normalize(child, this.list[this.list.length - 1]);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        this.list.push(child);
      }
      return this;
    };

    Container.prototype.prepend = function(child) {
      var childs, id, index, _i, _len, _ref, _ref1;
      childs = this.normalize(child, this.list[0], 'prepend');
      _ref = childs.reverse();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        this.list.unshift(child);
      }
      _ref1 = this.indexes;
      for (id in _ref1) {
        index = _ref1[id];
        this.indexes[id] = index + childs.length;
      }
      return this;
    };

    Container.prototype.insertBefore = function(exist, add) {
      var child, childs, id, index, _i, _len, _ref, _ref1;
      exist = this.index(exist);
      childs = this.normalize(add, this.list[exist], exist === 0 ? 'prepend' : void 0);
      _ref = childs.reverse();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        this.list.splice(exist, 0, child);
      }
      _ref1 = this.indexes;
      for (id in _ref1) {
        index = _ref1[id];
        this.indexes[id] = index + childs.length;
      }
      return this;
    };

    Container.prototype.insertAfter = function(exist, add) {
      var child, childs, id, index, _i, _len, _ref, _ref1;
      exist = this.index(exist);
      childs = this.normalize(add, this.list[exist]);
      _ref = childs.reverse();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        this.list.splice(exist + 1, 0, child);
      }
      _ref1 = this.indexes;
      for (id in _ref1) {
        index = _ref1[id];
        this.indexes[id] = index + childs.length;
      }
      return this;
    };

    Container.prototype.remove = function(child) {
      var id, index, _ref;
      child = this.index(child);
      this.list.splice(child, 1);
      _ref = this.indexes;
      for (id in _ref) {
        index = _ref[id];
        if (index >= child) {
          this.indexes[id] = index - 1;
        }
      }
      return this;
    };

    Container.prototype.every = function(condition) {
      return this.list.every(condition);
    };

    Container.prototype.some = function(condition) {
      return this.list.some(condition);
    };

    Container.prototype.index = function(child) {
      if (typeof child === 'number') {
        return child;
      } else {
        return this.list.indexOf(child);
      }
    };

    Container.prop('first', {
      get: function() {
        return this.list[0];
      }
    });

    Container.prop('last', {
      get: function() {
        return this.list[this.list.length - 1];
      }
    });

    Container.prop('list', {
      get: function() {
        return this.rules || this.decls;
      }
    });

    Container.prototype.normalize = function(child, sample) {
      var childs, i, _i, _len, _results;
      if (child.type === 'root') {
        return this.normalize(child.rules, sample);
      } else {
        childs = (function() {
          var _i, _len, _results;
          if (Array.isArray(child)) {
            _results = [];
            for (_i = 0, _len = child.length; _i < _len; _i++) {
              i = child[_i];
              _results.push(i.clone());
            }
            return _results;
          } else {
            return [child];
          }
        })();
        _results = [];
        for (_i = 0, _len = childs.length; _i < _len; _i++) {
          child = childs[_i];
          child.parent = this;
          if ((child.before == null) && sample) {
            child.before = sample.before;
          }
          _results.push(child);
        }
        return _results;
      }
    };

    return Container;

  })(Node);

  Container.WithRules = (function(_super) {
    __extends(WithRules, _super);

    function WithRules() {
      this.rules = [];
      WithRules.__super__.constructor.apply(this, arguments);
    }

    WithRules.prototype.eachDecl = function(callback) {
      return this.each(function(child) {
        var result;
        if (!child.eachDecl) {
          return;
        }
        result = child.eachDecl(callback);
        if (result === false) {
          return result;
        }
      });
    };

    WithRules.prototype.eachRule = function(callback) {
      return this.each((function(_this) {
        return function(child, i) {
          var result;
          result = child.type === 'rule' ? callback(child, i) : child.eachRule ? child.eachRule(callback) : void 0;
          if (result === false) {
            return result;
          }
        };
      })(this));
    };

    WithRules.prototype.eachAtRule = function(callback) {
      return this.eachInside((function(_this) {
        return function(child, i) {
          var result;
          result = child.type === 'atrule' ? callback(child, i) : void 0;
          if (result === false) {
            return result;
          }
        };
      })(this));
    };

    return WithRules;

  })(Container);

  Container.WithDecls = (function(_super) {
    __extends(WithDecls, _super);

    function WithDecls() {
      this.decls = [];
      WithDecls.__super__.constructor.apply(this, arguments);
    }

    WithDecls.prototype.normalize = function(child, sample) {
      if (!child.type && !Array.isArray(child)) {
        child = new Declaration(child);
      }
      return WithDecls.__super__.normalize.call(this, child, sample);
    };

    WithDecls.prototype.eachDecl = function(callback) {
      return this.each((function(_this) {
        return function(node, i) {
          var result;
          if (node.type !== 'decl') {
            return;
          }
          result = callback(node, i);
          if (result === false) {
            return result;
          }
        };
      })(this));
    };

    return WithDecls;

  })(Container);

  module.exports = Container;

}).call(this);
