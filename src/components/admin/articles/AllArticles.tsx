import React from 'react';
import gql from 'graphql-tag';
import { adminClient as apollo } from '@/apollo';
import ArticleTable, { ArticleData } from './ArticleTable';

async function getAllArticles() {
    const result = await apollo.query<ArticleData>({
        query: gql`
            query($count: Int, $offset: Int) {
                articles: listArticles(count: $count, offset: $offset) {
                    id
                    title
                    author { id name }
                    tags
                    content
                    status
                    publishedAt
                }
                total: totalArticles
            }
        `
    });

    return result.data;
}

const AllArticles = () => (
    <ArticleTable getArticles={getAllArticles} />
);

export default AllArticles;
