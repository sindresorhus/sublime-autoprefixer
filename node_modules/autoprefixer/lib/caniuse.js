(function() {
  module.exports = {
    browsers: {
      firefox: 'ff',
      chrome: 'chrome',
      safari: 'safari',
      ios_saf: 'ios',
      opera: 'opera',
      ie: 'ie',
      bb: 'bb',
      android: 'android'
    },
    sort: function(browsers) {
      return browsers.sort(function(a, b) {
        a = a.split(' ');
        b = b.split(' ');
        if (a[0] > b[0]) {
          return 1;
        } else if (a[0] < b[0]) {
          return -1;
        } else {
          return parseFloat(a[1]) - parseFloat(b[1]);
        }
      });
    },
    parse: function(data, opts) {
      var browser, interval, match, need, support, version, versions, _i, _len, _ref, _ref1;
      match = opts.full ? /y\sx($|\s)/ : /\sx($|\s)/;
      need = [];
      _ref = data.stats;
      for (browser in _ref) {
        versions = _ref[browser];
        for (interval in versions) {
          support = versions[interval];
          _ref1 = interval.split('-');
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            version = _ref1[_i];
            if (this.browsers[browser] && support.match(match)) {
              version = version.replace(/\.0$/, '');
              need.push(this.browsers[browser] + ' ' + version);
            }
          }
        }
      }
      return this.sort(need);
    },
    feature: function(data, opts, callback) {
      var _ref;
      if (!callback) {
        _ref = [opts, {}], callback = _ref[0], opts = _ref[1];
      }
      return callback(module.exports.parse(data, opts));
    },
    map: function(browsers, callback) {
      var browser, name, version, _i, _len, _ref, _results;
      _results = [];
      for (_i = 0, _len = browsers.length; _i < _len; _i++) {
        browser = browsers[_i];
        _ref = browser.split(' '), name = _ref[0], version = _ref[1];
        version = parseFloat(version);
        _results.push(callback(browser, name, version));
      }
      return _results;
    }
  };

}).call(this);
