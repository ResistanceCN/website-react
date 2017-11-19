import React from 'react';
import './Join.scss';
import { Button, Card, Col, Form, Icon, Input, Layout, Row } from 'antd';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';

interface State {
    //
}

export default class Article extends React.Component {
    state: State = {
        //
    };

    onSubmit() {
        //
    }

    render() {
        return (
            <div className="flex-spacer">
                <Layout.Content className="banner article-banner join-banner">
                    <div className="container">
                        <div className="banner-head">特工登记</div>
                        <p>人类的自由，蓝色的地球。泛广州抵抗军欢迎你的参战！</p>
                        <p>It time to move!</p>
                    </div>
                </Layout.Content>

                <Layout.Content className="container main">
                    <Row>
                        <Col span={16} className="news">
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

                                    // Map Here

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
                        </Col>

                        <Sidebar />
                    </Row>
                </Layout.Content>
            </div>
        );
    }
}
