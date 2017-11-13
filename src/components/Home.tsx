import * as React from 'react';
import './Home.scss';
import { Layout, Menu, Button, Card, Row, Col, Timeline, Icon, Pagination } from 'antd';
const { Header, Footer, Content } = Layout;

class App extends React.Component {
    render() {
        return (
            <Layout className="layout main-layout">
                <Header className="main-header">
                    <div className="logo">
                        <img src="/assets/img/logo.svg" />
                    </div>
                    <div className="name">
                        Cantonres
                    </div>
                    <div className="flex-spacer" />
                    <Menu mode="horizontal" defaultSelectedKeys={['1']} className="main-menu">
                        <Menu.Item key="1">Home</Menu.Item>
                        <Menu.Item key="2">News</Menu.Item>
                        <Menu.Item key="3">Tutorials</Menu.Item>
                        <Menu.Item key="5">About</Menu.Item>
                    </Menu>
                </Header>
                <Content className="main-content">
                    <div className="banner">
                        <Row>
                            <Col span={18} offset={6}>
                                <div className="banner-head">
                                    Hello World!
                                </div>
                                <div className="banner-content">
                                    <p>Welecome to Resistance. It's time to move!</p>
                                    <p><span>[测试文字] 使用 Ant Motion 能够快速在 React 框架中使用动画。
                                    <br />我们提供了单项，组合动画，以及整套解决方案</span></p>
                                </div>
                                <div className="banner-button">
                                    <Button ghost={true}>加入我们</Button>
                                    <Button ghost={true}>查看教程</Button>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className="content">
                        <Row>
                            <Col span={8} offset={6}>
                                <div className="content-news">
                                    <Card className="content-news-card" title="Card title" bordered={false}>
                                        <p>Card content</p>
                                        <p>Card content</p>
                                        <p>Card content</p>
                                    </Card>
                                    <Card className="content-news-card" title="Card title" bordered={false}>
                                        <p>Card content</p>
                                        <p>Card content</p>
                                        <p>Card content</p>
                                    </Card>
                                    <Card className="content-news-card" title="Card title" bordered={false}>
                                        <p>Card content</p>
                                        <p>Card content</p>
                                        <p>Card content</p>
                                    </Card>
                                    <Card className="content-news-card" title="Card title" bordered={false}>
                                        <p>Card content</p>
                                        <p>Card content</p>
                                        <p>Card content</p>
                                    </Card>
                                    <Card className="content-news-card" title="Card title" bordered={false}>
                                        <p>Card content</p>
                                        <p>Card content</p>
                                        <p>Card content</p>
                                    </Card>
                                </div>
                            </Col>
                            <Col span={4}>
                                <Row>
                                    <Col>
                                        <div className="content-tools">
                                            <Card bordered={false}>
                                                <Icon className="content-tools-icon" type="link"/>
                                                <Icon className="content-tools-icon" type="edit"/>
                                                <Icon className="content-tools-icon" type="check"/>
                                                <Icon className="content-tools-icon" type="book"/>
                                            </Card>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <div className="content-menu">
                                            <Card title="一周最热" bordered={false}>
                                                <Timeline>
                                                    <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
                                                    <Timeline.Item>Solve initial network problems 2015-09-01</Timeline.Item>
                                                    <Timeline.Item>Technical testing 2015-09-01</Timeline.Item>
                                                    <Timeline.Item>Network problems being solved 2015-09-01</Timeline.Item>
                                                </Timeline>
                                            </Card>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                    <Row>
                        <Col span={8} offset={6}>
                            <div className="pagination">
                                <Pagination defaultCurrent={1} total={50} />
                            </div>
                        </Col>
                    </Row>
                </Content>
                <Footer className="main-footer">
                    &copy; 2017 Canton Resistance. Based on React &amp; Ant Design
                </Footer>
            </Layout>
        );
    }
}

export default App;
