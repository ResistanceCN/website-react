import React from 'react';
import gql from 'graphql-tag';
import { adminClient as apollo } from '@/apollo';
import ArticleTable, { ArticleData } from './ArticleTable';
import { ArticleStatus } from '@/types';

async function getPendingArticles(count: number, offset: number) {
    const result = await apollo.query<ArticleData>({
        query: gql`
            query($count: Int, $offset: Int, $status: ArticleStatus) {
                articles: listArticles(count: $count, offset: $offset, status: $status) {
                    id
                    title
                    author { id name }
                    tags
                    content
                    status
                    publishedAt
                }
                total: totalArticles(status: $status)
            }
        `,
        variables: {
            count,
            offset,
            status: ArticleStatus.PENDING
        }
    });

    return result.data;
}

const PendingArticles = () => (
    <ArticleTable getArticles={getPendingArticles} />
);

export default PendingArticles;
