import React from 'react';
import gql from 'graphql-tag';
import { adminClient as apollo } from '@/apollo';
import JoinInfoTable, { JoinData } from './JoinInfoTable';
import { JoinStatus } from '@/types';

async function getRejectedJoinList(count: number, offset: number) {
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
                }
                total: totalJoinInfo(status: $status)
            }
        `,
        variables: {
            count,
            offset,
            status: JoinStatus.REJECTED
        }
    });

    return result.data;
}

const RejectedJoinInfo = () => (
    <JoinInfoTable getJoinList={getRejectedJoinList} />
);

export default RejectedJoinInfo;
