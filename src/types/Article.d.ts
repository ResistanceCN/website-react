export default interface Article {
    id: number,
    title: string,
    author: number,
    tag: Array<string>,
    date: Date,
    content: string
}
