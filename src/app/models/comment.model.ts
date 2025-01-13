export class Comment {
    constructor(
        public id: number,
        public userId: number,
        public username: string,
        public content: string,
        public createdAt: Date,
        public postId: number,
        public parentCommentId?: number
    ) {}
}