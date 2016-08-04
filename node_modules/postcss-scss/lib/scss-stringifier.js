'use strict';

exports.__esModule = true;

var _stringifier = require('postcss/lib/stringifier');

var _stringifier2 = _interopRequireDefault(_stringifier);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ScssStringifier = function (_Stringifier) {
    _inherits(ScssStringifier, _Stringifier);

    function ScssStringifier() {
        _classCallCheck(this, ScssStringifier);

        return _possibleConstructorReturn(this, _Stringifier.apply(this, arguments));
    }

    ScssStringifier.prototype.comment = function comment(node) {
        var left = this.raw(node, 'left', 'commentLeft');
        var right = this.raw(node, 'right', 'commentRight');

        if (node.raws.inline) {
            this.builder('//' + left + node.text + right, node);
        } else {
            this.builder('/*' + left + node.text + right + '*/', node);
        }
    };

    return ScssStringifier;
}(_stringifier2.default);

exports.default = ScssStringifier;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNjc3Mtc3RyaW5naWZpZXIuZXM2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7Ozs7Ozs7Ozs7O0lBRXFCLGU7Ozs7Ozs7Ozs4QkFFakIsTyxvQkFBUSxJLEVBQU07QUFDVixZQUFJLE9BQVEsS0FBSyxHQUFMLENBQVMsSUFBVCxFQUFlLE1BQWYsRUFBd0IsYUFBeEIsQ0FBWjtBQUNBLFlBQUksUUFBUSxLQUFLLEdBQUwsQ0FBUyxJQUFULEVBQWUsT0FBZixFQUF3QixjQUF4QixDQUFaOztBQUVBLFlBQUssS0FBSyxJQUFMLENBQVUsTUFBZixFQUF3QjtBQUNwQixpQkFBSyxPQUFMLENBQWEsT0FBTyxJQUFQLEdBQWMsS0FBSyxJQUFuQixHQUEwQixLQUF2QyxFQUE4QyxJQUE5QztBQUNILFNBRkQsTUFFTztBQUNILGlCQUFLLE9BQUwsQ0FBYSxPQUFPLElBQVAsR0FBYyxLQUFLLElBQW5CLEdBQTBCLEtBQTFCLEdBQWtDLElBQS9DLEVBQXFELElBQXJEO0FBQ0g7QUFDSixLOzs7OztrQkFYZ0IsZSIsImZpbGUiOiJzY3NzLXN0cmluZ2lmaWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFN0cmluZ2lmaWVyIGZyb20gJ3Bvc3Rjc3MvbGliL3N0cmluZ2lmaWVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2Nzc1N0cmluZ2lmaWVyIGV4dGVuZHMgU3RyaW5naWZpZXIge1xuXG4gICAgY29tbWVudChub2RlKSB7XG4gICAgICAgIGxldCBsZWZ0ICA9IHRoaXMucmF3KG5vZGUsICdsZWZ0JywgICdjb21tZW50TGVmdCcpO1xuICAgICAgICBsZXQgcmlnaHQgPSB0aGlzLnJhdyhub2RlLCAncmlnaHQnLCAnY29tbWVudFJpZ2h0Jyk7XG5cbiAgICAgICAgaWYgKCBub2RlLnJhd3MuaW5saW5lICkge1xuICAgICAgICAgICAgdGhpcy5idWlsZGVyKCcvLycgKyBsZWZ0ICsgbm9kZS50ZXh0ICsgcmlnaHQsIG5vZGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5idWlsZGVyKCcvKicgKyBsZWZ0ICsgbm9kZS50ZXh0ICsgcmlnaHQgKyAnKi8nLCBub2RlKTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
