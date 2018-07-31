import '@/components/parts/Editor.scss';
import React from 'react';
import { Article, ArticleStatus, nullArticle } from '@/types';
import { State } from '@/reducers';
import { DISABLE_IMMERSIVE, ENABLE_IMMERSIVE } from '@/actions';
import { connect, Dispatch } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router';
import { message } from 'antd';
import gql from 'graphql-tag';
import Editor from '@/components/parts/Editor';
import { adminClient, client as apollo } from '@/apollo';
import { errorText, later } from '@/libs/utils';
import Loading from '@/components/parts/Loading';

enum PreviewArticleStatus {
    Loading,
    OK,
    NotFound
}

interface PreviewArticleRouterProps {
    id: string;
}

interface PreviewArticleProps extends RouteComponentProps<PreviewArticleRouterProps> {
    setImmersive(enabled: boolean): void;
}

interface PreviewArticleState {
    article: Article;
    status: PreviewArticleStatus;
}

class PreviewArticle extends React.Component<PreviewArticleProps, PreviewArticleState> {
    state = {
        article: nullArticle,
        status: PreviewArticleStatus.Loading
    };

    getArticle() {
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
                        status
                        publishedAt
                    }
                }
            `,
            variables: { id }
        }).then(response => {
            const article = response.data.article;

            this.setState({
                status: PreviewArticleStatus.OK,
                article: {
                    ...article,
                    // The API returns time in string
                    publishedAt: new Date(article.publishedAt)
                }
            });
        }).catch(e => {
            this.setState({
                status: PreviewArticleStatus.NotFound
            });
            // throw e;
        });
    }

    onSubmit = async (title: string, content: string) => {
        try {
            const result = await adminClient.mutate({
                mutation: gql`
                    mutation($id: ID!, $status: ArticleStatus) {
                        article: updateArticle(id: $id, status: $status) {
                            id
                        }
                    }
                `,
                variables: {
                    id: this.state.article.id,
                    status: ArticleStatus.PUBLISHED
                }
            });

            message.success('发布成功');

            // Update cache
            apollo.cache.writeData({
                data: {
                    article: {
                        __typename: 'Article',
                        id: result.data!.article.id,
                        status: ArticleStatus.PUBLISHED
                    }
                }
            });

            await later(3000);
            this.props.history.goBack();
        } catch (error) {
            message.error(errorText(error));
        }
    };

    componentDidMount() {
        this.getArticle();

        this.props.setImmersive(true);
    }

    componentWillUnmount() {
        this.props.setImmersive(false);
    }

    render() {
        if (this.state.status === PreviewArticleStatus.NotFound) {
            return <Redirect to="/" />;
        } else if (this.state.status === PreviewArticleStatus.Loading) {
            return <Loading size="large" />;
        }

        const published = this.state.article.status === ArticleStatus.PUBLISHED;

        return (
            <Editor
                readonly
                className="full-height"
                article={this.state.article}
                submitButtonDisabled={published}
                submitText={(published ? '已' : '') + '发布'}
                cancelText="返回"
                onSubmit={this.onSubmit}
                onCancel={this.props.history.goBack}
            />
        );
    }
}

const mapStateToProps = (state: State) => ({});

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
)(PreviewArticle);
