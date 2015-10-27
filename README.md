# grunt-gettext-gen

> Compiles source files with translatable strings annotated by [grunt-gettext](https://github.com/englishtown/grunt-gettext) into ready-to-use localised files

## Installation

```shell
npm install --save-dev grunt-gettext-gen
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-gettext-gen');
```


## Usage

_Add this task to you grunt configuration._
 
```
"gettext-compile": {
    "l10n": {
        "po": [ "l10n_po/*.po" ],
        "source": [
            {
                "dest": "compiled/{Language}",
                "options": {
                     "cwd": "source",
                 },
                "src": ["**/*.html"]
            }
        ]
    }
 }
 ```
 
_Run this task with the `grunt gettext-compile` command._

### Settings

| Key | Required | Description |
| --- | --- | --- |
| `po` | Yes | Path pattern to \*.po files (ex.: `[ "l10n_po/*.po" ]`) |
| `options` | No | Extra compilation options ([see full specification below](#options)) <br />You can use extra placeholders for `dest` to point to language or package version:<br />• `{Language}` - current language (`Language` value from po-file header section);<br />• `{ProjectIdVersion}` - package version (`Project-Id-Version` value from po-file header section); |
| `source` | Yes | Path to source files. Read [`expandMapping`](http://gruntjs.com/api/grunt.file#grunt.file.expandmapping) method configuration for details |


#### Options

| Key | Default Value | Description |
| --- | --- | --- |
| `xmlMode` | `false` | Switchig xmlMode for output, read [htmlparser2 Option:xmlMode](https://github.com/fb55/htmlparser2/wiki/Parser-options#option-xmlmode) for details |
| `startDelim` | `{{` | Start delimiter for attributes and inline translation |
| `endDelim` | `}}` | End delimiter for attributes and inline translation |
| `preserveScripts` | `false` | Flag, preserving inline script sections started with `startScript` and ending with `endScript` |
| `startScript` | `<%` | Start delimiter for script section |
| `endScript` | `%>` | End delimiter for script section |
| `langCode` | `undefined` | The `{Language}` variable in destination path is determined, first from Language header in PO file, then basename of the PO file, this option is to map the language code further, provide either a function or a map object of `<language>:<your_language>` |