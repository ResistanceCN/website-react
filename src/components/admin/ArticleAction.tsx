import React from 'react';
import { Popconfirm } from 'antd';
import { Article, ArticleStatus } from '../../types';
import { unreachable } from '../../libs/utils';
import { Link } from 'react-router-dom';

interface ArticleActionProps {
    record: Article;
    updateStatus(record: Article, status: ArticleStatus): Promise<void>;
    deleteArticle(record: Article): Promise<void>;
}

export default class ArticleAction extends React.PureComponent<ArticleActionProps> {
    publishArticle = () => this.props.updateStatus(this.props.record, ArticleStatus.PUBLISHED);
    rejectArticle = () => this.props.updateStatus(this.props.record, ArticleStatus.DRAFT);
    deleteArticle = () => this.props.deleteArticle(this.props.record);

    renderPendingActions = () => (
        <React.Fragment>
            <a onClick={this.publishArticle}>发布</a>
            <span className="ant-divider" />
            <a onClick={this.rejectArticle}>驳回</a>
        </React.Fragment>
    );

    renderPublishedActions = () => (
        <Popconfirm
            title="确定要将这篇文章撤销发布吗？"
            onConfirm={this.rejectArticle}
        >
            <a>撤销发布</a>
        </Popconfirm>
    );

    renderDraftActions = () => (
        <Popconfirm
            title="这是一篇草稿，其作者未请求发布它，确定要这样做吗？"
            onConfirm={this.publishArticle}
        >
            <a>发布</a>
        </Popconfirm>
    );

    renderConditionalActions = () => {
        switch (this.props.record.status) {
            case ArticleStatus.PENDING:
                return this.renderPendingActions();
            case ArticleStatus.PUBLISHED:
                return this.renderPublishedActions();
            case ArticleStatus.DRAFT:
                return this.renderDraftActions();
            default:
                return unreachable();
        }
    };

    render() {
        return (
            <React.Fragment>
                <Link to={'/admin/previewArticle/' + this.props.record.id}>预览</Link>
                <span className="ant-divider" />

                {this.renderConditionalActions()}

                <span className="ant-divider" />
                <Popconfirm
                    title="确定要删除这篇文章吗？"
                    onConfirm={this.deleteArticle}
                    okType="danger"
                >
                    <a>删除</a>
                </Popconfirm>
            </React.Fragment>
        );
    }
}
