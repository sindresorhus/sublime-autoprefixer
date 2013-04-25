import sublime
import sublime_plugin
import os

from subprocess import Popen, PIPE
from os.path import dirname, realpath, join


# manually add the /usr/local/bin path since it's not read from .bashrc for GUI apps on OS X
os.environ['PATH'] += os.pathsep + '/usr/local/bin'


# monkeypatch `Region` to be iterable
sublime.Region.totuple = lambda self: (self.a, self.b)
sublime.Region.__iter__ = lambda self: self.totuple().__iter__()


BIN_PATH = join(sublime.packages_path(), dirname(realpath(__file__)), 'autoprefixer', 'bin', 'autoprefixer')


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
		try:
			p = Popen(['node', BIN_PATH, '-b', self.browsers], stdout=PIPE, stdin=PIPE, stderr=PIPE)
		except OSError:
			sublime.error_message('Couldn\'t find Node.js. Make sure it\'s in your $PATH. See installation guide: https://github.com/sindresorhus/sublime-autoprefixer')
			return
		stdout, stderr = p.communicate(input=data.encode())
		stdout = stdout.decode()
		stderr = stderr.decode()
		if stderr:
			sublime.error_message('Autoprefixer error: ' + stderr)
		return stdout

	def has_selection(self):
		for sel in self.view.sel():
			start, end = sel
			if start != end:
				return True
		return False

	def is_css(self):
		return self.view.settings().get('syntax') == 'Packages/CSS/CSS.tmLanguage'
