import React from 'react';
import { message, Popconfirm, Table } from 'antd';
import { Article, ArticleStatus } from '../../types';
import gql from 'graphql-tag';
import Loading from '../Loading';
import { adminClient as apollo } from '../../apollo';
import { errorText } from '../../libs/utils';

const { Column } = Table;

const status = {
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

    async deleteArticle(article: Article) {
        this.setState({
            ...this.state,
            loading: true
        });

        try {
            await apollo.mutate({
                mutation: gql`
                    mutation($id: ID!) {
                        deleteArticle(id: $id)
                    }
                `,
                variables: {
                    id: article.id
                }
            });
        } catch (e) {
            message.error(errorText(e));
            return;
        }

        await this.getArticles();
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
                <Column title="状态" key="status" render={(text, record: Article) => status[record.status]} />
                <Column title="作者" key="author" render={(text, record: Article) => record.author.name} />
                <Column
                    title="操作"
                    key="action"
                    render={(text, record: Article) => {
                        return (
                            <div>
                                {record.status === ArticleStatus.PENDING ? (
                                    <span>
                                        <a href="javascript:">发布</a>
                                        <span className="ant-divider" />
                                        <a href="javascript:">驳回</a>
                                        <span className="ant-divider" />
                                    </span>
                                ) : record.status === ArticleStatus.PUBLISHED && (
                                    <span>
                                        <a href="javascript:">撤销发布</a>
                                        <span className="ant-divider" />
                                    </span>
                                )}
                                <Popconfirm
                                    title="确定要删除这篇文章吗？"
                                    onConfirm={() => this.deleteArticle(record)}
                                    okType="danger"
                                >
                                    <a href="javascript:">删除</a>
                                </Popconfirm>
                            </div>
                        );
                    }}
                />
            </Table>
        );
    }
}
