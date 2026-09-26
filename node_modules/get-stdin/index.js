const {stdin: processStdin} = globalThis.process ?? {}; // eslint-disable-line n/prefer-global/process

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder('utf8', {
	// Strip BOM since JS strings are already Unicode and it only adds noise.
	ignoreBOM: false,
});

const getStdinBuffer = async (options = {}) => {
	const {
		stdin = processStdin,
		allowTTY = false,
	} = options;

	if (stdin.isTTY && !allowTTY) {
		return new Uint8Array();
	}

	const result = [];
	let length = 0;

	for await (const chunk of stdin) {
		let data;
		if (typeof chunk === 'string') {
			data = textEncoder.encode(chunk);
		} else if (chunk instanceof Uint8Array) {
			data = chunk;
		} else {
			throw new TypeError('Expected chunk to be a string or Uint8Array');
		}

		result.push(data);
		length += data.length;
	}

	const buffer = new Uint8Array(length);
	let offset = 0;

	for (const chunk of result) {
		buffer.set(chunk, offset);
		offset += chunk.length;
	}

	return buffer;
};

export default async function getStdin(options) {
	const uint8Array = await getStdinBuffer(options);
	return textDecoder.decode(uint8Array);
}

getStdin.buffer = getStdinBuffer;
