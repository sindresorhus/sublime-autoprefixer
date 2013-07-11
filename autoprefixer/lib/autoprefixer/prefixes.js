(function() {
  var Prefixes, Processor, Value, utils;

  utils = require('./utils');

  Processor = require('./processor');

  Value = require('./value');

  Value.register(require('./hacks/gradient'));

  Prefixes = (function() {
    function Prefixes(data, browsers) {
      var _ref;
      this.data = data;
      this.browsers = browsers;
      _ref = this.preprocess(this.select(this.data)), this.add = _ref[0], this.remove = _ref[1];
      this.otherCache = {};
      this.processor = new Processor(this);
    }

    Prefixes.prototype.transitionProps = ['transition', 'transition-property'];

    Prefixes.prototype.select = function(list) {
      var add, all, data, name, selected,
        _this = this;
      selected = {
        add: {},
        remove: {}
      };
      for (name in list) {
        data = list[name];
        add = data.browsers.filter(function(i) {
          return _this.browsers.isSelected(i);
        }).map(function(i) {
          return _this.browsers.prefix(i);
        }).sort(function(a, b) {
          return b.length - a.length;
        });
        all = utils.uniq(data.browsers.map(function(i) {
          return _this.browsers.prefix(i);
        }));
        if (add.length) {
          add = utils.uniq(add);
          selected.add[name] = add;
          if (add.length < all.length) {
            selected.remove[name] = all.filter(function(i) {
              return add.indexOf(i) === -1;
            });
          }
        } else {
          selected.remove[name] = all;
        }
      }
      return selected;
    };

    Prefixes.prototype.preprocess = function(selected) {
      var add, name, prefix, prefixed, prefixes, prop, props, regexp, remove, value, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1;
      add = {};
      _ref = selected.add;
      for (name in _ref) {
        prefixes = _ref[name];
        props = this.data[name].transition ? this.transitionProps : this.data[name].props;
        if (props) {
          value = Value.load(name, prefixes);
          for (_i = 0, _len = props.length; _i < _len; _i++) {
            prop = props[_i];
            if (!add[prop]) {
              add[prop] = {};
            }
            if (!add[prop].values) {
              add[prop].values = [];
            }
            add[prop].values.push(value);
          }
        }
        if (!this.data[name].props) {
          if (!add[name]) {
            add[name] = {};
          }
          add[name].prefixes = prefixes;
        }
      }
      remove = {};
      _ref1 = selected.remove;
      for (name in _ref1) {
        prefixes = _ref1[name];
        props = this.data[name].transition ? this.transitionProps : this.data[name].props;
        if (props) {
          value = Value.load(name);
          for (_j = 0, _len1 = prefixes.length; _j < _len1; _j++) {
            prefix = prefixes[_j];
            regexp = value.prefixed(prefix);
            for (_k = 0, _len2 = props.length; _k < _len2; _k++) {
              prop = props[_k];
              if (!remove[prop]) {
                remove[prop] = {};
              }
              if (!remove[prop].values) {
                remove[prop].values = [];
              }
              remove[prop].values.push(regexp);
            }
          }
        }
        if (!this.data[name].props) {
          for (_l = 0, _len3 = prefixes.length; _l < _len3; _l++) {
            prefix = prefixes[_l];
            prefixed = prefix + name;
            if (!remove[prefixed]) {
              remove[prefixed] = {};
            }
            remove[prefixed].remove = true;
          }
        }
      }
      return [add, remove];
    };

    Prefixes.prototype.other = function(prefix) {
      var _base;
      return (_base = this.otherCache)[prefix] || (_base[prefix] = this.browsers.prefixes().filter(function(i) {
        return i !== prefix;
      }));
    };

    Prefixes.prototype.each = function(prop, callback) {
      var prefix, _i, _len, _ref, _results;
      if (this.add[prop] && this.add[prop].prefixes) {
        _ref = this.add[prop].prefixes;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          prefix = _ref[_i];
          _results.push(callback(prefix));
        }
        return _results;
      }
    };

    Prefixes.prototype.values = function(type, prop) {
      var data, values, _ref, _ref1;
      data = this[type];
      values = ((_ref = data['*']) != null ? _ref.values : void 0) || [];
      if ((_ref1 = data[prop]) != null ? _ref1.values : void 0) {
        values = values.concat(data[prop].values);
      }
      return utils.uniq(values);
    };

    Prefixes.prototype.toRemove = function(prop) {
      var _ref;
      return (_ref = this.remove[prop]) != null ? _ref.remove : void 0;
    };

    return Prefixes;

  })();

  module.exports = Prefixes;

}).call(this);
