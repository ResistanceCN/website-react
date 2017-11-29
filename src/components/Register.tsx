import './Register.scss';
import React from 'react';
import { Card } from 'antd';

export default class Register extends React.Component {
    render() {
        return (
            <div className="flex-spacer container login-container">
                <Card bordered={false}>
                    <p>目前我们只支持通过 Google 账户登录。</p>
                </Card>
            </div>
        );
    }
}
