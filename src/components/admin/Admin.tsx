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
import PreviewArticle from './PreviewArticle';

const { Sider } = Layout;

interface AdminProps extends RouteComponentProps<{}> {
    user: User | null;
    immersive: boolean;
}

export class Admin extends React.PureComponent<AdminProps> {
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
            <Layout className={'flex-spacer ' + (this.props.immersive || 'panel-layout')}>
                <Sider style={{ display: this.props.immersive ? 'none' : 'block' }}>
                    <Menu
                        mode="inline"
                        selectedKeys={[current]}
                        style={{ height: '100%', width: '215px' }}
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

                <div className={'flex-spacer ' + (this.props.immersive || 'container-fluid panel-container')}>
                    <Switch>
                        <Route exact path="/admin" component={Overview} />
                        <Route path="/admin/allArticles" component={AllArticles} />
                        <Route path="/admin/pendingArticles" component={PendingArticles} />
                        <Route path="/admin/publishedArticles" component={PublishedArticles} />
                        <Route path="/admin/previewArticle/:id(\w+)" component={PreviewArticle} />
                    </Switch>
                </div>
            </Layout>
        );
    }
}

const mapStateToProps = (state: State) => ({
    user: state.auth.user,
    immersive: state.ui.immersive
});

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Admin));
