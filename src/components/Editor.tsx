import './Editor.scss';
import React from 'react';
import { Article, User } from '../types';
import { State } from '../reducers';
import { connect, Dispatch } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router';
import SimpleMDE from 'simplemde';
import renderMarkdown from '../lib/markdown';
import exampleArticle from '../lib/exampleArticle';

interface CodeBlock {
    name: string;
    startToken: string;
    endToken: string;
}

const blocks: Array<CodeBlock> = [
    {
        name: 'code',
        startToken: '```',
        endToken: '```'
    },
    {
        name: 'comment',
        startToken: '<!--',
        endToken: '-->'
    }
];

enum ToolbarStatus {
    Static,
    Fixed
}

enum ArticleStatus {
    Loading,
    OK,
    NotFound
}

interface EditorRouterProps {
    id: string;
}

interface EditorProps extends RouteComponentProps<EditorRouterProps> {
    user: User | null;
}

interface EditorState {
    article: Article;
    status: ArticleStatus;
}

class Editor extends React.Component<EditorProps, EditorState> {
    state = {
        article: {
            id: 0,
            title: '',
            author: 0,
            tag: [],
            date: new Date(),
            content: ''
        },
        status: ArticleStatus.Loading
    };

    textarea?: HTMLTextAreaElement;
    editor?: SimpleMDE;
    toolbarStatus: ToolbarStatus = ToolbarStatus.Static;
    refreshHandler: number;

    onScroll: EventListener;
    onResize: EventListener;

    getArticle() {
        const id = parseInt(this.props.match.params.id, 10);
        const user = this.props.user;

        if (isNaN(id) || user === null) {
            this.setState({
                status: ArticleStatus.NotFound
            });
            return;
        }

        const article: Article = {
            id,
            title: '宇囚 - ' + id,
            author: 2,
            tag: ['科幻', '短片小说'],
            date: new Date(),
            content: exampleArticle
        };

        if (article.author !== user.id) {
            this.setState({
                status: ArticleStatus.NotFound
            });
            return;
        }

        this.setState({
            article
        });
    }

    onChange(content: string) {
        // if (content === this.state.article.content) {
        //     return;
        // }

        // this.setState({
        //     article: {
        //         ...this.state.article,
        //         content
        //     }
        // });
    }

    updateToolbarPos() {
        const rect = document.querySelector('.editor')!.getBoundingClientRect();
        const toolbar = document.querySelector('.editor-toolbar') as HTMLElement;

        if (rect.top <= 64) {
            if (this.toolbarStatus === ToolbarStatus.Fixed) { return; }

            toolbar.className = 'editor-toolbar fixed';
            toolbar.style.cssText = `width: ${rect.width / 2}px; left: ${rect.left}px;`;

            this.toolbarStatus = ToolbarStatus.Fixed;
        } else {
            if (this.toolbarStatus === ToolbarStatus.Static) { return; }

            toolbar.className = 'editor-toolbar';
            toolbar.style.cssText = 'width: 100%; left: 0;';

            this.toolbarStatus = ToolbarStatus.Static;
        }
    }

    findBlocksAndAddClass(codeMirror: CodeMirror.EditorFromTextArea) {
        blocks.forEach(block => {
            const className = 'block-' + block.name;

            // Indicate if the line is a part of a block in the iteration
            let inBlock = false;

            codeMirror.getDoc().eachLine(line => {
                // Determine if a start token is found (may be the same with end token)
                let blockStart = line.text.startsWith(block.startToken);

                if (!inBlock && !blockStart) {
                    codeMirror.removeLineClass(line, 'text', className);
                    return;
                }

                codeMirror.removeLineClass(line, 'text');
                codeMirror.addLineClass(line, 'text', className);

                let searchPosition = 0;

                if (!inBlock) {
                    // If inBlock is false, the line must be the start line of a block
                    // Therefore, we should search for the end token with an offset because two token might be identical
                    // If inBlock is true, the line is not the start line, then we can search in whole line
                    searchPosition = block.startToken.length;
                    codeMirror.addLineClass(line, 'text', 'block-start');
                }

                if (line.text.indexOf(block.endToken, searchPosition) === -1) {
                    inBlock = true;
                } else {
                    // If the line is the end line of a block, inBlock will be set to false
                    inBlock = false;
                    codeMirror.addLineClass(line, 'text', 'block-end');
                }
            });
        });
    }

    componentWillMount() {
        this.getArticle();
    }

    componentDidMount () {
        if (typeof this.textarea === 'undefined') {
            return;
        }

        this.editor = new SimpleMDE({
            element: this.textarea,
            autoDownloadFontAwesome: false,
            indentWithTabs: false,
            tabSize: 4,
            promptURLs: true,
            styleSelectedText: false,
            toolbar: [
                {
                    name: 'bold',
                    action: SimpleMDE.toggleBold,
                    className: 'icomoon icomoon-bold',
                    title: 'Bold'
                },
                {
                    name: 'italic',
                    action: SimpleMDE.toggleItalic,
                    className: 'icomoon icomoon-italic',
                    title: 'Italic'
                },
                {
                    name: 'strikethrough',
                    action: SimpleMDE.toggleStrikethrough,
                    className: 'icomoon icomoon-strikethrough',
                    title: 'Strikethrough'
                },
                '|',
                {
                    name: 'heading',
                    action: SimpleMDE.toggleHeadingSmaller,
                    className: 'icomoon icomoon-section',
                    title: 'Heading'
                },
                {
                    name: 'horizontal-rule',
                    action: SimpleMDE.drawHorizontalRule,
                    className: 'icomoon icomoon-pagebreak',
                    title: 'Insert Horizontal Line'
                },
                '|',
                {
                    name: 'code',
                    action: SimpleMDE.toggleCodeBlock,
                    className: 'icomoon icomoon-embed2',
                    title: 'Code'
                },
                {
                    name: 'quote',
                    action: SimpleMDE.toggleBlockquote,
                    className: 'icomoon icomoon-quotes-left',
                    title: 'Quote'
                },
                {
                    name: 'unordered-list',
                    action: SimpleMDE.toggleUnorderedList,
                    className: 'icomoon icomoon-list2',
                    title: 'Generic List'
                },
                {
                    name: 'ordered-list',
                    action: SimpleMDE.toggleOrderedList,
                    className: 'icomoon icomoon-list-numbered',
                    title: 'Numbered List'
                },
                '|',
                {
                    name: 'link',
                    action: SimpleMDE.drawLink,
                    className: 'icomoon icomoon-link',
                    title: 'Create Link'
                },
                {
                    name: 'image',
                    action: SimpleMDE.drawImage,
                    className: 'icomoon icomoon-image',
                    title: 'Insert Image'
                },
                {
                    name: 'table',
                    action: SimpleMDE.drawTable,
                    className: 'icomoon icomoon-table2',
                    title: 'Insert Table'
                },
                '|',
                {
                    name: 'undo',
                    action: SimpleMDE.undo,
                    className: 'icomoon icomoon-undo no-disable',
                    title: 'Undo'
                },
                {
                    name: 'redo',
                    action: SimpleMDE.redo,
                    className: 'icomoon icomoon-redo no-disable',
                    title: 'Redo'
                }
            ]
        });

        this.editor.codemirror.on('change', (instance: CodeMirror.EditorFromTextArea) => {
            this.findBlocksAndAddClass(instance);
            this.onChange(instance.getValue());
        });
        this.findBlocksAndAddClass(this.editor.codemirror);

        this.updateToolbarPos();

        this.onScroll = () => {
            this.updateToolbarPos();
        };
        this.onResize = () => {
            this.updateToolbarPos();
        };

        window.addEventListener('scroll', this.onScroll);
        window.addEventListener('resize', this.onResize);

        this.refreshHandler = window.setInterval(() => {
            const content = this.editor!.value();

            if (content !== this.state.article.content) {
                this.setState({
                    article: {
                        ...this.state.article,
                        content
                    }
                })
            }
        }, 2000)
    }

    componentWillUnmount() {
        if (typeof this.editor === 'undefined') {
            return;
        }

        window.clearInterval(this.refreshHandler);

        // This will destroy the SimpleMDE instance
        this.editor.toTextArea();

        window.removeEventListener('scroll', this.onScroll);
        window.removeEventListener('resize', this.onResize);
    }

    render() {
        if (this.state.status === ArticleStatus.NotFound) {
            return <Redirect to="/" />;
        }

        return (
            <div className="flex-spacer editor-wrapper">
                <div className="editor-title">
                    <input name="title" defaultValue={this.state.article.title} placeholder="Title here..." />
                    <div />
                </div>
                <div className="editor flex-spacer">
                    <div className="md-content">
                        <textarea
                            name="content"
                            autoComplete="off"
                            defaultValue={this.state.article.content}
                            ref={ref => this.textarea = ref!}
                        />
                    </div>
                    <div
                        className="md-preview markdown-body"
                        dangerouslySetInnerHTML={{
                            __html: renderMarkdown(this.state.article.content)
                        }}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: State) => ({
    user: state.auth.user
});

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Editor);
