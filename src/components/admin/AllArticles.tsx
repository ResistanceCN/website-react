import React from 'react';
import { Table } from 'antd';
import { ArticleStatus } from '../../types';
import gql from 'graphql-tag';
import { adminClient as apollo } from '../../apollo';
import ArticleTable, { ArticleData } from './ArticleTable';

const { Column } = Table;

const status = {
    [ArticleStatus.DRAFT]: '草稿',
    [ArticleStatus.PENDING]: '待审',
    [ArticleStatus.PUBLISHED]: '已发布'
};

export default class AllArticles extends React.Component {
    async getAllArticles() {
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

    render() {
        return (
            <ArticleTable getArticles={this.getAllArticles} />
        );
    }
}
