import React from 'react';
import './Home.scss';
import { Layout, Row, Col, Menu, Button, Card, Timeline, Tooltip, BackTop, Icon, Pagination } from 'antd';
const { Header, Footer, Content } = Layout;
import Article from '../types/Article';
import TimelineItem from 'antd/es/timeline/TimelineItem';

enum SidebarType {
    Static,
    Fixed,
    Bottom,
    Resizing
}

export default class Home extends React.Component {
    cardsHeight: Array<number> = [];
    sidebarHeight = 0;
    sidebarType: SidebarType = SidebarType.Static;
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
                title: 'test article - ' + i,
                author: 1,
                tag: ['test', 'test 2'],
                date: new Date(),
                content: 'test content'
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

    updateStickySidebar() {
        // 可视区域高度
        const viewportHeight = document.documentElement.offsetHeight - 76;
        // 可见的 Card 总高度，包括间距
        let visibleHeight = 0;
        // 从第几个 Card 开始可见
        let fixedCards = 0;

        // 反向遍历所有 Card
        for (let i = this.cardsHeight.length - 1; i >= 0; --i) {
            // 把 Card 的高度加入 visibleHeight
            let height = this.cardsHeight[i];
            visibleHeight += height;
            fixedCards = i;

            // 检查 visibleHeight 是否大于可视区域高度
            if (visibleHeight >= viewportHeight) {

                // 如果高度过大，则该 Card 和其上方的所有 Card 都不可见
                // 但至少要保持最后一个 Card 可见
                if (i < this.cardsHeight.length - 1) {
                    visibleHeight -= height;
                    fixedCards = i + 1;
                }

                break;
            }
        }

        visibleHeight += 12 * (this.cardsHeight.length - fixedCards - 1);

        // 被隐藏的 Card 的高度
        const hiddenHeight = this.sidebarHeight - visibleHeight;

        // 左侧新闻区域
        const newsArea = document.querySelector('.news')!.getBoundingClientRect();
        // 第一个可见的 Card 距固定位置的高度
        const fixedStart = newsArea.top + hiddenHeight - 76;
        // 固定时的 CSS top 属性
        const top = 76 - hiddenHeight;

        if (fixedStart >= 0) {
            if (this.sidebarType === SidebarType.Static) { return; }
            this.sidebarType = SidebarType.Static;

            // 还不需要固定
            this.setState({
                ...this.state,
                sidebarFixStyle: {}
            });
        } else if (top + this.sidebarHeight <= newsArea.bottom - 12) {
            if (this.sidebarType === SidebarType.Fixed) { return; }
            this.sidebarType = SidebarType.Fixed;

            // 开始固定，且可见的 Card 底部没有超出 Content 高度
            this.setState({
                ...this.state,
                sidebarFixStyle: {
                    position: 'fixed',
                    top: top,
                    left: newsArea.left + newsArea.width,
                    width: newsArea.width / 2
                }
            });
        } else {
            if (this.sidebarType === SidebarType.Bottom) { return; }
            this.sidebarType = SidebarType.Bottom;

            // 可见的 Card 底部已超出 Content 高度，使 Card 跟随新闻区域上移
            this.setState({
                ...this.state,
                sidebarFixStyle: {
                    position: 'absolute',
                    // top: newsArea.bottom - this.sidebarHeight - 12,
                    bottom: 12,
                    left: newsArea.width,
                    width: newsArea.width / 2
                }
            });
        }
    }

    calculateVisible() {
        const sidebar = document.querySelector('.sidebar');
        const cards = document.querySelectorAll('.sidebar > .ant-card');
        let cardsHeight: Array<number> = [];

        Array.from(cards).forEach(card => {
            cardsHeight.push(card.clientHeight);
        });

        this.cardsHeight = cardsHeight;
        this.sidebarHeight = sidebar!.clientHeight;
    }

    parallaxScrollBanner() {
        const background = document.querySelector('.banner > .background') as HTMLElement;

        let lastWindowScrollY = window.scrollY;
        background.style.transform = 'translate3D(0, ' + Math.floor(lastWindowScrollY / 3) + 'px, 0)';

        let animate = () => {
            if (!this.animation) {
                return;
            }

            // If the offset position hasn't changed, skip this frame
            if (lastWindowScrollY === window.scrollY) {
                window.requestAnimationFrame(animate);

                return;
            }

            // Save the new offset position
            lastWindowScrollY = window.scrollY;
            background.style.transform = 'translate3D(0, ' + Math.floor(lastWindowScrollY / 3) + 'px, 0)';

            window.requestAnimationFrame(animate);
        };

        window.requestAnimationFrame(animate);
    }

    componentDidMount() {
        this.calculateVisible();

        this.onScroll = () => {
            this.updateStickySidebar();
        };
        this.onResize = () => {
            this.sidebarType = SidebarType.Resizing;
            this.calculateVisible();
            this.updateStickySidebar();
        };

        window.addEventListener('scroll', this.onScroll);
        window.addEventListener('resize', this.onResize);

        this.parallaxScrollBanner();
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

                <Content className="banner">
                    <Row>
                        <Col span={16} offset={4}>
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
                        </Col>
                    </Row>

                    <div className="background" />
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
