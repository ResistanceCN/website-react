import './Profile.scss';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Article } from '../types/Article';
import { Card, Pagination, Tag, Icon } from 'antd';
import { Link } from 'react-router-dom';
import WithSidebar from './WithSidebar';
import ArticleTools from './ArticleTools';

interface ProfileRouterProps {
    id: number;
}

interface ProfileProps extends RouteComponentProps<ProfileRouterProps> {}

export default class Profile extends React.Component<ProfileProps> {
    getArticles(page: number): Array<Article> {
        let articles: Array<Article> = [];

        for (let i = 1; i <= 10; ++i) {
            articles.push({
                id: i,
                title: '宇囚 - ' + i,
                author: 1,
                tag: ['科幻', '短片小说'],
                date: new Date(),
                content: '第一个开拓者在启航后85年返回，打通了连接太阳系与织女星系的虫洞，\
                由此掀开了人类文明殖民银河系的大幕。资源由各个星系源源不断的流入人类手中，\
                技术随着时间推移变得愈发出神入化，智慧的足迹踏遍银河系的颗行星，\
                冒险家的故事传颂在整个星河。'
            });
        }

        return articles;
    }

    render() {
        return (
            <div className="flex-spacer">
                <div className="banner profile-banner">
                    <div className="banner-avatar">
                        <img src="/assets/img/avatar-blue.jpg" />
                    </div>
                    <div className="banner-content">
                        <p className="username">Username - {this.props.match.params.id}</p>
                        <div className="bio">
                            <p>[个人 bio 测试] 使用 Ant Motion 能够快速在 React 框架中使用动画。</p>
                            <p>我们提供了单项，组合动画，以及整套解决方案</p>
                        </div>
                    </div>
                </div>

                <div className="container main">
                    <WithSidebar className="news">
                        {this.getArticles(1).map(article => {
                            return (
                                <Card
                                    key={article.id}
                                    title={<Link to={'/article/' + article.id}>{article.title}</Link>}
                                    bordered={false}
                                    className="article"
                                >
                                    <div>{article.content}</div>
                                    <div className="article-footer">
                                        <div>{article.tag.map((tag, i) => <Tag key={i}>{tag}</Tag>)}</div>
                                        <ArticleTools />
                                    </div>
                                </Card>
                            );
                        })}
                    </WithSidebar>
                </div>

                <div className="container pagination">
                    <Pagination defaultCurrent={1} total={50} showQuickJumper />
                </div>
            </div>
        );
    }
}
