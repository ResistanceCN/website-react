import React from 'react';
import { Article, nullArticle, User } from '@/types';
import { State } from '@/reducers';
import { connect, Dispatch } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router';
import { message } from 'antd';
import gql from 'graphql-tag';
import Editor from './parts/Editor';
import { client as apollo } from '@/apollo';
import { errorText, later } from '@/libs/utils';
import { DISABLE_IMMERSIVE, ENABLE_IMMERSIVE } from '@/actions';

enum NewArticleStatus {
    Loading,
    OK,
    LoginRequired
}

interface NewArticleProps extends RouteComponentProps<{}> {
    user: User | null;
    setImmersive(enabled: boolean): void;
}

interface NewArticleState {
    article: Article;
    status: NewArticleStatus;
}

class NewArticle extends React.Component<NewArticleProps, NewArticleState> {
    state = {
        article: nullArticle,
        status: NewArticleStatus.Loading
    };

    onSubmit = async (title: string, content: string) => {
        try {
            const result = await apollo.mutate<{ article: Article }>({
                mutation: gql`
                    mutation ($title: String!, $content: String!) {
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
            message.error(errorText(error));
        }
    };

    componentDidMount() {
        const user = this.props.user;

        if (user === null) {
            this.setState({
                status: NewArticleStatus.LoginRequired
            });
            return;
        }

        this.setState({
            status: NewArticleStatus.OK
        });

        this.props.setImmersive(true);
    }

    componentWillUnmount() {
        this.props.setImmersive(false);
    }

    render() {
        if (this.state.status === NewArticleStatus.LoginRequired) {
            return <Redirect to="/login" />;
        } else if (this.state.status === NewArticleStatus.Loading) {
            return null;
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
)(NewArticle);
