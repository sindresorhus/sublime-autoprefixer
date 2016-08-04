'use strict';

exports.__esModule = true;

var _comment = require('postcss/lib/comment');

var _comment2 = _interopRequireDefault(_comment);

var _parser = require('postcss/lib/parser');

var _parser2 = _interopRequireDefault(_parser);

var _scssTokenize = require('./scss-tokenize');

var _scssTokenize2 = _interopRequireDefault(_scssTokenize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ScssParser = function (_Parser) {
    _inherits(ScssParser, _Parser);

    function ScssParser() {
        _classCallCheck(this, ScssParser);

        return _possibleConstructorReturn(this, _Parser.apply(this, arguments));
    }

    ScssParser.prototype.tokenize = function tokenize() {
        this.tokens = (0, _scssTokenize2.default)(this.input);
    };

    ScssParser.prototype.comment = function comment(token) {
        if (token[6] === 'inline') {
            var node = new _comment2.default();
            this.init(node, token[2], token[3]);
            node.raws.inline = true;
            node.source.end = { line: token[4], column: token[5] };

            var text = token[1].slice(2);
            if (/^\s*$/.test(text)) {
                node.text = '';
                node.raws.left = text;
                node.raws.right = '';
            } else {
                var match = text.match(/^(\s*)([^]*[^\s])(\s*)$/);
                node.text = match[2];
                node.raws.left = match[1];
                node.raws.right = match[3];
            }
        } else {
            _Parser.prototype.comment.call(this, token);
        }
    };

    return ScssParser;
}(_parser2.default);

exports.default = ScssParser;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNjc3MtcGFyc2VyLmVzNiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUE7Ozs7QUFDQTs7OztBQUVBOzs7Ozs7Ozs7Ozs7SUFFcUIsVTs7Ozs7Ozs7O3lCQUVqQixRLHVCQUFXO0FBQ1AsYUFBSyxNQUFMLEdBQWMsNEJBQWMsS0FBSyxLQUFuQixDQUFkO0FBQ0gsSzs7eUJBRUQsTyxvQkFBUSxLLEVBQU87QUFDWCxZQUFLLE1BQU0sQ0FBTixNQUFhLFFBQWxCLEVBQTZCO0FBQ3pCLGdCQUFJLE9BQU8sdUJBQVg7QUFDQSxpQkFBSyxJQUFMLENBQVUsSUFBVixFQUFnQixNQUFNLENBQU4sQ0FBaEIsRUFBMEIsTUFBTSxDQUFOLENBQTFCO0FBQ0EsaUJBQUssSUFBTCxDQUFVLE1BQVYsR0FBbUIsSUFBbkI7QUFDQSxpQkFBSyxNQUFMLENBQVksR0FBWixHQUFtQixFQUFFLE1BQU0sTUFBTSxDQUFOLENBQVIsRUFBa0IsUUFBUSxNQUFNLENBQU4sQ0FBMUIsRUFBbkI7O0FBRUEsZ0JBQUksT0FBTyxNQUFNLENBQU4sRUFBUyxLQUFULENBQWUsQ0FBZixDQUFYO0FBQ0EsZ0JBQUssUUFBUSxJQUFSLENBQWEsSUFBYixDQUFMLEVBQTBCO0FBQ3RCLHFCQUFLLElBQUwsR0FBa0IsRUFBbEI7QUFDQSxxQkFBSyxJQUFMLENBQVUsSUFBVixHQUFrQixJQUFsQjtBQUNBLHFCQUFLLElBQUwsQ0FBVSxLQUFWLEdBQWtCLEVBQWxCO0FBQ0gsYUFKRCxNQUlPO0FBQ0gsb0JBQUksUUFBUSxLQUFLLEtBQUwsQ0FBVyx5QkFBWCxDQUFaO0FBQ0EscUJBQUssSUFBTCxHQUFrQixNQUFNLENBQU4sQ0FBbEI7QUFDQSxxQkFBSyxJQUFMLENBQVUsSUFBVixHQUFrQixNQUFNLENBQU4sQ0FBbEI7QUFDQSxxQkFBSyxJQUFMLENBQVUsS0FBVixHQUFrQixNQUFNLENBQU4sQ0FBbEI7QUFDSDtBQUNKLFNBakJELE1BaUJPO0FBQ0gsOEJBQU0sT0FBTixZQUFjLEtBQWQ7QUFDSDtBQUNKLEs7Ozs7O2tCQTNCZ0IsVSIsImZpbGUiOiJzY3NzLXBhcnNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDb21tZW50IGZyb20gJ3Bvc3Rjc3MvbGliL2NvbW1lbnQnO1xuaW1wb3J0IFBhcnNlciAgZnJvbSAncG9zdGNzcy9saWIvcGFyc2VyJztcblxuaW1wb3J0IHNjc3NUb2tlbml6ZXIgZnJvbSAnLi9zY3NzLXRva2VuaXplJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2Nzc1BhcnNlciBleHRlbmRzIFBhcnNlciB7XG5cbiAgICB0b2tlbml6ZSgpIHtcbiAgICAgICAgdGhpcy50b2tlbnMgPSBzY3NzVG9rZW5pemVyKHRoaXMuaW5wdXQpO1xuICAgIH1cblxuICAgIGNvbW1lbnQodG9rZW4pIHtcbiAgICAgICAgaWYgKCB0b2tlbls2XSA9PT0gJ2lubGluZScgKSB7XG4gICAgICAgICAgICBsZXQgbm9kZSA9IG5ldyBDb21tZW50KCk7XG4gICAgICAgICAgICB0aGlzLmluaXQobm9kZSwgdG9rZW5bMl0sIHRva2VuWzNdKTtcbiAgICAgICAgICAgIG5vZGUucmF3cy5pbmxpbmUgPSB0cnVlO1xuICAgICAgICAgICAgbm9kZS5zb3VyY2UuZW5kICA9IHsgbGluZTogdG9rZW5bNF0sIGNvbHVtbjogdG9rZW5bNV0gfTtcblxuICAgICAgICAgICAgbGV0IHRleHQgPSB0b2tlblsxXS5zbGljZSgyKTtcbiAgICAgICAgICAgIGlmICggL15cXHMqJC8udGVzdCh0ZXh0KSApIHtcbiAgICAgICAgICAgICAgICBub2RlLnRleHQgICAgICAgPSAnJztcbiAgICAgICAgICAgICAgICBub2RlLnJhd3MubGVmdCAgPSB0ZXh0O1xuICAgICAgICAgICAgICAgIG5vZGUucmF3cy5yaWdodCA9ICcnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgbWF0Y2ggPSB0ZXh0Lm1hdGNoKC9eKFxccyopKFteXSpbXlxcc10pKFxccyopJC8pO1xuICAgICAgICAgICAgICAgIG5vZGUudGV4dCAgICAgICA9IG1hdGNoWzJdO1xuICAgICAgICAgICAgICAgIG5vZGUucmF3cy5sZWZ0ICA9IG1hdGNoWzFdO1xuICAgICAgICAgICAgICAgIG5vZGUucmF3cy5yaWdodCA9IG1hdGNoWzNdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3VwZXIuY29tbWVudCh0b2tlbik7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
