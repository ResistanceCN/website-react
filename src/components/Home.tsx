import './Home.scss';
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Layout, Pagination, Tag } from 'antd';
import { Article } from '../types';
import WithSidebar from './WithSidebar';

export default class Home extends React.Component {
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
                <div className="banner">
                    <div className="container">
                        <div className="banner-head">
                            Hello World!
                        </div>
                        <div className="banner-content">
                            <p className="welcome">Welecome to Resistance. It's time to move!</p>
                            <p>[测试文字] 使用 Ant Motion 能够快速在 React 框架中使用动画。</p>
                            <p>我们提供了单项，组合动画，以及整套解决方案</p>
                        </div>
                        <div className="banner-button">
                            <Link to="/join"><Button ghost>加入我们</Button></Link>
                            <Button ghost>查看教程</Button>
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
                                    <div>{article.tag.map((tag, i) => <Tag key={i}>{tag}</Tag>)}</div>
                                </Card>
                            );
                        })}
                    </WithSidebar>
                </div>

                <Layout.Content className="container pagination">
                    <Pagination defaultCurrent={1} total={50} showQuickJumper />
                </Layout.Content>
            </div>
        );
    }
}
