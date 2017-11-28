import React from 'react';
import { connect, Dispatch } from 'react-redux';
import { RouteProps, withRouter } from 'react-router';
import './Layout.scss';
import { BackTop, Input, Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { State } from '../reducers';
import { checkUser } from '../actions/user';
import UserMenu from './UserMenu';

const { Header, Footer, Content } = Layout;

interface AppLayoutProps {
    checkUser(): void;
}

class AppLayout extends React.Component<AppLayoutProps & RouteProps> {
    componentDidMount() {
        this.props.checkUser();
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
    checkUser() {
        dispatch(checkUser());
    }
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(AppLayout));
