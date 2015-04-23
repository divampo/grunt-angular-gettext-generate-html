'use strict';

var po = require('pofile');
var _ = require('lodash');
var cheerio = require('cheerio');

exports.init = function(grunt) {
    var exports = {};

    function Translator(po_inputs, options) {
        var me = this;
        me.options = _.extend({
            preserveScripts: false,
            startDelim: "{{",
            endDelim: "}}",
            startScript: "<%",
            endScript: "%>"
        }, options);

        // initializing locales
        me.locales = {};
        po_inputs.forEach(function(input) {
            var catalog = po.parse(input);

            if (!catalog.headers.Language) {
                throw new Error('No Language header found!');
            }

            me.locales[catalog.headers.Language] = catalog;
        });

        var escapeRegex = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;
        var start;
        var end;

        // initializing comment / inline translation regexp
        start = me.options.startDelim.replace(escapeRegex, '\\$&');
        end = me.options.endDelim.replace(escapeRegex, '\\$&');
        if (start === '' && end === '') {
            start = '^';
        }
        me.stringTokenRegex = new RegExp(start + '\\s*(\'|"|&quot;|&#39;)(.*?)\\1\\s*\\|\\s*translate\\s*' + end, 'g');

        // initializing script safety regexp
        me.scripts = {};
        start = me.options.startScript.replace(escapeRegex, '\\$&');
        end = me.options.endScript.replace(escapeRegex, '\\$&');
        me.scriptTokenRegex = new RegExp(start + '[\\s\\S]*?' + end, 'g');
    }

    Translator.prototype.iterateLocales = function (callback) {
        for (var lang in this.locales) {
            callback.call(this, this.locales[lang].headers);
        }
    };

    Translator.prototype.parse = function (input, lang) {
        var me = this;

        var translated_text = me.options.preserveScripts === true ? me.preserveScriptsOn(input.text) : input.text;
        var $ = cheerio.load(translated_text, _.extend({}, me.options, {
            decodeEntities: false,
            withStartIndices: true
        }));

        $('*').each(function (index, n) {
            var node = $(n);
            var attr = node.attr();
            var str = node.html().trim();

            var hasAttr = function(a) {
                return attr.hasOwnProperty(a) || attr.hasOwnProperty("data-" + a);
            };
            var removeAttr = function (a) {
                return node
                    .removeAttr(a)
                    .removeAttr("data-" + a);
            };

            var string;

            // translating `translate` tag
            if (node.is('translate')) {
                string = me.findString(str, lang);
                node.replaceWith(string === null ? str : string.msgstr[0]);
            }

            // translating `translate` attribute
            if (hasAttr('translate') && !hasAttr('translate-plural')) {
                removeAttr('translate');
                removeAttr('translate-comment');
                removeAttr('translate-context');

                string = me.findString(str, lang);
                node.text(string === null ? str : string.msgstr[0]);
            }
        });

        translated_text = $.html();

        if (me.options.preserveScripts === true) {
            translated_text = me.preserveScriptsOff(translated_text);
        }

        // replacing inline translations
        var matches;
        var string;
        var html = "";
        var prevPos = 0;
        while ((matches = me.stringTokenRegex.exec(translated_text)) !== null) {
            var str = matches[2].replace(/\\\'/g, '\'');
            string = me.findString(str, lang);

            html += translated_text.substr(prevPos, this.stringTokenRegex.lastIndex - matches[0].length - prevPos)
                + (string === null ? str : string.msgstr[0]);

            prevPos = me.stringTokenRegex.lastIndex;
        }

        // append rest part of html
        html += translated_text.substr(prevPos);

        return html;
    };

    Translator.prototype.preserveScriptsOn = function (input) {
        var me = this;
        var matches;
        var out = "";
        var prevPos = 0;
        while ((matches = me.scriptTokenRegex.exec(input)) !== null) {
            var str = matches[0].replace(/\\\'/g, '\'');
            var label = "script_safety_" + me.scriptTokenRegex.lastIndex;
            out += input.substr(prevPos, me.scriptTokenRegex.lastIndex - matches[0].length - prevPos) + label;

            me.scripts[label] = str;
            prevPos = me.scriptTokenRegex.lastIndex;
        }
        out += input.substr(prevPos);

        return out;
    };

    Translator.prototype.preserveScriptsOff = function (input) {
        var plh;
        for (plh in this.scripts) {
            input = input.replace(plh, this.scripts[plh]);
        }
        return input;
    };

    Translator.prototype.findString = function (str, lang) {
        var string = null;
        this.locales[lang].items.forEach(function(item) {
            if (str == item.msgid) {
                string = item;
                return;
            }
        });
        return string !== null && string.msgstr[0] != '' ? string : null;
    };

    exports.Translator = Translator;

    return exports;
};
