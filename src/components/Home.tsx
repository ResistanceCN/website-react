import * as React from 'react';
import './Home.scss';
import { Layout, Menu } from 'antd';
const { Header, Footer, Content } = Layout;

class App extends React.Component {
    render() {
        return (
            <Layout className="layout" style={{ minHeight: '100vh' }}>
                <Header style={{ background: '#fff' }} className="main-header">
                    <div className="logo">
                        <img src="/assets/img/logo.svg" height={40} />
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
                <Footer>
                    &copy; 2017 Canton Resistance. Based on Ant Design &amp; React
                </Footer>
            </Layout>
        );
    }
}

export default App;
