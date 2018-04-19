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
    LoginRequired
}

interface NewArticleProps extends RouteComponentProps<{}> {
    user: User | null;
}

interface NewArticleState {
    article: Article;
    status: ArticleStatus;
}

class NewArticle extends React.Component<NewArticleProps, NewArticleState> {
    state = {
        article: {
            id: '',
            title: '',
            author: {} as User,
            tags: [],
            publishedAt: new Date(),
            content: ''
        },
        status: ArticleStatus.Loading
    };

    async onSubmit(title: string, content: string): Promise<void> {
        try {
            const result = await apollo.mutate<{ article: Article }>({
                mutation: gql`
                    mutation ($title: String, $content: String) {
                        article: createArticle(title: $title, content: $content) {
                            id
                            title
                            author { id }
                            tags
                            content
                            publishedAt
                        }
                    }
                `,
                variables: {
                    title,
                    content
                }
            });

            message.success('提交成功');

            await later(3000);
            this.props.history.push('/article/' + result.data!.article.id);
        } catch (error) {
            message.error(error.toString().replace('Error: GraphQL error: ', ''));
        }
    }

    componentWillMount() {
        const user = this.props.user;

        if (user === null) {
            this.setState({
                status: ArticleStatus.LoginRequired
            });
            return;
        }

        this.setState({
            status: ArticleStatus.OK
        });
    }

    render() {
        if (this.state.status === ArticleStatus.LoginRequired) {
            return <Redirect to="/login" />;
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
)(NewArticle);
