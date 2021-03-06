import './Article.scss';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Card, Tag } from 'antd';
import { Article as ArticleType, ArticleStatus, nullArticle } from '@/types';
import Loading from './parts/Loading';
import WithSidebar from './parts/WithSidebar';
import renderMarkdown from '@/libs/markdown';
import gql from 'graphql-tag';
import { client as apollo } from '@/apollo';

enum Status {
    Loading,
    OK,
    NotFound,
    Failed
}

interface ArticleRouterProps {
    id: string;
}

interface ArticleProps extends RouteComponentProps<ArticleRouterProps> {}

interface ArticleState {
    status: Status;
    article?: ArticleType;
}

export default class Article extends React.Component<ArticleProps, ArticleState> {
    state = {
        status: Status.Loading,
        article: nullArticle
    };

    getArticle() {
        const id = this.props.match.params.id;

        apollo.query<{ article: ArticleType }>({
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
            this.setState({
                status: Status.OK,
                article: {
                    ...response.data.article,
                    // The API returns time in string
                    publishedAt: new Date(response.data.article.publishedAt)
                }
            });
        }).catch(e => {
            this.setState({
                status: Status.Failed
            });
            throw e;
        });
    }

    componentDidMount() {
        this.getArticle();
    }

    componentDidUpdate(prevProps: ArticleProps, prevState: ArticleState) {
        if (this.props.match.params.id !== prevProps.match.params.id) {
            this.getArticle();
        }
    }

    render() {
        if (this.state.status === Status.Loading) {
            return <Loading />;
        }

        const article = this.state.article;

        return (
            <div className="flex-spacer">
                <div className="banner article-banner">
                    <div className="container">
                        <div className="banner-head">
                            {article.title}
                        </div>
                        <p>
                            {article.status === ArticleStatus.DRAFT ? '草稿' : [
                                article.publishedAt.toLocaleDateString(),
                                article.publishedAt.toLocaleTimeString()
                            ].join(' ')}
                        </p>
                    </div>
                </div>

                <div className="container main">
                    <WithSidebar>
                        <Card key={article.id} bordered={false} className="article">
                            <div
                                className="markdown-body"
                                dangerouslySetInnerHTML={{
                                    __html: renderMarkdown(article.content)
                                }}
                            />

                            {article.tags.length > 0 && (
                                <div className="article-footer">
                                    {article.tags.map((tag, i) => <Tag key={i}>{tag}</Tag>)}
                                </div>
                            )}

                            <a
                                className="copyleft"
                                href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh"
                                target="_blank"
                            >
                                <img className="cc-icon" src="/assets/img/cc/cc.svg" alt="CC" />
                                <img className="cc-icon" src="/assets/img/cc/by.svg" alt="BY" />
                                <img className="cc-icon" src="/assets/img/cc/nc.svg" alt="NC" />
                                <img className="cc-icon" src="/assets/img/cc/sa.svg" alt="SA" />
                            </a>
                        </Card>
                    </WithSidebar>
                </div>
            </div>
        );
    }
}
