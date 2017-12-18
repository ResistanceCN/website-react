import './Join.scss';
import React from 'react';
import { User } from '../types';
import { State } from '../reducers/index';
import { connect, Dispatch } from 'react-redux';
import { Button, Card, Form, Icon, Input, Tag } from 'antd';
import { Redirect, RouteProps } from 'react-router';
import { Link } from 'react-router-dom';
import WithSidebar from './WithSidebar';
import RegionMap from './RegionMap';
import { names as regionNames } from '../libs/regions';

interface JoinProps {
    user: User | null;
}

interface JoinState {
    regions: Set<string>;
}

class Join extends React.Component<JoinProps & RouteProps, JoinState> {
    state = {
        regions: new Set()
    };

    onSubmit() {
        //
    }

    onSelectRegion(event: google.maps.Data.MouseEvent) {
        this.setState({
            regions: this.state.regions.add(event.feature.getProperty('id'))
        });
    }

    onRemoveRegion(region: string) {
        this.state.regions.delete(region);
        this.setState({
            regions: this.state.regions
        });
    }

    render() {
        if (this.props.user === null) {
            return <Redirect to={{ pathname: '/login', state: { from: '/join' }}} />;
        }

        return (
            <div className="flex-spacer">
                <div className="banner article-banner join-banner">
                    <div className="container">
                        <div className="banner-head">特工登记</div>
                        <p>人类的自由，蓝色的地球。泛广州抵抗军欢迎你的参战！</p>
                        <p>It time to move!</p>
                    </div>
                </div>

                <div className="container main">
                    <WithSidebar className="news">
                        <Card bordered={false}>
                            <Form onSubmit={this.onSubmit} className="join-form">
                                <p>请如实认真地填写该表格，这将有助于我们更好地组织和调配战争资源，为我们共同的目标赢得更大的优势！</p>
                                <p>你填写的信息只会提供给审核人员查看，并保证不会在未得到你允许的情况下外传。</p>

                                <Form.Item label="特工代号">
                                    <Input prefix={<Icon type="user" />} placeholder="Agent Name" />
                                </Form.Item>

                                <Form.Item label="Telegram 用户名">
                                    <p><i>(什么是 <a href="https://telegram.org" target="_blank">Telegram</a>?)</i></p>
                                    <p>请注意，Telegram 的 Name 与 Username 不是同一个概念，请填写 Username</p>
                                    <Input prefix={<Icon type="user" />} placeholder="Telegram Username (不带 @)" />
                                </Form.Item>

                                <Form.Item label="主要活动区域">
                                    <p>如你发现战区与现实的行政区矛盾，还是请按照此地图中的战区选择</p>
                                    <RegionMap onSelect={e => this.onSelectRegion(e)} />
                                    <div>
                                        {Array.from(this.state.regions).map(region => (
                                            <Tag
                                                key={region}
                                                closable
                                                afterClose={() => this.onRemoveRegion(region)}
                                            >
                                                {regionNames[region]}
                                            </Tag>
                                        ))}
                                    </div>
                                </Form.Item>

                                <Form.Item label="其他说明">
                                    <p>可以在此简述一下你是怎么入坑的、你的入坑时间、是否认识其他特工等</p>
                                    <Input.TextArea autosize={{ minRows: 4, maxRows: 10 }} />
                                </Form.Item>

                                <div className="form-action">
                                    <Link to="/"><Button size="large">取消</Button></Link>
                                    <Button size="large" type="primary">提交</Button>
                                </div>
                            </Form>
                        </Card>
                    </WithSidebar>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: State) => ({
    user: state.auth.user
});

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Join);
