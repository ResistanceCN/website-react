import React from 'react';
import { Table } from 'antd';
import { Article, ArticleStatus } from '../../types';
import gql from 'graphql-tag';
import { adminClient as apollo } from '../../apollo';
import ArticleTable from './ArticleTable';

const { Column } = Table;

const status = {
    [ArticleStatus.DRAFT]: '草稿',
    [ArticleStatus.PENDING]: '待审',
    [ArticleStatus.PUBLISHED]: '已发布'
};

export default class PendingArticles extends React.Component {
    async getPendingArticles() {
        const result = await apollo.query<{ articles: Array<Article> }>({
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
                }
            `,
            variables: {
                status: 'PENDING'
            }
        });

        return result.data.articles;
    }

    render() {
        return (
            <ArticleTable getArticles={this.getPendingArticles} />
        );
    }
}
