import * as React from 'react';
import './Home.scss';
import { Layout, Menu } from 'antd';
const { Header, Footer, Content } = Layout;

class App extends React.Component {
    render() {
        return (
            <Layout className="layout main-layout">
                <Header className="main-header">
                    <div className="logo">
                        <img src="/assets/img/logo.svg" />
                    </div>
                    <div className="flex-spacer" />
                    <Menu mode="horizontal" defaultSelectedKeys={['1']} className="main-menu">
                        <Menu.Item key="1">Home</Menu.Item>
                        <Menu.Item key="2">News</Menu.Item>
                        <Menu.Item key="3">Tutorials</Menu.Item>
                        <Menu.Item key="5">About</Menu.Item>
                    </Menu>
                </Header>
                <Content style={{ padding: '0 50px', flexGrow: 1 }}>
                    test
                </Content>
                <Footer className="main-footer">
                    &copy; 2017 Canton Resistance. Based on React &amp; Ant Design
                </Footer>
            </Layout>
        );
    }
}

export default App;
