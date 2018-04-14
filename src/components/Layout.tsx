import './Layout.scss';
import React from 'react';
import { User } from '../types';
import { State } from '../reducers';
import { LOGIN_SUCCESS } from '../actions';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { BackTop, Input, Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import UserMenu from './UserMenu';
import apollo from '../apollo';
import gql from 'graphql-tag';

const { Header, Footer } = Layout;

interface AppLayoutProps extends RouteComponentProps<{}> {
    login(user: User): void;
}

interface AppLayoutState {
    ready: boolean;
}

class AppLayout extends React.Component<AppLayoutProps, AppLayoutState> {
    state = {
        ready: false
    };

    async componentWillMount() {
        if (localStorage.authToken) {
            try {
                const result = await apollo.query<{ me: User }>({
                    query: gql`
                        query {
                            me { id name faction }
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
            ...this.state,
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
            // @TODO: Loading animation
            return <div />;
        }

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

                    <UserMenu />
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

const mapStateToProps = (state: State) => ({});

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
