import sublime
import sublime_plugin
import os
import platform
from subprocess import Popen, PIPE
from os.path import dirname, realpath, join


# monkeypatch `Region` to be iterable
sublime.Region.totuple = lambda self: (self.a, self.b)
sublime.Region.__iter__ = lambda self: self.totuple().__iter__()

BIN_PATH = join(sublime.packages_path(), dirname(realpath(__file__)), 'autoprefixer', 'bin', 'autoprefixer')
IS_WINDOWS = platform.system() == 'Windows'
IS_OSX = platform.system() == 'Darwin'


class AutoprefixerCommand(sublime_plugin.TextCommand):
	def run(self, edit):
		if not self.is_css():
			return
		self.browsers = ','.join(sublime.load_settings('Autoprefixer.sublime-settings').get('browsers'))
		if not self.has_selection():
			region = sublime.Region(0, self.view.size())
			originalBuffer = self.view.substr(region)
			prefixed = self.prefix(originalBuffer)
			if prefixed:
				self.view.replace(edit, region, prefixed)
			return
		for region in self.view.sel():
			if region.empty():
				continue
			originalBuffer = self.view.substr(region)
			prefixed = self.prefix(originalBuffer)
			if prefixed:
				self.view.replace(edit, region, prefixed)

	def prefix(self, data):
		env = None
		if IS_OSX:
			# GUI apps in OS X doesn't contain .bashrc set paths
			env = os.environ.copy()
			env['PATH'] += ':/usr/local/bin'
		try:
			p = Popen(['node', BIN_PATH, '-b', self.browsers],
				stdout=PIPE, stdin=PIPE, stderr=PIPE,
				env=env, shell=IS_WINDOWS)
		except OSError:
			sublime.error_message('Couldn\'t find Node.js. Make sure it\'s in your $PATH. See install guide: https://github.com/sindresorhus/sublime-autoprefixer')
			return
		stdout, stderr = p.communicate(input=data.encode('utf-8'))
		stdout = stdout.decode('utf-8')
		stderr = stderr.decode('utf-8')
		if stderr:
			sublime.error_message('Autoprefixer error: ' + stderr)
		else:
			return stdout

	def has_selection(self):
		for sel in self.view.sel():
			start, end = sel
			if start != end:
				return True
		return False

	def is_css(self):
		return self.view.settings().get('syntax') == 'Packages/CSS/CSS.tmLanguage'
