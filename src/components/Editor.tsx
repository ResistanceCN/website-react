import './Editor.scss';
import React, { ChangeEvent } from 'react';
import { Article as ArticleType, Article, User } from '../types';
import { State } from '../reducers';
import { connect, Dispatch } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router';
import { Button, message } from 'antd';
import AceEditor from 'react-ace';
import 'brace/mode/markdown';
import 'brace/theme/tomorrow';
import throttle from 'lodash/throttle';
import renderMarkdown from '../libs/markdown';
import gql from 'graphql-tag';
import apollo from '../apollo';

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
    NotFound,
    Updating
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
            id: '0',
            title: '',
            author: {} as User,
            tags: [],
            publishedAt: new Date(),
            content: ''
        },
        status: ArticleStatus.Loading
    };

    scrollbar: HTMLElement | null = null;
    preview: HTMLElement;
    scrollTogether: EventListener;

    onContentChange = throttle(
        (content: string) => {
            this.setState({
                ...this.state,
                article: {
                    ...this.state.article,
                    content
                }
            });
        },
        240
    );

    onTitleChange(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            ...this.state,
            article: {
                ...this.state.article,
                title: e.target.value
            }
        });
    }

    getArticle(user: User) {
        const id = this.props.match.params.id;

        apollo.query<{ article: ArticleType }>({
            query: gql`
                query($id: ID) {
                    article: articleById(id: $id) {
                        id
                        title
                        author { id }
                        tags
                        content
                        publishedAt
                    }
                }
            `,
            variables: { id }
        }).then(response => {
            const article = response.data.article;

            if (article.author.id !== user.id) {
                return this.setState({
                    status: ArticleStatus.NotFound
                });
            }

            this.setState({
                ...this.state,
                status: ArticleStatus.OK,
                article: {
                    ...response.data.article,
                    // The API returns time in string
                    publishedAt: new Date(response.data.article.publishedAt)
                }
            });
        }).catch(e => {
            this.setState({
                ...this.state,
                status: ArticleStatus.NotFound
            });
            // throw e;
        });
    }

    onSubmit() {
        this.setState({
            ...this.state,
            status: ArticleStatus.Updating
        });

        apollo.mutate<{ article: Article }>({
            mutation: gql`
                mutation ($id: ID, $title: String, $content: String) {
                    article: updateArticle(id: $id, title: $title, content: $content) {
                        updatedAt
                    }
                }
            `,
            variables: {
                id: this.state.article.id,
                title: this.state.article.title,
                content: this.state.article.content
            }
        }).then(result => {
            message.success('提交成功');
            // redirect
        }).catch(error => {
            message.error(error.toString().replace('Error: GraphQL error: ', ''));
        }).then(() => {
            this.setState({
                ...this.state,
                status: ArticleStatus.OK
            })
        });
    }

    componentWillMount() {
        const user = this.props.user;

        if (user === null) {
            this.setState({
                status: ArticleStatus.NotFound
            });
            return;
        }

        this.getArticle(user);
    }

    componentDidMount() {
        const scrollbar = document.querySelector('.ace_scrollbar-v');

        if (scrollbar !== null) {
            this.scrollbar = scrollbar as HTMLElement;

            this.scrollTogether = event => {
                const rate = this.scrollbar!.scrollTop / this.scrollbar!.scrollHeight;
                this.preview.scrollTo({ top: this.preview.scrollHeight * rate });
            };

            this.scrollbar.addEventListener('scroll', this.scrollTogether);
        }
    }

    componentWillUnmount() {
        if (this.scrollbar !== null) {
            this.scrollbar.removeEventListener('scroll', this.scrollTogether);
        }
    }

    render() {
        if (this.state.status === ArticleStatus.NotFound) {
            return <Redirect to="/" />;
        }

        return (
            <div className="flex-spacer">
                <div className="editor-title">
                    <input
                        value={this.state.article.title}
                        placeholder="Title here..."
                        name="title"
                        onChange={e => this.onTitleChange(e)}
                    />
                    <Button
                        type="primary"
                        className="editor-submit"
                        onClick={e => this.onSubmit()}
                        loading={this.state.status === ArticleStatus.Updating}
                    >
                        提交
                    </Button>
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
                        onChange={this.onContentChange}
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
