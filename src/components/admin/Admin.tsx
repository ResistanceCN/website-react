import './Admin.css';
import React from 'react';
import { User } from '../../types';
import { State } from '../../reducers';
import { connect, Dispatch } from 'react-redux';
import { Layout, Menu } from 'antd';
import { Redirect, Route, RouteComponentProps, withRouter } from 'react-router';
import { Link, Switch } from 'react-router-dom';
import Overview from './Overview';
import AllArticles from './AllArticles';
import PendingArticles from './PendingArticles';
import PublishedArticles from './PublishedArticles';

const { Sider } = Layout;

interface AdminProps extends RouteComponentProps<{}> {
    user: User | null;
}

export class Admin extends React.Component<AdminProps> {
    render() {
        const user = this.props.user;
        if (user === null || !user.isAdmin) {
            return <Redirect to="/" />;
        }

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
                        <Route path="/admin/allArticles" component={AllArticles} />
                        <Route path="/admin/pendingArticles" component={PendingArticles} />
                        <Route path="/admin/publishedArticles" component={PublishedArticles} />
                    </Switch>
                </div>
            </Layout>
        );
    }
}

const mapStateToProps = (state: State) => ({
    user: state.auth.user
});

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Admin));
