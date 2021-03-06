import './Profile.scss';
import React from 'react';
import { Redirect, RouteComponentProps, withRouter } from 'react-router';
import { Article, User } from '@/types';
import { Card, Icon, Pagination, Tag } from 'antd';
import { Link } from 'react-router-dom';
import Loading from './parts/Loading';
import WithSidebar from './parts/WithSidebar';
import ProfileSidebar from './parts/ProfileSidebar';
import ArticleTools from './parts/ArticleTools';
import { connect, Dispatch } from 'react-redux';
import { State } from '@/reducers';
import gql from 'graphql-tag';
import { resizeGoogleAvatar } from '@/libs/utils';
import { client as apollo } from '@/apollo';
import renderMarkdown from '@/libs/markdown';

enum ProfileStatus {
    Loading,
    OK,
    NotFound
}

interface ProfileRouterProps {
    id: string;
}

interface ProfileProps extends RouteComponentProps<ProfileRouterProps> {
    user: User | null;
}

interface ProfileState {
    status: ProfileStatus;
    user: User | null;
    articles: Array<Article>;
}

class Profile extends React.Component<ProfileProps, ProfileState> {
    state = {
        status: ProfileStatus.Loading,
        user: null,
        articles: []
    };

    componentWillMount() {
        const id = this.props.match.params.id;
        apollo.query<{ user: User & { articles: Array<Article> } }>({
            query: gql`
                query($id: ID!) {
                    user: userById(id: $id) {
                        id
                        name
                        avatar
                        articles {
                            id
                            title
                            tags
                            content
                            publishedAt
                        }
                    }
                }
            `,
            variables: { id }
        }).then(result => {
            const user = result.data.user;
            const articles = user.articles;
            // Look up user from state or perform AJAX request here

            this.setState({
                status: ProfileStatus.OK,
                user,
                articles: articles.map(article => ({
                    ...article,
                    // Shows summaries only
                    content: article.content.split(/<!-- *more *-->/i)[0],
                    // The API returns time in string
                    publishedAt: new Date(article.publishedAt)
                }))
            });
        }).catch(error => {
            this.setState({
                status: ProfileStatus.NotFound
            });
        });
    }

    render() {
        switch (this.state.status) {
            case ProfileStatus.NotFound:
                return <Redirect to="/" />;
            case ProfileStatus.Loading:
                return <Loading />;
            default:
                break;
        }

        const user: User = this.state.user!;
        const isMyself = this.props.user !== null && user.id === this.props.user.id;

        return (
            <div className="flex-spacer">
                <div className="banner profile-banner">
                    <div className="banner-avatar">
                        {user.avatar ? (
                            <img className="avatar" src={resizeGoogleAvatar(user.avatar, 128)} />
                        ) : (
                            <div className="avatar icon-avatar">
                                <Icon type="user" />
                            </div>
                        )}
                    </div>
                    <div className="banner-content">
                        <p className="username">{user.name}</p>
                        <div className="bio">
                            <p>[个人 bio 测试] 使用 Ant Motion 能够快速在 React 框架中使用动画。</p>
                            <p>我们提供了单项，组合动画，以及整套解决方案</p>
                        </div>
                    </div>
                </div>

                <div className="container main">
                    <WithSidebar className="profile" sidebar={<ProfileSidebar />}>
                        {this.state.articles.map((article: Article) => {
                            const prefix = article.publishedAt.getTime() === 0 ? '[草稿] ' : '';
                            return (
                                <Card
                                    key={article.id}
                                    title={<Link to={'/article/' + article.id}>{prefix + article.title}</Link>}
                                    bordered={false}
                                    className="article-card"
                                >
                                    <div
                                        className="markdown-body"
                                        dangerouslySetInnerHTML={{
                                            __html: renderMarkdown(article.content)
                                        }}
                                    />
                                    <div className="article-footer">
                                        <div>{article.tags.map((tag, i) => <Tag key={i}>{tag}</Tag>)}</div>
                                        <div className="flex-spacer" />
                                        <ArticleTools id={article.id} manageMode={isMyself} />
                                    </div>
                                </Card>
                            );
                        })}
                    </WithSidebar>
                </div>

                <div className="container pagination">
                    <Pagination defaultCurrent={1} total={50} showQuickJumper />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: State) => ({
    user: state.auth.user
});

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Profile));
