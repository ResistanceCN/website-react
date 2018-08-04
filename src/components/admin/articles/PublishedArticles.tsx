import React from 'react';
import gql from 'graphql-tag';
import { adminClient as apollo } from '@/apollo';
import ArticleTable, { ArticleData } from './ArticleTable';

async function getPublishedArticles(count: number, offset: number) {
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
            status: 'PUBLISHED'
        }
    });

    return result.data;
}

const PublishedArticles = () => (
    <ArticleTable getArticles={getPublishedArticles} />
);

export default PublishedArticles;
