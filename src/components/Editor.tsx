import './Editor.scss';
import React from 'react';
import { Article, User } from '../types';
import { State } from '../reducers';
import { connect, Dispatch } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router';
import AceEditor from 'react-ace';
import 'brace/mode/markdown';
import 'brace/theme/tomorrow';
import throttle from 'lodash/throttle';
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

    scrollbar: HTMLElement;
    preview: HTMLElement;
    scrollTogether: EventListener;

    onChange = throttle(
        (content: string) => {
            this.setState({
                article: {
                    ...this.state.article,
                    content
                }
            });
        },
        240
    );

    componentWillMount() {
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
            status: ArticleStatus.OK,
            article
        });
    }

    componentDidMount() {
        this.scrollbar = document.querySelector('.ace_scrollbar-v') as HTMLElement;

        this.scrollTogether = event => {
            const rate = this.scrollbar.scrollTop / this.scrollbar.scrollHeight;
            this.preview.scrollTo({ top: this.preview.scrollHeight * rate });
        };

        this.scrollbar.addEventListener('scroll', this.scrollTogether);
    }

    componentWillUnmount() {
        this.scrollbar.removeEventListener('scroll', this.scrollTogether);
    }

    render() {
        if (this.state.status === ArticleStatus.NotFound) {
            return <Redirect to="/" />;
        }

        return (
            <div className="flex-spacer ">
                <div className="editor-title">
                    <input name="title" defaultValue={this.state.article.title} placeholder="Title here..." />
                    <div />
                </div>
                <div className="editor flex-spacer">
                    <AceEditor
                        name="md-editor"
                        className="md-content"
                        wrapEnabled
                        mode="markdown"
                        theme="tomorrow"
                        width="50%"
                        height="100%"
                        fontSize={14}
                        value={this.state.article.content}
                        editorProps={{$blockScrolling: true}}
                        onChange={this.onChange}
                    />
                    <div
                        className="md-preview markdown-body"
                        dangerouslySetInnerHTML={{
                            __html: renderMarkdown(this.state.article.content)
                        }}
                        ref={ref => this.preview = ref!}
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
