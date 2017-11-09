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
                        <img src="/assets/img/logo.svg" height={48} />
                    </div>
                    <Menu mode="horizontal" defaultSelectedKeys={['1']} className="main-menu">
                        <Menu.Item key="1">nav 1</Menu.Item>
                        <Menu.Item key="2">nav 2</Menu.Item>
                        <Menu.Item key="3">nav 3</Menu.Item>
                    </Menu>
                </Header>
                <Content style={{ padding: '0 50px', flexGrow: 1 }}>
                    test
                </Content>
                <Footer>
                    Ant Design ©2016 Created by Ant UED
                </Footer>
            </Layout>
        );
    }
}

export default App;
