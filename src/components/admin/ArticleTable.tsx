import React from 'react';
import { message, Popconfirm, Table } from 'antd';
import { PaginationConfig } from 'antd/lib/table/interface';
import { Article, ArticleStatus } from '../../types';
import gql from 'graphql-tag';
import Loading from '../Loading';
import { adminClient as apollo } from '../../apollo';
import { errorText } from '../../libs/utils';
import { MutationOptions } from 'apollo-client';

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
            ...this.state,
            loading: true
        });

        const count = pagination.pageSize!;
        const offset = (pagination.current! - 1) * count;

        const data = await this.props.getArticles(count, offset);

        this.setState({
            ...this.state,
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
            ...this.state,
            loading: true
        });

        try {
            await apollo.mutate(options);
            await this.getArticles();
        } catch (e) {
            message.error(errorText(e));
            this.setState({
                ...this.state,
                loading: false
            });
        }
    }

    updateStatus = (article: Article, status: ArticleStatus) => () => {
        this.mutate({
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
    };

    deleteArticle = (article: Article) => () => {
        this.mutate({
            mutation: gql`
                mutation($id: ID!) {
                    deleteArticle(id: $id)
                }
            `,
            variables: {
                id: article.id
            }
        });
    };

    renderStatusColumn = (text: string, record: Article) => statusText[record.status];
    renderAuthorColumn = (text: string, record: Article) => record.author.name;
    renderActionColumn = (text: string, record: Article) => (
        <React.Fragment>
            {record.status === ArticleStatus.PENDING ? (
                <React.Fragment>
                    <a onClick={this.updateStatus(record, ArticleStatus.PUBLISHED)}>发布</a>
                    <span className="ant-divider" />
                    <a onClick={this.updateStatus(record, ArticleStatus.DRAFT)}>驳回</a>
                    <span className="ant-divider" />
                </React.Fragment>
            ) : record.status === ArticleStatus.PUBLISHED ? (
                <React.Fragment>
                    <Popconfirm
                        title="确定要将这篇文章撤销发布吗？"
                        onConfirm={this.updateStatus(record, ArticleStatus.DRAFT)}
                    >
                        <a>撤销发布</a>
                    </Popconfirm>
                    <span className="ant-divider" />
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <Popconfirm
                        title="这是一篇草稿，其作者未请求发布它，确定要这样做吗？"
                        onConfirm={this.updateStatus(record, ArticleStatus.PUBLISHED)}
                    >
                        <a>发布</a>
                    </Popconfirm>
                    <span className="ant-divider" />
                </React.Fragment>
            )}
            <Popconfirm
                title="确定要删除这篇文章吗？"
                onConfirm={this.deleteArticle(record)}
                okType="danger"
            >
                <a>删除</a>
            </Popconfirm>
        </React.Fragment>
    );

    async componentDidMount() {
        await this.getArticles();

        this.setState({
            ...this.state,
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
                <Column title="标题" dataIndex="title" />
                <Column title="状态" key="status" render={this.renderStatusColumn} />
                <Column title="作者" key="author" render={this.renderAuthorColumn} />
                <Column title="操作" key="action" render={this.renderActionColumn} />
            </Table>
        );
    }
}
