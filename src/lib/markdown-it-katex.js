// https://github.com/waylonflinn/markdown-it-katex
// Added support for ASCIIMath

import katex from "katex";
import asciimath from "asciimath-to-latex";

// Test if potential opening or closing delimiter
// Assumes that there is a "$" at state.src[pos]
function isValidLatexDelimiter(state, pos) {
    let prevChar, nextChar,
        max = state.posMax,
        can_open = true,
        can_close = true;

    prevChar = pos > 0 ? state.src.charCodeAt(pos - 1) : -1;
    nextChar = pos + 1 <= max ? state.src.charCodeAt(pos + 1) : -1;

    // Check non-whitespace conditions for opening and closing, and
    // check that closing delimeter isn't followed by a number
    if (prevChar === 0x20 /* " " */ || prevChar === 0x09 /* \t */ ||
        (nextChar >= 0x30 /* "0" */ && nextChar <= 0x39 /* "9" */)) {
        can_close = false;
    }
    if (nextChar === 0x20 /* " " */ || nextChar === 0x09 /* \t */) {
        can_open = false;
    }

    return { can_open, can_close };
}

function isValidASCIIMathDelimiter(state, pos) {
    let prevChar, nextChar,
        max = state.posMax,
        can_open = true,
        can_close = true;

    prevChar = pos > 0 ? state.src.charCodeAt(pos - 1) : -1;
    nextChar = pos + 1 <= max ? state.src.charCodeAt(pos + 1) : -1;

    // Check non-whitespace conditions for opening and closing, and
    // check that closing delimeter isn't followed by a number
    if (nextChar === 0x20 /* " " */ || nextChar === 0x09 /* \t */ ||
        (prevChar >= 0x30 /* "0" */ && prevChar <= 0x39 /* "9" */)) {
        can_close = false;
    }
    if (prevChar === 0x20 /* " " */ || prevChar === 0x09 /* \t */) {
        can_open = false;
    }

    return { can_open, can_close };
}

function asciiMathInline(state, silent) {
    let start, match, token, res, pos, esc_count;

    if (state.src[state.pos] !== "%") {
        return false;
    }

    res = isValidASCIIMathDelimiter(state, state.pos);
    if (!res.can_open) {
        if (!silent) {
            state.pending += "%";
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
    while ((match = state.src.indexOf("%", match)) !== -1) {
        // Found potential $, look for escapes, pos will point to
        // first non escape when complete
        pos = match - 1;
        while (state.src[pos] === "\\") {
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
            state.pending += "%";
        }
        state.pos = start;
        return true;
    }

    // Check if we have empty content, ie: $$.  Do not parse.
    if (match - start === 0) {
        if (!silent) {
            state.pending += "%%";
        }
        state.pos = start + 1;
        return true;
    }

    // Check for valid closing delimiter
    res = isValidASCIIMathDelimiter(state, match);
    if (!res.can_close) {
        if (!silent) {
            state.pending += "%";
        }
        state.pos = start;
        return true;
    }

    if (!silent) {
        token = state.push('asciimath_inline', 'math', 0);
        token.markup = "%";
        token.content = state.src.slice(start, match);
    }

    state.pos = match + 1;
    return true;
}

function latexInline(state, silent) {
    let start, match, token, res, pos, esc_count;

    if (state.src[state.pos] !== "$") {
        return false;
    }

    res = isValidLatexDelimiter(state, state.pos);
    if (!res.can_open) {
        if (!silent) {
            state.pending += "$";
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
    while ((match = state.src.indexOf("$", match)) !== -1) {
        // Found potential $, look for escapes, pos will point to
        // first non escape when complete
        pos = match - 1;
        while (state.src[pos] === "\\") {
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
            state.pending += "$";
        }
        state.pos = start;
        return true;
    }

    // Check if we have empty content, ie: $$.  Do not parse.
    if (match - start === 0) {
        if (!silent) {
            state.pending += "$$";
        }
        state.pos = start + 1;
        return true;
    }

    // Check for valid closing delimiter
    res = isValidLatexDelimiter(state, match);
    if (!res.can_close) {
        if (!silent) {
            state.pending += "$";
        }
        state.pos = start;
        return true;
    }

    if (!silent) {
        token = state.push('latex_inline', 'math', 0);
        token.markup = "$";
        token.content = state.src.slice(start, match);
    }

    state.pos = match + 1;
    return true;
}

function latexBlock(state, start, end, silent) {
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

export default function (md, options) {
    options = options || {};

    const asciiMathRenderer = (tokens, idx) => {
        const latex = asciimath(tokens[idx].content);

        try {
            return katex.renderToString(latex, { displayMode: false });
        } catch (error) {
            if (options.throwOnError) {
                console.log(error);
            }

            return tokens[idx].content;
        }
    };

    const katexInlineRenderer = (tokens, idx) => {
        const latex = tokens[idx].content;

        try {
            return katex.renderToString(latex, { displayMode: false });
        } catch (error) {
            if (options.throwOnError) {
                console.log(error);
            }

            return latex;
        }
    };

    const katexBlockRenderer = function (tokens, idx) {
        const latex = tokens[idx].content;

        try {
            return katex.renderToString(latex, { displayMode: true }) + "\n";
        } catch (error) {
            if (options.throwOnError) {
                console.log(error);
            }

            return latex + "\n";
        }
    };

    md.inline.ruler.after("escape", "asciimath_inline", asciiMathInline);
    md.inline.ruler.after("escape", "latex_inline", latexInline);
    md.block.ruler.after("blockquote", "latex_block", latexBlock, {
        alt: ["paragraph", "reference", "blockquote", "list"]
    });
    md.renderer.rules.asciimath_inline = asciiMathRenderer;
    md.renderer.rules.latex_inline = katexInlineRenderer;
    md.renderer.rules.latex_block = katexBlockRenderer;
};
