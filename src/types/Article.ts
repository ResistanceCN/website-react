import { User } from './User';

export interface Article {
    id: number;
    title: string;
    author: User;
    tags: Array<string>;
    publishedAt: Date;
    content: string;
}
