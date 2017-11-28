import React from 'react';
import { RouteComponentProps } from 'react-router';
import './Article.scss';
import { Card, Tag } from 'antd';
import { Article as ArticleType } from '../types';
import WithSidebar from './WithSidebar';

enum Status {
    Loading,
    OK,
    NotFound
}

interface ArticleRouterProps {
    id: number;
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
        const id = this.props.match.params.id;

        const article: ArticleType = {
            id,
            title: '宇囚 - ' + id,
            author: 1,
            tag: ['科幻', '短片小说'],
            date: new Date(),
            content: '第一个开拓者在启航后85年返回，打通了连接太阳系与织女星系的虫洞，\
                由此掀开了人类文明殖民银河系的大幕。资源由各个星系源源不断的流入人类手中，\
                技术随着时间推移变得愈发出神入化，智慧的足迹踏遍银河系的颗行星，\
                冒险家的故事传颂在整个星河。'
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
                            <div>{article.content}</div>
                            <div>{article.tag.map((tag, i) => <Tag key={i}>{tag}</Tag>)}</div>
                        </Card>
                    </WithSidebar>
                </div>
            </div>
        );
    }
}
