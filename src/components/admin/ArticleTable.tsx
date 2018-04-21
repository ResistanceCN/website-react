import React from 'react';
import { message, Popconfirm, Table } from 'antd';
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

interface ArticleTableProps {
    getArticles(): Promise<Array<Article>>;
}

interface ArticleTableState {
    data: Array<Article>;
    loading: boolean;
    ready: boolean;
}

export default class ArticleTable extends React.Component<ArticleTableProps, ArticleTableState> {
    state = {
        data: [],
        loading: true,
        ready: false
    };

    async getArticles() {
        this.setState({
            ...this.state,
            loading: true
        });

        const articles = await this.props.getArticles();

        this.setState({
            ...this.state,
            data: articles,
            loading: false
        });
    }

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

    async updateStatus(article: Article, status: ArticleStatus) {
        await this.mutate({
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
    }

    async deleteArticle(article: Article) {
        await this.mutate({
            mutation: gql`
                mutation($id: ID!) {
                    deleteArticle(id: $id)
                }
            `,
            variables: {
                id: article.id
            }
        });
    }

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
            <Table dataSource={this.state.data} rowKey="id" loading={this.state.loading}>
                <Column title="标题" dataIndex="title" />
                <Column title="状态" key="status" render={(text, record: Article) => statusText[record.status]} />
                <Column title="作者" key="author" render={(text, record: Article) => record.author.name} />
                <Column
                    title="操作"
                    key="action"
                    render={(text, record: Article) => (
                        <React.Fragment>
                            {record.status === ArticleStatus.PENDING ? (
                                <React.Fragment>
                                    <a onClick={() => this.updateStatus(record, ArticleStatus.PUBLISHED)}>发布</a>
                                    <span className="ant-divider" />
                                    <a onClick={() => this.updateStatus(record, ArticleStatus.DRAFT)}>驳回</a>
                                    <span className="ant-divider" />
                                </React.Fragment>
                            ) : record.status === ArticleStatus.PUBLISHED ? (
                                <React.Fragment>
                                    <a onClick={() => this.updateStatus(record, ArticleStatus.DRAFT)}>撤销发布</a>
                                    <span className="ant-divider" />
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    <Popconfirm
                                        title="这是一篇草稿，其作者未请求发布它，确定要这样做吗？"
                                        onConfirm={() => this.updateStatus(record, ArticleStatus.PUBLISHED)}
                                    >
                                        <a>发布</a>
                                    </Popconfirm>
                                    <span className="ant-divider" />
                                </React.Fragment>
                            )}
                            <Popconfirm
                                title="确定要删除这篇文章吗？"
                                onConfirm={() => this.deleteArticle(record)}
                                okType="danger"
                            >
                                <a>删除</a>
                            </Popconfirm>
                        </React.Fragment>
                    )}
                />
            </Table>
        );
    }
}
