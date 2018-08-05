import React from 'react';
import { Popconfirm } from 'antd';
import { JoinInfo, JoinStatus } from '@/types';
import { unreachable } from '@/libs/utils';

interface ArticleActionProps {
    record: JoinInfo;
    updateStatus(record: JoinInfo, status: JoinStatus): Promise<void>;
}

export default class JoinInfoAction extends React.PureComponent<ArticleActionProps> {
    approveJoin = () => this.props.updateStatus(this.props.record, JoinStatus.APPROVED);
    rejectJoin = () => this.props.updateStatus(this.props.record, JoinStatus.REJECTED);

    renderPendingActions = () => (
        <React.Fragment>
            <Popconfirm
                title="确定要同意这位用户的加入申请吗？"
                onConfirm={this.approveJoin}
            >
                <a>同意</a>
            </Popconfirm>
            <span className="ant-divider" />
            <Popconfirm
                title={<p>确定要拒绝这位用户的加入申请吗？<br /><b>请注意：拒绝后此账户会被永久禁止申请加入社群！</b></p>}
                onConfirm={this.rejectJoin}
            >
                <a>拒绝</a>
            </Popconfirm>
        </React.Fragment>
    );

    render() {
        switch (this.props.record.status) {
            case JoinStatus.PENDING:
                return this.renderPendingActions();
            default:
                return unreachable();
        }
    }
}
