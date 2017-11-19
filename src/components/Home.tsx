import React from 'react';
import './Home.scss';
import { Button, Card, Col, Layout, Pagination, Row, Tag } from 'antd';
import Article from '../types/Article';
import Sidebar from './Sidebar';

const { Header, Footer, Content } = Layout;

export default class Home extends React.Component {

    getArticles(page: number): Array<Article> {
        let articles: Array<Article> = [];

        for (let i = 0; i < 10; ++i) {
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
        return [
            <Content className="banner">
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
                        <Button ghost>加入我们</Button>
                        <Button ghost>查看教程</Button>
                    </div>
                </div>
            </Content>,

            <Content className="container main">
                <Row>
                    <Col span={16} className="news">
                        {this.getArticles(1).map(article => {
                            return (
                                <Card key={article.id} title={article.title} bordered={false} className="article">
                                    <div>{article.content}</div>
                                    <div>
                                        <Tag>{article.tag[0]}</Tag>
                                        <Tag>{article.tag[1]}</Tag>
                                    </div>
                                </Card>
                            );
                        })}
                    </Col>

                    <Sidebar />
                </Row>
            </Content>,

            <Content className="container pagination">
                <Pagination defaultCurrent={1} total={50} showQuickJumper />
            </Content>
        ];
    }
}
