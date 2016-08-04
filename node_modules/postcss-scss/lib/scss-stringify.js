'use strict';

exports.__esModule = true;
exports.default = scssStringify;

var _scssStringifier = require('./scss-stringifier');

var _scssStringifier2 = _interopRequireDefault(_scssStringifier);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function scssStringify(node, builder) {
    var str = new _scssStringifier2.default(builder);
    str.stringify(node);
}
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNjc3Mtc3RyaW5naWZ5LmVzNiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7a0JBRXdCLGE7O0FBRnhCOzs7Ozs7QUFFZSxTQUFTLGFBQVQsQ0FBdUIsSUFBdkIsRUFBNkIsT0FBN0IsRUFBc0M7QUFDakQsUUFBSSxNQUFNLDhCQUFvQixPQUFwQixDQUFWO0FBQ0EsUUFBSSxTQUFKLENBQWMsSUFBZDtBQUNIIiwiZmlsZSI6InNjc3Mtc3RyaW5naWZ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNjc3NTdHJpbmdpZmllciBmcm9tICcuL3Njc3Mtc3RyaW5naWZpZXInO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzY3NzU3RyaW5naWZ5KG5vZGUsIGJ1aWxkZXIpIHtcbiAgICBsZXQgc3RyID0gbmV3IFNjc3NTdHJpbmdpZmllcihidWlsZGVyKTtcbiAgICBzdHIuc3RyaW5naWZ5KG5vZGUpO1xufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
