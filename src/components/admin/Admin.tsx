import './Admin.scss';
import React from 'react';
import { Layout, Menu } from 'antd';
import { Route } from 'react-router';
import { Link, Switch } from 'react-router-dom';
import Overview from './Overview';
import ExampleTable from './ExampleTable';
import AllArticles from './AllArticles';

const { Sider } = Layout;
const { SubMenu } = Menu;

export default class Admin extends React.Component {
    render() {
        let current = location.pathname.substr(7).split('/')[0];

        if (current === '') {
            current = 'overview';
        }

        return (
            <Layout className="flex-spacer panel-layout">
                <Sider>
                    <Menu
                        mode="inline"
                        selectedKeys={[current]}
                        style={{ height: '100%' }}
                    >
                        <Menu.Item key="overview"><Link to="/admin">Overview</Link></Menu.Item>
                        <Menu.Item key="table"><Link to="/admin/table">Example Table</Link></Menu.Item>
                        <Menu.ItemGroup key="articles" title="文章管理">
                            <Menu.Item key="allArticles">
                                <Link to="/admin/allArticles">所有文章</Link>
                            </Menu.Item>
                            <Menu.Item key="pendingArticles">
                                <Link to="/admin/pendingArticles">待审文章</Link>
                            </Menu.Item>
                            <Menu.Item key="publishedArticles">
                                <Link to="/admin/publishedArticles">已发布文章</Link>
                            </Menu.Item>
                        </Menu.ItemGroup>
                    </Menu>
                </Sider>
                <div className="flex-spacer container-fluid panel-container">
                    <Switch>
                        <Route exact path="/admin" component={Overview} />
                        <Route path="/admin/table" component={ExampleTable} />
                        <Route path="/admin/allArticles" component={AllArticles} />
                    </Switch>
                </div>
            </Layout>
        );
    }
}
