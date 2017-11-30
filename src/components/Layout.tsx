import './Layout.scss';
import React from 'react';
import { User } from '../types';
import { State } from '../reducers';
import { LOGIN_SUCCESS } from '../actions';
import { connect, Dispatch } from 'react-redux';
import { RouteProps, withRouter } from 'react-router';
import { BackTop, Input, Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import UserMenu from './UserMenu';

const { Header, Footer } = Layout;

interface AppLayoutProps {
    login(user: User): void;
}

class AppLayout extends React.Component<AppLayoutProps & RouteProps> {
    componentDidMount() {
        const authToken = localStorage.authToken;

        if (authToken) {
            // Perform AJAX request here
            const user = null;

            if (user !== null) {
                this.props.login(user);
            }
        }
    }

    componentDidUpdate(prevProps: Readonly<AppLayoutProps & RouteProps>) {
        if (this.props.location !== prevProps.location) {
            window.scrollTo(0, 0);
        }
    }

    render() {
        return (
            <Layout className="layout main-layout">
                <div className="header-placeholder"/>
                <Header className="main-header">
                    <Link to="/" className="brand">
                        <img src="/assets/img/logo.svg"/>
                        <div className="name">CantonRES</div>
                    </Link>

                    <Input className="search" placeholder="搜索……"/>

                    <div className="flex-spacer"/>

                    <Menu mode="horizontal" defaultSelectedKeys={['1']} className="main-menu">
                        <Menu.Item key="1">Home</Menu.Item>
                        <Menu.Item key="2">News</Menu.Item>
                        <Menu.Item key="3">Tutorials</Menu.Item>
                        <Menu.Item key="5">About</Menu.Item>
                    </Menu>

                    <UserMenu/>
                </Header>

                {this.props.children}

                <Footer className="main-footer">
                    &copy; 2017 Canton Resistance. Based on React &amp; Ant Design
                </Footer>

                <BackTop/>
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
