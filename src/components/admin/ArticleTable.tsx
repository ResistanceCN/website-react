import React from 'react';
import { message, Table } from 'antd';
import { PaginationConfig } from 'antd/lib/table/interface';
import { Article, ArticleStatus } from '../../types';
import gql from 'graphql-tag';
import Loading from '../Loading';
import { adminClient as apollo } from '../../apollo';
import { errorText } from '../../libs/utils';
import { MutationOptions } from 'apollo-client';
import ArticleAction from './ArticleAction';
import { Link } from 'react-router-dom';

const { Column } = Table;

const statusText = {
    [ArticleStatus.DRAFT]: '草稿',
    [ArticleStatus.PENDING]: '待审',
    [ArticleStatus.PUBLISHED]: '已发布'
};

export interface ArticleData {
    articles: Array<Article>;
    total: number;
}

interface ArticleTableProps {
    getArticles(count: number, offset: number): Promise<ArticleData>;
}

interface ArticleTableState {
    data: Array<Article>;
    pagination: PaginationConfig;
    loading: boolean;
    ready: boolean;
}

export default class ArticleTable extends React.Component<ArticleTableProps, ArticleTableState> {
    state = {
        data: [],
        pagination: {
            pageSize: 15,
            current: 1
        },
        loading: true,
        ready: false
    };

    async getArticles(pagination: PaginationConfig = this.state.pagination) {
        this.setState({
            loading: true
        });

        const count = pagination.pageSize!;
        const offset = (pagination.current! - 1) * count;

        const data = await this.props.getArticles(count, offset);

        this.setState({
            data: data.articles,
            pagination: {
                ...pagination,
                total: data.total
            },
            loading: false
        });
    }

    handleTableChange = (pagination: PaginationConfig) => {
        this.getArticles(pagination as PaginationConfig);
    };

    async mutate<T>(options: MutationOptions<T>) {
        this.setState({
            loading: true
        });

        try {
            await apollo.mutate(options);
            await this.getArticles();
        } catch (e) {
            message.error(errorText(e));
            this.setState({
                loading: false
            });
        }
    }

    updateStatus = (article: Article, status: ArticleStatus) => this.mutate({
        mutation: gql`
            mutation($id: ID!, $status: ArticleStatus) {
                updateArticle(id: $id, status: $status) {
                    id
                }
            }
        `,
        variables: {
            id: article.id,
            status
        }
    });

    deleteArticle = (article: Article) => this.mutate({
        mutation: gql`
            mutation($id: ID!) {
                deleteArticle(id: $id)
            }
        `,
        variables: {
            id: article.id
        }
    });

    renderStatusColumn = (text: string, record: Article) => statusText[record.status];
    renderAuthorColumn = (text: string, record: Article) => record.author.name;
    renderTitleColumn = (text: string, record: Article) => {
        if (record.status === ArticleStatus.PUBLISHED) {
            return <Link to={'/article/' + record.id}>{record.title}</Link>;
        } else {
            return record.title;
        }
    };
    renderActionColumn = (text: string, record: Article) => (
        <ArticleAction
            record={record}
            updateStatus={this.updateStatus}
            deleteArticle={this.deleteArticle}
        />
    );

    async componentDidMount() {
        await this.getArticles();

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
                rowKey="id"
                dataSource={this.state.data}
                pagination={this.state.pagination}
                loading={this.state.loading}
                onChange={this.handleTableChange}
            >
                <Column title="标题" key="title" render={this.renderTitleColumn} />
                <Column title="状态" key="status" render={this.renderStatusColumn} />
                <Column title="作者" key="author" render={this.renderAuthorColumn} />
                <Column title="操作" key="action" render={this.renderActionColumn} />
            </Table>
        );
    }
}
