import './Admin.css';
import React from 'react';
import { User } from '@/types';
import { State } from '@/reducers';
import { connect, Dispatch } from 'react-redux';
import { Layout, Menu } from 'antd';
import { Redirect, Route, RouteComponentProps, withRouter } from 'react-router';
import { Link, Switch } from 'react-router-dom';
import Overview from './Overview';
import AllArticles from './articles/AllArticles';
import PendingArticles from './articles/PendingArticles';
import PublishedArticles from './articles/PublishedArticles';
import PreviewArticle from './articles/PreviewArticle';
import PendingJoinInfo from './join/PendingJoinInfo';
import ApprovedJoinInfo from './join/ApprovedJoinInfo';
import RejectedJoinInfo from './join/RejectedJoinInfo';

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

        let current = location.pathname
            .substr(7)
            .split('/')
            .filter(s => s.trim())
            .join('/');

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
                            <Menu.Item key="articles/all">
                                <Link to="/admin/articles/all">所有文章</Link>
                            </Menu.Item>
                            <Menu.Item key="articles/pending">
                                <Link to="/admin/articles/pending">待审文章</Link>
                            </Menu.Item>
                            <Menu.Item key="articles/published">
                                <Link to="/admin/articles/published">已发布文章</Link>
                            </Menu.Item>
                        </Menu.ItemGroup>
                        <Menu.ItemGroup key="join" title="加入申请">
                            <Menu.Item key="join/pending">
                                <Link to="/admin/join/pending">待审申请</Link>
                            </Menu.Item>
                            <Menu.Item key="join/approved">
                                <Link to="/admin/join/approved">已同意申请</Link>
                            </Menu.Item>
                            <Menu.Item key="join/rejected">
                                <Link to="/admin/join/rejected">已拒绝申请</Link>
                            </Menu.Item>
                        </Menu.ItemGroup>
                    </Menu>
                </Sider>

                <div className={'flex-spacer ' + (this.props.immersive || 'container-fluid panel-container')}>
                    <Switch>
                        <Route exact path="/admin" component={Overview} />

                        <Route path="/admin/articles/all" component={AllArticles} />
                        <Route path="/admin/articles/pending" component={PendingArticles} />
                        <Route path="/admin/articles/published" component={PublishedArticles} />
                        <Route path="/admin/articles/preview/:id(\w+)" component={PreviewArticle} />

                        <Route path="/admin/join/pending" component={PendingJoinInfo} />
                        <Route path="/admin/join/approved" component={ApprovedJoinInfo} />
                        <Route path="/admin/join/rejected" component={RejectedJoinInfo} />
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
