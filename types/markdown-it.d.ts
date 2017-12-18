import MarkdownIt from 'markdown-it';

export = MarkdownItExtendedTypes;
export as namespace MarkdownItExtendedTypes;

declare module MarkdownItExtendedTypes {
    export interface Delimiter {
        can_open: boolean,
        can_close: boolean,
        length?: number
    }

    // https://github.com/markdown-it/markdown-it/blob/master/lib/rules_inline/state_inline.js
    export interface StateInline {
        src: string;
        env: string;
        md: MarkdownIt.MarkdownIt;
        tokens: Array<MarkdownIt.Token>;

        pos: number;
        posMax: number;
        level: number;
        pending: string;
        pendingLevel: number;

        cache: {};
        delimiters: Array<string>;

        pushPending(): MarkdownIt.Token;
        push(type: string, tag: string, nesting: number): MarkdownIt.Token;
        scanDelims(start: number, canSplitWord: boolean): Delimiter;
    }

    // https://github.com/markdown-it/markdown-it/blob/master/lib/rules_block/state_block.js
    export interface StateBlock {
        src: string;
        md: MarkdownIt.MarkdownIt;
        env: string;

        tokens: Array<MarkdownIt.Token>;

        bMarks: Array<number>;
        eMarks: Array<number>;
        tShift: Array<number>;
        sCount: Array<number>;

        bsCount: Array<number>;
        blkIndent: number;

        line: number;
        lineMax: number;
        tight: boolean;
        ddIndent: number;

        parentType: 'blockquote' | 'list' | 'root' | 'paragraph' | 'reference';
        level: number;
        result: string;

        push(type: string, tag: string, nesting: number): MarkdownIt.Token;
        isEmpty(line: number): boolean;
        skipEmptyLines(from: number): number;
        skipSpaces(pos: number): number;
        skipSpacesBack(pos: number, min: number): number;
        skipChars(pos: number, code: number): number;
        skipCharsBack(pos: number, code: number, min: number): number;
        getLines(begin: number, end: number, indent: number, keepLastLF: boolean): string;
    }

    export interface Rule extends MarkdownIt.Rule {
        (state: StateInline, silent: boolean): boolean;
        (state: StateBlock, startLine: number, endLine: number, silent: boolean): boolean;
    }

    export interface Ruler extends MarkdownIt.Ruler {
        after(afterName: string, ruleName: string, rule: Rule, options?: any): void;
        at(name: string, rule: Rule, options?: any): void;
        before(beforeName: string, ruleName: string, rule: Rule, options?: any): void;
        getRules(chain: string): Rule[];
        push(ruleName: string, rule: Rule, options?: any): void;
    }
}
