// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const jsbeautify = require("js-beautify");
function format(document, range, defaultOptions) {
	const settings = vscode.workspace.getConfiguration('formatStyle');

	if (!settings.get("enable", true)) {
		return;
	}

	// Set range if the range isn't set.
	if (range === null) {
		range = initDocumentRange(document);
	}
	const result = [];
	const content = document.getText(range);
	if (!defaultOptions) {
		defaultOptions = {
			indent_size: 4,
			indent_char: ' ',
			eol: 'auto',
			indent_level: 0,
			indent_with_tabs: false,
			preserve_newlines: true,
			max_preserve_newlines: 32786,
			space_in_paren: false,
			space_in_empty_paren: false,
			jslint_happy: false,
			space_after_anon_function: false,
			space_after_named_function: false,
			brace_style: "brace_style",
			unindent_chained_methods: false,
			break_chained_methods: false,
			keep_array_indentation: false,
			unescape_strings: false,
			wrap_line_length: 0,
			wrap_attributes: ["auto", "force", "force-aligned", "force-expand-multiline", "aligned-multiple", "preserve", "preserve-aligned"],
			e4x: false,
			end_with_newline: false,
			comma_first: false,
			operator_position: ["before-newline", "after-newline", "preserve-newline"],
			indent_empty_lines: false,
			templating: ["auto"],
			selector_separator_newline: true,
			newline_between_rules: true,
			space_around_combinator: true,
		};
	}
	const beautifyOptions = {
		...defaultOptions,
		indent_size: settings.get("indent_size", defaultOptions.indent_size),
		indent_char:settings.get("indent_char", defaultOptions.indent_char),
		eol: settings.get("eol", defaultOptions.eol),
		indent_level: settings.get("indent_level", defaultOptions.indent_level),
		indent_with_tabs: settings.get("indent_with_tabs", defaultOptions.indent_with_tabs),
		preserve_newlines:settings.get("preserve_newlines", defaultOptions.preserve_newlines),
		max_preserve_newlines:settings.get("max_preserve_newlines", defaultOptions.max_preserve_newlines),
		space_in_paren:settings.get("space_in_paren", defaultOptions.space_in_paren),
		space_in_empty_paren: settings.get("space_in_empty_paren", defaultOptions.space_in_empty_paren),
		jslint_happy: settings.get("jslint_happy", defaultOptions.jslint_happy),
		space_after_anon_function:settings.get("space_after_anon_function", defaultOptions.space_after_anon_function),
		space_after_named_function: settings.get("space_after_named_function", defaultOptions.space_after_named_function),
		brace_style: settings.get("brace_style", defaultOptions.brace_style),
		unindent_chained_methods: settings.get("unindent_chained_methods", defaultOptions.unindent_chained_methods),
		break_chained_methods:settings.get("break_chained_methods", defaultOptions.break_chained_methods),
		keep_array_indentation: settings.get("keep_array_indentation", defaultOptions.keep_array_indentation),
		unescape_strings: settings.get("unescape_strings", defaultOptions.unescape_strings),
		wrap_line_length: settings.get("wrap_line_length", defaultOptions.wrap_line_length),
		wrap_attributes: settings.get("wrap_attributes", defaultOptions.wrap_attributes),
		e4x: settings.get("e4x", defaultOptions.e4x),
		end_with_newline: settings.get("end_with_newline", defaultOptions.end_with_newline),
		comma_first: settings.get("comma_first", defaultOptions.comma_first),
		operator_position: settings.get("operator_position", defaultOptions.operator_position),
		indent_empty_lines: settings.get("indent_empty_lines", defaultOptions.indent_empty_lines),
		templating: settings.get("templating", defaultOptions.templating),
		selector_separator_newline: settings.get("selector_separator_newline", defaultOptions.selector_separator_newline),
		newline_between_rules: settings.get("newline_between_rules", defaultOptions.newline_between_rules),
		space_around_combinator: settings.get("space_around_combinator", defaultOptions.space_around_combinator),
	};

	let formatted = jsbeautify.css_beautify(content, beautifyOptions);

	if (formatted) {
		result.push(new vscode.TextEdit(range, formatted));
	}

	return result;
}

exports.format = format;

/**
 * Creates a new range from begin to end of the document
 *
 * @param {vscode.TextDocument} document
 * @returns {vscode.Range}
 */
function initDocumentRange(document) {
	const lastLine = document.lineCount - 1;
	const start = new vscode.Position(0, 0);
	const end = new vscode.Position(lastLine, document.lineAt(lastLine).text.length);
	return new vscode.Range(start, end);
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	const provideDocumentFormattingEdits = {
		provideDocumentFormattingEdits: (document, options) => format(document, null, options)
	};
	const provideDocumentRangeFormattingEdits = {
		provideDocumentRangeFormattingEdits: (document, ranges, options) => format(document, ranges, options)
	};
	context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider('css', provideDocumentFormattingEdits));
	context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider('less', provideDocumentFormattingEdits));
	context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider('scss', provideDocumentFormattingEdits));
	context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider('sass', provideDocumentFormattingEdits));
	context.subscriptions.push(vscode.languages.registerDocumentRangeFormattingEditProvider('css', provideDocumentRangeFormattingEdits));
	context.subscriptions.push(vscode.languages.registerDocumentRangeFormattingEditProvider('less', provideDocumentRangeFormattingEdits));
	context.subscriptions.push(vscode.languages.registerDocumentRangeFormattingEditProvider('scss', provideDocumentRangeFormattingEdits));
	context.subscriptions.push(vscode.languages.registerDocumentRangeFormattingEditProvider('sass', provideDocumentRangeFormattingEdits));

}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
