export class CommentCreate {
    constructor(
        public postId: number,
        public content: string,
        public parentCommentId?: number
    ) {}
}
