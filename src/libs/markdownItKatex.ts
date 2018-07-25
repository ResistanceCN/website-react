// https://github.com/waylonflinn/markdown-it-katex
// Added support for ASCIIMath

import katex from 'katex';
import MarkdownIt from 'markdown-it';
import T = MarkdownItExtendedTypes;

const asciimath = require('asciimath-to-latex');

// Chrome limits the minimum font size, causing small texts in \frac{} overflow
const isChrome = navigator.appVersion.indexOf('Chrome/') !== -1;
if (self.document && isChrome) {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode('.katex { font-size: 22px; }'));
    document.head.appendChild(style);
}

// Test if potential opening or closing delimiter
// Assumes that there is a '$' at state.src[pos]
function isValidLatexDelimiter(state: T.StateInline, pos: number): T.Delimiter {
    const max = state.posMax;

    const prevChar = pos > 0 ? state.src.charCodeAt(pos - 1) : -1;
    const nextChar = pos + 1 <= max ? state.src.charCodeAt(pos + 1) : -1;

    let canOpen = true;
    let canClose = true;

    // Check that closing delimiter isn't following to a backslash
    if (prevChar === 0x5C /* '\\' */) {
        canClose = false;
    }

    // Check that opening delimiter isn't followed by a number and following to a whitespace
    if ((prevChar === 0x20 /* ' ' */ || prevChar === 0x09 /* \t */) &&
        (nextChar >= 0x30 /* '0' */ && nextChar <= 0x39 /* '9' */)) {
        canOpen = false;
    }

    return {
        can_open: canOpen,
        can_close: canClose
    };
}

function isValidASCIIMathDelimiter(state: T.StateInline, pos: number): T.Delimiter {
    const max = state.posMax;

    const prevChar = pos > 0 ? state.src.charCodeAt(pos - 1) : -1;
    const nextChar = pos + 1 <= max ? state.src.charCodeAt(pos + 1) : -1;

    let canOpen = true;
    let canClose = true;

    if (prevChar >= 0x30 /* '0' */ && prevChar <= 0x39 /* '9' */) {
        canOpen = canClose = false;
    }

    return {
        can_open: canOpen,
        can_close: canClose
    };
}

function asciiMathInlineRule(state: T.StateInline, silent: boolean) {
    let start, match, token, res, pos, escCount;

    if (state.src[state.pos] !== '%') {
        return false;
    }

    res = isValidASCIIMathDelimiter(state, state.pos);
    if (!res.can_open) {
        if (!silent) {
            state.pending += '%';
        }
        state.pos += 1;
        return true;
    }

    // First check for and bypass all properly escaped delimiters
    // This loop will assume that the first leading backtick can not
    // be the first character in state.src, which is known since
    // we have found an opening delimiter already.
    start = state.pos + 1;
    match = start;
    while ((match = state.src.indexOf('%', match)) !== -1) {
        // Found potential $, look for escapes, pos will point to
        // first non escape when complete
        pos = match - 1;
        while (state.src[pos] === '\\') {
            pos -= 1;
        }

        // Even number of escapes, potential closing delimiter found
        if (((match - pos) % 2) === 1) {
            break;
        }
        match += 1;
    }

    // No closing delimter found.  Consume $ and continue.
    if (match === -1) {
        if (!silent) {
            state.pending += '%';
        }
        state.pos = start;
        return true;
    }

    // Check if we have empty content, ie: $$.  Do not parse.
    if (match - start === 0) {
        if (!silent) {
            state.pending += '%%';
        }
        state.pos = start + 1;
        return true;
    }

    // Check for valid closing delimiter
    res = isValidASCIIMathDelimiter(state, match);
    if (!res.can_close) {
        if (!silent) {
            state.pending += '%';
        }
        state.pos = start;
        return true;
    }

    if (!silent) {
        token = state.push('asciimath_inline', 'math', 0);
        token.markup = '%';
        token.content = state.src.slice(start, match);
    }

    state.pos = match + 1;
    return true;
}

function latexInlineRule(state: T.StateInline, silent: boolean) {
    let start, match, token, res, pos, escCount;

    if (state.src[state.pos] !== '$') {
        return false;
    }

    res = isValidLatexDelimiter(state, state.pos);
    if (!res.can_open) {
        if (!silent) {
            state.pending += '$';
        }
        state.pos += 1;
        return true;
    }

    // First check for and bypass all properly escaped delimiters
    // This loop will assume that the first leading backtick can not
    // be the first character in state.src, which is known since
    // we have found an opening delimiter already.
    start = state.pos + 1;
    match = start;
    while ((match = state.src.indexOf('$', match)) !== -1) {
        // Found potential $, look for escapes, pos will point to
        // first non escape when complete
        pos = match - 1;
        while (state.src[pos] === '\\') {
            pos -= 1;
        }

        // Even number of escapes, potential closing delimiter found
        if (((match - pos) % 2) === 1) {
            break;
        }
        match += 1;
    }

    // No closing delimter found.  Consume $ and continue.
    if (match === -1) {
        if (!silent) {
            state.pending += '$';
        }
        state.pos = start;
        return true;
    }

    // Check if we have empty content, ie: $$.  Do not parse.
    if (match - start === 0) {
        if (!silent) {
            state.pending += '$$';
        }
        state.pos = start + 1;
        return true;
    }

    // Check for valid closing delimiter
    res = isValidLatexDelimiter(state, match);
    if (!res.can_close) {
        if (!silent) {
            state.pending += '$';
        }
        state.pos = start;
        return true;
    }

    if (!silent) {
        token = state.push('latex_inline', 'math', 0);
        token.markup = '$';
        token.content = state.src.slice(start, match);
    }

    state.pos = match + 1;
    return true;
}

function latexBlockRule(state: T.StateBlock, start: number, end: number, silent: boolean) {
    let firstLine, lastLine, next, lastPos, found = false, token,
        pos = state.bMarks[start] + state.tShift[start],
        max = state.eMarks[start];

    if (pos + 2 > max) {
        return false;
    }
    if (state.src.slice(pos, pos + 2) !== '$$') {
        return false;
    }

    pos += 2;
    firstLine = state.src.slice(pos, max);

    if (silent) {
        return true;
    }
    if (firstLine.trim().slice(-2) === '$$') {
        // Single line expression
        firstLine = firstLine.trim().slice(0, -2);
        found = true;
    }

    for (next = start; !found;) {
        next++;

        if (next >= end) {
            break;
        }

        pos = state.bMarks[next] + state.tShift[next];
        max = state.eMarks[next];

        if (pos < max && state.tShift[next] < state.blkIndent) {
            // non-empty line with negative indent should stop the list:
            break;
        }

        if (state.src.slice(pos, max).trim().slice(-2) === '$$') {
            lastPos = state.src.slice(0, max).lastIndexOf('$$');
            lastLine = state.src.slice(pos, lastPos);
            found = true;
        }
    }

    state.line = next + 1;

    token = state.push('latex_block', 'math', 0);
    token.block = true;
    token.content = (firstLine && firstLine.trim() ? firstLine + '\n' : '')
        + state.getLines(start + 1, next, state.tShift[start], true)
        + (lastLine && lastLine.trim() ? lastLine : '');
    token.map = [start, state.line];
    token.markup = '$$';

    return true;
}

function asciiMathRenderer(tokens: Array<MarkdownIt.Token>, index: number) {
    const latex = asciimath(tokens[index].content);
    const options = {
        displayMode: false,
        throwOnError: false
    };

    try {
        return katex.renderToString(latex, options);
    } catch (error) {
        return `<p>${tokens[index].content}<br /><span class="math-error">${error.message}</span></p>`;
    }
}

function katexInlineRenderer(tokens: Array<MarkdownIt.Token>, index: number) {
    const latex = tokens[index].content;
    const options = {
        displayMode: false,
        throwOnError: false
    };

    try {
        return katex.renderToString(latex, options);
    } catch (error) {
        return `<p>${latex}</p><span class="math-error">${error.message}</span></p>`;
    }
}

function katexBlockRenderer(tokens: Array<MarkdownIt.Token>, index: number) {
    const latex = tokens[index].content;
    const options = {
        displayMode: true,
        throwOnError: false
    };

    try {
        return katex.renderToString(latex, options) + '\n';
    } catch (error) {
        return `<p>${latex}<br /><span class="math-error">${error.message}</span></p>`;
    }
}

export default function (md: MarkdownIt.MarkdownIt) {
    (md.inline.ruler as T.Ruler).after('escape', 'asciimath_inline', asciiMathInlineRule as T.Rule);
    (md.inline.ruler as T.Ruler).after('escape', 'latex_inline', latexInlineRule as T.Rule);
    (md.block.ruler as T.Ruler).after('blockquote', 'latex_block', latexBlockRule as T.Rule, {
        alt: ['paragraph', 'reference', 'blockquote', 'list']
    });
    md.renderer.rules.asciimath_inline = asciiMathRenderer;
    md.renderer.rules.latex_inline = katexInlineRenderer;
    md.renderer.rules.latex_block = katexBlockRenderer;
}
