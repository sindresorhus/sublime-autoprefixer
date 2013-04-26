# builder.js

  Component build tool. This is the library that `component(1)` utilizes
  to perform component builds.

## Installation

    $ npm install component-builder

## API

### new Builder(dir)

  Creates a new `Builder` for the given component's `dir`:

```js
var Builder = require('component-builder');
var builder = new Builder('components/visionmedia-page');
```

### Builder#conf

  The component.json contents.

### Builder#addSourceURLs()

  Add "sourceURL" support, wrapping the module functions
  in `Function()` calls so that browsers may assign a 
  name to the scripts to aid in debugging.

### Builder#addLookup(path)

  Add the given dependency lookup `path`.

### Builder#development()

  Include development dependencies.

### Builder#addFile(type, filename, val)

  Add a fabricated file of the given `type`, `filename`,
  and contents `val`. For example if you were translating
  a Stylus file to .css, or a Jade template to .js you may
  do something like:

```js
builder.addFile('scripts', 'view.js', 'compiled view js');
```

### Builder#ignore(name, [type])

  Ignore building `name`'s `type`, where `type` is "scripts" or "styles". When
  no `type` is given both are ignored, this includes dependencies of `name` as well.

```js
builder.ignore('visionmedia-page')
```

### Builder#build(fn)

  Perform the build and pass an object to `fn(err, obj)` containing
  the `.css` and `.js` properties.

## Hooks

  A build "hook" is like an event that lets you manipulate the build in process. For
  example you may use a hook to translate coffee script files to javascript automatically,
  or compile a template to javascript so that it may be loaded with `require()`, or use
  CSS pre-processors such as [rework](github.com/visionmedia/rework).

## License 

  MIT
