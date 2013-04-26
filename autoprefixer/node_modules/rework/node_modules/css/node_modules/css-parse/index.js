
module.exports = function(css){

  /**
   * Parse stylesheet.
   */

  function stylesheet() {
    return { stylesheet: { rules: rules() }};
  }

  /**
   * Opening brace.
   */

  function open() {
    return match(/^{\s*/);
  }

  /**
   * Closing brace.
   */

  function close() {
    return match(/^}\s*/);
  }

  /**
   * Parse ruleset.
   */

  function rules() {
    var node;
    var rules = [];
    whitespace();
    comments(rules);
    while (css[0] != '}' && (node = atrule() || rule())) {
      rules.push(node);
      comments(rules);
    }
    return rules;
  }

  /**
   * Match `re` and return captures.
   */

  function match(re) {
    var m = re.exec(css);
    if (!m) return;
    css = css.slice(m[0].length);
    return m;
  }

  /**
   * Parse whitespace.
   */

  function whitespace() {
    match(/^\s*/);
  }

  /**
   * Parse comments;
   */

  function comments(rules) {
    rules = rules || [];
    var c;
    while (c = comment()) rules.push(c);
    return rules;
  }

  /**
   * Parse comment.
   */

  function comment() {
    if ('/' == css[0] && '*' == css[1]) {
      var i = 2;
      while ('*' != css[i] || '/' != css[i + 1]) ++i;
      i += 2;
      var comment = css.slice(2, i - 2);
      css = css.slice(i);
      whitespace();
      return { comment: comment };
    }
  }

  /**
   * Parse selector.
   */

  function selector() {
    var m = match(/^([^{]+)/);
    if (!m) return;
    return m[0].trim().split(/\s*,\s*/);
  }

  /**
   * Parse declaration.
   */

  function declaration() {
    // prop
    var prop = match(/^(\*?[-\w]+)\s*/);
    if (!prop) return;
    prop = prop[0];

    // :
    if (!match(/^:\s*/)) return;

    // val
    var val = match(/^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^\)]*?\)|[^};])+)\s*/);
    if (!val) return;
    val = val[0].trim();

    // ;
    match(/^[;\s]*/);

    return { property: prop, value: val };
  }

  /**
   * Parse keyframe.
   */

  function keyframe() {
    var m;
    var vals = [];

    while (m = match(/^(from|to|\d+%|\.\d+%|\d+\.\d+%)\s*/)) {
      vals.push(m[1]);
      match(/^,\s*/);
    }

    if (!vals.length) return;

    return {
      values: vals,
      declarations: declarations()
    };
  }

  /**
   * Parse keyframes.
   */

  function keyframes() {
    var m = match(/^@([-\w]+)?keyframes */);
    if (!m) return;
    var vendor = m[1];

    // identifier
    var m = match(/^([-\w]+)\s*/);
    if (!m) return;
    var name = m[1];

    if (!open()) return;
    comments();

    var frame;
    var frames = [];
    while (frame = keyframe()) {
      frames.push(frame);
      comments();
    }

    if (!close()) return;

    return {
      name: name,
      vendor: vendor,
      keyframes: frames
    };
  }

  /**
   * Parse supports.
   */

  function supports() {
    var m = match(/^@supports *([^{]+)/);
    if (!m) return;
    var supports = m[1].trim();

    if (!open()) return;
    comments();

    var style = rules();

    if (!close()) return;

    return { supports: supports, rules: style };
  }

  /**
   * Parse media.
   */

  function media() {
    var m = match(/^@media *([^{]+)/);
    if (!m) return;
    var media = m[1].trim();

    if (!open()) return;
    comments();

    var style = rules();

    if (!close()) return;

    return { media: media, rules: style };
  }

  /**
   * Parse paged media.
   */

  function atpage() {
    var m = match(/^@page */);
    if (!m) return;

    var sel = selector() || [];
    var decls = [];

    if (!open()) return;
    comments();

    // declarations
    var decl;
    while (decl = declaration() || atmargin()) {
      decls.push(decl);
      comments();
    }

    if (!close()) return;

    return {
      type: "page",
      selectors: sel,
      declarations: decls
    };
  }

  /**
   * Parse margin at-rules
   */

  function atmargin() {
    var m = match(/^@([a-z\-]+) */);
    if (!m) return;
    var type = m[1]

    return {
      type: type,
      declarations: declarations()
    }
  }

  /**
   * Parse import
   */

  function atimport() {
    return _atrule('import')
  }

  /**
   * Parse charset
   */

  function atcharset() {
    return _atrule('charset');
  }

  /**
   * Parse namespace
   */

  function atnamespace() {
    return _atrule('namespace')
  }

  /**
   * Parse non-block at-rules
   */

  function _atrule(name) {
    var m = match(new RegExp('^@' + name + ' *([^;\\n]+);\\s*'));
    if (!m) return;
    var ret = {}
    ret[name] = m[1].trim();
    return ret;
  }

  /**
   * Parse declarations.
   */

  function declarations() {
    var decls = [];

    if (!open()) return;
    comments();

    // declarations
    var decl;
    while (decl = declaration()) {
      decls.push(decl);
      comments();
    }

    if (!close()) return;
    return decls;
  }

  /**
   * Parse at rule.
   */

  function atrule() {
    return keyframes()
      || media()
      || supports()
      || atimport()
      || atcharset()
      || atnamespace()
      || atpage();
  }

  /**
   * Parse rule.
   */

  function rule() {
    var sel = selector();
    if (!sel) return;
    comments();
    return { selectors: sel, declarations: declarations() };
  }

  return stylesheet();
};
