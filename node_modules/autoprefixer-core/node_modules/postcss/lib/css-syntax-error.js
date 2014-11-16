"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

var PreviousMap = require("./previous-map");

var path = require("path");

var CssSyntaxError = (function (Error) {
  var CssSyntaxError = function CssSyntaxError(input, message, line, column) {
    this.reason = message;

    var origin = input.origin(line, column);

    if (origin) {
      for (var name in origin) {
        this[name] = origin[name];
      }

      this.generated = {
        line: line,
        column: column,
        source: input.css
      };
      if (input.file) this.generated.file = input.file;
    } else {
      if (input.file) this.file = input.file;
      this.line = line;
      this.column = column;
      this.source = input.css;
    }

    this.message = this.file ? this.file : "<css input>";
    this.message += ":" + line + ":" + column + ": " + message;
  };

  _extends(CssSyntaxError, Error);

  _classProps(CssSyntaxError, null, {
    highlight: {
      writable: true,
      value: function (color) {
        var num = this.line - 1;
        var lines = this.source.split("\n");

        var prev = num > 0 ? lines[num - 1] + "\n" : "";
        var broken = lines[num];
        var next = num < lines.length - 1 ? "\n" + lines[num + 1] : "";

        var mark = "\n";
        for (var i = 0; i < this.column - 1; i++) {
          mark += " ";
        }

        if (typeof (color) == "undefined" && typeof (process) != "undefined") {
          if (process.stdout && process.env) {
            color = process.stdout.isTTY && !process.env.NODE_DISABLE_COLORS;
          }
        }

        if (color) {
          mark += "\u001b[1;31m^\u001b[0m";
        } else {
          mark += "^";
        }

        return prev + broken + mark + next;
      }
    },
    toString: {
      writable: true,
      value: function () {
        var text = this.message;
        if (this.source) text += "\n" + this.highlight();
        return text;
      }
    }
  });

  return CssSyntaxError;
})(Error);

module.exports = CssSyntaxError;