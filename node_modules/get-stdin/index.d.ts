export type Options = {
	/**
	Allow reading from a TTY.

	Use this when you want interactive behavior like `cat` or other Unix filters that wait for EOF even without piped input. The default resolves immediately in a TTY to avoid hanging CLIs that only want piped input and lets them fall back to other input methods.

	@default false
	*/
	readonly allowTTY?: boolean;

	/**
	Stream to read from.

	Useful for tests or to read from a custom stream. Defaults to `process.stdin`.
	*/
	readonly stdin?: NodeJS.ReadableStream;
};

declare const getStdin: {
	/**
	Get [`stdin`](https://nodejs.org/api/process.html#process_process_stdin) as a `string`.

	@returns A promise that is resolved when the `end` event fires on the `stdin` stream, indicating that there is no more data to be read.

	By default, in a TTY context the promise resolves with an empty string. This avoids hanging CLIs that only want piped input and lets them fall back to other input methods. An empty string means no input was read. To read from a TTY, set `allowTTY: true` and explicitly close `stdin` (Ctrl+D on Unix, Ctrl+Z on Windows).

	@example
	```
	// example.ts
	import getStdin from 'get-stdin';

	console.log(await getStdin());
	//=> 'unicorns'
	```

	Run the script with piped input:
	```
	$ echo unicorns | npx ts-node example.ts
	unicorns
	```

	Or run interactively by allowing TTY input and type input, then press Ctrl+D (Unix) or Ctrl+Z (Windows) to signal end of input:

	```
	// example.ts
	import getStdin from 'get-stdin';

	console.log(await getStdin({allowTTY: true}));
	//=> 'unicorns'
	```
	```
	$ npx ts-node example.ts
	unicorns
	<Ctrl+D>
	unicorns
	```
	*/
	(options?: Options): Promise<string>;

	/**
	Get [`stdin`](https://nodejs.org/api/process.html#process_process_stdin) as a `Uint8Array`.

	@returns A promise that is resolved when the `end` event fires on the `stdin` stream, indicating that there is no more data to be read.

	By default, in a TTY context the promise resolves with an empty `Uint8Array`. This avoids hanging CLIs that only want piped input and lets them fall back to other input methods. An empty `Uint8Array` means no input was read. To read from a TTY, set `allowTTY: true` and explicitly close `stdin` (Ctrl+D on Unix, Ctrl+Z on Windows).
	*/
	buffer(options?: Options): Promise<Uint8Array>;
};

export default getStdin;
