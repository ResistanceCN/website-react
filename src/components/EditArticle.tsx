import './Editor.scss';
import React from 'react';
import { Article, User } from '../types';
import { State } from '../reducers';
import { connect, Dispatch } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router';
import { message } from 'antd';
import gql from 'graphql-tag';
import Editor from './Editor';
import apollo from '../apollo';
import { later } from '../libs/utils';

enum ArticleStatus {
    Loading,
    OK,
    NotFound
}

interface EditArticleRouterProps {
    id: string;
}

interface EditArticleProps extends RouteComponentProps<EditArticleRouterProps> {
    user: User | null;
}

interface EditArticleState {
    article: Article;
    status: ArticleStatus;
}

class EditArticle extends React.Component<EditArticleProps, EditArticleState> {
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

    getArticle(user: User) {
        const id = this.props.match.params.id;

        apollo.query<{ article: Article }>({
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

    async onSubmit(title: string, content: string): Promise<void> {
        try {
            const result = await apollo.mutate<{ article: Article }>({
                mutation: gql`
                    mutation ($id: ID, $title: String, $content: String) {
                        article: updateArticle(id: $id, title: $title, content: $content) {
                            id
                        }
                    }
                `,
                variables: {
                    id: this.state.article.id,
                    title,
                    content
                }
            });

            message.success('提交成功');

            // Update cache
            apollo.cache.writeData({
                data: {
                    article: {
                        __typename: 'Article',
                        id: result.data!.article.id,
                        title,
                        content
                    }
                }
            });

            await later(3000);
            this.props.history.push('/article/' + this.state.article.id);
        } catch (error) {
            message.error(error.toString().replace('Error: GraphQL error: ', ''));
        }
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

    render() {
        if (this.state.status === ArticleStatus.NotFound) {
            return <Redirect to="/" />;
        } else if (this.state.status === ArticleStatus.Loading) {
            return <div />;
        }

        return (
            <Editor
                article={this.state.article}
                onSubmit={(title, content) => this.onSubmit(title, content)}
            />
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
)(EditArticle);
