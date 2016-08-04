'use strict';

exports.__esModule = true;
exports.default = scssParse;

var _input = require('postcss/lib/input');

var _input2 = _interopRequireDefault(_input);

var _scssParser = require('./scss-parser');

var _scssParser2 = _interopRequireDefault(_scssParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function scssParse(scss, opts) {
    var input = new _input2.default(scss, opts);

    var parser = new _scssParser2.default(input);
    parser.tokenize();
    parser.loop();

    return parser.root;
}
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNjc3MtcGFyc2UuZXM2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztrQkFJd0IsUzs7QUFKeEI7Ozs7QUFFQTs7Ozs7O0FBRWUsU0FBUyxTQUFULENBQW1CLElBQW5CLEVBQXlCLElBQXpCLEVBQStCO0FBQzFDLFFBQUksUUFBUSxvQkFBVSxJQUFWLEVBQWdCLElBQWhCLENBQVo7O0FBRUEsUUFBSSxTQUFTLHlCQUFlLEtBQWYsQ0FBYjtBQUNBLFdBQU8sUUFBUDtBQUNBLFdBQU8sSUFBUDs7QUFFQSxXQUFPLE9BQU8sSUFBZDtBQUNIIiwiZmlsZSI6InNjc3MtcGFyc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSW5wdXQgZnJvbSAncG9zdGNzcy9saWIvaW5wdXQnO1xuXG5pbXBvcnQgU2Nzc1BhcnNlciBmcm9tICcuL3Njc3MtcGFyc2VyJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2Nzc1BhcnNlKHNjc3MsIG9wdHMpIHtcbiAgICBsZXQgaW5wdXQgPSBuZXcgSW5wdXQoc2Nzcywgb3B0cyk7XG5cbiAgICBsZXQgcGFyc2VyID0gbmV3IFNjc3NQYXJzZXIoaW5wdXQpO1xuICAgIHBhcnNlci50b2tlbml6ZSgpO1xuICAgIHBhcnNlci5sb29wKCk7XG5cbiAgICByZXR1cm4gcGFyc2VyLnJvb3Q7XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
