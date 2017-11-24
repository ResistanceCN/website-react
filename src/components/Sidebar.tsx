import React, { CSSProperties } from 'react';
import './Sidebar.scss';
import { Card, Col, Icon, Timeline, Tooltip } from 'antd';

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

interface SidebarState {
    sidebarFixStyle: CSSProperties;
}

export default class Sidebar extends React.Component<{}, SidebarState> {
    state = {
        sidebarFixStyle: {}
    };

    sidebar: SidebarAttr = {
        height: 0,
        cardHeights: [],
        fixAt: 0,
        status: SidebarStatus.Static,
        viewportHeight: 0,
        visibleHeight: 0,
        hiddenHeight: 0,
        fixedTop: 0
    };

    onScroll: EventListener;
    onResize: EventListener;

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
                            return <Timeline.Item key={key}>{item}</Timeline.Item>;
                        })}
                    </Timeline>
                </Card>
            </Col>
        );
    }
}