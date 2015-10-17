# HTML Generator for [grunt-angular-gettext](https://github.com/rubenv/grunt-angular-gettext) task

> Compiles translatable strings annotated with [grunt-angular-gettext](https://github.com/rubenv/grunt-angular-gettext) notation from given path pattern and writes to the given destination preserving folder structure.


## Getting Started

This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install --save-dev grunt-angular-gettext-generate-html
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-angular-gettext-generate-html');
```


## Run task

_Run this task with the `grunt gt_generate_html` command._


## Usage

_Add this task to you grunt configuration._
 
```
"gt_generate_html": {
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


## Dependencies

 - cheerio: ~0.18.0
 - lodash: ~2.4.1
 - pofile: ~0.2.8


## DEVELOPMENT DEPENDENCIES
 
 - grunt: ~0.4.1


## License

```
The MIT License (MIT)

Copyright (c) 2015 Dmitry Serpakov

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
