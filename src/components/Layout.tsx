import './Layout.scss';
import React from 'react';
import { User } from '../types';
import { State } from '../reducers';
import { LOGIN_SUCCESS } from '../actions';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { BackTop, Input, Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import Loading from './Loading';
import UserMenu from './UserMenu';
import { client as apollo } from '../apollo';
import gql from 'graphql-tag';

const { Header, Footer } = Layout;

interface AppLayoutProps extends RouteComponentProps<{}> {
    user: User;
    immersive: boolean;
    login(user: User): void;
}

interface AppLayoutState {
    ready: boolean;
}

class AppLayout extends React.Component<AppLayoutProps, AppLayoutState> {
    state = {
        ready: false
    };

    getCurrentMenuItem() {
        const path = this.props.location.pathname;

        if (path == '/')
            return ['index'];
        else if (path.startsWith('/admin'))
            return ['admin'];
        else
            return [];
    }

    async componentWillMount() {
        if (localStorage.authToken) {
            try {
                const result = await apollo.query<{ me: User }>({
                    query: gql`
                        query {
                            me { id name faction emailHash isAdmin }
                        }
                    `
                });

                const user = result.data.me;
                this.props.login(user);
            } catch (error) {
                // localStorage.authToken = '';
            }
        }

        this.setState({
            ready: true
        });
    }

    componentDidUpdate(prevProps: Readonly<AppLayoutProps>) {
        if (this.props.location !== prevProps.location) {
            window.scrollTo(0, 0);
        }
    }

    render() {
        if (!this.state.ready) {
            return <Loading className="main-layout" size="large" />;
        }

        return (
            <Layout className="layout main-layout">
                {this.props.immersive || (
                    <React.Fragment>
                        <div className="header-placeholder" />
                        <Header className="main-header">
                            <Link to="/" className="brand">
                                <img src="/assets/img/logo.svg" />
                                <div className="name">Resistance</div>
                            </Link>

                            <Input className="search" placeholder="搜索……" />

                            <div className="flex-spacer" />

                            <Menu mode="horizontal" selectedKeys={this.getCurrentMenuItem()} className="main-menu">
                                <Menu.Item key="index"><Link to="/">首页</Link></Menu.Item>
                                <Menu.Item key="tutorials">教程</Menu.Item>
                                <Menu.Item key="about">关于</Menu.Item>
                                {this.props.user.isAdmin && (
                                    <Menu.Item key="admin"><Link to="/admin">管理</Link></Menu.Item>
                                )}
                            </Menu>

                            <UserMenu />
                        </Header>
                    </React.Fragment>
                )}

                {this.props.children}

                {this.props.immersive || (
                    <React.Fragment>
                        <Footer className="main-footer">
                            &copy; 2017 Greater Canton Resistance. Powered by React &amp; GraphQL
                        </Footer>

                        <BackTop />
                    </React.Fragment>
                )}
            </Layout>
        );
    }
}

const mapStateToProps = (state: State) => ({
    user: state.auth.user,
    immersive: state.ui.immersive
});

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
    login(user: User) {
        dispatch({
            type: LOGIN_SUCCESS,
            user
        });
    }
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(AppLayout));
