import React from 'react';
import './Home.scss';
import { Layout, Row, Col, Menu, Button, Card, Timeline, Tooltip, BackTop, Icon, Pagination } from 'antd';
const { Header, Footer, Content } = Layout;
import Article from '../types/Article';
import TimelineItem from 'antd/es/timeline/TimelineItem';

enum SidebarStatus {
    Static,
    Fixed,
    Bottom,
    Calculated
}

interface SidebarAttr {
    height: number;
    cardHeights: Array<number>;
    fixAt: number;
    status: SidebarStatus;
    viewportHeight: number;
    visibleHeight: number;
    hiddenHeight: number;
    fixedTop: number;
}

export default class Home extends React.Component {
    sidebar: SidebarAttr = {
        height: 0,
        cardHeights: [],
        fixAt: 0,
        status: SidebarStatus.Static,
        viewportHeight: 0,
        visibleHeight: 0,
        hiddenHeight: 0,
        fixedTop: 0,
    };
    state = {
        sidebarFixStyle: {}
    };

    onScroll: EventListener;
    onResize: EventListener;
    animation = true;

    getArticles(page: number): Array<Article> {
        let articles: Array<Article> = [];

        for (let i = 0; i < 10; ++i) {
            articles.push({
                id: i,
                title: '宇囚 - ' + i,
                author: 1,
                tag: ['科幻', '短片小说'],
                date: new Date(),
                content: '第一个开拓者在启航后85年返回，打通了连接太阳系与织女星系的虫洞，\
                由此掀开了人类文明殖民银河系的大幕。资源由各个星系源源不断的流入人类手中，\
                技术随着时间推移变得愈发出神入化，智慧的足迹踏遍银河系的颗行星，\
                冒险家的故事传颂在整个星河。'
            });
        }

        return articles;
    }

    getTimeline(): Array<string> {
        return [
            'Create a services site 2015-09-01',
            'Solve initial network problems 2015-09-01',
            'Technical testing 2015-09-01',
            'Network problems being solved 2015-09-01'
        ];
    }

    updateSidebarStatus() {
        const sidebarAttr = this.sidebar;

        // 左侧新闻区域
        const newsArea = document.querySelector('.news')!.getBoundingClientRect();

        // 第一个可见的 Card 距固定位置的高度
        const visibleStartPos = newsArea.top + this.sidebar.hiddenHeight - 76;

        if (visibleStartPos >= 0) {
            if (sidebarAttr.status === SidebarStatus.Static) { return; }
            this.sidebar.status = SidebarStatus.Static;

            // 还不需要固定
            this.setState({
                sidebarFixStyle: {}
            });
        } else if (this.sidebar.fixedTop + sidebarAttr.height <= newsArea.bottom - 12) {
            if (sidebarAttr.status === SidebarStatus.Fixed) { return; }
            this.sidebar.status = SidebarStatus.Fixed;

            // 开始固定，且可见的 Card 底部没有超出 Content 高度
            this.setState({
                sidebarFixStyle: {
                    position: 'fixed',
                    top: this.sidebar.fixedTop,
                    left: newsArea.left + newsArea.width,
                    width: newsArea.width / 2
                }
            });
        } else {
            if (sidebarAttr.status === SidebarStatus.Bottom) { return; }
            this.sidebar.status = SidebarStatus.Bottom;

            // 可见的 Card 底部已超出 Content 高度，使 Card 跟随新闻区域上移
            this.setState({
                sidebarFixStyle: {
                    position: 'absolute',
                    bottom: 12,
                    left: newsArea.width,
                    width: newsArea.width / 2
                }
            });
        }
    }

    calculateSidebarAttr() {
        const sidebar = document.querySelector('.sidebar');
        const cards = document.querySelectorAll('.sidebar > .ant-card');
        let cardsHeight: Array<number> = [];

        Array.from(cards).forEach(card => {
            cardsHeight.push(card.clientHeight);
        });

        this.sidebar.cardHeights = cardsHeight;
        this.sidebar.height = sidebar!.clientHeight;

        // 可视区域高度
        this.sidebar.viewportHeight = document.documentElement.offsetHeight - 76;
        // 可见的 Card 总高度，包括间距
        let visibleHeight = 0;
        // 从第几个 Card 开始可见
        let fixAt = 0;

        // 反向遍历所有 Card
        for (let i = this.sidebar.cardHeights.length - 1; i >= 0; --i) {
            // 把 Card 的高度加入 visibleHeight
            let height = this.sidebar.cardHeights[i];
            visibleHeight += height;
            fixAt = i;

            // 检查 visibleHeight 是否大于可视区域高度
            if (visibleHeight >= this.sidebar.viewportHeight) {

                // 如果高度过大，则该 Card 和其上方的所有 Card 都不可见
                // 但至少要保持最后一个 Card 可见
                if (i < this.sidebar.cardHeights.length - 1) {
                    visibleHeight -= height;
                    fixAt = i + 1;
                }

                break;
            }
        }

        visibleHeight += 12 * (this.sidebar.cardHeights.length - fixAt - 1);
        this.sidebar.visibleHeight = visibleHeight;
        this.sidebar.fixAt = fixAt;

        // 被隐藏的 Card 的高度
        this.sidebar.hiddenHeight = this.sidebar.height - visibleHeight;

        // 固定时的 CSS top 属性
        this.sidebar.fixedTop = 76 - this.sidebar.hiddenHeight;

        this.sidebar.status = SidebarStatus.Calculated;
    }

    componentDidMount() {
        this.calculateSidebarAttr();

        this.onScroll = () => {
            this.updateSidebarStatus();
        };
        this.onResize = () => {
            this.calculateSidebarAttr();
            this.updateSidebarStatus();
        };

        window.addEventListener('scroll', this.onScroll);
        window.addEventListener('resize', this.onResize);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScroll);
        window.removeEventListener('resize', this.onResize);
    }

    render() {
        return (
            <Layout className="layout main-layout">
                <div className="header-placeholder" />
                <Header className="main-header">
                    <div className="logo">
                        <img src="/assets/img/logo.svg" />
                    </div>
                    <div className="name">
                        CantonRES
                    </div>

                    <div className="flex-spacer" />

                    <Menu mode="horizontal" defaultSelectedKeys={['1']} className="main-menu">
                        <Menu.Item key="1">Home</Menu.Item>
                        <Menu.Item key="2">News</Menu.Item>
                        <Menu.Item key="3">Tutorials</Menu.Item>
                        <Menu.Item key="5">About</Menu.Item>
                    </Menu>
                </Header>

                <Content className="banner">
                    <div className="container">
                        <div className="banner-head">
                            Hello World!
                        </div>
                        <div className="banner-content">
                            <p className="welcome">Welecome to Resistance. It's time to move!</p>
                            <p>[测试文字] 使用 Ant Motion 能够快速在 React 框架中使用动画。</p>
                            <p>我们提供了单项，组合动画，以及整套解决方案</p>
                        </div>
                        <div className="banner-button">
                            <Button ghost>加入我们</Button>
                            <Button ghost>查看教程</Button>
                        </div>
                    </div>
                </Content>

                <Content className="container main">
                    <Row>
                        <Col span={16} className="news">
                            {this.getArticles(1).map(article => {
                                return (
                                    <Card key={article.id} title={article.title} bordered={false} className="article">
                                        {article.content}
                                    </Card>
                                );
                            })}
                        </Col>

                        <Col span={8} className="sidebar" style={this.state.sidebarFixStyle}>
                            <Card bordered={false} className="tools">
                                <Tooltip title="prompt text">
                                    <Icon type="link"/>
                                </Tooltip>
                                <Tooltip title="prompt text">
                                    <Icon type="edit"/>
                                </Tooltip>
                                <Tooltip title="prompt text">
                                    <Icon type="check"/>
                                </Tooltip>
                                <Tooltip title="prompt text">
                                    <Icon type="book"/>
                                </Tooltip>
                            </Card>

                            <Card title="一周最热" bordered={false} className="content-menu">
                                <Timeline>
                                    {this.getTimeline().map((item, key) => {
                                        return <TimelineItem key={key}>{item}</TimelineItem>;
                                    })}
                                </Timeline>
                            </Card>
                        </Col>
                    </Row>
                </Content>

                <Content className="container pagination">
                    <Pagination defaultCurrent={1} total={50} showQuickJumper />
                </Content>

                <Footer className="main-footer">
                    &copy; 2017 Canton Resistance. Based on React &amp; Ant Design
                </Footer>

                <BackTop />
            </Layout>
        );
    }
}
