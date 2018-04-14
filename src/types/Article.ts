import { User } from './User';

export interface Article {
    id: string;
    title: string;
    author: User;
    tags: Array<string>;
    publishedAt: Date;
    content: string;
}
