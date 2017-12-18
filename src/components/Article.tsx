import './Article.scss';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Card, Tag } from 'antd';
import { Article as ArticleType } from '../types';
import WithSidebar from './WithSidebar';
import renderMarkdown from '../libs/markdown';
import exampleArticle from '../libs/exampleArticle';

enum Status {
    Loading,
    OK,
    NotFound
}

interface ArticleRouterProps {
    id: string;
}

interface ArticleProps extends RouteComponentProps<ArticleRouterProps> {}

interface ArticleState {
    status: Status;
    article: ArticleType;
}

export default class Article extends React.Component<ArticleProps, ArticleState> {
    state = {
        status: Status.Loading,
        article: {
            id: 0,
            title: '',
            author: 0,
            tag: [],
            date: new Date(),
            content: ''
        }
    };

    componentDidMount() {
        const id = parseInt(this.props.match.params.id, 10);

        if (isNaN(id)) {
            this.setState({
                status: Status.NotFound
            });
            return;
        }

        const article: ArticleType = {
            id,
            title: '宇囚 - ' + id,
            author: 1,
            tag: ['科幻', '短片小说'],
            date: new Date(),
            content: exampleArticle
        };

        this.setState({
            article,
            status: Status.OK
        });
    }

    render() {
        if (this.state.status === Status.Loading) {
            return (
                <div className="flex-spacer">
                    <div className="container loading-container">
                        <div className="loading">Loading...</div>
                    </div>
                </div>
            );
        }

        const article = this.state.article;

        return (
            <div className="flex-spacer">
                <div className="banner article-banner">
                    <div className="container">
                        <div className="banner-head">
                            {article.title}
                        </div>
                        <p>{article.date.toLocaleDateString() + ' ' + article.date.toLocaleTimeString()}</p>
                    </div>
                </div>

                <div className="container main">
                    <WithSidebar className="news">
                        <Card key={article.id} bordered={false} className="article">
                            <div
                                className="markdown-body"
                                dangerouslySetInnerHTML={{
                                    __html: renderMarkdown(article.content)
                                }}
                            />
                            <div>{article.tag.map((tag, i) => <Tag key={i}>{tag}</Tag>)}</div>
                        </Card>
                    </WithSidebar>
                </div>
            </div>
        );
    }
}
