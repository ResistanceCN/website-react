import MarkdownIt from 'markdown-it';
import sanitizeHTML, { IFrame } from 'sanitize-html';
import highlightJS from 'highlight.js';
import markdownItKatex from './markdownItKatex';

const renderer = new MarkdownIt({
    html: true,
    linkify: true,
    highlight(str: string, lang: string) {
        if (lang && highlightJS.getLanguage(lang)) {
            try {
                return highlightJS.highlight(lang, str).value;
            } catch {
                //
            }
        }

        return ''; // use external default escaping
    }
});

renderer.use(markdownItKatex);
renderer.use(require('markdown-it-task-lists'));

export default (markdown: string) => sanitizeHTML(renderer.render(markdown), {
    allowedTags: [
        ...sanitizeHTML.defaults.allowedTags,
        'h2', 'img', 'div', 'span', 'input', 'svg', 'path', 'line'
    ],
    // allowedTags: false,
    allowedAttributes: false,
    exclusiveFilter(frame: IFrame) {
        return frame.tag === 'input' && frame.attribs.type !== 'checkbox';
    },
    transformTags: {
        'a': sanitizeHTML.simpleTransform('a', { target: '_blank' })
    }
});
