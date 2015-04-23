
module.exports = function (grunt) {
    var Translator = require('./lib/translate').init(grunt).Translator;

    grunt.registerMultiTask('gt_generate_html', 'Generate translated files from given path using .po files', function () {
        var options = this.options();

        // Scanning a file structure
        var output = {};
        this.data.source.forEach(function (input) {
            var files = grunt.file.expandMapping(input.src, input.dest, input.options || {});

            files.forEach(function(file) {
                output[file.dest] = {
                    dest: file.dest,
                    path: file.src,
                    text: grunt.file.read(file.src)
                };
            });
        });

        // Scanning .po files
        var l10n = [];
        this.data.po.forEach(function (input) {
            var files = grunt.file.expand(input.options || {}, input.src || input);

            files.forEach(function(file) {
                l10n.push(grunt.file.read(file));
            });
        });

        var translator = new Translator(l10n, options);

        translator.iterateLocales(function(locale) {
            // Loop through the file structure
            for (var dest in output) {
                grunt.file.write(dest.replace("{Language}", locale.Language).replace('{ProjectIdVersion}', locale['Project-Id-Version']), translator.parse(output[dest], locale.Language));
            }
        });
    });
};
