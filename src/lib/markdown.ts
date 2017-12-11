import MarkdownIt from 'markdown-it';
import sanitizeHTML from 'sanitize-html';
import markdownItKatex from './markdownItKatex';

const renderer = new MarkdownIt({
    html: true,
    linkify: true
});

renderer.use(markdownItKatex);
renderer.use(require('markdown-it-task-lists'));

export default (markdown: string) => sanitizeHTML(renderer.render(markdown), {
    allowedTags: [
        ...sanitizeHTML.defaults.allowedTags,
        'h2', 'img', 'div', 'span', 'input', 'svg', 'path'
    ],
    // allowedTags: false,
    allowedAttributes: false,
    exclusiveFilter(frame) {
        return frame.tag === 'input' && frame.attribs.type !== 'checkbox';
    },
    transformTags: {
        'a': sanitizeHTML.simpleTransform('a', { target: '_blank' }),
    }
});
