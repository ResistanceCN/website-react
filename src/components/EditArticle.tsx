import './parts/Editor.scss';
import React from 'react';
import { Article, nullArticle, User } from '../types';
import { State } from '../reducers';
import { DISABLE_IMMERSIVE, ENABLE_IMMERSIVE } from '../actions';
import { connect, Dispatch } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router';
import { message } from 'antd';
import gql from 'graphql-tag';
import Editor from './parts/Editor';
import { client as apollo } from '../apollo';
import { errorText, later } from '../libs/utils';
import Loading from './parts/Loading';

enum EditArticleStatus {
    Loading,
    OK,
    NotFound
}

interface EditArticleRouterProps {
    id: string;
}

interface EditArticleProps extends RouteComponentProps<EditArticleRouterProps> {
    user: User | null;
    setImmersive(enabled: boolean): void;
}

interface EditArticleState {
    article: Article;
    status: EditArticleStatus;
}

class EditArticle extends React.Component<EditArticleProps, EditArticleState> {
    state = {
        article: nullArticle,
        status: EditArticleStatus.Loading
    };

    getArticle(user: User) {
        const id = this.props.match.params.id;

        apollo.query<{ article: Article }>({
            query: gql`
                query($id: ID!) {
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
                    status: EditArticleStatus.NotFound
                });
            }

            this.setState({
                status: EditArticleStatus.OK,
                article: {
                    ...response.data.article,
                    // The API returns time in string
                    publishedAt: new Date(response.data.article.publishedAt)
                }
            });
        }).catch(e => {
            this.setState({
                status: EditArticleStatus.NotFound
            });
            // throw e;
        });
    }

    onSubmit = async (title: string, content: string) => {
        try {
            const result = await apollo.mutate<{ article: Article }>({
                mutation: gql`
                    mutation ($id: ID!, $title: String, $content: String) {
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
            message.error(errorText(error));
        }
    };

    componentDidMount() {
        const user = this.props.user;

        if (user === null) {
            this.setState({
                status: EditArticleStatus.NotFound
            });
            return;
        }

        this.getArticle(user);

        this.props.setImmersive(true);
    }

    componentWillUnmount() {
        this.props.setImmersive(false);
    }

    render() {
        if (this.state.status === EditArticleStatus.NotFound) {
            return <Redirect to="/" />;
        } else if (this.state.status === EditArticleStatus.Loading) {
            return <Loading size="large" />;
        }

        return (
            <Editor
                className="full-height"
                article={this.state.article}
                onSubmit={this.onSubmit}
                onCancel={this.props.history.goBack}
            />
        );
    }
}

const mapStateToProps = (state: State) => ({
    user: state.auth.user
});

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
    setImmersive(enabled: boolean) {
        dispatch({
            type: enabled ? ENABLE_IMMERSIVE : DISABLE_IMMERSIVE
        });
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditArticle);
