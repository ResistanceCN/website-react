import './Home.scss';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { Button, Card, Layout, Pagination, Tag } from 'antd';
import { Article } from '../types';
import WithSidebar from './WithSidebar';
import renderMarkdown from '../libs/markdown';
import gql from 'graphql-tag';
import { client as apollo } from '../apollo';

interface HomeRouterProps {
    page: string;
}

interface HomeProps extends RouteComponentProps<HomeRouterProps> {}

interface HomeState {
    articles: Array<Article>;
    totalPages: number;
}

export default class Home extends React.Component<HomeProps, HomeState> {
    state = {
        articles: [],
        totalPages: 1
    };

    getPage(props?: HomeProps): number {
        const p = props || this.props;
        return parseInt(p.match.params.page || '1', 10);
    }

    async getArticles() {
        const page = this.getPage();

        let response = await apollo.query<{ latestArticles: Array<Article> }>({
            query: gql`
                query {
                    latestArticles(count: 15) {
                        id
                        title
                        author { id }
                        tags
                        content
                        publishedAt
                    }
                }
            `
        });

        this.setState({
            ...this.state,
            articles: response.data.latestArticles.map(article => ({
                ...article,
                // Shows summaries only
                content: article.content.split(/<!-- *more *-->/i)[0],
                // The API returns time in string
                publishedAt: new Date(article.publishedAt)
            }))
        });
    }

    componentDidMount() {
        this.getArticles();

        apollo.query<{ articleCount: number }>({
            query: gql`
                query { articleCount }
            `
        }).then(response => {
            this.setState({
                ...this.state,
                totalPages: Math.ceil(response.data.articleCount / 15)
            });
        });
    }

    componentDidUpdate(prevProps: HomeProps, prevState: HomeState) {
        if (this.getPage() !== this.getPage(prevProps)) {
            this.getArticles();
        }
    }

    render() {
        return (
            <div className="flex-spacer">
                <div className="banner">
                    <div className="container">
                        <div className="banner-head">
                            Hello World!
                        </div>
                        <div className="banner-content">
                            <p className="welcome">Welecome to Resistance. It's time to move!</p>
                            <p>[测试文字] 使用 Ant Motion 能够快速在 React 框架中使用动画。</p>
                            <p>我们提供了单项，组合动画，以及整套解决方案</p>
                        </div>
                        <div className="banner-button">
                            <Link to="/join"><Button ghost>加入我们</Button></Link>
                            <Button ghost>查看教程</Button>
                        </div>
                    </div>
                </div>

                <div className="container main">
                    <WithSidebar className="news">
                        {this.state.articles ? this.state.articles.map((article: Article) => {
                            return (
                                <Card
                                    key={article.id}
                                    title={<Link to={'/article/' + article.id}>{article.title}</Link>}
                                    bordered={false}
                                    className="article-card"
                                >
                                    <div
                                        className="markdown-body"
                                        dangerouslySetInnerHTML={{
                                            __html: renderMarkdown(article.content)
                                        }}
                                    />

                                    {article.tags.length > 0 ? (
                                        <div className="article-footer">
                                            {article.tags.map((tag, i) => <Tag key={i}>{tag}</Tag>)}
                                        </div>
                                    ) : ''}
                                </Card>
                            );
                        }) : ''}
                    </WithSidebar>
                </div>

                <Layout.Content className="container pagination">
                    {this.state.totalPages > 1 ? (
                        <Pagination
                            current={this.getPage()}
                            total={this.state.totalPages}
                            showQuickJumper={this.state.totalPages > 3}
                        />
                    ) : ''}
                </Layout.Content>
            </div>
        );
    }
}
