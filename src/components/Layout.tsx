import React from 'react';
import Article from '../types/Article';
import './Layout.scss';
import { Avatar, BackTop, Dropdown, Input, Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';

const { Header, Footer, Content } = Layout;

export default class Home extends React.Component {
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
                    <Dropdown
                        trigger={['click']}
                        overlay={(
                            <Menu>
                                <Menu.Item>
                                    Signed in as Ingress Id
                                </Menu.Item>
                                <Menu.Divider />
                                <Menu.Item>
                                    <Link to="/user/1" >个人主页</Link>
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
                        )}
                    >
                        <Avatar src="/assets/img/avatar-blue.jpg" />
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
