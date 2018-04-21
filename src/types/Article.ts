import { nullUser, User } from './User';

export enum ArticleStatus {
    DRAFT = 'DRAFT',
    PENDING = 'PENDING',
    PUBLISHED = 'PUBLISHED'
}

export interface Article {
    id: string;
    title: string;
    author: User;
    tags: Array<string>;
    content: string;
    status: ArticleStatus;
    publishedAt: Date;
}

export const nullArticle: Article = {
    id: '',
    title: '',
    author: nullUser,
    tags: [],
    status: ArticleStatus.DRAFT,
    publishedAt: new Date(),
    content: ''
};
