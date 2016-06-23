import sublime
import sublime_plugin
import json
from os.path import dirname, realpath, join, splitext, basename

try:
	# Python 2
	from node_bridge import node_bridge
except:
	from .node_bridge import node_bridge

# monkeypatch `Region` to be iterable
sublime.Region.totuple = lambda self: (self.a, self.b)
sublime.Region.__iter__ = lambda self: self.totuple().__iter__()

BIN_PATH = join(sublime.packages_path(), dirname(realpath(__file__)), 'autoprefixer.js')

def get_setting(view, key):
	settings = view.settings().get('Autoprefixer')
	if settings is None:
		settings = sublime.load_settings('Autoprefixer.sublime-settings')
	return settings.get(key)

def is_style_syntax(view):
	return splitext(basename(view.settings().get('syntax')))[0] in ['CSS', 'Sass', 'SCSS']


class AutoprefixerCommand(sublime_plugin.TextCommand):
	def run(self, edit):
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
			isCSS = splitext(basename(self.view.settings().get('syntax')))[0] == 'CSS'
			return node_bridge(data, BIN_PATH, [json.dumps({
				'browsers': get_setting(self.view, 'browsers'),
				'cascade': get_setting(self.view, 'cascade'),
				'is_css': isCSS
			})])
		except Exception as e:
			sublime.error_message('Autoprefixer\n%s' % e)

	def has_selection(self):
		for sel in self.view.sel():
			start, end = sel
			if start != end:
				return True
		return False


class AutoprefixerPreSaveCommand(sublime_plugin.EventListener):
	def on_pre_save(self, view):
		if get_setting(view, 'prefixOnSave') is True and is_style_syntax(view):
				view.run_command('autoprefixer')
