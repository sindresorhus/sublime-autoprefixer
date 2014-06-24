(function() {
  var deprected, mozilla;

  mozilla = require('source-map');

  deprected = function(from, to) {
    return console.warn(("Option " + from + " is deprected and will be deleted in PostCSS 1.1.\n") + ("Use map: { " + to + " } instead."));
  };

  module.exports = function(old) {
    var map, name, opts, value, _base;
    opts = {};
    map = {};
    for (name in old) {
      value = old[name];
      if (name === 'map') {
        if (value === 'inline') {
          map.inline = true;
        } else if (typeof value === 'string') {
          deprected('map: prevMap', 'prev: prevMap');
          map.prev = value;
        } else if (value instanceof mozilla.SourceMapConsumer) {
          deprected('map: prevMap', 'prev: prevMap');
          map.prev = value;
        } else if (value instanceof mozilla.SourceMapGenerator) {
          deprected('map: prevMap', 'prev: prevMap');
          map.prev = value;
        } else if (typeof value === 'object' && (value.mappings != null)) {
          deprected('map: prevMap', 'prev: prevMap');
          map.prev = value;
        } else if (typeof value === 'object' || typeof value === 'boolean') {
          opts.map = value;
        } else {
          deprected('map: prevMap', 'prev: prevMap');
          map.prev = value;
        }
      } else if (name === 'mapAnnotation') {
        deprected("mapAnnotation", "annotation: " + value);
        map.annotation = value;
      } else if (name === 'inlineMap') {
        deprected("inlineMap", "inline: " + value);
        map.inline = value;
      } else {
        opts[name] = value;
      }
    }
    if (Object.keys(map).length > 0) {
      if (typeof opts.map === 'object') {
        for (name in map) {
          value = map[name];
          (_base = opts.map)[name] || (_base[name] = value);
        }
      } else {
        opts.map = map;
      }
    }
    return opts;
  };

}).call(this);
