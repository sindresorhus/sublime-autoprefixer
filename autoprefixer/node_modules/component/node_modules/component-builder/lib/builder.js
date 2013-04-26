
/**
 * Module dependencies.
 */

var fs = require('fs')
  , cp = require('fs-extra').copy
  , path = require('path')
  , join = path.join
  , dirname = path.dirname
  , Batch = require('batch')
  , debug = require('debug')('component:builder')
  , Emitter = require('events').EventEmitter
  , requirejs = require('component-require')
  , mkdir = require('mkdirp')
  , utils = require('./utils')
  , dirname = path.dirname
  , basename = path.basename;

/**
 * Expose `Builder`.
 */

module.exports = Builder;

/**
 * Initialize a new `Builder` with the given component `dir`.
 *
 * @param {String} dir
 * @param {Builder} parent
 * @api private
 */

function Builder(dir, parent) {
  var self = this;
  this._cache = {};
  this._hooks = {};
  this._files = {};
  this._js = '';
  this.urlPrefix = '';
  this.copy = false;
  this.dir = dir;
  this.root = ! parent;
  this.parent = parent;
  this.basename = basename(dir);
  this.paths = ['components'];
  this.ignored = {
    scripts: [],
    styles: [],
    files: [],
    images: [],
    fonts: []
  };
  this.on('dependency', this.inherit.bind(this));
}

/**
 * Inherits from `Emitter.prototype`.
 */

Builder.prototype.__proto__ = Emitter.prototype;

/**
 * Copy assets to the given `dir`.
 *
 * @param {String} dir
 * @api public
 */

Builder.prototype.copyAssetsTo = function(dir){
  this.assetsDest = dir;
};

/**
 * Prefix css `url()`s with `str`. For example
 * when building in development and serving from ./build
 * you'll typically want "./" so they become relative
 * and work well with `file://`. However when serving
 * from your application you may want "/public", or
 * no prefix at all such as `/mycomponent/images/foo.png`.
 *
 * @param {String} str
 * @api public
 */

Builder.prototype.prefixUrls = function(str){
  this.urlPrefix = str;
};

/**
 * Inherit lookup paths, ignored, and asset dest dir.
 *
 * @param {Builder} dep
 * @api private
 */

Builder.prototype.inherit = function(dep){
  dep.copy = this.copy;
  dep._cache = this._cache;
  dep._hooks = this._hooks;
  dep.paths = this.paths;
  dep.ignored = this.ignored;
  dep.prefixUrls(this.urlPrefix);
  dep.copyAssetsTo(this.assetsDest);
  if (this.sourceUrls) dep.addSourceURLs();
};

/**
 * Enable "devDependencies" in the build.
 *
 * @api public
 */

Builder.prototype.development = function(){
  debug('dev dependencies enabled');
  this.dev = true;
};

/**
 * Enable "copyFiles" in the build.
 *
 * @api public
 */

Builder.prototype.copyFiles = function(){
  debug('copy files enabled');
  this.copy = true;
};

/**
 * Enable "sourceURLs" in the build.
 *
 * @api public
 */

Builder.prototype.addSourceURLs = function(){
  this.sourceUrls = true;
};

/**
 * Check if this build has deps.
 *
 * @return {Boolean}
 * @api private
 */

Builder.prototype.hasDependencies = function(){
  var conf = this.conf;
  if (conf.local) return true;
  if (conf.dependencies) return true;
  if (this.dev && conf.development) return true;
};

/**
 * Return local dependencies object.
 *
 * @return {Object}
 * @api public
 */

Builder.prototype.local = function(){
  return this.conf.local.reduce(function(obj, name){
    obj[name] = '*';
    return obj;
  }, {});
};

/**
 * Return dependencies.
 *
 * @return {Object}
 * @api private
 */

Builder.prototype.dependencies = function(){
  var conf = this.conf;
  var deps = conf.dependencies || {};
  if (this.dev) merge(deps, conf.development || {});
  if (conf.local) merge(deps, this.local());
  return deps;
};

/**
 * Add lookup path(s).
 *
 * @param {String|Array} path
 * @return {Builder}
 * @api public
 */

Builder.prototype.addLookup = function(path){
  this.paths = this.paths.concat(path);
  return this;
};

/**
 * Lookup component `name` using `.paths`
 * and invoke `fn(err, dir)`.
 *
 * @param {String} name
 * @param {String} fn
 * @api public
 */

Builder.prototype.lookup = function(name, fn){
  var cache = this._cache;
  var paths = this.paths;
  var self = this;
  var i = 0;

  function next() {
    var path = paths[i++];

    // no more paths
    if (!path) return fn(new Error('failed to lookup "' + self.basename + '"\'s dependency "' + name + '"'));

    // path
    var dir = join(path, name);
    var key = name + ':' + dir;

    // check cache
    var val = cache[key];
    if (null != val) {
      if (!val) return next();
      return fn(null, val);
    }

    // lookup
    debug('lookup %s', name);
    var yes = fs.existsSync(dir);

    if (yes) {
      cache[key] = dir;
      return fn(null, dir);
    }

    cache[key] = false;
    next();
  }

  next();
};

/**
 * Ignore the given component name(s) of `type`.
 *
 * This method is used internally to prevent
 * buffering of duplicate components.
 *
 * @param {String} name
 * @param {String} type
 * @api public
 */

Builder.prototype.ignore = function(name, type){
  if (!type) {
    this.ignore(name, 'scripts');
    this.ignore(name, 'styles');
    return;
  }

  debug('ignore %j %s', name, type);
  if (Array.isArray(name)) {
    for (var i = 0; i < name.length; ++i) {
      this.ignored[type].push(normalize(name[i]));
    }
  } else {
    this.ignored[type].push(normalize(name));
  }
};

/**
 * Check if the builder is ignoring `name` and `type`.
 *
 * @param {String} name
 * @param {String} type
 * @return {Boolean}
 * @api public
 */

Builder.prototype.ignoring = function(name, type){
  if (!type) {
    return this.ignoring(name, 'scripts')
      && this.ignoring(name, 'styles');
  }
  return ~this.ignored[type].indexOf(name);
};

/**
 * Return a resolved path relative to this
 * builder's dir.
 *
 * @param {String} file
 * @return {String}
 * @api public
 */

Builder.prototype.path = function(file){
  return path.resolve(path.join(this.dir, file));
};

/**
 * Add file `type` `filename` contents of `val`.
 *
 * @param {String} type
 * @param {String} filename
 * @param {String} val
 * @return {Type}
 * @api public
 */

Builder.prototype.addFile = function(type, filename, val){
  debug('add %s "%s"', type, filename);
  var files = this.conf[type] || (this.conf[type] = []);
  files.push(filename);
  this._files[filename] = val;
};

/**
 * Add remove file `type` `filename` so it does not become
 * part of the build output, for example when transpiling
 * "list.styl" in the `.styles` array to "list.css", otherwise
 * the contents of "list.styl" will become part of the output.
 *
 * @param {String} type
 * @param {String} filename
 * @param {String} val
 * @return {Type}
 * @api public
 */

Builder.prototype.removeFile = function(type, filename){
  debug('remove %s "%s"', type, filename);
  var files = this.conf[type] || (this.conf[type] = []);
  var i = files.indexOf(filename);
  if (~i) files.splice(i, 1);
};

/**
 * Append the given `str` of javascript.
 *
 * @param {String} str
 * @api public
 */

Builder.prototype.append = function(str){
  this._js += str;
};

/**
 * Load JSON and invoke `fn(err, obj)`.
 *
 * @param {Function} fn
 * @api public
 */

Builder.prototype.json = function(fn){
  var self = this;
  var cache = this._cache;

  if (this.conf) return fn(null, this.conf);

  var path = this.path('component.json');
  var conf = cache[path];
  if (conf) return fn(null, this.conf = conf);

  debug('reading %s', path);
  fs.readFile(path, 'utf8', function(err, str){
    if (err) return fn(err);
    try {
      self.conf = cache[path] = JSON.parse(str);
      // TODO: lame, remove me
      if (!self._emittedConfig) {
        self._emittedConfig = true;
        self.emit('config');
      }
      fn(null, self.conf);
    } catch (err) {
      fn(err);
    }
  });
};

/**
 * Build and invoke `fn(err, res)`, where `res`
 * is an object containing:
 *
 *  - `css`
 *  - `js`
 *  - `images`
 *  - `fonts`
 *  - `files`
 *
 * NOTE: Batch maintains result ordering (res.shift()s here)
 *
 * @param {Function} fn
 * @api public
 */

Builder.prototype.build = function(fn){
  var self = this;
  var batch = new Batch;
  debug('building %s', this.dir);
  batch.push(this.buildScripts.bind(this));
  batch.push(this.buildAliases.bind(this));
  batch.push(this.buildStyles.bind(this));
  batch.push(this.buildImages.bind(this));
  batch.push(this.buildFonts.bind(this));
  batch.push(this.buildFiles.bind(this));
  batch.end(function(err, res){
    if (err) return fn(err);
    fn(null, {
      js: res.shift() + '\n' + res.shift() + '\n' + self._js,
      css: res.shift(),
      images: res.shift(),
      fonts: res.shift(),
      files: res.shift(),
      require: requirejs
    });
  });
};

/**
 * Build require() aliases.
 *
 * This is necessary to allow
 * several components of the same
 * name to be used. For example "learnboost/popover"
 * and "visionmedia/popover" may co-exist within
 * an application using this technique, as they
 * are linked as shown here:
 *
 *    ./user
 *      ./deps
 *        ./inherit -> component-inherit
 *
 *    ./animal
 *      ./deps
 *        ./inherit -> component-inherit
 *
 *    ./component-inherit
 *
 *    ./pet-list
 *      ./deps
 *        ./pet -> pet
 *
 *    ./user-list
 *      ./deps
 *        ./user -> user
 *
 *    ./boot
 *      ./deps
 *        ./pet-list -> pets-list
 *        ./user-list -> pets-list
 *
 * TODO: buildScripts() should do this, so that
 * lazily-built components do not omit aliases.
 *
 * TODO: refactor, this is nasty
 *
 * @param {Function} fn
 * @api private
 */

Builder.prototype.buildAliases = function(fn){
  var self = this;
  this.json(function(err, conf){
    if (err) return fn(err);
    var aliases = [];
    var batch = new Batch;

    if (self.hasDependencies()) {
      Object.keys(self.dependencies()).forEach(function(dep){
        batch.push(function(done){
          dep = normalize(dep);
          self.lookup(dep, function(err, dir){
            if (err) return done(err);
            var builder = new Builder(dir, self);
            self.emit('dependency', builder);
            builder.json(function(err, conf){
              if (err) return done(err);
              if (!conf.scripts) return done(null, '');
              var main = builder.conf.main;
              var name = builder.conf.name;

              var aliases = conf.scripts.map(function(script){
                var alias = self.root
                  ? self.conf.name + '/deps/' + name + '/' + script
                  : self.basename + '/deps/' + name + '/' + script;

                return builder.alias(alias, script);
              });

              if (main) {
                var alias = self.root
                  ? self.conf.name + '/deps/' + name + '/index.js'
                  : self.basename + '/deps/' + name + '/index.js';

                aliases.push(builder.alias(alias, main));
              }

              aliases = aliases.join('');

              builder.buildAliases(function(err, str){
                if (err) return done(err);
                done(null, aliases + str);
              });
            });
          });
        });
      });
    }

    batch.end(function(err, res){
      if (err) return fn(err);
      var conf = self.conf;
      var name = self.root
        ? conf.name
        : self.basename;

      if (conf.main) {
        res.push(self.alias(name + '/index.js', conf.main));
      }

      fn(null, res.join('\n'));
    });
  });
};

/**
 * Return an alias from script `a` to `b`.
 *
 * @param {String} a
 * @param {String} b
 * @return {String}
 * @api private
 */

Builder.prototype.alias = function(a, b){
  var name = this.root
    ? this.conf.name
    : this.basename;

  return 'require.alias("' + name + '/' + b + '", "' + a + '");\n';
};

/**
 * Build `type` and invoke `fn`.
 *
 * @param {String} type
 * @param {String} fn
 * @param {String} process
 * @api private
 */

Builder.prototype.buildType = function(type, fn, process){
  var self = this;
  debug('building %s %s', this.basename, type);

  this.json(function(err, conf){
    if (err) return fn(err);
    var batch = new Batch;

    // build dependencies
    if (self.hasDependencies()) {
      Object.keys(self.dependencies()).forEach(function(dep){
        dep = normalize(dep);

        // ignored
        if (self.ignoring(dep, type)) return debug('ignoring %s', dep);

        // ignore it so we dont have dups
        self.ignore(dep, type);

        // lookup dep
        batch.push(function(done){
          self.lookup(dep, function(err, dir){
            if (err) return done(err);
            debug('building dependency %s in %s', dep, dir);
            var builder = new Builder(dir, self);
            self.emit('dependency', builder);
            builder.buildType(type, done, process);
          });
        });
      });
    }

    // "before <type>" hook
    self.performHook('before ' + type, function(error) {
      if (error) return fn(error);

      // build files
      if (conf[type]) {
        conf[type].forEach(function(file){
          var path = self.path(file);
          batch.push(function(done){
            var val = self._files[file];

            // on disk
            if (null == val) {
              debug('read file %s', path);
              fs.readFile(path, 'utf8', function(err, str){
                if (err) return fn(err);
                done(null, process(self, file, str));
              });
              return
            }

            // fabricated
            done(null, process(self, file, val));
          });
        });
      }

      batch.end(function(err, res){
        if (err) return fn(err);
        fn(null, res.join('\n'));
      });
    });
  });
};

/**
 * Build asset `type` and invoke `fn(err, paths)`.
 *
 * @param {String} type
 * @param {Function} fn
 * @api private
 */

Builder.prototype.buildAsset = function(type, fn){
  var self = this;
  debug('build asset %s', type);

  this.json(function(err, conf){
    if (err) return fn(err);
    var batch = new Batch;

    // build dependencies
    if (self.hasDependencies()) {
      Object.keys(self.dependencies()).forEach(function(dep){
        dep = normalize(dep);

        // ignored
        if (self.ignoring(dep, type)) return debug('ignoring %s', dep);

        // ignore it so we dont have dups
        self.ignore(dep, type);

        // lookup dep
        batch.push(function(done){
          self.lookup(dep, function(err, dir){
            if (err) return done(err);
            var builder = new Builder(dir, self);
            self.emit('dependency', builder);
            builder.buildAsset(type, done);
          });
        });
      });
    }

    // copy assets
    if (conf[type]) {
      conf[type].forEach(function(file){
        var path = self.path(file);
        var name = normalize(self.basename);
        var dest = join(self.assetsDest, name, file);
        batch.push(function(done){
          self.copyTo(path, dest, done);
        });
      });
    }

    batch.end(function(err, res){
      if (err) return fn(err);
      fn(null, res);
    });
  });
};

/**
 * Copy `file` to `dest` and invoke `fn(err, path)`.
 *
 * @param {String} file
 * @param {String} dest
 * @param {Function} fn
 * @api private
 */

Builder.prototype.copyTo = function(file, dest, fn){
  var dir = dirname(dest)
    , self = this

  function done(err) {
    if (err && 'EEXIST' == err.code) return fn(null, dest);
    fn(err, dest);
  }

  debug('mkdir -p %s', dir);
  mkdir(dir, function(err){
    if (err) return fn(err);
    if (self.copy){
      debug('cp %s -> %s', file, dest);
      cp(file, dest, done);
    } else {
      debug('link %s -> %s', file, dest);
      fs.symlink(file, dest, done);
    }
  });
};

/**
 * Build `.files` array and invoke `fn(err, paths)`.
 *
 * @param {Function} fn
 * @api private
 */

Builder.prototype.buildFiles = function(fn){
  this.buildAsset('files', fn);
};

/**
 * Build `.images` array and invoke `fn(err, paths)`.
 *
 * @param {Function} fn
 * @api private
 */

Builder.prototype.buildImages = function(fn){
  this.buildAsset('images', fn);
};

/**
 * Build `.fonts` array and invoke `fn(err, paths)`.
 *
 * @param {Function} fn
 * @api private
 */

Builder.prototype.buildFonts = function(fn){
  this.buildAsset('fonts', fn);
};

/**
 * Build scripts and invoke `fn(err, js)`.
 *
 * @param {Function} fn
 * @api private
 */

Builder.prototype.buildScripts = function(fn){
  this.buildType('scripts', fn, register);
};

/**
 * Build styles and invoke `fn(err, css)`.
 *
 * @param {Function} fn
 * @api private
 */

Builder.prototype.buildStyles = function(fn){
  var self = this;
  this.buildType('styles', fn, rewriteUrls);
};

/**
 * Use the given plugin `fn`.
 *
 * @param {Function} fn
 * @return {Builder}
 * @api public
 */

Builder.prototype.use = function(fn){
  fn(this);
  return this;
};

/**
 * Perform hook `name` passing this builder
 * to the hook callback, allowing the hook
 * to work with the "current" builder instance
 * specific to each component, _not_ the root
 * builder.
 *
 * @param {String} name
 * @return {Mixed}
 * @api priate
 */

Builder.prototype.performHook = function(name, fn){
  debug('invoke hook "%s"', name);
  var hooks = this._hooks[name] || [];
  var self = this;
  var i = 0;

  function next(err) {
    if (err) return fn(err);
    var hook = hooks[i++];
    if (!hook) return fn();
    if (hook.length > 1) return hook(self, next);
    hook(self);
    next();
  }

  next();
};

/**
 * Define hook `name` with callback `fn()`.
 *
 * @param {String} name
 * @param {String} fn
 * @api private
 */

Builder.prototype.hook = function(name, fn){
  debug('hook into "%s"', name);
  this._hooks[name] = this._hooks[name] || [];
  this._hooks[name].push(fn);
};

/**
 * No-op processor function.
 */

function noop(builder, file, str){
  return str;
}

/**
 * Return a js string representing a commonjs
 * client-side module with the given `builder`,
 * `file` and `js`.
 *
 * NOTE: Here we special-case the root script so
 * that for example if you are building "tip"
 * to test, you may require('tip') instead of
 * require('component-tip');
 *
 * TODO: ^ remove this special-casing for lazy-loading
 *
 * @param {Builder} builder
 * @param {String} file
 * @param {String} js
 * @return {String}
 * @api private
 */

function register(builder, file, js){
  file =  builder.root
    ? builder.conf.name + '/' + file
    : builder.basename + '/' + file;

  if (builder.sourceUrls) {
    return 'require.register("' + file + '", Function("exports, require, module",\n'
      + JSON.stringify(js + '//@ sourceURL=' + file)
      + '\n));';
  } else {
    return 'require.register("' + file + '", function(exports, require, module){\n'
      + js
      + '\n});';
  }
}

/**
 * Return css with urls rewritten relative
 * to the `.assetDest` directory. This allows
 * the consumer to serve the asset destination
 * directory (typically `./build`) to match
 * the symlinks made.
 *
 * @param {Builder} builder
 * @param {String} file
 * @param {String} css
 * @return {String}
 * @api private
 */

function rewriteUrls(builder, file, css) {
  function isAbsolute(url) {
    return ~url.indexOf('://') || url[0] == '/';
  }

  function isData(url) {
    return 0 == url.indexOf('data:');
  }

  function rewrite(_, url) {
    var orig = 'url(' + url + ')';
    url = utils.stripQuotes(url);
    if (isData(url)) return orig;
    if (isAbsolute(url)) return orig;
    var name = normalize(builder.basename);
    url = join(builder.urlPrefix, '/', name, dirname(file), url);
    return 'url("' + url + '")';
  }

  return css.replace(/\burl *\(([^)]+)\)/g, rewrite);
}

/**
 * Merge `b` into `a`.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */

function merge(a, b) {
  for (var key in b) a[key] = b[key];
  return a;
}

/**
 * Normalize package `name`.
 *
 * @param {String} name
 * @return {String}
 * @api private
 */

function normalize(name) {
  return name.replace('/', '-');
}
