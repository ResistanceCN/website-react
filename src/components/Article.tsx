import React from 'react';
import { RouteComponentProps } from 'react-router';
import './Article.scss';
import { Card, Col, Layout, Row, Tag } from 'antd';
import Sidebar from './Sidebar';
import ArticleType from '../types/Article';

interface ArticleRouterProps { id: number; }
interface ArticleProps extends RouteComponentProps<ArticleRouterProps> {}

interface State {
    article?: ArticleType;
}

export default class Article extends React.Component<ArticleProps> {
    state: State = {};

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
        this.setState({ article });
    }

    render() {
        return (
            <div>
                <Layout.Content className="banner article-banner">
                    <div className="container">
                        <div className="banner-head">
                            {this.state.article ? this.state.article.title : ''}
                        </div>
                    </div>
                </Layout.Content>

                <Layout.Content className="container main">
                    <Row>
                        <Col span={16} className="news">
                            {typeof this.state.article === 'undefined' ? ('404') : (
                                <Card
                                    key={this.state.article.id}
                                    bordered={false}
                                    className="article"
                                >
                                    <div>{this.state.article.content}</div>
                                    <div>
                                        <Tag>{this.state.article.tag[0]}</Tag>
                                        <Tag>{this.state.article.tag[1]}</Tag>
                                    </div>
                                </Card>
                            )}
                        </Col>

                        <Sidebar />
                    </Row>
                </Layout.Content>
            </div>
        );
    }
}
