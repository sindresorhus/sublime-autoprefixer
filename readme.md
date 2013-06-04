# sublime-autoprefixer

> Sublime plugin to prefix your CSS

![screenshot](screenshot.gif)

Adding prefixes manually is a chore. It's also hard to keep track of where and which prefixes are needed. This plugin uses the [Autoprefixer](https://github.com/ai/autoprefixer) library to prefix properties and values according to the [Can I Use](http://caniuse.com/) database. Which means it will only add the necessary prefixes and not bloat your stylesheet. It even lets you specify what browser versions you want to target. In addition it will remove existing prefixes which are no longer needed.


## Install

**You need to have [Node.js](http://nodejs.org) installed.**
Make sure it's in your $PATH by running `node -v` in your command-line.


### Sublime Text 2

Install `Autoprefixer` with [Package Control](http://wbond.net/sublime_packages/package_control) and restart Sublime.


### Sublime Text 3

[Download](https://github.com/sindresorhus/sublime-autoprefixer/archive/master.zip), unzip, and put the contents in `~/Library/Application Support/Sublime Text 3/Packages/Autoprefixer`.  
Will be easier when Package Control is fully compatible.


## Getting started

In a CSS file, open the Command Palette *(Cmd+Shift+P)* and choose `Autoprefix CSS`. You can alternatively create one or more selections before running the command to only prefix those parts.


### Options

*(Preferences > Package Settings > JsRun > Settings - User)*

You can specify which browsers you need to support using an array of rules:

- last n versions is last n versions for each browser (eg. [Google also uses](http://support.google.com/a/bin/answer.py?answer=33864) `last 2 version` strategy).
- `> n%` is browser versions, in which global usage statistics is more than n%.
- You can also set browsers directly.

#### Default

```json
{
	"browsers": ["last 2 versions"]
}
```


#### Example

```json
{
	"browsers": ["last 1 version", "> 10%", "ie 8", "ie 7"]
}
```

This will add the needed prefixes for the last version of each browser, all browsers with market share of more than 10%, and Internet Explorer 7 and 8.


### Keyboard shortcut

You can also set up a keyboard shortcut to run the command by opening up "Preferences > Key Bindings - User" and adding your shortcut with the `autoprefixer` command.

Example:

```json
[
	{ "keys": ["alt+super+p"], "command": "autoprefixer" }
]
```


## Known issues

It currently [doesn't preserve your indentation](https://github.com/ai/autoprefixer/issues/11), but instead forces it to 2 spaces.


## License

MIT License • © [Sindre Sorhus](http://sindresorhus.com)
