# get-stdin

> Get [stdin](https://nodejs.org/api/process.html#process_process_stdin) as a string or `Uint8Array`

## Install

```sh
npm install get-stdin
```

## Usage

```js
// example.js
import getStdin from 'get-stdin';

console.log(await getStdin());
//=> 'unicorns'
```

Run the script with piped input:

```
$ echo unicorns | node example.js
unicorns
```

Or run interactively by allowing TTY input and type input, then press Ctrl+D (Unix) or Ctrl+Z (Windows) to signal end of input:

```js
// example.js
import getStdin from 'get-stdin';

console.log(await getStdin({allowTTY: true}));
//=> 'unicorns'
```

```
$ node example.js
unicorns
<Ctrl+D>
unicorns
```

## API

Both methods return a promise that is resolved when the `end` event fires on the `stdin` stream, indicating that there is no more data to be read.

By default, in a TTY context the promise resolves with an empty string or `Uint8Array`. This avoids hanging CLIs that only want piped input and lets them fall back to other input methods. An empty string or `Uint8Array` means no input was read. To read from a TTY, set `allowTTY: true` and explicitly close `stdin` (Ctrl+D on Unix, Ctrl+Z on Windows).

### getStdin(options?)

Get `stdin` as a `string`.

#### options

Type: `object`

##### allowTTY

Type: `boolean`\
Default: `false`

Allow reading from a TTY.

Use this when you want interactive behavior like `cat` or other Unix filters that wait for EOF even without piped input. The default resolves immediately in a TTY to avoid hanging CLIs that only want piped input and lets them fall back to other input methods.

##### stdin

Type: `Readable stream`\
Default: `process.stdin`

Stream to read from.

Useful for tests or to read from a custom stream.

### getStdin.buffer(options?)

Get `stdin` as a `Uint8Array`.

#### options

Type: `object`

##### allowTTY

Type: `boolean`\
Default: `false`

Allow reading from a TTY.

Use this when you want interactive behavior like `cat` or other Unix filters that wait for EOF even without piped input. The default resolves immediately in a TTY to avoid hanging CLIs that only want piped input and lets them fall back to other input methods.

##### stdin

Type: `Readable stream`\
Default: `process.stdin`

Stream to read from.

Useful for tests or to read from a custom stream.

## Tip

You can now accomplish this natively in Node.js using [`streamConsumers.text()`](https://nodejs.org/api/webstreams.html#streamconsumerstextstream) or [`streamConsumers.buffer()`](https://nodejs.org/api/webstreams.html#streamconsumersbufferstream):

```js
// example.js
import {text} from 'node:stream/consumers';

console.log(await text(process.stdin))
//=> 'unicorns'
````

```
$ echo unicorns | node example.js
unicorns
```

## Related

- [get-stream](https://github.com/sindresorhus/get-stream) - Get a stream as a string or buffer
