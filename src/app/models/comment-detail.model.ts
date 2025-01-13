export class CommentDetail {
    constructor(
        public id: number,
        public userId: number,
        public username: string,
        public content: string,
        public createdAt: string
    ) {}
}