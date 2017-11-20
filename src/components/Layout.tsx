import React from 'react';
import './Layout.scss';
import { Avatar, BackTop, Dropdown, Input, Layout, Menu } from 'antd';
import Article from '../types/Article';
import { Link } from 'react-router-dom';

const { Header, Footer, Content } = Layout;

const detials = (
  <Menu>
    <Menu.Item>
        Signed in as Ingress Id
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="#">个人主页</a>
    </Menu.Item>
    <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="#">控制台</a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="#">设置</a>
    </Menu.Item>
    <Menu.Item>注销</Menu.Item>
  </Menu>
);

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

    getTimeline(): Array<string> {
        return [
            'Create a services site 2015-09-01',
            'Solve initial network problems 2015-09-01',
            'Technical testing 2015-09-01',
            'Network problems being solved 2015-09-01'
        ];
    }

    render() {
        return (
            <Layout className="layout main-layout">
                <div className="header-placeholder" />
                <Header className="main-header">
                    <Link to="/" className="brand">
                        <img src="/assets/img/logo.svg" />
                        <div className="name">CantonRES</div>
                    </Link>

                    <Input className="search" placeholder="搜索……" />

                    <div className="flex-spacer" />

                    <Menu mode="horizontal" defaultSelectedKeys={['1']} className="main-menu">
                        <Menu.Item key="1">Home</Menu.Item>
                        <Menu.Item key="2">News</Menu.Item>
                        <Menu.Item key="3">Tutorials</Menu.Item>
                        <Menu.Item key="5">About</Menu.Item>
                    </Menu>
                    <Dropdown overlay={detials} trigger={['click']}>
                        <Avatar icon="user" />
                    </Dropdown>
                </Header>

                {this.props.children}

                <Footer className="main-footer">
                    &copy; 2017 Canton Resistance. Based on React &amp; Ant Design
                </Footer>

                <BackTop />
            </Layout>
        );
    }
}
