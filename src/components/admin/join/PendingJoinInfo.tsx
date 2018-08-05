import React from 'react';
import gql from 'graphql-tag';
import { adminClient as apollo } from '@/apollo';
import JoinInfoTable, { JoinData } from './JoinInfoTable';
import { JoinStatus } from '@/types';

async function getPendingJoinList(count: number, offset: number) {
    const result = await apollo.query<JoinData>({
        query: gql`
            query($count: Int, $offset: Int, $status: JoinStatus) {
                joinList: listJoinInfo(count: $count, offset: $offset, status: $status) {
                    userId
                    agentName
                    telegram
                    regions
                    other
                    status
                    comment
                }
                total: totalJoinInfo(status: $status)
            }
        `,
        variables: {
            count,
            offset,
            status: JoinStatus.PENDING
        }
    });

    return result.data;
}

const PendingJoinInfo = () => (
    <JoinInfoTable withAction getJoinList={getPendingJoinList} />
);

export default PendingJoinInfo;
