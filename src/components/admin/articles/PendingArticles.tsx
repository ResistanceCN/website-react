import React from 'react';
import gql from 'graphql-tag';
import { adminClient as apollo } from '@/apollo';
import ArticleTable, { ArticleData } from './ArticleTable';

async function getPendingArticles() {
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
            status: 'PENDING'
        }
    });

    return result.data;
}

const PendingArticles = () => (
    <ArticleTable getArticles={getPendingArticles} />
);

export default PendingArticles;
