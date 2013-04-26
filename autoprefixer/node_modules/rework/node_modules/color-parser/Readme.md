
# color-parser

  CSS color string parser

## Installation

    $ component install component/color-parser

### Example

```js
var parse = require('color-parser');

parse('#fc0')
// => { r: 255, g: 204, b: 0, a: 1 }

parse('#ffcc00')
// => { r: 255, g: 204, b: 0, a: 1 }

parse('rgb(255, 204, 0)')
// => { r: 255, g: 204, b: 0, a: 1 }

parse('rgba(255, 204, 0, 1)')
// => { r: 255, g: 204, b: 0, a: 1 }
```

# License

  MIT
