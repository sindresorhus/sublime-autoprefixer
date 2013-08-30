# detect-indent [![Build Status](https://secure.travis-ci.org/sindresorhus/detect-indent.png?branch=master)](http://travis-ci.org/sindresorhus/detect-indent)

> Detect the indentation of code

Pass in a string and get the indentation. Works in Node.js and the browser on any kind of text.


## Use cases

- Persisting the indentation when modifying a file.
- Setting the right indentation in your editor.


## Install

Download the library [manually](https://github.com/sindresorhus/detect-indent/releases) or with a package-manager.

#### [npm](https://npmjs.org/package/detect-indent)

```
npm install --save detect-indent
```

#### [Bower](http://bower.io)

```
bower install --save detect-indent
```

#### [Component](https://github.com/component/component)

```
component install sindresorhus/detect-indent
```


## API

Accepts a string and returns the indentation or `null` if it can't be detected.


## Example

Modify a JSON file while persisting the indentation in Node.js.

```js
var fs = require('fs');
var detectIndent = require('detect-indent');
/*
{
    "ilove": "pizza"
}
*/
var file = fs.readFileSync('foo.json', 'utf8');
// tries to detect the indentation and falls back to a default if it can't
var indent = detectIndent(file) || '    ';
var json = JSON.parse(file);

json.ilove = 'unicorns';

fs.writeFileSync('foo.json', JSON.stringify(json, null, indent));
/*
{
    "ilove": "unicorns"
}
*/
```


## License

MIT License • © [Sindre Sorhus](http://sindresorhus.com)
