import './Join.scss';
import React, { FormEvent } from 'react';
import { JoinInfo, User } from '../types';
import { State } from '../reducers';
import { connect, Dispatch } from 'react-redux';
import { Button, Card, Form, Icon, Input, message, Tag } from 'antd';
import { Redirect, RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import Loading from './Loading';
import WithSidebar from './WithSidebar';
import RegionMap from './RegionMap';
import { names as regionNames } from '../libs/regions';
import { errorText } from '../libs/utils';
import { client as apollo } from '../apollo';
import gql from 'graphql-tag';

interface BindingEvent {
    target: {
        name?: string;
        value?: string;
    };
}

interface JoinProps extends RouteComponentProps<{}> {
    user: User | null;
}

interface JoinState {
    loading: boolean;
    name: string;
    telegram: string;
    regions: Set<string>;
    other: string;
    updatedAt: Date | null;
}

class Join extends React.Component<JoinProps, JoinState> {
    state = {
        loading: true,
        name: '',
        telegram: '',
        regions: new Set(),
        other: '',
        updatedAt: null
    };

    handleChange = (e: BindingEvent) => {
        this.setState({
            ...this.state,
            [e.target.name!]: e.target.value
        });
    };

    getJoinInfo() {
        apollo.query<{ info: JoinInfo }>({
            query: gql`
                query {
                    info: joinInfo {
                        name
                        telegram
                        regions
                        other
                        updatedAt
                    }
                }
            `,
            fetchPolicy: 'network-only'
        }).then(result => {
            const info = result.data.info;
            this.setState({
                ...this.state,
                loading: false,
                name: info.name,
                telegram: info.telegram,
                regions: new Set(info.regions),
                other: info.other,
                updatedAt: new Date(info.updatedAt)
            });
        });
    }

    onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        apollo.mutate<{ info: JoinInfo }>({
            mutation: gql`
                mutation(
                    $name: String!,
                    $telegram: String!,
                    $regions: [String]!,
                    $other: String,
                ) {
                    info: join(
                        name: $name,
                        telegram: $telegram,
                        regions: $regions,
                        other: $other
                    ) { updatedAt }
                }
            `,
            variables: {
                name: this.state.name,
                telegram: this.state.telegram,
                regions: Array.from(this.state.regions),
                other: this.state.other
            }
        }).then(result => {
            message.success('提交成功');
            this.setState({
                ...this.state,
                updatedAt: new Date(result.data!.info.updatedAt)
            });
        }).catch(error => {
            message.error(errorText(error));
        });
    };

    onSelectRegion = (event: google.maps.Data.MouseEvent) => {
        this.setState({
            regions: this.state.regions.add(event.feature.getProperty('id'))
        });
    };

    // Currying
    onRemoveRegion = (region: string) => () => {
        this.state.regions.delete(region);
        this.setState({
            regions: this.state.regions
        });
    };

    renderRegionTag = (region: string) => (
        <Tag
            key={region}
            closable
            afterClose={this.onRemoveRegion(region)}
        >
            {regionNames[region]}
        </Tag>
    );

    componentDidMount() {
        this.getJoinInfo();
    }

    render() {
        if (this.props.user === null) {
            return <Redirect to={{ pathname: '/login', state: { from: '/join' }}} />;
        }

        if (this.state.loading) {
            return <Loading />;
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
                                    <Input
                                        prefix={<Icon type="user" />}
                                        name="name"
                                        value={this.state.name}
                                        placeholder="Agent Name"
                                        onChange={this.handleChange}
                                    />
                                </Form.Item>

                                <Form.Item label="Telegram 用户名">
                                    <p><i>(什么是 <a href="https://telegram.org" target="_blank">Telegram</a>?)</i></p>
                                    <p>请注意，Telegram 的 Name 与 Username 不是同一个概念，请填写 Username</p>
                                    <Input
                                        prefix={<Icon type="user" />}
                                        name="telegram"
                                        value={this.state.telegram}
                                        placeholder="Telegram Username (不带 @)"
                                        onChange={this.handleChange}
                                    />
                                </Form.Item>

                                <Form.Item label="主要活动区域">
                                    <p>如你发现战区与现实的行政区矛盾，还是请按照此地图中的战区选择</p>
                                    <RegionMap onSelect={this.onSelectRegion} />
                                    <div>
                                        {Array.from(this.state.regions).map(this.renderRegionTag)}
                                    </div>
                                </Form.Item>

                                <Form.Item label="其他说明">
                                    <p>可以在此简述一下你是怎么入坑的、你的入坑时间、是否认识其他特工等</p>
                                    <Input.TextArea
                                        name="other"
                                        value={this.state.other}
                                        autosize={{ minRows: 4, maxRows: 10 }}
                                        onChange={this.handleChange}
                                    />
                                </Form.Item>

                                <div className="form-action">
                                    {this.state.updatedAt !== null && '最后修改于 ' + [
                                        (this.state.updatedAt! as Date).toLocaleDateString(),
                                        (this.state.updatedAt! as Date).toLocaleTimeString()
                                    ].join(' ')}
                                    <div className="flex-spacer" />
                                    <Link to="/"><Button>取消</Button></Link>
                                    <Button type="primary" htmlType="submit">提交</Button>
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
