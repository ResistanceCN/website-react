import React, { MouseEvent } from 'react';
import { Button, Input, message, Table } from 'antd';
import { PaginationConfig } from 'antd/lib/table/interface';
import { JoinInfo, JoinStatus } from '@/types';
import gql from 'graphql-tag';
import Loading from '@/components/parts/Loading';
import { adminClient } from '@/apollo';
import { errorText } from '@/libs/utils';
import { MutationOptions } from 'apollo-client';
import JoinInfoAction from './JoinInfoAction';
import { names as regionNames } from '@/libs/regions';

const { Column } = Table;

const statusText = {
    [JoinStatus.PENDING]: '待审',
    [JoinStatus.APPROVED]: '已批准',
    [JoinStatus.REJECTED]: '已拒绝'
};

export interface JoinData {
    joinList: Array<JoinInfo>;
    total: number;
}

interface JoinInfoTableProps {
    withAction?: boolean;
    getJoinList(count: number, offset: number): Promise<JoinData>;
}

interface JoinInfoTableState {
    data: Array<JoinInfo>;
    pagination: PaginationConfig;
    loading: boolean;
    ready: boolean;
}

export default class JoinInfoTable extends React.Component<JoinInfoTableProps, JoinInfoTableState> {
    state = {
        data: [],
        pagination: {
            pageSize: 15,
            current: 1
        },
        loading: true,
        ready: false
    };

    async getJoinList(pagination: PaginationConfig = this.state.pagination) {
        this.setState({
            loading: true
        });

        const count = pagination.pageSize!;
        const offset = (pagination.current! - 1) * count;

        const data = await this.props.getJoinList(count, offset);

        this.setState({
            data: data.joinList,
            pagination: {
                ...pagination,
                total: data.total
            },
            loading: false
        });
    }

    handleTableChange = (pagination: PaginationConfig) => {
        this.getJoinList(pagination as PaginationConfig);
    };

    async mutate<T>(options: MutationOptions<T>) {
        this.setState({
            loading: true
        });

        try {
            await adminClient.mutate(options);
            await this.getJoinList();
        } catch (e) {
            message.error(errorText(e));
            this.setState({
                loading: false
            });
        }
    }

    updateStatus = (joinInfo: JoinInfo, status: JoinStatus) => {
        return this.mutate({
            mutation: gql`
                mutation($userId: ID!, $status: JoinStatus) {
                    updateJoinInfo(userId: $userId, status: $status) {
                        userId
                    }
                }
            `,
            variables: {
                userId: joinInfo.userId,
                status
            }
        });
    };

    updateComment = async (e: MouseEvent<HTMLButtonElement>) => {
        const userId = e.currentTarget.value;
        const ta = document.getElementById('comment-' + userId) as HTMLTextAreaElement;

        await this.mutate({
            mutation: gql`
                mutation($userId: ID!, $comment: String) {
                    updateJoinInfo(userId: $userId, comment: $comment) {
                        userId
                    }
                }
            `,
            variables: {
                userId: userId,
                comment: ta.value
            }
        });

        message.success('提交成功');
    };

    renderExpandColumn = (record: JoinInfo) => (
        <React.Fragment>
            <p><b>其他说明：</b>{record.other}</p>
            <p><b>管理员备注：</b></p>
            <p><Input.TextArea id={'comment-' + record.userId} defaultValue={record.comment} /></p>
            <div className="text-right">
                <Button type="primary" value={record.userId} onClick={this.updateComment}>更新备注</Button>
            </div>
        </React.Fragment>
    );

    renderRegionsColumn = (text: string, record: JoinInfo) => {
        return record.regions
            .map(region => regionNames[region])
            .join(', ');
    };
    renderActionColumn = (text: string, record: JoinInfo) => (
        <JoinInfoAction
            record={record}
            updateStatus={this.updateStatus}
        />
    );

    async componentDidMount() {
        await this.getJoinList();

        this.setState({
            ready: true
        });
    }

    render() {
        if (!this.state.ready) {
            return <Loading />;
        }

        return (
            <Table
                bordered
                expandRowByClick
                rowKey="userId"
                dataSource={this.state.data}
                pagination={this.state.pagination}
                loading={this.state.loading}
                onChange={this.handleTableChange}
                expandedRowRender={this.renderExpandColumn}
            >
                <Column title="特工代号" key="name" dataIndex="agentName" />
                <Column title="Telegram" key="telegram" dataIndex="telegram" />
                <Column title="地区" key="regions" render={this.renderRegionsColumn} />
                {this.props.withAction && (
                    <Column title="操作" key="action" render={this.renderActionColumn} />
                )}
            </Table>
        );
    }
}
